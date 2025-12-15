"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { myloans } from "@/api/loan";

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
import { Loader2, Banknote } from "lucide-react";

export default function Myloans() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["myloans"],
    queryFn: myloans,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">Failed to load loans</div>;
  }

  const loans = data?.data || [];

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5" />
            My Loans
          </CardTitle>
        </CardHeader>

        <CardContent>
          {loans.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              You have no active loans
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Amount (ETB)</TableHead>
                  <TableHead>Interest Rate</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Repayment Years</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Disbursed</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loans.map((loan, index) => (
                  <TableRow key={loan.id}>
                    <TableCell>{index + 1}</TableCell>

                    <TableCell className="font-medium">
                      {loan.amount} ETB
                    </TableCell>

                    <TableCell>{loan.interest_rate}%</TableCell>

                    <TableCell>
                      {new Date(loan.issue_date).toLocaleDateString()}
                    </TableCell>

                    <TableCell>{loan.repayment_years} years</TableCell>

                    <TableCell>
                      <StatusBadge status={loan.status} />
                    </TableCell>

                    <TableCell>
                      {loan.is_despens ? (
                        <Badge>Yes</Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* Status badge */
function StatusBadge({ status }) {
  if (status === "active") return <Badge>Active</Badge>;
  if (status === "closed") return <Badge variant="secondary">Closed</Badge>;
  return <Badge variant="secondary">Pending</Badge>;
}
