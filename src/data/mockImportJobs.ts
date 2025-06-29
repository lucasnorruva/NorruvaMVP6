export type ImportJobStatus = "PendingProcessing" | "Completed" | "Failed";

export interface ImportJob {
  jobId: string;
  status: ImportJobStatus;
  message?: string;
}

export const MOCK_IMPORT_JOBS = new Map<string, ImportJob>();
