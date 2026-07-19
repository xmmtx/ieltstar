import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import styles from "../../styles/Landing.module.scss";
import { useI18n } from "../../utils/i18n";

const Section = () => {
  const { t } = useI18n();
  const sectionItems = [
    { id: 1, icon: <AssignmentIcon sx={{ fontSize: 100 }} className={styles.menuIcon} />, key: "feature_1_desc" },
    { id: 2, icon: <HistoryToggleOffIcon sx={{ fontSize: 100 }} className={styles.menuIcon} />, key: "feature_2_desc" },
    { id: 3, icon: <PaidOutlinedIcon sx={{ fontSize: 100 }} className={styles.menuIcon} />, key: "feature_3_desc" },
  ];
  return (
    <Box sx={{ flexGrow: 1, minHeight: "400px" }}>
      <Grid container className={styles.sectionGridContainer}>
        {sectionItems.map((item) => (
          <Grid
            item
            xs={12}
            md={3.5}
            minHeight={300}
            key={item.id}
            className={styles.sectionGridItem}
          >
            {item.icon}
            <Typography>{t(item.key)}</Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Section;
