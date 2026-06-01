"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { Task } from "@/types/task";

import TaskForm from "@/components/tasks/TaskForm";
import TaskItem from "@/components/tasks/TaskItem";

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // 📌 fetch tasks فقط بر اساس user
  const fetchTasks = async (currentUser: User) => {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", currentUser.id);

    setTasks(data || []);
  };

  const reloadTasks = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await fetchTasks(user);
  };

  // 🔥 AUTH LISTENER (core of app)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;

      setUser(currentUser);

      if (currentUser) {
        fetchTasks(currentUser);
      } else {
        setTasks([]);
      }

      setLoading(false); // ✅ فقط اینو اضافه کن
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 🟡 loading state
  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <p>Loading...</p>
      </div>
    );
  }

  // 🔴 not logged in UI
  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>You are not logged in</h2>
        <a href="/login">Go to Login</a>
      </div>
    );
  }

  // 🟢 main app
  return (
    <div style={{ padding: 20 }}>
      <h1>Tasks</h1>

      <p>Welcome {user.email}</p>

      <TaskForm onAdd={reloadTasks} />

      {tasks.length === 0 && <p>No tasks yet. Create your first task 🚀</p>}

      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onChange={reloadTasks} />
      ))}
    </div>
  );
}
