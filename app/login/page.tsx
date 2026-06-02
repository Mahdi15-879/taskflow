"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const login = async (provider: "google" | "github") => {
    if (loading) return;

    try {
      setLoading(true);

      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${location.origin}/`,
        },
      });
    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center backdrop-blur">
        <h1 className="text-3xl font-bold text-white">Welcome to TaskFlow</h1>

        <p className="mt-2 text-sm text-slate-400">
          Sign in to manage your tasks
        </p>

        <div className="mt-8 space-y-3">
          <button
            onClick={() => login("google")}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-slate-200 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              "Redirecting..."
            ) : (
              <>
                <FcGoogle size={20} />
                Continue with Google
              </>
            )}
          </button>

          <button
            onClick={() => login("github")}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              "Redirecting..."
            ) : (
              <>
                <FaGithub size={18} />
                Continue with GitHub
              </>
            )}
          </button>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          Secure OAuth authentication powered by Supabase
        </p>
      </div>
    </div>
  );
}
