import { supabase } from "@/lib/supabase";

export default async function Page() {
  const { data, error } = await supabase.from("tasks").select("*");
  
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Tasks</h1>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
