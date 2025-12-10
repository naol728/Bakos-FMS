import { supabase } from "../config/supabase.js";

/**
 * Generic DB Insert Factory
 * @param {string} table - Name of the table
 * @param {object} payload - The data to insert
 * @returns {object} - { error, data }
 */
export const dbInsertFactory = async (table, payload) => {
  try {
    const { data, error } = await supabase.from(table).insert([payload]);

    if (error) {
      return {
        error: {
          message: "Failed to insert into database",
          details: error.message,
        },
        data: null,
      };
    }

    return { error: null, data };
  } catch (err) {
    return {
      error: {
        message: "Unexpected server error",
        details: err.message,
      },
      data: null,
    };
  }
};
