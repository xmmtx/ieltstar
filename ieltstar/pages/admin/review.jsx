import { useEffect, useState } from "react";
import Admin from "../../components/Layout/Admin";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Box, TextField, Chip, Alert,
} from "@mui/material";
import { Refresh, RateReview } from "@mui/icons-material";
import { getApiUrl } from "../../utils/api";
import { useI18n } from "../../utils/i18n";

export default function WritingReview() {
  const { t } = useI18n();
  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState("");
  const [snack, setSnack] = useState("");
  const token = typeof window !== "undefined" ? localStorage.getItem("ieltstar_token") : "";

  const fetchData = async () => {
    const res = await fetch(`${getApiUrl()}/review/writing`, { headers: { Authorization: `Bearer ${token}` } });
    setSubmissions(await res.json());
  };

  useEffect(() => { fetchData(); }, []);

  const submitScore = async () => {
    const num = parseFloat(score);
    if (isNaN(num) || num < 0 || num > 9) { setSnack("Score must be 0-9"); return; }
    await fetch(`${getApiUrl()}/review/writing/score`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ studentEmail: selected.studentEmail, testHistoryId: selected._id, score: num }),
    });
    setSelected(null); setScore(""); setSnack("Score saved!");
    fetchData();
  };

  return (
    <>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Typography variant="h5" sx={{ flex: 1, fontWeight: 700, color: "#1a237e" }}>
          {t("writing_review")}
        </Typography>
        <Button startIcon={<Refresh />} variant="outlined" onClick={fetchData}>{t("refresh")}</Button>
      </Box>

      {snack && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSnack("")}>{snack}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#0d1b3e" }}>
              {["Student", "Email", "Section", "Date", "Score", "Action"].map((h) => (
                <TableCell key={h} sx={{ color: "#fff", fontWeight: 600 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.map((s) => (
              <TableRow key={s._id} hover>
                <TableCell>{s.studentName}</TableCell>
                <TableCell>{s.studentEmail}</TableCell>
                <TableCell>Task {s.section}</TableCell>
                <TableCell>{new Date(s.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip label={s.score === -1 ? "Pending" : `Band ${s.score}`}
                    size="small" color={s.score === -1 ? "warning" : "success"} />
                </TableCell>
                <TableCell>
                  <Button size="small" startIcon={<RateReview />}
                    onClick={() => { setSelected(s); setScore(""); }}>
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="md" fullWidth>
        <DialogTitle>Review — {selected?.studentName}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Task {selected?.section} · {selected?.studentEmail} · {selected?.date ? new Date(selected.date).toLocaleString() : ""}
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, my: 2, maxHeight: 300, overflowY: "auto", bgcolor: "#fafafa", whiteSpace: "pre-wrap", fontSize: 14 }}>
            {selected?.writingText || "(No text available)"}
          </Paper>
          <TextField label="Band Score (0-9)" type="number" value={score}
            onChange={(e) => setScore(e.target.value)} inputProps={{ min: 0, max: 9, step: 0.5 }}
            fullWidth sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Cancel</Button>
          <Button variant="contained" onClick={submitScore}>Submit Score</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

WritingReview.getLayout = (page) => <Admin>{page}</Admin>;
