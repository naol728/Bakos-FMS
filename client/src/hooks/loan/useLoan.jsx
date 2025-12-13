import { getLoans } from "@/api/loan";
import { useQuery } from "@tanstack/react-query";

export default function useLoan() {
  const {
    data: loan,
    isLoading: loanloading,
    error: loanerr,
  } = useQuery({
    queryFn: getLoans,
    queryKey: ["getLoans"],
  });
  return {
    loan,
    loanloading,
    loanerr,
  };
}
