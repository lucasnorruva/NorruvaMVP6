
// --- File: src/components/developer/docs/api-reference/index.ts ---
// This file serves as a barrel for exporting API reference components.

export { default as ListDigitalProductPassports } from './ListDigitalProductPassports';
export { default as RetrieveDigitalProductPassport } from './RetrieveDigitalProductPassport';
export { default as CreateDigitalProductPassport } from './CreateDigitalProductPassport';
export { default as UpdateDigitalProductPassport } from './UpdateDigitalProductPassport';
export { default as ExtendDigitalProductPassport } from './ExtendDigitalProductPassport';
export { default as AddLifecycleEventToDpp } from './AddLifecycleEventToDpp';
export { default as ArchiveDigitalProductPassport } from './ArchiveDigitalProductPassport';

// Export new conceptual batch operation components
export { default as BatchUpdateDpps } from './BatchUpdateDpps';
export { default as ExportDpps } from './ExportDpps';

// No need to export the individual on-chain/auth/nft components if they are only used internally by ApiReferenceDppEndpoints.tsx
// If they were meant to be used elsewhere, they would be exported here.

