// import { useState, useMemo } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { getTotalOrders } from "../../../services/staffService";
// import { useSelector } from "react-redux";
// import type{ RootState } from "../../../redux/store/store";
// import type{ IUserOrder } from "../../../types/order";
// import { Calendar, BarChart2, CheckCircle, Clock, CheckSquare } from "lucide-react";

// const ChefAnalyticsContent = () => {
//     const [filter, setFilter] = useState<"today" | "week" | "month" | "all">("today");
//     const userId = useSelector((state: RootState) => state.userAuth.user?._id);
//     const restaurantId = useSelector((state: RootState) => state.userAuth.user?.restaurantId);

//     const { data, isLoading } = useQuery<{ success: boolean; data: IUserOrder[] }>({
//         queryKey: ["orders", userId, "analytics"],
//         queryFn: () => getTotalOrders(restaurantId as string),
//         enabled: !!restaurantId,
//     });

//     const stats = useMemo(() => {
//         if (!data?.data || !userId) return { total: 0, pending: 0, ready: 0, perfScore: 0, topItem: "-" };

//         const now = new Date();
//         // Flatten logic
//         const allItems = data.data.flatMap(order =>
//             order.items
//                 .filter(item => item.assignedCookId === userId)
//                 .map(item => ({
//                     ...item,
//                     orderId: order.orderId,
//                     orderUpdatedAt: order.updatedAt || order.createdAt
//                 }))
//         );

//         const filtered = allItems.filter(item => {
//             const itemDate = new Date(item.orderUpdatedAt);
//             if (filter === "today") return itemDate.toDateString() === now.toDateString();
//             if (filter === "week") {
//                 const d = new Date(); d.setDate(d.getDate() - 7); return itemDate >= d;
//             }
//             if (filter === "month") {
//                 const d = new Date(); d.setMonth(d.getMonth() - 1); return itemDate >= d;
//             }
//             return true;
//         });

//         const readyCount = filtered.filter(i => i.itemStatus === "READY" || i.itemStatus === "SERVING").length;
//         const pendingCount = filtered.filter(i => i.itemStatus === "ASSIGNED" || i.itemStatus === "PREPARING").length;
//         const totalCount = filtered.length;

//         // Most Prepared Item
//         const freq: Record<string, number> = {};
//         filtered.forEach(i => freq[i.itemName] = (freq[i.itemName] || 0) + 1);
//         const topItem = Object.keys(freq).sort((a, b) => freq[b] - freq[a])[0] || "None Yet";

//         // Performance Score (rough completion rate)
//         const perfScore = totalCount > 0 ? Math.round((readyCount / totalCount) * 100) : 0;

//         return { total: totalCount, pending: pendingCount, ready: readyCount, perfScore, topItem };
//     }, [data, userId, filter]);

//     const cards = [
//         { title: "Total Assigned", value: stats.total, icon: BarChart2, color: "text-blue-600", bg: "bg-blue-100" },
//         { title: "Prepared / Ready", value: stats.ready, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100" },
//         { title: "In Progress", value: stats.pending, icon: Clock, color: "text-orange-600", bg: "bg-orange-100" },
//         { title: "Completion Rate", value: `${stats.perfScore}%`, icon: CheckSquare, color: "text-purple-600", bg: "bg-purple-100" },
//     ];

//     return (
//         <div className="max-w-7xl mx-auto px-6 pb-8 pt-4">
//             <div className="flex justify-between items-center mb-8">
//                 <div>
//                     <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
//                     <p className="text-gray-500">Track your kitchen efficiency & order metrics</p>
//                 </div>

//                 <div className="flex bg-white rounded-lg border shadow-sm overflow-hidden p-1">
//                     {["today", "week", "month", "all"].map(f => (
//                         <button
//                             key={f}
//                             onClick={() => setFilter(f as any)}
//                             className={`px-4 py-2 text-sm font-semibold capitalize rounded-md transition-all outline-none ${filter === f ? "bg-emerald-600 text-white shadow" : "text-gray-600 hover:bg-gray-50"
//                                 }`}
//                         >
//                             {f}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {isLoading ? (
//                 <div className="min-h-[400px] flex items-center justify-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
//                 </div>
//             ) : (
//                 <div className="space-y-8">
//                     {/* Stats Cards */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                         {cards.map((card, i) => (
//                             <div key={i} className="bg-white rounded-2xl p-6 border shadow-sm flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group">
//                                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
//                                     <card.icon className={`w-24 h-24 ${card.color}`} />
//                                 </div>
//                                 <div className="flex items-center gap-4 mb-4 relative z-10">
//                                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg}`}>
//                                         <card.icon className={`w-6 h-6 ${card.color}`} />
//                                     </div>
//                                     <h3 className="font-semibold text-gray-500">{card.title}</h3>
//                                 </div>
//                                 <div className="text-4xl font-black text-gray-900 relative z-10">
//                                     {card.value}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                         {/* Visual Bar Chart Box */}
//                         <div className="bg-white rounded-2xl border shadow-sm p-6">
//                             <h3 className="text-lg font-bold text-gray-900 border-b pb-4 mb-6">Status Overview</h3>
//                             <div className="space-y-6">
//                                 <div>
//                                     <div className="flex justify-between mb-2">
//                                         <span className="font-semibold text-gray-700">Ready</span>
//                                         <span className="text-gray-500 font-medium">{stats.ready}</span>
//                                     </div>
//                                     <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
//                                         <div className="bg-emerald-500 h-4 rounded-full transition-all duration-1000 ease-out"
//                                             style={{ width: `${stats.total ? (stats.ready / stats.total) * 100 : 0}%` }}></div>
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <div className="flex justify-between mb-2">
//                                         <span className="font-semibold text-gray-700">Pending / Preparing</span>
//                                         <span className="text-gray-500 font-medium">{stats.pending}</span>
//                                     </div>
//                                     <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
//                                         <div className="bg-amber-500 h-4 rounded-full transition-all duration-1000 ease-out"
//                                             style={{ width: `${stats.total ? (stats.pending / stats.total) * 100 : 0}%` }}></div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Insights */}
//                         <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
//                             <div className="absolute inset-0 bg-white/5 pattern-dots pointer-events-none"></div>
//                             <h3 className="text-lg font-bold border-b border-gray-700 pb-4 mb-6">Quick Insights</h3>

//                             <div className="space-y-6">
//                                 <div className="flex items-start gap-4">
//                                     <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
//                                         <CheckCircle className="w-6 h-6 text-emerald-400" />
//                                     </div>
//                                     <div>
//                                         <h4 className="text-gray-400 text-sm font-medium">Top Prepared Item</h4>
//                                         <p className="text-xl font-bold mt-1 text-emerald-300">{stats.topItem}</p>
//                                     </div>
//                                 </div>

//                                 <div className="flex items-start gap-4">
//                                     <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
//                                         <Calendar className="w-6 h-6 text-blue-400" />
//                                     </div>
//                                     <div>
//                                         <h4 className="text-gray-400 text-sm font-medium">Selected Period</h4>
//                                         <p className="text-xl font-bold mt-1 text-blue-300 capitalize">{filter}s Analysis</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ChefAnalyticsContent

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getTotalOrders } from "../../../services/staffService";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import type { IUserOrder } from "../../../types/order";
import {
  BarChart2,
  CheckCircle,
  Clock,
  Trophy,
  TrendingUp,
  Zap,
  Target,
  ChefHat,
  Star,
} from "lucide-react";

// Circular Progress Component
const CircularProgress = ({
  value,
  color,
  size = 120,
}: {
  value: number;
  color: string;
  size?: number;
}) => {
  const radius = (size - 10) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-gray-100"
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          className={color}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-black text-gray-900">{value}%</span>
        <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest">
          Efficiency
        </span>
      </div>
    </div>
  );
};

const ChefAnalyticsContent = () => {
  const [filter, setFilter] = useState<"today" | "week" | "month" | "all">(
    "today",
  );
  const userId = useSelector((state: RootState) => state.userAuth.user?._id);
  const restaurantId = useSelector(
    (state: RootState) => state.userAuth.user?.restaurantId,
  );

  const { data, isLoading } = useQuery<{
    success: boolean;
    data: IUserOrder[];
  }>({
    queryKey: ["orders", userId, "analytics"],
    queryFn: () => getTotalOrders(restaurantId as string),
    enabled: !!restaurantId,
  });

  const stats = useMemo(() => {
    if (!data?.data || !userId)
      return {
        total: 0,
        pending: 0,
        ready: 0,
        perfScore: 0,
        topItem: "-",
        topItemCount: 0,
      };

    const now = new Date();
    const allItems = data.data.flatMap((order) =>
      order.items
        .filter((item) => item.assignedCookId === userId)
        .map((item) => ({
          ...item,
          orderUpdatedAt:
            item.itemStatus === "READY" || item.itemStatus === "SERVING"
              ? order.updatedAt || order.createdAt
              : order.createdAt,
        })),
    );

    const filtered = allItems.filter((item) => {
      const itemDate = new Date(item.orderUpdatedAt);
      if (filter === "all") return true;
      if (filter === "today")
        return itemDate.toDateString() === now.toDateString();
      if (filter === "week") {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return itemDate >= d;
      }
      if (filter === "month") {
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        return itemDate >= d;
      }
      return true;
    });

    const readyCount = filtered.filter(
      (i) => i.itemStatus === "READY" || i.itemStatus === "SERVING",
    ).length;
    const pendingCount = filtered.filter(
      (i) => i.itemStatus === "ASSIGNED" || i.itemStatus === "PREPARING",
    ).length;
    const totalCount = filtered.length;

    const freq: Record<string, number> = {};
    filtered.forEach((i) => (freq[i.itemName] = (freq[i.itemName] || 0) + 1));
    const topItemEntry = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];

    return {
      total: totalCount,
      pending: pendingCount,
      ready: readyCount,
      perfScore:
        totalCount > 0 ? Math.round((readyCount / totalCount) * 100) : 0,
      topItem: topItemEntry ? topItemEntry[0] : "None Yet",
      topItemCount: topItemEntry ? topItemEntry[1] : 0,
    };
  }, [data, userId, filter]);

  const cards = [
    {
      title: "Total Tasks",
      value: stats.total,
      icon: BarChart2,
      color: "blue",
      gradient: "from-blue-600 to-indigo-700",
      label: "Workload",
    },
    {
      title: "Ready/Served",
      value: stats.ready,
      icon: CheckCircle,
      color: "emerald",
      gradient: "from-emerald-500 to-teal-700",
      label: "Completed",
    },
    {
      title: "Active Prep",
      value: stats.pending,
      icon: Clock,
      color: "orange",
      gradient: "from-orange-500 to-amber-600",
      label: "Processing",
    },
    {
      title: "Prime Score",
      value: `${stats.perfScore}%`,
      icon: Zap,
      color: "purple",
      gradient: "from-purple-600 to-violet-800",
      label: "Reliability",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 pb-12 pt-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-xl shadow-emerald-200">
              <TrendingUp className="w-8 h-8" />
            </div>
            Personal <span className="text-emerald-600">Analytics</span>
          </h2>
          <p className="text-gray-500 font-medium mt-1 ml-1">
            Precision tracking for your culinary performance
          </p>
        </div>

        <div className="flex bg-gray-100/80 backdrop-blur-md p-1.5 rounded-2xl border border-gray-200">
          {["today", "week", "month", "all"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 capitalize ${
                filter === f
                  ? "bg-white text-emerald-600 shadow-md scale-105 border border-emerald-100"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="min-h-[500px] flex flex-col items-center justify-center gap-4 bg-white/50 rounded-[3rem] border border-gray-100 shadow-inner">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <ChefHat className="w-8 h-8 text-emerald-600/30" />
            </div>
          </div>
          <p className="text-lg font-black text-gray-400 animate-pulse tracking-widest uppercase">
            Analyzing Performance...
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Hero Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className={`relative overflow-hidden bg-gradient-to-br ${card.gradient} rounded-[2.5rem] p-8 text-white shadow-2xl shadow-${card.color}-200/50 group`}
              >
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">
                  <card.icon className="w-32 h-32 text-white" />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-gray-900 transition-all duration-300">
                    <card.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-black uppercase tracking-[0.2em] opacity-70 italic">
                      {card.label}
                    </div>
                    <div className="text-4xl font-black">{card.value}</div>
                    <div className="text-sm font-bold opacity-90">
                      {card.title}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Middle Section: Depth Insights */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Completion Mastery */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-xl shadow-gray-100 flex flex-col items-center justify-center"
            >
              <div className="mb-6 text-center">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">
                  Completion Rate
                </h3>
                <p className="text-sm font-bold text-gray-400 italic">
                  Efficiency Score
                </p>
              </div>
              <CircularProgress
                value={stats.perfScore}
                color="text-emerald-500"
                size={200}
              />
              <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                <div className="bg-emerald-50 rounded-3xl p-4 text-center">
                  <div className="text-2xl font-black text-emerald-700">
                    {stats.ready}
                  </div>
                  <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                    Successful
                  </div>
                </div>
                <div className="bg-gray-50 rounded-3xl p-4 text-center">
                  <div className="text-2xl font-black text-gray-400">
                    {stats.total}
                  </div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Total Aimed
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Top Performance Analytics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="xl:col-span-2 bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-gray-200"
            >
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <Star className="w-64 h-64 text-white" />
              </div>

              <div className="relative z-10 h-full flex flex-col">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h3 className="text-2xl font-black tracking-tight mb-2">
                      Signature Mastery
                    </h3>
                    <p className="text-gray-400 font-medium">
                      Your most frequent preparation this {filter}
                    </p>
                  </div>
                  <div className="bg-emerald-500/20 text-emerald-400 p-4 rounded-3xl border border-emerald-500/30">
                    <Trophy className="w-8 h-8" />
                  </div>
                </div>

                <div className="flex-grow flex flex-col justify-center">
                  {stats.topItem === "None Yet" ? (
                    <div className="text-center py-10 opacity-50 italic">
                      Start completing tasks to see your specialties
                    </div>
                  ) : (
                    <div className="flex items-center gap-8">
                      <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-emerald-500/20">
                        {stats.topItemCount}
                      </div>
                      <div>
                        <div className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400 mb-1">
                          Top Performed Item
                        </div>
                        <div className="text-4xl md:text-5xl font-black text-white leading-tight">
                          {stats.topItem}
                        </div>
                        <div className="flex items-center gap-2 mt-4 text-emerald-400/80 font-bold">
                          <Target className="w-5 h-5" />
                          <span>
                            {Math.round(
                              (stats.topItemCount / stats.total) * 100,
                            )}
                            % of your total workload
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-10 border-t border-white/10 flex justify-between items-center text-xs font-black uppercase tracking-widest text-gray-500">
                  <span>Live Performance Metrics</span>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-emerald-500">Active Tracking</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Utility Row */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            {/* Task Velocity */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-50">
              <h3 className="text-lg font-black text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-2 h-6 bg-emerald-500 rounded-full" />
                Task Velocity
              </h3>
              <div className="space-y-6">
                {[
                  {
                    label: "Completed Tasks",
                    value: stats.ready,
                    total: stats.total,
                    color: "bg-emerald-500",
                  },
                  {
                    label: "In Preparation",
                    value: stats.pending,
                    total: stats.total,
                    color: "bg-orange-500",
                  },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-sm font-black text-gray-600 uppercase tracking-tight">
                        {row.label}
                      </span>
                      <span className="text-xl font-black text-gray-900">
                        {row.value}
                      </span>
                    </div>
                    <div className="h-4 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${row.total > 0 ? (row.value / row.total) * 100 : 0}%`,
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full ${row.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChefAnalyticsContent;
