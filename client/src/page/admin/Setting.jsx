"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { me } from "@/api/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EditProfile from "@/components/admin/EditProfile";
import { useDispatch } from "react-redux";
import { logout } from "@/store/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
export default function Setting() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["me"],
    queryFn: me,
  });
  const naviagate = useNavigate();
  const dispatch = useDispatch();
  const handlelogout = () => {
    dispatch(logout());
    naviagate("/");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user data.</div>;

  const user = data?.user;

  return (
    <Card className="max-w-3xl mx-auto mt-10 p-6">
      <CardHeader>
        <CardTitle className="text-2xl">Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Image */}
          <Avatar className="w-32 h-32">
            <AvatarImage src={user.photo} />
            <AvatarFallback>{user.full_name[0]}</AvatarFallback>
          </Avatar>

          {/* User Info */}
          <div className="flex-1 space-y-3">
            <div>
              <Label className="text-sm text-muted-foreground">Full Name</Label>
              <p className="text-lg font-medium">{user.full_name}</p>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Email</Label>
              <p className="text-lg">{user.email}</p>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Phone</Label>
              <p className="text-lg">{user.phone}</p>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Role</Label>
              <p className="text-lg">{user.role}</p>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">
                Account Created
              </Label>
              <p className="text-lg">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Status</Label>
              <p
                className={`text-lg font-medium ${
                  user.is_active ? "text-green-600" : "text-red-600"
                }`}
              >
                {user.is_active ? "Active" : "Inactive"}
              </p>
            </div>

            <Dialog>
              <DialogTrigger>
                <Button>Update Profile</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Profile ?</DialogTitle>
                  <DialogDescription>Update Profile of mine</DialogDescription>
                  <EditProfile user={data} />
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <div>
              <Button variant="destructive" onClick={handlelogout}>
                <LogOut />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
