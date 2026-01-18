import { createClient } from "@supabase/supabase-js";
import { Database } from "./types/supabase";

const SUPABASE_URL = "https://ggkybhuedxrxiaflsthn.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_swNuxulzMNMTYaQq2u6Axg_Xh9YrbmO";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
