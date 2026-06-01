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
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId);

    setTasks(data || []);
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;

      setUser(currentUser);

      if (currentUser) {
        fetchTasks(currentUser.id);
      } else {
        setTasks([]);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>You are not logged in</h2>
        <a href="/login">Go to Login</a>
      </div>
    );
  }

  return (
    <div>
      <Navbar user={user} />

      <div style={{ padding: 20 }}>
        <h1>Tasks</h1>

        <p>Welcome {user.email}</p>

        <TaskForm onAdd={() => fetchTasks(user.id)} />

        {!tasks.length && (
          <div style={{ marginTop: 20, opacity: 0.6 }}>
            <p>📝 No tasks yet</p>
            <p>Create your first task to get started</p>
          </div>
        )}

        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onChange={() => fetchTasks(user.id)}
          />
        ))}
      </div>
    </div>
  );
}
