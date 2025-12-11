import { getEmployee } from "@/api/admin";
import { useQuery } from "@tanstack/react-query";

export default function useEmployee() {
  const {
    data: employee,
    isLoading: loadingemployee,
    error: employeeerr,
  } = useQuery({
    queryKey: ["getEmployee"],
    queryFn: getEmployee,
  });

  return {
    employee,
    loadingemployee,
    employeeerr,
  };
}
