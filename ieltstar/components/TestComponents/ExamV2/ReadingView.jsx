import { useState, useRef } from "react";
import {
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  Typography,
  Paper,
  Collapse,
  IconButton,
  Divider,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

// ============ Text Highlighter ============
const useHighlighter = (ref) => {
  const handleMouseUp = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0 || !ref.current) return;
    const root = ref.current;
    const range = sel.getRangeAt(0);
    if (!root.contains(range.commonAncestorContainer)) return;

    const textNodes = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (range.intersectsNode(node)) textNodes.push(node);
    }

    for (const node of textNodes) {
      const r = document.createRange();
      r.selectNodeContents(node);
      if (node === range.startContainer) r.setStart(node, range.startOffset);
      if (node === range.endContainer) r.setEnd(node, range.endOffset);
      if (r.collapsed) continue;
      if (node.parentElement?.tagName === "MARK") continue;
      const mark = document.createElement("mark");
      mark.style.cssText = "background:#ffeb3b;padding:0 1px;border-radius:2px;cursor:pointer;";
      try { r.surroundContents(mark); } catch {}
    }
    sel.removeAllRanges();
  };

  const handleClick = (e) => {
    if (e.target.tagName === "MARK") {
      const parent = e.target.parentNode;
      if (!parent) return;
      while (e.target.firstChild) parent.insertBefore(e.target.firstChild, e.target);
      parent.removeChild(e.target);
    }
  };

  return { onMouseUp: handleMouseUp, onClick: handleClick };
};

// ============ Question Card ============
const QuestionCard = ({ question, index, answers = {}, onAnswer }) => {
  const [expanded, setExpanded] = useState(true);
  const val = answers[question._id] || "";

  return (
    <Paper variant="outlined" sx={{ mb: 1.5, borderRadius: 1, overflow: "hidden", borderColor: "#ddd" }}>
      <Box onClick={() => setExpanded(!expanded)} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1, cursor: "pointer", bgcolor: val ? "#e8f5e9" : "#f0f0f0", "&:hover": { bgcolor: val ? "#c8e6c9" : "#e0e0e0" } }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1a237e" }}>{index + 1}. {question.title}</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {val && <Typography variant="caption" sx={{ color: "#2e7d32", fontWeight: 600 }}>✓</Typography>}
          <IconButton size="small">{expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}</IconButton>
        </Box>
      </Box>
      <Collapse in={expanded}>
        <Box sx={{ px: 2, py: 1.5, bgcolor: "#fff" }}>
          {(question.options || []).length === 0 ? (
            <TextField fullWidth size="small" variant="outlined" placeholder="Type your answer..." value={val} onChange={(e) => onAnswer && onAnswer(question._id, e.target.value)} />
          ) : (
            <FormControl component="fieldset" fullWidth>
              <RadioGroup value={val} onChange={(e) => onAnswer && onAnswer(question._id, e.target.value)}>
                {(question.options || []).map((opt, oi) => (
                  <FormControlLabel
                    key={oi}
                    value={opt}
                    control={<Radio size="small" />}
                    label={opt}
                    sx={{
                      py: 0.5,
                      color: "#333",
                      "& .MuiFormControlLabel-label": { color: "#333" },
                      "&:hover": { bgcolor: "#f5f5f5", borderRadius: 1 },
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

// ============ Paragraph Display ============
const ParagraphDisplay = ({ source, highlightEnabled }) => {
  const contentRef = useRef(null);
  const highlighter = useHighlighter(contentRef);

  return (
    <Box
      ref={contentRef}
      {...(highlightEnabled ? highlighter : {})}
      sx={{
        p: 3,
        height: "100%",
        overflowY: "auto",
        fontSize: "15px",
        lineHeight: 1.8,
        color: "#333",
        "& p": { my: 1.5 },
        "& strong, & b": { fontWeight: 700 },
        userSelect: highlightEnabled ? "text" : "auto",
        cursor: highlightEnabled ? "text" : "auto",
      }}
      dangerouslySetInnerHTML={{
        __html: source?.replace(/\n\n/g, "<br/><br/>") || "<p>Loading passage...</p>",
      }}
    />
  );
};

// ============ Main ReadingView ============
const ReadingView = ({ test, answers = {}, onAnswer }) => {
  const [highlightEnabled, setHighlightEnabled] = useState(false);

  if (!test || Object.keys(test).length === 0) {
    return <Box sx={{ p: 4, textAlign: "center" }}>Loading...</Box>;
  }

  const questions = test.questions || [];
  const source = test.source || "";

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%", // minus topbar
        overflow: "hidden",
      }}
    >
      {/* LEFT: Passage */}
      <Box
        sx={{
          flex: 1,
          borderRight: "1px solid #ddd",
          bgcolor: "#fafafa",
          overflow: "hidden",
        }}
      >
        <Box sx={{ px: 3, py: 1, borderBottom: "1px solid #ddd", bgcolor: "#fff" }}>
          <Typography variant="caption" sx={{ color: "#888" }}>
            {test.instruction || `Part ${test.section || "1"}`}
          </Typography>
        </Box>
        <ParagraphDisplay source={source} highlightEnabled={highlightEnabled} />
      </Box>

      {/* RIGHT: Questions */}
      <Box
        sx={{
          width: 420,
          display: "flex",
          flexDirection: "column",
          bgcolor: "#fff",
        }}
      >
        {/* Questions header */}
        <Box sx={{ px: 3, py: 1.5, borderBottom: "1px solid #ddd" }}>
          <Typography variant="body2" fontWeight={600} sx={{ color: "#555" }}>
            Questions {1} – {questions.length}
          </Typography>
          <Typography variant="caption" sx={{ color: "#888" }}>
            {test.instruction || "Choose the correct answer."}
          </Typography>
        </Box>

        {/* Scrollable questions list */}
        <Box sx={{ flex: 1, overflowY: "auto", px: 1.5, py: 1 }}>
          {questions.map((q, i) => (
            <QuestionCard key={q._id || i} question={q} index={i} answers={answers} onAnswer={onAnswer} />
          ))}
        </Box>

        {/* Bottom action: highlight toggle */}
        <Box sx={{ px: 2, py: 1, borderTop: "1px solid #ddd", display: "flex", gap: 1 }}>
          <Typography variant="caption" onClick={() => setHighlightEnabled(!highlightEnabled)}
            sx={{ cursor: "pointer", color: highlightEnabled ? "#f57f17" : "#888", fontWeight: highlightEnabled ? 600 : 400, textDecoration: "underline", userSelect: "none" }}>
            🖍 {highlightEnabled ? "Highlighter on" : "Highlighter"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ReadingView;
