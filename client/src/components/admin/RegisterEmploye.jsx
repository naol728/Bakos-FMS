/*eslint-disable */
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEmployee } from "@/api/admin";
import { toast } from "sonner";

export default function RegisterEmployee() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "", // ✅ NEW
    full_name: "",
    role: "",
    phone: "",
  });

  const queryclient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createEmployee,
    mutationKey: ["createEmployee"],
    onSuccess: (data) => {
      toast.success(data.message);
      queryclient.invalidateQueries({ queryKey: ["getEmployee"] });
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const roles = ["manager", "accountant", "loan_committee", "finance"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ VALIDATION
  const validateForm = () => {
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }

    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match");
      return false;
    }

    if (!formData.role) {
      toast.error("Please select a role");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const { confirm_password, ...payload } = formData; // ❌ remove confirm_password
    mutate(payload);
  };

  return (
    <div className="w-full p-6 bg-card border border-border rounded-xl shadow-sm">
      <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
        Register Employee
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Full Name
          </label>
          <Input
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Enter full name"
            disabled={isPending}
            className="py-3"
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Email</label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            disabled={isPending}
            className="py-3"
            required
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Phone</label>
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone"
            disabled={isPending}
            className="py-3"
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Password
          </label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            disabled={isPending}
            className="py-3"
            required
          />
        </div>

        {/* ✅ CONFIRM PASSWORD */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Confirm Password
          </label>
          <Input
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            placeholder="Confirm password"
            disabled={isPending}
            className="py-3"
            required
          />
        </div>

        {/* Role */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Role</label>

          <Select
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, role: value }))
            }
            disabled={isPending}
          >
            <SelectTrigger className="w-full py-3 bg-input text-foreground border border-border rounded-md">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {roles.map((role) => (
                <SelectItem key={role} value={role} className="capitalize">
                  {role.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full py-4 text-base font-medium"
        >
          {isPending ? "Registering…" : "Register Employee"}
        </Button>
      </form>
    </div>
  );
}
