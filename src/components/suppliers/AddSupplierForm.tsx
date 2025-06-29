// --- File: AddSupplierForm.tsx ---
// Description: Form component for adding or editing supplier details.
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Supplier } from "@/types/dpp"; // Assuming Supplier type is defined here

const supplierFormSchema = z.object({
  id: z.string().optional(), // Optional: only present for existing suppliers
  name: z.string().min(2, "Supplier name must be at least 2 characters."),
  contactPerson: z.string().optional(),
  email: z
    .string()
    .email("Invalid email address.")
    .optional()
    .or(z.literal("")),
  location: z.string().optional(),
  materialsSupplied: z.string().min(3, "Please list materials supplied."),
  status: z.enum(["Active", "Inactive", "Pending Review"]),
  lastUpdated: z.string().optional(), // Will be set on submission
});

export type SupplierFormData = z.infer<typeof supplierFormSchema>;

interface AddSupplierFormProps {
  onSubmit: (data: SupplierFormData) => void;
  initialData?: Supplier | null;
  onClose: () => void;
  isSubmitting?: boolean;
}

export default function AddSupplierForm({
  onSubmit,
  initialData,
  onClose,
  isSubmitting,
}: AddSupplierFormProps) {
  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          email: initialData.email || "", // Ensure email is not null/undefined for the form
          contactPerson: initialData.contactPerson || "",
          location: initialData.location || "",
        }
      : {
          name: "",
          contactPerson: "",
          email: "",
          location: "",
          materialsSupplied: "",
          status: "Active",
        },
  });

  const handleSubmit = (data: SupplierFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., EcoMaterials Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="materialsSupplied"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Materials Supplied</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Organic cotton, Recycled PET chips"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contactPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="e.g., contact@ecomaterials.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., City, Country" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending Review">Pending Review</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : initialData
                ? "Save Changes"
                : "Add Supplier"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
