import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { courses } from "@/lib/mock-data";
import { BookOpen, FileText, Search, Plus } from "lucide-react";
import { useState } from "react";
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

function CoursesList() {
  const [role] = useRole();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const cats = ["All", ...Array.from(new Set(courses.map(c => c.category)))];
  const filtered = courses.filter(c =>
    (cat === "All" || c.category === cat) &&
    (q === "" || c.title.toLowerCase().includes(q.toLowerCase()) || c.instructor.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <AppShell
      title="Courses"
      subtitle="Browse, enroll, and continue learning."
      actions={role !== "student" ? <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90 transition"><Plus className="h-4 w-4" />New course</button> : undefined}
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
        {filtered.map((c) => (
          <div key={c.id} className="group rounded-2xl border border-border bg-card overflow-hidden shadow-soft hover:shadow-lift hover:-translate-y-0.5 transition">
            <div className="relative h-36" style={{ background: c.thumbnail }}>
              <span className="absolute top-3 left-3 rounded-lg bg-white/90 px-2 py-1 text-[11px] font-semibold text-foreground">{c.category}</span>
              {c.enrolled && <span className="absolute top-3 right-3 rounded-lg bg-secondary px-2 py-1 text-[11px] font-semibold text-secondary-foreground">Enrolled</span>}
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
                {!c.enrolled && (
                  <button className="inline-flex items-center justify-center rounded-xl border border-border px-3 py-2 text-xs font-semibold hover:border-primary hover:text-primary transition">
                    Enroll
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-muted text-muted-foreground"><BookOpen className="h-6 w-6" /></div>
          <div className="mt-3 font-semibold">No courses found</div>
          <p className="mt-1 text-sm text-muted-foreground">Try clearing your filters or searching for something else.</p>
        </div>
      )}
    </AppShell>
  );
}
