"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateme } from "@/api/admin";

export default function Setting({ user }) {
  const queryClient = useQueryClient();
  // Form state
  const [formData, setFormData] = useState(() => ({
    full_name: user?.user?.full_name || "",
    email: user?.user?.email || "",
    phone: user?.user?.phone || "",
    photoFile: null, // selected file
    photoPreview: user?.user?.photo || "", // preview URL
  }));

  // Mutation for updating user
  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const payload = new FormData();
      payload.append("full_name", data.full_name);
      payload.append("email", data.email);
      payload.append("phone", data.phone);
      if (data.photoFile) {
        payload.append("photo", data.photoFile);
      }
      return updateme(payload);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries(["user"]);
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update profile");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photoFile: file,
        photoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <Card className="max-w-3xl mx-auto p-6">
      <CardHeader>
        <CardTitle className="text-2xl">Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Image */}
          {/* Editable Form */}
          <div className="flex-1 w-full">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="photo">Select Profile Photo</Label>
                <Input
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              {formData.photoPreview && (
                <img
                  src={formData.photoPreview}
                  alt="User Photo"
                  className="w-32 h-32 rounded-full mx-auto mt-2"
                />
              )}

              <Button type="submit" className="w-full">
                {updateMutation.isLoading ? "Updating..." : "Save Changes"}
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
