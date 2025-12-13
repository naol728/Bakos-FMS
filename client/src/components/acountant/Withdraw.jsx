"use client";

import React from "react";
import useCustomerWithdraw from "@/hooks/customer/useCustomerWithdraw";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { withdraw } from "@/api/withdraw";
import { toast } from "sonner";

export default function Withdraw({ user_id }) {
  const { userwithdreq, userwithreqloa, userwithreqer } = useCustomerWithdraw({
    user_id,
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: withdraw,
    mutationKey: ["withdraw"],
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["getCustomer"] });
      queryClient.invalidateQueries({ queryKey: ["getCustomers"] });
      queryClient.invalidateQueries({ queryKey: ["getUserwithdraw"] });
      toast.success(data.message);
    },
    onError: (err) => {
      toast.error(err.message || "Withdrawal failed");
    },
  });

  const handleWithdraw = (req) => {
    mutate({
      user_id: req.customer_id,
      amount: req.amount,
    });
  };

  if (userwithreqloa) {
    return (
      <p className="text-muted-foreground">Loading withdrawal requests…</p>
    );
  }

  if (userwithreqer) {
    return (
      <p className="text-destructive">Failed to load withdrawal requests</p>
    );
  }

  if (!userwithdreq?.data?.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No withdrawal requests found
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle>Withdrawal Requests</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Manager Comment</TableHead>
              <TableHead>Requested At</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {userwithdreq.data.map((req) => {
              const isApproved = req.status === "approved";
              const isRejected = req.status === "rejected";

              return (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">
                    ETB {req.amount}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        isApproved
                          ? "success"
                          : isRejected
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {req.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {req.manager_comment || (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  <TableCell>
                    {new Date(req.created_at).toLocaleString()}
                  </TableCell>

                  <TableCell className="text-right">
                    {req.status === "approved" ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm">Process</Button>
                        </DialogTrigger>

                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Withdrawal</DialogTitle>
                            <DialogDescription>
                              You are about to withdraw{" "}
                              <strong>ETB {req.amount}</strong>. This action
                              cannot be undone.
                            </DialogDescription>
                          </DialogHeader>

                          <div className="flex justify-end gap-3 mt-4">
                            <Button variant="outline">Cancel</Button>
                            <Button
                              onClick={() => handleWithdraw(req)}
                              disabled={isPending}
                            >
                              {isPending ? "Processing..." : "Confirm"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        {req.status === "pending"
                          ? "Awaiting Approval"
                          : "Rejected"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
