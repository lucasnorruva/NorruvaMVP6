export const mockTransitProducts = [
  {
    id: 'tp-001',
    productName: 'Laptop Model X',
    currentLocation: 'Warehouse A, Port of Rotterdam',
    estimatedArrival: '2023-10-27',
  },
  {
    id: 'tp-002',
    productName: 'Smartphone Y',
    currentLocation: 'In Transit (Ocean Vessel)',
    estimatedArrival: '2023-11-10',
  },
  {
    id: 'tp-003',
    productName: 'Tablet Z',
    currentLocation: 'Customs Clearance, Frankfurt Airport',
    estimatedArrival: '2023-10-30',
  },
];

export type TransitProduct = typeof mockTransitProducts[0];