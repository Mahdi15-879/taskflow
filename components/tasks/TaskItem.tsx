"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Pencil,
  Trash2,
  Check,
  X,
  Circle,
  CheckCircle2,
} from "lucide-react";

import type { Task } from "@/types/task";
import { useToast } from "@/components/ui/toast";

type Props = {
  task: Task;
};

export default function TaskItem({ task }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { showToast } = useToast();

  const runAction = async (action: () => Promise<unknown>) => {
    try {
      setLoading(true);
      await action();
    } catch (err) {
      console.error("Task action error:", err);
      showToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async () => {
    await runAction(async () => {
      const { error } = await supabase.from("tasks").delete().eq("id", task.id);

      if (error) throw error;

      showToast("Task deleted", "success");
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

      showToast("Task updated", "success");
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

      showToast("Task renamed", "success");
    });

    setIsEditing(false);
  };

  const isDone = task.status === "done";

  return (
    <div ref={setNodeRef} style={style} className="group">
      <div
        className={`flex items-center gap-3 rounded-xl border p-4
      transition-transform duration-200
      ${
        isDone
          ? "border-green-700 bg-green-900/20"
          : "border-slate-700 bg-slate-900/40"
      }
      hover:border-slate-500 hover:shadow-md hover:scale-[1.01]`}
      >
        <div
          {...listeners}
          {...attributes}
          className="opacity-70 group-hover:opacity-100 transition cursor-grab active:cursor-grabbing text-slate-500 hover:text-white p-1"
        >
          <GripVertical size={18} />
        </div>

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
                title="Save"
                className="rounded-lg bg-green-600 p-2 text-white hover:bg-green-500 disabled:opacity-50 cursor-pointer"
              >
                <Check size={16} />
              </button>

              <button
                onClick={() => setIsEditing(false)}
                disabled={loading}
                title="Cancel"
                className="rounded-lg bg-slate-700 p-2 text-white hover:bg-slate-600 cursor-pointer"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={toggleStatus}
                disabled={loading}
                title={isDone ? "Mark as Todo" : "Mark as Done"}
                className="rounded-lg bg-slate-800 p-2 text-white hover:bg-slate-700 cursor-pointer"
              >
                {isDone ? (
                  <CheckCircle2 size={18} className="text-green-400" />
                ) : (
                  <Circle size={18} />
                )}
              </button>

              <button
                onClick={() => setIsEditing(true)}
                disabled={loading}
                title="Edit Task"
                className="rounded-lg bg-slate-800 p-2 text-white hover:bg-slate-700 cursor-pointer"
              >
                <Pencil size={16} />
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={loading}
                title="Delete Task"
                className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-500 cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-[320px] rounded-xl border border-slate-700 bg-slate-900 p-5">
            <h3 className="text-lg font-semibold text-white">Delete task?</h3>

            <p className="mt-2 text-sm text-slate-400">
              This action cannot be undone.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-lg bg-slate-700 px-3 py-1 text-white hover:bg-slate-600 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  setShowDeleteModal(false);
                  await deleteTask();
                }}
                className="rounded-lg bg-red-600 px-3 py-1 text-white hover:bg-red-500 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
