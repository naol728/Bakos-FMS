import { supabase } from "../config/supabase.js";

/**
 * Generic DB Read Factory
 * @param {string} table - Name of the table
 * @param {object} [filters] - Optional filters { column: value }
 * @param {boolean} [single=false] - Return only one row
 * @returns {object} - { error, data }
 */
export const dbReadFactory = async (table, filters = {}, single = false) => {
  try {
    let query = supabase.from(table).select("*");

    // Apply filters if provided
    if (filters && Object.keys(filters).length > 0) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    // Fetch either a single row or multiple rows
    const { data, error } = single ? await query.single() : await query;

    if (error) {
      return {
        error: {
          message: "Failed to fetch data from the database",
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
