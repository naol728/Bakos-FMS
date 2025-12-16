"use client";

import { getdepositreport } from "@/api/finance";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Download,
  Filter,
  Calendar,
  User,
  CreditCard,
  TrendingUp,
  DollarSign,
  BarChart3,
  PieChart,
  Building,
  Mail,
  Phone,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
// const formatDate = (dateString) => {
//   return new Date(dateString).toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//   });
// };

// Status badge for source
const SourceBadge = ({ source }) => {
  const variants = {
    salary: {
      label: "Salary",
      variant: "default",
      color: "bg-blue-100 text-blue-800",
    },
    manual: {
      label: "Manual",
      variant: "secondary",
      color: "bg-gray-100 text-gray-800",
    },
    transfer: {
      label: "Transfer",
      variant: "outline",
      color: "bg-green-100 text-green-800",
    },
  };

  const { label, variant, color } = variants[source] || {
    label: source,
    variant: "outline",
    color: "bg-gray-100 text-gray-800",
  };

  return (
    <Badge variant={variant} className={color}>
      {label}
    </Badge>
  );
};

export default function DepositReport() {
  const {
    data: depositData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["getdepositreport"],
    queryFn: getdepositreport,
  });

  // Calculate statistics
  const stats = useMemo(() => {
    if (!depositData?.data) {
      return {
        totalDeposits: 0,
        totalCustomers: 0,
        averageDeposit: 0,
        largestDeposit: 0,
        smallestDeposit: 0,
        depositCount: 0,
        sourceDistribution: {},
        topCustomers: [],
        dailyDeposits: [],
      };
    }

    const deposits = depositData.data;
    const totalDeposits = deposits.reduce(
      (sum, deposit) => sum + deposit.amount,
      0
    );

    // Unique customers
    const customerIds = new Set(deposits.map((d) => d.customer.id));

    // Source distribution
    const sourceDistribution = {};
    deposits.forEach((deposit) => {
      sourceDistribution[deposit.source] =
        (sourceDistribution[deposit.source] || 0) + deposit.amount;
    });

    // Find largest and smallest deposits
    const amounts = deposits.map((d) => d.amount);
    const largestDeposit = Math.max(...amounts);
    const smallestDeposit = Math.min(...amounts);

    // Top customers by total deposits
    const customerTotals = {};
    deposits.forEach((deposit) => {
      const customerId = deposit.customer.id;
      if (!customerTotals[customerId]) {
        customerTotals[customerId] = { total: 0, customer: deposit.customer };
      }
      customerTotals[customerId].total += deposit.amount;
    });

    const topCustomers = Object.values(customerTotals)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    // Daily deposits for chart
    const dailyDeposits = {};
    deposits.forEach((deposit) => {
      const date = new Date(deposit.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      dailyDeposits[date] = (dailyDeposits[date] || 0) + deposit.amount;
    });

    const dailyDepositsArray = Object.entries(dailyDeposits)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      totalDeposits,
      totalCustomers: customerIds.size,
      averageDeposit: totalDeposits / deposits.length,
      largestDeposit,
      smallestDeposit,
      depositCount: deposits.length,
      sourceDistribution,
      topCustomers,
      dailyDeposits: dailyDepositsArray,
    };
  }, [depositData]);

  // Prepare data for pie chart (source distribution)
  const sourceChartData = useMemo(() => {
    return Object.entries(stats.sourceDistribution).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color:
        name === "salary"
          ? "#3b82f6"
          : name === "manual"
          ? "#10b981"
          : "#f59e0b",
    }));
  }, [stats.sourceDistribution]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading deposit report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Report</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Unable to load deposit report. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Deposit Report
            </h1>
            <p className="text-muted-foreground">
              Comprehensive overview of all deposit transactions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Deposits */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Deposits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.totalDeposits)}
                </div>
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {stats.depositCount} total transactions
              </p>
            </CardContent>
          </Card>

          {/* Average Deposit */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Deposit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.averageDeposit)}
                </div>
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Per transaction
              </p>
            </CardContent>
          </Card>

          {/* Total Customers */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.totalCustomers}</div>
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                With deposit activity
              </p>
            </CardContent>
          </Card>

          {/* Transaction Count */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Transaction Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.depositCount}</div>
                <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                All deposit transactions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Deposits Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Daily Deposit Trend
              </CardTitle>
              <CardDescription>Deposit amounts over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.dailyDeposits}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      formatCurrency(Number(value)),
                      "Amount",
                    ]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Deposit Amount"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Source Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Deposit Source Distribution
              </CardTitle>
              <CardDescription>Breakdown by deposit source</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={sourceChartData}
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
                    {sourceChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      formatCurrency(Number(value)),
                      "Amount",
                    ]}
                  />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Top Customers by Total Deposits
            </CardTitle>
            <CardDescription>
              Customers with highest deposit amounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Account Number</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Total Deposits</TableHead>
                  <TableHead>Current Balance</TableHead>
                  <TableHead>Transaction Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.topCustomers.map((customerData) => {
                  const customer = customerData.customer;
                  const transactionCount =
                    depositData?.data.filter(
                      (d) => d.customer.id === customer.id
                    ).length || 0;

                  return (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {customer.users.photo ? (
                            <img
                              src={customer.users.photo}
                              alt={customer.first_name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">
                              {customer.first_name} {customer.father_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {customer.grand_father_name}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {customer.account_no}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="text-sm">
                              {customer.users.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span className="text-sm">
                              {customer.users.phone}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">
                        {formatCurrency(customerData.total)}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">
                          {formatCurrency(customer.deposit_amount)}
                        </div>
                        <Progress
                          value={
                            (customer.deposit_amount / stats.largestDeposit) *
                            100
                          }
                          className="h-2 mt-1"
                        />
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {transactionCount} transaction
                          {transactionCount !== 1 ? "s" : ""}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Detailed Deposit Transactions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  All Deposit Transactions
                </CardTitle>
                <CardDescription>
                  Complete list of deposit records
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search transactions..."
                  className="max-w-xs"
                />
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Account Balance</TableHead>
                  <TableHead>Customer Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {depositData?.data?.map((deposit) => (
                  <TableRow key={deposit.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {new Date(deposit.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(deposit.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">
                          {deposit.customer.first_name}{" "}
                          {deposit.customer.father_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {deposit.customer.account_no}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <SourceBadge source={deposit.source} />
                    </TableCell>
                    <TableCell className="font-bold text-green-600">
                      +{formatCurrency(deposit.amount)}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">
                        {formatCurrency(deposit.customer.deposit_amount)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1">
                          <Mail className="h-3 w-3" />
                          {deposit.customer.users.email}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <Phone className="h-3 w-3" />
                          {deposit.customer.users.phone}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {depositData?.data?.length || 0} deposit transactions
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Deposit Range
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Largest Deposit
                  </span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(stats.largestDeposit)}
                  </span>
                </div>
                <Progress
                  value={100}
                  className="h-2 bg-gray-200"
                  indicatorClassName="bg-green-500"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Smallest Deposit
                  </span>
                  <span className="font-bold text-blue-600">
                    {formatCurrency(stats.smallestDeposit)}
                  </span>
                </div>
                <Progress
                  value={
                    (stats.smallestDeposit / stats.largestDeposit) * 100 || 0
                  }
                  className="h-2 bg-gray-200"
                  indicatorClassName="bg-blue-500"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Source Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sourceChartData.map((source) => (
                <div key={source.name} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">{source.name}</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(source.value)}
                    </span>
                  </div>
                  <Progress
                    value={(source.value / stats.totalDeposits) * 100}
                    className="h-2"
                    indicatorClassName={
                      source.name === "Salary" ? "bg-blue-500" : "bg-green-500"
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Transactions per Customer
                </span>
                <span className="font-medium">
                  {(stats.depositCount / stats.totalCustomers).toFixed(1)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Deposit Volume
                </span>
                <span className="font-medium">
                  {formatCurrency(stats.totalDeposits)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Average per Customer
                </span>
                <span className="font-medium">
                  {formatCurrency(stats.totalDeposits / stats.totalCustomers)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
