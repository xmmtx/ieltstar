import { IconButton, Tooltip } from "@mui/material";
import { useI18n } from "../../utils/i18n";

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();

  return (
    <Tooltip title={t("switch_lang")} arrow>
      <IconButton
        onClick={() => setLang(lang === "zh" ? "en" : "zh")}
        sx={{ color: "inherit", fontSize: "1.1rem", fontWeight: 700, width: 36, height: 36 }}
      >
        {lang === "zh" ? "EN" : "中"}
      </IconButton>
    </Tooltip>
  );
}
