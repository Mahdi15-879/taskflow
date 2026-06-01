"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Task } from "@/types/task";
import TaskForm from "@/components/tasks/TaskForm";

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    const { data } = await supabase.from("tasks").select("*");
    setTasks((data as Task[]) || []);
  };

  useEffect(() => {
    void fetchTasks();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Tasks</h1>

      <TaskForm onAdd={fetchTasks} />

      {tasks.map((task) => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  );
}
