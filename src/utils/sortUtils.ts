// --- File: src/utils/sortUtils.ts ---
// Description: Utility functions for sorting Digital Product Passports.

import type { DigitalProductPassport, SortableKeys } from "@/types/dpp";

/**
 * Returns the value to use when sorting a DPP by the given key.
 * Handles nested keys and special cases.
 */
export function getSortValue(
  dpp: DigitalProductPassport,
  key: SortableKeys,
): any {
  switch (key) {
    case "metadata.status":
      return dpp.metadata.status;
    case "metadata.last_updated":
      return new Date(dpp.metadata.last_updated).getTime();
    case "ebsiVerification.status":
      return dpp.ebsiVerification?.status;
    default:
      return (dpp as any)[key];
  }
}
