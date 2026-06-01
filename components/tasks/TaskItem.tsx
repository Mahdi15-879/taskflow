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
  const [newTitle, setNewTitle] = useState(task.title);
  const [loading, setLoading] = useState(false);

  // DELETE
  const deleteTask = async () => {
    if (!confirm("Delete this task?")) return;

    setLoading(true);

    await supabase.from("tasks").delete().eq("id", task.id);

    setLoading(false);
    onChange();
  };

  // TOGGLE STATUS
  const toggleStatus = async () => {
    setLoading(true);

    const newStatus = task.status === "done" ? "todo" : "done";

    await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", task.id);

    setLoading(false);
    onChange();
  };

  // UPDATE TITLE
  const updateTitle = async () => {
    if (!newTitle.trim()) return;

    setLoading(true);

    await supabase.from("tasks").update({ title: newTitle }).eq("id", task.id);

    setIsEditing(false);
    setLoading(false);
    onChange();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: 12,
        border: "1px solid #ddd",
        borderRadius: 8,
        marginBottom: 8,
        opacity: loading ? 0.6 : 1,
      }}
    >
      {/* LEFT SIDE */}
      <div style={{ flex: 1 }}>
        {isEditing ? (
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{
              padding: 6,
              width: "100%",
            }}
          />
        ) : (
          <>
            <div style={{ fontWeight: 600 }}>{task.title}</div>
            <div style={{ fontSize: 12, opacity: 0.6 }}>
              status: {task.status}
            </div>
          </>
        )}
      </div>

      {/* ACTIONS */}
      <div style={{ display: "flex", gap: 8, marginLeft: 10 }}>
        {isEditing ? (
          <>
            <button onClick={updateTitle}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <button onClick={toggleStatus}>Toggle</button>

            <button onClick={() => setIsEditing(true)}>Edit</button>

            <button onClick={deleteTask}>Delete</button>
          </>
        )}
      </div>
    </div>
  );
}
