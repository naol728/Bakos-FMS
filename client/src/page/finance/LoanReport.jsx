"use client";

import { getloanreport } from "@/api/finance";
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
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  Percent,
  CalendarDays,
  TrendingDown,
  ShieldCheck,
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
  AreaChart,
  Area,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Calculate loan details
const calculateLoanDetails = (loan) => {
  const principal = loan.amount;
  const annualInterest = loan.interest_rate || 15; // Default 15%
  const years = loan.repayment_years || 1;

  // Simple interest calculation
  const totalInterest = principal * (annualInterest / 100) * years;
  const totalAmount = principal + totalInterest;
  const monthlyPayment = totalAmount / (years * 12);

  return {
    principal,
    annualInterest,
    years,
    totalInterest,
    totalAmount,
    monthlyPayment,
  };
};

// Status badge for loan status
const LoanStatusBadge = ({ status }) => {
  const variants = {
    pending: {
      label: "Pending",
      variant: "destructive",
      color: "bg-red-100 text-red-800",
      icon: <Clock className="h-3 w-3" />,
    },
    manager_approved: {
      label: "Approved by Manager",
      variant: "default",
      color: "bg-green-100 text-green-800",
      icon: <CheckCircle className="h-3 w-3" />,
    },
    committee_approved: {
      label: "Committee Approved",
      variant: "default",
      color: "bg-blue-100 text-blue-800",
      icon: <ShieldCheck className="h-3 w-3" />,
    },
    rejected: {
      label: "Rejected",
      variant: "outline",
      color: "bg-gray-100 text-gray-800",
      icon: <AlertCircle className="h-3 w-3" />,
    },
    disbursed: {
      label: "Disbursed",
      variant: "secondary",
      color: "bg-purple-100 text-purple-800",
      icon: <CreditCard className="h-3 w-3" />,
    },
  };

  const { label, variant, color, icon } = variants[status] || {
    label: status,
    variant: "outline",
    color: "bg-gray-100 text-gray-800",
    icon: <Clock className="h-3 w-3" />,
  };

  return (
    <Badge variant={variant} className={`${color} flex items-center gap-1`}>
      {icon}
      {label}
    </Badge>
  );
};

export default function LoanReport() {
  const {
    data: loanData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["getloanreport"],
    queryFn: getloanreport,
  });

  // Calculate statistics
  const stats = useMemo(() => {
    if (!loanData) {
      return {
        totalActiveLoans: 0,
        totalLoanAmount: 0,
        totalPendingRequests: 0,
        totalApprovedRequests: 0,
        totalCustomers: 0,
        averageLoanAmount: 0,
        averageInterestRate: 0,
        totalInterestRevenue: 0,
        statusDistribution: {},
        topBorrowers: [],
        monthlyRepayments: [],
        loanSizeDistribution: [],
      };
    }

    const activeLoans = loanData.loans || [];
    const loanRequests = loanData.loanreq || [];

    // Total amounts
    const totalActiveLoanAmount = activeLoans.reduce(
      (sum, loan) => sum + loan.amount,
      0
    );
    const totalRequestedAmount = loanRequests.reduce(
      (sum, req) => sum + req.amount,
      0
    );

    // Status counts
    const pendingRequests = loanRequests.filter(
      (req) => req.status === "pending"
    );
    const approvedRequests = loanRequests.filter(
      (req) => req.status === "manager_approved"
    );

    // Unique customers
    const allCustomers = [...activeLoans, ...loanRequests].map(
      (item) => item.customer.id
    );
    const uniqueCustomers = new Set(allCustomers);

    // Interest revenue calculation
    const totalInterestRevenue = activeLoans.reduce((sum, loan) => {
      const details = calculateLoanDetails(loan);
      return sum + details.totalInterest;
    }, 0);

    // Average calculations
    const averageLoanAmount =
      activeLoans.length > 0 ? totalActiveLoanAmount / activeLoans.length : 0;

    const averageInterestRate =
      activeLoans.length > 0
        ? activeLoans.reduce(
            (sum, loan) => sum + (loan.interest_rate || 15),
            0
          ) / activeLoans.length
        : 15;

    // Status distribution for chart
    const statusDistribution = {
      Active: activeLoans.length,
      Pending: pendingRequests.length,
      Approved: approvedRequests.length,
    };

    // Top borrowers by loan amount
    const borrowerTotals = {};
    [...activeLoans, ...loanRequests].forEach((item) => {
      const customerId = item.customer.id;
      if (!borrowerTotals[customerId]) {
        borrowerTotals[customerId] = {
          total: 0,
          customer: item.customer,
          count: 0,
        };
      }
      borrowerTotals[customerId].total += item.amount;
      borrowerTotals[customerId].count += 1;
    });

    const topBorrowers = Object.values(borrowerTotals)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    // Monthly repayment projections (simulated)
    const monthlyRepayments = Array.from({ length: 12 }, (_, i) => {
      const month = new Date();
      month.setMonth(month.getMonth() + i);
      return {
        month: month.toLocaleDateString("en-US", { month: "short" }),
        // eslint-disable-next-line react-hooks/purity
        amount: Math.round(totalActiveLoanAmount / 12 + Math.random() * 1000),
      };
    });

    // Loan size distribution
    const loanSizeDistribution = [
      {
        range: "0-500",
        count: activeLoans.filter((l) => l.amount <= 500).length,
        color: "#3b82f6",
      },
      {
        range: "501-2000",
        count: activeLoans.filter((l) => l.amount > 500 && l.amount <= 2000)
          .length,
        color: "#10b981",
      },
      {
        range: "2001-5000",
        count: activeLoans.filter((l) => l.amount > 2000 && l.amount <= 5000)
          .length,
        color: "#f59e0b",
      },
      {
        range: "5000+",
        count: activeLoans.filter((l) => l.amount > 5000).length,
        color: "#ef4444",
      },
    ];

    return {
      totalActiveLoans: activeLoans.length,
      totalLoanAmount: totalActiveLoanAmount,
      totalPendingRequests: pendingRequests.length,
      totalApprovedRequests: approvedRequests.length,
      totalRequestedAmount,
      totalCustomers: uniqueCustomers.size,
      averageLoanAmount,
      averageInterestRate,
      totalInterestRevenue,
      statusDistribution,
      topBorrowers,
      monthlyRepayments,
      loanSizeDistribution,
      activeLoans,
      loanRequests,
    };
  }, [loanData]);

  // Prepare data for pie chart
  const statusChartData = useMemo(() => {
    return Object.entries(stats.statusDistribution).map(([name, value]) => ({
      name,
      value,
      color:
        name === "Active"
          ? "#10b981"
          : name === "Pending"
          ? "#ef4444"
          : "#3b82f6",
    }));
  }, [stats.statusDistribution]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading loan report...</p>
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
              Unable to load loan report. Please try again later.
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
              Loan Portfolio Report
            </h1>
            <p className="text-muted-foreground">
              Comprehensive overview of active loans and pending requests
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Active Loans */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Loans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {stats.totalActiveLoans}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatCurrency(stats.totalLoanAmount)}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <Progress
                value={
                  (stats.totalActiveLoans /
                    Math.max(
                      stats.totalActiveLoans + stats.totalPendingRequests,
                      1
                    )) *
                  100
                }
                className="h-2 mt-3"
              />
            </CardContent>
          </Card>

          {/* Pending Requests */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {stats.totalPendingRequests}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatCurrency(stats.totalRequestedAmount)}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  {stats.totalApprovedRequests} approved
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Interest Revenue */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Projected Interest
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(stats.totalInterestRevenue)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Avg: {stats.averageInterestRate.toFixed(1)}%
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Percent className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">
                  Projected revenue from active loans
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Customer Stats */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Borrower Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {stats.totalCustomers}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Unique borrowers
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Avg loan: {formatCurrency(stats.averageLoanAmount)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Loan Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Loan Portfolio Status
              </CardTitle>
              <CardDescription>Distribution of loans by status</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={statusChartData}
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
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, "Count"]} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Repayment Projection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Monthly Repayment Projection
              </CardTitle>
              <CardDescription>
                Expected repayments over next 12 months
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.monthlyRepayments}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      formatCurrency(Number(value)),
                      "Amount",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                    name="Monthly Repayment"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Active Loans vs Requests */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Active Loans ({stats.totalActiveLoans})
            </TabsTrigger>
            <TabsTrigger value="requests" className="gap-2">
              <Clock className="h-4 w-4" />
              Loan Requests ({stats.loanRequests?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="borrowers" className="gap-2">
              <User className="h-4 w-4" />
              Top Borrowers ({stats.topBorrowers.length})
            </TabsTrigger>
          </TabsList>

          {/* Active Loans Tab */}
          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active Loan Portfolio</CardTitle>
                <CardDescription>
                  Currently active loans with repayment schedules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Borrower</TableHead>
                      <TableHead>Loan Details</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Interest</TableHead>
                      <TableHead>Repayment</TableHead>
                      <TableHead>Issued Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.activeLoans.map((loan) => {
                      const details = calculateLoanDetails(loan);
                      return (
                        <TableRow key={loan.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {loan.customer.users.photo ? (
                                <img
                                  src={loan.customer.users.photo}
                                  alt={loan.customer.first_name}
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User className="h-5 w-5 text-gray-500" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium">
                                  {loan.customer.first_name}{" "}
                                  {loan.customer.father_name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {loan.customer.account_no}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">
                                <span className="font-medium">Principal:</span>{" "}
                                {formatCurrency(details.principal)}
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">Term:</span>{" "}
                                {details.years} year
                                {details.years !== 1 ? "s" : ""}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-bold">
                            {formatCurrency(loan.amount)}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <Percent className="h-3 w-3" />
                                <span className="font-medium">
                                  {details.annualInterest}%
                                </span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Total: {formatCurrency(details.totalInterest)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">
                                {formatCurrency(details.monthlyPayment)}/mo
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Total: {formatCurrency(details.totalAmount)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div>{formatDate(loan.created_at)}</div>
                              <Badge variant="outline" className="gap-1">
                                <CalendarDays className="h-3 w-3" />
                                {details.years} year
                                {details.years !== 1 ? "s" : ""}
                              </Badge>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Loan Requests Tab */}
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Loan Request Queue</CardTitle>
                <CardDescription>
                  Pending and approved loan applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Requested Amount</TableHead>
                      <TableHead>Repayment Term</TableHead>
                      <TableHead>Current Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applied Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.loanRequests?.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {request.customer.users.photo ? (
                              <img
                                src={request.customer.users.photo}
                                alt={request.customer.first_name}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-500" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">
                                {request.customer.first_name}{" "}
                                {request.customer.father_name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  variant="outline"
                                  className="gap-1 text-xs"
                                >
                                  <Mail className="h-3 w-3" />
                                  {request.customer.users.email}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-bold">
                          {formatCurrency(request.amount)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            {request.repayment_years} year
                            {request.repayment_years !== 1 ? "s" : ""}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-semibold">
                              {formatCurrency(request.customer.deposit_amount)}
                            </div>
                            <Progress
                              value={
                                (request.customer.deposit_amount /
                                  request.amount) *
                                100
                              }
                              className="h-2"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <LoanStatusBadge status={request.status} />
                        </TableCell>
                        <TableCell>{formatDate(request.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Top Borrowers Tab */}
          <TabsContent value="borrowers">
            <Card>
              <CardHeader>
                <CardTitle>Top Borrowers Analysis</CardTitle>
                <CardDescription>
                  Customers with highest loan amounts and activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total Loans</TableHead>
                      <TableHead>Loan Count</TableHead>
                      <TableHead>Current Balance</TableHead>
                      <TableHead>Loan-to-Balance Ratio</TableHead>
                      <TableHead>Contact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.topBorrowers.map((borrower, index) => (
                      <TableRow key={borrower.customer.id}>
                        <TableCell>
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center
                            ${
                              index === 0
                                ? "bg-yellow-100 text-yellow-800"
                                : index === 1
                                ? "bg-gray-100 text-gray-800"
                                : index === 2
                                ? "bg-orange-100 text-orange-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            <span className="font-bold">#{index + 1}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {borrower.customer.users.photo ? (
                              <img
                                src={borrower.customer.users.photo}
                                alt={borrower.customer.first_name}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-500" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">
                                {borrower.customer.first_name}{" "}
                                {borrower.customer.father_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {borrower.customer.account_no}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-bold">
                          {formatCurrency(borrower.total)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {borrower.count} loan
                            {borrower.count !== 1 ? "s" : ""}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold">
                            {formatCurrency(borrower.customer.deposit_amount)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              {(
                                (borrower.total /
                                  borrower.customer.deposit_amount) *
                                100
                              ).toFixed(1)}
                              %
                            </div>
                            <Progress
                              value={
                                (borrower.total /
                                  (borrower.customer.deposit_amount +
                                    borrower.total)) *
                                100
                              }
                              className="h-2"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3" />
                              {borrower.customer.users.phone}
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3" />
                              {borrower.customer.users.email}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Loan Size Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Loan Size Distribution</CardTitle>
              <CardDescription>
                Breakdown of loans by amount ranges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.loanSizeDistribution.map((range) => (
                  <div key={range.range} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">${range.range}</span>
                      <span className="text-muted-foreground">
                        {range.count} loans
                      </span>
                    </div>
                    <Progress
                      value={
                        (range.count / Math.max(stats.totalActiveLoans, 1)) *
                        100
                      }
                      className="h-3"
                      indicatorClassName="bg-blue-500"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Avg Loan Term
                  </span>
                  <span className="font-medium">5 years</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Avg Interest Rate
                  </span>
                  <span className="font-medium">
                    {stats.averageInterestRate.toFixed(1)}%
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Loan-to-Deposit Ratio
                  </span>
                  <span className="font-medium">
                    {(
                      (stats.totalLoanAmount /
                        (stats.totalLoanAmount + stats.totalRequestedAmount)) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Approval Rate
                  </span>
                  <span className="font-medium">
                    {(
                      (stats.totalApprovedRequests /
                        Math.max(stats.loanRequests?.length || 1, 1)) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
