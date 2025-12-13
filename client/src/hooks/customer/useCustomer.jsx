import { getCustomer } from "@/api/accountant";
import { useQuery } from "@tanstack/react-query";

export default function useCustomer(id) {
  const {
    data,
    isLoading: customerloading,
    error: customererror,
  } = useQuery({
    queryKey: ["getCustomer", id],
    queryFn: () => getCustomer(id),
    enabled: id !== undefined || id === undefined,
  });
  console.log(data);
  const customers = Array.isArray(data) ? data : data?.data || [];
  const user = Array.isArray(data) ? data : data?.user || [];
  return {
    customer: customers,
    customererror,
    customerloading,
    user,
  };
}
