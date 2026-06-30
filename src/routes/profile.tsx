import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useState } from "react";
import { useRole, getName, setName } from "@/lib/role";
import { Camera, Mail, Shield, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Apex Tutors" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const [role] = useRole();
  const [tab, setTab] = useState<"profile" | "security" | "notifications">("profile");
  const [name, setLocalName] = useState(getName());

  return (
    <AppShell title="Profile" subtitle="Manage your account and preferences.">
      <div className="rounded-3xl border border-border bg-card shadow-soft overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary to-secondary" />
        <div className="px-6 pb-6 -mt-12">
          <div className="flex items-end gap-4">
            <div className="relative">
              <div className="grid h-24 w-24 place-items-center rounded-3xl bg-gradient-to-br from-primary to-accent text-primary-foreground text-2xl font-bold ring-4 ring-card shadow-lift">
                {name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <button className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-card border border-border shadow-soft text-muted-foreground hover:text-primary transition">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="pb-1">
              <h2 className="text-xl font-bold">{name}</h2>
              <p className="text-sm text-muted-foreground capitalize">{role} · alex@apextutors.com</p>
            </div>
          </div>

          <div className="mt-6 border-b border-border">
            <div className="flex gap-1">
              {([["profile", "Profile"], ["security", "Security"], ["notifications", "Notifications"]] as const).map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)} className={cn("relative px-4 py-2.5 text-sm font-medium transition", tab === id ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
                  {label}
                  {tab === id && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 max-w-2xl">
            {tab === "profile" && (
              <div className="space-y-4">
                <Field label="Full name">
                  <input value={name} onChange={(e) => setLocalName(e.target.value)} className="field" />
                </Field>
                <Field label="Email">
                  <input defaultValue="alex@apextutors.com" type="email" className="field" />
                </Field>
                <Field label="Bio">
                  <textarea defaultValue="Lifelong learner focused on mathematics and computer science." rows={3} className="field resize-none" />
                </Field>
                <button onClick={() => setName(name)} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition">Save changes</button>
              </div>
            )}
            {tab === "security" && (
              <div className="space-y-4">
                <SettingRow icon={Shield} title="Change password" desc="Set a new password every 90 days for safety." action="Update" />
                <SettingRow icon={Mail} title="Two-factor authentication" desc="Add an extra layer of security with TOTP." action="Enable" />
              </div>
            )}
            {tab === "notifications" && (
              <div className="space-y-3">
                {[
                  ["New course materials", true],
                  ["Lesson announcements", true],
                  ["Weekly digest", false],
                  ["Mentions and replies", true],
                ].map(([label, on]) => (
                  <SettingRow key={label as string} icon={Bell} title={label as string} desc="Email and in-app" toggle={on as boolean} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .field { width: 100%; border-radius: 0.75rem; border: 1px solid var(--input); background: var(--card); padding: 0.625rem 0.85rem; font-size: 0.875rem; outline: none; transition: all .15s; }
        .field:focus { border-color: var(--primary); box-shadow: 0 0 0 4px color-mix(in oklab, var(--primary) 15%, transparent); }
      `}</style>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function SettingRow({ icon: Icon, title, desc, action, toggle }: { icon: typeof Shield; title: string; desc: string; action?: string; toggle?: boolean }) {
  const [on, setOn] = useState(!!toggle);
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border p-4">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      {action && <button className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold hover:border-primary hover:text-primary transition">{action}</button>}
      {toggle !== undefined && (
        <button onClick={() => setOn(!on)} className={cn("relative h-6 w-11 rounded-full transition", on ? "bg-primary" : "bg-muted")}>
          <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition", on ? "left-[22px]" : "left-0.5")} />
        </button>
      )}
    </div>
  );
}
