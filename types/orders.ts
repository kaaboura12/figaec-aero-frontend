import type { OFStatus } from "@/types/dashboard";

export type Priority = "Haute" | "Normale" | "Basse";

export interface Order {
  ofNumber: string;
  article: string;
  designation: string;
  department: string;
  workstation: string;
  currentOperation: string;
  status: OFStatus;
  plannedQty: number;
  remainingQty: number;
  projectedEndDate: string;
  delay: number;
  priority: Priority;
  productionChain: string;
}

export interface OrderFilters {
  search: string;
  statuses: OFStatus[];
  department: string;
  workstation: string;
  priority: string;
  productionChain: string;
}
