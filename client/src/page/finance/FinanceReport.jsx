"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFinancereport } from "@/api/finance";
import useGetloanRequests from "@/hooks/loan/useGetloanRequests";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Wallet,
  CreditCard,
  BarChart3,
  PieChart,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

// Status badge component
const StatusBadge = ({ status }) => {
  const variants = {
    pending: { variant: "destructive", label: "Pending" },
    manager_approved: { variant: "default", label: "Approved" },
    committee_approved: { variant: "default", label: "Committee Approved" },
    rejected: { variant: "outline", label: "Rejected" },
    completed: { variant: "secondary", label: "Completed" },
  };

  const { variant, label } = variants[status] || {
    variant: "outline",
    label: status,
  };

  return <Badge variant={variant}>{label}</Badge>;
};

export default function FinanceReport() {
  const { data: financereport, isLoading } = useQuery({
    queryKey: ["getFinancereport"],
    queryFn: getFinancereport,
  });

  const { loanrequests } = useGetloanRequests();

  // Calculate comprehensive statistics
  const stats = useMemo(() => {
    if (!financereport?.data) {
      return {
        totalDeposits: 0,
        totalWithdrawals: 0,
        netFlow: 0,
        transactionCount: 0,
        avgTransaction: 0,
        pendingWithdrawals: 0,
        approvedWithdrawals: 0,
        recentTransactions: [],
      };
    }

    const { transactions, withdrawRequests } = financereport.data;

    // Deposits
    const deposits = transactions.filter((t) => t.direction === "in");
    const totalDeposits = deposits.reduce((sum, t) => sum + t.amount, 0);

    // Withdrawals
    const totalWithdrawals = withdrawRequests.reduce(
      (sum, w) => sum + w.amount,
      0
    );

    // Withdrawal status counts
    const pendingWithdrawals = withdrawRequests.filter(
      (w) => w.status === "pending"
    ).length;
    const approvedWithdrawals = withdrawRequests.filter(
      (w) => w.status === "approved"
    ).length;

    // Transaction metrics
    const transactionCount = transactions.length;
    const avgTransaction =
      transactionCount > 0 ? totalDeposits / transactionCount : 0;

    // Recent transactions (last 5)
    const recentTransactions = [...transactions]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 5);

    return {
      totalDeposits,
      totalWithdrawals,
      netFlow: totalDeposits - totalWithdrawals,
      transactionCount,
      avgTransaction,
      pendingWithdrawals,
      approvedWithdrawals,
      recentTransactions,
    };
  }, [financereport]);

  // Prepare transaction graph data
  const transactionGraphData = useMemo(() => {
    if (!financereport?.data) return [];

    const dailyData = {};

    financereport.data.transactions.forEach((t) => {
      const date = new Date(t.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (!dailyData[date]) {
        dailyData[date] = { date, deposits: 0, withdrawals: 0 };
      }

      if (t.direction === "in") {
        dailyData[date].deposits += t.amount;
      }
    });

    financereport.data.withdrawRequests.forEach((w) => {
      const date = new Date(w.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (!dailyData[date]) {
        dailyData[date] = { date, deposits: 0, withdrawals: 0 };
      }

      dailyData[date].withdrawals += w.amount;
    });

    return Object.values(dailyData).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [financereport]);

  // Loan statistics
  const loanStats = useMemo(() => {
    if (!loanrequests?.data) {
      return {
        totalPending: 0,
        totalApproved: 0,
        totalRejected: 0,
        totalAmount: 0,
        avgLoanAmount: 0,
        loanDistribution: [],
        recentLoans: [],
      };
    }

    const pending = loanrequests.data.filter((l) => l.status === "pending");
    const approved = loanrequests.data.filter(
      (l) => l.status === "manager_approved"
    );
    const rejected = loanrequests.data.filter((l) => l.status === "rejected");

    const totalAmount = loanrequests.data.reduce((sum, l) => sum + l.amount, 0);
    const avgLoanAmount =
      loanrequests.data.length > 0 ? totalAmount / loanrequests.data.length : 0;

    const loanDistribution = [
      { name: "Pending", value: pending.length, color: "#ef4444" },
      { name: "Approved", value: approved.length, color: "#10b981" },
      { name: "Rejected", value: rejected.length, color: "#6b7280" },
    ];

    const recentLoans = [...loanrequests.data]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 5);

    return {
      totalPending: pending.length,
      totalApproved: approved.length,
      totalRejected: rejected.length,
      totalAmount,
      avgLoanAmount,
      loanDistribution,
      recentLoans,
    };
  }, [loanrequests]);

  // Prepare pie chart data for transaction types
  const transactionTypeData = useMemo(() => {
    if (!financereport?.data) return [];

    const typeCount = {};
    financereport.data.transactions.forEach((t) => {
      typeCount[t.type] = (typeCount[t.type] || 0) + 1;
    });

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

    return Object.entries(typeCount).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length],
    }));
  }, [financereport]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading financial report...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[90vh]">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Financial Dashboard
          </h1>
          <p className="text-muted-foreground">
            Comprehensive overview of financial transactions, deposits,
            withdrawals, and loan requests
          </p>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Deposits Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Deposits
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ETB{stats.totalDeposits.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.transactionCount} total transactions
              </p>
              <div className="flex items-center mt-2">
                <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">
                  Avg: ETB{stats.avgTransaction.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Total Withdrawals Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Withdrawals
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ETB{stats.totalWithdrawals.toLocaleString()}
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="text-xs text-muted-foreground">
                  Pending: {stats.pendingWithdrawals}
                </div>
                <div className="text-xs text-muted-foreground">
                  Approved: {stats.approvedWithdrawals}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Net Cash Flow Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Net Cash Flow
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ETB{
                  stats.netFlow >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ETB{stats.netFlow.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Deposits - Withdrawals
              </p>
              <Progress
                value={
                  stats.totalDeposits > 0
                    ? (stats.netFlow / stats.totalDeposits) * 100
                    : 0
                }
                className="mt-2"
              />
            </CardContent>
          </Card>

          {/* Loan Overview Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Loan Overview
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ETB{loanStats.totalAmount.toLocaleString()}
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="text-xs">
                  <span className="text-red-500">
                    Pending: {loanStats.totalPending}
                  </span>
                </div>
                <div className="text-xs">
                  <span className="text-green-500">
                    Approved: {loanStats.totalApproved}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Avg: ETB{loanStats.avgLoanAmount.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transaction Flow Chart */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Transaction Flow Over Time
              </CardTitle>
              <CardDescription>
                Daily deposits and withdrawals comparison
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transactionGraphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      `$${value.toLocaleString()}`,
                      "Amount",
                    ]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="deposits" name="Deposits" fill="#3b82f6" />
                  <Bar
                    dataKey="withdrawals"
                    name="Withdrawals"
                    fill="#ef4444"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Loan Status Distribution */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Loan Request Distribution
              </CardTitle>
              <CardDescription>
                Breakdown of loan requests by status
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={loanStats.loanDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {loanStats.loanDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, "Requests"]} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Transactions
              </CardTitle>
              <CardDescription>Latest 5 transaction records</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Direction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        ETB{transaction.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.direction === "in"
                              ? "default"
                              : "destructive"
                          }
                          className="flex items-center gap-1"
                        >
                          {transaction.direction === "in" ? (
                            <>
                              <ArrowUpIcon className="h-3 w-3" />
                              Incoming
                            </>
                          ) : (
                            <>
                              <ArrowDownIcon className="h-3 w-3" />
                              Outgoing
                            </>
                          )}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Showing {stats.recentTransactions.length} of{" "}
              {stats.transactionCount} transactions
            </CardFooter>
          </Card>

          {/* Recent Loan Requests Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recent Loan Requests
              </CardTitle>
              <CardDescription>
                Latest loan applications and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loanStats.recentLoans.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell className="font-medium">
                        {loan.customer?.first_name} {loan.customer?.father_name}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">
                          ETB{loan.amount.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Balance:ETB
                          {loan.customer?.deposit_amount?.toLocaleString() || 0}
                        </div>
                      </TableCell>
                      <TableCell>
                        {loan.repayment_years} year
                        {loan.repayment_years !== 1 ? "s" : ""}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={loan.status} />
                      </TableCell>
                      <TableCell>
                        {new Date(loan.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              {loanStats.totalPending} pending requests need attention
            </CardFooter>
          </Card>
        </div>

        {/* Transaction Type Distribution */}
        {transactionTypeData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Transaction Type Distribution</CardTitle>
              <CardDescription>
                Breakdown of transactions by type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {transactionTypeData.map((type) => (
                  <div key={type.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">
                        {type.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {type.value}
                      </span>
                    </div>
                    <Progress
                      value={(type.value / stats.transactionCount) * 100}
                      className="h-2"
                      style={{ backgroundColor: type.color + "20" }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Summary Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Total Transactions
                </p>
                <p className="text-2xl font-bold">{stats.transactionCount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Avg Transaction</p>
                <p className="text-2xl font-bold">
                  ${stats.avgTransaction.toFixed(2)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Total Loan Amount
                </p>
                <p className="text-2xl font-bold">
                  ${loanStats.totalAmount.toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Net Cash Position
                </p>
                <p
                  className={`text-2xl font-bold ${
                    stats.netFlow >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ETB{stats.netFlow.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
