// --- File: Lifecycle.ts ---
// Description: Lifecycle related type definitions.

export interface LifecycleEvent {
  id: string;
  type: string;
  timestamp: string;
  location?: string;
  responsibleParty?: string;
  data?: Record<string, any>;
  transactionHash?: string;
  vcId?: string;
}

export interface HistoryEntry {
  timestamp: string;
  actionType: string;
  details?: string;
  changedBy: string;
  version?: number;
}

export interface SimpleLifecycleEvent {
  id: string;
  eventName: string;
  date: string; // ISO Date string
  location?: string;
  notes?: string;
  status: "Completed" | "In Progress" | "Upcoming" | "Delayed" | "Cancelled";
  iconName?: keyof typeof import("lucide-react");
  keyDocuments?: { name: string; type: "PDF" | "Link"; url: string }[];
}

export type IconName = keyof typeof import("lucide-react");

export interface LifecycleHighlight {
  stage: string;
  date: string;
  details?: string;
  isEbsiVerified?: boolean;
  iconName?: IconName;
}
