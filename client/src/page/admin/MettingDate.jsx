"use client";

import { getmeetings } from "@/api/admin";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useMemo } from "react";

import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { format } from "date-fns";

export default function MeetingDate() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["getmeetings"],
    queryFn: getmeetings,
  });

  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    if (!data?.data) return [];

    return data.data.filter((meeting) => {
      const q = search.toLowerCase();

      return (
        meeting?.title?.toLowerCase().includes(q) ||
        meeting?.description?.toLowerCase().includes(q) ||
        meeting?.users?.full_name?.toLowerCase().includes(q)
      );
    });
  }, [data, search]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.title}</span>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.description || "—"}
          </span>
        ),
      },
      {
        accessorKey: "meeting_date",
        header: "Meeting Date",
        cell: ({ row }) => format(new Date(row.original.meeting_date), "PPP"),
      },
      {
        id: "posted_by",
        header: "Posted By",
        cell: ({ row }) => {
          const user = row.original.users;

          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.photo || ""} />
                <AvatarFallback>
                  {user?.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="leading-tight">
                <p className="text-sm font-medium">
                  {user?.full_name || "Unknown"}
                </p>
                <Badge variant="secondary" className="text-xs capitalize">
                  {user?.role || "user"}
                </Badge>
              </div>
            </div>
          );
        },
      },
    ],
    []
  );

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-60 text-muted-foreground">
        Loading meetings...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-60 text-destructive">
        Failed to load meetings
      </div>
    );

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl font-bold">Meeting Announcements</h1>

        <Input
          placeholder="Search by title, description, or manager..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <DataTable columns={columns} data={rows} />
    </div>
  );
}
