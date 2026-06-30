import { useEffect, useState } from "react";
import type { Role } from "./mock-data";

const KEY = "apex.role";
const NAME_KEY = "apex.name";

export function getRole(): Role {
  if (typeof window === "undefined") return "student";
  return (localStorage.getItem(KEY) as Role) || "student";
}

export function setRole(role: Role) {
  localStorage.setItem(KEY, role);
  window.dispatchEvent(new Event("apex.role"));
}

export function getName(): string {
  if (typeof window === "undefined") return "Alex Morgan";
  return localStorage.getItem(NAME_KEY) || "Alex Morgan";
}

export function setName(name: string) {
  localStorage.setItem(NAME_KEY, name);
}

export function useRole(): [Role, (r: Role) => void] {
  const [role, setLocal] = useState<Role>("student");
  useEffect(() => {
    setLocal(getRole());
    const onChange = () => setLocal(getRole());
    window.addEventListener("apex.role", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("apex.role", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  return [role, (r) => { setRole(r); setLocal(r); }];
}
