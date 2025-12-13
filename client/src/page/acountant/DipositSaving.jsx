"use client";

import React, { useMemo, useState } from "react";
import useCustomer from "@/hooks/customer/useCustomers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

export default function DepositSaving() {
  const { customer, customerloading, customererror } = useCustomer();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const customers = Array.isArray(customer)
    ? customer
    : customer?.customers || [];

  const filteredCustomers = useMemo(() => {
    const keyword = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.account_no?.toLowerCase().includes(keyword) ||
        c.full_name?.toLowerCase().includes(keyword) ||
        c.first_name?.toLowerCase().includes(keyword)
    );
  }, [customers, search]);

  const handleCustomerDetail = (id) => {
    navigate(`/accountant/deposit-save-manage/${id}`);
  };

  if (customerloading)
    return (
      <p className="text-sm text-muted-foreground">Loading customers...</p>
    );

  if (customererror)
    return <p className="text-sm text-destructive">Failed to load customers</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Deposit Savings
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Select a customer to manage deposits
          </p>
        </div>

        <Input
          placeholder="Search by account or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
        <Table className="w-full">
          <TableHeader className="bg-muted/10">
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Account No</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Deposit Amount</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-muted-foreground"
                >
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((c, idx) => (
                <TableRow
                  key={c.id}
                  onClick={() => handleCustomerDetail(c.id)}
                  className={`cursor-pointer transition ${
                    idx % 2 === 0 ? "bg-muted/5" : ""
                  } hover:bg-primary/10`}
                >
                  {/* Customer */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 ring-1 ring-primary/30">
                        <AvatarFallback>
                          {c.first_name?.[0]}
                          {c.father_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="font-medium leading-none">
                          {c.full_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ID: {c.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="font-mono">{c.account_no}</TableCell>

                  <TableCell>{c.phone || "—"}</TableCell>

                  {/* Status Badge */}
                  <TableCell>
                    <Badge
                      variant={
                        c.account_status === "active"
                          ? "success"
                          : "destructive"
                      }
                    >
                      {c.account_status === "active" ? "Active" : "Disabled"}
                    </Badge>
                  </TableCell>

                  {/* Deposit Amount */}
                  <TableCell className="text-right font-semibold text-primary">
                    {Number(c.deposit_amount || 0).toLocaleString()} ETB
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
