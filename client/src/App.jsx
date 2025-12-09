import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchUser } from "./store/auth/authSlice";

// auth imports
import Login from "./page/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";

//admin imports
import AdminLayout from "./components/admin/AdminLayout";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <Routes>
      {/* public routes */}
      <Route path="/" element={<Login />} />

      {/* admin route  */}
      <Route element={<ProtectedRoute roles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<>admin </>} />
        </Route>
      </Route>
      {/* customer route  */}
      <Route element={<ProtectedRoute roles={["customer"]} />}>
        <Route path="/customer" element={<AdminLayout />}>
          <Route index element={<>customer</>} />
        </Route>
      </Route>
      {/* accountant route  */}
      <Route element={<ProtectedRoute roles={["accountant"]} />}>
        <Route path="/accountant" element={<AdminLayout />}>
          <Route index element={<>accountant </>} />
        </Route>
      </Route>
      {/* manager route  */}
      <Route element={<ProtectedRoute roles={["manager"]} />}>
        <Route path="/manager" element={<AdminLayout />}>
          <Route index element={<>manager</>} />
        </Route>
      </Route>

      {/* loan_committee route  */}
      <Route element={<ProtectedRoute roles={["loan_committee"]} />}>
        <Route path="/loancommittee" element={<AdminLayout />}>
          <Route index element={<>loan_committee </>} />
        </Route>
      </Route>
      {/* finance route  */}
      <Route element={<ProtectedRoute roles={["finance"]} />}>
        <Route path="/finance" element={<AdminLayout />}>
          <Route index element={<>finance </>} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
