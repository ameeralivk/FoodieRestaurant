// import React from "react";

// export const ChartTooltip: React.FC<any> = ({ active, payload, label }) => {
//     if (!active || !payload?.length) return null;
//     return (
//         <div className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 shadow-xl shadow-black/40">
//             <p className="text-sm font-bold text-white mb-1">{label}</p>
//             {payload.map((entry: any, i: number) => (
//                 <p key={i} className="text-xs text-gray-300">
//                     <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
//                     {entry.name}: <span className="font-semibold">{typeof entry.value === "number" ? entry.value.toLocaleString("en-IN") : entry.value}</span>
//                 </p>
//             ))}
//         </div>
//     );
// };

import React from "react";

type TooltipPayload = {
  name?: string;
  value?: string | number;
  color?: string;
};

type ChartTooltipProps = {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
};

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 shadow-xl shadow-black/40">
      <p className="text-sm font-bold text-white mb-1">{label}</p>

      {payload.map((entry, i) => (
        <p key={i} className="text-xs text-gray-300">
          <span
            className="inline-block w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: entry.color }}
          />
          {entry.name}:{" "}
          <span className="font-semibold">
            {typeof entry.value === "number"
              ? entry.value.toLocaleString("en-IN")
              : entry.value}
          </span>
        </p>
      ))}
    </div>
  );
};
