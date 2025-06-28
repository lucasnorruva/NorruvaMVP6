// src/types/products/forms.ts
/**
 * Form-specific types with validation
 */
import { DataOrigin, CustomAttribute, CarbonFootprintData, DigitalTwinData, EthicalSourcingData, EsprSpecifics } from './base';

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface FormState<T> {
  data: T;
  errors: ValidationError[];
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
  touchedFields: Set<keyof T>;
}

export interface ProductFormData {
  // Basic info
  productName: string;
  manufacturer: string;
  category: string;
  modelNumber?: string;
  
  // Identifiers
  gtin?: string;
  sku?: string;
  nfcTagId?: string;
  rfidTagId?: string;
  
  // Product details
  description: string;
  materials: string; // Simplified for form input
  sustainabilityClaims: string; // Simplified for form input
  keyCompliancePoints: string; // Simplified for form input
  specifications: string; // JSON string
  energyLabel?: string;
  imageUrl?: string;
  imageHint?: string;
  
  // Custom attributes
  customAttributes: CustomAttribute[];
  
  // Carbon footprint
  carbonFootprint?: Partial<CarbonFootprintData>;
  
  // Digital twin
  digitalTwin?: Partial<DigitalTwinData>;
  
  // Ethical sourcing
  ethicalSourcing?: Partial<EthicalSourcingData>;
  
  // ESPR
  esprSpecifics?: Partial<EsprSpecifics>;
  
  // Battery regulation (if applicable)
  batteryRegulation?: {
    status: string;
    batteryChemistry?: string;
    batteryPassportId?: string;
    // ... other battery fields
  };
  
  // Compliance data
  compliance?: {
    eprel?: { status: string; id?: string; url?: string };
    esprConformity?: { status: string };
    scipNotification?: {
      status: string;
      notificationId?: string;
      // ... other SCIP fields
    };
    euCustomsData?: {
      status: string;
      declarationId?: string;
      // ... other customs fields
    };
  };
  
  // Textile information
  textileInformation?: {
    fiberComposition: Array<{
      fiberName: string;
      percentage: number | null;
    }>;
    isSecondHand: boolean;
    countryOfOriginLabeling?: string;
    careInstructionsUrl?: string;
  };
  
  // Construction product information
  constructionProductInformation?: {
    essentialCharacteristics: Array<{
      characteristicName: string;
      value: string;
      unit?: string;
      testMethod?: string;
    }>;
    declarationOfPerformanceId?: string;
    ceMarkingDetailsUrl?: string;
    intendedUseDescription?: string;
  };
  
  // Origin tracking
  originTracking?: Record<string, DataOrigin>;
}
