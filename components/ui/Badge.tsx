import { cn } from "@/lib/utils";
import type { OFStatus } from "@/types/dashboard";

const STATUS_STYLES: Record<OFStatus, string> = {
  "En cours": "bg-emerald-50 text-emerald-700 border border-emerald-100",
  "En retard": "bg-red-50 text-red-600 border border-red-100",
  "En attente": "bg-amber-50 text-amber-700 border border-amber-100",
  Terminé: "bg-gray-100 text-gray-600 border border-gray-200",
};

interface StatusBadgeProps {
  status: OFStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        STATUS_STYLES[status],
        className
      )}
    >
      {status}
    </span>
  );
}

interface DelayBadgeProps {
  delay: number;
  className?: string;
}

export function DelayBadge({ delay, className }: DelayBadgeProps) {
  if (delay === 0) {
    return (
      <span className={cn("text-xs text-gray-400", className)}>0 j</span>
    );
  }
  if (delay > 0) {
    return (
      <span className={cn("text-xs font-semibold text-red-600", className)}>
        +{delay} j
      </span>
    );
  }
  return (
    <span className={cn("text-xs font-semibold text-emerald-600", className)}>
      {delay} j
    </span>
  );
}

interface DelayPillProps {
  days: number;
  className?: string;
}

export function DelayPill({ days, className }: DelayPillProps) {
  const styles =
    days >= 5
      ? "bg-red-100 text-red-700"
      : days >= 3
        ? "bg-orange-100 text-orange-700"
        : days >= 2
          ? "bg-amber-100 text-amber-700"
          : "bg-yellow-100 text-yellow-700";

  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        styles,
        className
      )}
    >
      +{days} jour{days > 1 ? "s" : ""}
    </span>
  );
}
