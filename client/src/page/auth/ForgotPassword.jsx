"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetEmail = async () => {
    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/reset-password",
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("📧 Password reset email sent");
      setEmail("");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Forgot Password
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Email address
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Button */}
          <Button
            onClick={handleResetEmail}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Sending..." : "Send reset email"}
          </Button>

          {/* Message */}
          {message && (
            <p className="text-sm text-center text-muted-foreground">
              {message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
