"use client";

import { deposit } from "@/api/deposit";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function Deposit({ id }) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: deposit,
    mutationKey: ["deposit"],
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["getCustomers"] });
      queryClient.invalidateQueries({ queryKey: ["getCustomer"] });
      toast.success(data.message);
      setFormdata({ amount: "", source: "", customer_id: id });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const [formdata, setFormdata] = useState({
    amount: "",
    source: "",
    customer_id: id,
  });

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSelect = (value) => {
    setFormdata({ ...formdata, source: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formdata.amount || !formdata.source) {
      return toast.error("Please fill in all fields");
    }
    mutate(formdata);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Deposit Funds</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div className="flex flex-col">
            <Label htmlFor="amount">Amount</Label>
            <Input
              type="number"
              id="amount"
              name="amount"
              placeholder="Enter amount"
              value={formdata.amount}
              onChange={handleChange}
              required
            />
          </div>

          {/* Source */}
          <div className="flex flex-col">
            <Label htmlFor="source">Source</Label>
            <Select
              onValueChange={handleSelect}
              value={formdata.source}
              required
            >
              <SelectTrigger id="source" className="w-full">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Depositing..." : "Deposit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
