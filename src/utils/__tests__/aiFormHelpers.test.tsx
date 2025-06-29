
// --- File: src/utils/__tests__/aiFormHelpers.test.tsx ---

import type { UseFormReturn } from 'react-hook-form';
import type { ProductFormData } from '@/components/products/ProductForm';
import type { ToastInput } from '@/hooks/use-toast';

// Functions to test
import {
  handleSuggestNameAI,
  handleGenerateImageAI,
  // We can add more imports here as we test other functions
} from '../aiFormHelpers';

// Mock AI Flow functions
jest.mock('@/ai/flows/generate-product-name-flow', () => ({
  generateProductName: jest.fn(),
}));
jest.mock('@/ai/flows/generate-product-image-flow', () => ({
  generateProductImage: jest.fn(),
}));
// Add mocks for other AI flows as needed for other helper functions

// Helper to create a mock form object
const createMockForm = (): Partial<UseFormReturn<ProductFormData>> => ({
  getValues: jest.fn(),
  setValue: jest.fn(),
});

// Mock toast function
const mockToast = jest.fn();
const mockSetLoadingState = jest.fn();

describe('aiFormHelpers', () => {
  let mockForm: Partial<UseFormReturn<ProductFormData>>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockForm = createMockForm();
    // Default mock implementations
    (mockForm.getValues as jest.Mock).mockReturnValue({
      productDescription: 'A great test product',
      productCategory: 'Testing',
      productName: 'Test Product Name', // For image generation
      imageHint: 'test hint',
    });
  });

  describe('handleSuggestNameAI', () => {
    it('should call generateProductName and update form on success', async () => {
      const suggestedName = 'AI Suggested Name';
      (generateProductName as jest.Mock).mockResolvedValue({ productName: suggestedName });

      const result = await handleSuggestNameAI(
        mockForm as UseFormReturn<ProductFormData>,
        mockToast as (input: ToastInput) => void,
        mockSetLoadingState
      );

      expect(mockSetLoadingState).toHaveBeenCalledWith(true);
      expect(generateProductName).toHaveBeenCalledWith({
        productDescription: 'A great test product',
        productCategory: 'Testing',
      });
      expect(mockForm.setValue).toHaveBeenCalledWith('productName', suggestedName, { shouldValidate: true });
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Product Name Suggested!',
        description: `AI suggested: "${suggestedName}"`,
      }));
      expect(result).toBe(suggestedName);
      expect(mockSetLoadingState).toHaveBeenCalledWith(false);
    });

    it('should show error toast if input is insufficient', async () => {
      (mockForm.getValues as jest.Mock).mockReturnValue({}); // No description or category

      const result = await handleSuggestNameAI(
        mockForm as UseFormReturn<ProductFormData>,
        mockToast as (input: ToastInput) => void,
        mockSetLoadingState
      );

      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Input Required',
        description: 'Please provide a product description or category to suggest a name.',
        variant: 'destructive'
      }));
      expect(generateProductName).not.toHaveBeenCalled();
      expect(result).toBeNull();
      expect(mockSetLoadingState).toHaveBeenCalledWith(false);
    });

    it('should show error toast if AI flow fails', async () => {
      const errorMessage = 'AI service unavailable';
      const { generateProductName } = await import('@/ai/flows/generate-product-name-flow'); // Import here
      (generateProductName as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const result = await handleSuggestNameAI(
        mockForm as UseFormReturn<ProductFormData>,
        mockToast as (input: ToastInput) => void,
        mockSetLoadingState
      );
      
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Error Suggesting Name',
        description: errorMessage,
        variant: 'destructive'
      }));
      expect(result).toBeNull();
      expect(mockSetLoadingState).toHaveBeenCalledWith(false);
    });
  });

  describe('handleGenerateImageAI', () => {
    it('should call generateProductImage and return image URL on success', async () => {
      const imageUrl = 'data:image/png;base64,mockimage';
      (generateProductImage as jest.Mock).mockResolvedValue({ imageUrl });

      const result = await handleGenerateImageAI(
        mockForm as UseFormReturn<ProductFormData>,
        mockToast as (input: ToastInput) => void,
        mockSetLoadingState
      );

      expect(mockSetLoadingState).toHaveBeenCalledWith(true);
      expect(generateProductImage).toHaveBeenCalledWith({
        productName: 'Test Product Name',
        productCategory: 'Testing',
        imageHint: 'test hint'
      });
      // The helper function itself doesn't call form.setValue for image, the calling component does.
      // So we just check the toast and returned value.
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Image Generated Successfully',
      }));
      expect(result).toBe(imageUrl);
      expect(mockSetLoadingState).toHaveBeenCalledWith(false);
    });

    it('should show error toast if product name is missing', async () => {
      (mockForm.getValues as jest.Mock).mockReturnValue({ productCategory: 'Testing' }); // No productName
      const { generateProductImage } = await import('@/ai/flows/generate-product-image-flow'); // Import here

      const result = await handleGenerateImageAI(
        mockForm as UseFormReturn<ProductFormData>,
        mockToast as (input: ToastInput) => void,
        mockSetLoadingState
      );

      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Product Name Required',
        description: 'Please enter a product name before generating an image.',
        variant: 'destructive'
      }));
      expect(generateProductImage).not.toHaveBeenCalled();
      expect(result).toBeNull();
      expect(mockSetLoadingState).toHaveBeenCalledWith(false);
    });

    it('should show error toast if AI image generation fails', async () => {
      const errorMessage = 'Image generation service error';
      const { generateProductImage } = await import('@/ai/flows/generate-product-image-flow'); // Import here
      (generateProductImage as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const result = await handleGenerateImageAI(
        mockForm as UseFormReturn<ProductFormData>,
        mockToast as (input: ToastInput) => void,
        mockSetLoadingState
      );

      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Error Generating Image',
        description: errorMessage,
        variant: 'destructive'
      }));
      expect(result).toBeNull();
      expect(mockSetLoadingState).toHaveBeenCalledWith(false);
    });
  });

  // Placeholder for other helper function tests
  // describe('handleSuggestDescriptionAI', () => { /* ... */ });
  // describe('handleSuggestClaimsAI', () => { /* ... */ });
  // describe('handleSuggestSpecificationsAI', () => { /* ... */ });
  // describe('handleSuggestCustomAttributesAI', () => { /* ... */ });
});
