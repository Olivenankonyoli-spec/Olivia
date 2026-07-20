import { useEffect, useState } from "react";
import type { Role } from "@/types/database";
import { supabase } from "./supabase";

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
  if (typeof window === "undefined") return "Guest";
  return localStorage.getItem(NAME_KEY) || "Guest";
}

export function setName(name: string) {
  localStorage.setItem(NAME_KEY, name);
  window.dispatchEvent(new Event("apex.name"));
}

export function useRole(): [Role, (r: Role) => void] {
  const [role, setLocal] = useState<Role>("student");
  
  useEffect(() => {
    setLocal(getRole());
    const onChange = () => setLocal(getRole());
    window.addEventListener("apex.role", onChange);
    window.addEventListener("storage", onChange);

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase
          .from("users")
          .select("role, full_name")
          .eq("id", session.user.id)
          .single();
          
        if (data && !error) {
          setRole(data.role as Role);
          setName(data.full_name);
        } else if (error && error.code === 'PGRST116') {
           // No user row yet, might be signing up.
        }
      }
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setRole("student");
        setName("Guest");
      } else if (session?.user) {
        const { data, error } = await supabase
          .from("users")
          .select("role, full_name")
          .eq("id", session.user.id)
          .single();
          
        if (data && !error) {
          setRole(data.role as Role);
          setName(data.full_name);
        }
      }
    });

    return () => {
      window.removeEventListener("apex.role", onChange);
      window.removeEventListener("storage", onChange);
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  return [role, (r) => { setRole(r); setLocal(r); }];
}
