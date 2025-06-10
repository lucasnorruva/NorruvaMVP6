
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchProductDetails } from '../productDetailUtils';
import { MOCK_DPPS, USER_PRODUCTS_LOCAL_STORAGE_KEY } from '@/types/dpp';
import type { StoredUserProduct, DigitalProductPassport } from '@/types/dpp';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

vi.stubGlobal('localStorage', localStorageMock);


describe('fetchProductDetails', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should return a mock product if ID matches a mock DPP', async () => {
    const product = await fetchProductDetails('DPP001');
    expect(product).not.toBeNull();
    expect(product?.id).toBe('DPP001');
    expect(product?.productName).toBe(MOCK_DPPS.find(p => p.id === 'DPP001')?.productName);
    expect(product?.category).toBe(MOCK_DPPS.find(p => p.id === 'DPP001')?.category);
  });

  it('should return null if product ID does not exist in mocks or localStorage', async () => {
    const product = await fetchProductDetails('NON_EXISTENT_ID');
    expect(product).toBeNull();
  });

  it('should return a user-added product from localStorage if ID matches', async () => {
    const userProduct: StoredUserProduct = {
      id: 'USER_PROD_TEST1',
      productName: 'Test User Product',
      productCategory: 'User Category',
      status: 'Draft',
      compliance: 'N/A',
      lastUpdated: new Date().toISOString(),
      specifications: JSON.stringify({ custom: "value" }),
    };
    localStorageMock.setItem(USER_PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify([userProduct]));

    const product = await fetchProductDetails('USER_PROD_TEST1');
    expect(product).not.toBeNull();
    expect(product?.id).toBe('USER_PROD_TEST1');
    expect(product?.productName).toBe('Test User Product');
    expect(product?.category).toBe('User Category');
    expect(product?.specifications).toBe(JSON.stringify({ custom: "value" }));
  });

  it('should correctly map DigitalProductPassport fields to SimpleProductDetail for mock products', async () => {
    const mockDpp = MOCK_DPPS.find(p => p.id === 'DPP001');
    if (!mockDpp) throw new Error("Mock DPP001 not found for test");

    const product = await fetchProductDetails('DPP001');
    expect(product).not.toBeNull();
    expect(product?.manufacturer).toBe(mockDpp.manufacturer?.name);
    expect(product?.description).toBe(mockDpp.productDetails?.description);
    expect(product?.imageUrl).toBe(mockDpp.productDetails?.imageUrl);
    expect(product?.complianceSummary?.overallStatus).toBeDefined();
    expect(product?.complianceSummary?.eprel?.status).toBe(mockDpp.compliance.eprel?.status);
  });

  it('should correctly map StoredUserProduct fields to SimpleProductDetail for user products', async () => {
    const userProductData: StoredUserProduct = {
      id: 'USER_PROD_MAP_TEST',
      productName: 'User Mapping Test',
      productCategory: 'User Test Category',
      manufacturer: 'User Manufacturer',
      productDescription: 'User description.',
      imageUrl: 'http://example.com/user.png',
      specifications: JSON.stringify({ detail: 'user spec' }),
      status: 'Active',
      compliance: 'Compliant',
      lastUpdated: new Date().toISOString(),
      complianceSummary: { overallStatus: 'Compliant', eprel: { status: 'Registered', lastChecked: new Date().toISOString() } }
    };
    localStorageMock.setItem(USER_PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify([userProductData]));

    const product = await fetchProductDetails('USER_PROD_MAP_TEST');
    expect(product).not.toBeNull();
    expect(product?.id).toBe('USER_PROD_MAP_TEST');
    expect(product?.productName).toBe('User Mapping Test');
    expect(product?.category).toBe('User Test Category');
    expect(product?.manufacturer).toBe('User Manufacturer');
    expect(product?.description).toBe('User description.');
    expect(product?.imageUrl).toBe('http://example.com/user.png');
    expect(product?.specifications).toBe(JSON.stringify({ detail: 'user spec' }));
    expect(product?.status).toBe('Active'); // Check mapped status
    expect(product?.complianceSummary?.overallStatus).toBe('Compliant');
    expect(product?.complianceSummary?.eprel?.status).toBe('Registered');
  });

  it('should return customAttributes as an array for mock products', async () => {
    const product = await fetchProductDetails('DPP001'); // DPP001 has customAttributes
    expect(product?.customAttributes).toBeInstanceOf(Array);
    expect(product?.customAttributes?.length).toBeGreaterThan(0);
    expect(product?.customAttributes?.[0]).toHaveProperty('key');
    expect(product?.customAttributes?.[0]).toHaveProperty('value');
  });

  it('should return parsed customAttributes from customAttributesJsonString for user products', async () => {
    const userProduct: StoredUserProduct = {
      id: 'USER_PROD_CUSTOM_ATTR',
      productName: 'Custom Attr Product',
      status: 'Draft',
      compliance: 'N/A',
      lastUpdated: new Date().toISOString(),
      customAttributesJsonString: JSON.stringify([{ key: 'TestKey', value: 'TestValue' }, { key: 'Another', value: 'Attr' }]),
    };
    localStorageMock.setItem(USER_PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify([userProduct]));
    const product = await fetchProductDetails('USER_PROD_CUSTOM_ATTR');
    expect(product?.customAttributes).toBeInstanceOf(Array);
    expect(product?.customAttributes?.length).toBe(2);
    expect(product?.customAttributes).toEqual([{ key: 'TestKey', value: 'TestValue' }, { key: 'Another', value: 'Attr' }]);
  });

  it('should return empty array for customAttributes if customAttributesJsonString is invalid for user products', async () => {
    const userProduct: StoredUserProduct = {
      id: 'USER_PROD_INVALID_ATTR',
      productName: 'Invalid Attr Product',
      status: 'Draft',
      compliance: 'N/A',
      lastUpdated: new Date().toISOString(),
      customAttributesJsonString: 'this is not json',
    };
    localStorageMock.setItem(USER_PRODUCTS_LOCAL_STORAGE_KEY, JSON.stringify([userProduct]));
    const product = await fetchProductDetails('USER_PROD_INVALID_ATTR');
    expect(product?.customAttributes).toBeInstanceOf(Array);
    expect(product?.customAttributes?.length).toBe(0);
  });

   it('should return empty array for customAttributes if productDetails.customAttributes is missing for mock products', async () => {
    const mockDppWithoutCustomAttrs: DigitalProductPassport = {
      id: 'DPP_NO_CUSTOM_ATTR',
      productName: 'No Custom Attrs',
      category: 'Test',
      metadata: { status: 'published', last_updated: '2024-01-01' },
      compliance: {},
      // productDetails is intentionally missing customAttributes
      productDetails: { description: "Test description" }
    };
    // Temporarily add to MOCK_DPPS for this test
    MOCK_DPPS.push(mockDppWithoutCustomAttrs);
    const product = await fetchProductDetails('DPP_NO_CUSTOM_ATTR');
    expect(product?.customAttributes).toBeInstanceOf(Array);
    expect(product?.customAttributes?.length).toBe(0);
    // Clean up MOCK_DPPS
    MOCK_DPPS.pop();
  });


});
