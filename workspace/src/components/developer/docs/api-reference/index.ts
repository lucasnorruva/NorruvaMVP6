
export { default as ListDigitalProductPassports } from './ListDigitalProductPassports';
export { default as RetrieveDigitalProductPassport } from './RetrieveDigitalProductPassport';
export { default as CreateDigitalProductPassport } from './CreateDigitalProductPassport';
export { default as UpdateDigitalProductPassport } from './UpdateDigitalProductPassport';
export { default as ExtendDigitalProductPassport } from './ExtendDigitalProductPassport';
export { default as AddLifecycleEventToDpp } from './AddLifecycleEventToDpp';
export { default as ArchiveDigitalProductPassport } from './ArchiveDigitalProductPassport';
export { default as ApiReferencePrivateLayerEndpoints } from './ApiReferencePrivateLayerEndpoints';
export { default as ApiReferenceZkpLayerEndpoints } from './ApiReferenceZkpLayerEndpoints'; 
export { default as BatchUpdateDpps } from './BatchUpdateDpps'; 
export { default as ExportDpps } from './ExportDpps'; 
// Ensure all components used in ApiReferenceDppEndpoints are exported here,
// including the new on-chain operation components if they are separate files.
// If they are defined within ApiReferenceDppEndpoints.tsx itself, no separate export is needed.
