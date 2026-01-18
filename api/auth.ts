import { supabase } from "@/supabase";

export async function sendMagicLink(email: string) {
    const { error } = await supabase.auth.signInWithOtp({
        email
    })

    if(error) throw error
}