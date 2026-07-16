// Seed script: creates mock exam data for testing the new IELTS exam UI
import mongoose from "mongoose";
import Exam from "./api/models/Exam.js";
import Test from "./api/models/Test.js";
import dotenv from "dotenv";
dotenv.config();

const DB_URL = process.env.DB_URL || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "ieltstar";

const seedData = async () => {
  await mongoose.connect(`${DB_URL}/${DB_NAME}`);
  console.log("Connected to MongoDB");

  // Clear existing data
  await Exam.deleteMany({});
  await Test.deleteMany({});
  console.log("Cleared old data");

  // Create Academic Exam
  const exam = await Exam.create({
    title: "IELTS Academic Mock Test 1",
    description: "Full mock test covering Listening, Reading and Writing",
    type: "Academic",
    date: new Date(),
  });
  console.log("Created exam:", exam._id);

  // ===== LISTENING Tests =====
  await Test.create([
    {
      examId: exam._id,
      section: 1,
      category: "Listening",
      source: "",
      instruction: "Listen and answer questions 1 - 6.",
      questions: [
        { title: "Mr Griffin has been to the Sunrise Hotel ...", questionType: "multiple-choice", options: ["... once previously.", "... twice previously.", "... three times previously."], answer: "... twice previously.", marks: 1 },
        { title: "Mr Griffin is from ...", questionType: "multiple-choice", options: ["... Melbourne.", "... Sydney.", "... Perth."], answer: "... Melbourne.", marks: 1 },
        { title: "Mr Griffin's passport number is ...", questionType: "multiple-choice", options: ["... 87647489.", "... 87637289.", "... 87637489."], answer: "... 87637489.", marks: 1 },
        { title: "Mr Griffin wants to book ...", questionType: "multiple-choice", options: ["... a single room for 2 nights.", "... a double room for 2 nights.", "... a single room for 1 night."], answer: "... a single room for 2 nights.", marks: 1 },
        { title: "Mr Griffin will arrive at the Sunrise Hotel at ...", questionType: "multiple-choice", options: ["... 9.15 p.m.", "... 10.00 p.m.", "... 9.35 p.m."], answer: "... 9.35 p.m.", marks: 1 },
        { title: "What number room will Mr Griffin be in?", questionType: "fill-blank", options: [], answer: "Room 305", marks: 1 },
      ],
    },
    {
      examId: exam._id,
      section: 2,
      category: "Listening",
      source: "",
      instruction: "Listen and answer questions 7 - 10.",
      questions: [
        { title: "The hotel restaurant is located on the ...", options: ["... ground floor.", "... first floor.", "... top floor."], answer: "... ground floor.", marks: 1 },
        { title: "Breakfast is served from ...", options: ["... 6:00 to 9:00.", "... 7:00 to 10:00.", "... 8:00 to 11:00."], answer: "... 7:00 to 10:00.", marks: 1 },
        { title: "What is the hotel's check-out time?", options: [], answer: "11:00 AM", marks: 1 },
        { title: "How will Mr Griffin pay?", options: ["... cash.", "... credit card.", "... company account."], answer: "... credit card.", marks: 1 },
      ],
    },
  ]);

  // ===== READING Tests =====
  await Test.create([
    {
      examId: exam._id,
      section: 1,
      category: "Reading",
      source: `<p><strong>Cleaning up the Thames</strong></p>
<p>The River Thames, which was biologically "dead" as recently as the 1960s, is now the cleanest metropolitan river in the world, according to the Thames Water Company. The company says that thanks to major investment in better sewage treatment in London and the Thames Valley, the river that flows through the United Kingdom capital and the Thames Estuary into the North Sea is cleaner now than it has been for 130 years.</p>
<p>The Fisheries Department, which is responsible for monitoring fish levels in the River Thames, has reported that the river has again become the home to 115 species of fish including sea bass, flounder, salmon, smelt, and shad. Recently, a porpoise was spotted cavorting in the river near central London.</p>
<p>But things were not always so rosy. In the 1950s, sewer outflows and industrial effluent had killed the river. It was starved of oxygen and could no longer support aquatic life. Until the early 1970s, if you fell into the Thames you would have had to be rushed to hospital to get your stomach pumped.</p>
<p>A clean-up operation began in the 1960s. Several Parliamentary Committees and Royal Commissions were set up, and, over time, legislation has been introduced that puts the onus on polluters - effluent-producing premises and businesses - to dispose of waste responsibly. In 1964 the Greater London Council (GLC) began work on much enlarged sewage works, which were completed in 1974.</p>
<p>The Thames clean-up is not over though. It is still going on, and it involves many disparate arms of government and a wide range of non-government stakeholder groups, all representing a necessary aspect of the task.</p>
<p>Further laws aimed at improving and sustaining the river's viability have been proposed. There is now legislation that protects the River Thames, either specifically or as part of a general environmental clause.</p>
<p>While the Port of London already collects up to 3,000 tons of solid waste from the tideway every year, Thames Water now plans to introduce a new device to capture more rubbish floating down the river.</p>`,
      instruction: "Read the text below and answer questions 1 - 8.",
      questions: [
        { title: "Operating the rubbish muncher", questionType: "multiple-choice", options: ["The Environment Agency", "Transport for London", "The Greater London Council", "Thames Water", "Port of London", "Local boroughs"], answer: "Thames Water", marks: 1 },
        { title: "Creating community strategies", questionType: "multiple-choice", options: ["The Environment Agency", "Transport for London", "The Greater London Council", "Thames Water", "Port of London", "Local boroughs"], answer: "Local boroughs", marks: 1 },
        { title: "Monitoring the cleanliness of the river", questionType: "multiple-choice", options: ["The Environment Agency", "Transport for London", "The Greater London Council", "Thames Water", "Port of London", "Local boroughs"], answer: "The Environment Agency", marks: 1 },
        { title: "The River Thames was biologically dead in the 1960s", questionType: "true-false-ng", options: ["True", "False", "Not Given"], answer: "True", marks: 1 },
        { title: "The Thames clean-up was completed in the 1980s", questionType: "true-false-ng", options: ["True", "False", "Not Given"], answer: "False", marks: 1 },
        { title: "The river now supports over 200 species of fish", questionType: "true-false-ng", options: ["True", "False", "Not Given"], answer: "False", marks: 1 },
        { title: "What device does Thames Water plan to introduce?", questionType: "fill-blank", options: [], answer: "Rubbish Muncher", marks: 1 },
        { title: "Local boroughs must prepare a ______ strategy", questionType: "fill-blank", options: [], answer: "community", marks: 1 },
      ],
    },
  ]);

  // ===== WRITING Tests =====
  await Test.create([
    {
      examId: exam._id,
      section: 1,
      category: "Writing",
      source: `<p><strong><em>The table below shows how the UK unemployed spent their time last year.</em></strong></p>
<p><strong><em>Summarise the information by selecting and reporting the main features, and make comparisons where relevant.</em></strong></p>
<p><em>(Table: Time spent by unemployed people in the UK - Morning/Afternoon/Evening activities)</em></p>`,
      instruction: "You should spend about 20 minutes on this task. Write at least 150 words.",
      questions: [
        { title: "Write a summary of the information in the table.", options: [], answer: "", marks: 9 },
      ],
    },
    {
      examId: exam._id,
      section: 2,
      category: "Writing",
      source: `<p><strong><em>Some people believe that unpaid community service should be a compulsory part of high school programmes.</em></strong></p>
<p><strong><em>To what extent do you agree or disagree?</em></strong></p>
<p>Give reasons for your answer and include any relevant examples from your own knowledge or experience.</p>`,
      instruction: "You should spend about 40 minutes on this task. Write at least 250 words.",
      questions: [
        { title: "Write an essay responding to the prompt.", options: [], answer: "", marks: 9 },
      ],
    },
  ]);

  console.log("Seed data created successfully!");
  console.log("Exam ID:", exam._id);
  console.log("Tests created: 2 Listening, 1 Reading, 2 Writing");

  await mongoose.disconnect();
  console.log("Done.");
};

seedData().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
