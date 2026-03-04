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