export type Assignment = {
  id: string;
  title: string;
  course: string;
  type: "Assignment" | "Test" | "Quiz" | "Project";
  date: string; // ISO date YYYY-MM-DD
};

const today = new Date();
const iso = (offsetDays: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

export const assignments: Assignment[] = [
  { id: "1", title: "Chapter 4 Problem Set", course: "AP Calculus", type: "Assignment", date: iso(1) },
  { id: "2", title: "Macbeth Essay Draft", course: "English Lit", type: "Assignment", date: iso(2) },
  { id: "3", title: "Cell Biology Quiz", course: "Biology", type: "Quiz", date: iso(3) },
  { id: "4", title: "Unit 3 Test", course: "AP Calculus", type: "Test", date: iso(6) },
  { id: "5", title: "Lab Report: Photosynthesis", course: "Biology", type: "Assignment", date: iso(8) },
  { id: "6", title: "Spanish Oral Exam", course: "Spanish III", type: "Test", date: iso(10) },
  { id: "7", title: "History Research Project", course: "World History", type: "Project", date: iso(14) },
  { id: "8", title: "Reading Response #5", course: "English Lit", type: "Assignment", date: iso(-2) },
];

export type Course = {
  id: string;
  name: string;
  teacher: string;
  grade: number; // percentage
  letter: string;
  categories: { name: string; weight: number; score: number }[];
};

export const courses: Course[] = [
  {
    id: "calc",
    name: "AP Calculus",
    teacher: "Mr. Patel",
    grade: 92,
    letter: "A-",
    categories: [
      { name: "Tests", weight: 50, score: 90 },
      { name: "Homework", weight: 30, score: 96 },
      { name: "Participation", weight: 20, score: 92 },
    ],
  },
  {
    id: "eng",
    name: "English Lit",
    teacher: "Ms. Rivera",
    grade: 88,
    letter: "B+",
    categories: [
      { name: "Essays", weight: 60, score: 87 },
      { name: "Reading", weight: 25, score: 92 },
      { name: "Discussion", weight: 15, score: 85 },
    ],
  },
  {
    id: "bio",
    name: "Biology",
    teacher: "Dr. Chen",
    grade: 95,
    letter: "A",
    categories: [
      { name: "Labs", weight: 40, score: 96 },
      { name: "Tests", weight: 40, score: 94 },
      { name: "Quizzes", weight: 20, score: 95 },
    ],
  },
  {
    id: "spa",
    name: "Spanish III",
    teacher: "Sra. Lopez",
    grade: 84,
    letter: "B",
    categories: [
      { name: "Speaking", weight: 35, score: 80 },
      { name: "Writing", weight: 35, score: 86 },
      { name: "Vocab Quizzes", weight: 30, score: 87 },
    ],
  },
  {
    id: "hist",
    name: "World History",
    teacher: "Mr. Brooks",
    grade: 90,
    letter: "A-",
    categories: [
      { name: "Essays", weight: 40, score: 88 },
      { name: "Tests", weight: 40, score: 91 },
      { name: "Projects", weight: 20, score: 92 },
    ],
  },
];

export const suggestedPrompts = [
  "What should I study tonight?",
  "Summarize Macbeth Act 2",
  "Make a study plan for my Calc test",
  "Quiz me on cell organelles",
];

export const starterMessages: { role: "user" | "ai"; text: string }[] = [
  {
    role: "ai",
    text: "Hey! I'm Cluck — your study sidekick. Ask me to summarize a chapter, plan your week, or quiz you on something.",
  },
];

export const courseColor: Record<string, string> = {
  "AP Calculus": "oklch(0.64 0.21 28)",
  "English Lit": "oklch(0.55 0.16 265)",
  Biology: "oklch(0.6 0.16 160)",
  "Spanish III": "oklch(0.7 0.16 70)",
  "World History": "oklch(0.55 0.13 320)",
};
