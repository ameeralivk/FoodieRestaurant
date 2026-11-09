import React from "react";
import { CircleDollarSign, TrendingUp } from "lucide-react";

interface BalanceCardProps {
  currentBalance: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ currentBalance }) => {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 md:p-8 mb-8 shadow-xl relative overflow-hidden text-white">
      {/* Background Patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-black opacity-5 rounded-full blur-2xl translate-y-1/4 -translate-x-1/4 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-6 w-full min-w-0">
          <div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner">
            <CircleDollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>

          <div className="min-w-0">
            <p className="text-orange-50 font-medium mb-1 text-sm uppercase tracking-wider">Total Balance</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight break-all">
              ₹{currentBalance.toLocaleString()}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
          <TrendingUp className="w-4 h-4 text-green-300" />
          <p className="text-sm font-medium">Ready to use</p>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
