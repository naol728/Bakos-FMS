/*eslint-disable*/
import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useLoan from "@/hooks/loan/useLoan";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loandepesment, loanrepayment } from "@/api/loan";
import { toast } from "sonner";
import Repayment from "@/components/acountant/Repayment";

export default function ManageLoan() {
  const { loan, loanerr, loanloading } = useLoan();
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const queryclient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: loandepesment,
    onSuccess: (data) => {
      queryclient.invalidateQueries({ queryKey: ["getLoans"] });
      queryclient.invalidateQueries({ queryKey: ["getCustomers"] });
      queryclient.invalidateQueries({ queryKey: ["getCustomer"] });
      toast.success(data.message);
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.message);
    },
  });

  const handleDespense = (data) => {
    const { customer_id, amount, id } = data;
    const user_id = customer_id;
    mutate({ user_id, amount, id });
  };

  // Columns
  const columns = React.useMemo(
    () => [
      {
        accessorFn: (row) =>
          row.customer.first_name + " " + row.customer.father_name,
        id: "customer_name",
        header: "Customer Name",
      },
      {
        accessorFn: (row) => row.customer.account_no,
        id: "account_no",
        header: "Account No",
      },
      {
        accessorKey: "amount",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("amount"));
          return (
            <div className="text-right font-medium">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "ETB",
              }).format(amount)}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("status")}</div>
        ),
      },
      {
        accessorKey: "interest_rate",
        header: "Interest %",
      },
      {
        accessorKey: "repayment_years",
        header: "Repayment Years",
      },
      {
        accessorKey: "issue_date",
        header: "Issue Date",
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const loanRow = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(loanRow.id)}
                >
                  Copy loan ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Dialog>
                  <DialogTrigger
                    asChild
                    onSelect={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <DropdownMenuItem>Customer Info</DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Customer Info</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-4 mt-2">
                      <Avatar className="w-20 h-20">
                        {loanRow.customer.users.photo ? (
                          <AvatarImage src={loanRow.customer.users.photo} />
                        ) : (
                          <AvatarFallback>
                            {loanRow.customer.first_name[0]}
                            {loanRow.customer.father_name[0]}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <p className="font-medium text-lg">
                        {loanRow.customer.first_name}{" "}
                        {loanRow.customer.father_name}
                      </p>
                      <p>Email: {loanRow.customer.users.email}</p>
                      <p>Phone: {loanRow.customer.users.phone}</p>
                      <p>
                        Deposit Amount: {loanRow.customer.deposit_amount} ETB
                      </p>
                      <p>Account No: {loanRow.customer.account_no}</p>
                      <p>Age: {loanRow.customer.age}</p>
                      <p>Sex: {loanRow.customer.sex}</p>
                    </div>
                  </DialogContent>
                </Dialog>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  <Dialog>
                    <DialogTrigger>loan details</DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>loan depesment and repayment</DialogTitle>
                        <DialogDescription></DialogDescription>
                        <Tabs defaultValue="account" className="w-[400px]">
                          <TabsList>
                            <TabsTrigger value="depesment">
                              Repayment
                            </TabsTrigger>
                            <TabsTrigger value="repayment">
                              Depesment{" "}
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="repayment">
                            <div>Make Depesment to the Customer Account</div>
                            {loanRow.is_despens ? (
                              "Already Despensed "
                            ) : (
                              <Button
                                onClick={() => handleDespense(row.original)}
                              >
                                Depens
                              </Button>
                            )}
                          </TabsContent>
                          <TabsContent value="depesment">
                            <Repayment id={loanRow.id} />
                          </TabsContent>
                        </Tabs>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: loan?.loans || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  if (loanloading) return <div>Loading...</div>;
  if (loanerr) return <div>Error loading loans</div>;

  return (
    <div className="w-full">
      <div className="text-xl font-extrabold">Approved Loans</div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter customer name..."
          value={table.getColumn("customer_name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("customer_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
