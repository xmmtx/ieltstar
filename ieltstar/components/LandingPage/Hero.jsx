import React from "react";
import { Grid, Typography, Button, Box } from "@mui/material";
import myteam from "../../images/online.svg";
import styles from "../../styles/Landing.module.scss";
import Image from "next/image";
import { useI18n } from "../../utils/i18n";

const Hero = () => {
  const { t } = useI18n();
  return (
    <Box className={styles.heroBox}>
      <Grid container spacing={6} className={styles.gridContainer}>
        <Grid item xs={12} md={7}>
          <Typography variant="h3" fontWeight={700} className={styles.title}>
            {t("landing_title")}
          </Typography>
          <Typography variant="h6" className={styles.subtitle}>
            {t("landing_subtitle")}
          </Typography>
          <Button
            variant="contained"
            className={styles.button}
            sx={{ width: "200px", fontSize: "16px" }}
            href="/login"
          >
            {t("get_started")}
          </Button>
        </Grid>
        <Grid item xs={12} md={5}>
          <Image
            src={myteam}
            alt="IELTS Online Practice"
            className={styles.largeImage}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Hero;
