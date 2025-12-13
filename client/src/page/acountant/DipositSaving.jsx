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
import { useNavigate } from "react-router-dom";

export default function DipositSaving() {
  const { customer, customerloading, customererror } = useCustomer();
  const [search, setSearch] = useState("");

  const customers = Array.isArray(customer)
    ? customer
    : customer?.customers || [];

  // 🔍 Filter customers
  const filteredCustomers = useMemo(() => {
    const keyword = search.toLowerCase();

    return customers.filter(
      (c) =>
        c.account_no?.toLowerCase().includes(keyword) ||
        c.full_name?.toLowerCase().includes(keyword) ||
        c.first_name?.toLowerCase().includes(keyword)
    );
  }, [customers, search]);
  const navigate = useNavigate();
  function handlecustomerdetail(id) {
    navigate(`/accountant/deposit-save-manage/${id}`);
  }

  if (customerloading) {
    return <p className="text-muted-foreground">Loading customers...</p>;
  }

  if (customererror) {
    return <p className="text-destructive">Failed to load customers</p>;
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Deposit Savings</h2>

      <Input
        placeholder="Search by account number or name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account No</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Deposit Amount</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-6"
                >
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((c) => (
                <TableRow key={c.id} onClick={() => handlecustomerdetail(c.id)}>
                  <TableCell>{c.account_no}</TableCell>
                  <TableCell>{c.full_name}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell className="text-right font-medium">
                    {c.deposit_amount} ETB
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
