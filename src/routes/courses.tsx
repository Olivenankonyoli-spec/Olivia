import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { BookOpen, FileText, Search, Plus, X, ImagePlus, Trash2, Upload, FileType2, Pencil, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRole } from "@/lib/role";
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse, useEnrollCourse } from "@/lib/queries";
import type { CourseWithStats } from "@/types/database";

export const Route = createFileRoute("/courses")({
  head: () => ({ meta: [{ title: "Courses — Apex Tutors" }] }),
  component: CoursesLayout,
});

function CoursesLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/courses") return <Outlet />;
  return <CoursesList />;
}

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; course: CourseWithStats }
  | { mode: "delete"; course: CourseWithStats }
  | null;

function CoursesList() {
  const [role] = useRole();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [modal, setModal] = useState<ModalState>(null);
  const isAdmin = role !== "student";

  const { data: courses, isLoading } = useCourses();
  const enrollMutation = useEnrollCourse();

  const items = courses || [];
  const cats = ["All", ...Array.from(new Set(items.map((c: any) => c.category)))];
  const filtered = items.filter((c: any) =>
    (cat === "All" || c.category === cat) &&
    (q === "" || c.title.toLowerCase().includes(q.toLowerCase()) || (c.instructor && c.instructor.toLowerCase().includes(q.toLowerCase())))
  );

  const closeModal = () => setModal(null);

  return (
    <AppShell
      title="Courses"
      subtitle="Browse, enroll, and continue learning."
      actions={isAdmin ? (
        <button
          onClick={() => setModal({ mode: "create" })}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90 transition"
        >
          <Plus className="h-4 w-4" />New course
        </button>
      ) : undefined}
    >
      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft mb-6">
        <div className="grid md:grid-cols-[1fr_auto_auto] gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search courses or instructors"
              className="w-full rounded-xl border border-input bg-muted/50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 transition"
            />
          </div>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-xl border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-primary">
            {cats.map((c: any) => <option key={c}>{c}</option>)}
          </select>
          <select className="rounded-xl border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-primary">
            <option>Newest</option>
            <option>Alphabetical</option>
            <option>Most popular</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground">Loading courses...</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c: any) => {
            return (
              <div key={c.id} className="group rounded-2xl border border-border bg-card overflow-hidden shadow-soft hover:shadow-lift hover:-translate-y-0.5 transition">
                <div className="relative h-36 bg-cover bg-center" style={{ background: c.thumbnail_url || 'linear-gradient(135deg,#2563EB,#7C3AED)' }}>
                  <span className="absolute top-3 left-3 rounded-lg bg-white/90 px-2 py-1 text-[11px] font-semibold text-foreground">{c.category}</span>
                  {c.enrolled && <span className="absolute top-3 right-3 rounded-lg bg-secondary px-2 py-1 text-[11px] font-semibold text-secondary-foreground">Enrolled</span>}
                  {isAdmin && (
                    <div className="absolute bottom-3 right-3 flex gap-1.5">
                      <button
                        onClick={() => setModal({ mode: "edit", course: c })}
                        aria-label={`Edit ${c.title}`}
                        className="grid h-8 w-8 place-items-center rounded-lg bg-card/95 text-foreground hover:bg-card shadow-soft transition"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setModal({ mode: "delete", course: c })}
                        aria-label={`Delete ${c.title}`}
                        className="grid h-8 w-8 place-items-center rounded-lg bg-card/95 text-destructive hover:bg-card shadow-soft transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold leading-snug group-hover:text-primary transition">{c.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{c.instructor}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{c.lessons} lessons</span>
                    <span className="inline-flex items-center gap-1"><FileText className="h-3.5 w-3.5" />{c.materials} PDFs</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link to="/courses/$id" params={{ id: c.id }} className="flex-1 inline-flex items-center justify-center rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition">
                      Open course
                    </Link>
                    {!c.enrolled && role === "student" && (
                      <button 
                        onClick={() => enrollMutation.mutate(c.id)}
                        disabled={enrollMutation.isPending}
                        className="inline-flex items-center justify-center rounded-xl border border-border px-3 py-2 text-xs font-semibold hover:border-primary hover:text-primary transition disabled:opacity-50"
                      >
                        Enroll
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-muted text-muted-foreground"><BookOpen className="h-6 w-6" /></div>
          <div className="mt-3 font-semibold">No courses found</div>
          <p className="mt-1 text-sm text-muted-foreground">Try clearing your filters or searching for something else.</p>
        </div>
      )}

      {(modal?.mode === "create" || modal?.mode === "edit") && (
        <CourseFormModal
          key={modal.mode === "edit" ? modal.course.id : "new"}
          initial={modal.mode === "edit" ? modal.course : undefined}
          onClose={closeModal}
        />
      )}
      {modal?.mode === "delete" && (
        <DeleteCourseModal
          course={modal.course}
          onClose={closeModal}
        />
      )}
    </AppShell>
  );
}

function CourseFormModal({ initial, onClose }: { initial?: any; onClose: () => void }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [category, setCategory] = useState(initial?.category || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [thumbnail, setThumbnail] = useState(initial?.thumbnail_url || "linear-gradient(135deg,#2563EB,#7C3AED)");

  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initial) {
      updateMutation.mutate({ id: initial.id, title, category, description, thumbnail_url: thumbnail }, {
        onSuccess: () => onClose()
      });
    } else {
      createMutation.mutate({ title, category, description, thumbnail_url: thumbnail }, {
        onSuccess: () => onClose()
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-3xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col max-h-full">
        <div className="flex items-center justify-between border-b border-border p-4 sm:p-6">
          <h2 className="text-lg font-semibold">{initial ? "Edit course" : "New course"}</h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-muted transition text-muted-foreground"><X className="h-5 w-5" /></button>
        </div>
        <div className="overflow-y-auto p-4 sm:p-6">
          <form id="course-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Course title</label>
              <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Introduction to Calculus" className="w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Category</label>
              <input required value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Mathematics" className="w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Description</label>
              <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Briefly describe what students will learn..." className="w-full resize-none rounded-xl border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Cover style</label>
              <div className="flex gap-2">
                {["linear-gradient(135deg,#2563EB,#7C3AED)", "linear-gradient(135deg,#14B8A6,#0EA5E9)", "linear-gradient(135deg,#F59E0B,#EF4444)", "linear-gradient(135deg,#10B981,#14B8A6)"].map(grad => (
                  <button key={grad} type="button" onClick={() => setThumbnail(grad)} className={`h-12 w-16 rounded-xl border-2 transition ${thumbnail === grad ? "border-foreground" : "border-transparent"}`} style={{ background: grad }} />
                ))}
              </div>
            </div>
          </form>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-border p-4 sm:p-6 bg-muted/20">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-muted transition">Cancel</button>
          <button disabled={isPending} type="submit" form="course-form" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90 transition disabled:opacity-50">
            {isPending ? "Saving..." : initial ? "Save changes" : "Create course"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteCourseModal({ course, onClose }: { course: any; onClose: () => void }) {
  const deleteMutation = useDeleteCourse();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-2xl text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-destructive/10 text-destructive mb-4">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-semibold">Delete "{course.title}"?</h2>
        <p className="mt-2 text-sm text-muted-foreground">This action cannot be undone. All lessons, materials, and student enrollments will be permanently removed.</p>
        <div className="mt-6 flex flex-col gap-2">
          <button 
            disabled={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate(course.id, { onSuccess: () => onClose() })} 
            className="w-full rounded-xl bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90 transition disabled:opacity-50"
          >
            {deleteMutation.isPending ? "Deleting..." : "Yes, delete course"}
          </button>
          <button onClick={onClose} className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-muted transition">Cancel</button>
        </div>
      </div>
    </div>
  );
}


