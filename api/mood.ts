import { supabase } from "@/supabase";

export async function insertMood(moodText: string) {
    const { data, error } = await supabase
        .from('moods')
        .insert([{ text: moodText }])
        .select()
    if (error) {
        throw error;
    }

    return data
}