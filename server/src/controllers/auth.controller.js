import { supabase } from "./../config/supabase.js";

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return res.status(401).json({
        error: error?.message || "Invalid credentials",
      });
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        error: "User not found in the database",
      });
    }

    res.status(200).json({
      message: "Login successful",
      user,
      session: data.session,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error",
    });
  }
};

export const signup = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        error: "Email, password, and name are required.",
      });
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone },
      },
    });

    if (authError) {
      return res.status(400).json({
        error: authError.message,
      });
    }

    const userId = authData.user?.id;

    if (!userId) {
      return res.status(500).json({
        error: "Failed to create user account.",
      });
    }

    // 2️⃣ Insert extra profile data into "users" table
    const { error: insertError } = await supabase.from("users").insert([
      {
        id: userId, // foreign key to auth.users
        full_name: name,
        phone,
        email,
      },
    ]);

    if (insertError) {
      return res.status(400).json({
        error: insertError.message,
      });
    }

    // 3️⃣ Return success response
    return res.status(201).json({
      message: "User registered successfully",
      user: authData.user,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const me = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const { data: authData, error: authError } = await supabase.auth.getUser(
      token
    );

    if (authError || !authData?.user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const authUser = authData.user;

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (userError || !userData) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "Error",
      message: "Server Error",
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token)
      return res.status(400).json({ message: "No refresh token provided" });

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token,
    });

    if (error)
      return res.status(401).json({ message: "Invalid refresh token" });

    return res.json({
      access_token: data.session.access_token,
      expires_at: data.session.expires_at,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
