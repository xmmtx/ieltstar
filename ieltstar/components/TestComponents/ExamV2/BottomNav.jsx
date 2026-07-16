import { useState } from "react";
import { Box, Button, Typography, Chip, Popper, Paper } from "@mui/material";
import { ChevronLeft, ChevronRight, GridView } from "@mui/icons-material";

const BottomNav = ({
  sections = [],
  activeSection = 0,
  onSectionChange,
  onPrev,
  onNext,
  questions = [],
  answers = {},
}) => {
  const [showGrid, setShowGrid] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const answeredCount = questions.filter((q) => answers[q._id]).length;
  const total = questions.length;

  return (
    <>
      <Box
        sx={{
          position: "fixed", bottom: 0, left: 0, right: 0, height: 44,
          bgcolor: "#0d1b3e", color: "#fff", display: "flex",
          alignItems: "center", justifyContent: "space-between", px: 2, zIndex: 1100,
        }}
      >
        <Button size="small" startIcon={<ChevronLeft />} onClick={onPrev}
          disabled={activeSection === 0}
          sx={{ color: "#fff", textTransform: "none", opacity: activeSection === 0 ? 0.4 : 1 }}>
          Prev
        </Button>

        <Box display="flex" alignItems="center" gap={1}>
          {sections.map((sec, idx) => (
            <Box key={idx} onClick={() => onSectionChange(idx)}
              sx={{ cursor: "pointer", px: 2, py: 0.5, borderRadius: 1,
                bgcolor: idx === activeSection ? "rgba(255,255,255,0.2)" : "transparent",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" }, display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: idx === activeSection ? 700 : 400 }}>{sec.label}</Typography>
            </Box>
          ))}

          {/* Question grid toggle */}
          {total > 0 && (
            <Chip icon={<GridView sx={{ color: "#fff !important", fontSize: 14 }} />}
              label={`${answeredCount}/${total}`}
              size="small" variant="outlined"
              onClick={(e) => { setAnchorEl(e.currentTarget); setShowGrid((v) => !v); }}
              sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)", ml: 1, cursor: "pointer" }} />
          )}
        </Box>

        <Button size="small" endIcon={<ChevronRight />} onClick={onNext}
          disabled={activeSection === sections.length - 1}
          sx={{ color: "#fff", textTransform: "none", opacity: activeSection === sections.length - 1 ? 0.4 : 1 }}>
          Next
        </Button>
      </Box>

      {/* Question grid popup */}
      <Popper open={showGrid} anchorEl={anchorEl} placement="top" sx={{ zIndex: 1200 }}>
        <Paper sx={{ p: 2, mb: 1, maxWidth: 320, bgcolor: "#1a237e", color: "#fff" }}>
          <Typography variant="caption" sx={{ mb: 1, display: "block", opacity: 0.7 }}>
            Question Palette ({answeredCount}/{total} answered)
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {questions.map((q, i) => {
              const isAnswered = !!answers[q._id];
              return (
                <Box key={q._id || i}
                  sx={{
                    width: 32, height: 32, borderRadius: 1, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    bgcolor: isAnswered ? "#4caf50" : "rgba(255,255,255,0.15)",
                    color: "#fff", fontSize: 12, fontWeight: 600, cursor: "default",
                  }}>
                  {i + 1}
                </Box>
              );
            })}
          </Box>
        </Paper>
      </Popper>
    </>
  );
};

export default BottomNav;
