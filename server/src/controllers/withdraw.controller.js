import { dbReadFactory } from "./dbReadFactory.js";

export const getRequests = async (req, res) => {
  const userid = req.user.id;
  const { data, error } = await dbReadFactory("withdraw_requests", { userid });
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

export const addRequest = async (req, res) => {};
