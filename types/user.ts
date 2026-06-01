export type AppUser = {
  id: string;
  email: string | null;
  phone?: string | null;
  created_at: string;
  updated_at?: string | null;

  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };

  app_metadata: {
    provider?: string;
    providers?: string[];
  };
};
