import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { BookOpen, FileText, ChevronLeft, Play, ChevronDown, FileType2, Download, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCourse, useLessons, useEnrollCourse } from "@/lib/queries";
import { useRole } from "@/lib/role";

export const Route = createFileRoute("/courses/$id")({
  head: () => ({ meta: [{ title: `Course Details — Apex Tutors` }] }),
  component: CourseDetail,
});

function formatBytes(bytes: number | null) {
  if (!bytes) return "Unknown size";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function CourseDetail() {
  const { id } = Route.useParams();
  const { data: course, isLoading: loadingCourse } = useCourse(id);
  const { data: lessons, isLoading: loadingLessons } = useLessons(id);
  
  const navigate = useNavigate();
  const [role] = useRole();
  const enrollMutation = useEnrollCourse();
  
  const [tab, setTab] = useState<"overview" | "lessons" | "materials">("overview");
  const [openLesson, setOpenLesson] = useState<string | null>(null);
  const [justEnrolled, setJustEnrolled] = useState(false);

  if (loadingCourse || loadingLessons) {
    return (
      <AppShell title="Loading Course..." subtitle="">
        <div className="py-20 text-center text-muted-foreground">Fetching course details...</div>
      </AppShell>
    );
  }

  if (!course) {
    return (
      <AppShell title="Course Not Found" subtitle="">
        <div className="py-20 text-center text-muted-foreground">This course does not exist.</div>
      </AppShell>
    );
  }

  const enrolled = course.enrolled;
  const firstLesson = lessons?.[0];
  const firstPdfId = firstLesson?.materials?.[0]?.id;

  const handleContinue = () => {
    if (!enrolled && role === "student") {
      enrollMutation.mutate(course.id, {
        onSuccess: () => {
          setJustEnrolled(true);
          setTimeout(() => setJustEnrolled(false), 2500);
        }
      });
    }
    if (firstPdfId) {
      navigate({ to: "/reader" });
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
        <div className="relative h-48 lg:h-64 bg-cover bg-center" style={{ background: course.thumbnail_url || 'linear-gradient(135deg,#2563EB,#7C3AED)' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
        </div>
        <div className="p-6 lg:p-8 grid lg:grid-cols-[1fr_auto] gap-6 items-end">
          <div>
            <div className="text-xs font-semibold text-primary uppercase tracking-wider">{course.category}</div>
            <h2 className="mt-1 text-2xl lg:text-3xl font-bold tracking-tight">{course.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">by {course.instructor || "Unknown Instructor"}</p>
            <p className="mt-3 text-sm text-foreground/80 max-w-2xl">{course.description}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{lessons?.length || 0} lessons</span>
              <span className="inline-flex items-center gap-1"><FileText className="h-3.5 w-3.5" />{lessons?.reduce((acc: number, l: any) => acc + (l.materials?.length || 0), 0) || 0} materials</span>
            </div>
          </div>
          <div className="flex flex-col items-stretch gap-2">
            {enrolled && (
              <span className="inline-flex items-center justify-center gap-1.5 rounded-full bg-secondary/15 text-secondary px-3 py-1 text-[11px] font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {justEnrolled ? "Enrolled — let's go!" : "Enrolled"}
              </span>
            )}
            <button
              onClick={handleContinue}
              disabled={enrollMutation.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90 transition disabled:opacity-50"
            >
              <Play className="h-4 w-4" /> {enrollMutation.isPending ? "Enrolling..." : (enrolled ? "Continue learning" : "Enroll & start")}
            </button>
          </div>
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
                {(course.instructor || "U I").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
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
          {(!lessons || lessons.length === 0) && (
            <div className="py-8 text-center text-sm text-muted-foreground italic border border-border rounded-2xl bg-card">No lessons added to this course yet.</div>
          )}
          {lessons?.map((l: any, i: number) => (
            <div key={l.id} className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
              <button
                onClick={() => setOpenLesson(openLesson === l.id ? null : l.id)}
                className="w-full grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 text-left hover:bg-muted/50 transition"
              >
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary text-sm font-bold">{i + 1}</div>
                <div className="min-w-0">
                  <div className="font-semibold truncate">{l.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{l.materials?.length || 0} attached PDFs</div>
                </div>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition", openLesson === l.id && "rotate-180")} />
              </button>
              {openLesson === l.id && (
                <div className="px-5 pb-5 pt-2 border-t border-border bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-3">{l.description}</p>
                  <ul className="space-y-2">
                    {l.materials?.map((p: any) => (
                      <li key={p.id}>
                        <Link to="/reader" className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:border-primary transition">
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-destructive/10 text-destructive">
                            <FileType2 className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium">{p.title}</div>
                            <div className="text-xs text-muted-foreground">{formatBytes(p.size_bytes)}</div>
                          </div>
                          <Download className="h-4 w-4 text-muted-foreground shrink-0" />
                        </Link>
                      </li>
                    ))}
                    {(!l.materials || l.materials.length === 0) && (
                      <li className="text-xs text-muted-foreground italic">No materials uploaded yet.</li>
                    )}
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
            {lessons?.flatMap((l: any) => (l.materials || []).map((p: any) => ({ ...p, lesson: l.title }))).map((p: any) => (
              <li key={p.id} className="flex items-center gap-3 p-4 hover:bg-muted/50 transition">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive">
                  <FileType2 className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.lesson} · {formatBytes(p.size_bytes)}</div>
                </div>
                <Link to="/reader" className="text-xs font-semibold text-primary hover:underline">Open</Link>
              </li>
            ))}
            {(!lessons || lessons.every((l: any) => !l.materials || l.materials.length === 0)) && (
              <li className="p-8 text-center text-sm text-muted-foreground italic">No materials available for this course.</li>
            )}
          </ul>
        </div>
      )}
    </AppShell>
  );
}
