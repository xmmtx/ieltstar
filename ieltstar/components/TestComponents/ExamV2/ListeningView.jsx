import { useState } from "react";
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

// ============ Question Card (same as ReadingView) ============
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
          {question.options && question.options.length > 0 ? (
            <FormControl component="fieldset" fullWidth>
              <RadioGroup value={val} onChange={(e) => onAnswer && onAnswer(question._id, e.target.value)}>
                {question.options.map((opt, oi) => (
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
          ) : (
            <TextField fullWidth size="small" variant="outlined" placeholder="Type your answer..." value={val} onChange={(e) => onAnswer && onAnswer(question._id, e.target.value)} />
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

// ============ ListeningView - single column, matching official UI ============
const ListeningView = ({ test, answers = {}, onAnswer }) => {
  if (!test || Object.keys(test).length === 0) {
    return <Box sx={{ p: 4, textAlign: "center", color: "#333" }}>Loading...</Box>;
  }

  const questions = test.questions || [];
  const audioSource = test.source || "";

  return (
    <Box sx={{ height: "100%", overflowY: "auto", bgcolor: "#fff", px: { xs: 2, md: 6 }, py: 3 }}>
      {audioSource && (
        <Box sx={{ mb: 3, maxWidth: 500, mx: "auto" }}>
          <audio controls style={{ width: "100%" }} src={audioSource}>
            Your browser does not support the audio element.
          </audio>
        </Box>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#1a237e" }}>Part {test.section || "1"}</Typography>
        <Typography variant="body2" sx={{ color: "#555", mt: 0.5 }}>{test.instruction || "Listen and answer the questions."}</Typography>
        <Typography variant="caption" sx={{ color: "#888", mt: 0.5, display: "block" }}>You will hear the recording once only.</Typography>
      </Box>

      <Box sx={{ maxWidth: 700 }}>
        {questions.map((q, i) => (<QuestionCard key={q._id || i} question={q} index={i} answers={answers} onAnswer={onAnswer} />))}
      </Box>
    </Box>
  );
};

export default ListeningView;
