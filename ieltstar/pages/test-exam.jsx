// Live demo page - fetches from real API with mock fallback
import { ExamLayout } from "../components/TestComponents/ExamV2";
import { useEffect, useState } from "react";
import { getApiUrl } from "../utils/api";

export default function TestExam() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const examId = "6a58ab61506742326baddc8a";

  useEffect(() => {
    const API_URL = getApiUrl();
    fetch(`${API_URL}/exams/${examId}/tests`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Sort: Listening → Reading → Writing
          const order = ["Listening", "Reading", "Writing"];
          const sorted = data.sort((a, b) => {
            const ai = order.indexOf(a.category), bi = order.indexOf(b.category);
            return ai !== bi ? ai - bi : a.section - b.section;
          });
          setExams(sorted);
        } else {
          // Fallback to mock data
          setExams(getMockExams());
        }
      })
      .catch(() => setExams(getMockExams()))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading exam data...</div>;

  return <ExamLayout exams={exams} onFinish={() => console.log("Exam finished!")} />;
}

TestExam.getLayout = (page) => page;

function getMockExams() {
  return [
  // ===== LISTENING =====
  {
    _id: "listen-1",
    examId: "mock-exam-1",
    section: 1,
    category: "Listening",
    source: "",
    instruction: "Listen and answer questions 1 - 6.",
    questions: [
      {
        _id: "l1",
        title: "Mr Griffin has been to the Sunrise Hotel ...",
        options: ["... once previously.", "... twice previously.", "... three times previously."],
        answer: "... twice previously.",
        marks: 1,
      },
      {
        _id: "l2",
        title: "Mr Griffin is from ...",
        options: ["... Melbourne.", "... Sydney.", "... Perth."],
        answer: "... Melbourne.",
        marks: 1,
      },
      {
        _id: "l3",
        title: "Mr Griffin's passport number is ...",
        options: ["... 87647489.", "... 87637289.", "... 87637489."],
        answer: "... 87637489.",
        marks: 1,
      },
      {
        _id: "l4",
        title: "Mr Griffin wants to book ...",
        options: ["... a single room for 2 nights.", "... a double room for 2 nights.", "... a single room for 1 night."],
        answer: "... a single room for 2 nights.",
        marks: 1,
      },
      {
        _id: "l5",
        title: "Mr Griffin will arrive at the Sunrise Hotel at ...",
        options: ["... 9.15 p.m.", "... 10.00 p.m.", "... 9.35 p.m."],
        answer: "... 9.35 p.m.",
        marks: 1,
      },
      {
        _id: "l6",
        title: "What number room will Mr Griffin be in?",
        options: [],
        answer: "Room 305",
        marks: 1,
      },
    ],
  },
  // ===== READING =====
  {
    _id: "read-1",
    examId: "mock-exam-1",
    section: 1,
    category: "Reading",
    source: `<p><strong>Cleaning up the Thames</strong></p>
<p>The River Thames, which was biologically "dead" as recently as the 1960s, is now the cleanest metropolitan river in the world, according to the Thames Water Company. The company says that thanks to major investment in better sewage treatment in London and the Thames Valley, the river that flows through the United Kingdom capital and the Thames Estuary into the North Sea is cleaner now than it has been for 130 years.</p>
<p>The Fisheries Department, which is responsible for monitoring fish levels in the River Thames, has reported that the river has again become the home to 115 species of fish including sea bass, flounder, salmon, smelt, and shad. Recently, a porpoise was spotted cavorting in the river near central London.</p>
<p>But things were not always so rosy. In the 1950s, sewer outflows and industrial effluent had killed the river. It was starved of oxygen and could no longer support aquatic life. Until the early 1970s, if you fell into the Thames you would have had to be rushed to hospital to get your stomach pumped.</p>
<p>A clean-up operation began in the 1960s. Several Parliamentary Committees and Royal Commissions were set up, and, over time, legislation has been introduced that puts the onus on polluters - effluent-producing premises and businesses - to dispose of waste responsibly. In 1964 the Greater London Council (GLC) began work on much enlarged sewage works, which were completed in 1974.</p>
<p>The Thames clean-up is not over though. It is still going on, and it involves many disparate arms of government and a wide range of non-government stakeholder groups, all representing a necessary aspect of the task. Each of the urban and non-urban London boroughs that flanks the river has its own reasons to keep the river clean.</p>
<p>Further laws aimed at improving and sustaining the river's viability have been proposed. There is now legislation that protects the River Thames, either specifically or as part of a general environmental clause, in the Local Government Act, the London Acts and the law that created the post of the mayor of London.</p>
<p>While the Port of London already collects up to 3,000 tons of solid waste from the tideway every year, Thames Water now plans to introduce a new device to capture more rubbish floating down the river. It consists of a huge cage that sits in the flow of water and gathers the passing rubbish.</p>`,
    instruction: "Read the text below and answer questions 1 - 8.",
    questions: [
      {
        _id: "r1",
        title: "Operating the rubbish muncher",
        options: ["The Environment Agency", "Transport for London", "The Greater London Council", "Thames Water", "Port of London", "Local boroughs"],
        answer: "Thames Water",
        marks: 1,
      },
      {
        _id: "r2",
        title: "Creating community strategies",
        options: ["The Environment Agency", "Transport for London", "The Greater London Council", "Thames Water", "Port of London", "Local boroughs"],
        answer: "Local boroughs",
        marks: 1,
      },
      {
        _id: "r3",
        title: "Monitoring the cleanliness of the river",
        options: ["The Environment Agency", "Transport for London", "The Greater London Council", "Thames Water", "Port of London", "Local boroughs"],
        answer: "The Environment Agency",
        marks: 1,
      },
      {
        _id: "r4",
        title: "Collecting solid waste from the tideway",
        options: ["The Environment Agency", "Transport for London", "The Greater London Council", "Thames Water", "Port of London", "Local boroughs"],
        answer: "Port of London",
        marks: 1,
      },
      {
        _id: "r5",
        title: "Creating enlarged sewage works",
        options: ["The Environment Agency", "Transport for London", "The Greater London Council", "Thames Water", "Port of London", "Local boroughs"],
        answer: "The Greater London Council",
        marks: 1,
      },
      {
        _id: "r6",
        title: "Controlling traffic on the river",
        options: ["The Environment Agency", "Transport for London", "The Greater London Council", "Thames Water", "Port of London", "Local boroughs"],
        answer: "Transport for London",
        marks: 1,
      },
      {
        _id: "r7",
        title: "The River Thames is now the cleanest metropolitan river in the world.",
        options: ["True", "False", "Not Given"],
        answer: "True",
        marks: 1,
      },
      {
        _id: "r8",
        title: "All fish species have returned to the River Thames.",
        options: ["True", "False", "Not Given"],
        answer: "False",
        marks: 1,
      },
    ],
  },
  // ===== WRITING =====
  {
    _id: "write-1",
    examId: "mock-exam-1",
    section: 1,
    category: "Writing",
    source: `<p><strong><em>The table below shows how the UK unemployed spent their time last year.</em></strong></p>
<p><strong><em>Summarise the information by selecting and reporting the main features, and make comparisons where relevant.</em></strong></p>
<p><em>(Table: Time spent by unemployed people in the UK - Morning/Afternoon/Evening activities - Housework, Shopping, Job Hunting, Leisure, etc.)</em></p>`,
    instruction: "You should spend about 20 minutes on this task. Write at least 150 words.",
    questions: [
      {
        _id: "w1",
        title: "Write a summary of the information in the table.",
        options: [],
        answer: "",
        marks: 9,
      },
    ],
  },
  // ===== WRITING Part 2 =====
  {
    _id: "write-2",
    examId: "mock-exam-1",
    section: 2,
    category: "Writing",
    source: `<p><strong><em>Some people believe that unpaid community service should be a compulsory part of high school programmes.</em></strong></p>
<p><strong><em>To what extent do you agree or disagree?</em></strong></p>
<p>Give reasons for your answer and include any relevant examples from your own knowledge or experience.</p>`,
    instruction: "You should spend about 40 minutes on this task. Write at least 250 words.",
    questions: [
      {
        _id: "w2",
        title: "Write an essay responding to the prompt.",
        options: [],
        answer: "",
        marks: 9,
      },
    ],
  },
];
}

TestExam.getLayout = (page) => page;
TestExam.skipAuth = true;
