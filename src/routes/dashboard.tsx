import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useRole } from "@/lib/role";
import { adminStats, courses, growthData, recentEnrollments, announcements } from "@/lib/mock-data";
import { Users, BookOpen, ClipboardList, FileText, TrendingUp, Upload, PlayCircle, FileType2, Bell } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Apex Tutors" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const [role] = useRole();
  return (
    <AppShell
      title={role === "admin" ? "Admin overview" : role === "instructor" ? "Instructor dashboard" : "Welcome back"}
      subtitle={role === "student" ? "Pick up where you left off." : "Here's what's happening across your workspace."}
    >
      {role === "admin" && <AdminDash />}
      {role === "instructor" && <InstructorDash />}
      {role === "student" && <StudentDash />}
    </AppShell>
  );
}

function StatCard({ label, value, icon: Icon, tone = "primary", delta }: { label: string; value: string | number; icon: typeof Users; tone?: "primary" | "secondary" | "accent" | "muted"; delta?: string }) {
  const toneMap = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/15 text-secondary",
    accent: "bg-accent/20 text-accent-foreground",
    muted: "bg-muted text-foreground",
  } as const;
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-lift transition">
      <div className="flex items-start justify-between">
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${toneMap[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        {delta && <span className="text-xs font-semibold text-secondary inline-flex items-center gap-1"><TrendingUp className="h-3 w-3" />{delta}</span>}
      </div>
      <div className="mt-4 text-2xl font-bold tracking-tight">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function AdminDash() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total users" value={adminStats.users.toLocaleString()} icon={Users} tone="primary" delta="+12%" />
        <StatCard label="Total courses" value={adminStats.courses} icon={BookOpen} tone="secondary" delta="+4" />
        <StatCard label="Total lessons" value={adminStats.lessons} icon={ClipboardList} tone="accent" delta="+38" />
        <StatCard label="PDF materials" value={adminStats.materials.toLocaleString()} icon={FileText} tone="muted" delta="+92" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" title="Student growth">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.546 0.215 262)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="oklch(0.546 0.215 262)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 255)" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="currentColor" className="text-muted-foreground" />
              <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="currentColor" className="text-muted-foreground" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
              <Area dataKey="students" stroke="oklch(0.546 0.215 262)" strokeWidth={2.5} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Courses created">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 255)" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
              <Bar dataKey="courses" fill="oklch(0.72 0.13 190)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Recent uploads" action={<Link to="/materials" className="text-xs font-semibold text-primary hover:underline">View all</Link>}>
          <ul className="divide-y divide-border -mx-2">
            {courses.slice(0, 5).map((c, i) => (
              <li key={c.id} className="flex items-center gap-3 px-2 py-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive">
                  <FileType2 className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">Lecture {i + 1} — {c.title}.pdf</div>
                  <div className="text-xs text-muted-foreground">{c.instructor} · {2 + i} days ago</div>
                </div>
                <span className="text-xs text-muted-foreground">{(1 + i * 0.4).toFixed(1)} MB</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Recent enrollments">
          <ul className="divide-y divide-border -mx-2">
            {recentEnrollments.map((e) => (
              <li key={e.name + e.course} className="flex items-center gap-3 px-2 py-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground text-xs font-bold">
                  {e.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{e.name}</div>
                  <div className="truncate text-xs text-muted-foreground">enrolled in {e.course}</div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{e.time}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function InstructorDash() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My courses" value={4} icon={BookOpen} tone="primary" />
        <StatCard label="Uploaded PDFs" value={48} icon={FileText} tone="secondary" />
        <StatCard label="Students enrolled" value={312} icon={Users} tone="accent" />
        <StatCard label="Lessons published" value={62} icon={ClipboardList} tone="muted" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" title="Enrollment trend">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.72 0.13 190)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="oklch(0.72 0.13 190)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 255)" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
              <Area dataKey="students" stroke="oklch(0.72 0.13 190)" strokeWidth={2.5} fill="url(#g2)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Quick actions">
          <div className="space-y-2">
            <Link to="/materials" className="flex items-center gap-3 rounded-xl border border-border p-3 hover:border-primary hover:bg-primary/5 transition">
              <Upload className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Upload new PDF</span>
            </Link>
            <Link to="/lessons" className="flex items-center gap-3 rounded-xl border border-border p-3 hover:border-primary hover:bg-primary/5 transition">
              <ClipboardList className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Create lesson</span>
            </Link>
            <Link to="/courses" className="flex items-center gap-3 rounded-xl border border-border p-3 hover:border-primary hover:bg-primary/5 transition">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">New course</span>
            </Link>
          </div>
        </Card>
      </div>

      <Card title="Recent activity">
        <ul className="divide-y divide-border -mx-2">
          {recentEnrollments.map((e) => (
            <li key={e.name + e.course} className="flex items-center gap-3 px-2 py-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Users className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 text-sm">
                <span className="font-semibold">{e.name}</span> enrolled in <span className="font-medium">{e.course}</span>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{e.time}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function StudentDash() {
  const enrolled = courses.filter(c => c.enrolled);
  return (
    <div className="space-y-6">
      {/* Continue learning hero */}
      <div className="rounded-3xl bg-gradient-to-br from-primary to-secondary p-6 lg:p-8 text-primary-foreground shadow-lift relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative grid lg:grid-cols-[1fr_auto] gap-6 items-end">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider opacity-80">Continue learning</div>
            <h2 className="mt-2 text-2xl lg:text-3xl font-bold">{enrolled[0].title}</h2>
            <p className="mt-1 text-sm opacity-90">Lesson 3 of 12 · Applications of Differentiation</p>
            <div className="mt-4 h-2 w-full max-w-md rounded-full bg-white/20 overflow-hidden">
              <div className="h-full w-[35%] rounded-full bg-white" />
            </div>
          </div>
          <Link to="/reader" className="inline-flex items-center gap-2 rounded-xl bg-white text-primary px-4 py-2.5 text-sm font-semibold shadow-soft hover:bg-white/95 transition">
            <PlayCircle className="h-4 w-4" /> Resume
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Recent courses" action={<Link to="/courses" className="text-xs font-semibold text-primary hover:underline">Browse all</Link>}>
            <div className="grid sm:grid-cols-2 gap-4">
              {enrolled.map((c) => (
                <Link key={c.id} to="/courses/$id" params={{ id: c.id }} className="group rounded-2xl border border-border overflow-hidden hover:shadow-lift transition">
                  <div className="h-24" style={{ background: c.thumbnail }} />
                  <div className="p-4">
                    <div className="text-xs font-semibold text-primary">{c.category}</div>
                    <div className="mt-1 font-semibold group-hover:text-primary transition">{c.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{c.instructor}</div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          <Card title="Recently opened PDFs">
            <ul className="divide-y divide-border -mx-2">
              {[1,2,3].map((i) => (
                <li key={i} className="flex items-center gap-3 px-2 py-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive">
                    <FileType2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">Lecture {i} — Calculus Notes.pdf</div>
                    <div className="text-xs text-muted-foreground">Foundations of Calculus · opened {i}h ago</div>
                  </div>
                  <Link to="/reader" className="text-xs font-semibold text-primary hover:underline shrink-0">Open</Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card title="Announcements" action={<Bell className="h-4 w-4 text-muted-foreground" />}>
          <ul className="space-y-3">
            {announcements.map((a) => (
              <li key={a.title} className="rounded-2xl border border-border p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">{a.title}</div>
                  <span className="text-xs text-muted-foreground">{a.time}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{a.body}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children, action, className = "" }: { title: string; children: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-5 shadow-soft ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}
