import { Box, Button, Typography, Chip } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

const BottomNav = ({
  sections = [],
  activeSection = 0,
  onSectionChange,
  onPrev,
  onNext,
  answeredQuestions = {},
  totalQuestions = 0,
}) => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 44,
        bgcolor: "#0d1b3e",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        zIndex: 1100,
      }}
    >
      {/* Prev / Next buttons */}
      <Box display="flex" alignItems="center" gap={1}>
        <Button
          size="small"
          startIcon={<ChevronLeft />}
          onClick={onPrev}
          disabled={activeSection === 0}
          sx={{ color: "#fff", textTransform: "none", opacity: activeSection === 0 ? 0.4 : 1 }}
        >
          Prev
        </Button>
      </Box>

      {/* Section tabs */}
      <Box display="flex" alignItems="center" gap={1}>
        {sections.map((sec, idx) => (
          <Box
            key={idx}
            onClick={() => onSectionChange(idx)}
            sx={{
              cursor: "pointer",
              px: 2,
              py: 0.5,
              borderRadius: 1,
              bgcolor: idx === activeSection ? "rgba(255,255,255,0.2)" : "transparent",
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: idx === activeSection ? 700 : 400 }}>
              {sec.label}
            </Typography>
            {sec.count !== undefined && (
              <Chip
                label={`${sec.count}`}
                size="small"
                sx={{
                  height: 18,
                  minWidth: 18,
                  fontSize: 10,
                  bgcolor: "rgba(255,255,255,0.3)",
                  color: "#fff",
                }}
              />
            )}
          </Box>
        ))}
      </Box>

      {/* Next button */}
      <Box display="flex" alignItems="center" gap={1}>
        <Button
          size="small"
          endIcon={<ChevronRight />}
          onClick={onNext}
          disabled={activeSection === sections.length - 1}
          sx={{ color: "#fff", textTransform: "none", opacity: activeSection === sections.length - 1 ? 0.4 : 1 }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default BottomNav;
