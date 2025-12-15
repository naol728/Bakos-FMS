/* eslint-disable */
"use client";

import { useMemo, useState } from "react";
import useGetloanRequests from "@/hooks/loan/useGetloanRequests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStatusLoanCommite, updateStausManager } from "@/api/loan";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function ManageLoan() {
  const { loanrequests, loanreqerr, loanreqloading } = useGetloanRequests();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const queryclient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: updateStausManager,
    onSuccess: (data) => {
      toast.success(data.message);
      queryclient.invalidateQueries({ queryKey: ["getLoanRequests"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  const handleUpdateStatus = (data) => {
    const { id } = data;
    mutate({ id, status });
  };
  const filteredLoans = useMemo(() => {
    if (!loanrequests) return [];

    return loanrequests.data.filter((loan) => {
      const c = loan.customer;
      const fullName =
        `${c.first_name} ${c.father_name} ${c.grand_father_name}`.toLowerCase();
      const accountNo = c.account_no?.toLowerCase() || "";
      const email = c.users?.email?.toLowerCase() || "";

      return (
        fullName.includes(search.toLowerCase()) ||
        accountNo.includes(search.toLowerCase()) ||
        email.includes(search.toLowerCase())
      );
    });
  }, [loanrequests, search]);

  if (loanreqloading) return <div className="p-6">Loading...</div>;
  if (loanreqerr)
    return <div className="p-6 text-red-500">Error loading loans</div>;

  return (
    <div className="space-y-6 p-6">
      {/* Search */}
      <Input
        placeholder="Search by name, account number, or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      {/* Cards */}
      <div className="space-y-6 max-w-7xl mx-auto">
        {filteredLoans.map((loan) => {
          const deposits = loan.customer.deposits;
          const totalDeposits = deposits.reduce((sum, d) => sum + d.amount, 0);

          return (
            <Card
              key={loan.id}
              className="rounded-2xl shadow-sm transition hover:shadow-md "
            >
              {/* Header */}
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={loan.customer.users?.photo} />
                    <AvatarFallback>
                      {loan.customer.first_name[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <CardTitle className="text-base leading-tight">
                      {loan.customer.first_name} {loan.customer.father_name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {loan.customer.account_no}
                    </p>
                  </div>

                  <Badge
                    variant={
                      loan.status === "approved"
                        ? "default"
                        : loan.status === "rejected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {loan.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="text-sm">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* LEFT — Customer & Loan Info */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* Contact */}
                    <div className="space-y-1">
                      <Info label="Email" value={loan.customer.users?.email} />
                      <Info label="Phone" value={loan.customer.users?.phone} />
                    </div>
                    <Separator />
                    {/* Loan Details */}
                    <div className="space-y-1">
                      <Info
                        label="Loan Amount"
                        value={`${loan.amount.toLocaleString()} ETB`}
                        strong
                      />
                      <Info
                        label="Repayment"
                        value={`${loan.repayment_years} years`}
                      />
                      <Info label="Reason" value={loan.reason} />
                      <Info
                        label="Applied"
                        value={format(
                          new Date(loan.created_at),
                          "MMM dd, yyyy"
                        )}
                      />

                      {/* Committee Decision */}
                      {loan.status !== "pending" && loan.committee_comment && (
                        <div className="rounded-lg border bg-muted/40 p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Committee Decision
                            </span>
                            <Badge
                              variant={
                                loan.status === "approved"
                                  ? "default"
                                  : loan.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {loan.status}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground">
                            {loan.committee_comment}
                          </p>
                        </div>
                      )}
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm">Approve / Reject</Button>
                      </DialogTrigger>

                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Approve or Reject Loan</DialogTitle>
                          <DialogDescription>
                            manager decision for this loan request
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="manager_approved">
                                Manager approved
                              </SelectItem>
                              <SelectItem value="manager_reject">
                                Manager Reject
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <Button
                            disabled={!status || isPending}
                            onClick={() => handleUpdateStatus(loan)}
                            className="w-full"
                          >
                            {isPending ? "Updating..." : "Confirm Decision"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* RIGHT — Deposit History */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Deposits</span>
                      <Badge variant="outline">{deposits.length} entries</Badge>
                    </div>

                    <Info
                      label="Total Deposits"
                      value={`${totalDeposits.toLocaleString()} ETB`}
                      strong
                    />

                    <ScrollArea className="h-48 rounded-md border p-2">
                      <div className="space-y-2">
                        {deposits.map((d, i) => (
                          <div
                            key={i}
                            className="rounded-md border p-2 flex items-center justify-between"
                          >
                            <div>
                              <div className="font-medium text-sm">
                                {d.amount.toLocaleString()} ETB
                              </div>
                              <Badge
                                variant={
                                  d.source === "salary"
                                    ? "default"
                                    : "secondary"
                                }
                                className="mt-1 text-xs"
                              >
                                {d.source}
                              </Badge>
                            </div>

                            <div className="text-right text-xs text-muted-foreground">
                              <div>
                                {format(new Date(d.created_at), "MMM dd")}
                              </div>
                              <div>
                                {format(new Date(d.created_at), "yyyy")}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredLoans.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No loan requests found
        </div>
      )}
    </div>
  );
}

/* Small helper for clean label/value rows */
function Info({ label, value, strong }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className={strong ? "font-semibold" : ""}>{value || "-"}</span>
    </div>
  );
}
