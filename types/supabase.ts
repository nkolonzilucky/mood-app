export type Mood = {
    id: number,
    text: string,
    created_at: string
}

// Database schema type
export type Database = {
    public: {
        Tables: {
            moods: {
                Row: Mood;  //What you get back from Supabase
                Insert: {
                    text: string;  //what you are allowed to insert
                };
                Update: {
                    text?: string;  //what you are allowed to update
                };
            }
        }
    }
}