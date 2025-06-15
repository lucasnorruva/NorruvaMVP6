
// --- File: EuCustomsDataFormSection.tsx ---
// Description: Form section component for EU Customs Data details.
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
import type { ProductFormData } from "@/types/productFormTypes";

interface EuCustomsDataFormSectionProps {
  form: UseFormReturn<ProductFormData>;
}

export default function EuCustomsDataFormSection({
  form,
}: EuCustomsDataFormSectionProps) {
  const customsStatusOptions = ['Verified', 'Pending Documents', 'Mismatch', 'Cleared', 'N/A'];

  return (
    <div className="space-y-6 pt-4">
      <FormField
        control={form.control}
        name="compliance.euCustomsData.status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>EU Customs Data Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select customs data status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {customsStatusOptions.map(status => (
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
        name="compliance.euCustomsData.declarationId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Customs Declaration ID</FormLabel>
            <FormControl><Input placeholder="e.g., DECL-XYZ-789" {...field} value={field.value || ""} /></FormControl>
            <FormDescription>Customs declaration reference number.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="compliance.euCustomsData.hsCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>HS Code</FormLabel>
            <FormControl><Input placeholder="e.g., 84181020" {...field} value={field.value || ""} /></FormControl>
            <FormDescription>Harmonized System (HS) code for customs classification.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="compliance.euCustomsData.countryOfOrigin"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country of Origin (ISO Alpha-2)</FormLabel>
            <FormControl><Input placeholder="e.g., DE, CN, US" {...field} value={field.value || ""} /></FormControl>
            <FormDescription>ISO 3166-1 alpha-2 country code.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="compliance.euCustomsData.cbamGoodsIdentifier"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CBAM Goods Identifier / Reference (Optional)</FormLabel>
            <FormControl><Input placeholder="e.g., CBAM_REF_123 or relevant CN code" {...field} value={field.value || ""} /></FormControl>
            <FormDescription>Identifier relevant for Carbon Border Adjustment Mechanism reporting, if applicable. Often the Combined Nomenclature (CN) code.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="compliance.euCustomsData.netWeightKg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Net Weight (kg)</FormLabel>
              <FormControl><Input type="number" placeholder="e.g., 75.5" {...field} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} value={field.value ?? ""} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="compliance.euCustomsData.grossWeightKg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gross Weight (kg)</FormLabel>
              <FormControl><Input type="number" placeholder="e.g., 80.2" {...field} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} value={field.value ?? ""} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="p-4 border rounded-md space-y-3 bg-muted/30">
        <h4 className="font-medium text-md text-primary">Customs Valuation</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="compliance.euCustomsData.customsValuation.value"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl><Input type="number" placeholder="e.g., 450.00" {...field} onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} value={field.value ?? ""} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="compliance.euCustomsData.customsValuation.currency"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Currency (ISO 4217)</FormLabel>
                <FormControl><Input placeholder="e.g., EUR, USD" {...field} value={field.value || ""} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
      </div>
    </div>
  );
}