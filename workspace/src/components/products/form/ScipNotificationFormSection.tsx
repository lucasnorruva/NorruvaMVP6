
// --- File: ScipNotificationFormSection.tsx ---
// Description: Form section component for ECHA SCIP Notification details.
"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ProductFormData } from "@/components/products/ProductForm";
// AiIndicator and AI helper imports are not needed for this initial version as SCIP data is highly specific.

interface ScipNotificationFormSectionProps {
  form: UseFormReturn<ProductFormData>;
  // initialData?: Partial<InitialProductFormData>; // Not used in this simple version yet
  // isSubmittingForm?: boolean; // Not used in this simple version yet
}

export default function ScipNotificationFormSection({
  form,
}: ScipNotificationFormSectionProps) {
  const scipStatusOptions = ['Notified', 'Pending Notification', 'Not Required', 'Error', 'N/A'];

  return (
    <div className="space-y-6 pt-4">
      <FormField
        control={form.control}
        name="compliance.scipNotification.status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SCIP Notification Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select SCIP status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {scipStatusOptions.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="compliance.scipNotification.notificationId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SCIP Notification ID</FormLabel>
            <FormControl><Input placeholder="e.g., SCIP-REF-12345" {...field} value={field.value || ""} /></FormControl>
            <FormDescription>The ECHA SCIP database notification number, if applicable.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="compliance.scipNotification.svhcListVersion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SVHC List Version</FormLabel>
            <FormControl><Input placeholder="e.g., 2024/01 (24.0.1)" {...field} value={field.value || ""} /></FormControl>
            <FormDescription>Version of the ECHA Candidate List used for assessment.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="compliance.scipNotification.submittingLegalEntity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Submitting Legal Entity</FormLabel>
            <FormControl><Input placeholder="e.g., Your Company Name" {...field} value={field.value || ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="compliance.scipNotification.articleName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Article Name (as notified)</FormLabel>
            <FormControl><Input placeholder="e.g., Product Enclosure Unit" {...field} value={field.value || ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="compliance.scipNotification.primaryArticleId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Primary Article ID</FormLabel>
            <FormControl><Input placeholder="e.g., EAN, Part Number" {...field} value={field.value || ""} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="compliance.scipNotification.safeUseInstructionsLink"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Safe Use Instructions URL</FormLabel>
            <FormControl><Input type="url" placeholder="https://example.com/safe-use.pdf" {...field} value={field.value || ""} /></FormControl>
            <FormDescription>Link to safe use instructions, if SVHCs are present.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
