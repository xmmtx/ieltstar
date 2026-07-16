import React from "react";
import { Grid, Typography, Button, Box } from "@mui/material";
import myteam from "../../images/online.svg";
import styles from "../../styles/Landing.module.scss";
import Image from "next/image";

const Hero = () => {
  return (
    <Box className={styles.heroBox}>
      <Grid container spacing={6} className={styles.gridContainer}>
        <Grid item xs={12} md={7}>
          <Typography variant="h3" fontWeight={700} className={styles.title}>
            IELTS Computer-Based Mock Test Platform
          </Typography>
          <Typography variant="h6" className={styles.subtitle}>
            Practice Listening, Reading, and Writing under realistic exam conditions.
            Built for Academic IELTS preparation with auto-scoring and detailed feedback.
          </Typography>
          <Button
            variant="contained"
            className={styles.button}
            sx={{ width: "200px", fontSize: "16px" }}
            href="/login"
          >
            Get Started
          </Button>
        </Grid>
        <Grid item xs={12} md={5}>
          <Image
            src={myteam}
            alt="Picture of the author"
            className={styles.largeImage}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Hero;
