import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Plus, Pencil, Trash2, ChevronDown, FileType2, Download, X, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useRole } from "@/lib/role";
import { useLessons, useCreateLesson, useUpdateLesson, useDeleteLesson, useCourses } from "@/lib/queries";
import type { LessonWithMaterials, CourseWithStats } from "@/types/database";

export const Route = createFileRoute("/lessons")({
  head: () => ({ meta: [{ title: "Lessons — Apex Tutors" }] }),
  component: LessonsPage,
});

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; lesson: LessonWithMaterials }
  | { mode: "delete"; lesson: LessonWithMaterials }
  | null;

function formatBytes(bytes: number | null) {
  if (!bytes) return "Unknown size";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function LessonsPage() {
  const [role] = useRole();
  const isAdmin = role !== "student";
  const { data: items, isLoading } = useLessons();
  const [open, setOpen] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);

  const closeModal = () => setModal(null);

  return (
    <AppShell
      title="Lessons"
      subtitle="Organize content into clear, sequential lessons."
      actions={isAdmin ? (
        <button
          onClick={() => setModal({ mode: "create" })}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90 transition"
        >
          <Plus className="h-4 w-4" /> Create lesson
        </button>
      ) : undefined}
    >
      <div className="space-y-2">
        {isLoading ? (
          <div className="py-20 text-center text-muted-foreground">Loading lessons...</div>
        ) : (!items || items.length === 0) ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <p className="text-sm text-muted-foreground">No lessons yet.</p>
            {isAdmin && (
              <button
                onClick={() => setModal({ mode: "create" })}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
              >
                <Plus className="h-4 w-4" /> Create your first lesson
              </button>
            )}
          </div>
        ) : (
          items.map((l, i) => (
            <div key={l.id} className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-5 py-4">
                <button onClick={() => setOpen(open === l.id ? null : l.id)} className="contents">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary text-sm font-bold">{i + 1}</div>
                  <div className="min-w-0 text-left">
                    <div className="font-semibold truncate">{l.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{l.materials?.length || 0} attached PDFs</div>
                  </div>
                </button>
                <div className="flex items-center gap-1">
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => setModal({ mode: "edit", lesson: l })}
                        aria-label={`Edit ${l.title}`}
                        className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setModal({ mode: "delete", lesson: l })}
                        aria-label={`Delete ${l.title}`}
                        className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  <button onClick={() => setOpen(open === l.id ? null : l.id)} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted transition">
                    <ChevronDown className={cn("h-4 w-4 transition", open === l.id && "rotate-180")} />
                  </button>
                </div>
              </div>
              {open === l.id && (
                <div className="px-5 pb-5 pt-2 border-t border-border bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-3">{l.description}</p>
                  {l.materials && l.materials.length > 0 ? (
                    <ul className="space-y-2">
                      {l.materials.map((p) => (
                        <li key={p.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-destructive/10 text-destructive">
                            <FileType2 className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium">{p.title}</div>
                            <div className="text-xs text-muted-foreground">{formatBytes(p.size_bytes)}</div>
                          </div>
                          <Download className="h-4 w-4 text-muted-foreground" />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No PDFs attached yet.</p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {(modal?.mode === "create" || modal?.mode === "edit") && (
        <LessonFormModal
          key={modal.mode === "edit" ? modal.lesson.id : "new"}
          initial={modal.mode === "edit" ? modal.lesson : undefined}
          onClose={closeModal}
        />
      )}
      {modal?.mode === "delete" && (
        <DeleteLessonModal
          lesson={modal.lesson}
          onClose={closeModal}
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
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-lift"
      >
        {children}
      </div>
    </div>
  );
}

function LessonFormModal({ initial, onClose }: { initial?: any; onClose: () => void }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [courseId, setCourseId] = useState(initial?.course_id ?? "");
  const [error, setError] = useState<string | null>(null);
  
  const { data: courses } = useCourses();
  const createMutation = useCreateLesson();
  const updateMutation = useUpdateLesson();
  const isPending = createMutation.isPending || updateMutation.isPending;

  // Auto-select first course if creating and none selected
  useEffect(() => {
    if (!initial && !courseId && courses && courses.length > 0) {
      setCourseId(courses[0].id);
    }
  }, [courses, courseId, initial]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !courseId) {
      setError("Title and Course are required.");
      return;
    }
    
    if (initial) {
      updateMutation.mutate(
        { id: initial.id, title: title.trim(), description: description.trim(), course_id: courseId },
        { onSuccess: () => onClose() }
      );
    } else {
      createMutation.mutate(
        { title: title.trim(), description: description.trim(), course_id: courseId, sort_order: 1, published: true },
        { onSuccess: () => onClose() }
      );
    }
  };

  return (
    <ModalShell onClose={onClose} labelledBy="lesson-form-title">
      <form onSubmit={submit}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 id="lesson-form-title" className="text-base font-semibold">{initial ? "Edit lesson" : "Create lesson"}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted transition">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Course</label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              required
            >
              <option value="" disabled>Select a course</option>
              {courses?.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Title</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(null); }}
              placeholder="e.g. Integration by Parts"
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short summary of what this lesson covers."
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition resize-none"
              required
            />
          </div>
          {error && <p className="text-xs font-medium text-destructive">{error}</p>}
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border bg-muted/30 rounded-b-2xl">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition">Cancel</button>
          <button type="submit" disabled={isPending} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90 transition disabled:opacity-50">
            {isPending ? "Saving..." : initial ? "Save changes" : "Create lesson"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function DeleteLessonModal({ lesson, onClose }: { lesson: any; onClose: () => void }) {
  const deleteMutation = useDeleteLesson();
  return (
    <ModalShell onClose={onClose} labelledBy="delete-lesson-title">
      <div className="px-5 py-5">
        <div className="flex items-start gap-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 id="delete-lesson-title" className="text-base font-semibold">Delete lesson</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Are you sure you want to delete <span className="font-medium text-foreground">{lesson.title}</span>? This will remove {lesson.materials?.length || 0} attached PDF{(lesson.materials?.length || 0) === 1 ? "" : "s"} from this lesson. This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border bg-muted/30 rounded-b-2xl">
        <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition">Cancel</button>
        <button 
          disabled={deleteMutation.isPending}
          onClick={() => deleteMutation.mutate(lesson.id, { onSuccess: () => onClose() })} 
          className="rounded-xl bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground shadow-soft hover:bg-destructive/90 transition disabled:opacity-50"
        >
          {deleteMutation.isPending ? "Deleting..." : "Delete lesson"}
        </button>
      </div>
    </ModalShell>
  );
}
