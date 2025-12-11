import { supabase } from "../config/supabase.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Get user from Supabase Auth
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Attach the authenticated user to the request
    req.user = data.user;

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Auth middleware failed" });
  }
};
