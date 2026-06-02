"use client";

import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { LogOut } from "lucide-react";

type Props = {
  user: User | null;
};

export default function Navbar({ user }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/70 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <h1 className="text-lg font-bold tracking-tight text-white">
          TaskFlow
        </h1>

        <div className="flex items-center gap-4">
          {user && (
            <span className="hidden text-sm text-slate-400 sm:block">
              {user.email}
            </span>
          )}

          {user && (
            <button
              onClick={() => supabase.auth.signOut()}
              className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-white transition hover:bg-slate-700 cursor-pointer"
            >
              <LogOut size={16} />
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
