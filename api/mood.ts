import { supabase } from "@/supabase";
import { Mood } from "@/types/supabase";


export async function insertMood(
  text: string | null,
  level: number,
): Promise<Mood[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No authenticated user.");
  const { data, error } = await supabase
    .from("moods")
    .insert({ text, level, user_id: user?.id } as any)
    .select();
  if (error) {
    console.log(error);
    throw error;
  }

  return data as Mood[];
}

export async function getLastMood(): Promise<Mood | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No Authenticated user");
  }
    const { data, error } = await supabase
      .from("moods")
      .select("*")
      .eq("user_id", user?.id)
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

export async function getAllMoods(): Promise<Mood[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Now Authenticated user");
  }
  const { data, error } = await supabase
    .from("moods")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateMoodById(
  id: number,
  newText: string | null,
  level: number,
): Promise<void> {
  const { error } = await supabase
    .from("moods")
    .update({ text: newText, level: level } as never)
    .eq("id", id);
  if (error) throw error;
}