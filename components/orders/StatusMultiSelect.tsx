"use client";

import { useRef, useEffect, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OFStatus } from "@/types/dashboard";

const STATUS_OPTIONS: OFStatus[] = ["En cours", "En retard", "En attente", "Terminé"];

const STATUS_DOT: Record<OFStatus, string> = {
  "En cours":  "bg-emerald-500",
  "En retard": "bg-red-500",
  "En attente":"bg-amber-500",
  "Terminé":   "bg-gray-400",
};

interface Props {
  selected: OFStatus[];
  onChange: (v: OFStatus[]) => void;
}

export default function StatusMultiSelect({ selected, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const toggle = (status: OFStatus) => {
    onChange(
      selected.includes(status)
        ? selected.filter((s) => s !== status)
        : [...selected, status]
    );
  };

  const displayValue =
    selected.length === 0 ? "Tous" : selected.join(", ");

  return (
    <div ref={ref} className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-500">Statut</span>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex h-9 min-w-[160px] max-w-[220px] items-center gap-2 rounded-lg border bg-white pl-3 pr-2 text-xs text-gray-700 transition-colors",
            open
              ? "border-[#1B3FA6] ring-2 ring-[#1B3FA6]/10"
              : "border-gray-200 hover:border-gray-300"
          )}
        >
          <span className="flex-1 truncate text-left">{displayValue}</span>
          {selected.length > 0 && (
            <span
              role="button"
              aria-label="Effacer le filtre statut"
              onClick={(e) => {
                e.stopPropagation();
                onChange([]);
              }}
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-3 w-3" />
            </span>
          )}
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform",
              open && "rotate-180"
            )}
          />
        </button>

        {open && (
          <div className="absolute left-0 top-full z-50 mt-1 w-52 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
            {STATUS_OPTIONS.map((status) => (
              <label
                key={status}
                className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(status)}
                  onChange={() => toggle(status)}
                  className="h-3.5 w-3.5 rounded border-gray-300 accent-[#1B3FA6]"
                />
                <span
                  className={cn(
                    "h-2 w-2 shrink-0 rounded-full",
                    STATUS_DOT[status]
                  )}
                />
                <span className="text-xs text-gray-700">{status}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
