import { ExamLayout } from "../../../components/TestComponents/ExamV2";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function exam() {
  const router = useRouter();
  const { id } = router.query;
  const [exams, setExams] = useState([]);
  
  useEffect(() => {
    if (!id) {
      return;
    } else {
      axios
        .get(`${process.env.API_URL}/exams/${id}/tests`)
        .then((res) => {
          //test order - Listening, Reading, Writing, Speaking
          let data = res.data;
          let flattenExam = [];
          flattenExam.push(
            data
              .filter((item) => item.category === "Listening")
              .sort((a, b) => a.section - b.section)
          );
          flattenExam.push(
            data
              .filter((item) => item.category === "Reading")
              .sort((a, b) => a.section - b.section)
          );
          flattenExam.push(
            data
              .filter((item) => item.category === "Writing")
              .sort((a, b) => a.section - b.section)
          );
          flattenExam.push(
            data
              .filter((item) => item.category === "Speaking")
              .sort((a, b) => a.section - b.section)
          );
          setExams(flattenExam.flat());
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [id]);

  if (exams.length === 0) {
    return <div style={{ padding: 40, textAlign: "center" }}>Loading exam...</div>;
  }

  return (
    <ExamLayout
      exams={exams}
      onFinish={() => {
        console.log("Exam finished");
        // TODO: Show ScoreBoard
      }}
    />
  );
}
