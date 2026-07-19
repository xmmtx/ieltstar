import { useState } from "react";
import { Box, TextField, Button, Typography, Paper, Alert } from "@mui/material";
import { getApiUrl } from "../../utils/api";

const API = getApiUrl();

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMsg("");
    try {
      const res = await fetch(`${API}/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) setMsg("If the email exists, a reset link has been sent.");
      else setError(data.error);
    } catch { setError("Network error"); }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#0d1b3e" }}>
      <Paper sx={{ p: 5, maxWidth: 400, width: "100%", mx: 2 }}>
        <Typography variant="h5" fontWeight={700} textAlign="center" gutterBottom sx={{ color: "#1a237e" }}>
          Reset Password
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
          Enter your email to receive a reset link.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} />
          <Button type="submit" variant="contained" fullWidth size="large"
            sx={{ bgcolor: "#0d1b3e", py: 1.5 }}>
            Send Reset Link
          </Button>
        </form>
        <Typography variant="caption" textAlign="center" display="block" mt={2}>
          <a href="/login" style={{ color: "#1a237e" }}>Back to Login</a>
        </Typography>
      </Paper>
    </Box>
  );
}

ResetPassword.getLayout = (page) => page;
ResetPassword.skipAuth = true;
