import type { Metadata } from "next";
import { Upload, Clock } from "lucide-react";
import {
  kpiMetrics,
  delayedOFs,
  departments,
  recentOrders,
  lastImportDate,
} from "@/lib/data/dashboard";
import KpiCard from "@/components/dashboard/KpiCard";
import DelayedOFPanel from "@/components/dashboard/DelayedOFPanel";
import DepartmentChart from "@/components/dashboard/DepartmentChart";
import RecentOrdersTable from "@/components/dashboard/RecentOrdersTable";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Accueil | Figeac Aero Tunisie",
};

export default function HomepagePage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Bienvenue, voici la vue d'ensemble de vos ordres de fabrication.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs text-gray-600 shadow-sm">
            <Clock className="h-3.5 w-3.5 text-gray-400" />
            <div>
              <p className="font-medium text-gray-500">Dernier import</p>
              <p className="font-semibold text-gray-800">{lastImportDate}</p>
            </div>
          </div>
          <Button className="gap-2 px-4 py-2.5 text-sm">
            <Upload className="h-4 w-4" />
            Importer un fichier
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      <section aria-label="Indicateurs clés" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpiMetrics.map((metric) => (
          <KpiCard key={metric.id} metric={metric} />
        ))}
      </section>

      {/* Middle section: delayed OF + department chart */}
      <section
        aria-label="Vue intermédiaire"
        className="grid grid-cols-1 gap-4 lg:grid-cols-5"
      >
        <div className="lg:col-span-3">
          <DelayedOFPanel delayedOFs={delayedOFs} />
        </div>
        <div className="lg:col-span-2">
          <DepartmentChart departments={departments} />
        </div>
      </section>

      {/* Recent orders table */}
      <section aria-label="Ordres récents">
        <RecentOrdersTable orders={recentOrders} />
      </section>
    </div>
  );
}
