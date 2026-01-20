export type Mood = {
  id: number;
  text: string | null;
  created_at: string;
  level: number;
  user_id: string;
};

// Database schema type
export type Database = {
  public: {
    Tables: {
      moods: {
        Row: Mood; //What you get back from Supabase
        Insert: {
          text?: string | null | undefined; //what you are allowed to insert
          level: number;
          user_id: string;
        };
        Update: {
          text?: string | null; //what you are allowed to update
          level?: number;
        };
      };
    };
  };
};