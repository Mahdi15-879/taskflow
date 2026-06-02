"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { PlusCircle, Plus } from "lucide-react";

export default function TaskForm() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const addTask = async () => {
    if (!title.trim() || loading) return;

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { error } = await supabase.from("tasks").insert({
        title,
        status: "todo",
        user_id: user.id,
      });

      if (error) throw error;

      setTitle("");
    } catch (err) {
      console.error(err);
      alert("Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 flex gap-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Write a new task..."
        className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white outline-none focus:border-blue-500"
        onKeyDown={(e) => {
          if (e.key === "Enter") addTask();
        }}
        disabled={loading}
      />

      <button
        onClick={addTask}
        disabled={loading}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-500 disabled:opacity-50 cursor-pointer"
      >
        {loading ? (
          "Adding..."
        ) : (
          <>
            <PlusCircle size={18} />
            Add Task
          </>
        )}
      </button>
    </div>
  );
}
