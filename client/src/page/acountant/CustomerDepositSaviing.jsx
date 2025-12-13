"use client";

import React from "react";
import { useParams } from "react-router-dom";
import useCustomer from "@/hooks/customer/useCustomer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Deposit from "@/components/acountant/Deposit";
import Withdraw from "@/components/acountant/Withdraw";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CustomerDepositSaviing() {
  const navigate = useNavigate();

  const { id } = useParams();
  const { customer, user, customerloading, customererror } = useCustomer(id);

  if (customerloading)
    return <p className="text-muted-foreground">Loading customer...</p>;

  if (customererror)
    return <p className="text-destructive">Failed to load customer</p>;

  if (!customer) return <p>No customer found</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* ================= CUSTOMER PROFILE ================= */}
      <Card className="shadow-lg rounded-xl">
        <CardContent className="p-6 flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex justify-center md:justify-start">
            <Avatar className="w-36 h-36 ring-2 ring-primary">
              <AvatarImage src={user?.photo} />
              <AvatarFallback className="text-4xl">
                {customer.first_name?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h2 className="text-2xl font-semibold">
                {customer.first_name} {customer.father_name}{" "}
                {customer.grand_father_name}
              </h2>

              <Badge variant={user?.is_active ? "success" : "destructive"}>
                {user?.is_active ? "Active Account" : "Inactive Account"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <Info label="Phone" value={user?.phone || "—"} />
              <Info label="Account No" value={customer.account_no} />
              <Info label="Age" value={customer.age} />
              <Info label="Sex" value={customer.sex} />
              <Info
                label="Deposit Balance"
                value={`ETB ${customer.deposit_amount}`}
                valueClass="text-green-600 font-semibold"
              />
              <Info
                label="Created At"
                value={new Date(customer.created_at).toLocaleString()}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ================= ACTIONS ================= */}
      <Card className="shadow-md rounded-xl">
        <CardHeader>
          <CardTitle>Account Operations</CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="deposit">
            <TabsList className="mb-4">
              <TabsTrigger value="deposit">Deposit</TabsTrigger>
              <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            </TabsList>

            <TabsContent value="deposit">
              {user?.is_active ? <Deposit id={id} /> : <InactiveNotice />}
            </TabsContent>

            <TabsContent value="withdraw">
              {user?.is_active ? <Withdraw user_id={id} /> : <InactiveNotice />}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

/* ================= SMALL REUSABLE UI ================= */

function Info({ label, value, valueClass = "" }) {
  return (
    <div className="flex flex-col">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}

function InactiveNotice() {
  return (
    <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-destructive">
      This account is inactive. Operations are disabled.
    </div>
  );
}
