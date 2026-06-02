export type Task = {
  id: string;
  title: string;
  status: "todo" | "done";
  description?: string | null;
  project_id?: string;
  created_at?: string;
  user_id: string;
};
