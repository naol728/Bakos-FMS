import { dbInsertFactory } from "./dbInsertFactory.js";
import { dbUpdateFactory } from "./dbUpdateFactory.js";
import { dbReadFactory } from "./dbReadFactory.js";
import { transactionLog } from "./../utils/transaction.js";

export const deposit = async (req, res) => {
  let { amount, source, customer_id } = req.body;

  // ✅ Validate input
  if (!amount || !source || !customer_id) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  amount = Number(amount);
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({
      message: "Amount must be a valid positive number",
    });
  }

  // ✅ Insert deposit record
  const { error: depositErr, data: deposit } = await dbInsertFactory(
    "deposits",
    {
      amount,
      source,
      customer_id,
    }
  );

  if (depositErr) {
    return res.status(400).json({
      message: depositErr.message,
    });
  }

  // ✅ Fetch customer
  const { data: customer, error: customerReadErr } = await dbReadFactory(
    "customers",
    { id: customer_id },
    true
  );

  if (customerReadErr || !customer) {
    return res.status(404).json({
      message: "Customer not found",
    });
  }

  // ✅ Update customer deposit balance (IMPORTANT FIX)
  const { error: customerUpdateErr } = await dbUpdateFactory(
    "customers",
    {
      deposit_amount: Number(customer.deposit_amount) + amount,
    },
    {
      id: customer_id,
    }
  );

  if (customerUpdateErr) {
    return res.status(400).json({
      message: customerUpdateErr.message,
    });
  }

  // ✅ Log transaction (LAST STEP)
  await transactionLog({
    type: "DEPOSIT",
    customer_id: customer.id,
    amount,
    reference_id: deposit.id,
  });

  return res.status(201).json({
    message: "Successfully deposited",
    deposit,
    updated_balance: Number(customer.deposit_amount) + amount,
  });
};
