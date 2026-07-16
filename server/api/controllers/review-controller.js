import Student from "../models/Student.js";

// Get all writing submissions (pending review)
export const getWritingSubmissions = async (req, res) => {
  try {
    const students = await Student.find({ "testHistory.testType": "Writing" })
      .select("name email testHistory");
    
    const submissions = [];
    students.forEach((s) => {
      (s.testHistory || []).forEach((t) => {
        if (t.testType === "Writing" && t.score === -1) {
          submissions.push({
            _id: t._id,
            studentName: s.name,
            studentEmail: s.email,
            testId: t.testId,
            examId: t.examId,
            section: t.section,
            score: t.score,
            date: t.date,
            writingText: t.writingText || "(No text saved)",
          });
        }
      });
    });

    res.json(submissions);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Score a writing submission
export const scoreWriting = async (req, res) => {
  try {
    const { studentEmail, testHistoryId, score } = req.body;
    const student = await Student.findOneAndUpdate(
      { email: studentEmail, "testHistory._id": testHistoryId },
      { $set: { "testHistory.$.score": score } },
      { new: true }
    );
    if (!student) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Score updated", score });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
