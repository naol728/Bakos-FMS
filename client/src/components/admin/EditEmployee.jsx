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
import { toast } from "sonner";
import { updateEmployee } from "@/api/admin";

export default function EditEmployee({ employee }) {
  const [formData, setFormData] = useState({
    full_name: employee.full_name || "",
    email: employee.email || "",
    role: employee.role || "",
    phone: employee.phone || "",
  });

  const roles = ["manager", "accountant", "loan_committee", "finance"];
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => updateEmployee(data),
    onSuccess: (data) => {
      toast.success(data.message || "Employee updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getEmployee"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update employee");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ ...formData, userid: employee.id });
  };

  return (
    <div className="w-full p-6 bg-card border border-border rounded-xl shadow-sm">
      <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
        Edit Employee
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
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            disabled={isPending}
            className="py-3"
          />
        </div>

        {/* Role */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Role</label>

          <Select
            value={formData.role}
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
          {isPending ? "Updating…" : "Update Employee"}
        </Button>
      </form>
    </div>
  );
}
