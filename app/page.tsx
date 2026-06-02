"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { Task } from "@/types/task";

import Navbar from "@/components/layout/Navbar";
import TaskForm from "@/components/tasks/TaskForm";
import TaskItem from "@/components/tasks/TaskItem";

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async (userId: string) => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error) setTasks(data || []);
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;

      setUser(currentUser);

      if (currentUser) {
        void fetchTasks(currentUser.id);
      } else {
        setTasks([]);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("tasks-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newTask = payload.new as Task;

          if (payload.eventType === "INSERT") {
            setTasks((prev) => {
              const exists = prev.some((t) => t.id === newTask.id);
              if (exists) return prev;
              return [newTask, ...prev];
            });
          }

          if (payload.eventType === "UPDATE") {
            setTasks((prev) =>
              prev.map((t) => (t.id === newTask.id ? newTask : t)),
            );
          }

          if (payload.eventType === "DELETE") {
            const deletedId = payload.old?.id;
            if (!deletedId) return;

            setTasks((prev) => prev.filter((t) => t.id !== deletedId));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-semibold">You are not logged in</h2>

        <a
          href="/login"
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium transition hover:bg-blue-500"
        >
          Go to Login
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar user={user} />

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">My Tasks</h1>

          <p className="mt-2 text-slate-400">
            Manage your tasks and stay productive.
          </p>
        </div>

        <TaskForm />

        {tasks.length === 0 ? (
          <div className="mt-10 rounded-xl border border-slate-700 bg-slate-800/50 p-8 text-center">
            <div className="text-4xl">📝</div>

            <h3 className="mt-4 text-lg font-semibold">No tasks yet</h3>

            <p className="mt-2 text-slate-400">
              Create your first task to get started.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
