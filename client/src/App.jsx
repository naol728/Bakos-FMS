import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchUser } from "./store/auth/authSlice";

// auth imports
import Login from "./page/auth/Login";

//layout imports
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import CustomerLayout from "./components/customer/CustomerLayout";
import AccountantLayout from "./components/acountant/AccountantLayout";
import ManagerLayout from "./components/manager/ManagerLayout";
import LoanCommiteLayout from "./components/loancommittee/LoanCommiteLayout";
import FinanceLayout from "./components/finance/FinanceLayout";
import RegisterEmploye from "./components/admin/RegisterEmploye";
import Employee from "./page/admin/Employee";
import ViewNewCustomer from "./page/admin/ViewNewCustomer";
import MettingDate from "./page/admin/MettingDate";
import LogFile from "./page/admin/LogFile";
import ViewFeedback from "./page/admin/ViewFeedback";
import Setting from "./page/admin/Setting";
import Dashboard from "./page/admin/Dashboard";
import { Suspense } from "react";
import { LoadingPage } from "./components/LoadingPage";
import Customer from "./page/acountant/Customer";
import ManageLoan from "./page/acountant/ManageLoan";
import DipositSaving from "./page/acountant/DipositSaving";
import RegisterCustomer from "./page/acountant/RegisterCustomer";
import CustomerDepositSaviing from "./page/acountant/CustomerDepositSaviing";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Login />} />

        {/* admin route  */}
        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="register-employee" element={<RegisterEmploye />} />
            <Route path="manage-employee" element={<Employee />} />
            <Route path="new-customer" element={<Customer />} />
            <Route path="meeting-date" element={<MettingDate />} />
            <Route path="log-file" element={<LogFile />} />
            <Route path="view-feedback" element={<ViewFeedback />} />
            <Route path="settings" element={<Setting />} />
          </Route>
        </Route>
        {/* customer route  */}
        <Route element={<ProtectedRoute roles={["customer"]} />}>
          <Route path="/customer" element={<CustomerLayout />}>
            <Route index element={<>customer</>} />
          </Route>
        </Route>
        {/* accountant route  */}
        <Route element={<ProtectedRoute roles={["accountant"]} />}>
          <Route path="/accountant" element={<AccountantLayout />}>
            <Route index element={<Customer />} />
            <Route path="manage-loan" element={<ManageLoan />} />
            <Route path="registercustomer" element={<RegisterCustomer />} />
            <Route path="meeting-date" element={<MettingDate />} />
            <Route path="deposit-save-manage" element={<DipositSaving />} />
            <Route
              path="deposit-save-manage/:id"
              element={<CustomerDepositSaviing />}
            />
            <Route path="settings" element={<Setting />} />
          </Route>
        </Route>
        {/* manager route  */}
        <Route element={<ProtectedRoute roles={["manager"]} />}>
          <Route path="/manager" element={<ManagerLayout />}>
            <Route index element={<>manager</>} />
          </Route>
        </Route>

        {/* loan_committee route  */}
        <Route element={<ProtectedRoute roles={["loan_committee"]} />}>
          <Route path="/loancommittee" element={<LoanCommiteLayout />}>
            <Route index element={<>loan_committee </>} />
          </Route>
        </Route>
        {/* finance route  */}
        <Route element={<ProtectedRoute roles={["finance"]} />}>
          <Route path="/finance" element={<FinanceLayout />}>
            <Route index element={<>finance </>} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
