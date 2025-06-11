
import React from 'react';

import { getStatusIcon, getStatusBadgeVariant, getStatusBadgeClasses, getOverallComplianceDetails, getEbsiStatusDetails } from '../dppDisplayUtils';
import type { DigitalProductPassport, EbsiVerificationDetails } from '@/types/dpp'; // Ensure types are imported
import { ShieldCheck, ShieldAlert, ShieldQuestion, Info as InfoIcon, AlertTriangle } from 'lucide-react';

describe('dppDisplayUtils', () => {
  describe('getStatusIcon', () => {
    it('returns ShieldCheck for compliant statuses', () => {
      const icon = getStatusIcon('compliant');
      expect(icon.type).toBe(ShieldCheck);
      expect(icon.props.className).toContain('text-green-500');
    });

    it('returns AlertTriangle for non-compliant statuses', () => {
      const icon = getStatusIcon('non-compliant');
      expect(icon.type).toBe(AlertTriangle);
      expect(icon.props.className).toContain('text-red-500');
    });

    it('returns InfoIcon for pending statuses', () => {
      const icon = getStatusIcon('pending_review');
      expect(icon.type).toBe(InfoIcon);
      expect(icon.props.className).toContain('text-yellow-500');
    });

    it('returns InfoIcon for N/A or default statuses', () => {
      const icon = getStatusIcon('n/a');
      expect(icon.type).toBe(InfoIcon); // Updated to InfoIcon based on implementation
      expect(icon.props.className).toContain('text-muted-foreground');
    });
  });

  describe('getStatusBadgeVariant', () => {
    it('returns "default" for compliant statuses', () => {
      expect(getStatusBadgeVariant('compliant')).toBe('default');
      expect(getStatusBadgeVariant('verified')).toBe('default');
    });

    it('returns "destructive" for non-compliant statuses', () => {
      expect(getStatusBadgeVariant('non-compliant')).toBe('destructive');
      expect(getStatusBadgeVariant('error')).toBe('destructive');
    });

    it('returns "outline" for pending statuses', () => {
      expect(getStatusBadgeVariant('pending_review')).toBe('outline');
      expect(getStatusBadgeVariant('data mismatch')).toBe('outline');
    });

    it('returns "secondary" for N/A or default statuses', () => {
      expect(getStatusBadgeVariant('n/a')).toBe('secondary');
      expect(getStatusBadgeVariant('not applicable')).toBe('secondary');
      expect(getStatusBadgeVariant('unknown_status')).toBe('secondary');
    });
  });

  describe('getStatusBadgeClasses', () => {
    it('returns green classes for compliant statuses', () => {
      expect(getStatusBadgeClasses('compliant')).toBe('bg-green-100 text-green-700 border-green-300');
    });

    it('returns red classes for non-compliant statuses', () => {
      expect(getStatusBadgeClasses('non-compliant')).toBe('bg-red-100 text-red-700 border-red-300');
    });

    it('returns yellow classes for pending statuses', () => {
      expect(getStatusBadgeClasses('pending_review')).toBe('bg-yellow-100 text-yellow-700 border-yellow-300');
    });

    it('returns muted classes for N/A or default statuses', () => {
      expect(getStatusBadgeClasses('n/a')).toBe('bg-muted text-muted-foreground');
    });
  });

  describe('getOverallComplianceDetails', () => {
    const mockBaseDpp: Partial<DigitalProductPassport> = {
      id: "test001",
      productName: "Test Product",
      category: "Test Category",
      metadata: { status: 'published', last_updated: new Date().toISOString() },
    };

    it('returns "Fully Compliant" correctly', () => {
      const dpp = {
        ...mockBaseDpp,
        compliance: { eprel: { status: 'compliant', lastChecked: '' }, eu_espr: { status: 'compliant' } },
      } as DigitalProductPassport;
      const details = getOverallComplianceDetails(dpp);
      expect(details.text).toBe('Fully Compliant');
      expect(details.icon.type).toBe(ShieldCheck);
    });

    it('returns "Non-Compliant" if any regulation is non-compliant', () => {
      const dpp = {
        ...mockBaseDpp,
        compliance: { eprel: { status: 'compliant', lastChecked: '' }, eu_espr: { status: 'non_compliant' } },
      } as DigitalProductPassport;
      const details = getOverallComplianceDetails(dpp);
      expect(details.text).toBe('Non-Compliant');
      expect(details.icon.type).toBe(ShieldAlert);
    });

    it('returns "Pending" if any regulation is pending and none are non-compliant', () => {
      const dpp = {
        ...mockBaseDpp,
        compliance: { eprel: { status: 'compliant', lastChecked: '' }, eu_espr: { status: 'pending' } },
      } as DigitalProductPassport;
      const details = getOverallComplianceDetails(dpp);
      expect(details.text).toBe('Pending');
      expect(details.icon.type).toBe(InfoIcon);
    });
    
    it('returns "N/A" if no regulations are tracked in compliance object', () => {
      const dpp = {
        ...mockBaseDpp,
        compliance: {}, // Empty compliance object
      } as DigitalProductPassport;
      const details = getOverallComplianceDetails(dpp);
      expect(details.text).toBe('N/A');
      expect(details.icon.type).toBe(ShieldQuestion);
    });

    it('returns "No Data" if compliance object has keys but no valid status fields', () => {
      const dpp = {
        ...mockBaseDpp,
        compliance: { eprel: undefined, randomKey: {} as any }, // Keys exist, but no actual statuses
      } as DigitalProductPassport;
      const details = getOverallComplianceDetails(dpp);
      expect(details.text).toBe('No Data');
      expect(details.icon.type).toBe(ShieldQuestion);
    });
  });

  describe('getEbsiStatusDetails', () => {
    it('returns "Verified" details correctly', () => {
      const details = getEbsiStatusDetails('verified');
      expect(details.text).toBe('Verified');
      expect(details.icon.type).toBe(ShieldCheck);
    });

    it('returns "Pending" details correctly', () => {
      const details = getEbsiStatusDetails('pending_verification');
      expect(details.text).toBe('Pending');
      expect(details.icon.type).toBe(InfoIcon);
    });

    it('returns "Not Verified" details correctly', () => {
      const details = getEbsiStatusDetails('not_verified');
      expect(details.text).toBe('Not Verified');
      expect(details.icon.type).toBe(AlertCircle);
    });
    
    it('returns "Error" details correctly', () => {
      const details = getEbsiStatusDetails('error');
      expect(details.text).toBe('Error');
      expect(details.icon.type).toBe(AlertTriangle);
    });

    it('returns "N/A" for undefined status', () => {
      const details = getEbsiStatusDetails(undefined);
      expect(details.text).toBe('N/A');
      expect(details.icon.type).toBe(ShieldQuestion);
    });
  });
});

    