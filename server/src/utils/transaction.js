import { supabase } from "../config/supabase.js";
import { dbInsertFactory } from "../controllers/dbInsertFactory.js";

export const transactionLog = async ({
  type,
  customer_id,
  amount,
  reference_id = null,
  direction,
}) => {
  try {
    const { error } = await dbInsertFactory("transactions", {
      type,
      customer_id,
      amount,
      reference_id,
      direction,
    });
    console.log(error);
    if (error) {
      console.log("Faild to save log", error.message);
    }
  } catch (err) {
    console.log("Unexpected transaction save error", err);
  }
};
