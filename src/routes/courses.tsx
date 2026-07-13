import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { courses as seedCourses, type Course, type CourseLessonDraft } from "@/lib/mock-data";
import { BookOpen, FileText, Search, Plus, X, ImagePlus, Trash2, Upload, FileType2, Pencil, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRole } from "@/lib/role";

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
  | { mode: "edit"; course: Course }
  | { mode: "delete"; course: Course }
  | null;

function CoursesList() {
  const [role] = useRole();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [items, setItems] = useState<Course[]>(seedCourses);
  const [modal, setModal] = useState<ModalState>(null);
  const isInstructor = role !== "student";

  const cats = ["All", ...Array.from(new Set(items.map(c => c.category)))];
  const filtered = items.filter(c =>
    (cat === "All" || c.category === cat) &&
    (q === "" || c.title.toLowerCase().includes(q.toLowerCase()) || c.instructor.toLowerCase().includes(q.toLowerCase()))
  );

  const closeModal = () => setModal(null);

  const handleSave = (course: Course, mode: "create" | "edit") => {
    setItems((prev) =>
      mode === "create"
        ? [course, ...prev]
        : prev.map((c) => (c.id === course.id ? course : c))
    );
    closeModal();
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((c) => c.id !== id));
    closeModal();
  };

  return (
    <AppShell
      title="Courses"
      subtitle="Browse, enroll, and continue learning."
      actions={isInstructor ? (
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
            {cats.map(c => <option key={c}>{c}</option>)}
          </select>
          <select className="rounded-xl border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-primary">
            <option>Newest</option>
            <option>Alphabetical</option>
            <option>Most popular</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((c) => {
          const publishedCount = c.lessonsList?.filter((l) => l.published).length;
          return (
            <div key={c.id} className="group rounded-2xl border border-border bg-card overflow-hidden shadow-soft hover:shadow-lift hover:-translate-y-0.5 transition">
              <div className="relative h-36 bg-cover bg-center" style={{ background: c.thumbnail }}>
                <span className="absolute top-3 left-3 rounded-lg bg-white/90 px-2 py-1 text-[11px] font-semibold text-foreground">{c.category}</span>
                {c.enrolled && <span className="absolute top-3 right-3 rounded-lg bg-secondary px-2 py-1 text-[11px] font-semibold text-secondary-foreground">Enrolled</span>}
                {isInstructor && (
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
                  {isInstructor && publishedCount !== undefined && (
                    <span className="inline-flex items-center gap-1 text-secondary"><Eye className="h-3.5 w-3.5" />{publishedCount} live</span>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <Link to="/courses/$id" params={{ id: c.id }} className="flex-1 inline-flex items-center justify-center rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition">
                    Open course
                  </Link>
                  {!c.enrolled && (
                    <button className="inline-flex items-center justify-center rounded-xl border border-border px-3 py-2 text-xs font-semibold hover:border-primary hover:text-primary transition">
                      Enroll
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
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
          onSave={(c) => handleSave(c, modal.mode as "create" | "edit")}
        />
      )}
      {modal?.mode === "delete" && (
        <DeleteCourseModal
          course={modal.course}
          onClose={closeModal}
          onConfirm={() => handleDelete(modal.course.id)}
        />
      )}
    </AppShell>
  );
}

function ModalShell({ children, onClose, labelledBy }: { children: React.ReactNode; onClose: () => void; labelledBy: string }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-lift"
      >
        {children}
      </div>
    </div>
  );
}

const CATEGORIES = ["Mathematics", "Computer Science", "Science", "Business", "Humanities", "Arts"];
const FALLBACK_THUMB = "linear-gradient(135deg,#2563EB,#7C3AED)";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function extractImageUrl(thumbnail: string): string | null {
  const m = thumbnail.match(/^url\((.+?)\)/);
  return m ? m[1] : null;
}

function CourseFormModal({ initial, onClose, onSave }: { initial?: Course; onClose: () => void; onSave: (c: Course) => void }) {
  const isEdit = !!initial;
  const [title, setTitle] = useState(initial?.title ?? "");
  const [instructor, setInstructor] = useState(initial?.instructor ?? "");
  const [category, setCategory] = useState(initial?.category && CATEGORIES.includes(initial.category) ? initial.category : (initial?.category ?? CATEGORIES[0]));
  const [description, setDescription] = useState(initial?.description ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(initial ? extractImageUrl(initial.thumbnail) : null);
  const [thumbnailGradient] = useState<string>(initial && !extractImageUrl(initial.thumbnail) ? initial.thumbnail : FALLBACK_THUMB);
  const [lessons, setLessons] = useState<CourseLessonDraft[]>(
    initial?.lessonsList && initial.lessonsList.length > 0
      ? initial.lessonsList
      : [{ id: `l_${Date.now()}`, title: "", description: "", published: false, materials: [] }]
  );
  const [error, setError] = useState<string | null>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const headingId = "course-form-title";

  const categoryOptions = Array.from(new Set([...CATEGORIES, ...(initial?.category ? [initial.category] : [])]));

  const onImage = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Cover must be an image file."); return; }
    const reader = new FileReader();
    reader.onload = () => setThumbnailUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const addLesson = () =>
    setLessons((p) => [...p, { id: `l_${Date.now()}_${p.length}`, title: "", description: "", published: false, materials: [] }]);
  const removeLesson = (id: string) => setLessons((p) => p.filter((l) => l.id !== id));
  const updateLesson = (id: string, patch: Partial<CourseLessonDraft>) =>
    setLessons((p) => p.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const addMaterials = (lessonId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const mats = Array.from(files).map((f, i) => ({
      id: `m_${Date.now()}_${i}`,
      title: f.name,
      size: formatSize(f.size),
    }));
    setLessons((p) => p.map((l) => (l.id === lessonId ? { ...l, materials: [...l.materials, ...mats] } : l)));
  };
  const removeMaterial = (lessonId: string, matId: string) =>
    setLessons((p) => p.map((l) => (l.id === lessonId ? { ...l, materials: l.materials.filter((m) => m.id !== matId) } : l)));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return setError("Course title is required.");
    if (!instructor.trim()) return setError("Instructor name is required.");
    const validLessons = lessons.filter((l) => l.title.trim());
    const totalMaterials = validLessons.reduce((sum, l) => sum + l.materials.length, 0);
    const thumbnail = thumbnailUrl ? `url(${thumbnailUrl}) center/cover` : thumbnailGradient;
    onSave({
      id: initial?.id ?? `c_${Date.now()}`,
      title: title.trim(),
      instructor: instructor.trim(),
      category,
      lessons: validLessons.length,
      materials: totalMaterials,
      thumbnail,
      description: description.trim() || "New course.",
      enrolled: initial?.enrolled,
      lessonsList: validLessons,
    });
  };

  return (
    <ModalShell onClose={onClose} labelledBy={headingId}>
      <form onSubmit={submit}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card z-10">
          <h2 id={headingId} className="text-base font-semibold">{isEdit ? "Edit course" : "Create new course"}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted transition">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Cover image</label>
            <div
              className="relative h-40 rounded-xl border border-dashed border-border overflow-hidden bg-muted/40 grid place-items-center cursor-pointer hover:border-primary transition"
              style={thumbnailUrl ? { background: `url(${thumbnailUrl}) center/cover` } : { background: thumbnailGradient }}
              onClick={() => imgInputRef.current?.click()}
            >
              {!thumbnailUrl && (
                <div className="text-center text-white drop-shadow">
                  <ImagePlus className="h-6 w-6 mx-auto mb-1" />
                  <p className="text-xs font-medium">Click to upload cover image</p>
                  <p className="text-[11px] opacity-90">PNG, JPG · recommended 1200×600</p>
                </div>
              )}
              {thumbnailUrl && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setThumbnailUrl(null); }}
                  className="absolute top-2 right-2 grid h-7 w-7 place-items-center rounded-lg bg-card/90 text-foreground hover:bg-card transition"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <input
                ref={imgInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onImage(e.target.files?.[0])}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Course title</label>
              <input
                value={title}
                onChange={(e) => { setTitle(e.target.value); setError(null); }}
                placeholder="e.g. Introduction to Linear Algebra"
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Instructor</label>
              <input
                value={instructor}
                onChange={(e) => { setInstructor(e.target.value); setError(null); }}
                placeholder="e.g. Dr. Amelia Chen"
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              >
                {categoryOptions.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What will students learn?"
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition resize-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-muted-foreground">Lessons</label>
              <button type="button" onClick={addLesson} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/10 transition">
                <Plus className="h-3.5 w-3.5" /> Add lesson
              </button>
            </div>
            <div className="space-y-3">
              {lessons.map((l, i) => (
                <LessonDraftCard
                  key={l.id}
                  index={i}
                  lesson={l}
                  canRemove={lessons.length > 1}
                  onRemove={() => removeLesson(l.id)}
                  onChange={(patch) => updateLesson(l.id, patch)}
                  onAddFiles={(files) => addMaterials(l.id, files)}
                  onRemoveMaterial={(mid) => removeMaterial(l.id, mid)}
                />
              ))}
            </div>
          </div>

          {error && <p className="text-xs font-medium text-destructive">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border bg-muted/30 rounded-b-2xl sticky bottom-0">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition">Cancel</button>
          <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90 transition">{isEdit ? "Save changes" : "Create course"}</button>
        </div>
      </form>
    </ModalShell>
  );
}

function LessonDraftCard({
  index, lesson, canRemove, onRemove, onChange, onAddFiles, onRemoveMaterial,
}: {
  index: number;
  lesson: CourseLessonDraft;
  canRemove: boolean;
  onRemove: () => void;
  onChange: (patch: Partial<CourseLessonDraft>) => void;
  onAddFiles: (files: FileList | null) => void;
  onRemoveMaterial: (matId: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary text-xs font-bold">{index + 1}</div>
        <div className="flex-1 min-w-0 space-y-2">
          <input
            value={lesson.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Lesson title"
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
          />
          <textarea
            rows={2}
            value={lesson.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Short description (optional)"
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition resize-none"
          />
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove lesson"
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-3 pl-11 space-y-3">
        {/* Publish status */}
        <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2">
          <div className="flex items-center gap-2 min-w-0">
            {lesson.published ? <Eye className="h-4 w-4 text-secondary" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
            <div className="min-w-0">
              <div className="text-xs font-semibold">{lesson.published ? "Published" : "Draft"}</div>
              <div className="text-[11px] text-muted-foreground truncate">
                {lesson.published ? "Visible to enrolled students." : "Only instructors can see this lesson."}
              </div>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={lesson.published}
            onClick={() => onChange({ published: !lesson.published })}
            className={`relative h-5 w-9 shrink-0 rounded-full transition ${lesson.published ? "bg-secondary" : "bg-muted"}`}
          >
            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${lesson.published ? "left-[18px]" : "left-0.5"}`} />
          </button>
        </div>

        {/* Materials */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Materials</span>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/10 transition"
            >
              <Upload className="h-3.5 w-3.5" /> Upload PDFs
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              multiple
              className="hidden"
              onChange={(e) => { onAddFiles(e.target.files); if (fileRef.current) fileRef.current.value = ""; }}
            />
          </div>
          {lesson.materials.length === 0 ? (
            <p className="text-xs italic text-muted-foreground">No materials uploaded yet.</p>
          ) : (
            <ul className="space-y-1.5">
              {lesson.materials.map((m) => (
                <li key={m.id} className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-destructive/10 text-destructive">
                    <FileType2 className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium">{m.title}</div>
                    <div className="text-[11px] text-muted-foreground">{m.size}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveMaterial(m.id)}
                    aria-label="Remove material"
                    className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function DeleteCourseModal({ course, onClose, onConfirm }: { course: Course; onClose: () => void; onConfirm: () => void }) {
  const headingId = "delete-course-title";
  return (
    <ModalShell onClose={onClose} labelledBy={headingId}>
      <div className="px-5 py-5">
        <div className="flex items-start gap-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 id={headingId} className="text-base font-semibold">Delete course</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Are you sure you want to delete <span className="font-medium text-foreground">{course.title}</span>? All associated lessons and materials will be removed. This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border bg-muted/30 rounded-b-2xl">
        <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition">Cancel</button>
        <button type="button" onClick={onConfirm} className="rounded-xl bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground shadow-soft hover:bg-destructive/90 transition">Delete course</button>
      </div>
    </ModalShell>
  );
}
