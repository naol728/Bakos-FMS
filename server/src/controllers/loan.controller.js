import { supabase } from "../config/supabase.js";
import { dbReadFactory } from "./dbReadFactory.js";

export const getLoans = async (req, res) => {
  const { data: loans, error } = await supabase.from("loans").select(`
      *,
      customer:customer_id (
        first_name,
        father_name,
        account_no,
        sex,
        age,
        deposit_amount,
        user_id,
        users:user_id (
          photo,
          phone,
          email
        )
      )
    `);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ loans });
};

export const depenseLoan = async (req, res) => {};
