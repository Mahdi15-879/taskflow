"use client";

import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

type Props = {
  user: User | null;
};

export default function Navbar({ user }: Props) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 20px",
        borderBottom: "1px solid #eee",
      }}
    >
      <h2 style={{ margin: 0 }}>TaskFlow</h2>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {user && <span>{user.email}</span>}

        {user && (
          <button
            onClick={() => supabase.auth.signOut()}
            style={{
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
