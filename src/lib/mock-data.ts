export type Role = "admin" | "instructor" | "student";

export interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  lessons: number;
  materials: number;
  thumbnail: string;
  description: string;
  enrolled?: boolean;
  lessonsList?: CourseLessonDraft[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  pdfs: { id: string; title: string; size: string }[];
  published?: boolean;
}

export interface CourseLessonDraft {
  id: string;
  title: string;
  description: string;
  published: boolean;
  materials: { id: string; title: string; size: string }[];
}

export interface Material {
  id: string;
  title: string;
  lesson: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
}

const gradients = [
  "linear-gradient(135deg,#2563EB,#7C3AED)",
  "linear-gradient(135deg,#14B8A6,#0EA5E9)",
  "linear-gradient(135deg,#F59E0B,#EF4444)",
  "linear-gradient(135deg,#10B981,#14B8A6)",
  "linear-gradient(135deg,#6366F1,#EC4899)",
  "linear-gradient(135deg,#0EA5E9,#2563EB)",
];

export const courses: Course[] = [
  { id: "c1", title: "Foundations of Calculus", instructor: "Dr. Amelia Chen", category: "Mathematics", lessons: 12, materials: 8, thumbnail: gradients[0], description: "Limits, derivatives, and integrals — built from first principles with clear visual intuition.", enrolled: true },
  { id: "c2", title: "Modern Web Development", instructor: "Prof. Liam Patel", category: "Computer Science", lessons: 18, materials: 14, thumbnail: gradients[1], description: "Build production-ready applications with React, TypeScript, and modern tooling.", enrolled: true },
  { id: "c3", title: "Organic Chemistry I", instructor: "Dr. Sara Okafor", category: "Science", lessons: 16, materials: 11, thumbnail: gradients[2], description: "Mechanisms, reactions, and stereochemistry for first-year university students." },
  { id: "c4", title: "Introduction to Economics", instructor: "Prof. Marcus Lee", category: "Business", lessons: 10, materials: 7, thumbnail: gradients[3], description: "Micro and macro foundations applied to real-world markets." },
  { id: "c5", title: "Creative Writing Workshop", instructor: "Eliza Hart", category: "Humanities", lessons: 8, materials: 5, thumbnail: gradients[4], description: "Voice, structure, and craft for fiction and narrative non-fiction." },
  { id: "c6", title: "Data Structures & Algorithms", instructor: "Dr. Raj Mehta", category: "Computer Science", lessons: 22, materials: 18, thumbnail: gradients[5], description: "Master the patterns that power technical interviews and real systems." },
];

export const lessons: Lesson[] = [
  { id: "l1", title: "Limits and Continuity", description: "An intuitive approach to limits with worked examples.", pdfs: [{ id: "p1", title: "Lecture 1 — Limits.pdf", size: "2.4 MB" }, { id: "p2", title: "Worksheet 1.pdf", size: "640 KB" }] },
  { id: "l2", title: "The Derivative", description: "Definition, rules, and geometric meaning of the derivative.", pdfs: [{ id: "p3", title: "Lecture 2 — Derivatives.pdf", size: "3.1 MB" }] },
  { id: "l3", title: "Applications of Differentiation", description: "Optimization, related rates, and curve sketching.", pdfs: [{ id: "p4", title: "Lecture 3 — Applications.pdf", size: "2.8 MB" }, { id: "p5", title: "Practice Set.pdf", size: "1.1 MB" }] },
  { id: "l4", title: "Integration Fundamentals", description: "Antiderivatives and the fundamental theorem of calculus.", pdfs: [{ id: "p6", title: "Lecture 4 — Integration.pdf", size: "2.6 MB" }] },
];

export const materials: Material[] = [
  { id: "m1", title: "Lecture 1 — Limits.pdf", lesson: "Limits and Continuity", size: "2.4 MB", uploadedBy: "Dr. Amelia Chen", uploadedAt: "2 days ago" },
  { id: "m2", title: "Worksheet 1.pdf", lesson: "Limits and Continuity", size: "640 KB", uploadedBy: "Dr. Amelia Chen", uploadedAt: "2 days ago" },
  { id: "m3", title: "Lecture 2 — Derivatives.pdf", lesson: "The Derivative", size: "3.1 MB", uploadedBy: "Dr. Amelia Chen", uploadedAt: "5 days ago" },
  { id: "m4", title: "Lecture 3 — Applications.pdf", lesson: "Applications of Differentiation", size: "2.8 MB", uploadedBy: "Dr. Amelia Chen", uploadedAt: "1 week ago" },
  { id: "m5", title: "Practice Set.pdf", lesson: "Applications of Differentiation", size: "1.1 MB", uploadedBy: "Dr. Amelia Chen", uploadedAt: "1 week ago" },
  { id: "m6", title: "Lecture 4 — Integration.pdf", lesson: "Integration Fundamentals", size: "2.6 MB", uploadedBy: "Dr. Amelia Chen", uploadedAt: "2 weeks ago" },
];

export const adminStats = {
  users: 1248,
  courses: 64,
  lessons: 612,
  materials: 1893,
};

export const growthData = [
  { month: "Jan", students: 220, courses: 12 },
  { month: "Feb", students: 310, courses: 18 },
  { month: "Mar", students: 480, courses: 24 },
  { month: "Apr", students: 612, courses: 31 },
  { month: "May", students: 790, courses: 42 },
  { month: "Jun", students: 980, courses: 51 },
  { month: "Jul", students: 1248, courses: 64 },
];

export const recentEnrollments = [
  { name: "Olivia Bennett", course: "Modern Web Development", time: "12m ago" },
  { name: "Noah Williams", course: "Foundations of Calculus", time: "1h ago" },
  { name: "Mia Hernandez", course: "Organic Chemistry I", time: "3h ago" },
  { name: "Ethan Brooks", course: "Data Structures & Algorithms", time: "5h ago" },
  { name: "Ava Thompson", course: "Introduction to Economics", time: "Yesterday" },
];

export const announcements = [
  { title: "Midterm schedule released", body: "Check the materials tab in each course for the exam outline.", time: "Today" },
  { title: "New library additions", body: "Six new lecture packs have been uploaded to your library.", time: "Yesterday" },
];
