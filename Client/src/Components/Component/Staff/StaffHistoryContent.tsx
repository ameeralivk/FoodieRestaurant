import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTotalOrders } from "../../../services/staffService";
import { useSelector } from "react-redux";
import type{ RootState } from "../../../redux/store/store";
import type{ IUserOrder } from "../../../types/order";
import { History, Calendar} from "lucide-react";

const StaffHistoryContent = () => {
    const [filter, setFilter] = useState<"today" | "week" | "month" | "all">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const userId = useSelector((state: RootState) => state.userAuth.user?._id);
    const restaurantId = useSelector((state: RootState) => state.userAuth.user?.restaurantId);

    const { data, isLoading } = useQuery<{ success: boolean; data: IUserOrder[] }>({
        queryKey: ["orders", userId, "staff-history"],
        queryFn: () => getTotalOrders(restaurantId as string),
        enabled: !!restaurantId,
    });

    const getFilteredItems = () => {
        if (!data?.data || !userId) return [];

        // Delivery staff history: orders assigned to them and completed/served
        const staffOrders = data.data.filter(
            order => order.assignedByStaffId === userId && order.orderStatus === "SERVED"
        );

        const now = new Date();
        return staffOrders.filter(order => {
            const itemDate = new Date(order.updatedAt || order.createdAt);
            if (filter === "all") return true;
            if (filter === "today") return itemDate.toDateString() === now.toDateString();
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
        }).sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());
    };

    const historyOrders = getFilteredItems();

    // Pagination
    const totalPages = Math.ceil(historyOrders.length / itemsPerPage);
    const paginatedOrders = historyOrders.slice(
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
                    <History className="w-6 h-6 text-blue-600" />
                    Assignment History
                </h2>
                <div className="flex bg-white p-1 rounded-lg border shadow-sm">
                    {["today", "week", "month", "all"].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === f ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="min-h-[400px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col h-full min-h-[500px]">
                    {historyOrders.length === 0 ? (
                        <div className="text-center py-16 flex-grow flex flex-col items-center justify-center">
                            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium pb-2">No assignment history found.</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto flex-grow">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b">
                                            <th className="px-6 py-4 font-semibold text-sm text-gray-600">Order ID</th>
                                            <th className="px-6 py-4 font-semibold text-sm text-gray-600">Table No</th>
                                            <th className="px-6 py-4 font-semibold text-sm text-gray-600">Items</th>
                                            <th className="px-6 py-4 font-semibold text-sm text-gray-600">Total Price</th>
                                            <th className="px-6 py-4 font-semibold text-sm text-gray-600">Date Completed</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedOrders.map((order) => (
                                            <tr key={order.orderId} className="border-b hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    {order.orderId}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold">
                                                        {order.tableId}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {order.items.length} items
                                                    <span className="block text-xs text-gray-400">
                                                        {order.items.map(i => i.itemName).join(", ").substring(0, 30)}...
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-gray-900">
                                                    ₹{order.totalAmount}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(order.updatedAt || order.createdAt).toLocaleString()}
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
                                        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, historyOrders.length)}</span> of <span className="font-medium">{historyOrders.length}</span> results
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
                                                            ? "bg-blue-600 text-white"
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

export default StaffHistoryContent