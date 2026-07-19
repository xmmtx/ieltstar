import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DrawerHeader from "./DrawerHeader";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PeopleIcon from "@mui/icons-material/People";
import RateReviewIcon from "@mui/icons-material/RateReview";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArchiveIcon from "@mui/icons-material/Archive";
import Link from "next/link";
import { useState } from "react";
import { useI18n } from "../../utils/i18n";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const AdminDrawer = ({ open, handleDrawerClose, user }) => {
  const [selected, setSelected] = useState("exam");
  const theme = useTheme();
  const { t } = useI18n();
  const role = user?.role || "student";
  const isAdmin = role === "admin";
  const isTeacher = role === "teacher";
  const isStaff = isAdmin || isTeacher;

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {/* Student items */}
        {!isStaff && (
          <>
            <ListItem button component={Link} href="/student/dashboard" selected={selected === "dashboard"} onClick={() => setSelected("dashboard")}>
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText primary={t("dashboard")} />
            </ListItem>
            <ListItem button component={Link} href="/student/archive" selected={selected === "archive"} onClick={() => setSelected("archive")}>
              <ListItemIcon><ArchiveIcon /></ListItemIcon>
              <ListItemText primary={t("archive")} />
            </ListItem>
          </>
        )}

        {/* Teacher / Admin items */}
        {isStaff && (
          <ListItem button component={Link} href="/admin/exam" selected={selected === "exam"} onClick={() => setSelected("exam")}>
            <ListItemIcon><ManageAccountsIcon /></ListItemIcon>
            <ListItemText primary={t("manage_exams")} />
          </ListItem>
        )}

        {/* Admin-only */}
        {isAdmin && (
          <ListItem button component={Link} href="/admin/users" selected={selected === "users"} onClick={() => setSelected("users")}>
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary={t("manage_users")} />
          </ListItem>
        )}

        {/* Teacher / Admin */}
        {isStaff && (
          <ListItem button component={Link} href="/admin/review" selected={selected === "review"} onClick={() => setSelected("review")}>
            <ListItemIcon><RateReviewIcon /></ListItemIcon>
            <ListItemText primary={t("writing_review")} />
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};
