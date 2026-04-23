"use client";

import { useEffect, useState, useCallback } from "react";
import {
  X,
  Layers,
  Building2,
  Wrench,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge, DelayBadge } from "@/components/ui/Badge";
import type { Order, Priority } from "@/types/orders";

// ─── Style maps ───────────────────────────────────────────────────────────────

const PRIORITY_STYLES: Record<Priority, { dot: string; label: string }> = {
  Haute:   { dot: "bg-red-500",     label: "text-red-600" },
  Normale: { dot: "bg-orange-400",  label: "text-orange-600" },
  Basse:   { dot: "bg-emerald-500", label: "text-emerald-600" },
};

const PROGRESS_COLOR: Record<string, string> = {
  "En cours":  "bg-blue-500",
  "En retard": "bg-red-500",
  "En attente":"bg-amber-400",
  "Terminé":   "bg-emerald-500",
};

// ─── Small layout helpers ─────────────────────────────────────────────────────

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="px-6 py-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-gray-400">{icon}</span>
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function InfoField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
        {label}
      </span>
      <div className="text-sm font-medium text-gray-800">{children}</div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  order: Order | null;
  onClose: () => void;
}

export default function OrderDetailModal({ order, onClose }: Props) {
  const isOpen = order !== null;

  // Keep the last order in state so content stays visible during closing animation
  const [displayed, setDisplayed] = useState<Order | null>(null);
  useEffect(() => {
    if (order) setDisplayed(order);
  }, [order]);

  const close = useCallback(() => onClose(), [onClose]);

  // Escape key to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  if (!displayed) return null;

  const realized = Math.max(0, displayed.plannedQty - displayed.remainingQty);
  const percentage = displayed.plannedQty > 0
    ? Math.round((realized / displayed.plannedQty) * 100)
    : 0;

  const pStyle = PRIORITY_STYLES[displayed.priority];
  const progressColor = PROGRESS_COLOR[displayed.status] ?? "bg-blue-500";

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex justify-end",
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      )}
      role="dialog"
      aria-modal="true"
      aria-label={`Détails OF ${displayed.ofNumber}`}
    >
      {/* ── Backdrop ── */}
      <div
        className={cn(
          "absolute inset-0 bg-black/25 backdrop-blur-[2px] transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={close}
        aria-hidden="true"
      />

      {/* ── Slide-over panel ── */}
      <div
        className={cn(
          "relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Blue accent bar */}
        <div className="h-1 w-full shrink-0 bg-gradient-to-r from-[#1B3FA6] to-blue-400" />

        {/* ── Header ── */}
        <div className="flex shrink-0 items-start justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-lg font-bold tracking-tight text-gray-900">
                {displayed.ofNumber}
              </h2>
              <StatusBadge status={displayed.status} />
            </div>
            <p className="mt-1 text-sm text-gray-500">{displayed.article}</p>
          </div>
          <button
            onClick={close}
            aria-label="Fermer"
            className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3FA6]/30"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 divide-y divide-gray-100 overflow-y-auto">
          {/* Progress */}
          <Section title="Avancement" icon={<Layers className="h-3.5 w-3.5" />}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Progression</span>
                <span className="text-sm font-bold text-gray-800">{percentage}%</span>
              </div>

              {/* Progress bar */}
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={cn("h-full rounded-full transition-all duration-700", progressColor)}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Qty stats */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                {(
                  [
                    { label: "Prévue",   value: displayed.plannedQty,   accent: "text-gray-800" },
                    { label: "Réalisée", value: realized,                accent: "text-[#1B3FA6]" },
                    { label: "Restante", value: displayed.remainingQty,  accent: "text-gray-800" },
                  ] as const
                ).map(({ label, value, accent }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center rounded-xl bg-gray-50 py-3"
                  >
                    <span className={cn("text-2xl font-bold leading-none", accent)}>
                      {value}
                    </span>
                    <span className="mt-1 text-[11px] font-medium text-gray-400">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* General info */}
          <Section
            title="Informations générales"
            icon={<Building2 className="h-3.5 w-3.5" />}
          >
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <InfoField label="Désignation">
                {displayed.designation}
              </InfoField>
              <InfoField label="Département">
                <span className="font-mono font-semibold">{displayed.department}</span>
              </InfoField>
              <InfoField label="Chaîne de production">
                {displayed.productionChain}
              </InfoField>
              <InfoField label="Priorité">
                <div className="flex items-center gap-1.5">
                  <span className={cn("h-2 w-2 shrink-0 rounded-full", pStyle.dot)} />
                  <span className={cn("font-semibold", pStyle.label)}>
                    {displayed.priority}
                  </span>
                </div>
              </InfoField>
            </div>
          </Section>

          {/* Production */}
          <Section title="Production" icon={<Wrench className="h-3.5 w-3.5" />}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <InfoField label="Poste de travail">
                <span className="font-mono font-semibold">{displayed.workstation}</span>
              </InfoField>
              <InfoField label="Opération actuelle">
                {displayed.currentOperation}
              </InfoField>
            </div>
          </Section>

          {/* Delays */}
          <Section title="Délais" icon={<CalendarDays className="h-3.5 w-3.5" />}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <InfoField label="Date fin projetée">
                {displayed.projectedEndDate}
              </InfoField>
              <InfoField label="Retard">
                <DelayBadge delay={displayed.delay} />
              </InfoField>
            </div>
          </Section>
        </div>

        {/* ── Footer ── */}
        <div className="shrink-0 border-t border-gray-100 px-6 py-4">
          <button
            onClick={close}
            className="w-full rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
