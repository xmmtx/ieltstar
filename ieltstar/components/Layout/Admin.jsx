import Box from "@mui/material/Box";
import DefaultTopbar from "../Navigation/DefaultTopbar";
import AdminDrawer from "../Navigation/AdminDrawer";
import { useState, useEffect } from "react";
import DrawerHeader from "../Navigation/DrawerHeader";
import Head from "next/head";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";

// Admin Layout - supports both Auth0 and simple login
export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  // Try Auth0 first, fallback to localStorage
  const auth0User = useUser().user;
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (auth0User) {
      setUser(auth0User);
    } else {
      // Fallback: check simple login
      try {
        const stored = localStorage.getItem("ieltstar_user");
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
        }
      } catch {}
    }
  }, [auth0User]);

  useEffect(() => {
    if (user) {
      if (user.email !== "admin@gmail.com") {
        router.push("/test-exam");
      }
    }
  }, [user]);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  return (
    <>
      <Head>
        <title>IELTSTAR - Admin</title>
        <link rel="icon" type="image/x-icon" href="/favicon.png"></link>
      </Head>
      <Box sx={{ display: "flex" }}>
        <DefaultTopbar open={open} handleDrawerOpen={handleDrawerOpen} />
        <AdminDrawer open={open} handleDrawerClose={handleDrawerClose} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          {children}
        </Box>
      </Box>
    </>
  );
}
