import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sparkles, Mail, Lock, User, ArrowRight, GraduationCap } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — Apex Tutors" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (authError) {
      setError(authError.message);
    } else {
      navigate({ to: "/dashboard" });
    }
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
            {error && <div className="text-sm font-medium text-destructive">{error}</div>}
            <Field icon={User} label="Full name">
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="field-input" placeholder="Jane Doe" required />
            </Field>
            <Field icon={Mail} label="Email">
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="field-input" placeholder="you@school.edu" required />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field icon={Lock} label="Password">
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="field-input" required />
              </Field>
              <Field icon={Lock} label="Confirm password">
                <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" className="field-input" required />
              </Field>
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
