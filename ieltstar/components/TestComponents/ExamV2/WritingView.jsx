import { Box, Typography, TextField, Divider } from "@mui/material";

// ============ WritingView ============
const WritingView = ({ test, answers = {}, onAnswer }) => {
  const writingKey = `writing_${test._id}`;
  const text = answers[writingKey] || "";
  const setText = (val) => onAnswer && onAnswer(writingKey, val);

  if (!test || Object.keys(test).length === 0) {
    return <Box sx={{ p: 4, textAlign: "center" }}>Loading...</Box>;
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const instruction = test.instruction || "You should spend about 20 minutes on this task.";
  const source = test.source || "";

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* LEFT: Task description + chart/image */}
      <Box
        sx={{
          flex: 1,
          borderRight: "1px solid #ddd",
          bgcolor: "#fafafa",
          overflowY: "auto",
          p: 3,
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: "#1a237e" }}>
          Part {test.section || "1"}
        </Typography>
        <Typography variant="body2" sx={{ color: "#555" }} gutterBottom>
          {instruction}
        </Typography>

        <Divider sx={{ my: 2, borderColor: "#ddd" }} />

        {/* Task content - can be HTML with images */}
        <Box
          sx={{
            fontSize: "15px",
            lineHeight: 1.8,
            color: "#333",
            "& img": { maxWidth: "100%", my: 2 },
            "& strong, & b": { fontWeight: 700 },
            "& em, & i": { fontStyle: "italic" },
          }}
          dangerouslySetInnerHTML={{
            __html: source?.replace(/\n\n/g, "<br/><br/>") || "<p>Task description loading...</p>",
          }}
        />

        {test.questions?.[0]?.title && (
          <Typography variant="body1" sx={{ mt: 2, fontWeight: 500 }}>
            {test.questions[0].title}
          </Typography>
        )}
      </Box>

      {/* RIGHT: Writing area */}
      <Box
        sx={{
          width: 480,
          display: "flex",
          flexDirection: "column",
          bgcolor: "#fff",
        }}
      >
        <Box sx={{ px: 3, py: 1.5, borderBottom: "1px solid #ddd" }}>
          <Typography variant="body2" fontWeight={600} sx={{ color: "#555" }}>
            Your answer
          </Typography>
        </Box>

        <TextField
          multiline
          fullWidth
          variant="outlined"
          placeholder="Start writing your answer here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              height: "100%",
              alignItems: "flex-start",
              fontFamily: "inherit",
              fontSize: "15px",
              lineHeight: 1.8,
            },
            "& .MuiInputBase-input": {
              color: "#333",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
        />

        {/* Word count */}
        <Box
          sx={{
            px: 3,
            py: 1,
            borderTop: "1px solid #ddd",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" sx={{ color: "#1a237e", fontWeight: 700, fontSize: "16px" }}>
            Word count: <strong style={{ color: "#e53935", fontSize: "18px" }}>{wordCount}</strong>
          </Typography>
          <Typography variant="caption" sx={{ color: "#888" }}>
            {test.section === 2 ? "Write at least 250 words" : "Write at least 150 words"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default WritingView;
