"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Task } from "@/types/task";
import TaskForm from "@/components/tasks/TaskForm";
import TaskItem from "@/components/tasks/TaskItem";

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);

    const { data } = await supabase.from("tasks").select("*");

    setTasks(data || []);
    setLoading(false);
  };

  useEffect(() => {
    void fetchTasks();
  }, []);

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
