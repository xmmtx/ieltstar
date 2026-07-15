import { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Drawer,
  TextField,
  Box,
  Chip,
} from "@mui/material";
import {
  Wifi as WifiIcon,
  NotificationsNone as NotificationsIcon,
  Menu as MenuIcon,
  Edit as NotesIcon,
  FormatPaint as HighlighterIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

// ============ Timer ============
const ExamTimer = ({ durationMinutes = 60, onTimeUp }) => {
  const intervalRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onTimeUp && onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [durationMinutes]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <Typography
      variant="h6"
      sx={{
        fontWeight: 700,
        fontFamily: "monospace",
        color: timeLeft < 300 ? "#e53935" : "#1a237e",
        minWidth: 100,
        textAlign: "center",
      }}
    >
      {display}
    </Typography>
  );
};

// ============ Notes Panel ============
const NotesPanel = ({ open, onClose }) => {
  const [notes, setNotes] = useState("");
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 320, p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6">Notes</Typography>
          <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
        </Box>
        <TextField
          multiline
          fullWidth
          minRows={15}
          maxRows={25}
          placeholder="Type your notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          variant="outlined"
          sx={{ "& .MuiOutlinedInput-root": { fontFamily: "inherit" } }}
        />
      </Box>
    </Drawer>
  );
};

// ============ Confirm Finish Dialog ============
const ConfirmFinishDialog = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>End Test</DialogTitle>
    <DialogContent>
      <DialogContentText>
        You have selected to end this test. Click OK to continue or Cancel to return to the test.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">Cancel</Button>
      <Button onClick={onConfirm} color="error" variant="contained">OK</Button>
    </DialogActions>
  </Dialog>
);

// ============ Test Ended Modal ============
const TestEndedDialog = ({ open, onContinue }) => (
  <Dialog open={open} maxWidth="sm" fullWidth>
    <DialogTitle>Test ended</DialogTitle>
    <DialogContent>
      <DialogContentText>Your test has finished.</DialogContentText>
      <DialogContentText sx={{ mt: 1 }}>All of your answers have been stored.</DialogContentText>
      <DialogContentText sx={{ mt: 1 }}>Please wait for further instructions.</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onContinue} variant="contained" color="primary" fullWidth>
        Continue
      </Button>
    </DialogActions>
  </Dialog>
);

// ============ Main Export ============
const ExamTopBar = ({
  studentName = "Candidate",
  durationMinutes = 60,
  category = "Reading",
  highlightEnabled = false,
  onToggleHighlight,
  onFinishTest,
  onTimeUp,
}) => {
  const [notesOpen, setNotesOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [endedOpen, setEndedOpen] = useState(false);
  const [testFinished, setTestFinished] = useState(false);

  const handleFinishClick = () => setConfirmOpen(true);

  const handleConfirmFinish = () => {
    setConfirmOpen(false);
    setEndedOpen(true);
    setTestFinished(true);
    onFinishTest && onFinishTest();
  };

  const handleContinue = () => {
    setEndedOpen(false);
    // Navigate back or show results
  };

  return (
    <>
      <AppBar
        position="fixed"
        color="default"
        elevation={1}
        sx={{
          backgroundColor: "#0d1b3e",
          color: "#fff",
          zIndex: 1200,
        }}
      >
        <Toolbar variant="dense" sx={{ justifyContent: "space-between" }}>
          {/* Left: Student info */}
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {studentName}
            </Typography>
          </Box>

          {/* Center: Timer */}
          <Box display="flex" alignItems="center" gap={0.5}>
            <Typography variant="body2" sx={{ opacity: 0.7, mr: 0.5 }}>
              {category}
            </Typography>
            {!testFinished ? (
              <ExamTimer durationMinutes={durationMinutes} onTimeUp={handleConfirmFinish} />
            ) : (
              <Chip label="Finished" color="success" size="small" />
            )}
            <Typography variant="caption" sx={{ opacity: 0.5, ml: 1 }}>
              {durationMinutes} minutes
            </Typography>
          </Box>

          {/* Right: Toolbar */}
          <Box display="flex" alignItems="center" gap={0.5}>
            {onToggleHighlight && (
              <IconButton
                size="small"
                onClick={onToggleHighlight}
                sx={{
                  color: highlightEnabled ? "#ffeb3b" : "rgba(255,255,255,0.6)",
                  border: highlightEnabled ? "1px solid #ffeb3b" : "1px solid transparent",
                }}
                title="Toggle highlighter"
              >
                <HighlighterIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton size="small" sx={{ color: "rgba(255,255,255,0.6)" }} title="Connection">
              <WifiIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: "rgba(255,255,255,0.6)" }} title="Notifications">
              <NotificationsIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: "rgba(255,255,255,0.6)" }} title="Menu">
              <MenuIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setNotesOpen(true)}
              sx={{ color: "rgba(255,255,255,0.6)" }}
              title="Notes"
            >
              <NotesIcon fontSize="small" />
            </IconButton>
            <Button
              variant="outlined"
              size="small"
              onClick={handleFinishClick}
              disabled={testFinished}
              sx={{
                ml: 1,
                color: "#fff",
                borderColor: "rgba(255,255,255,0.4)",
                textTransform: "none",
                "&:hover": { borderColor: "#e53935", color: "#e53935" },
              }}
            >
              Finish test
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <NotesPanel open={notesOpen} onClose={() => setNotesOpen(false)} />
      <ConfirmFinishDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmFinish}
      />
      <TestEndedDialog open={endedOpen} onContinue={handleContinue} />
    </>
  );
};

export default ExamTopBar;
