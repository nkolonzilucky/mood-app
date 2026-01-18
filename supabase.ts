import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ggkybhuedxrxiaflsthn.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_swNuxulzMNMTYaQq2u6Axg_Xh9YrbmO";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
