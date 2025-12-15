"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getme } from "@/api/accountant";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  User,
  Phone,
  Mail,
  ShieldCheck,
  Calendar,
  CreditCard,
  Wallet,
  BadgeCheck,
  Users,
} from "lucide-react";

export default function CustomerDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["getme"],
    queryFn: getme,
  });

  if (isLoading) {
    return <div className="p-6">Loading customer data...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Failed to load customer data</div>;
  }

  const { data: customer, user } = data;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.photo} alt={user.full_name} />
          <AvatarFallback>{user.full_name?.charAt(0)}</AvatarFallback>
        </Avatar>

        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <User className="h-5 w-5" />
            {user.full_name}
          </h1>

          <p className="text-muted-foreground flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Account No: {customer.account_no}
          </p>

          <Badge variant={user.is_active ? "default" : "destructive"}>
            {user.is_active ? "Active Account" : "Inactive Account"}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              👤 Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <InfoRow
              icon={User}
              label="First Name"
              value={customer.first_name}
            />
            <InfoRow
              icon={Users}
              label="Father Name"
              value={customer.father_name}
            />
            <InfoRow
              icon={Users}
              label="Grand Father Name"
              value={customer.grand_father_name}
            />
            <InfoRow icon={BadgeCheck} label="Sex" value={customer.sex} />
            <InfoRow icon={Calendar} label="Age" value={customer.age} />
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🧾 Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <InfoRow icon={Phone} label="Phone" value={user.phone} />
            <InfoRow icon={Mail} label="Email" value={user.email} />
            <InfoRow icon={ShieldCheck} label="Role" value={user.role} />
            <InfoRow
              icon={Calendar}
              label="Created At"
              value={new Date(customer.created_at).toLocaleDateString()}
            />
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💰 Financial Summary
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl border flex items-center gap-4">
              <Wallet className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Monthly Deposit Amount
                </p>
                <p className="text-3xl font-bold">
                  {customer.deposit_amount} ETB
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border flex items-center gap-4">
              <BadgeCheck className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Account Status</p>
                <p className="text-3xl font-bold">
                  {user.is_active ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* Reusable row with icon */
function InfoRow({ label, value, icon: Icon }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2 text-muted-foreground">
        {Icon && <Icon className="h-4 w-4" />}
        <span>{label}</span>
      </div>
      <span className="font-medium">{value}</span>
    </div>
  );
}
