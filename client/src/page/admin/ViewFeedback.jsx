"use client";

import { getFeedbacks } from "@/api/admin";
import { useQuery } from "@tanstack/react-query";
import React from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function ViewFeedback() {
  const { data, error, isLoading } = useQuery({
    queryFn: getFeedbacks,
    queryKey: ["getFeedbacks"],
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-60 text-xl font-semibold">
        Loading feedback...
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 text-center text-lg">
        Failed to load feedback!
      </div>
    );

  const feedbacks = data?.data || [];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Customer Feedback</h1>

      {feedbacks.length === 0 && (
        <p className="text-gray-500 text-center text-lg">
          No feedback available.
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {feedbacks.map((item) => (
          <Card key={item.id} className="shadow-md rounded-xl">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14">
                  <AvatarImage
                    src={item.customer?.photo}
                    alt={`${item.customer?.first_name}`}
                  />
                  <AvatarFallback>
                    {item.customer?.first_name?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <CardTitle className="text-xl font-semibold">
                    {item.customer?.first_name} {item.customer?.father_name}{" "}
                    {item.customer?.grand_father_name}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    Account No: {item.customer?.account_no}
                  </p>
                </div>
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="mt-4 space-y-3">
              <div>
                <h3 className="font-semibold text-gray-700">Feedback</h3>
                <p className="text-gray-600">{item.message}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700">
                  Customer Details
                </h3>
                <ul className="text-gray-600 space-y-1">
                  <li>
                    <span className="font-medium">Age:</span>{" "}
                    {item.customer?.age || "N/A"}
                  </li>
                  <li>
                    <span className="font-medium">Sex:</span>{" "}
                    {item.customer?.sex}
                  </li>
                  <li>
                    <span className="font-medium">University ID:</span>{" "}
                    {item.customer?.university_id}
                  </li>
                  <li>
                    <span className="font-medium">Deposit:</span>{" "}
                    {item.customer?.deposit_amount} ETB
                  </li>
                  <li>
                    <span className="font-medium">Share Amount:</span>{" "}
                    {item.customer?.share_amount} ETB
                  </li>
                </ul>
              </div>

              <Separator />

              <p className="text-xs text-gray-500">
                Submitted: {new Date(item.created_at).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
