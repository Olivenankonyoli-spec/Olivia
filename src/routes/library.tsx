import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { materials } from "@/lib/mock-data";
import { FileType2, Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/library")({
  head: () => ({ meta: [{ title: "Library — Apex Tutors" }] }),
  component: LibraryPage,
});

function LibraryPage() {
  const [q, setQ] = useState("");
  const filtered = materials.filter(m => m.title.toLowerCase().includes(q.toLowerCase()) || m.lesson.toLowerCase().includes(q.toLowerCase()));

  return (
    <AppShell title="Library" subtitle="Your personal collection of course materials.">
      <div className="relative mb-6 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your library…" className="w-full rounded-xl border border-input bg-card py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((m) => (
          <Link key={m.id} to="/reader" className="group rounded-2xl border border-border bg-card p-4 shadow-soft hover:shadow-lift hover:-translate-y-0.5 transition">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-destructive/10 text-destructive">
              <FileType2 className="h-6 w-6" />
            </div>
            <div className="mt-3 font-semibold text-sm leading-snug group-hover:text-primary transition">{m.title}</div>
            <div className="mt-1 text-xs text-muted-foreground truncate">{m.lesson}</div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{m.size}</span>
              <span>{m.uploadedAt}</span>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-muted text-muted-foreground"><FileType2 className="h-6 w-6" /></div>
          <div className="mt-3 font-semibold">Nothing here yet</div>
          <p className="mt-1 text-sm text-muted-foreground">Enroll in a course to see materials in your library.</p>
        </div>
      )}
    </AppShell>
  );
}
