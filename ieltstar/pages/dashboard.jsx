import { useEffect, useState } from "react";
import { Typography, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import dynamic from "next/dynamic";
import AOS from "aos";
import "aos/dist/aos.css";
import AppWidgetSummary from "../components/Student/Dashboard/Summary";
import AdminLayout from "../components/Layout/Admin";
import { getApiUrl } from "../utils/api";
import { useI18n } from "../utils/i18n";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/router";

const SectionWiseComparisonChart = dynamic(() => import("../components/Student/Dashboard/SectionWiseComparisonChart"), { ssr: false });
const TestTimeline = dynamic(() => import("../components/Student/Dashboard/TestTimeline"), { ssr: false });

const API = getApiUrl();

const getUser = () => {
  try { return JSON.parse(localStorage.getItem("ieltstar_user") || "{}"); }
  catch { return {}; }
};

export default function Dashboard() {
  const router = useRouter();
  const { t } = useI18n();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [summary, setSummary] = useState({ reading: 0, listening: 0, writing: 0, speaking: 0 });
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getUser();
    if (!u.email) { router.replace("/login"); return; }
    setUser(u);
    setLoading(false);
  }, []);

  useEffect(() => {
    AOS.init({ once: true });
    if (user?.email) {
      fetch(`${API}/students/email/${user.email}`)
        .then((r) => r.json())
        .then((data) => {
          if (!data) return;
          setUserData(data);
          let s = { reading: 0, listening: 0, writing: 0, speaking: 0 };
          (data.testHistory || []).forEach((test) => {
            if (test.testType === "Reading") s.reading += test.score || 0;
            if (test.testType === "Listening") s.listening += test.score || 0;
            if (test.testType === "Writing") s.writing += test.score || 0;
            if (test.testType === "Speaking") s.speaking += test.score || 0;
          });
          setSummary(s);
          setTimeline(data.testHistory || []);
        });
    }
  }, [user?.email]);

  if (loading) {
    return <Backdrop open sx={{ color: "#fff", zIndex: 9999 }}><CircularProgress color="inherit" /></Backdrop>;
  }
  if (!user) return null;

  const isStaff = user.role === "admin" || user.role === "teacher";

  const content = isStaff ? (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h4" sx={{ mb: 2 }}>{t("teacher_dashboard")}</Typography>
      <Typography variant="body1" color="text.secondary">
        {t("manage_exams")} / {t("writing_review")}
      </Typography>
    </Box>
  ) : (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" sx={{ mb: 1 }}>Hi, Welcome</Typography>
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Box sx={{ width: 40, height: 40, borderRadius: "50%", overflow: "hidden" }}>
            <img src={userData.profileURL || "/avatars/avatar_default.jpg"} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary title="Reading" total={summary.reading} color="success" icon="carbon:book" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary title="Listening" total={summary.listening} color="info" icon="carbon:headphones" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary title="Writing" total={summary.writing} color="warning" icon="carbon:edit" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary title="Speaking" total={summary.speaking} color="error" icon="carbon:microphone" />
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          {timeline.length > 0 ? (
            <SectionWiseComparisonChart
              title="Section Wise Comparison"
              subheader="Comparison of your performance in each section"
              chartLabels={[]}
              chartData={[]}
            />
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ p: 4, textAlign: "center" }}>
              Complete some tests to see your performance chart.
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          {timeline.length > 0 ? (
            <TestTimeline list={timeline} title="Recent Tests Taken" />
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ p: 4, textAlign: "center" }}>
              {t("no_tests_yet")}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );

  return <AdminLayout>{content}</AdminLayout>;
}

Dashboard.getLayout = (page) => page;
