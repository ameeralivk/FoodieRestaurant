import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTotalOrders } from "../../../services/staffService";
import { useSelector } from "react-redux";
import type{ RootState } from "../../../redux/store/store";
import type{ IUserOrder } from "../../../types/order";
import { Calendar, CheckCircle, Clock, Truck, TrendingUp } from "lucide-react";

const StaffAnalyticsContent = () => {
    const [filter, setFilter] = useState<"today" | "week" | "month" | "all">("today");
    const userId = useSelector((state: RootState) => state.userAuth.user?._id);
    const restaurantId = useSelector((state: RootState) => state.userAuth.user?.restaurantId);

    const { data, isLoading } = useQuery<{ success: boolean; data: IUserOrder[] }>({
        queryKey: ["orders", userId, "staff-analytics"],
        queryFn: () => getTotalOrders(restaurantId as string),
        enabled: !!restaurantId,
    });

    const stats = useMemo(() => {
        if (!data?.data || !userId) return { total: 0, pending: 0, served: 0, completionRate: 0, revenue: 0 };

        const now = new Date();
        // Orders assigned to this staff member
        const myOrders = data.data.filter(order => order.assignedByStaffId === userId);

        const filtered = myOrders.filter(order => {
            const itemDate = new Date(order.updatedAt || order.createdAt);
            if (filter === "today") return itemDate.toDateString() === now.toDateString();
            if (filter === "week") {
                const d = new Date(); d.setDate(d.getDate() - 7); return itemDate >= d;
            }
            if (filter === "month") {
                const d = new Date(); d.setMonth(d.getMonth() - 1); return itemDate >= d;
            }
            return true;
        });

        const servedCount = filtered.filter(o => o.orderStatus === "SERVED").length;
        const pendingCount = filtered.filter(o => o.orderStatus !== "SERVED").length;
        const totalCount = filtered.length;

        // Revenue handled (optional fun metric for delivery staff)
        const revenue = filtered.filter(o => o.orderStatus === "SERVED").reduce((acc, order) => acc + order.totalAmount, 0);

        // Performance Score
        const completionRate = totalCount > 0 ? Math.round((servedCount / totalCount) * 100) : 0;

        return { total: totalCount, pending: pendingCount, served: servedCount, completionRate, revenue };
    }, [data, userId, filter]);

    const cards = [
        { title: "Total Assignments", value: stats.total, icon: Truck, color: "text-blue-600", bg: "bg-blue-100" },
        { title: "Deliveries Served", value: stats.served, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100" },
        { title: "Active / Queued", value: stats.pending, icon: Clock, color: "text-orange-600", bg: "bg-orange-100" },
        { title: "Completion Rate", value: `${stats.completionRate}%`, icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-100" },
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 pb-8 pt-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Delivery Analytics</h2>
                    <p className="text-gray-500">Monitor your task assignments and performance metrics</p>
                </div>

                <div className="flex bg-white rounded-lg border shadow-sm overflow-hidden p-1">
                    {["today", "week", "month", "all"].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-2 text-sm font-semibold capitalize rounded-md transition-all outline-none ${filter === f ? "bg-blue-600 text-white shadow" : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="min-h-[400px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {cards.map((card, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 border shadow-sm flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                    <card.icon className={`w-24 h-24 ${card.color}`} />
                                </div>
                                <div className="flex items-center gap-4 mb-4 relative z-10">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg}`}>
                                        <card.icon className={`w-6 h-6 ${card.color}`} />
                                    </div>
                                    <h3 className="font-semibold text-gray-500">{card.title}</h3>
                                </div>
                                <div className="text-4xl font-black text-gray-900 relative z-10">
                                    {card.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Visual Bar Chart Box */}
                        <div className="bg-white rounded-2xl border shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-4 mb-6">Delivery Progress</h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-semibold text-gray-700">Successfully Served</span>
                                        <span className="text-emerald-600 font-bold">{stats.served}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                                        <div className="bg-emerald-500 h-4 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${stats.total ? (stats.served / stats.total) * 100 : 0}%` }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-semibold text-gray-700">Pending Operations</span>
                                        <span className="text-orange-500 font-bold">{stats.pending}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                                        <div className="bg-amber-500 h-4 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${stats.total ? (stats.pending / stats.total) * 100 : 0}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* General Highlights */}
                        <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/5 pattern-dots pointer-events-none"></div>
                            <h3 className="text-lg font-bold border-b border-indigo-700 pb-4 mb-6 relative z-10">Quick Highlights</h3>

                            <div className="space-y-6 relative z-10">
                                <div className="flex items-start gap-4">
                                    <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                        <TrendingUp className="w-6 h-6 text-indigo-300" />
                                    </div>
                                    <div>
                                        <h4 className="text-indigo-200 text-sm font-medium">Order Subtotal Handled</h4>
                                        <p className="text-2xl font-bold mt-1 text-white">₹{stats.revenue.toLocaleString()}</p>
                                        <p className="text-indigo-300 text-xs mt-1">Sum of all successfully served orders</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                        <Calendar className="w-6 h-6 text-blue-300" />
                                    </div>
                                    <div>
                                        <h4 className="text-indigo-200 text-sm font-medium">Selected Frame</h4>
                                        <p className="text-xl font-bold mt-1 text-white capitalize">{filter}s Analysis</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffAnalyticsContent

// import { useState, useMemo } from "react";
// import { motion } from "framer-motion";
// import { useQuery } from "@tanstack/react-query";
// import { getTotalOrders } from "../../../services/staffService";
// import { useSelector } from "react-redux";
// import type{ RootState } from "../../../redux/store/store";
// import type{ IUserOrder } from "../../../types/order";
// import {
//   Truck,
//   CheckCircle,
//   Clock,
//   Zap,
//   Trophy,
//   Coins,
//   ChevronRight,
//   Target,
//   BarChart3,
// } from "lucide-react";

// // Circular Progress Component
// const CircularProgress = ({
//   value,
//   color,
//   size = 120,
//   label,
// }: {
//   value: number;
//   color: string;
//   size?: number;
//   label: string;
// }) => {
//   const radius = (size - 10) / 2;
//   const circumference = radius * 2 * Math.PI;
//   const offset = circumference - (value / 100) * circumference;

//   return (
//     <div
//       className="relative flex items-center justify-center"
//       style={{ width: size, height: size }}
//     >
//       <svg width={size} height={size} className="transform -rotate-90">
//         <circle
//           cx={size / 2}
//           cy={size / 2}
//           r={radius}
//           stroke="currentColor"
//           strokeWidth="10"
//           fill="transparent"
//           className="text-gray-100 dark:text-gray-800"
//         />
//         <motion.circle
//           initial={{ strokeDashoffset: circumference }}
//           animate={{ strokeDashoffset: offset }}
//           transition={{ duration: 1.5, ease: "easeOut" }}
//           cx={size / 2}
//           cy={size / 2}
//           r={radius}
//           stroke="currentColor"
//           strokeWidth="10"
//           fill="transparent"
//           strokeDasharray={circumference}
//           className={color}
//           strokeLinecap="round"
//         />
//       </svg>
//       <div className="absolute flex flex-col items-center">
//         <span className="text-3xl font-black text-gray-900 leading-none">
//           {value}%
//         </span>
//         <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest mt-1 italic">
//           {label}
//         </span>
//       </div>
//     </div>
//   );
// };

// const StaffAnalyticsContent = () => {
//   const [filter, setFilter] = useState<"today" | "week" | "month" | "all">(
//     "today",
//   );
//   const userId = useSelector((state: RootState) => state.userAuth.user?._id);
//   const restaurantId = useSelector(
//     (state: RootState) => state.userAuth.user?.restaurantId,
//   );

//   const { data, isLoading } = useQuery<{
//     success: boolean;
//     data: IUserOrder[];
//   }>({
//     queryKey: ["orders", userId, "staff-analytics"],
//     queryFn: () => getTotalOrders(restaurantId as string),
//     enabled: !!restaurantId,
//   });

//   const stats = useMemo(() => {
//     if (!data?.data || !userId)
//       return { total: 0, pending: 0, served: 0, completionRate: 0, revenue: 0 };

//     const now = new Date();
//     const myOrders = data.data.filter(
//       (order) => order.assignedByStaffId === userId,
//     );

//     const filtered = myOrders.filter((order) => {
//       const itemDate = new Date(order.updatedAt || order.createdAt);
//       if (filter === "all") return true;
//       if (filter === "today")
//         return itemDate.toDateString() === now.toDateString();
//       if (filter === "week") {
//         const d = new Date();
//         d.setDate(d.getDate() - 7);
//         return itemDate >= d;
//       }
//       if (filter === "month") {
//         const d = new Date();
//         d.setMonth(d.getMonth() - 1);
//         return itemDate >= d;
//       }
//       return true;
//     });

//     const servedCount = filtered.filter(
//       (o) => o.orderStatus === "SERVED",
//     ).length;
//     const pendingCount = filtered.filter(
//       (o) => o.orderStatus !== "SERVED",
//     ).length;
//     const totalCount = filtered.length;
//     const revenue = filtered
//       .filter((o) => o.orderStatus === "SERVED")
//       .reduce((acc, order) => acc + order.totalAmount, 0);
//     const completionRate =
//       totalCount > 0 ? Math.round((servedCount / totalCount) * 100) : 0;

//     return {
//       total: totalCount,
//       pending: pendingCount,
//       served: servedCount,
//       completionRate,
//       revenue,
//     };
//   }, [data, userId, filter]);

//   const cards = [
//     {
//       title: "Total Jobs",
//       value: stats.total,
//       icon: Truck,
//       color: "blue",
//       gradient: "from-blue-600 to-indigo-800",
//       label: "Workload",
//     },
//     {
//       title: "Orders Served",
//       value: stats.served,
//       icon: CheckCircle,
//       color: "emerald",
//       gradient: "from-emerald-500 to-teal-700",
//       label: "Reliability",
//     },
//     {
//       title: "Active Orders",
//       value: stats.pending,
//       icon: Clock,
//       color: "orange",
//       gradient: "from-orange-500 to-amber-600",
//       label: "Pipeline",
//     },
//     {
//       title: "Revenue Flow",
//       value: `₹${stats.revenue.toLocaleString()}`,
//       icon: Coins,
//       color: "purple",
//       gradient: "from-purple-600 to-violet-800",
//       label: "Efficiency",
//     },
//   ];

//   return (
//     <div className="max-w-7xl mx-auto px-6 pb-12 pt-4">
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
//         <div>
//           <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
//             <div className="p-3.5 bg-indigo-600 rounded-3xl text-white shadow-2xl shadow-indigo-200 ring-4 ring-indigo-50">
//               <BarChart3 className="w-8 h-8" />
//             </div>
//             Delivery <span className="text-indigo-600">Intelligence</span>
//           </h2>
//           <p className="text-gray-500 font-medium mt-2 ml-1">
//             Advanced metrics for your service performance
//           </p>
//         </div>

//         <div className="flex bg-gray-100/70 backdrop-blur-lg p-1.5 rounded-2xl border border-gray-200/50 shadow-inner">
//           {["today", "week", "month", "all"].map((f) => (
//             <button
//               key={f}
//               onClick={() => setFilter(f as any)}
//               className={`px-7 py-3 rounded-xl text-xs font-black transition-all duration-300 capitalize ${
//                 filter === f
//                   ? "bg-white text-indigo-600 shadow-xl scale-105 border border-indigo-50"
//                   : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/40"
//               }`}
//             >
//               {f}
//             </button>
//           ))}
//         </div>
//       </div>

//       {isLoading ? (
//         <div className="min-h-[500px] flex flex-col items-center justify-center gap-5 bg-white/50 rounded-[3.5rem] border border-gray-100">
//           <div className="relative">
//             <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <Truck className="w-8 h-8 text-indigo-600/30" />
//             </div>
//           </div>
//           <p className="text-sm font-black text-gray-400 animate-pulse tracking-[0.3em] uppercase">
//             Processing Data Intelligence...
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-10">
//           {/* Performance Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//             {cards.map((card, i) => (
//               <motion.div
//                 key={card.title}
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: i * 0.1 }}
//                 whileHover={{ y: -8, transition: { duration: 0.2 } }}
//                 className={`relative h-64 overflow-hidden bg-gradient-to-br ${card.gradient} rounded-[2.5rem] p-8 text-white shadow-2xl shadow-${card.color}-200/60 group`}
//               >
//                 <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">
//                   <card.icon className="w-40 h-40 text-white" />
//                 </div>
//                 <div className="relative z-10 flex flex-col h-full">
//                   <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-[1.25rem] flex items-center justify-center mb-auto group-hover:bg-white group-hover:text-gray-900 transition-all duration-300 border border-white/10 shadow-lg">
//                     <card.icon className="w-7 h-7" />
//                   </div>
//                   <div className="space-y-1">
//                     <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 italic mb-1">
//                       {card.label}
//                     </div>
//                     <div className="text-4xl font-black tracking-tight">
//                       {card.value}
//                     </div>
//                     <div className="text-sm font-bold opacity-70 group-hover:opacity-100 transition-opacity">
//                       {card.title}
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>

//           {/* Middle Insights */}
//           <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
//             {/* Service Reliability */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className="bg-white rounded-[3.5rem] p-10 border border-gray-100 shadow-2xl shadow-gray-100/50 flex flex-col items-center justify-center relative overflow-hidden group"
//             >
//               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
//               <div className="mb-10 text-center">
//                 <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
//                   Service Rating
//                 </h3>
//                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest italic">
//                   Reliability Mastery
//                 </p>
//               </div>
//               <CircularProgress
//                 value={stats.completionRate}
//                 color="text-indigo-600"
//                 size={240}
//                 label="Success"
//               />
//               <div className="mt-12 grid grid-cols-2 gap-6 w-full">
//                 <div className="bg-indigo-50/50 rounded-3xl p-5 text-center border border-indigo-100/50">
//                   <div className="text-3xl font-black text-indigo-700 tracking-tight">
//                     {stats.served}
//                   </div>
//                   <div className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mt-1">
//                     Served
//                   </div>
//                 </div>
//                 <div className="bg-gray-50/50 rounded-3xl p-5 text-center border border-gray-100/50">
//                   <div className="text-3xl font-black text-gray-400 tracking-tight">
//                     {stats.total}
//                   </div>
//                   <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">
//                     Assigned
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Revenue Intelligence Hub */}
//             <motion.div
//               initial={{ opacity: 0, x: 30 }}
//               animate={{ opacity: 1, x: 0 }}
//               className="xl:col-span-2 bg-[#0a0c14] rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-100/20 group"
//             >
//               <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:animate-pulse">
//                 <Coins className="w-80 h-80 text-white" />
//               </div>

//               <div className="relative z-10 h-full flex flex-col">
//                 <div className="flex justify-between items-start mb-12">
//                   <div>
//                     <h3 className="text-3xl font-black tracking-tight mb-3">
//                       Revenue Flow Management
//                     </h3>
//                     <p className="text-gray-400 font-medium">
//                       Accumulated value of served orders this {filter}
//                     </p>
//                   </div>
//                   <div className="bg-indigo-500/10 text-indigo-400 p-5 rounded-[1.75rem] border border-indigo-500/20 shadow-xl shadow-indigo-900/40">
//                     <Trophy className="w-10 h-10" />
//                   </div>
//                 </div>

//                 <div className="flex-grow flex flex-col justify-center gap-4">
//                   <div className="text-xs font-black uppercase tracking-[0.4em] text-indigo-400 mb-2">
//                     Cumulative Subtotal
//                   </div>
//                   <div className="text-6xl md:text-7xl font-black text-white leading-tight tracking-tighter">
//                     ₹{stats.revenue.toLocaleString()}
//                   </div>
//                   <div className="flex flex-wrap gap-4 mt-8">
//                     <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-5 py-3 rounded-2xl">
//                       <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
//                       <span className="text-sm font-bold text-gray-300">
//                         Target Achievement: Active
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-5 py-3 rounded-2xl">
//                       <Target className="w-4 h-4 text-indigo-400" />
//                       <span className="text-sm font-bold text-gray-300">
//                         Level: Senior Service Host
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-auto pt-10 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 italic">
//                   <span>Sync: Stable 5G</span>
//                   <div className="flex gap-3">
//                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></div>
//                     <span className="text-indigo-500 opacity-80">
//                       Real-time Intelligence
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </div>

//           {/* Bottom Status Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
//             {/* Service Velocity */}
//             <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-2xl shadow-gray-50/50 group">
//               <h3 className="text-xl font-black text-gray-900 mb-10 flex items-center gap-4">
//                 <div className="w-2.5 h-8 bg-indigo-600 rounded-full" />
//                 Service Progression
//               </h3>
//               <div className="space-y-10">
//                 {[
//                   {
//                     label: "Successful Deliveries",
//                     value: stats.served,
//                     total: stats.total,
//                     color: "bg-emerald-500",
//                     icon: CheckCircle,
//                   },
//                   {
//                     label: "Pending Tasks",
//                     value: stats.pending,
//                     total: stats.total,
//                     color: "bg-orange-500",
//                     icon: Clock,
//                   },
//                 ].map((row) => (
//                   <div key={row.label}>
//                     <div className="flex justify-between items-center mb-4">
//                       <div className="flex items-center gap-3">
//                         <row.icon className="w-4 h-4 text-gray-400" />
//                         <span className="text-xs font-black text-gray-600 uppercase tracking-wider">
//                           {row.label}
//                         </span>
//                       </div>
//                       <span className="text-2xl font-black text-gray-900">
//                         {row.value}
//                       </span>
//                     </div>
//                     <div className="h-4.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100 p-1">
//                       <motion.div
//                         initial={{ width: 0 }}
//                         animate={{
//                           width: `${row.total > 0 ? (row.value / row.total) * 100 : 0}%`,
//                         }}
//                         transition={{ duration: 1, ease: "easeOut" }}
//                         className={`h-full ${row.color} rounded-full shadow-lg`}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Performance Mentor */}
//             <div className="bg-indigo-600 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-indigo-300/50 transition-all hover:scale-[1.02]">
//               <div className="absolute -right-16 -top-16 opacity-[0.08] group-hover:rotate-12 transition-transform duration-1000">
//                 <Zap className="w-64 h-64" />
//               </div>
//               <div className="relative z-10 h-full flex flex-col">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
//                     <Target className="w-5 h-5" />
//                   </div>
//                   <h3 className="text-xl font-black italic tracking-wide">
//                     Excellence Mentor
//                   </h3>
//                 </div>
//                 <p className="text-lg text-indigo-50 font-bold leading-relaxed mb-10 italic">
//                   {stats.completionRate > 90
//                     ? "Masterful consistency! Your presence on the floor elevates the entire restaurant. Maintain this zenith."
//                     : stats.completionRate > 70
//                       ? "Strong contribution today. A few more serves will lock in your 'Service Elite' status for this period."
//                       : "Focus on the open tickets, Staff. A sharp mind delivers exceptional service. You've got this."}
//                 </p>
//                 <button className="mt-auto w-full py-5 bg-white text-indigo-900 font-black rounded-2xl shadow-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 group/btn">
//                   View Full Career Progress
//                   <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1.5 transition-transform" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


// export default StaffAnalyticsContent
