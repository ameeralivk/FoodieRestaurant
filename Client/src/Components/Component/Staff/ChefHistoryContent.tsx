import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTotalOrders } from "../../../services/staffService";
import { useSelector } from "react-redux";
import type{ RootState } from "../../../redux/store/store";
import type{ IUserOrder } from "../../../types/order";
import { History, Calendar, CheckCircle } from "lucide-react";

const ChefHistoryContent = () => {
    const [filter, setFilter] = useState<"today" | "week" | "month" | "all">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const userId = useSelector((state: RootState) => state.userAuth.user?._id);
    const restaurantId = useSelector((state: RootState) => state.userAuth.user?.restaurantId);

    const { data, isLoading } = useQuery<{ success: boolean; data: IUserOrder[] }>({
        queryKey: ["orders", userId, "history"],
        queryFn: () => getTotalOrders(restaurantId as string),
        enabled: !!restaurantId,
    });

    const getFilteredItems = () => {
        if (!data?.data || !userId) return [];

        // Flatten to items that belong to this chef and were prepared or ready
        const allItems = data.data.flatMap(order =>
            order.items
                .filter(item => item.assignedCookId === userId && (item.itemStatus === "READY" || item.itemStatus === "PREPARING" || item.itemStatus === "SERVING"))
                .map(item => ({
                    ...item,
                    orderId: order.orderId,
                    tableId: order.tableId,
                    orderCreatedAt: order.createdAt,
                    orderUpdatedAt: order.updatedAt
                }))
        );

        const now = new Date();
        return allItems.filter(item => {
            const itemDate = new Date(item.orderUpdatedAt || item.orderCreatedAt);
            if (filter === "all") return true;
            if (filter === "today") {
                return itemDate.toDateString() === now.toDateString();
            }
            if (filter === "week") {
                const lastWeek = new Date();
                lastWeek.setDate(lastWeek.getDate() - 7);
                return itemDate >= lastWeek;
            }
            if (filter === "month") {
                const lastMonth = new Date();
                lastMonth.setMonth(lastMonth.getMonth() - 1);
                return itemDate >= lastMonth;
            }
            return true;
        }).sort((a, b) => new Date(b.orderUpdatedAt || b.orderCreatedAt).getTime() - new Date(a.orderUpdatedAt || a.orderCreatedAt).getTime());
    };

    const historyItems = getFilteredItems();

    // Pagination
    const totalPages = Math.ceil(historyItems.length / itemsPerPage);
    const paginatedItems = historyItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset to page 1 when filter changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    return (
        <div className="max-w-7xl mx-auto px-6 pb-8 pt-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <History className="w-6 h-6 text-emerald-600" />
                    Task History
                </h2>
                <div className="flex gap-2 bg-white p-1 rounded-lg border shadow-sm">
                    {["today", "week", "month", "all"].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === f ? "bg-emerald-100 text-emerald-700" : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="min-h-[400px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col h-full min-h-[500px]">
                    {historyItems.length === 0 ? (
                        <div className="text-center py-16 flex-grow flex flex-col items-center justify-center">
                            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium pb-2">No history found for this period.</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto flex-grow">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b">
                                            <th className="px-6 py-4 font-semibold text-sm text-gray-600">Item</th>
                                            <th className="px-6 py-4 font-semibold text-sm text-gray-600">Order / Table</th>
                                            <th className="px-6 py-4 font-semibold text-sm text-gray-600">Status</th>
                                            <th className="px-6 py-4 font-semibold text-sm text-gray-600">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedItems.map((item, idx) => (
                                            <tr key={idx} className="border-b hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold shrink-0">
                                                            {item.quantity}x
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-900">{item.itemName}</div>
                                                            {item.variant && <div className="text-xs text-gray-500">{item.variant.option}</div>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{item.orderId}</div>
                                                    <div className="text-sm text-gray-500">Table {item.tableId}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                        {item.itemStatus}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                    {new Date(item.orderUpdatedAt || item.orderCreatedAt).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
                                    <div className="text-sm text-gray-500">
                                        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, historyItems.length)}</span> of <span className="font-medium">{historyItems.length}</span> results
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1.5 rounded-md text-sm font-medium border bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Previous
                                        </button>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: totalPages }).map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentPage(i + 1)}
                                                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${currentPage === i + 1
                                                            ? "bg-emerald-600 text-white"
                                                            : "border bg-white text-gray-600 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-1.5 rounded-md text-sm font-medium border bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChefHistoryContent

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useQuery } from "@tanstack/react-query";
// import { getTotalOrders } from "../../../services/staffService";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../redux/store/store";
// import type { IUserOrder } from "../../../types/order";
// import {
//   History,
//   CheckCircle,
//   ChefHat,
//   ChevronLeft,
//   ChevronRight,
//   Clock,
//   Hash,
//   MapPin,
//   Package,
// } from "lucide-react";

// const ChefHistoryContent = () => {
//   const [filter, setFilter] = useState<"today" | "week" | "month" | "all">(
//     "today",
//   );
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;
//   const userId = useSelector((state: RootState) => state.userAuth.user?._id);
//   const restaurantId = useSelector(
//     (state: RootState) => state.userAuth.user?.restaurantId,
//   );

//   const { data, isLoading } = useQuery<{
//     success: boolean;
//     data: IUserOrder[];
//   }>({
//     queryKey: ["orders", userId, "chef-history"],
//     queryFn: () => getTotalOrders(restaurantId as string),
//     enabled: !!restaurantId,
//   });

//   const getFilteredItems = () => {
//     if (!data?.data || !userId) return [];

//     const allChefItems = data.data.flatMap((order) =>
//       order.items
//         .filter(
//           (item) =>
//             item.assignedCookId === userId &&
//             (item.itemStatus === "READY" ||
//               item.itemStatus === "SERVING" ||
//               order.orderStatus === "SERVED"),
//         )
//         .map((item) => ({
//           ...item,
//           orderId: order.orderId,
//           tableId: order.tableId,
//           orderUpdatedAt: order.updatedAt || order.createdAt,
//         })),
//     );

//     const now = new Date();
//     return allChefItems
//       .filter((item) => {
//         const itemDate = new Date(item.orderUpdatedAt);
//         if (filter === "all") return true;
//         if (filter === "today")
//           return itemDate.toDateString() === now.toDateString();
//         if (filter === "week") {
//           const lw = new Date();
//           lw.setDate(lw.getDate() - 7);
//           return itemDate >= lw;
//         }
//         if (filter === "month") {
//           const lm = new Date();
//           lm.setMonth(lm.getMonth() - 1);
//           return itemDate >= lm;
//         }
//         return true;
//       })
//       .sort(
//         (a, b) =>
//           new Date(b.orderUpdatedAt).getTime() -
//           new Date(a.orderUpdatedAt).getTime(),
//       );
//   };

//   const historyItems = getFilteredItems();
//   const totalPages = Math.ceil(historyItems.length / itemsPerPage);
//   const paginatedItems = historyItems.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage,
//   );

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [filter]);

//   return (
//     <div className="max-w-7xl mx-auto px-6 pb-12 pt-4">
//       {/* Header / Filter Section */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
//         <div>
//           <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
//             <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-xl shadow-emerald-200 ring-4 ring-emerald-50">
//               <History className="w-8 h-8" />
//             </div>
//             Kitchen <span className="text-emerald-600">Archive</span>
//           </h2>
//           <p className="text-gray-500 font-medium mt-2 ml-1">
//             Historical review of your prepared dishes
//           </p>
//         </div>

//         <div className="flex bg-gray-100/80 backdrop-blur-md p-1.5 rounded-2xl border border-gray-200 shadow-sm transition-all">
//           {["today", "week", "month", "all"].map((f) => (
//             <button
//               key={f}
//               onClick={() => setFilter(f as any)}
//               className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all duration-300 capitalize ${
//                 filter === f
//                   ? "bg-white text-emerald-600 shadow-xl scale-105 border border-emerald-50"
//                   : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
//               }`}
//             >
//               {f}
//             </button>
//           ))}
//         </div>
//       </div>

//       {isLoading ? (
//         <div className="min-h-[500px] flex flex-col items-center justify-center gap-4 bg-white/50 rounded-[3rem] border border-gray-100">
//           <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
//           <p className="text-xs font-black text-gray-400 animate-pulse tracking-widest uppercase italic">
//             Fetching Kitchen Logs...
//           </p>
//         </div>
//       ) : (
//         <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-gray-200 border border-gray-100 overflow-hidden flex flex-col h-full ring-8 ring-gray-50/50 min-h-[600px]">
//           {historyItems.length === 0 ? (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className="text-center py-32 flex-grow flex flex-col items-center justify-center px-6"
//             >
//               <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
//                 <ChefHat className="w-12 h-12 text-gray-200" />
//               </div>
//               <h3 className="text-2xl font-black text-gray-900 mb-2">
//                 Service Idle
//               </h3>
//               <p className="text-gray-400 font-medium max-w-xs mx-auto italic text-center">
//                 No prepared items found in this timeline. Complete your assigned
//                 tasks to populate this archive.
//               </p>
//             </motion.div>
//           ) : (
//             <>
//               <div className="overflow-x-auto flex-grow px-8 pt-8">
//                 <table className="w-full text-left border-separate border-spacing-y-4">
//                   <thead>
//                     <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
//                       <th className="px-6 pb-4">Culinary Task</th>
//                       <th className="px-6 pb-4">Origin Table</th>
//                       <th className="px-6 pb-4">Portion</th>
//                       <th className="px-6 pb-4">Verification</th>
//                       <th className="px-6 pb-4 text-center">Finalized</th>
//                     </tr>
//                   </thead>
//                   <tbody className="space-y-4">
//                     <AnimatePresence mode="popLayout">
//                       {paginatedItems.map((item, idx) => (
//                         <motion.tr
//                           key={idx}
//                           initial={{ opacity: 0, x: -20 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           transition={{ delay: idx * 0.05 }}
//                           className="group hover:bg-gray-50 transition-all duration-300"
//                         >
//                           <td className="px-6 py-6 border-y border-l bg-white group-hover:bg-emerald-50/30 rounded-l-[2rem] border-gray-50 group-hover:border-emerald-100 shadow-sm transition-all max-w-[200px]">
//                             <div className="flex flex-col">
//                               <div className="flex items-center gap-2 mb-1.5">
//                                 <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-white transition-colors">
//                                   <ChefHat className="w-3.5 h-3.5" />
//                                 </div>
//                                 <span className="text-sm font-black text-gray-900 group-hover:text-emerald-700 transition-colors truncate">
//                                   {item.itemName}
//                                 </span>
//                               </div>
//                               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic flex items-center gap-1">
//                                 <Hash className="w-2.5 h-2.5" />
//                                 {item.orderId.slice(-8).toUpperCase()}
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-6 py-6 border-y bg-white group-hover:bg-emerald-50/30 border-gray-50 group-hover:border-emerald-100 shadow-sm transition-all text-center">
//                             <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl font-black text-xs border border-emerald-100 shadow-sm">
//                               <MapPin className="w-3.5 h-3.5" />
//                               Table {item.tableId}
//                             </div>
//                           </td>
//                           <td className="px-6 py-6 border-y bg-white group-hover:bg-emerald-50/30 border-gray-50 group-hover:border-emerald-100 shadow-sm transition-all">
//                             <div className="flex items-center gap-2">
//                               <Package className="w-4 h-4 text-gray-300" />
//                               <span className="text-lg font-black text-gray-900">
//                                 {item.quantity} Qty
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-6 py-6 border-y bg-white group-hover:bg-emerald-50/30 border-gray-50 group-hover:border-emerald-100 shadow-sm transition-all">
//                             <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-[9px] font-black text-emerald-700 uppercase tracking-widest rounded-xl border border-emerald-100">
//                               <CheckCircle className="w-3 h-3" />
//                               {item.itemStatus}
//                             </div>
//                           </td>
//                           <td className="px-6 py-6 border-y border-r bg-white group-hover:bg-emerald-50/30 rounded-r-[2rem] border-gray-50 group-hover:border-emerald-100 shadow-sm transition-all text-right">
//                             <div className="flex flex-col items-end">
//                               <div className="flex items-center gap-2 font-black text-gray-900 text-sm mb-1.5">
//                                 <Clock className="w-3.5 h-3.5 text-orange-500" />
//                                 {new Date(
//                                   item.orderUpdatedAt,
//                                 ).toLocaleTimeString([], {
//                                   hour: "2-digit",
//                                   minute: "2-digit",
//                                 })}
//                               </div>
//                               <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">
//                                 {new Date(item.orderUpdatedAt).toDateString()}
//                               </span>
//                             </div>
//                           </td>
//                         </motion.tr>
//                       ))}
//                     </AnimatePresence>
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination Architecture */}
//               {totalPages > 1 && (
//                 <div className="flex flex-col sm:flex-row items-center justify-between px-10 py-10 gap-6">
//                   <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic">
//                     Showing{" "}
//                     <span className="text-emerald-600">
//                       {(currentPage - 1) * itemsPerPage + 1}-
//                       {Math.min(
//                         currentPage * itemsPerPage,
//                         historyItems.length,
//                       )}
//                     </span>{" "}
//                     of {historyItems.length} Culinary Logs
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <button
//                       onClick={() =>
//                         setCurrentPage((prev) => Math.max(prev - 1, 1))
//                       }
//                       disabled={currentPage === 1}
//                       className="p-3.5 bg-gray-50 text-gray-400 rounded-2xl hover:bg-emerald-600 hover:text-white disabled:opacity-30 disabled:hover:bg-gray-50 transition-all duration-300 shadow-sm group/btn"
//                     >
//                       <ChevronLeft className="w-6 h-6 group-hover/btn:-translate-x-1 transition-transform" />
//                     </button>

//                     <div className="flex items-center gap-2.5">
//                       {Array.from({ length: totalPages }).map((_, i) => (
//                         <button
//                           key={i}
//                           onClick={() => setCurrentPage(i + 1)}
//                           className={`w-12 h-12 flex items-center justify-center rounded-2xl text-xs font-black transition-all duration-300 ${
//                             currentPage === i + 1
//                               ? "bg-emerald-600 text-white shadow-xl shadow-emerald-200 scale-110 border border-emerald-400/20"
//                               : "bg-white border border-gray-100 text-gray-400 hover:text-emerald-600 hover:bg-gray-50 shadow-sm"
//                           }`}
//                         >
//                           {i + 1}
//                         </button>
//                       ))}
//                     </div>

//                     <button
//                       onClick={() =>
//                         setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//                       }
//                       disabled={currentPage === totalPages}
//                       className="p-3.5 bg-gray-50 text-gray-400 rounded-2xl hover:bg-emerald-600 hover:text-white disabled:opacity-30 disabled:hover:bg-gray-50 transition-all duration-300 shadow-sm group/btn"
//                     >
//                       <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChefHistoryContent;
