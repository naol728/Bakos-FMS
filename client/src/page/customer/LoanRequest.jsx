"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createrequest,
  deleterequest,
  getuserLoanrequest,
  updaterequest,
} from "@/api/loan";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Loader2, Landmark, PlusCircle, Edit } from "lucide-react";
import { toast } from "sonner";
import { X } from "lucide-react";

export default function LoanRequest() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["getuserLoanrequest"],
    queryFn: getuserLoanrequest,
  });

  /* ---------- Create state ---------- */
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [repaymentYears, setRepaymentYears] = useState("");

  /* ---------- Update state ---------- */
  const [editLoan, setEditLoan] = useState(null);

  /* ---------- Mutations ---------- */
  const createRequest = useMutation({
    mutationFn: createrequest,
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["getuserLoanrequest"] });
      setAmount("");
      setReason("");
      setRepaymentYears("");
    },
    onError: (err) => toast.error(err.message),
  });

  const updateRequest = useMutation({
    mutationFn: updaterequest,
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["getuserLoanrequest"] });
      setEditLoan(null);
    },
    onError: (err) => toast.error(err.message),
  });
  const requestdelete = useMutation({
    mutationFn: deleterequest,
    mutationKey: ["deleterequest"],
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["getuserLoanrequest"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleCreate = () => {
    if (!amount || !reason || !repaymentYears) {
      toast.error("All fields are required");
      return;
    }

    createRequest.mutate({
      amount,
      reason,
      repayment_years: repaymentYears,
    });
  };

  const handleUpdate = () => {
    updateRequest.mutate({
      id: editLoan.id,
      amount: editLoan.amount,
      reason: editLoan.reason,
      repayment_years: editLoan.repayment_years,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">Failed to load loan requests</div>;
  }

  const loans = data?.data || [];

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Landmark className="h-5 w-5" />
            My Loan Requests
          </CardTitle>

          {/* Create Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Loan Request</DialogTitle>
              </DialogHeader>

              <div className="space-y-3">
                <Input
                  placeholder="Amount (ETB)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />

                <Input
                  placeholder="Reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />

                <Input
                  type="number"
                  placeholder="Repayment Years"
                  value={repaymentYears}
                  onChange={(e) => setRepaymentYears(e.target.value)}
                />

                <Button
                  className="w-full"
                  onClick={handleCreate}
                  disabled={createRequest.isPending}
                >
                  {createRequest.isPending && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Submit Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          {loans.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              No loan requests found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Years</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Committee Comment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Update</TableHead>
                  <TableHead>Delete</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loans.map((loan, index) => (
                  <TableRow key={loan.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{loan.amount} ETB</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {loan.reason}
                    </TableCell>
                    <TableCell>{loan.repayment_years}</TableCell>
                    <TableCell>
                      <StatusBadge status={loan.status} />
                    </TableCell>
                    <TableCell>{loan.committee_comment ?? "—"}</TableCell>
                    <TableCell>
                      {new Date(loan.created_at).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <TableCell>
                        {loan.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditLoan(loan)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Update
                          </Button>
                        )}
                      </TableCell>
                    </TableCell>

                    <TableCell>
                      <TableCell>
                        {loan.status === "pending" && (
                          <Button
                            variant="destructive"
                            onClick={() => requestdelete.mutate(loan.id)}
                            size="sm"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </TableCell>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Update Dialog */}
      <Dialog open={!!editLoan} onOpenChange={() => setEditLoan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Loan Request</DialogTitle>
          </DialogHeader>

          {editLoan && (
            <div className="space-y-3">
              <Input
                value={editLoan.amount}
                onChange={(e) =>
                  setEditLoan({ ...editLoan, amount: e.target.value })
                }
              />

              <Input
                value={editLoan.reason}
                onChange={(e) =>
                  setEditLoan({ ...editLoan, reason: e.target.value })
                }
              />

              <Input
                type="number"
                value={editLoan.repayment_years}
                onChange={(e) =>
                  setEditLoan({
                    ...editLoan,
                    repayment_years: e.target.value,
                  })
                }
              />

              <Button
                className="w-full"
                onClick={handleUpdate}
                disabled={updateRequest.isPending}
              >
                {updateRequest.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Update Request
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* Status badge */
function StatusBadge({ status }) {
  if (status === "approved") return <Badge>Approved</Badge>;
  if (status === "rejected")
    return <Badge variant="destructive">Rejected</Badge>;
  return <Badge variant="secondary">Pending</Badge>;
}
