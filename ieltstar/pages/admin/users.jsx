import { useEffect, useState } from "react";
import Admin from "../../components/Layout/Admin";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Chip, Select, MenuItem, FormControl, InputLabel, Typography, Box, Switch, Alert, TextField, Divider,
} from "@mui/material";
import { Add, Edit, Delete, Shield, Refresh, Settings } from "@mui/icons-material";
import { getApiUrl } from "../../utils/api";
import { useI18n } from "../../utils/i18n";

const API = getApiUrl();

export default function AdminUsers() {
  const { t } = useI18n();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [settings, setSettings] = useState({
    forceEmailVerification: false,
    randomQuestionMode: false,
    smtp: { host: "", port: "587", user: "", pass: "", from: "noreply@ieltstar.com" },
    sessionTimeoutMinutes: 60,
  });
  const [editOpen, setEditOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editRole, setEditRole] = useState("");
  const [snack, setSnack] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("ieltstar_token") : "";

  const fetchUsers = async () => {
    const res = await fetch(`${API}/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
    setUsers(await res.json());
  };
  const fetchRoles = async () => {
    const res = await fetch(`${API}/admin/roles`, { headers: { Authorization: `Bearer ${token}` } });
    setRoles(await res.json());
  };
  const fetchSettings = async () => {
    const res = await fetch(`${API}/admin/settings`, { headers: { Authorization: `Bearer ${token}` } });
    setSettings(await res.json());
  };

  useEffect(() => { fetchUsers(); fetchRoles(); fetchSettings(); }, []);

  const openEdit = (user) => {
    setSelectedUser(user);
    setEditRole(user.role?._id || "");
    setEditOpen(true);
  };

  const saveEdit = async () => {
    await fetch(`${API}/admin/users/${selectedUser._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role: editRole }),
    });
    setEditOpen(false);
    setSnack("User updated");
    fetchUsers();
  };

  const toggleActive = async (user) => {
    await fetch(`${API}/admin/users/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ isActive: !user.isActive }),
    });
    setSnack(user.isActive ? "User disabled" : "User activated");
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    await fetch(`${API}/admin/users/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setSnack("User deleted");
    fetchUsers();
  };

  const saveSettings = async () => {
    await fetch(`${API}/admin/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(settings),
    });
    setSettingsOpen(false);
    setSnack("Settings saved");
  };

  return (
    <>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Typography variant="h5" sx={{ flex: 1, fontWeight: 700, color: "#1a237e" }}>
          {t("user_management")}
        </Typography>
        <Button startIcon={<Settings />} variant="outlined" onClick={() => setSettingsOpen(true)}>
          {t("settings")}
        </Button>
        <Button startIcon={<Refresh />} variant="outlined" onClick={fetchUsers}>{t("refresh")}</Button>
      </Box>

      {snack && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSnack("")}>{snack}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#0d1b3e" }}>
              {[t("name"), t("email"), t("verified"), t("roles"), t("status"), t("actions")].map((h) => (
                <TableCell key={h} sx={{ color: "#fff", fontWeight: 600 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u._id} hover>
                <TableCell>{u.fullName}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Chip label={u.emailVerifiedAt ? "Verified" : "Pending"} size="small"
                    color={u.emailVerifiedAt ? "success" : "warning"} />
                </TableCell>
                <TableCell>
                  <Chip label={u.role?.name || t("student")} size="small" icon={<Shield />}
                    sx={{ bgcolor: u.role?.name === "admin" ? "#e3f2fd" : "#f5f5f5" }} />
                </TableCell>
                <TableCell>
                  <Chip label={u.isActive ? "Active" : "Disabled"} size="small"
                    color={u.isActive ? "success" : "error"} />
                </TableCell>
                <TableCell>
                  <Button size="small" startIcon={<Edit />} onClick={() => openEdit(u)}>{t("edit")}</Button>
                  <Button size="small" color="warning" onClick={() => toggleActive(u)}>
                    {u.isActive ? t("disable") : t("enable")}
                  </Button>
                  <Button size="small" color="error" startIcon={<Delete />} onClick={() => deleteUser(u._id)}
                    disabled={u.email === "admin@gmail.com"}>{t("delete")}</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit roles dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t("edit")} {t("roles")} — {selectedUser?.fullName}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>{t("roles")}</InputLabel>
            <Select value={editRole} onChange={(e) => setEditRole(e.target.value)}>
              {roles.map((r) => (
                <MenuItem key={r._id} value={r._id}>
                  <Shield sx={{ mr: 1, fontSize: 18 }} />
                  {r.name} — {r.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>{t("cancel")}</Button>
          <Button variant="contained" onClick={saveEdit}>{t("save")}</Button>
        </DialogActions>
      </Dialog>

      {/* Settings dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>System Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>Security</Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Box>
                <Typography fontWeight={600}>Force Email Verification</Typography>
                <Typography variant="body2" color="text.secondary">Users must verify email before accessing exams</Typography>
              </Box>
              <Switch checked={settings.forceEmailVerification}
                onChange={(e) => setSettings({ ...settings, forceEmailVerification: e.target.checked })} />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Box>
                <Typography fontWeight={600}>Random Question Mode</Typography>
                <Typography variant="body2" color="text.secondary">Randomly select questions from bank instead of fixed test</Typography>
              </Box>
              <Switch checked={settings.randomQuestionMode}
                onChange={(e) => setSettings({ ...settings, randomQuestionMode: e.target.checked })} />
            </Box>

            <TextField fullWidth label="Session Timeout (minutes)" type="number"
              value={settings.sessionTimeoutMinutes}
              onChange={(e) => setSettings({ ...settings, sessionTimeoutMinutes: parseInt(e.target.value) || 60 })}
              sx={{ mt: 2 }} />

            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>SMTP Email</Typography>
            <TextField fullWidth label="SMTP Host" size="small"
              value={settings.smtp?.host || ""}
              onChange={(e) => setSettings({ ...settings, smtp: { ...settings.smtp, host: e.target.value } })}
              placeholder="smtp.gmail.com" sx={{ mb: 1.5 }} />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField label="Port" size="small" type="number"
                value={settings.smtp?.port || "587"}
                onChange={(e) => setSettings({ ...settings, smtp: { ...settings.smtp, port: e.target.value } })} />
              <TextField label="Username" size="small" fullWidth
                value={settings.smtp?.user || ""}
                onChange={(e) => setSettings({ ...settings, smtp: { ...settings.smtp, user: e.target.value } })} />
            </Box>
            <Box sx={{ display: "flex", gap: 2, mt: 1.5 }}>
              <TextField label="Password" size="small" type="password" fullWidth
                value={settings.smtp?.pass || ""}
                onChange={(e) => setSettings({ ...settings, smtp: { ...settings.smtp, pass: e.target.value } })} />
              <TextField label="From Address" size="small" fullWidth
                value={settings.smtp?.from || ""}
                onChange={(e) => setSettings({ ...settings, smtp: { ...settings.smtp, from: e.target.value } })} />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveSettings}>Save Settings</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

AdminUsers.getLayout = (page) => <Admin>{page}</Admin>;
