import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTotalOrders } from "../../../services/staffService";
import { useSelector } from "react-redux";
import type{ RootState } from "../../../redux/store/store";
import type{ IUserOrder } from "../../../types/order";
import { Calendar, BarChart2, CheckCircle, Clock, CheckSquare } from "lucide-react";

const ChefAnalyticsContent = () => {
    const [filter, setFilter] = useState<"today" | "week" | "month" | "all">("today");
    const userId = useSelector((state: RootState) => state.userAuth.user?._id);
    const restaurantId = useSelector((state: RootState) => state.userAuth.user?.restaurantId);

    const { data, isLoading } = useQuery<{ success: boolean; data: IUserOrder[] }>({
        queryKey: ["orders", userId, "analytics"],
        queryFn: () => getTotalOrders(restaurantId as string),
        enabled: !!restaurantId,
    });

    const stats = useMemo(() => {
        if (!data?.data || !userId) return { total: 0, pending: 0, ready: 0, perfScore: 0, topItem: "-" };

        const now = new Date();
        // Flatten logic
        const allItems = data.data.flatMap(order =>
            order.items
                .filter(item => item.assignedCookId === userId)
                .map(item => ({
                    ...item,
                    orderId: order.orderId,
                    orderUpdatedAt: order.updatedAt || order.createdAt
                }))
        );

        const filtered = allItems.filter(item => {
            const itemDate = new Date(item.orderUpdatedAt);
            if (filter === "today") return itemDate.toDateString() === now.toDateString();
            if (filter === "week") {
                const d = new Date(); d.setDate(d.getDate() - 7); return itemDate >= d;
            }
            if (filter === "month") {
                const d = new Date(); d.setMonth(d.getMonth() - 1); return itemDate >= d;
            }
            return true;
        });

        const readyCount = filtered.filter(i => i.itemStatus === "READY" || i.itemStatus === "SERVING").length;
        const pendingCount = filtered.filter(i => i.itemStatus === "ASSIGNED" || i.itemStatus === "PREPARING").length;
        const totalCount = filtered.length;

        // Most Prepared Item
        const freq: Record<string, number> = {};
        filtered.forEach(i => freq[i.itemName] = (freq[i.itemName] || 0) + 1);
        const topItem = Object.keys(freq).sort((a, b) => freq[b] - freq[a])[0] || "None Yet";

        // Performance Score (rough completion rate)
        const perfScore = totalCount > 0 ? Math.round((readyCount / totalCount) * 100) : 0;

        return { total: totalCount, pending: pendingCount, ready: readyCount, perfScore, topItem };
    }, [data, userId, filter]);

    const cards = [
        { title: "Total Assigned", value: stats.total, icon: BarChart2, color: "text-blue-600", bg: "bg-blue-100" },
        { title: "Prepared / Ready", value: stats.ready, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100" },
        { title: "In Progress", value: stats.pending, icon: Clock, color: "text-orange-600", bg: "bg-orange-100" },
        { title: "Completion Rate", value: `${stats.perfScore}%`, icon: CheckSquare, color: "text-purple-600", bg: "bg-purple-100" },
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 pb-8 pt-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
                    <p className="text-gray-500">Track your kitchen efficiency & order metrics</p>
                </div>

                <div className="flex bg-white rounded-lg border shadow-sm overflow-hidden p-1">
                    {["today", "week", "month", "all"].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-2 text-sm font-semibold capitalize rounded-md transition-all outline-none ${filter === f ? "bg-emerald-600 text-white shadow" : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="min-h-[400px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
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
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-4 mb-6">Status Overview</h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-semibold text-gray-700">Ready</span>
                                        <span className="text-gray-500 font-medium">{stats.ready}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                                        <div className="bg-emerald-500 h-4 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${stats.total ? (stats.ready / stats.total) * 100 : 0}%` }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-semibold text-gray-700">Pending / Preparing</span>
                                        <span className="text-gray-500 font-medium">{stats.pending}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                                        <div className="bg-amber-500 h-4 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${stats.total ? (stats.pending / stats.total) * 100 : 0}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Insights */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/5 pattern-dots pointer-events-none"></div>
                            <h3 className="text-lg font-bold border-b border-gray-700 pb-4 mb-6">Quick Insights</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-gray-400 text-sm font-medium">Top Prepared Item</h4>
                                        <p className="text-xl font-bold mt-1 text-emerald-300">{stats.topItem}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                        <Calendar className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-gray-400 text-sm font-medium">Selected Period</h4>
                                        <p className="text-xl font-bold mt-1 text-blue-300 capitalize">{filter}s Analysis</p>
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


export default ChefAnalyticsContent