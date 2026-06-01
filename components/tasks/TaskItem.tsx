"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Task } from "@/types/task";

type Props = {
  task: Task;
  onChange: () => void;
};

export default function TaskItem({ task, onChange }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [loading, setLoading] = useState(false);

  const runAction = async (action: () => Promise<unknown>) => {
    try {
      setLoading(true);
      await action();
      onChange();
    } catch (err) {
      console.error("Task action error:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    await runAction(async () => {
      const { error } = await supabase.from("tasks").delete().eq("id", task.id);

      if (error) throw error;
    });
  };

  const toggleStatus = async () => {
    const newStatus = task.status === "done" ? "todo" : "done";

    await runAction(async () => {
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus })
        .eq("id", task.id);

      if (error) throw error;
    });
  };

  const updateTitle = async () => {
    if (!title.trim()) return;

    await runAction(async () => {
      const { error } = await supabase
        .from("tasks")
        .update({ title })
        .eq("id", task.id);

      if (error) throw error;
    });

    setIsEditing(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: 14,
        border: "1px solid #e5e5e5",
        borderRadius: 10,
        marginBottom: 10,
        background: "#fff",
        opacity: loading ? 0.6 : 1,
      }}
    >
      <div style={{ flex: 1 }}>
        {isEditing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              padding: 8,
              width: "100%",
              border: "1px solid #ddd",
              borderRadius: 6,
            }}
          />
        ) : (
          <>
            <div style={{ fontWeight: 600 }}>{task.title}</div>
            <div style={{ fontSize: 12, opacity: 0.6 }}>
              {task.status.toUpperCase()}
            </div>
          </>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginLeft: 12 }}>
        {isEditing ? (
          <>
            <button onClick={updateTitle} disabled={loading}>
              Save
            </button>
            <button onClick={() => setIsEditing(false)} disabled={loading}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={toggleStatus} disabled={loading}>
              Toggle
            </button>

            <button onClick={() => setIsEditing(true)} disabled={loading}>
              Edit
            </button>

            <button onClick={deleteTask} disabled={loading}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
