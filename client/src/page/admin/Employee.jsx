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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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
import useEmployee from "@/hooks/employee/useEmployee";
import { LoadingPage } from "@/components/LoadingPage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RegisterEmployee from "../../components/admin/RegisterEmploye";

import EditEmployee from "@/components/admin/EditEmployee";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEmployee } from "@/api/admin";
import { toast } from "sonner";

export default function Employee() {
  const { employee, employeeerr, loadingemployee } = useEmployee();
  const queryclient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: deleteEmployee,
    mutationKey: ["deleteEmployee"],
    onSuccess: (data) => {
      console.log(data);
      queryclient.invalidateQueries({ queryKey: ["getEmployee"] });
      toast.success(data.message || "Employee deleted Successfuly");
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.message || "Something Went Wrong");
    },
  });
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const roleColor = {
    manager: "bg-blue-100 text-blue-700 border-blue-300",
    accountant: "bg-green-100 text-green-700 border-green-300",
    loan_committee: "bg-purple-100 text-purple-700 border-purple-300",
    finance: "bg-orange-100 text-orange-700 border-orange-300",
  };

  const handledelete = (id) => {
    mutate(id);
  };
  const columns = [
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={
            row.getValue("is_active")
              ? "bg-emerald-100 text-emerald-700 border-emerald-300"
              : "bg-red-100 text-red-700 border-red-300"
          }
        >
          {row.getValue("is_active") ? "Active" : "Inactive"}
        </Badge>
      ),
    },

    // NAME + PHOTO COMBINED
    {
      accessorKey: "full_name",
      header: "Employee",
      cell: ({ row }) => {
        const name = row.getValue("full_name");
        const photo = row.original.photo;

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 rounded-md">
              <AvatarImage src={photo} />
              <AvatarFallback>{name?.at(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{name}</span>
          </div>
        );
      },
    },

    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Email
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase text-muted-foreground">
          {row.getValue("email")}
        </div>
      ),
    },

    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role");
        return (
          <Badge
            variant="outline"
            className={`capitalize border px-2 py-1 ${roleColor[role]}`}
          >
            {role.replace("_", " ")}
          </Badge>
        );
      },
    },

    {
      accessorKey: "phone",
      header: "Phone No",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.getValue("phone") || "—"}
        </span>
      ),
    },

    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => {
        const date = row.getValue("created_at");
        return (
          <span className="text-muted-foreground">
            {format(new Date(date), "MMM dd, yyyy • HH:mm")}
          </span>
        );
      },
    },

    // ACTIONS
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const emp = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(emp.id)}
              >
                Copy Employee ID
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <Dialog>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  {emp.role == "admin" ? (
                    <></>
                  ) : (
                    <DialogTrigger asChild>
                      <div>Edit</div>
                    </DialogTrigger>
                  )}
                </DropdownMenuItem>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Employee?</DialogTitle>
                    <DialogDescription>Edit Employee</DialogDescription>
                    <EditEmployee employee={row.original} />
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              {emp.role == "admin" ? (
                <></>
              ) : (
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => handledelete(emp.id)}
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: employee?.data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  if (loadingemployee) return <LoadingPage />;

  return (
    <>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-foreground">Employees</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              + Add Employee
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-card border-border shadow-xl">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Fill in employee details below.
              </DialogDescription>
            </DialogHeader>

            <RegisterEmployee />
          </DialogContent>
        </Dialog>
      </div>

      {/* Table Card */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Toolbar (Search + Columns) */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-4 border-b bg-muted/40">
          <Input
            placeholder="Search by email..."
            value={table.getColumn("email")?.getFilterValue() ?? ""}
            onChange={(e) =>
              table.getColumn("email")?.setFilterValue(e.target.value)
            }
            className="max-w-xs"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                Columns
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="bg-popover shadow-md border-border"
            >
              {table
                .getAllColumns()
                .filter((c) => c.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                    className="capitalize"
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-foreground font-semibold text-xs uppercase tracking-wide"
                  >
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

          {/* Table Body */}
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={`transition-colors ${
                    index % 2 === 0 ? "bg-background" : "bg-muted/30"
                  } hover:bg-accent/50`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-3 text-sm text-foreground"
                    >
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
                  className="h-24 text-center text-muted-foreground"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4 border-t bg-muted/40">
          <span className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1}
          </span>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
