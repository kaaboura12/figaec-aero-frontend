import type { Department } from "@/types/dashboard";

interface Props {
  departments: Department[];
}

interface DonutProps {
  departments: Department[];
  size?: number;
}

function DonutChart({ departments, size = 156 }: DonutProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.325;
  const strokeWidth = size * 0.165;
  const circumference = 2 * Math.PI * radius;
  const GAP = 3;
  const total = departments.reduce((s, d) => s + d.count, 0);

  let cumulative = 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      className="shrink-0"
    >
      {/* Background track */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="#F3F4F6"
        strokeWidth={strokeWidth}
      />
      <g transform={`rotate(-90, ${cx}, ${cy})`}>
        {departments.map((dept) => {
          const segArc = (dept.count / total) * circumference;
          const displayArc = Math.max(0, segArc - GAP);
          const offset = -cumulative;
          cumulative += segArc;

          return (
            <circle
              key={dept.code}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={dept.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${displayArc} ${circumference}`}
              strokeDashoffset={offset}
              strokeLinecap="butt"
            />
          );
        })}
      </g>
    </svg>
  );
}

export default function DepartmentChart({ departments }: Props) {
  const total = departments.reduce((s, d) => s + d.count, 0);

  return (
    <div className="flex flex-col rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
      <div className="border-b border-gray-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-gray-800">
          Répartition par département
        </h2>
      </div>

      <div className="flex flex-1 items-center justify-center gap-8 px-6 py-5">
        <DonutChart departments={departments} />

        {/* Legend */}
        <ul className="flex flex-col gap-2.5">
          {departments.map((dept) => (
            <li key={dept.code} className="flex items-center gap-2.5">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: dept.color }}
              />
              <span className="w-14 text-xs font-semibold text-gray-700">
                {dept.code}
              </span>
              <span className="text-xs text-gray-500">
                {dept.count.toLocaleString("fr-FR")}
                <span className="ml-1 text-gray-400">({dept.percentage}%)</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-gray-100 px-5 py-2.5">
        <p className="text-xs text-gray-400">
          Total :{" "}
          <span className="font-semibold text-gray-600">
            {total.toLocaleString("fr-FR")} OF
          </span>
        </p>
      </div>
    </div>
  );
}
