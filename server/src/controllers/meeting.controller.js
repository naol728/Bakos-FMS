import { supabase } from "./../config/supabase.js";

export const createMeeting = async (req, res) => {
  const { title, description, meeting_date } = req.body;

  if (!title || !meeting_date) {
    return res.status(400).json({
      message: "Title and meeting_date are required",
    });
  }
  const userid = req.user.id;

  const { data, error } = await supabase
    .from("meetings")
    .insert([
      {
        title,
        description,
        meeting_date,
        posted_by: userid,
      },
    ])
    .select()
    .single();

  if (error) {
    return res.status(400).json({
      message: "Failed to create meeting",
      error: error.message,
    });
  }

  return res.status(201).json({
    message: "Meeting created successfully",
    data,
  });
};
