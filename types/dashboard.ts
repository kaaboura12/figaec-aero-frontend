export type OFStatus = "En cours" | "En retard" | "En attente" | "Terminé";
export type KpiColor = "blue" | "green" | "red" | "amber";
export type KpiIconKey = "clipboard" | "play-circle" | "clock" | "pause-circle";

export interface KpiMetric {
  id: string;
  label: string;
  value: number;
  badge: string;
  trend: number[];
  color: KpiColor;
  iconKey: KpiIconKey;
}

export interface DelayedOF {
  ofNumber: string;
  article: string;
  delayDays: number;
}

export interface Department {
  code: string;
  count: number;
  percentage: number;
  color: string;
}

export interface FabricationOrder {
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
}
