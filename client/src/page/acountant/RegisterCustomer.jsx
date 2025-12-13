"use client";

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
import { createCustomer } from "@/api/accountant";

export default function RegisterCustomer() {
  const [formData, setFormData] = useState({
    account_no: "",
    first_name: "",
    father_name: "",
    grand_father_name: "",
    sex: "",
    age: "",
    deposit_amount: "",
    phone: "",
    email: "",
    password: "",
    photo: null,
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createCustomer,
    mutationKey: ["registerCustomer"],
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["getCustomers"] });
    },
    onError: (err) => {
      toast.error(err.message || "Registration failed");
    },
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    mutate(data);
  };

  return (
    <div className="w-full p-6 bg-card border border-border rounded-xl shadow-sm">
      <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
        Register Customer
      </h2>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* PERSONAL INFO */}
        <Section title="Personal Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Account Number"
              name="account_no"
              value={formData.account_no}
              onChange={handleChange}
              disabled={isPending}
            />

            <InputField
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              disabled={isPending}
            />

            <InputField
              label="Father Name"
              name="father_name"
              value={formData.father_name}
              onChange={handleChange}
              disabled={isPending}
            />

            <InputField
              label="Grand Father Name"
              name="grand_father_name"
              value={formData.grand_father_name}
              onChange={handleChange}
              disabled={isPending}
            />

            {/* Sex */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Sex</label>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, sex: value }))
                }
              >
                <SelectTrigger className="w-full py-3">
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <InputField
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              disabled={isPending}
            />
          </div>
        </Section>

        {/* FINANCE INFO */}
        <Section title="Financial Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Deposit Amount"
              name="deposit_amount"
              type="number"
              value={formData.deposit_amount}
              onChange={handleChange}
              disabled={isPending}
            />
          </div>
        </Section>

        {/* CONTACT & LOGIN INFO */}
        <Section title="Contact & Login Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={isPending}
            />

            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isPending}
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isPending}
            />

            {/* Photo */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Photo
              </label>
              <Input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                disabled={isPending}
                className="py-3"
              />
            </div>
          </div>
        </Section>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full py-4 text-base font-medium"
        >
          {isPending ? "Registering…" : "Register Customer"}
        </Button>
      </form>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      {children}
    </div>
  );
}

function InputField({ label, name, value, onChange, type = "text", disabled }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <Input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="py-3"
        required
      />
    </div>
  );
}
