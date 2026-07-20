export type Role = "superadmin" | "admin" | "student";

export interface User {
  id: string;
  full_name: string;
  role: Role;
  avatar_url: string | null;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail_url: string | null;
  created_by: string;
  created_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  published: boolean;
  sort_order: number;
  created_at: string;
}

export interface Material {
  id: string;
  lesson_id: string;
  title: string;
  file_url: string;
  size_bytes: number | null;
  uploaded_by: string;
  created_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  created_at: string;
}

export interface GrowthData {
  id: string;
  month: string;
  students: number;
  courses: number;
  created_at: string;
}

// Join types for the UI
export interface CourseWithStats extends Course {
  instructor: string;
  lessons: number;
  materials: number;
  enrolled?: boolean;
}

export interface LessonWithMaterials extends Lesson {
  materials: Material[];
}
