"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleResetEmail = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/reset-password",
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("📧 Password reset email sent");
    }
  };

  return (
    <div className="max-w-md space-y-3">
      <input
        type="email"
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full"
      />

      <button
        onClick={handleResetEmail}
        className="bg-black text-white px-4 py-2 w-full"
      >
        Send reset email
      </button>

      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}
