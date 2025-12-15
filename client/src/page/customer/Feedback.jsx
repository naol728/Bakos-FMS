"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createFeedback } from "@/api/feedback";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { MessageSquare, Loader2 } from "lucide-react";

export default function Feedback() {
  const [message, setMessage] = useState("");

  const feedbackcreate = useMutation({
    mutationFn: createFeedback,
    mutationKey: ["createFeedback"],
    onSuccess: (data) => {
      toast.success(data.message);
      setMessage("");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleCreatefeedback = (e) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Please write your feedback first");
      return;
    }

    feedbackcreate.mutate({ message });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Send Feedback
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleCreatefeedback} className="space-y-4">
            <Textarea
              placeholder="Write your feedback here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={feedbackcreate.isPending}
            >
              {feedbackcreate.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Submit Feedback
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
