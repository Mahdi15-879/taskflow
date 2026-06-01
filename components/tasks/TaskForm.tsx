"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  onAdd: () => void;
};

export default function TaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");

  const addTask = async () => {
    if (!title.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("tasks").insert({
      title,
      status: "todo",
      user_id: user?.id,
    });
    await onAdd();

    setTitle("");
    onAdd();
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New task"
      />
      <button onClick={addTask}>Add</button>
    </div>
  );
}
