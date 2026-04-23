import Link from "next/link";
import { AlertTriangle, ChevronRight, ArrowRight } from "lucide-react";
import { DelayPill } from "@/components/ui/Badge";
import type { DelayedOF } from "@/types/dashboard";

interface Props {
  delayedOFs: DelayedOF[];
}

export default function DelayedOFPanel({ delayedOFs }: Props) {
  return (
    <div className="flex flex-col rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
        <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-orange-500" size={18} />
        <h2 className="text-sm font-semibold text-orange-600">
          OF en retard (Top 5)
        </h2>
      </div>

      {/* Rows */}
      <ul className="flex flex-col divide-y divide-gray-50">
        {delayedOFs.map((of) => (
          <li key={of.ofNumber}>
            <button className="flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <span className="w-28 shrink-0 text-xs font-medium text-gray-700">
                  {of.ofNumber}
                </span>
                <span className="text-xs text-gray-500">{of.article}</span>
              </div>
              <div className="flex items-center gap-3">
                <DelayPill days={of.delayDays} />
                <ChevronRight className="h-4 w-4 text-gray-300" />
              </div>
            </button>
          </li>
        ))}
      </ul>

      {/* Footer link */}
      <div className="border-t border-gray-100 px-5 py-3">
        <Link
          href="/dashboard/orders?filter=retard"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1B3FA6] hover:underline"
        >
          Voir tous les OF en retard
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
