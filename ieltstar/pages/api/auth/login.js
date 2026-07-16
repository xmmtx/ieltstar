// Simple login API - no Auth0 required
// POST { email, name? } → sets cookie → redirect
import { serialize } from "cookie";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, name } = req.body || {};
  if (!email) return res.status(400).json({ error: "Email required" });

  // Simple session cookie (for school use; not cryptographically secure)
  const session = Buffer.from(JSON.stringify({
    email,
    name: name || email.split("@")[0],
    picture: "/avatars/avatar_default.jpg",
    loginAt: Date.now(),
  })).toString("base64");

  res.setHeader("Set-Cookie", serialize("ieltstar_session", session, {
    httpOnly: false,
    path: "/",
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
  }));

  res.status(200).json({ ok: true, email });
}
