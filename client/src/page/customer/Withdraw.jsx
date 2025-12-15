"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addRequest,
  deleteWithdrawal,
  getRequests,
  updatewithdraw,
} from "@/api/withdraw";

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

import { Wallet, Plus, Edit, X, Loader2 } from "lucide-react";

import { toast } from "sonner";

export default function Withdraw() {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [updateAmount, setUpdateAmount] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["getRequests"],
    queryFn: getRequests,
  });

  /* Create */
  const createRequest = useMutation({
    mutationFn: addRequest,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["getRequests"] });
      toast.success(res.message);
      setAmount("");
    },
    onError: (err) => toast.error(err.message),
  });

  /* Update */
  const updateRequest = useMutation({
    mutationFn: updatewithdraw,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["getRequests"] });
      toast.success(res.message);
      setUpdateAmount("");
    },
    onError: (err) => toast.error(err.message),
  });

  /* Delete */
  const deleteRequest = useMutation({
    mutationFn: deleteWithdrawal,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["getRequests"] });
      toast.success(res.message);
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">Failed to load withdrawal requests</div>
    );
  }

  const requests = data?.data || [];

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Withdrawal Requests
          </CardTitle>

          {/* Create Request */}
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Withdrawal</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <Input
                  type="number"
                  placeholder="Enter amount (ETB)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />

                <Button
                  className="w-full"
                  onClick={() => createRequest.mutate({ amount })}
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
          {requests.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              No withdrawal requests found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Manager Comment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {requests.map((item, index) => {
                  const isPending = item.status === "pending";

                  return (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>

                      <TableCell className="font-medium">
                        {item.amount} ETB
                      </TableCell>

                      <TableCell>
                        <StatusBadge status={item.status} />
                      </TableCell>

                      <TableCell>
                        {item.manager_comment || (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      <TableCell>
                        {new Date(item.created_at).toLocaleDateString()}
                      </TableCell>

                      <TableCell className="text-right space-x-2">
                        {/* Update */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={!isPending}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Update
                            </Button>
                          </DialogTrigger>

                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Update Withdrawal Amount
                              </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4">
                              <Input
                                type="number"
                                placeholder="New amount"
                                value={updateAmount}
                                onChange={(e) =>
                                  setUpdateAmount(e.target.value)
                                }
                              />

                              <Button
                                className="w-full"
                                onClick={() =>
                                  updateRequest.mutate({
                                    id: item.id,
                                    amount: updateAmount,
                                  })
                                }
                                disabled={updateRequest.isPending}
                              >
                                Update Amount
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Cancel */}
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={!isPending}
                          onClick={() => deleteRequest.mutate(item.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* Status Badge */
function StatusBadge({ status }) {
  if (status === "approved") {
    return <Badge>Approved</Badge>;
  }

  if (status === "rejected") {
    return <Badge variant="destructive">Rejected</Badge>;
  }

  return <Badge variant="secondary">Pending</Badge>;
}
