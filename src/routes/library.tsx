import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { FileType2, Search } from "lucide-react";
import { useState } from "react";
import { useMaterials } from "@/lib/queries";

export const Route = createFileRoute("/library")({
  head: () => ({ meta: [{ title: "Library — Apex Tutors" }] }),
  component: LibraryPage,
});

function formatBytes(bytes: number | null) {
  if (!bytes) return "Unknown size";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function LibraryPage() {
  const [q, setQ] = useState("");
  const { data: materials, isLoading } = useMaterials();
  
  const items = materials || [];
  const filtered = items.filter((m: any) => 
    m.title.toLowerCase().includes(q.toLowerCase()) || 
    (m.lesson_title && m.lesson_title.toLowerCase().includes(q.toLowerCase())) ||
    (m.course_title && m.course_title.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <AppShell title="Library" subtitle="Your personal collection of course materials.">
      <div className="relative mb-6 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your library…" className="w-full rounded-xl border border-input bg-card py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition" />
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground">Loading library...</div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((m: any) => (
              <Link key={m.id} to="/reader" className="group rounded-2xl border border-border bg-card p-4 shadow-soft hover:shadow-lift hover:-translate-y-0.5 transition">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-destructive/10 text-destructive">
                  <FileType2 className="h-6 w-6" />
                </div>
                <div className="mt-3 font-semibold text-sm leading-snug group-hover:text-primary transition">{m.title}</div>
                <div className="mt-1 text-xs text-muted-foreground truncate">{m.lesson_title || "Unknown Lesson"}</div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{formatBytes(m.size_bytes)}</span>
                  <span>{new Date(m.created_at).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center mt-4">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-muted text-muted-foreground"><FileType2 className="h-6 w-6" /></div>
              <div className="mt-3 font-semibold">Nothing here yet</div>
              <p className="mt-1 text-sm text-muted-foreground">Enroll in a course to see materials in your library.</p>
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}
