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

export default function CustomerDepositSaviing() {
  const { id } = useParams();
  const { customer, user, customerloading, customererror } = useCustomer(id);

  if (customerloading)
    return <p className="text-muted-foreground">Loading customer...</p>;
  if (customererror)
    return <p className="text-destructive">Failed to load customer</p>;
  if (!customer) return <p>No customer found</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Customer Info Card */}
      <Card className="flex flex-col md:flex-row gap-6 p-6 shadow-lg rounded-xl bg-background">
        {/* Left: Avatar */}
        <div className="flex-shrink-0 flex justify-center md:justify-start">
          <Avatar className="w-44 h-44 ring-2 ring-primary">
            <AvatarImage src={user?.photo} />
            <AvatarFallback className="text-5xl">
              {customer.first_name.at(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Right: Customer Info */}
        <CardContent className="flex-1 space-y-4">
          <CardHeader className="p-0">
            <CardTitle className="text-2xl md:text-3xl font-semibold">
              {customer.first_name} {customer.father_name}{" "}
              {customer.grand_father_name}
            </CardTitle>
          </CardHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge
                variant={user?.is_active ? "success" : "destructive"}
                className="mt-1"
              >
                {user?.is_active ? "Active" : "Not Active"}
              </Badge>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Phone</span>
              <span className="font-medium mt-1">
                {user?.phone || "No Phone"}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Account No</span>
              <span className="font-medium mt-1">{customer.account_no}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Age</span>
              <span className="font-medium mt-1">{customer.age}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Sex</span>
              <span className="font-medium mt-1">{customer.sex}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Deposit Amount
              </span>
              <span className="font-medium text-green-600 mt-1">
                ETB {customer.deposit_amount}
              </span>
            </div>

            <div className="md:col-span-2 flex flex-col">
              <span className="text-sm text-muted-foreground">Created At</span>
              <span className="font-medium mt-1">
                {new Date(customer.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Deposit and Withdraw */}
      <Card className="shadow-md rounded-xl border border-border">
        <Tabs defaultValue="deposit" className="w-full">
          <TabsList>
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          </TabsList>

          <TabsContent value="deposit">
            {user?.is_active ? (
              <Deposit id={id} />
            ) : (
              <p className="text-destructive p-4">Account is not active</p>
            )}
          </TabsContent>

          <TabsContent value="withdraw">
            {user?.is_active ? (
              <Withdraw id={id} />
            ) : (
              <p className="text-destructive p-4">Account is not active</p>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
