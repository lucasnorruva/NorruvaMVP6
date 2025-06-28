// src/hooks/products/useProductForm.ts
/**
 * Advanced form handling hook with validation and state management
 */
"use client";

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useCallback, useEffect } from 'react';
import { useDebounce } from '@/hooks/shared/useDebounce';
import { productFormSchema } from '@/utils/products/validation';
import type { ProductFormData, ValidationError } from '@/types/products';

interface UseProductFormOptions {
  initialData?: Partial<ProductFormData>;
  validationSchema?: any;
  autoSave?: boolean;
  autoSaveDelay?: number;
  onSubmit?: (data: ProductFormData) => Promise<void>;
  onError?: (errors: ValidationError[]) => void;
}

export function useProductForm({
  initialData,
  validationSchema = productFormSchema,
  autoSave = false,
  autoSaveDelay = 2000,
  onSubmit,
  onError,
}: UseProductFormOptions = {}) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: initialData,
    mode: 'onChange',
  });
  
  const { handleSubmit, reset, getValues } = form;
  const { errors, isDirty, isValid, isSubmitting, touchedFields } = form.formState;
  
  // Watch form data for auto-save
  const watchedData = useWatch({ control: form.control });
  const debouncedData = useDebounce(watchedData, autoSaveDelay);
  
  // Auto-save functionality
  useEffect(() => {
    if (autoSave && isDirty && isValid && !isSubmitting) {
      // Implement auto-save logic here
      console.log('Auto-saving form data:', debouncedData);
    }
  }, [debouncedData, autoSave, isDirty, isValid, isSubmitting]);
  
  // Convert form errors to validation errors
  const validationErrors = useMemo((): ValidationError[] => {
    return Object.entries(errors).map(([field, error]) => ({
      field,
      message: error?.message || 'Invalid value',
      code: error?.type || 'validation_error',
    }));
  }, [errors]);
  
  // Notify on errors
  useEffect(() => {
    if (validationErrors.length > 0) {
      onError?.(validationErrors);
    }
  }, [validationErrors, onError]);
  
  // Enhanced submit handler
  const submitHandler = useCallback(
    async (data: ProductFormData) => {
      try {
        await onSubmit?.(data);
      } catch (error) {
        console.error('Form submission error:', error);
        throw error;
      }
    },
    [onSubmit]
  );
  
  // Form state summary
  const formState = useMemo(() => ({
    data: getValues(),
    errors: validationErrors,
    isSubmitting,
    isDirty,
    isValid,
    touchedFields: new Set(Object.keys(touchedFields)),
  }), [getValues, validationErrors, isSubmitting, isDirty, isValid, touchedFields]);
  
  // Reset form with new data
  const resetForm = useCallback((newData?: Partial<ProductFormData>) => {
    reset(newData || initialData);
  }, [reset, initialData]);
  
  // Validate specific field
  const validateField = useCallback(<K extends keyof ProductFormData>(fieldName: K) => {
    return form.trigger(fieldName);
  }, [form]);
  
  // Set field value with validation
  const setFieldValue = useCallback(
    <K extends keyof ProductFormData>(
      fieldName: K,
      value: ProductFormData[K],
      options?: { shouldValidate?: boolean; shouldDirty?: boolean }
    ) => {
      form.setValue(fieldName, value, {
        shouldValidate: options?.shouldValidate ?? true,
        shouldDirty: options?.shouldDirty ?? true,
      });
    },
    [form]
  );
  
  return {
    form,
    formState,
    validationErrors,
    submitHandler: handleSubmit(submitHandler),
    resetForm,
    validateField,
    setFieldValue,
    // Expose form methods
    watch: form.watch,
    getValues: form.getValues,
    setValue: form.setValue,
    trigger: form.trigger,
    clearErrors: form.clearErrors,
  };
}
