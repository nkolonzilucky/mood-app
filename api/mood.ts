import { supabase } from "@/supabase";
import { Mood } from "@/types/supabase";

export async function insertMood(text: string): Promise<Mood[]> {
  const { data, error } = await supabase
    .from("moods")
    .insert({ text } as any)
    .select();
  if (error) {
    throw error;
  }

  return data as Mood[];
}

export async function getLastMood(): Promise<Mood | null> {
  const { data, error } = await supabase
    .from("moods")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);
  if (error) {
    throw error;
  }
  return data.length > 0 ? data[0] : null;
}

export async function deleteMoodById(id: number): Promise<void> {
  const { error } = await supabase.from("moods").delete().eq("id", id);
  if (error) {
    throw error;
  }
}