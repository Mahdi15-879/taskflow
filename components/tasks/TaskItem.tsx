"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Task } from "@/types/task";

type Props = {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
};

export default function TaskItem({ task, onUpdate, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [loading, setLoading] = useState(false);

  const runAction = async (action: () => Promise<unknown>) => {
    try {
      setLoading(true);
      await action();
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async () => {
    if (!window.confirm("Delete this task?")) return;

    await runAction(async () => {
      const { error } = await supabase.from("tasks").delete().eq("id", task.id);

      if (error) throw error;

      onDelete(task.id);
    });
  };

  const toggleStatus = async () => {
    const newStatus = task.status === "done" ? "todo" : "done";

    await runAction(async () => {
      const { data, error } = await supabase
        .from("tasks")
        .update({ status: newStatus })
        .eq("id", task.id)
        .select()
        .single();

      if (error) throw error;

      if (data) onUpdate(data);
    });
  };

  const updateTitle = async () => {
    if (!title.trim()) return;

    await runAction(async () => {
      const { data, error } = await supabase
        .from("tasks")
        .update({ title })
        .eq("id", task.id)
        .select()
        .single();

      if (error) throw error;

      if (data) onUpdate(data);
    });

    setIsEditing(false);
  };

  const isDone = task.status === "done";

  return (
    <div
      className={`flex items-center justify-between rounded-xl border p-4 transition
        ${
          isDone
            ? "border-green-700 bg-green-900/20"
            : "border-slate-700 bg-slate-900/40"
        }
        hover:border-slate-500`}
    >
      <div className="flex-1">
        {isEditing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-blue-500"
          />
        ) : (
          <>
            <div
              className={`font-semibold ${
                isDone ? "line-through text-slate-500" : "text-white"
              }`}
            >
              {task.title}
            </div>

            <div
              className={`mt-1 text-xs ${
                isDone ? "text-green-400" : "text-slate-400"
              }`}
            >
              {task.status.toUpperCase()}
            </div>
          </>
        )}
      </div>

      <div className="ml-4 flex items-center gap-2">
        {isEditing ? (
          <>
            <button
              onClick={updateTitle}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-500 disabled:opacity-50 cursor-pointer"
            >
              Save
            </button>

            <button
              onClick={() => setIsEditing(false)}
              disabled={loading}
              className="rounded-lg bg-slate-700 px-3 py-1 text-sm text-white hover:bg-slate-600 cursor-pointer"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={toggleStatus}
              disabled={loading}
              className="rounded-lg bg-slate-800 px-3 py-1 text-sm text-white hover:bg-slate-700 cursor-pointer"
            >
              Toggle
            </button>

            <button
              onClick={() => setIsEditing(true)}
              disabled={loading}
              className="rounded-lg bg-slate-800 px-3 py-1 text-sm text-white hover:bg-slate-700 cursor-pointer"
            >
              Edit
            </button>

            <button
              onClick={deleteTask}
              disabled={loading}
              className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-500 cursor-pointer"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
