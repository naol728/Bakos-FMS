import { supabase } from "../config/supabase.js";
import { dbInsertFactory } from "./dbInsertFactory.js";
import { dbReadFactory } from "./dbReadFactory.js";

export const createFeedback = async (req, res) => {
  const userid = req.user.id;
  const { message } = req.body;
  const { data: user, error: usererr } = await dbReadFactory(
    "customers",
    {
      user_id: userid,
    },
    true
  );
  const { data, error } = await dbInsertFactory("feedback", {
    customer_id: user.id,
    message,
  });

  if (error || usererr) {
    return res.status(400).json({
      message: "error while inserting the data ",
      error,
      usererr,
    });
  }

  res.status(201).json({
    message: "sucessfully added",
    data,
  });
};
export const getFeedbaks = async (req, res) => {
  const { data, error } = await supabase
    .from("feedback")
    .select(
      `
      id,
      message,
      created_at,
      customer:customer_id (
        account_no,
        first_name,
        father_name,
        grand_father_name,
        sex,
        age,
        deposit_amount,
        user_id,
        user:user_id(
        photo,
        phone
        )
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(400).json({
      message: "Failed to fetch feedback",
      details: error.message,
    });
  }

  return res.status(200).json({
    message: "Successfully fetched feedback",
    data,
  });
};
