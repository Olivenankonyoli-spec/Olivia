import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useEffect, useState } from "react";
import { Sun, Moon, Globe, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Apex Tutors" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const t = (localStorage.getItem("apex.theme") as "light" | "dark") || "light";
    setTheme(t);
    document.documentElement.classList.toggle("dark", t === "dark");
  }, []);
  const apply = (t: "light" | "dark") => {
    setTheme(t);
    localStorage.setItem("apex.theme", t);
    document.documentElement.classList.toggle("dark", t === "dark");
  };

  return (
    <AppShell title="Settings" subtitle="Personalize how Apex looks and feels.">
      <div className="grid lg:grid-cols-3 gap-6">
        <Section title="Appearance" desc="Choose how the interface looks to you.">
          <div className="grid grid-cols-2 gap-3">
            <ThemeCard active={theme === "light"} onClick={() => apply("light")} icon={Sun} label="Light" />
            <ThemeCard active={theme === "dark"} onClick={() => apply("dark")} icon={Moon} label="Dark" />
          </div>
        </Section>

        <Section title="Language" desc="Set your preferred language.">
          <div className="relative">
            <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select className="w-full rounded-xl border border-input bg-card pl-9 pr-3 py-2.5 text-sm outline-none focus:border-primary">
              <option>English (US)</option>
              <option>Español</option>
              <option>Français</option>
              <option>Deutsch</option>
              <option>العربية</option>
            </select>
          </div>
        </Section>

        <Section title="Notifications" desc="What we should ping you about.">
          <div className="space-y-2">
            {["Course announcements", "New materials", "Weekly digest"].map((l, i) => (
              <Toggle key={l} label={l} defaultOn={i !== 2} />
            ))}
          </div>
        </Section>
      </div>
    </AppShell>
  );
}

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-xs text-muted-foreground mb-4">{desc}</p>
      {children}
    </div>
  );
}

function ThemeCard({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: typeof Sun; label: string }) {
  return (
    <button onClick={onClick} className={cn("rounded-2xl border p-4 text-left transition", active ? "border-primary bg-primary/5 ring-4 ring-primary/10" : "border-border hover:border-primary/40")}>
      <Icon className={cn("h-5 w-5 mb-2", active ? "text-primary" : "text-muted-foreground")} />
      <div className="text-sm font-semibold">{label}</div>
    </button>
  );
}

function Toggle({ label, defaultOn = true }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5">
      <div className="flex items-center gap-2 text-sm"><Bell className="h-4 w-4 text-muted-foreground" />{label}</div>
      <button onClick={() => setOn(!on)} className={cn("relative h-6 w-11 rounded-full transition", on ? "bg-primary" : "bg-muted")}>
        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition", on ? "left-[22px]" : "left-0.5")} />
      </button>
    </div>
  );
}
