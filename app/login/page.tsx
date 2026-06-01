"use client";

import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const loginGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/",
      },
    });
  };

  const loginGithub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:3000/",
      },
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>

      <button onClick={loginGoogle}>Login with Google</button>
      <br />
      <button onClick={loginGithub}>Login with GitHub</button>
    </div>
  );
}
