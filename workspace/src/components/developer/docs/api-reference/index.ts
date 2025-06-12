
export { default as ListDigitalProductPassports } from './ListDigitalProductPassports';
export { default as RetrieveDigitalProductPassport } from './RetrieveDigitalProductPassport';
export { default as CreateDigitalProductPassport } from './CreateDigitalProductPassport';
export { default as UpdateDigitalProductPassport } from './UpdateDigitalProductPassport';
export { default as ExtendDigitalProductPassport } from './ExtendDigitalProductPassport';
export { default as AddLifecycleEventToDpp } from './AddLifecycleEventToDpp';
export { default as ArchiveDigitalProductPassport } from './ArchiveDigitalProductPassport';
export { default as ApiReferencePrivateLayerEndpoints } from './ApiReferencePrivateLayerEndpoints';
export { default as ApiReferenceZkpLayerEndpoints } from './ApiReferenceZkpLayerEndpoints'; // Added export

// Ensure ApiReferenceDppEndpoints is also exported if it's the main aggregator,
// or export the new components directly if they are separate files.
// For now, assuming they are part of ApiReferenceDppEndpoints.tsx or similar structure.
// If UpdateDppOnChainStatus, etc., are separate components, export them:
// export { default as UpdateDppOnChainStatus } from './UpdateDppOnChainStatus';
// ... and so on for other new endpoint docs.

// However, the current plan seems to integrate these into ApiReferenceDppEndpoints.tsx,
// so no new exports might be needed here unless that structure changes.

