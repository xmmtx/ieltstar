import { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Paper, Alert, Tabs, Tab } from "@mui/material";
import { getApiUrl } from "../utils/api";

const BUILD_TIME = process.env.BUILD_TIME || "dev";

export default function Login() {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState("");

  useEffect(() => {
    setApiUrl(getApiUrl());
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Email and password required"); return; }
    setLoading(true); setError("");

    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem("ieltstar_token", data.token);
      localStorage.setItem("ieltstar_user", JSON.stringify(data.user));
      window.location.href = data.user.isAdmin ? "/admin/exam" : "/test-exam";
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !fullName) { setError("All fields required"); return; }
    setLoading(true); setError(""); setSuccess("");

    try {
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Registered! Check your email for verification (or use the demo: skip for now).");
      setTimeout(() => setTab(0), 2000);
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#0d1b3e" }}>
      <Paper sx={{ p: 5, maxWidth: 420, width: "100%", mx: 2 }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom sx={{ color: "#0d1b3e" }}>
          IELTSTAR
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" mb={2}>
          IELTS Computer-Based Mock Test
        </Typography>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
          <Tab label="Sign In" />
          <Tab label="Register" />
        </Tabs>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={tab === 0 ? handleLogin : handleRegister}>
          {tab === 1 && (
            <TextField fullWidth label="Full Name" value={fullName}
              onChange={(e) => setFullName(e.target.value)} sx={{ mb: 2 }} />
          )}
          <TextField fullWidth label="Email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} placeholder="student@school.edu" />
          <TextField fullWidth label="Password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} sx={{ mb: 2 }} placeholder="Min 6 characters" />

          <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}
            sx={{ bgcolor: "#0d1b3e", py: 1.5, "&:hover": { bgcolor: "#1a237e" } }}>
            {loading ? "Please wait..." : tab === 0 ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <Typography variant="caption" color="text.secondary" textAlign="center" display="block" mt={2}>
          Admin: admin@gmail.com / admin123
          <br />
          <a href="/reset-password" style={{ color: "#1a237e" }}>Forgot password?</a>
        </Typography>

        <Typography variant="caption" sx={{ color: "#aaa", textAlign: "center", display: "block", mt: 1 }}>
          build: {BUILD_TIME}
          {apiUrl && (
            <>
              <br />
              api: {apiUrl}
            </>
          )}
        </Typography>
      </Paper>
    </Box>
  );
}

Login.getLayout = (page) => page;
Login.skipAuth = true;
