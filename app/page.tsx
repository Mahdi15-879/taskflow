"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Task } from "@/types/task";
import type { User } from "@supabase/supabase-js";
import TaskForm from "@/components/tasks/TaskForm";
import TaskItem from "@/components/tasks/TaskItem";

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
  };

  const fetchTasks = async () => {
    setLoading(true);

    const currentUser = await getUser();

    setUser(currentUser);

    if (!currentUser) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", currentUser.id);

    setTasks(data || []);
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    void fetchTasks();
  }, []);

  if (!user && !loading) {
    return (
      <div style={{ padding: 20 }}>
        <h2>You are not logged in</h2>
        <a href="/login">Go to Login</a>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Tasks</h1>

      <TaskForm onAdd={fetchTasks} />

      {!loading && tasks.length === 0 && (
        <p>No tasks yet. Create your first task 🚀</p>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        tasks.map((task) => (
          <TaskItem key={task.id} task={task} onChange={fetchTasks} />
        ))
      )}
    </div>
  );
}
