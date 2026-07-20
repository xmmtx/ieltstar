import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Landing.module.scss";
import Hero from "../components/LandingPage/Hero";
import Header from "../components/LandingPage/Header";
import Section from "../components/LandingPage/Section";
import AboutUs from "../components/LandingPage/AboutUs";
import Testimonial from "../components/LandingPage/Testimonial";
import Footer from "../components/LandingPage/Footer";
import Head from "next/head";
import { getApiUrl } from "../utils/api";
import { useI18n } from "../utils/i18n";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const Home = () => {
  const router = useRouter();
  const { t } = useI18n();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("ieltstar_token");
    if (token) {
      fetch(`${getApiUrl()}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((user) => {
          router.replace("/dashboard");
        })
        .catch(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, []);

  if (checking) {
    return (
      <Backdrop open sx={{ color: "#fff", zIndex: 9999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <>
      <Head>
        <title>{t("app_name")} - {t("app_subtitle")}</title>
        <link rel="icon" type="image/x-icon" href="/favicon.png" />
      </Head>
      <div className={styles.bgWrap}>
        <Header />
        <Hero />
        <Section />
        <AboutUs />
        <Testimonial />
        <Footer />
      </div>
    </>
  );
};

Home.getLayout = (page: any) => page;
Home.skipAuth = true;
export default Home;
