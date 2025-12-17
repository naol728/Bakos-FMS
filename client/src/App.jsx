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
import LoanRequests from "./page/loancommittee/LoanRequests";
import EmployeeManager from "./page/manager/EmployeeManager";
import Postmeeting from "./page/manager/Postmeeting";
import WithdrawRequest from "./page/manager/WithdrawRequest";
import Loanrequest from "./page/manager/Loanrequest";
import LoanRequest from "./page/customer/LoanRequest";
import Withdraw from "./page/customer/Withdraw";
import Feedback from "./page/customer/Feedback";
import CustomerDashboard from "./page/customer/CustomerDashboard";
import Myloans from "./page/customer/Myloans";
import FinanceReport from "./page/finance/FinanceReport";
import LoanReport from "./page/finance/LoanReport";
import DepositReport from "./page/finance/DepositReport";
import ForgotPassword from "./page/auth/ForgotPassword";
import ChangePassword from "./page/auth/ChanagePassword";
import ViewNewCustomer from "./page/admin/ViewNewCustomer";

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
        <Route path="/chanegpassowrd" element={<ChangePassword />} />
        <Route path="/reset-password" element={<ForgotPassword />} />

        {/* admin route  */}
        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Employee />} />
            <Route path="register-employee" element={<RegisterEmploye />} />
            <Route path="new-customer" element={<ViewNewCustomer />} />
            <Route path="meeting-date" element={<MettingDate />} />
            <Route path="log-file" element={<LogFile />} />
            <Route path="view-feedback" element={<ViewFeedback />} />
            <Route path="settings" element={<Setting />} />
          </Route>
        </Route>
        {/* loan_committee route  */}
        <Route element={<ProtectedRoute roles={["loan_committee"]} />}>
          <Route path="/loancommittee" element={<LoanCommiteLayout />}>
            <Route index element={<LoanRequests />} />
            <Route path="meeting-date" element={<MettingDate />} />
            <Route path="settings" element={<Setting />} />
            <Route path="view-feedback" element={<ViewFeedback />} />
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
            <Route path="view-feedback" element={<ViewFeedback />} />
            <Route
              path="deposit-save-manage/:id"
              element={<CustomerDepositSaviing />}
            />
            <Route path="view-feedback" element={<ViewFeedback />} />

            <Route path="settings" element={<Setting />} />
          </Route>
        </Route>

        {/* manager route  */}
        <Route element={<ProtectedRoute roles={["manager"]} />}>
          <Route path="/manager" element={<ManagerLayout />}>
            <Route index element={<EmployeeManager />} />
            <Route path="post-metting" element={<Postmeeting />} />
            <Route path="meeting-date" element={<MettingDate />} />
            <Route path="withdraw-request" element={<WithdrawRequest />} />
            <Route path="view-feedback" element={<ViewFeedback />} />
            <Route path="loan-request" element={<Loanrequest />} />
            <Route path="settings" element={<Setting />} />
          </Route>
        </Route>
        {/* customer route  */}
        <Route element={<ProtectedRoute roles={["customer"]} />}>
          <Route path="/customer" element={<CustomerLayout />}>
            <Route index element={<CustomerDashboard />} />
            <Route path="loan-reqest" element={<LoanRequest />} />
            <Route path="withdraw-request" element={<Withdraw />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="myloans" element={<Myloans />} />
            <Route path="settings" element={<Setting />} />
          </Route>
        </Route>

        {/* finance route  */}
        <Route element={<ProtectedRoute roles={["finance"]} />}>
          <Route path="/finance" element={<FinanceLayout />}>
            <Route index element={<FinanceReport />} />
            <Route path="deposit-report" element={<DepositReport />} />
            <Route path="loan-report" element={<LoanReport />} />
            <Route path="meeting-date" element={<MettingDate />} />
            <Route path="view-feedback" element={<ViewFeedback />} />
            <Route path="settings" element={<Setting />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
