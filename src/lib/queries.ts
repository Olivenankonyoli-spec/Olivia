import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";
import type { Course, CourseWithStats, Lesson, Material, LessonWithMaterials, Announcement, GrowthData, Enrollment } from "@/types/database";

// Courses
export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      const uid = user.user?.id;

      const { data, error } = await supabase
        .from("courses")
        .select(`
          *,
          users!courses_created_by_fkey (full_name),
          lessons (id),
          materials (id),
          enrollments (user_id)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data as any[]).map((c) => ({
        ...c,
        instructor: c.users?.full_name || "Unknown Instructor",
        lessons: c.lessons?.length || 0,
        materials: c.materials?.length || 0,
        enrolled: uid ? c.enrollments?.some((e: any) => e.user_id === uid) : false,
      })) as CourseWithStats[];
    },
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ["courses", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select(`*, users!courses_created_by_fkey(full_name)`)
        .eq("id", id)
        .single();
      if (error) throw error;
      return { ...data, instructor: (data.users as any)?.full_name } as Course & { instructor: string };
    },
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (course: Omit<Course, "id" | "created_at" | "created_by">) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not logged in");
      
      const { data, error } = await supabase
        .from("courses")
        .insert({ ...course, created_by: user.user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Course> & { id: string }) => {
      const { data, error } = await supabase.from("courses").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses", variables.id] });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

// Lessons
export function useLessons(courseId?: string) {
  return useQuery({
    queryKey: ["lessons", courseId],
    queryFn: async () => {
      let query = supabase
        .from("lessons")
        .select(`*, materials(*)`)
        .order("sort_order", { ascending: true });
        
      if (courseId) {
        query = query.eq("course_id", courseId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as LessonWithMaterials[];
    },
  });
}

export function useCreateLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (lesson: Omit<Lesson, "id" | "created_at">) => {
      const { data, error } = await supabase.from("lessons").insert(lesson).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lessons"] }),
  });
}

export function useUpdateLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Lesson> & { id: string }) => {
      const { data, error } = await supabase.from("lessons").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lessons"] }),
  });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("lessons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lessons"] }),
  });
}

// Materials
export function useMaterials() {
  return useQuery({
    queryKey: ["materials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("materials")
        .select(`*, lessons(title, courses(title)), users!materials_uploaded_by_fkey(full_name)`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data.map((m: any) => ({
        ...m,
        lesson_title: m.lessons?.title,
        course_title: m.lessons?.courses?.title,
        uploader_name: m.users?.full_name,
      }));
    },
  });
}

export function useCreateMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (material: Omit<Material, "id" | "created_at" | "uploaded_by">) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not logged in");
      
      const { data, error } = await supabase.from("materials").insert({
        ...material,
        uploaded_by: user.user.id
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lessons"] }),
  });
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("materials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lessons"] }),
  });
}

// Enrollments
export function useEnrollCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courseId: string) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not logged in");
      
      const { error } = await supabase.from("enrollments").insert({
        user_id: user.user.id,
        course_id: courseId
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["courses"] }),
  });
}

export function useRecentEnrollments() {
  return useQuery({
    queryKey: ["recent_enrollments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select(`enrolled_at, users(full_name), courses(title)`)
        .order("enrolled_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data.map((e: any) => ({
        name: e.users?.full_name || "Unknown User",
        course: e.courses?.title || "Unknown Course",
        time: new Date(e.enrolled_at).toLocaleDateString(),
      }));
    }
  });
}

// Dashboard Stats
export function useAdminStats() {
  return useQuery({
    queryKey: ["admin_stats"],
    queryFn: async () => {
      const [users, courses, lessons, materials] = await Promise.all([
        supabase.from("users").select("id", { count: "exact", head: true }),
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("lessons").select("id", { count: "exact", head: true }),
        supabase.from("materials").select("id", { count: "exact", head: true }),
      ]);
      return {
        users: users.count || 0,
        courses: courses.count || 0,
        lessons: lessons.count || 0,
        materials: materials.count || 0,
      };
    },
  });
}

export function useGrowthData() {
  return useQuery({
    queryKey: ["growth_data"],
    queryFn: async () => {
      const { data, error } = await supabase.from("growth_data").select("*").order("created_at", { ascending: true });
      if (error) throw error;
      return data as GrowthData[];
    },
  });
}

export function useAnnouncements() {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const { data, error } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Announcement[];
    },
  });
}
