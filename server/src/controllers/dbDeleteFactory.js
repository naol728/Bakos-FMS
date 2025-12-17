import { supabase } from "../config/supabase.js";

/**
 * Generic DB Delete Factory
 * @param {string} table - Name of the table
 * @param {object} match - Conditions to find the row(s) to delete
 * @returns {object} - { error, data }
 */
export const dbDeleteFactory = async (table, match) => {
  try {
    if (!match || Object.keys(match).length === 0) {
      return {
        error: { message: "Delete condition is required", details: null },
        data: null,
      };
    }

    const { data, error } = await supabase
      .from(table)
      .delete()
      .match(match)
      .select("*")
      .single();

    if (error) {
      return {
        error: {
          message: "Failed to delete from database",
          details: error.message,
        },
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
