import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Plus, MoreHorizontal } from "lucide-react";

export const Route = createFileRoute("/users")({
  head: () => ({ meta: [{ title: "Users — Apex Tutors" }] }),
  component: UsersPage,
});

const users = [
  { name: "Olivia Bennett", email: "olivia@apex.edu", role: "Student", courses: 4, status: "Active" },
  { name: "Noah Williams", email: "noah@apex.edu", role: "Student", courses: 2, status: "Active" },
  { name: "Dr. Amelia Chen", email: "amelia@apex.edu", role: "Instructor", courses: 3, status: "Active" },
  { name: "Prof. Liam Patel", email: "liam@apex.edu", role: "Instructor", courses: 2, status: "Active" },
  { name: "Mia Hernandez", email: "mia@apex.edu", role: "Student", courses: 5, status: "Active" },
  { name: "Ethan Brooks", email: "ethan@apex.edu", role: "Student", courses: 1, status: "Inactive" },
  { name: "Dr. Sara Okafor", email: "sara@apex.edu", role: "Instructor", courses: 4, status: "Active" },
];

function UsersPage() {
  return (
    <AppShell
      title="Users"
      subtitle="Manage students, instructors, and admins."
      actions={
        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90 transition">
          <Plus className="h-4 w-4" /> Invite user
        </button>
      }
    >
      <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-5">User</th>
                <th className="py-3 px-5 hidden md:table-cell">Role</th>
                <th className="py-3 px-5 hidden lg:table-cell">Courses</th>
                <th className="py-3 px-5 hidden sm:table-cell">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.email} className="hover:bg-muted/40 transition">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground text-xs font-bold">
                        {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-semibold">{u.name}</div>
                        <div className="truncate text-xs text-muted-foreground">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5 hidden md:table-cell">
                    <span className={`inline-flex rounded-lg px-2 py-0.5 text-xs font-semibold ${u.role === "Instructor" ? "bg-secondary/15 text-secondary" : "bg-primary/10 text-primary"}`}>{u.role}</span>
                  </td>
                  <td className="py-3 px-5 hidden lg:table-cell text-muted-foreground">{u.courses}</td>
                  <td className="py-3 px-5 hidden sm:table-cell">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${u.status === "Active" ? "text-secondary" : "text-muted-foreground"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${u.status === "Active" ? "bg-secondary" : "bg-muted-foreground"}`} />
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <button className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition ml-auto">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
