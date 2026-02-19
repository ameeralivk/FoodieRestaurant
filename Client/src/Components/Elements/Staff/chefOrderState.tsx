import React from "react";

export type StaffOrderStatsData = {
  available: number;
  myAssigned: number;
  myPreparing: number;
  myReady: number;
};

type StaffOrderStatsProps = {
  stats: StaffOrderStatsData;
};

const ChefOrderStats: React.FC<StaffOrderStatsProps> = ({ stats }) => {
  return (
    <div className="max-w-9xl mx-auto px-6 py-6">
      <div className="grid grid-cols-4 gap-4">
        {/* Available */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="text-slate-600 text-sm font-medium mb-1">
            Available
          </div>
          <div className="text-3xl font-black text-slate-900">
            {stats.available}
          </div>
        </div>

        {/* Assigned */}
        <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm">
          <div className="text-blue-600 text-sm font-medium mb-1">Assigned</div>
          <div className="text-3xl font-black text-blue-700">
            {stats.myAssigned}
          </div>
        </div>

        {/* Preparing */}
        <div className="bg-white rounded-xl border border-amber-200 p-5 shadow-sm">
          <div className="text-amber-600 text-sm font-medium mb-1">
            Preparing
          </div>
          <div className="text-3xl font-black text-amber-700">
            {stats.myPreparing}
          </div>
        </div>

        {/* Ready */}
        <div className="bg-white rounded-xl border border-emerald-200 p-5 shadow-sm">
          <div className="text-emerald-600 text-sm font-medium mb-1">Ready</div>
          <div className="text-3xl font-black text-emerald-700">
            {stats.myReady}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChefOrderStats;
