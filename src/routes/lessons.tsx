import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { lessons } from "@/lib/mock-data";
import { Plus, Pencil, Trash2, ChevronDown, FileType2, Download } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRole } from "@/lib/role";

export const Route = createFileRoute("/lessons")({
  head: () => ({ meta: [{ title: "Lessons — Apex Tutors" }] }),
  component: LessonsPage,
});

function LessonsPage() {
  const [role] = useRole();
  const [open, setOpen] = useState<string | null>(lessons[0].id);
  const isInstructor = role !== "student";

  return (
    <AppShell
      title="Lessons"
      subtitle="Organize content into clear, sequential lessons."
      actions={isInstructor ? (
        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90 transition">
          <Plus className="h-4 w-4" /> Create lesson
        </button>
      ) : undefined}
    >
      <div className="space-y-2">
        {lessons.map((l, i) => (
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
                {isInstructor && (
                  <>
                    <button className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition"><Pencil className="h-4 w-4" /></button>
                    <button className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"><Trash2 className="h-4 w-4" /></button>
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
              </div>
            )}
          </div>
        ))}
      </div>
    </AppShell>
  );
}
