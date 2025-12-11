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
import { updateCustomer } from "@/api/accountant";

export default function EditCustomer({ customer }) {
  const [formData, setFormData] = useState({
    account_no: customer.account_no || "",
    first_name: customer.first_name || "",
    father_name: customer.father_name || "",
    grand_father_name: customer.grand_father_name || "",
    sex: customer.sex || "",
    age: customer.age || "",
    deposit_amount: customer.deposit_amount || "",
    share_amount: customer.share_amount || "",
    phone: customer.phone || "",
  });

  const [photo, setPhoto] = useState(null);
  const [imagePreview, setImagePreview] = useState(customer.photo_url || null);

  const sexes = ["male", "female", "other"];
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => updateCustomer(data),
    onSuccess: (data) => {
      toast.success(data.message || "Customer updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getCustomers"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update customer");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhoto(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("user_id", customer.user_id);

    Object.keys(formData).forEach((key) => {
      fd.append(key, formData[key]);
    });

    if (photo) {
      fd.append("photo", photo); // backend must handle this
    }

    mutate(fd);
  };

  return (
    <div className="w-full max-h-[80vh] overflow-y-auto p-6 bg-card border border-border rounded-xl shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Upload */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Customer Photo
          </label>

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 rounded-full object-cover mx-auto border"
            />
          )}

          <Input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            disabled={isPending}
          />
        </div>

        {/* Account Number */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Account No
          </label>
          <Input
            name="account_no"
            value={formData.account_no}
            onChange={handleChange}
            disabled={isPending}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            First Name
          </label>
          <Input
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            disabled={isPending}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Father Name
          </label>
          <Input
            name="father_name"
            value={formData.father_name}
            onChange={handleChange}
            disabled={isPending}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Grand Father Name
          </label>
          <Input
            name="grand_father_name"
            value={formData.grand_father_name}
            onChange={handleChange}
            disabled={isPending}
            required
          />
        </div>

        {/* Sex */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Sex</label>
          <Select
            value={formData.sex}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, sex: value }))
            }
          >
            <SelectTrigger className="w-full py-3 bg-input border border-border rounded-md">
              <SelectValue placeholder="Select sex" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {sexes.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Age */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Age</label>
          <Input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            disabled={isPending}
            required
          />
        </div>

        {/* Deposit Amount */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Deposit Amount
          </label>
          <Input
            type="number"
            name="deposit_amount"
            value={formData.deposit_amount}
            onChange={handleChange}
            disabled={isPending}
          />
        </div>

        {/* Share Amount */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Share Amount
          </label>
          <Input
            type="number"
            name="share_amount"
            value={formData.share_amount}
            onChange={handleChange}
            disabled={isPending}
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Phone</label>
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={isPending}
          />
        </div>

        <Button className="w-full py-4 text-base">
          {isPending ? "Updating…" : "Update Customer"}
        </Button>
      </form>
    </div>
  );
}
