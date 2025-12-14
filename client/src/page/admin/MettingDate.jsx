"use client";

import { getmeetings } from "@/api/admin";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function MeetingDate() {
  const { data, isLoading, error } = useQuery({
    queryFn: getmeetings,
    queryKey: ["getmeetings"],
  });

  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    if (!data?.data) return [];
    return data?.data?.filter(
      (meeting) =>
        meeting.title.toLowerCase().includes(search.toLowerCase()) ||
        (meeting.description &&
          meeting.description.toLowerCase().includes(search.toLowerCase())) ||
        meeting.users.full_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "meeting_date",
        header: "Date",
        cell: ({ row }) =>
          new Date(row.original.meeting_date).toLocaleDateString(),
      },
      {
        accessorKey: "users.full_name",
        header: "Posted By",
      },
      {
        accessorKey: "users.role",
        header: "Role",
        cell: ({ row }) => {
          const role = row.original.users.role;
          const color =
            role === "admin"
              ? "bg-red-100 text-red-700"
              : role === "manager"
              ? "bg-blue-100 text-blue-700"
              : role === "customer"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700";
          return <Badge className={color}>{role}</Badge>;
        },
      },
    ],
    []
  );

  if (isLoading)
    return (
      <div className="text-center py-10 text-gray-500">Loading meetings...</div>
    );
  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        Error loading meetings: {error.message}
      </div>
    );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Meetings</h1>
      <Input
        placeholder="Search by title, description, or user..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 max-w-md"
      />
      <DataTable columns={columns} data={rows} />
    </div>
  );
}
