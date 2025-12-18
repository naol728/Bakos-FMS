import { supabase } from "../config/supabase.js";
import { dbInsertFactory } from "./dbInsertFactory.js";
import { dbReadFactory } from "./dbReadFactory.js";
import { dbUpdateFactory } from "./dbUpdateFactory.js";
import { dbDeleteFactory } from "./dbDeleteFactory.js";
import { transactionLog } from "../utils/transaction.js";
import { deposittype } from "../utils/type.js";

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
    return res.status(400).json({
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
  const { data: customer, error: customererr } = await supabase
    .from("customers")
    .select("*")
    .eq("id", user_id)
    .single();
  console.log(customer);
  const { data, error } = await supabase
    .from("customers")
    .update({ deposit_amount: customer.deposit_amount + amount })
    .eq("id", user_id)
    .single();

  console.log(data);

  if (error) {
    return res.status(400).json({
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
      amount,
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

  const { error: updateerr, data } = await dbUpdateFactory(
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
  await transactionLog({
    type: deposittype[3],
    customer_id: data.customer_id,
    amount,
    reference_id: data.id,
    direction: "in",
  });
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
export const getLoanRequests = async (req, res) => {
  const { data, error } = await supabase.from("loan_requests").select(`
      *,
      customer:customer_id (
        first_name,
        father_name,
        grand_father_name,
        deposit_amount,
        account_no,
        user_id,
        users:user_id (
          photo,
          phone,
          email
        ),
        deposits:deposits (
          amount,
          source,
          created_at
        )
      )
    `);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(200).json({
    success: true,
    data,
  });
};
export const updateStatusLoanCommite = async (req, res) => {
  const { id } = req.params;
  const { committee_comment, status } = req.body;
  if (!committee_comment || !status || !id) {
    return res.status(400).json({
      message: "commitee_comment status id require",
    });
  }
  const { data, error } = await dbUpdateFactory(
    "loan_requests",
    {
      status,
      committee_comment,
    },
    { id }
  );
  if (error) {
    return res.status(400).json({
      message: "error updating status ",
    });
  }
  res.status(200).json({
    message: "Sucessfully Updated status",
    data,
  });
};

export const updateStatusManager = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // 1️⃣ Validate input
  if (!id) {
    return res.status(400).json({
      message: "Loan request id is required",
    });
  }

  if (!status) {
    return res.status(400).json({
      message: "Status is required",
    });
  }

  // 2️⃣ Update loan request status
  const { data: updatedRequest, error: updateError } = await dbUpdateFactory(
    "loan_requests",
    { status },
    { id }
  );

  if (updateError || !updatedRequest) {
    return res.status(400).json({
      message: "Failed to update loan request status",
      error: updateError,
    });
  }

  // 3️⃣ If manager approved → create loan + transaction
  if (updatedRequest.status === "manager_approved") {
    const { customer_id, amount, repayment_years } = updatedRequest;

    // Create loan
    const { data: createdLoan, error: loanError } = await dbInsertFactory(
      "loans",
      {
        customer_id,
        amount,
        repayment_years,
        outstanding_balance: amount,
      }
    );

    if (loanError || !createdLoan) {
      return res.status(400).json({
        message: "Failed to create loan record",
        error: loanError,
      });
    }
    const { id: creaedloanid } = createdLoan;
    // Log transaction
    const transactionResult = await transactionLog({
      type: deposittype[2],
      customer_id,
      amount,
      reference_id: creaedloanid,
      direction: "out",
    });
  }

  // 4️⃣ Success response
  return res.status(200).json({
    message: "Status updated successfully",
    data: updatedRequest,
  });
};

export const getMyLoanrequests = async (req, res) => {
  const userid = req.user.id;
  const { data: user, error: usererr } = await dbReadFactory(
    "customers",
    {
      user_id: userid,
    },
    true
  );

  const { data, error } = await dbReadFactory("loan_requests", {
    customer_id: user.id,
  });

  if (error) {
    return res.status(400).json({
      message: "faild to fetch the loan requests",
      error,
    });
  }
  res.status(200).json({
    message: "sucessfully fetched the loan requests ",
    data,
  });
};
export const createLoanRequest = async (req, res) => {
  const { amount, reason, repayment_years } = req.body;
  const userid = req.user.id;
  const { data: user, error: usererr } = await dbReadFactory(
    "customers",
    {
      user_id: userid,
    },
    true
  );

  const { data, error } = await dbInsertFactory("loan_requests", {
    amount,
    reason,
    repayment_years,
    customer_id: user.id,
  });

  if (error) {
    return res.status(400).json({
      message: "faild to create loan request",
      error,
    });
  }
  res.status(201).json({
    message: "sucessfully created loan requesst",
    data,
  });
};
export const updateLoanRequest = async (req, res) => {
  const { amount, reason, repayment_years, id } = req.body;
  if (!amount || !reason || !repayment_years || !id) {
    return res.status(400).json({
      message: "Require amount, reason, repayment_years, id",
    });
  }
  const { data, error } = await dbUpdateFactory(
    "loan_requests",
    {
      amount,
      reason,
      repayment_years,
    },
    { id }
  );

  if (error) {
    return res.status(400).json({
      message: "faild to update loan request",
      error,
    });
  }
  res.status(200).json({
    message: "sucessfully updated loan requesst",
    data,
  });
};
export const deleteLoanRequest = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "id is requried ",
    });
  }
  const { error } = await dbDeleteFactory("loan_requests", { id });

  if (error) {
    return res.status(400).json({
      message: error.message,
      error,
    });
  }

  res.status(200).json({
    message: "sucessfully deleted the request",
  });
};
export const getMyloans = async (req, res) => {
  const userid = req.user.id;
  const { data: user, error: usererr } = await dbReadFactory(
    "customers",
    {
      user_id: userid,
    },
    true
  );

  const { data, error } = await dbReadFactory("loans", {
    customer_id: user.id,
  });
  if (error) {
    res.status(400).json({
      message: "error while fetching the loans",
      error,
    });
  }
  res.status(200).json({
    message: "Sucessfully fetched loans",
    data,
  });
};
