import { loanrepayment } from "@/api/loan";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function Repayment({ id }) {
  const [repayment, setRepayment] = useState("");
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: loanrepayment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["getLoans"] });
      queryClient.invalidateQueries({ queryKey: ["getCustomers"] });
      queryClient.invalidateQueries({ queryKey: ["getCustomer"] });

      toast.success(data.message);
      setRepayment(""); // ✅ reset input
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to repay loan");
    },
  });

  const handleRepayLoan = () => {
    const amount = Number(repayment);

    // 🛑 Client-side validation
    if (!id) {
      toast.error("Invalid loan reference");
      return;
    }

    if (!amount || amount <= 0) {
      toast.error("Enter a valid repayment amount");
      return;
    }

    mutate({ id, amount });
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm text-muted-foreground">
        Loan Repayment
      </h3>

      <Input
        type="number"
        min="1"
        placeholder="Enter repayment amount"
        value={repayment}
        onChange={(e) => setRepayment(e.target.value)}
        disabled={isPending}
      />

      <Button
        onClick={handleRepayLoan}
        disabled={isPending || !repayment}
        className="w-full"
      >
        {isPending ? "Processing..." : "Repay Loan"}
      </Button>
    </div>
  );
}
