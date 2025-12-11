import { supabase } from "../config/supabase.js";
import { dbInsertFactory } from "./dbInsertFactory.js";
import { v4 as uuidv4 } from "uuid";
import { dbReadFactory } from "./dbReadFactory.js";
import { dbDeleteFactory } from "./dbDeleteFactory.js";
import { dbUpdateFactory } from "./dbUpdateFactory.js";

export const createCustomer = async (req, res) => {
  const {
    account_no,
    first_name,
    father_name,
    grand_father_name,
    sex,
    age,
    deposit_amount,
    share_amount,
    phone,
    email,
    password,
  } = req.body;

  const photoFile = req.file;
  const full_name = `${first_name} ${father_name} ${grand_father_name}`;

  // 1. Create auth user
  const { error: authError, data } = await supabase.auth.signUp({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role: "customer",
      full_name,
    },
  });

  if (authError) {
    return res.status(400).json({
      message: "Failed to create user in authentication system.",
      details: authError.message,
    });
  }

  let photoUrl = null;

  // 2. Upload photo to Supabase Storage
  if (photoFile) {
    const fileExt = photoFile.originalname.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("profile") // your bucket name
      .upload(fileName, photoFile.buffer, {
        contentType: photoFile.mimetype,
      });

    if (uploadError) {
      return res.status(500).json({
        message: "Failed to upload customer photo",
        details: uploadError.message,
      });
    }

    // 3. Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("profile")
      .getPublicUrl(fileName);

    photoUrl = publicUrlData.publicUrl;
  }

  // 4. Insert into users table
  const { error: dbError } = await dbInsertFactory("users", {
    phone,
    email,
    photo: photoUrl,
    full_name,
    role: "customer",
    id: data.user.id,
  });

  if (dbError) {
    return res.status(500).json({
      message: "User created in auth but failed to save in database.",
      details: dbError.message,
    });
  }

  // 5. Insert into customers table
  const { error: customrdberror, data: customerdata } = await dbInsertFactory(
    "customers",
    {
      user_id: data.user.id,
      account_no,
      first_name,
      father_name,
      grand_father_name,
      sex,
      age,
      deposit_amount,
      share_amount,
    }
  );
  if (customrdberror) {
    return res.status(500).json({
      message: "Auth user created but failed to save customer details",
      details: customrdberror.message,
    });
  }

  res.status(200).json({
    message: "Customer Created Successfully",
    customerdata,
  });
};

export const updateCustomer = async (req, res) => {
  const {
    account_no,
    first_name,
    father_name,
    grand_father_name,
    sex,
    age,
    deposit_amount,
    share_amount,
    phone,
    user_id,
  } = req.body;

  const photoFile = req.file;
  const full_name = `${first_name} ${father_name} ${grand_father_name}`;
  let photoUrl = null;

  // Upload photo if provided
  if (photoFile) {
    const fileExt = photoFile.originalname.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("profile")
      .upload(fileName, photoFile.buffer, {
        contentType: photoFile.mimetype,
        upsert: true,
      });

    if (uploadError) {
      return res.status(500).json({
        message: "Failed to upload new customer photo",
        details: uploadError.message,
      });
    }

    const { data: publicUrlData } = supabase.storage
      .from("profile")
      .getPublicUrl(fileName);

    photoUrl = publicUrlData.publicUrl;
  }

  // Update `users` table
  const { error: dbUserError } = await dbUpdateFactory(
    "users",
    {
      id: user_id,
      phone,
      full_name,
      ...(photoUrl && { photo: photoUrl }),
    },
    {
      id: user_id,
    }
  );

  if (dbUserError) {
    return res.status(500).json({
      message: "Failed to update user info",
      details: dbUserError.message,
    });
  }

  // Update `customers` table
  const { error: dbCustomerError, data: customerData } = await dbUpdateFactory(
    "customers",
    {
      user_id,
      account_no,
      first_name,
      father_name,
      grand_father_name,
      sex,
      age,
      deposit_amount,
      share_amount,
    },
    {
      user_id,
    }
  );

  if (dbCustomerError) {
    return res.status(500).json({
      message: "Failed to update customer details",
      details: dbCustomerError.message,
    });
  }

  res.status(200).json({
    message: "Customer updated successfully",
    customerData,
  });
};

export const deleteCustomer = async (req, res) => {
  const { id } = req.params;
  const { error: userdelerror } = await dbDeleteFactory("users", {
    id: id,
  });

  if (userdelerror) {
    return res.status(400).json({
      message: "Error delete the user ",
      error: userdelerror,
    });
  }
  const { error: customererror } = await dbDeleteFactory("customers", {
    user_id: id,
  });

  if (customererror) {
    return res.status(400).json({
      message: "Error delete the customer",
      error: customererror,
    });
  }

  res.status(200).json({
    message: "Sucessfully delete Customer",
  });
};
export const getCustomers = async (req, res) => {
  const { data: users, error: usersError } = await dbReadFactory("users", {
    role: "customer",
  });

  if (usersError) {
    return res.status(400).json({
      message: "Failed to fetch users",
      error: usersError,
    });
  }

  const { data: customers, error: customersError } = await dbReadFactory(
    "customers"
  );

  if (customersError) {
    return res.status(400).json({
      message: "Failed to fetch customers",
      error: customersError,
    });
  }

  const merged = customers.map((customer) => {
    const user = users.find((u) => u.id === customer.user_id);

    return {
      ...customer,
      full_name: user?.full_name,
      email: user?.email,
      phone: user?.phone,
      photo: user?.photo,
      is_active: user?.is_active,
      user_created: user?.created_at,
    };
  });

  res.status(200).json({
    message: "Successfully fetched customers",
    customers: merged,
  });
};
