import { supabase } from "../config/supabase.js";

/**
 * Generic DB Update Factory
 * @param {string} table - Name of the table
 * @param {object} payload - The data to update
 * @param {object} match - Conditions to find the row(s) to update
 * @returns {object} - { error, data }
 */
export const dbUpdateFactory = async (
  table,
  payload,
  match,
  single = false
) => {
  try {
    if (!match || Object.keys(match).length === 0) {
      return { error: { message: "Update condition is required" }, data: null };
    }

    let query = supabase.from(table).update(payload).match(match).select("*");

    if (single) query = query.single();

    const { data, error } = await query;

    if (error) {
      return {
        error: { message: "Failed to update database", details: error.message },
        data: null,
      };
    }

    return { error: null, data };
  } catch (err) {
    return {
      error: { message: "Unexpected server error", details: err.message },
      data: null,
    };
  }
};
