import {
  ClipboardList,
  PlayCircle,
  Clock,
  PauseCircle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { KpiMetric, KpiColor, KpiIconKey } from "@/types/dashboard";

const ICON_MAP: Record<KpiIconKey, LucideIcon> = {
  clipboard: ClipboardList,
  "play-circle": PlayCircle,
  clock: Clock,
  "pause-circle": PauseCircle,
};

const COLOR_CONFIG: Record<
  KpiColor,
  { bg: string; icon: string; line: string }
> = {
  blue: { bg: "bg-blue-50", icon: "text-blue-600", line: "#3B82F6" },
  green: { bg: "bg-emerald-50", icon: "text-emerald-600", line: "#10B981" },
  red: { bg: "bg-red-50", icon: "text-red-500", line: "#EF4444" },
  amber: { bg: "bg-amber-50", icon: "text-amber-500", line: "#F59E0B" },
};

function Sparkline({
  data,
  color,
  gradientId,
}: {
  data: number[];
  color: string;
  gradientId: string;
}) {
  const W = 80;
  const H = 36;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const coords = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((v - min) / range) * (H - 8) - 4,
  }));

  const linePts = coords.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const fillPts = `0,${H} ${linePts} ${W},${H}`;

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      className="shrink-0 overflow-visible"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill={`url(#${gradientId})`} />
      <polyline
        points={linePts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface Props {
  metric: KpiMetric;
}

export default function KpiCard({ metric }: Props) {
  const config = COLOR_CONFIG[metric.color];
  const Icon = ICON_MAP[metric.iconKey];
  const gradientId = `spark-${metric.id}`;

  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center gap-3.5">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
            config.bg
          )}
        >
          <Icon className={cn("h-5 w-5", config.icon)} />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500">{metric.label}</p>
          <p className="text-2xl font-bold leading-tight tracking-tight text-gray-900">
            {metric.value.toLocaleString("fr-FR")}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">{metric.badge}</p>
        </div>
      </div>
      <Sparkline
        data={metric.trend}
        color={config.line}
        gradientId={gradientId}
      />
    </div>
  );
}
