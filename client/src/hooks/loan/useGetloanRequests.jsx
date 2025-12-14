import { getLoanRequests } from "@/api/loan";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function useGetloanRequests() {
  const {
    data: loanrequests,
    error: loanreqerr,
    isLoading: loanreqloading,
  } = useQuery({
    queryKey: ["getLoanRequests"],
    queryFn: getLoanRequests,
  });
  return {
    loanrequests,
    loanreqerr,
    loanreqloading,
  };
}
