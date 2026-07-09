import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { courses, lessons } from "@/lib/mock-data";
import { BookOpen, FileText, ChevronLeft, Play, ChevronDown, FileType2, Download, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/courses/$id")({
  loader: ({ params }) => {
    const course = courses.find(c => c.id === params.id);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.course.title ?? "Course"} — Apex Tutors` }] }),
  component: CourseDetail,
});

function CourseDetail() {
  const { course } = Route.useLoaderData();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"overview" | "lessons" | "materials">("overview");
  const [openLesson, setOpenLesson] = useState<string | null>(lessons[0].id);
  const [enrolled, setEnrolled] = useState<boolean>(!!course.enrolled);
  const [justEnrolled, setJustEnrolled] = useState(false);

  const firstLesson = lessons[0];
  const firstPdfId = firstLesson?.pdfs[0]?.id;

  const handleContinue = () => {
    if (!enrolled) {
      setEnrolled(true);
      setJustEnrolled(true);
      setTimeout(() => setJustEnrolled(false), 2500);
    }
    if (firstPdfId) {
      navigate({ to: "/reader", search: { lesson: firstLesson.id, pdf: firstPdfId } });
    } else {
      setTab("lessons");
    }
  };

  return (
    <AppShell
      title={course.title}
      subtitle={course.category}
      actions={
        <Link to="/courses" className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold hover:border-primary hover:text-primary transition">
          <ChevronLeft className="h-3.5 w-3.5" /> All courses
        </Link>
      }
    >
      {/* Hero */}
      <div className="rounded-3xl overflow-hidden border border-border bg-card shadow-soft mb-6">
        <div className="relative h-48 lg:h-64" style={{ background: course.thumbnail }}>
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
        </div>
        <div className="p-6 lg:p-8 grid lg:grid-cols-[1fr_auto] gap-6 items-end">
          <div>
            <div className="text-xs font-semibold text-primary uppercase tracking-wider">{course.category}</div>
            <h2 className="mt-1 text-2xl lg:text-3xl font-bold tracking-tight">{course.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">by {course.instructor}</p>
            <p className="mt-3 text-sm text-foreground/80 max-w-2xl">{course.description}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{course.lessons} lessons</span>
              <span className="inline-flex items-center gap-1"><FileText className="h-3.5 w-3.5" />{course.materials} materials</span>
            </div>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90 transition">
            <Play className="h-4 w-4" /> {course.enrolled ? "Continue" : "Enroll now"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <div className="flex gap-1">
          {(["overview", "lessons", "materials"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "relative px-4 py-2.5 text-sm font-medium capitalize transition",
                tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t}
              {tab === t && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />}
            </button>
          ))}
        </div>
      </div>

      {tab === "overview" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-soft prose prose-sm max-w-none">
            <h3 className="text-base font-semibold">About this course</h3>
            <p className="text-sm text-muted-foreground mt-2">{course.description}</p>
            <h4 className="text-sm font-semibold mt-5">What you'll learn</h4>
            <ul className="mt-2 grid sm:grid-cols-2 gap-2 text-sm text-foreground/80 list-disc list-inside">
              <li>Build deep intuition through worked examples</li>
              <li>Apply concepts to real-world problems</li>
              <li>Practice with curated problem sets</li>
              <li>Prepare for exams and assessments</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h3 className="text-sm font-semibold">Instructor</h3>
            <div className="mt-3 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-foreground font-bold">
                {course.instructor.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div className="font-semibold text-sm">{course.instructor}</div>
                <div className="text-xs text-muted-foreground">{course.category} faculty</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "lessons" && (
        <div className="space-y-2">
          {lessons.map((l, i) => (
            <div key={l.id} className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
              <button
                onClick={() => setOpenLesson(openLesson === l.id ? null : l.id)}
                className="w-full grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 text-left hover:bg-muted/50 transition"
              >
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary text-sm font-bold">{i + 1}</div>
                <div className="min-w-0">
                  <div className="font-semibold truncate">{l.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{l.pdfs.length} attached PDFs</div>
                </div>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition", openLesson === l.id && "rotate-180")} />
              </button>
              {openLesson === l.id && (
                <div className="px-5 pb-5 pt-2 border-t border-border bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-3">{l.description}</p>
                  <ul className="space-y-2">
                    {l.pdfs.map((p) => (
                      <li key={p.id}>
                        <Link to="/reader" className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:border-primary transition">
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-destructive/10 text-destructive">
                            <FileType2 className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium">{p.title}</div>
                            <div className="text-xs text-muted-foreground">{p.size}</div>
                          </div>
                          <Download className="h-4 w-4 text-muted-foreground shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "materials" && (
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <ul className="divide-y divide-border">
            {lessons.flatMap(l => l.pdfs.map(p => ({ ...p, lesson: l.title }))).map((p) => (
              <li key={p.id} className="flex items-center gap-3 p-4 hover:bg-muted/50 transition">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive">
                  <FileType2 className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.lesson} · {p.size}</div>
                </div>
                <Link to="/reader" className="text-xs font-semibold text-primary hover:underline">Open</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </AppShell>
  );
}
