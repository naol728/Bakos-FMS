"use client";

import React, { useState } from "react";
import { createMeeting } from "@/api/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Postmeeting() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [meetingDate, setMeetingDate] = useState(null);
  const [errors, setErrors] = useState({});
  const queryclient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createMeeting,
    onSuccess: (data) => {
      queryclient.invalidateQueries({ queryKey: ["getmeetings"] });
      toast.success(data.message || "Meeting posted successfully");
      setTitle("");
      setDescription("");
      setMeetingDate(null);
      setErrors({});
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to post meeting");
    },
  });

  const validate = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (description && description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!meetingDate) {
      newErrors.meetingDate = "Meeting date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = (e) => {
    e.preventDefault();

    if (!validate()) return;

    mutate({
      title,
      description,
      meeting_date: format(meetingDate, "yyyy-MM-dd"),
    });
  };

  return (
    <div className=" w-full flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Post New Meeting</CardTitle>
          <CardDescription>
            Announce an upcoming meeting to all members
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleCreate} className="space-y-5">
            <div className="space-y-2">
              <Label>Meeting Title</Label>
              <Input
                placeholder="e.g. Monthly General Meeting"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Write meeting agenda or notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>

            {/* DATE PICKER */}
            <div className="space-y-2">
              <Label>Meeting Date</Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !meetingDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {meetingDate
                      ? format(meetingDate, "PPP")
                      : "Select meeting date"}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={meetingDate}
                    onSelect={setMeetingDate}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {errors.meetingDate && (
                <p className="text-sm text-destructive">{errors.meetingDate}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Posting..." : "Post Meeting"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
