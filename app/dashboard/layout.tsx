import type { Metadata } from "next";
import type { ReactNode } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

export const metadata: Metadata = {
  title: "Tableau de bord | Figeac Aero Tunisie",
  description: "Système de suivi des ordres de fabrication",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">{children}</main>
        <footer className="shrink-0 border-t border-gray-100 bg-white px-6 py-3 text-center text-xs text-gray-400">
          © 2024 Figeac Aero Tunisie – Tous droits réservés
        </footer>
      </div>
    </div>
  );
}
