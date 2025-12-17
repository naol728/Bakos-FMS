import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/api/auth";
import { loginSuccess } from "@/store/auth/authSlice";
import { toast } from "sonner";
import { LoadingPage } from "@/components/LoadingPage";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    mutationKey: ["Login"],
    onSuccess: (data) => {
      toast.success(data.message);

      dispatch(loginSuccess(data.user));

      const { access_token, refresh_token, expires_at } = data.session;
      localStorage.setItem(
        "sb-bajgwnzcsvbfrhngbtnq-auth-token",
        JSON.stringify(data.session)
      );
      localStorage.setItem("token", access_token);
      localStorage.setItem("refreshtoken", refresh_token);
      localStorage.setItem("token_expires_at", expires_at);

      // Role Based Redirect
      const roleRoutes = {
        admin: "/admin",
        customer: "/customer",
        manager: "/manager",
        accountant: "/accountant",
        loan_committee: "/loancommittee",
        finance: "/finance",
      };

      navigate(roleRoutes[data.user.role] || "/");
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong ⚠️");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ email, password });
  };

  if (loading) return <LoadingPage />;

  if (user?.role) {
    const roleRoutes = {
      admin: "/admin",
      customer: "/customer",
      manager: "/manager",
      accountant: "/accountant",
      loan_committee: "/loancommittee",
      finance: "/finance",
    };
    navigate(roleRoutes[user.role]);
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-background dark:via-background dark:to-muted">
      <Card className="w-full max-w-md rounded-2xl border border-border shadow-xl backdrop-blur-sm">
        {/* BRANDING */}
        <CardHeader className="text-center space-y-3 pb-2 mt-2">
          <img
            src="/logo.png"
            alt="BAKOS Logo"
            className="w-20 h-20 mx-auto rounded-lg shadow-sm"
          />

          <CardTitle className="text-3xl font-extrabold tracking-tight text-primary">
            BAKOS Saving & Credit Service
          </CardTitle>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your Trusted Financial Partner
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 -mt-1">
            Securely manage savings, loans & operations
          </p>
        </CardHeader>

        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold text-center mb-6">
            Sign in to your account
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
                required
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 text-base font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-2">
              Forgot your password?{" "}
              <Link
                to="/reset-password"
                className="font-medium text-primary hover:underline"
              >
                Reset
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
