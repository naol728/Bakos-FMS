"use client";

import { log } from "@/api/admin";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function LogFile() {
  const { data, isLoading, error } = useQuery({
    queryFn: log,
    queryKey: ["log"],
  });

  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    if (!data?.length) return [];
    return data.filter(
      (item) =>
        item.meta?.email?.toLowerCase().includes(search.toLowerCase()) ||
        item.level?.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "action_type",
        header: "Action",
      },
      {
        accessorKey: "message",
        header: "Message",
      },
      {
        accessorKey: "meta.email",
        header: "Email",
      },
      {
        accessorKey: "level",
        header: "Level",
        cell: ({ row }) => {
          const level = row.original.level;
          const color =
            level === "INFO"
              ? "bg-blue-100 text-blue-700"
              : level === "ERROR"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700";
          return <Badge className={color}>{level}</Badge>;
        },
      },
      {
        accessorKey: "created_at",
        header: "Date",
        cell: ({ row }) => new Date(row.original.created_at).toLocaleString(),
      },
    ],
    []
  );

  if (isLoading)
    return (
      <div className="text-center py-10 text-gray-500">Loading logs...</div>
    );
  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        Error loading logs: {error.message}
      </div>
    );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">System Logs</h1>
      <Input
        placeholder="Search by email or level..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 max-w-md"
      />
      <DataTable columns={columns} data={rows} />
    </div>
  );
}
