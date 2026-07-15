import { useState, useEffect, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import ExamTopBar from "./ExamTopBar";
import ReadingView from "./ReadingView";
import WritingView from "./WritingView";
import ListeningView from "./ListeningView";
import BottomNav from "./BottomNav";

const CATEGORY_DURATIONS = {
  Listening: 30,
  Reading: 60,
  Writing: 60,
  Speaking: 15,
};

const API_BASE = "http://localhost:8080";

const ExamLayout = ({ exams = [], studentEmail = "demo@ieltstar.com", examId = "", onFinish }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [highlightEnabled, setHighlightEnabled] = useState(false);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState(null);
  const [showScore, setShowScore] = useState(false);

  const currentTest = exams[activeIndex] || {};
  const category = currentTest.category || "Reading";
  const sectionLabel = `Part ${currentTest.section || activeIndex + 1}`;

  // Build section tabs
  const sections = exams.reduce((acc, test) => {
    const existing = acc.find((s) => s.label === test.category);
    if (existing) {
      existing.count += test.questions?.length || 0;
    } else {
      acc.push({ label: test.category, count: test.questions?.length || 0 });
    }
    return acc;
  }, []);

  // Find which category tab is active
  const activeCategoryIdx = sections.findIndex((s) => s.label === category);

  // === Answer handling ===
  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // === Auto-score Listening/Reading ===
  const calculateScore = (test, userAnswers) => {
    const questions = test.questions || [];
    if (questions.length === 0) return 0;
    let correct = 0;
    questions.forEach((q) => {
      const userAns = (userAnswers[q._id] || "").trim().toLowerCase();
      const correctAns = (q.answer || "").trim().toLowerCase();
      if (userAns && userAns === correctAns) correct++;
    });
    return Math.round((correct / questions.length) * 9 * 10) / 10;
  };

  // === Submit all answers ===
  const handleFinishTest = useCallback(async () => {
    setFinished(true);
    const allScores = {};

    for (const test of exams) {
      if (test.category === "Listening" || test.category === "Reading") {
        allScores[test.category] = calculateScore(test, answers);
        // Submit to backend
        try {
          await fetch(`${API_BASE}/students/${studentEmail}/testHistory`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              testType: test.category,
              testId: test._id,
              section: test.section,
              examId: test.examId || examId,
              score: 0,
              userResponse: (test.questions || []).map((q) => ({
                questionId: q._id,
                questionOptions: (q.options || []).map((opt) => ({
                  que_options: opt,
                  selected: (answers[q._id] || "").trim().toLowerCase() === opt.trim().toLowerCase(),
                })),
              })),
            }),
          });
        } catch (e) { console.log("Submit error:", e.message); }
      } else if (test.category === "Writing" || test.category === "Speaking") {
        // Subjective - save raw text
        try {
          await fetch(`${API_BASE}/students/${studentEmail}/testHistory`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              testType: test.category,
              testId: test._id,
              section: test.section,
              examId: test.examId || examId,
              score: answers[`writing_${test._id}`] || "",
            }),
          });
        } catch (e) { console.log("Submit error:", e.message); }
      }
    }

    setScores(allScores);
    setTimeout(() => setShowScore(true), 1500);
    onFinish && onFinish(allScores);
  }, [exams, answers, studentEmail, examId, onFinish]);

  const handleSectionChange = (idx) => {
    // Find first test of that category
    const targetCategory = sections[idx]?.label;
    const targetIdx = exams.findIndex((t) => t.category === targetCategory);
    if (targetIdx >= 0) setActiveIndex(targetIdx);
  };

  const handlePrev = () => {
    if (activeIndex > 0) setActiveIndex(activeIndex - 1);
  };

  const handleNext = () => {
    if (activeIndex < exams.length - 1) setActiveIndex(activeIndex + 1);
  };

  // Render the appropriate view
  const renderView = () => {
    const sharedProps = { test: currentTest, answers, onAnswer: handleAnswer };
    switch (category) {
      case "Reading":
        return <ReadingView {...sharedProps} />;
      case "Writing":
        return <WritingView {...sharedProps} />;
      case "Listening":
        return <ListeningView {...sharedProps} />;
      case "Speaking":
        // Keep original speaking; show placeholder for now
        return (
          <Box sx={{ p: 4, textAlign: "center", mt: 8 }}>
            <Typography variant="h5">Speaking Section</Typography>
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              The Speaking section is conducted face-to-face with an examiner.
              Please wait for your examiner.
            </Typography>
          </Box>
        );
      default:
        return <Box sx={{ p: 4 }}>Unknown section type</Box>;
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", bgcolor: "#f5f5f5" }}>
      {/* Fixed Top Bar */}
      <ExamTopBar
        studentName="Candidate"
        durationMinutes={CATEGORY_DURATIONS[category] || 60}
        category={category}
        highlightEnabled={highlightEnabled}
        onToggleHighlight={
          category === "Reading" ? () => setHighlightEnabled((v) => !v) : undefined
        }
        onFinishTest={handleFinishTest}
      />

      {/* Main Content Area */}
      <Box sx={{ flex: 1, mt: "48px", mb: "44px", overflow: "hidden" }}>
        {renderView()}
      </Box>

      {/* Bottom Navigation */}
      <BottomNav
        sections={sections}
        activeSection={activeCategoryIdx >= 0 ? activeCategoryIdx : 0}
        onSectionChange={handleSectionChange}
        onPrev={handlePrev}
        onNext={handleNext}
        totalQuestions={exams.reduce((sum, t) => sum + (t.questions?.length || 0), 0)}
      />
    </Box>
  );
};

export default ExamLayout;
