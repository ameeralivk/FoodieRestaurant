import React from "react";

type OrderStatsProps = {
  readyCount: number;
  servingCount: number;
  completedCount: number;
};

const StaffOrderStats: React.FC<OrderStatsProps> = ({
  readyCount,
  servingCount,
  completedCount,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="grid grid-cols-3 gap-4">

        {/* Ready Orders */}
        <div className="bg-white rounded-xl border border-emerald-200 p-5 shadow-sm">
          <div className="text-emerald-600 text-sm font-medium mb-1">
            Ready for Pickup
          </div>
          <div className="text-3xl font-black text-emerald-700">
            {readyCount}
          </div>
        </div>

        {/* Serving Orders */}
        <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm">
          <div className="text-blue-600 text-sm font-medium mb-1">
            Currently Serving
          </div>
          <div className="text-3xl font-black text-blue-700">
            {servingCount}
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="text-slate-600 text-sm font-medium mb-1">
            Completed
          </div>
          <div className="text-3xl font-black text-slate-700">
            {completedCount}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StaffOrderStats;
