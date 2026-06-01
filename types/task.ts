export type Task = {
  id: string;
  title: string;
  status: "todo" | "doing" | "done";
  description?: string | null;
  project_id?: string;
  created_at?: string;
};
