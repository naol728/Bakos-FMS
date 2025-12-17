import { supabase } from "../config/supabase.js";
import { transactionLog } from "../utils/transaction.js";
import { dbDeleteFactory } from "./dbDeleteFactory.js";
import { dbInsertFactory } from "./dbInsertFactory.js";
import { dbReadFactory } from "./dbReadFactory.js";
import { dbUpdateFactory } from "./dbUpdateFactory.js";

export const getRequests = async (req, res) => {
  const userid = req.user.id;
  const { data: user, error: usererr } = await dbReadFactory(
    "customers",
    {
      user_id: userid,
    },
    true
  );
  const { data, error } = await dbReadFactory("withdraw_requests", {
    customer_id: user.id,
  });
  if (error) {
    res.status(400).json({
      message: error.message,
    });
  }
  res.status(200).json({
    message: "Sucessfully Withdraws fetched",
    data,
  });
};

export const getRequest = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({
      message: "Id is required ",
    });
  }

  const { data, error } = await dbReadFactory(
    "withdraw_requests",
    { id },
    true
  );
  if (error) {
    res.status(400).json({
      messge: error.messge,
    });
  }

  res.status(200).json({
    message: "Sucessfully Withdrawal fetched",
    data,
  });
};
export const getUserWithdrawalRequest = async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).json({
      message: "User ID required",
    });
  }

  const { data, error } = await dbReadFactory("withdraw_requests", {
    customer_id: user_id,
  });

  if (error) {
    return res.status(400).json({
      message: error.message,
      detail: error,
    });
  }

  // Return data
  res.status(200).json({
    message: "Successfully fetched",
    data,
  });
};

export const addRequest = async (req, res) => {
  const userid = req.user.id;
  const { amount } = req.body;
  if (!amount) {
    return res.status(400).json({
      message: "request amount is required",
    });
  }
  const { data: user, error: usererr } = await dbReadFactory(
    "customers",
    {
      user_id: userid,
    },
    true
  );

  if (user.deposit_amount < amount) {
    return res.status(400).json({
      message: "insefincet balance ",
    });
  }
  const { data, error } = await dbInsertFactory("withdraw_requests", {
    amount,
    customer_id: user.id,
  });
  if (error) {
    return res.status(400).json({
      message: "withdraw request faild to create",
    });
  }
  res.status(201).json({
    message: "Withdraw request created sucessfully",
    data,
  });
};

export const withdraw = async (req, res) => {
  const { amount, user_id } = req.body;

  if (!user_id || !amount || amount <= 0) {
    return res.status(400).json({
      message: "User ID and valid amount are required",
    });
  }

  const { data: customers, error: customererr } = await dbReadFactory(
    "customers",
    { id: user_id }
  );

  if (customererr) {
    return res.status(400).json({
      message: customererr.message,
    });
  }

  if (!customers || customers.length === 0) {
    return res.status(404).json({
      message: "Customer not found",
    });
  }

  const customer = customers[0];

  if (customer.deposit_amount < amount) {
    return res.status(400).json({
      message: "Insufficient balance",
    });
  }

  const { data, error } = await dbUpdateFactory(
    "customers",
    {
      deposit_amount: customer.deposit_amount - amount,
    },
    {
      id: user_id,
    }
  );

  if (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
  await transactionLog({
    type: deposittype[1],
    customer_id: customer.id,
    amount,
    reference_id: deposit.id,
    direction: "in",
  });

  // Success response
  res.status(200).json({
    message: "Successfully withdrawn",
    data,
  });
};

export const getWithdrawRequestsManager = async (req, res) => {
  const { data, error } = await supabase
    .from("withdraw_requests")
    .select(
      "*,  customer:customer_id(first_name,account_no,father_name,grand_father_name,age,deposit_amount,user_id ,user:user_id(photo,phone))"
    );

  if (error) {
    return res.status(400).json({
      message: "error while fetching withdraw ",
      error,
    });
  }
  res.status(200).json({
    message: "sucessfully withdraw requests fetched ",
    data,
  });
};

export const updateWithdrawStatusManger = async (req, res) => {
  const { id, status, manager_comment } = req.body;

  if (!id || !status) {
    return res.status(400).json({
      message: "Withdraw request id and status are required",
    });
  }

  if (!["approved", "rejected", "pending"].includes(status)) {
    return res.status(400).json({
      message: "Invalid status value",
    });
  }
  const { data, error } = await supabase
    .from("withdraw_requests")
    .update({
      status,
      manager_comment,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return res.status(400).json({
      message: "Failed to update withdraw request",
      error: error.message,
    });
  }

  res.status(200).json({
    message: "Withdraw request updated successfully",
    data,
  });
};
export const updateWithdrawalCustomer = async (req, res) => {
  const userid = req.user.id;
  const { amount, id } = req.body;
  if (!amount) {
    return res.status(400).json({
      message: "request amount is required",
    });
  }
  const { data: user, error: usererr } = await dbReadFactory(
    "customers",
    {
      user_id: userid,
    },
    true
  );
  const { data, error } = await dbUpdateFactory(
    "withdraw_requests",
    {
      amount,
    },
    { id }
  );
  if (error) {
    return res.status(400).json({
      message: "update error to withdraw_requests",
      error,
    });
  }
  res.status(200).json({
    message: "Updated Sucessfully",
    data,
  });
};

export const deleteWithdrawal = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "id is required",
    });
  }
  const { data, error } = await dbDeleteFactory("withdraw_requests", {
    id,
  });
  if (error) {
    return res.status(400).json({
      message: "delete errror withdraw_requests",
      error,
    });
  }
  res.status(200).json({
    message: "Deleted  Sucessfully",
  });
};
