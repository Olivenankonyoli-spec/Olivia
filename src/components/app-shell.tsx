import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, BookOpen, GraduationCap, FileText, Library,
  Settings as SettingsIcon, LogOut, User as UserIcon, Bell, Search,
  Menu, X, Sparkles, ClipboardList,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useRole, getName } from "@/lib/role";
import type { Role } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard };

const navByRole: Record<Role, NavItem[]> = {
  admin: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/users", label: "Users", icon: Users },
    { to: "/courses", label: "Courses", icon: BookOpen },
    { to: "/lessons", label: "Lessons", icon: ClipboardList },
    { to: "/materials", label: "Materials", icon: FileText },
    { to: "/settings", label: "Settings", icon: SettingsIcon },
  ],
  instructor: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/courses", label: "My Courses", icon: BookOpen },
    { to: "/lessons", label: "Lessons", icon: ClipboardList },
    { to: "/materials", label: "Materials", icon: FileText },
    { to: "/users", label: "Students", icon: Users },
    { to: "/profile", label: "Profile", icon: UserIcon },
    { to: "/settings", label: "Settings", icon: SettingsIcon },
  ],
  student: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/courses", label: "My Courses", icon: GraduationCap },
    { to: "/library", label: "Library", icon: Library },
    { to: "/profile", label: "Profile", icon: UserIcon },
    { to: "/settings", label: "Settings", icon: SettingsIcon },
  ],
};

export function AppShell({ children, title, subtitle, actions }: { children: ReactNode; title: string; subtitle?: string; actions?: ReactNode }) {
  const [role, setRole] = useRole();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = navByRole[role];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 border-r border-border bg-sidebar transition-transform lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center gap-2 px-6 border-b border-sidebar-border">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-base font-bold tracking-tight">Apex Tutors</div>
            <div className="text-[11px] text-muted-foreground capitalize">{role} workspace</div>
          </div>
          <button className="ml-auto lg:hidden text-muted-foreground" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-0.5">
          {items.map((item) => {
            const active = pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3 border-t border-sidebar-border bg-sidebar">
          <div className="rounded-2xl bg-muted p-3">
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">View as</div>
            <div className="grid grid-cols-3 gap-1">
              {(["admin","instructor","student"] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={cn(
                    "rounded-lg px-2 py-1.5 text-[11px] font-semibold capitalize transition",
                    role === r ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => navigate({ to: "/login" })}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-destructive transition"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Backdrop */}
      {open && <div className="fixed inset-0 z-30 bg-foreground/20 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur lg:px-8">
          <button className="lg:hidden text-muted-foreground" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="relative hidden md:block flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search courses, lessons, materials…"
              className="w-full rounded-xl border border-input bg-muted/50 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 transition"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="relative grid h-9 w-9 place-items-center rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
            </button>
            <div className="flex items-center gap-2.5 rounded-xl border border-border px-2 py-1.5">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-primary to-secondary text-primary-foreground text-xs font-bold">
                {getName().split(" ").map(n => n[0]).join("")}
              </div>
              <div className="hidden sm:block leading-tight pr-1">
                <div className="text-xs font-semibold">{getName()}</div>
                <div className="text-[10px] text-muted-foreground capitalize">{role}</div>
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 py-6 lg:px-8 lg:py-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
