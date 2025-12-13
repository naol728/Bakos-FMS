import { getUserwithdraw } from "@/api/withdraw";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function useCustomerWithdraw({ user_id }) {
  const {
    data: userwithdreq,
    error: userwithreqer,
    isLoading: userqithreqloa,
  } = useQuery({
    queryKey: ["getUserwithdraw", user_id],
    queryFn: () => getUserwithdraw({ user_id }),
    enabled: !!user_id,
  });
  return {
    userwithdreq,
    userwithreqer,
    userqithreqloa,
  };
}
