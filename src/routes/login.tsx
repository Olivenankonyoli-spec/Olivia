import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sparkles, Mail, Lock, ArrowRight, GraduationCap, BookOpen, Users } from "lucide-react";
import { useState } from "react";
import { setRole } from "@/lib/role";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Apex Tutors" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("alex@apextutors.com");
  const [password, setPassword] = useState("••••••••");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary via-primary to-secondary text-primary-foreground overflow-hidden">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />
        <div className="relative flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">Apex Tutors</span>
        </div>
        <div className="relative space-y-6">
          <h2 className="text-4xl font-bold leading-tight">
            Learning, organized beautifully.
          </h2>
          <p className="text-primary-foreground/80 max-w-md">
            A modern home for courses, lessons, and materials — built for students, instructors, and administrators.
          </p>
          <div className="grid grid-cols-3 gap-3 max-w-md">
            {[
              { icon: BookOpen, label: "64 Courses" },
              { icon: GraduationCap, label: "1.2k Learners" },
              { icon: Users, label: "120 Tutors" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/10 backdrop-blur p-4">
                <s.icon className="h-5 w-5 mb-2" />
                <div className="text-sm font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-xs text-primary-foreground/70">© 2026 Apex Tutors. All rights reserved.</div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">Apex Tutors</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to continue your learning journey.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <Field icon={Mail} label="Email">
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="field-input" placeholder="you@school.edu" />
            </Field>
            <Field icon={Lock} label="Password">
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="field-input" />
            </Field>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-border accent-primary" />
                Remember me
              </label>
              <a className="font-medium text-primary hover:underline" href="#">Forgot password?</a>
            </div>

            <button type="submit" className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90 active:scale-[0.99] transition">
              Sign in
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>

            <div className="text-center text-sm text-muted-foreground pt-2">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-primary hover:underline">Create one</Link>
            </div>

            <div className="pt-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center mb-2">Demo — sign in as</div>
              <div className="grid grid-cols-3 gap-2">
                {(["admin","instructor","student"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => { setRole(r); navigate({ to: "/dashboard" }); }}
                    className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold capitalize hover:border-primary hover:text-primary transition"
                  >
                    {r}
                  </button>
                ))}
              </div>
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
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="relative mt-1.5">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        {children}
      </div>
    </label>
  );
}
