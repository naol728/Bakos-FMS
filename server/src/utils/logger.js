import { supabase } from "../config/supabase.js";
export const logEvent = async ({
  user_id = null,
  action_type,
  message,
  level = "INFO",
  meta = {},
}) => {
  try {
    const { error } = await supabase.from("logs").insert([
      {
        user_id,
        action_type,
        message,
        level,
        meta,
      },
    ]);
    if (error) {
      console.error("Failed to save log:", error.message);
    }
  } catch (err) {
    console.error("Unexpected logger error:", err);
  }
};
