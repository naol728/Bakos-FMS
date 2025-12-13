import { supabase } from "../config/supabase.js";
import { dbInsertFactory } from "./dbInsertFactory.js";
import { dbReadFactory } from "./dbReadFactory.js";
import { dbUpdateFactory } from "./dbUpdateFactory.js";

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

export const depenseLoan = async (req, res) => {
  const { amount, user_id, id } = req.body;
  if (!amount || !user_id || !id) {
    res.status(400).json({
      message: "amount and user_id and loan id isrequired",
    });
  }
  const { error: loanupdaterr } = await dbUpdateFactory(
    "loans",
    {
      is_despens: true,
    },
    { id },
    true
  );
  if (loanupdaterr) {
    res.status(400).json({
      message: "Loan Update error",
      loanupdaterr,
    });
  }
  const { data: customer, error: customererr } = await dbReadFactory(
    "customers",
    {
      user_id: user_id,
    }
  );
  const { data, error } = await dbUpdateFactory(
    "customers",
    {
      deposit_amount: customer.deposit_amount + amount,
    },
    {
      user_id: user_id,
    }
  );

  if (error) {
    res.status(400).json({
      message: error.message,
      error,
    });
  }
  res.status(200).json({
    message: "sucessfully despensed loan",
    data,
  });
};
export const repayLoan = async (req, res) => {
  // 1️⃣ Convert amount to number immediately
  const amount = Number(req.body.amount);
  const { id } = req.body;

  /* ---------------- VALIDATION ---------------- */

  if (!id || Number.isNaN(amount)) {
    return res.status(400).json({
      message: "Valid loan id and amount are required",
    });
  }

  if (amount <= 0) {
    return res.status(400).json({
      message: "Repayment amount must be greater than zero",
    });
  }

  /* ---------------- FETCH LOAN ---------------- */

  const { data: loan, error: loanerr } = await dbReadFactory(
    "loans",
    { id },
    true
  );
  console.log(loan);

  if (loanerr || !loan) {
    return res.status(404).json({
      message: "Loan not found",
      loanerr,
    });
  }

  /* ---------------- BUSINESS RULES ---------------- */

  if (amount > loan.amount) {
    return res.status(400).json({
      message: "Repayment amount exceeds remaining loan balance",
      remaining_balance: loan.amount,
    });
  }

  /* ---------------- INSERT REPAYMENT ---------------- */

  const { data: repayment, error: repaymenterr } = await dbInsertFactory(
    "repayments",
    {
      loan_id: id,
      amount, // ✅ number
    }
  );

  if (repaymenterr) {
    return res.status(400).json({
      message: "Failed to record repayment",
      repaymenterr,
    });
  }

  /* ---------------- UPDATE LOAN BALANCE ---------------- */

  const newBalance = Number(loan.amount) - amount;

  const { error: updateerr } = await dbUpdateFactory(
    "loans",
    {
      amount: newBalance, // ✅ number
    },
    { id }
  );

  if (updateerr) {
    return res.status(400).json({
      message: "Repayment recorded but loan update failed",
      updateerr,
    });
  }

  /* ---------------- SUCCESS ---------------- */

  return res.status(200).json({
    message: "Loan repayment successful",
    repayment,
    loan: {
      id,
      previous_balance: loan.amount,
      paid_amount: amount,
      remaining_balance: newBalance,
    },
  });
};
