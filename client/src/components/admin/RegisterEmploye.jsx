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
    confirm_password: "",
    full_name: "",
    role: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const queryclient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createEmployee,
    mutationKey: ["createEmployee"],
    onSuccess: (data) => {
      toast.success(data.message);
      queryclient.invalidateQueries({ queryKey: ["getEmployee"] });
      // Reset form
      setFormData({
        email: "",
        password: "",
        confirm_password: "",
        full_name: "",
        role: "",
        phone: "",
      });
      setErrors({});
      setTouched({});
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const roles = ["manager", "accountant", "loan_committee", "finance"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  // ✅ FIELD VALIDATION FUNCTIONS
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "full_name":
        if (!value.trim()) {
          error = "Full name is required";
        } else if (value.trim().length < 2) {
          error = "Full name must be at least 2 characters";
        } else if (!/^[A-Za-z\s.'-]+$/.test(value.trim())) {
          error =
            "Full name can only contain letters, spaces, and basic punctuation";
        } else if (value.trim().length > 100) {
          error = "Full name is too long";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        } else if (value.length > 100) {
          error = "Email is too long";
        }
        break;

      case "phone":
        if (!value.trim()) {
          error = "Phone number is required";
        } else if (!/^[\d\s()+-]+$/.test(value)) {
          error = "Phone number can only contain numbers, spaces, and + - ( )";
        } else if (value.replace(/\D/g, "").length < 10) {
          error = "Phone number must have at least 10 digits";
        } else if (value.replace(/\D/g, "").length > 15) {
          error = "Phone number is too long";
        }
        break;

      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters";
        } else if (value.length > 50) {
          error = "Password is too long (max 50 characters)";
        } else if (!/(?=.*[a-z])/.test(value)) {
          error = "Password must contain at least one lowercase letter";
        } else if (!/(?=.*[A-Z])/.test(value)) {
          error = "Password must contain at least one uppercase letter";
        } else if (!/(?=.*\d)/.test(value)) {
          error = "Password must contain at least one number";
        } else if (!/(?=.*[@$!%*?&])/.test(value)) {
          error =
            "Password must contain at least one special character (@$!%*?&)";
        }
        break;

      case "confirm_password":
        if (!value) {
          error = "Please confirm your password";
        } else if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;

      case "role":
        if (!value) {
          error = "Please select a role";
        } else if (!roles.includes(value)) {
          error = "Please select a valid role";
        }
        break;

      default:
        break;
    }

    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    return !error;
  };

  // ✅ FORM VALIDATION
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate all fields
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (!error) {
        // Check if there's already an error for this field
        if (errors[key]) {
          newErrors[key] = errors[key];
          isValid = false;
        }
      } else {
        // Get the error message
        let errorMessage = "";
        switch (key) {
          case "full_name":
            if (!formData.full_name.trim())
              errorMessage = "Full name is required";
            else if (formData.full_name.trim().length < 2)
              errorMessage = "Full name must be at least 2 characters";
            else if (!/^[A-Za-z\s.'-]+$/.test(formData.full_name.trim()))
              errorMessage =
                "Full name can only contain letters, spaces, and basic punctuation";
            break;
          case "email":
            if (!formData.email.trim()) errorMessage = "Email is required";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
              errorMessage = "Please enter a valid email address";
            break;
          case "phone":
            if (!formData.phone.trim())
              errorMessage = "Phone number is required";
            else if (formData.phone.replace(/\D/g, "").length < 10)
              errorMessage = "Phone number must have at least 10 digits";
            break;
          case "password":
            if (!formData.password) errorMessage = "Password is required";
            else if (formData.password.length < 8)
              errorMessage = "Password must be at least 8 characters";
            else if (!/(?=.*[a-z])/.test(formData.password))
              errorMessage =
                "Password must contain at least one lowercase letter";
            else if (!/(?=.*[A-Z])/.test(formData.password))
              errorMessage =
                "Password must contain at least one uppercase letter";
            else if (!/(?=.*\d)/.test(formData.password))
              errorMessage = "Password must contain at least one number";
            else if (!/(?=.*[@$!%*?&])/.test(formData.password))
              errorMessage =
                "Password must contain at least one special character (@$!%*?&)";
            break;
          case "confirm_password":
            if (!formData.confirm_password)
              errorMessage = "Please confirm your password";
            else if (formData.confirm_password !== formData.password)
              errorMessage = "Passwords do not match";
            break;
          case "role":
            if (!formData.role) errorMessage = "Please select a role";
            break;
        }
        if (errorMessage) {
          newErrors[key] = errorMessage;
          isValid = false;
        }
      }
    });

    // Set all fields as touched
    const allFields = [
      "full_name",
      "email",
      "phone",
      "password",
      "confirm_password",
      "role",
    ];
    const newTouched = {};
    allFields.forEach((field) => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    setErrors(newErrors);

    if (!isValid) {
      toast.error("Please fix the errors in the form");
      // Scroll to first error
      const firstErrorField = Object.keys(newErrors)[0];
      if (firstErrorField) {
        setTimeout(() => {
          const element =
            document.querySelector(`[name="${firstErrorField}"]`) ||
            document.querySelector(`[data-name="${firstErrorField}"]`);
          element?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      }
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const { confirm_password, ...payload } = formData; // ❌ remove confirm_password
    mutate(payload);
  };

  // Check if form is valid for enabling submit button
  const isFormValid = () => {
    const requiredFields = ["full_name", "email", "phone", "password", "role"];
    const allRequiredFilled = requiredFields.every(
      (field) => formData[field] && formData[field].toString().trim() !== ""
    );

    const passwordsMatch = formData.password === formData.confirm_password;
    const noErrors = Object.keys(errors).length === 0;

    return allRequiredFilled && passwordsMatch && noErrors;
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
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter full name"
            disabled={isPending}
            className={`py-3 ${
              errors.full_name && touched.full_name
                ? "border-red-500 focus-visible:ring-red-500"
                : ""
            }`}
            required
          />
          {errors.full_name && touched.full_name && (
            <p className="text-sm text-red-500">{errors.full_name}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Email <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter email"
            disabled={isPending}
            className={`py-3 ${
              errors.email && touched.email
                ? "border-red-500 focus-visible:ring-red-500"
                : ""
            }`}
            required
          />
          {errors.email && touched.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Phone <span className="text-red-500">*</span>
          </label>
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter phone number"
            disabled={isPending}
            className={`py-3 ${
              errors.phone && touched.phone
                ? "border-red-500 focus-visible:ring-red-500"
                : ""
            }`}
            required
          />
          {errors.phone && touched.phone && (
            <p className="text-sm text-red-500">{errors.phone}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Password <span className="text-red-500">*</span>
          </label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter password (min 8 characters)"
            disabled={isPending}
            className={`py-3 ${
              errors.password && touched.password
                ? "border-red-500 focus-visible:ring-red-500"
                : ""
            }`}
            required
          />
          {errors.password && touched.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
          {!errors.password && formData.password && (
            <div className="text-xs text-muted-foreground">
              Password must contain: uppercase, lowercase, number, and special
              character (@$!%*?&)
            </div>
          )}
        </div>

        {/* ✅ CONFIRM PASSWORD */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <Input
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Confirm password"
            disabled={isPending}
            className={`py-3 ${
              errors.confirm_password && touched.confirm_password
                ? "border-red-500 focus-visible:ring-red-500"
                : ""
            }`}
            required
          />
          {errors.confirm_password && touched.confirm_password && (
            <p className="text-sm text-red-500">{errors.confirm_password}</p>
          )}
          {!errors.confirm_password &&
            formData.confirm_password &&
            formData.password === formData.confirm_password && (
              <p className="text-sm text-green-500">✓ Passwords match</p>
            )}
        </div>

        {/* Role */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Role <span className="text-red-500">*</span>
          </label>
          <Select
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, role: value }))
            }
            onBlur={() => {
              validateField("role", formData.role);
              setTouched((prev) => ({ ...prev, role: true }));
            }}
            disabled={isPending}
            data-name="role"
          >
            <SelectTrigger
              className={`w-full py-3 bg-input text-foreground border border-border rounded-md ${
                errors.role && touched.role
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
            >
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
          {errors.role && touched.role && (
            <p className="text-sm text-red-500">{errors.role}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isPending || !isFormValid()}
          className="w-full py-4 text-base font-medium"
        >
          {isPending ? "Registering…" : "Register Employee"}
        </Button>

        <div className="text-xs text-muted-foreground text-center">
          <p>
            Fields marked with <span className="text-red-500">*</span> are
            required
          </p>
          <p className="mt-1">
            All form data will be validated before submission
          </p>
        </div>
      </form>
    </div>
  );
}
