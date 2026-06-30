import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sparkles, Mail, Lock, User, ArrowRight, GraduationCap, BookOpen } from "lucide-react";
import { useState } from "react";
import { setRole, setName } from "@/lib/role";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — Apex Tutors" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [role, setLocalRole] = useState<"student" | "instructor">("student");
  const [fullName, setFullName] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName) setName(fullName);
    setRole(role);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-lg">
        <Link to="/login" className="mb-8 inline-flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold">Apex Tutors</span>
        </Link>

        <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Join thousands of learners and educators on Apex.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field icon={User} label="Full name">
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="field-input" placeholder="Jane Doe" required />
            </Field>
            <Field icon={Mail} label="Email">
              <input type="email" className="field-input" placeholder="you@school.edu" required />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field icon={Lock} label="Password">
                <input type="password" className="field-input" required />
              </Field>
              <Field icon={Lock} label="Confirm password">
                <input type="password" className="field-input" required />
              </Field>
            </div>

            <div>
              <span className="text-sm font-medium">I'm joining as</span>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <RoleCard active={role === "student"} onClick={() => setLocalRole("student")} icon={GraduationCap} title="Student" desc="Enroll and learn" />
                <RoleCard active={role === "instructor"} onClick={() => setLocalRole("instructor")} icon={BookOpen} title="Instructor" desc="Teach and publish" />
              </div>
            </div>

            <button type="submit" className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90 active:scale-[0.99] transition">
              Create account
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>

            <div className="text-center text-sm text-muted-foreground pt-1">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .field-input { width: 100%; border-radius: 0.75rem; border: 1px solid var(--input); background: var(--card); padding: 0.7rem 0.9rem 0.7rem 2.4rem; font-size: 0.875rem; outline: none; transition: all .15s; }
        .field-input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px color-mix(in oklab, var(--primary) 15%, transparent); }
      `}</style>
    </div>
  );
}

function Field({ icon: Icon, label, children }: { icon: typeof Mail; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <div className="relative mt-1.5">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        {children}
      </div>
    </label>
  );
}

function RoleCard({ active, onClick, icon: Icon, title, desc }: { active: boolean; onClick: () => void; icon: typeof User; title: string; desc: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border p-4 text-left transition",
        active ? "border-primary bg-primary/5 ring-4 ring-primary/10" : "border-border hover:border-primary/40"
      )}
    >
      <Icon className={cn("h-5 w-5 mb-2", active ? "text-primary" : "text-muted-foreground")} />
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </button>
  );
}
