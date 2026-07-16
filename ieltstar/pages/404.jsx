import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function Custom404() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", bgcolor: "#0d1b3e", color: "#fff" }}>
      <Typography variant="h1" fontWeight={900} sx={{ fontSize: 120 }}>404</Typography>
      <Typography variant="h5" sx={{ mb: 3, opacity: 0.7 }}>Page not found</Typography>
      <Link href="/login" passHref>
        <Button variant="outlined" sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.5)" }}>
          Back to Login
        </Button>
      </Link>
    </Box>
  );
}
