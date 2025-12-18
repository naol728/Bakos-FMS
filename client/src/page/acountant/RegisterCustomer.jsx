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
    confirm_password: "",
    photo: null,
  });

  const [errors, setErrors] = useState({});

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createCustomer,
    mutationKey: ["registerCustomer"],
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["getCustomers"] });
      setErrors({});
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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // ✅ FORM VALIDATION FUNCTIONS
  const validateField = (name, value) => {
    switch (name) {
      case "account_no":
        if (!value.trim()) return "Account number is required";
        if (!/^\d+$/.test(value))
          return "Account number must contain only numbers";
        if (value.length < 5) return "Account number must be at least 5 digits";
        return "";

      case "first_name":
        if (!value.trim()) return "First name is required";
        if (!/^[A-Za-z\s]+$/.test(value))
          return "First name must contain only letters";
        if (value.length < 2) return "First name must be at least 2 characters";
        return "";

      case "father_name":
        if (!value.trim()) return "Father's name is required";
        if (!/^[A-Za-z\s]+$/.test(value))
          return "Father's name must contain only letters";
        if (value.length < 2)
          return "Father's name must be at least 2 characters";
        return "";

      case "grand_father_name":
        if (!value.trim()) return "Grandfather's name is required";
        if (!/^[A-Za-z\s]+$/.test(value))
          return "Grandfather's name must contain only letters";
        if (value.length < 2)
          return "Grandfather's name must be at least 2 characters";
        return "";

      case "sex":
        if (!value) return "Sex is required";
        return "";

      case "age":
        if (!value) return "Age is required";
        const ageNum = parseInt(value);
        if (isNaN(ageNum)) return "Age must be a number";
        if (ageNum < 18) return "Age must be at least 18";
        if (ageNum > 120) return "Age must be less than 120";
        return "";

      case "deposit_amount":
        if (!value) return "Deposit amount is required";
        const amount = parseFloat(value);
        if (isNaN(amount)) return "Deposit amount must be a number";
        if (amount < 100) return "Minimum deposit amount is 100";
        return "";

      case "phone":
        if (!value.trim()) return "Phone number is required";
        if (!/^\d+$/.test(value))
          return "Phone number must contain only numbers";
        if (value.length < 10) return "Phone number must be at least 10 digits";
        if (value.length > 15) return "Phone number is too long";
        return "";

      case "email":
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value))
          return "Please enter a valid email address";
        return "";

      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/(?=.*[a-z])/.test(value))
          return "Password must contain at least one lowercase letter";
        if (!/(?=.*[A-Z])/.test(value))
          return "Password must contain at least one uppercase letter";
        if (!/(?=.*\d)/.test(value))
          return "Password must contain at least one number";
        if (!/(?=.*[@$!%*?&])/.test(value))
          return "Password must contain at least one special character (@$!%*?&)";
        return "";

      case "confirm_password":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
        return "";

      case "photo":
        if (value && value instanceof File) {
          const validTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/gif",
          ];
          if (!validTypes.includes(value.type)) {
            return "Please upload a valid image (JPEG, PNG, JPG, GIF)";
          }
          if (value.size > 5 * 1024 * 1024) {
            // 5MB limit
            return "Image size must be less than 5MB";
          }
        }
        return "";

      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate all fields
    Object.keys(formData).forEach((key) => {
      if (key === "confirm_password") return; // We'll validate this separately with password

      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    // Validate password confirmation
    const confirmPasswordError = validateField(
      "confirm_password",
      formData.confirm_password
    );
    if (confirmPasswordError) {
      newErrors.confirm_password = confirmPasswordError;
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      toast.error("Please fix the errors in the form");
      // Scroll to first error
      const firstErrorField = Object.keys(newErrors)[0];
      if (firstErrorField) {
        document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }

    return isValid;
  };

  // Real-time validation on blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);

    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const data = new FormData();

    for (const key in formData) {
      if (key !== "confirm_password") {
        data.append(key, formData[key]);
      }
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
              onBlur={handleBlur}
              error={errors.account_no}
              disabled={isPending}
            />
            <InputField
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.first_name}
              disabled={isPending}
            />
            <InputField
              label="Father Name"
              name="father_name"
              value={formData.father_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.father_name}
              disabled={isPending}
            />
            <InputField
              label="Grand Father Name"
              name="grand_father_name"
              value={formData.grand_father_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.grand_father_name}
              disabled={isPending}
            />

            {/* Sex */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Sex</label>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, sex: value }))
                }
                onBlur={() => {
                  const error = validateField("sex", formData.sex);
                  if (error) {
                    setErrors((prev) => ({ ...prev, sex: error }));
                  }
                }}
              >
                <SelectTrigger
                  className={`w-full py-3 ${
                    errors.sex ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              {errors.sex && (
                <p className="text-sm text-red-500">{errors.sex}</p>
              )}
            </div>

            <InputField
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.age}
              disabled={isPending}
            />
          </div>
        </Section>

        {/* FINANCE INFO */}
        <Section title="Financial Information">
          <InputField
            label="Deposit Amount"
            name="deposit_amount"
            type="number"
            value={formData.deposit_amount}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.deposit_amount}
            disabled={isPending}
          />
        </Section>

        {/* CONTACT & LOGIN INFO */}
        <Section title="Contact & Login Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.phone}
              disabled={isPending}
            />
            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              disabled={isPending}
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              disabled={isPending}
            />

            {/* ✅ CONFIRM PASSWORD */}
            <InputField
              label="Confirm Password"
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.confirm_password}
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
                onBlur={handleBlur}
                disabled={isPending}
                className={`py-3 ${errors.photo ? "border-red-500" : ""}`}
              />
              {errors.photo && (
                <p className="text-sm text-red-500">{errors.photo}</p>
              )}
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

function InputField({
  label,
  name,
  value,
  onChange,
  onBlur,
  type = "text",
  error,
  disabled,
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <Input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`py-3 ${
          error ? "border-red-500 focus-visible:ring-red-500" : ""
        }`}
        required
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
