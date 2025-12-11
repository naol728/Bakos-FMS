import { getCusomers } from "@/api/accountant";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function useCustomer() {
  const {
    data: customer,
    error: customererror,
    isLoading: customerloading,
  } = useQuery({
    queryFn: getCusomers,
    queryKey: ["getCusomers"],
  });
  return {
    customer,
    customererror,
    customerloading,
  };
}
