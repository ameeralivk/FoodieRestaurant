import React from "react";
import {
    ShoppingCart,
    Search,
    X,
    Clock,
    CheckCircle,
    XCircle,
    ChefHat,
    UtensilsCrossed,
    Eye,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import type{ IUserOrder } from "../../../../types/order";
import { STATUS_COLORS, STATUS_LABELS } from "./DashboardTypes";

interface RecentOrdersTableProps {
    paginatedOrders: IUserOrder[];
    sortedOrdersLength: number;
    searchQuery: string;
    onSearch: (value: string) => void;
    onSelectOrder: (order: IUserOrder) => void;
    ordersPage: number;
    setOrdersPage: (page: number | ((p: number) => number)) => void;
    totalPages: number;
}

const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({
    paginatedOrders,
    sortedOrdersLength,
    searchQuery,
    onSearch,
    onSelectOrder,
    ordersPage,
    setOrdersPage,
    totalPages,
}) => {
    return (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5 text-blue-400" />
                            Recent Orders
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                            Showing {paginatedOrders.length} of {sortedOrdersLength} orders
                            {searchQuery && <span className="text-blue-400"> · filtered</span>}
                        </p>
                    </div>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by Order ID or Table No..."
                            value={searchQuery}
                            onChange={(e) => onSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => onSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-800/50">
                            <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                Order ID
                            </th>
                            <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                Table
                            </th>
                            <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                Items
                            </th>
                            <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                Amount
                            </th>
                            <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                Status
                            </th>
                            <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                Time
                            </th>
                            <th className="text-center p-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                View
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedOrders.length > 0 ? (
                            paginatedOrders.map((order) => {
                                const statusStr = order.orderStatus as string;
                                return (
                                    <tr
                                        key={order._id}
                                        className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer"
                                        onClick={() => onSelectOrder(order)}
                                    >
                                        <td className="p-4 font-semibold text-white text-sm">
                                            {order.orderId || order._id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="p-4 text-gray-400 text-sm">
                                            Table {order.tableId}
                                        </td>
                                        <td className="p-4 text-gray-400 text-sm">
                                            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                                        </td>
                                        <td className="p-4 font-semibold text-white text-sm">
                                            ₹{order.totalAmount.toLocaleString("en-IN")}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border"
                                                style={{
                                                    backgroundColor: `${STATUS_COLORS[statusStr] || "#9ca3af"}15`,
                                                    color: STATUS_COLORS[statusStr] || "#9ca3af",
                                                    borderColor: `${STATUS_COLORS[statusStr] || "#9ca3af"}30`,
                                                }}
                                            >
                                                {statusStr === "PLACED" && <Clock className="w-3 h-3 mr-1" />}
                                                {statusStr === "SERVED" && <CheckCircle className="w-3 h-3 mr-1" />}
                                                {statusStr === "CANCELLED" && <XCircle className="w-3 h-3 mr-1" />}
                                                {statusStr === "IN_KITCHEN" && <ChefHat className="w-3 h-3 mr-1" />}
                                                {statusStr === "READY" && <UtensilsCrossed className="w-3 h-3 mr-1" />}
                                                {STATUS_LABELS[statusStr] || statusStr}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500 text-xs">
                                            {new Date(order.createdAt).toLocaleString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onSelectOrder(order); }}
                                                className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                                            >
                                                <Eye className="w-4 h-4 text-gray-400" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-gray-600 text-sm">
                                    No orders found for the selected period
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-gray-800">
                    <button
                        onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                        disabled={ordersPage === 1}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-gray-400 hover:bg-gray-800 hover:text-white"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter((p) => {
                                if (p === 1 || p === totalPages) return true;
                                if (Math.abs(p - (ordersPage as number)) <= 1) return true;
                                return false;
                            })
                            .reduce<(number | string)[]>((acc, p, idx, arr) => {
                                if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push("...");
                                acc.push(p);
                                return acc;
                            }, [])
                            .map((item, idx) =>
                                typeof item === "string" ? (
                                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-600 text-sm">
                                        {item}
                                    </span>
                                ) : (
                                    <button
                                        key={item}
                                        onClick={() => setOrdersPage(item)}
                                        className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${ordersPage === item
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                            }`}
                                    >
                                        {item}
                                    </button>
                                )
                            )}
                    </div>

                    <button
                        onClick={() => setOrdersPage((p) => Math.min(totalPages, (p as number) + 1))}
                        disabled={ordersPage === totalPages}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-gray-400 hover:bg-gray-800 hover:text-white"
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default RecentOrdersTable;
