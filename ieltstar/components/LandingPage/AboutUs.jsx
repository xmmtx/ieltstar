import React from "react";
import { Grid, Typography, Button, Box } from "@mui/material";
import bestTeams from "../../images/certification.svg";
import Image from "next/image";
import styles from "../../styles/Landing.module.scss";
import { useI18n } from "../../utils/i18n";

const AboutUs = () => {
  const { t } = useI18n();
  return (
    <Box className={styles.aboutUsContainer}>
      <Grid container spacing={6} className={styles.gridContainer}>
        <Grid item xs={12} md={5}>
          <Image src={bestTeams} alt="IELTS Certification" className={styles.largeImage} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h3" fontWeight={700} className={styles.title}>
            {t("learn_anytime")}
          </Typography>
          <Typography className={styles.aboutUsSubtitle}>
            {t("learn_desc")}
          </Typography>
          <Button variant="contained" className={styles.button} sx={{ width: "200px", fontSize: "16px" }}>
            {t("contact_us")}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutUs;
