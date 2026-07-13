import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { lessons as seedLessons, type Lesson } from "@/lib/mock-data";
import { Plus, Pencil, Trash2, ChevronDown, FileType2, Download, X, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useRole } from "@/lib/role";

export const Route = createFileRoute("/lessons")({
  head: () => ({ meta: [{ title: "Lessons — Apex Tutors" }] }),
  component: LessonsPage,
});

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; lesson: Lesson }
  | { mode: "delete"; lesson: Lesson }
  | null;

function LessonsPage() {
  const [role] = useRole();
  const [items, setItems] = useState<Lesson[]>(seedLessons);
  const [open, setOpen] = useState<string | null>(seedLessons[0]?.id ?? null);
  const [modal, setModal] = useState<ModalState>(null);
  const isAdmin = role !== "student";

  const closeModal = () => setModal(null);

  const handleCreate = (data: { title: string; description: string }) => {
    const newLesson: Lesson = {
      id: `l_${Date.now()}`,
      title: data.title,
      description: data.description,
      pdfs: [],
    };
    setItems((prev) => [...prev, newLesson]);
    setOpen(newLesson.id);
    closeModal();
  };

  const handleEdit = (id: string, data: { title: string; description: string }) => {
    setItems((prev) => prev.map((l) => (l.id === id ? { ...l, ...data } : l)));
    closeModal();
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((l) => l.id !== id));
    setOpen((cur) => (cur === id ? null : cur));
    closeModal();
  };

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
        {items.length === 0 && (
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
        )}
        {items.map((l, i) => (
          <div key={l.id} className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-5 py-4">
              <button onClick={() => setOpen(open === l.id ? null : l.id)} className="contents">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary text-sm font-bold">{i + 1}</div>
                <div className="min-w-0 text-left">
                  <div className="font-semibold truncate">{l.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{l.pdfs.length} attached PDFs · Foundations of Calculus</div>
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
                {l.pdfs.length > 0 ? (
                  <ul className="space-y-2">
                    {l.pdfs.map((p) => (
                      <li key={p.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-destructive/10 text-destructive">
                          <FileType2 className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">{p.title}</div>
                          <div className="text-xs text-muted-foreground">{p.size}</div>
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
        ))}
      </div>

      {modal?.mode === "create" && (
        <LessonFormModal
          title="Create lesson"
          submitLabel="Create lesson"
          onClose={closeModal}
          onSubmit={handleCreate}
        />
      )}
      {modal?.mode === "edit" && (
        <LessonFormModal
          title="Edit lesson"
          submitLabel="Save changes"
          initial={{ title: modal.lesson.title, description: modal.lesson.description }}
          onClose={closeModal}
          onSubmit={(data) => handleEdit(modal.lesson.id, data)}
        />
      )}
      {modal?.mode === "delete" && (
        <DeleteLessonModal
          lesson={modal.lesson}
          onClose={closeModal}
          onConfirm={() => handleDelete(modal.lesson.id)}
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

function LessonFormModal({
  title,
  submitLabel,
  initial,
  onClose,
  onSubmit,
}: {
  title: string;
  submitLabel: string;
  initial?: { title: string; description: string };
  onClose: () => void;
  onSubmit: (data: { title: string; description: string }) => void;
}) {
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const headingId = "lesson-form-title";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    onSubmit({ title: form.title.trim(), description: form.description.trim() });
  };

  return (
    <ModalShell onClose={onClose} labelledBy={headingId}>
      <form onSubmit={submit}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 id={headingId} className="text-base font-semibold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted transition">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div>
            <label htmlFor="lesson-title" className="block text-xs font-semibold text-muted-foreground mb-1.5">Title</label>
            <input
              id="lesson-title"
              autoFocus
              value={form.title}
              onChange={(e) => { setForm({ ...form, title: e.target.value }); setError(null); }}
              placeholder="e.g. Integration by Parts"
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
            />
          </div>
          <div>
            <label htmlFor="lesson-desc" className="block text-xs font-semibold text-muted-foreground mb-1.5">Description</label>
            <textarea
              id="lesson-desc"
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short summary of what this lesson covers."
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition resize-none"
            />
          </div>
          {error && <p className="text-xs font-medium text-destructive">{error}</p>}
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border bg-muted/30 rounded-b-2xl">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition">Cancel</button>
          <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90 transition">{submitLabel}</button>
        </div>
      </form>
    </ModalShell>
  );
}

function DeleteLessonModal({ lesson, onClose, onConfirm }: { lesson: Lesson; onClose: () => void; onConfirm: () => void }) {
  const headingId = "delete-lesson-title";
  return (
    <ModalShell onClose={onClose} labelledBy={headingId}>
      <div className="px-5 py-5">
        <div className="flex items-start gap-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 id={headingId} className="text-base font-semibold">Delete lesson</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Are you sure you want to delete <span className="font-medium text-foreground">{lesson.title}</span>? This will remove {lesson.pdfs.length} attached PDF{lesson.pdfs.length === 1 ? "" : "s"} from this lesson. This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border bg-muted/30 rounded-b-2xl">
        <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition">Cancel</button>
        <button type="button" onClick={onConfirm} className="rounded-xl bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground shadow-soft hover:bg-destructive/90 transition">Delete lesson</button>
      </div>
    </ModalShell>
  );
}
