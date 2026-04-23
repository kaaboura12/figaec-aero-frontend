"use client";

import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  type ChangeEvent,
} from "react";
import {
  Search,
  RefreshCw,
  Upload,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  ChevronUp,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge, DelayBadge } from "@/components/ui/Badge";
import StatusMultiSelect from "@/components/orders/StatusMultiSelect";
import Pagination from "@/components/orders/Pagination";
import OrderDetailModal from "@/components/orders/OrderDetailModal";
import type { Order, Priority } from "@/types/orders";
import type { OFStatus } from "@/types/dashboard";

// ─── Constants ────────────────────────────────────────────────────────────────

const ROWS_OPTIONS = [10, 25, 50, 100] as const;
const ALL = "Tous";

const PRIORITY_DOT: Record<Priority, string> = {
  Haute: "bg-red-500",
  Normale: "bg-orange-400",
  Basse: "bg-emerald-500",
};

const EXPORT_OPTIONS = ["Exporter en CSV", "Exporter en Excel", "Exporter en PDF"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <div className="relative flex items-center">
        <select
          value={value}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
          className="h-9 min-w-[130px] appearance-none cursor-pointer rounded-lg border border-gray-200 bg-white pl-3 pr-8 text-xs font-medium text-gray-700 transition-colors hover:border-gray-300 focus:border-[#1B3FA6] focus:outline-none focus:ring-2 focus:ring-[#1B3FA6]/10"
        >
          {[ALL, ...options].map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-gray-400" />
      </div>
    </div>
  );
}

function PriorityCell({ priority }: { priority: Priority }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("h-2 w-2 shrink-0 rounded-full", PRIORITY_DOT[priority])} />
      <span className="text-xs text-gray-600">{priority}</span>
    </div>
  );
}

function ExportDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg bg-[#1B3FA6] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1535A0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3FA6]/40"
      >
        <Upload className="h-3.5 w-3.5" />
        Exporter
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          {EXPORT_OPTIONS.map((opt) => (
            <button
              key={opt}
              className="flex w-full items-center px-4 py-2.5 text-xs text-gray-700 transition-colors hover:bg-gray-50"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  orders: Order[];
  totalCount: number;
  departments: string[];
  workstations: string[];
  chains: string[];
}

export default function OrdersView({
  orders,
  totalCount,
  departments,
  workstations,
  chains,
}: Props) {
  const [search, setSearch] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<OFStatus[]>([
    "En cours",
    "En retard",
  ]);
  const [department, setDepartment] = useState(ALL);
  const [workstation, setWorkstation] = useState(ALL);
  const [priority, setPriority] = useState(ALL);
  const [productionChain, setProductionChain] = useState(ALL);
  const [showFilters, setShowFilters] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const resetFilters = useCallback(() => {
    setSearch("");
    setSelectedStatuses([]);
    setDepartment(ALL);
    setWorkstation(ALL);
    setPriority(ALL);
    setProductionChain(ALL);
    setCurrentPage(1);
  }, []);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedStatuses, department, workstation, priority, productionChain, rowsPerPage]);

  const filteredOrders = useMemo(() => {
    let result = orders;

    if (selectedStatuses.length > 0) {
      result = result.filter((o) => selectedStatuses.includes(o.status));
    }
    if (department !== ALL) result = result.filter((o) => o.department === department);
    if (workstation !== ALL) result = result.filter((o) => o.workstation === workstation);
    if (priority !== ALL) result = result.filter((o) => o.priority === priority);
    if (productionChain !== ALL) result = result.filter((o) => o.productionChain === productionChain);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.ofNumber.toLowerCase().includes(q) ||
          o.article.toLowerCase().includes(q) ||
          o.designation.toLowerCase().includes(q) ||
          o.workstation.toLowerCase().includes(q)
      );
    }

    return result;
  }, [orders, selectedStatuses, department, workstation, priority, productionChain, search]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / rowsPerPage));

  const paginatedOrders = useMemo(
    () =>
      filteredOrders.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      ),
    [filteredOrders, currentPage, rowsPerPage]
  );

  const hasActiveFilters =
    selectedStatuses.length > 0 ||
    department !== ALL ||
    workstation !== ALL ||
    priority !== ALL ||
    productionChain !== ALL ||
    search.trim() !== "";

  const resultLabel = filteredOrders.length.toLocaleString("fr-FR");

  return (
    <div className="flex flex-col gap-5 p-6">
      {/* ── Page header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Ordres de fabrication
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Consultez et suivez vos ordres de fabrication
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetFilters}
            disabled={!hasActiveFilters}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Réinitialiser les filtres
          </button>
          <ExportDropdown />
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="flex items-center gap-3">
        <div className="relative flex flex-1 items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un OF, un article, une désignation, un poste de travail..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-700 placeholder:text-gray-400 transition-colors focus:border-[#1B3FA6] focus:outline-none focus:ring-2 focus:ring-[#1B3FA6]/10"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 text-gray-400 hover:text-gray-600"
              aria-label="Effacer la recherche"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters((v) => !v)}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-lg border px-3.5 py-2.5 text-xs font-medium transition-colors focus:outline-none",
            showFilters
              ? "border-[#1B3FA6] bg-blue-50 text-[#1B3FA6]"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filtres avancés
          {showFilters ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* ── Filter bar (collapsible) ── */}
      {showFilters && (
        <div className="flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white px-4 py-4">
          <StatusMultiSelect
            selected={selectedStatuses}
            onChange={setSelectedStatuses}
          />
          <FilterSelect
            label="Département"
            value={department}
            options={departments}
            onChange={setDepartment}
          />
          <FilterSelect
            label="Poste de travail"
            value={workstation}
            options={workstations}
            onChange={setWorkstation}
          />
          <FilterSelect
            label="Priorité"
            value={priority}
            options={["Haute", "Normale", "Basse"]}
            onChange={setPriority}
          />
          <FilterSelect
            label="Chaîne de prod."
            value={productionChain}
            options={chains}
            onChange={setProductionChain}
          />

          <div className="ml-auto">
            <button
              onClick={() => setShowFilters(false)}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-gray-800"
            >
              Masquer les filtres
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Results bar (top) ── */}
      <ResultsBar
        count={resultLabel}
        rowsPerPage={rowsPerPage}
        onRowsChange={(v) => setRowsPerPage(v)}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* ── Table ── */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                {[
                  "N° OF",
                  "Article",
                  "Désignation",
                  "Opération actuelle",
                  "Poste de travail",
                  "Statut",
                  "Qté prévue",
                  "Qte restante",
                  "Date fin projetée",
                  "Retard",
                  "Priorité",
                  "",
                ].map((col, i) => (
                  <th
                    key={col || `col-${i}`}
                    className="px-4 py-3 text-left font-semibold text-gray-500 first:pl-5 last:pr-4 last:text-right"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
                    className="px-5 py-12 text-center text-sm text-gray-400"
                  >
                    Aucun ordre de fabrication ne correspond aux filtres sélectionnés.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr
                    key={order.ofNumber}
                    onClick={() => setSelectedOrder(order)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setSelectedOrder(order);
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Voir les détails de ${order.ofNumber}`}
                    className="group cursor-pointer transition-colors hover:bg-blue-50/40 focus:outline-none focus-visible:bg-blue-50/40"
                  >
                    <td className="py-3 pl-5 pr-4">
                      <span className="font-medium text-[#1B3FA6] group-hover:underline">
                        {order.ofNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {order.article}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{order.designation}</td>
                    <td className="px-4 py-3 text-gray-600">{order.currentOperation}</td>
                    <td className="px-4 py-3 font-mono text-gray-600">
                      {order.workstation}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
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
                    <td className="px-4 py-3">
                      <DelayBadge delay={order.delay} />
                    </td>
                    <td className="px-4 py-3">
                      <PriorityCell priority={order.priority} />
                    </td>
                    <td className="py-3 pl-4 pr-4 text-right">
                      <ChevronRight className="ml-auto h-4 w-4 text-gray-300 transition-colors group-hover:text-[#1B3FA6]" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Results bar (bottom) ── */}
      <ResultsBar
        count={resultLabel}
        rowsPerPage={rowsPerPage}
        onRowsChange={(v) => setRowsPerPage(v)}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* ── Detail modal ── */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}

// ─── ResultsBar (shared top + bottom) ────────────────────────────────────────

function ResultsBar({
  count,
  rowsPerPage,
  onRowsChange,
  currentPage,
  totalPages,
  onPageChange,
}: {
  count: string;
  rowsPerPage: number;
  onRowsChange: (v: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <RefreshCw className="h-3.5 w-3.5 text-gray-400" />
        <span>
          <span className="font-semibold text-gray-700">{count}</span> résultats
          trouvés
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Lignes par page</span>
          <div className="relative flex items-center">
            <select
              value={rowsPerPage}
              onChange={(e) => onRowsChange(Number(e.target.value))}
              className="h-7 appearance-none rounded-md border border-gray-200 bg-white pl-2.5 pr-6 text-xs font-medium text-gray-700 focus:border-[#1B3FA6] focus:outline-none"
            >
              {ROWS_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-1.5 h-3 w-3 text-gray-400" />
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
