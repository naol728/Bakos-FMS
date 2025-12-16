import { supabase } from "../config/supabase.js";
import { dbReadFactory } from "./dbReadFactory.js";

export const getFinancialReport = async (req, res) => {
  // Fetch transactions
  console.log("hello there ");
  const { data: transactions, error: transactionErr } = await dbReadFactory(
    "transactions"
  );

  if (transactionErr) {
    return res.status(500).json({
      message: "Failed to fetch transactions",
      error: transactionErr,
    });
  }

  // Fetch pending withdraw requests
  const { data: withdrawRequests, error: withdrawRequestErr } =
    await dbReadFactory("withdraw_requests", { status: "pending" });

  if (withdrawRequestErr) {
    return res.status(500).json({
      message: "Failed to fetch withdraw requests",
      error: withdrawRequestErr,
    });
  }

  // Send successful response
  res.status(200).json({
    message: "Financial report fetched successfully",
    data: {
      transactions,
      withdrawRequests,
    },
  });
};

export const getdepositReport = async (req, res) => {
  const { data, error } = await supabase
    .from("deposits")
    .select(
      `
          id,
          amount,
          created_at,
          source,
          customer:customer_id (
            id,
            first_name,
            father_name,
            grand_father_name,
            deposit_amount,
            account_no,
            users:user_id (
              photo,
              phone,
              email
            )
          )
        `
    )
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(400).json({
      message: "Failed to fetch deposit report",
      error: error.message,
    });
  }

  res.status(200).json({
    message: "Successfully fetched the deposit report",
    data,
  });
};

export const getLoanreport = async (req, res) => {
  // Fetch issued loans
  const { data: loans, error: loanserr } = await supabase
    .from("loans")
    .select(
      `
      id,
      amount,
      interest_rate,
      created_at,
      repayment_years,
      customer:customer_id (
        id,
        first_name,
        father_name,
        grand_father_name,
        deposit_amount,
        account_no,
        users:user_id (
          photo,
          phone,
          email
        )
      )
    `
    )
    .order("created_at", { ascending: false });

  if (loanserr) {
    return res.status(400).json({
      message: "Failed to fetch loans",
      error: loanserr.message,
    });
  }

  // Fetch loan requests
  const { data: loanreq, error: loanreqerr } = await supabase
    .from("loan_requests")
    .select(
      `
      id,
      amount,
      status,
      repayment_years,
      created_at,
      customer:customer_id (
        id,
        first_name,
        father_name,
        grand_father_name,
        deposit_amount,
        account_no,
        users:user_id (
          photo,
          phone,
          email
        )
      )
    `
    )
    .order("created_at", { ascending: false });

  if (loanreqerr) {
    return res.status(400).json({
      message: "Failed to fetch loan requests",
      error: loanreqerr.message,
    });
  }

  res.status(200).json({
    message: "Successfully fetched the loan stats",
    loans,
    loanreq,
  });
};
