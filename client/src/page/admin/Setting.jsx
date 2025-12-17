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
import { useNavigate, Link } from "react-router-dom";
import { LogOut, User, Mail, Phone, Shield } from "lucide-react";

export default function Setting() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["me"],
    queryFn: me,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-center mt-10">Failed to load profile</div>;

  const user = data?.user;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl">My Profile</CardTitle>
        </CardHeader>

        <CardContent className="p-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* LEFT – Avatar */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-36 h-36">
                <AvatarImage src={user?.photo} />
                <AvatarFallback className="text-3xl">
                  {user?.full_name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>

              <p
                className={`text-sm font-medium ${
                  user.is_active ? "text-green-600" : "text-red-600"
                }`}
              >
                {user.is_active ? "Active Account" : "Inactive Account"}
              </p>
            </div>

            {/* RIGHT – Info */}
            <div className="md:col-span-2 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <InfoItem
                  icon={<User />}
                  label="Full Name"
                  value={user.full_name}
                />
                <InfoItem icon={<Mail />} label="Email" value={user.email} />
                <InfoItem icon={<Phone />} label="Phone" value={user.phone} />
                <InfoItem icon={<Shield />} label="Role" value={user.role} />
              </div>

              <div>
                <Label className="text-muted-foreground">Account Created</Label>
                <p className="text-base">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Update Profile</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Profile</DialogTitle>
                      <DialogDescription>
                        Edit your personal information
                      </DialogDescription>
                    </DialogHeader>
                    <EditProfile user={data} />
                  </DialogContent>
                </Dialog>
                <Link to="/chanegpassowrd">
                  {" "}
                  <Button variant="outline">Update Password</Button>
                </Link>

                <Button variant="destructive" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* Reusable Info Item */
function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-muted-foreground mt-1">{icon}</div>
      <div>
        <Label className="text-muted-foreground">{label}</Label>
        <p className="text-base font-medium">{value || "-"}</p>
      </div>
    </div>
  );
}
