// --- File: EuCustomsDataFormSection.tsx ---
// Description: Form section component for EU Customs Data details.
"use client";

import React, { useState } from "react"; // Added useState
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
import { Button } from "@/components/ui/button"; // Added Button
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductFormData } from "@/types/productFormTypes";
import { Sparkles, Loader2, AlertTriangle } from "lucide-react"; // Added icons
import { useToast } from "@/hooks/use-toast"; // Added useToast
import { handleSuggestCbamIdentifierAI } from "@/utils/aiFormHelpers"; // Added AI helper

interface EuCustomsDataFormSectionProps {
  form: UseFormReturn<ProductFormData>;
}

export default function EuCustomsDataFormSection({
  form,
}: EuCustomsDataFormSectionProps) {
  const customsStatusOptions = [
    "Verified",
    "Pending Documents",
    "Mismatch",
    "Cleared",
    "N/A",
  ];
  const { toast } = useToast();
  const [isSuggestingCbamId, setIsSuggestingCbamId] = useState(false);
  const [cbamSuggestionReasoning, setCbamSuggestionReasoning] = useState<
    string | null
  >(null);

  const callSuggestCbamIdentifier = async () => {
    const result = await handleSuggestCbamIdentifierAI(
      form,
      toast,
      setIsSuggestingCbamId,
    );
    if (result) {
      form.setValue(
        "compliance.euCustomsData.cbamGoodsIdentifier",
        result.suggestedIdentifier,
        { shouldValidate: true },
      );
      setCbamSuggestionReasoning(result.reasoning);
    } else {
      setCbamSuggestionReasoning(null);
    }
  };

  return (
    <div className="space-y-6 pt-4">
      <FormField
        control={form.control}
        name="compliance.euCustomsData.status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>EU Customs Data Status</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value || ""}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select customs data status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {customsStatusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
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
            <FormControl>
              <Input
                placeholder="e.g., DECL-XYZ-789"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormDescription>
              Customs declaration reference number.
            </FormDescription>
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
            <FormControl>
              <Input
                placeholder="e.g., 84181020"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormDescription>
              Harmonized System (HS) code for customs classification.
            </FormDescription>
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
            <FormControl>
              <Input
                placeholder="e.g., DE, CN, US"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
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
            <div className="flex items-center justify-between">
              <FormLabel>CBAM Goods Identifier / CN Code (Optional)</FormLabel>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={callSuggestCbamIdentifier}
                disabled={isSuggestingCbamId || form.formState.isSubmitting}
              >
                {isSuggestingCbamId ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 text-info" />
                )}
                <span className="ml-2">
                  {isSuggestingCbamId ? "Suggesting..." : "Suggest CBAM ID"}
                </span>
              </Button>
            </div>
            <FormControl>
              <Input
                placeholder="e.g., 72081000 or N/A"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormDescription>
              Identifier for Carbon Border Adjustment Mechanism reporting, often
              the Combined Nomenclature (CN) code. AI can suggest this based on
              category.
            </FormDescription>
            <FormMessage />
            {cbamSuggestionReasoning && (
              <p className="text-xs text-muted-foreground mt-1 p-2 bg-blue-500/10 border border-blue-500/20 rounded-md">
                <strong className="text-blue-600">AI Reasoning:</strong>{" "}
                {cbamSuggestionReasoning}
              </p>
            )}
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
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 75.5"
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : parseFloat(e.target.value),
                    )
                  }
                  value={field.value ?? ""}
                />
              </FormControl>
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
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 80.2"
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : parseFloat(e.target.value),
                    )
                  }
                  value={field.value ?? ""}
                />
              </FormControl>
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
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 450.00"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? null
                          : parseFloat(e.target.value),
                      )
                    }
                    value={field.value ?? ""}
                  />
                </FormControl>
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
                <FormControl>
                  <Input
                    placeholder="e.g., EUR, USD"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
