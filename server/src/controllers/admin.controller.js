import { supabase } from "../config/supabase.js";
import { dbDeleteFactory } from "./dbDeleteFactory.js";
import { dbInsertFactory } from "./dbInsertFactory.js";
import { dbUpdateFactory } from "./dbUpdateFactory.js";
import { dbReadFactory } from "./dbReadFactory.js";
import { logEvent } from "./../utils/logger.js";

export const createEmployee = async (req, res) => {
  const { email, password, full_name, role, phone } = req.body;

  if (!email || !password || !full_name || !role || !phone) {
    return res.status(400).json({ message: "All fields are required." });
  }
  await logEvent({
    user_id: req.user?.id,
    action_type: "CREATE_EMPLOYEE",
    message: `EMPLOYEE ${full_name} created successfully`,
    level: "INFO",
    meta: { email },
  });

  const { error: authError, data } = await supabase.auth.signUp({
    email,
    password,
    email_confirm: true,
    user_metadata: { role, full_name },
  });

  if (authError) {
    console.log(authError);
    return res.status(400).json({
      message: "Failed to create user in authentication system.",
      details: authError.message,
    });
  }

  const { error: dbError } = await dbInsertFactory("users", {
    phone,
    email,
    full_name,
    role,
    id: data.user.id,
  });

  if (dbError) {
    return res.status(500).json({
      message: "User created in auth but failed to save in database.",
      details: dbError.message,
    });
  }

  return res.status(201).json({
    message: "Employee created successfully.",
    data: { email, full_name, role },
  });
};

export const getEmployeee = async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .neq("role", "customer");
  if (error) {
    return res.status(400).json({
      message: "Faild to Fetch the Employee List",
    });
  }
  res.status(200).json({
    data,
    message: "Employee list sucessfuly fetched ",
  });
};
export const updateEmployee = async (req, res) => {
  const { email, full_name, role, phone, userid } = req.body;

  // Validate required fields
  if (!userid || !email || !full_name || !role || !phone) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  // Call the generic DB update factory
  const { data, error } = await dbUpdateFactory(
    "users",
    { email, full_name, role, phone },
    { id: userid }
  );

  await logEvent({
    user_id: req.user?.id,
    action_type: "UPDATE EMPLOYEE",
    message: `EMPLOYEE ${full_name} UPDATED successfully`,
    level: "INFO",
    meta: { email },
  });
  // Handle errors returned from the factory
  if (error) {
    return res.status(400).json({
      message: "Employee update failed",
      details: error.details,
    });
  }

  // Success response
  res.status(200).json({
    message: "Employee updated successfully",
    data,
  });
};

export const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "Employee ID is required",
    });
  }

  const { data, error } = await dbDeleteFactory("users", { id });
  await logEvent({
    user_id: req.user?.id,
    action_type: "DELETE EMPLOYEE",
    message: `EMPLOYEE ${data.user.full_name} DELETE successfully`,
    level: "INFO",
    meta: { email: data.user.email },
  });
  if (error) {
    return res.status(400).json({
      message: "Failed to delete employee",
      details: error.details,
    });
  }

  res.status(200).json({
    message: "Employee deleted successfully",
    data,
  });
};
export const disableEmployee = async (req, res) => {};

export const updateme = async (req, res) => {
  try {
    const userId = req.user.id; // <-- user ID from middleware (token)
    const { full_name, email, phone } = req.body;

    // 1️⃣ Fetch current user to know the old image
    const { data: oldUser, error: fetchErr } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (fetchErr) {
      return res.status(400).json({ message: "User not found." });
    }

    let photoURL = oldUser.photo; // default use old photo

    // 2️⃣ Handle New Image Upload (if photo exists)
    if (req.file) {
      const file = req.file;

      const fileName = `profile_${userId}_${Date.now()}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from("profile")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (uploadErr) {
        return res
          .status(400)
          .json({ message: "Failed to upload profile photo" });
      }

      // Get PUBLIC URL
      const { data: publicURL } = supabase.storage
        .from("profile")
        .getPublicUrl(fileName);

      photoURL = publicURL.publicUrl;
    }

    // 3️⃣ Update User in Table
    const { data, error: updateErr } = await supabase
      .from("users")
      .update({
        full_name,
        email,
        phone,
        photo: photoURL,
      })
      .eq("id", userId)
      .select()
      .single();

    if (updateErr) {
      return res.status(400).json({ message: "Failed to update profile" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getFeedbacks = async (req, res) => {
  const { data, error } = await supabase
    .from("feedback")
    .select(
      `
        id,
        message,
        created_at,
        customer:customer_id (
          id,
          account_no,
          first_name,
          father_name,
          grand_father_name,
          sex,
          age,
          university_id,
          deposit_amount,
          share_amount,
          photo
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

export const getMeetings = async (req, res) => {
  const { data, error } = await supabase.from("meetings").select(`
        id,
        title,
        description,
        meeting_date,
        created_at,
        posted_by,
        users:posted_by (
          id,
          full_name,
          phone,
          role,
          photo
        )
      `);

  if (error) {
    return res.status(400).json({
      message: "Failed to fetch meetings",
      details: error.message,
    });
  }

  res.status(200).json({
    message: "Meetings fetched successfully",
    data,
  });
};

export const getLog = async (req, res) => {
  const { data: logs, error } = await supabase
    .from("logs")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return res.status(400).json({ message: error.message });

  res.json(logs);
};
