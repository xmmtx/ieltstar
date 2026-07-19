import Box from "@mui/material/Box";
import DefaultTopbar from "../Navigation/DefaultTopbar";
import AdminDrawer from "../Navigation/AdminDrawer";
import { useState, useEffect } from "react";
import DrawerHeader from "../Navigation/DrawerHeader";
import Head from "next/head";
import { useRouter } from "next/router";
import { useI18n } from "../../utils/i18n";

// Unified Dashboard Layout — role-based sidebar
export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { t } = useI18n();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ieltstar_user");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const pageTitle = user?.role === "student"
    ? `IELTSTAR - ${t("student_dashboard")}`
    : user?.role === "teacher"
      ? `IELTSTAR - ${t("teacher_dashboard")}`
      : `IELTSTAR - ${t("admin_dashboard")}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" type="image/x-icon" href="/favicon.png" />
      </Head>
      <Box sx={{ display: "flex" }}>
        <DefaultTopbar open={open} handleDrawerOpen={handleDrawerOpen} />
        <AdminDrawer open={open} handleDrawerClose={handleDrawerClose} user={user} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          {children}
        </Box>
      </Box>
    </>
  );
}
