import { env } from "./env.js";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(env.supabaseUrl, env.supabaseServiceKey);
