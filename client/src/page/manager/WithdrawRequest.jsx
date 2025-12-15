"use client";

import { managerwithdrawreqest, UpdateWithdrawStatus } from "@/api/withdraw";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function WithdrawRequest() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["managerwithdrawreqest"],
    queryFn: managerwithdrawreqest,
  });
  const [managercommet, setMangerComment] = useState("");
  const [status, setStatus] = useState("");
  const queryclient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: UpdateWithdrawStatus,
    onSuccess: (data) => {
      queryclient.invalidateQueries({ queryKey: ["managerwithdrawreqest"] });
      toast.success(data.message);
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.message);
    },
  });
  const handleWithdrawlstatusupdate = (data) => {
    const { id } = data;
    mutate({
      id,
      manager_comment: managercommet,
      status,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading withdrawal requests...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-destructive">
        Failed to load withdrawal requests
      </div>
    );
  }

  if (!data?.data?.length) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No withdrawal requests found
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Withdrawal Requests</h1>

      <div className="grid gap-4">
        {data.data.map((req) => {
          const customer = req.customer;
          const user = customer?.user;

          return (
            <Card key={req.id} className="shadow-sm">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user?.photo || ""} />
                  <AvatarFallback>
                    {customer?.first_name?.charAt(0) || "C"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {customer.first_name} {customer.father_name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Account No: {customer.account_no}
                  </p>
                </div>

                <Badge
                  variant={
                    req.status === "approved"
                      ? "default"
                      : req.status === "rejected"
                      ? "destructive"
                      : "secondary"
                  }
                  className="capitalize"
                >
                  {req.status}
                </Badge>
              </CardHeader>

              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {user?.phone || "—"}
                  </p>
                  <p>
                    <span className="font-medium">Age:</span> {customer.age}
                  </p>
                  <p>
                    <span className="font-medium">Deposit:</span>{" "}
                    {customer.deposit_amount} Birr
                  </p>
                </div>

                <div>
                  <p>
                    <span className="font-medium">Withdraw Amount:</span>{" "}
                    {req.amount} Birr
                  </p>
                  <p>
                    <span className="font-medium">Requested On:</span>{" "}
                    {format(new Date(req.created_at), "PPP")}
                  </p>
                  <p>
                    <span className="font-medium">Manager Comment:</span>{" "}
                    {req.manager_comment || "—"}
                  </p>
                </div>
              </CardContent>
              {req.status !== "approved" && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Update Status
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Update Withdrawal Status</DialogTitle>
                      <DialogDescription>
                        Approve or reject this withdrawal request.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      {/* STATUS */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <Select value={status} onValueChange={setStatus}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="approved">Approve</SelectItem>
                            <SelectItem value="rejected">Reject</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* COMMENT */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Manager Comment
                        </label>
                        <Input
                          placeholder="Optional comment..."
                          value={managercommet}
                          onChange={(e) => setMangerComment(e.target.value)}
                        />
                      </div>

                      {/* ACTION */}
                      <Button
                        className="w-full"
                        disabled={isPending || !status}
                        onClick={() => handleWithdrawlstatusupdate(req)}
                      >
                        {isPending ? "Updating..." : "Confirm Update"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
