"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ClipboardList,
  Upload,
  BarChart3,
  FileText,
  Database,
  Settings,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Accueil", href: "/dashboard/homepage", icon: Home },
  { label: "Ordres de fabrication", href: "/dashboard/OrdreDeFabrication", icon: ClipboardList },
  { label: "Imports", href: "/dashboard/imports", icon: Upload },
  { label: "Tableaux de bord", href: "/dashboard/dashboards", icon: BarChart3 },
  { label: "Rapports", href: "/dashboard/reports", icon: FileText },
  { label: "Référentiels", href: "/dashboard/referentials", icon: Database },
  { label: "Paramètres", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-gray-100 bg-white">
      {/* Logo */}
      <div className="flex items-center px-5 py-5">
        <Image
          src="/logo.png"
          alt="Figeac Aero Tunisie"
          width={130}
          height={44}
          className="object-contain"
          priority
        />
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-2">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                active
                  ? "bg-blue-50 text-[#1B3FA6]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              )}
            >
              <Icon
                className={cn(
                  "h-4.5 w-4.5 shrink-0",
                  active ? "text-[#1B3FA6]" : "text-gray-400"
                )}
                size={18}
              />
              <span className="leading-none">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-gray-100 px-3 py-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-gray-50">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-800 text-xs font-semibold text-white">
            AM
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-800">
              Amine Mahmoudi
            </p>
            <p className="truncate text-xs text-gray-400">Administrateur</p>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
        </button>
      </div>
    </aside>
  );
}
