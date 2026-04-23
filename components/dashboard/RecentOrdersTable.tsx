"use client";

import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { StatusBadge, DelayBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { FabricationOrder, OFStatus } from "@/types/dashboard";

const ALL = "Tous";

interface SelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}

function FilterSelect({ label, value, options, onChange }: SelectProps) {
  return (
    <div className="relative flex items-center">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className={cn(
          "appearance-none cursor-pointer rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-xs font-medium text-gray-700",
          "transition-colors hover:border-gray-300 focus:border-[#1B3FA6] focus:outline-none focus:ring-2 focus:ring-[#1B3FA6]/10"
        )}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o === ALL ? `${label} – ${ALL}` : o}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-gray-400" />
    </div>
  );
}

const STATUS_OPTIONS: string[] = [ALL, "En cours", "En retard", "En attente"];

interface Props {
  orders: FabricationOrder[];
}

export default function RecentOrdersTable({ orders }: Props) {
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [deptFilter, setDeptFilter] = useState(ALL);
  const [workstationFilter, setWorkstationFilter] = useState(ALL);

  const departments = useMemo(
    () => [ALL, ...Array.from(new Set(orders.map((o) => o.department))).sort()],
    [orders]
  );

  const workstations = useMemo(
    () => [ALL, ...Array.from(new Set(orders.map((o) => o.workstation))).sort()],
    [orders]
  );

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        if (statusFilter !== ALL && o.status !== statusFilter) return false;
        if (deptFilter !== ALL && o.department !== deptFilter) return false;
        if (workstationFilter !== ALL && o.workstation !== workstationFilter)
          return false;
        return true;
      }),
    [orders, statusFilter, deptFilter, workstationFilter]
  );

  return (
    <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
      {/* Table header toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-gray-800">
          Ordres de fabrication récents
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <FilterSelect
            label="Statut"
            value={statusFilter}
            options={STATUS_OPTIONS}
            onChange={setStatusFilter}
          />
          <FilterSelect
            label="Département"
            value={deptFilter}
            options={departments}
            onChange={setDeptFilter}
          />
          <FilterSelect
            label="Poste de travail"
            value={workstationFilter}
            options={workstations}
            onChange={setWorkstationFilter}
          />
          <button className="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3FA6]/30">
            Voir tout
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-xs">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              {[
                "N° OF",
                "Article",
                "Désignation",
                "Poste de travail",
                "Opération actuelle",
                "Statut",
                "Qté prévue",
                "Qté restante",
                "Date fin projetée",
                "Retard",
              ].map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left font-semibold text-gray-500 first:pl-5 last:pr-5"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-5 py-8 text-center text-gray-400"
                >
                  Aucun résultat pour les filtres sélectionnés.
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr
                  key={order.ofNumber}
                  className="transition-colors hover:bg-gray-50/80"
                >
                  <td className="pl-5 pr-4 py-3 font-medium text-gray-800">
                    {order.ofNumber}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{order.article}</td>
                  <td className="px-4 py-3 text-gray-500">{order.designation}</td>
                  <td className="px-4 py-3 font-mono text-gray-600">
                    {order.workstation}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {order.currentOperation}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status as OFStatus} />
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700">
                    {order.plannedQty}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700">
                    {order.remainingQty}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {order.projectedEndDate}
                  </td>
                  <td className="py-3 pl-4 pr-5">
                    <DelayBadge delay={order.delay} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
