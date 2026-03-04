import React from "react";
import {
    BarChart3,
    IndianRupee,
    TrendingUp,
    Star,
} from "lucide-react";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    LineChart,
    Line,
    BarChart,
    Bar,
} from "recharts";
import { ChartTooltip } from "./ChartComponents";
import type{ DashboardStats } from "./DashboardTypes";

interface ChartsSectionProps {
    statusChartData: any[];
    revenueChartData: any[];
    ordersTrendData: any[];
    ratingDistribution: any[];
    stats: DashboardStats;
    totalRatingsCount: number;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({
    statusChartData,
    revenueChartData,
    ordersTrendData,
    ratingDistribution,
    stats,
    totalRatingsCount,
}) => {
    return (
        <>
            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Orders by Status - Pie Chart */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                    <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-400" />
                        Orders by Status
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">Distribution of current order statuses</p>
                    {statusChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={statusChartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    dataKey="value"
                                    nameKey="name"
                                    paddingAngle={3}
                                    stroke="none"
                                >
                                    {statusChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<ChartTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    iconType="circle"
                                    iconSize={8}
                                    formatter={(value: string) => (
                                        <span className="text-xs text-gray-400 ml-1">{value}</span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[280px] flex items-center justify-center text-gray-600 text-sm">
                            No order data available
                        </div>
                    )}
                </div>

                {/* Revenue Chart */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                    <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                        <IndianRupee className="w-5 h-5 text-green-400" />
                        Revenue Trend
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">Daily revenue over the selected period</p>
                    {revenueChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={revenueChartData}>
                                <defs>
                                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                                <Tooltip content={<ChartTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    name="Revenue (₹)"
                                    stroke="#10b981"
                                    strokeWidth={2.5}
                                    fill="url(#revenueGrad)"
                                    dot={{ r: 3, fill: "#10b981" }}
                                    activeDot={{ r: 5, strokeWidth: 0 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[280px] flex items-center justify-center text-gray-600 text-sm">
                            No revenue data available
                        </div>
                    )}
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Orders Trend */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                    <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-400" />
                        Orders Trend
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">Number of orders per day</p>
                    {ordersTrendData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={ordersTrendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip content={<ChartTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="orders"
                                    name="Orders"
                                    stroke="#6366f1"
                                    strokeWidth={2.5}
                                    dot={{ r: 4, fill: "#6366f1", stroke: "#111827", strokeWidth: 2 }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[280px] flex items-center justify-center text-gray-600 text-sm">
                            No orders data available
                        </div>
                    )}
                </div>

                {/* Reviews Overview */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                    <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400" />
                        Reviews Overview
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">Rating distribution across all items</p>
                    <div className="flex items-center gap-6 mb-4 pb-4 border-b border-gray-800">
                        <div className="text-center">
                            <p className="text-3xl font-black text-yellow-400">
                                {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "–"}
                            </p>
                            <p className="text-xs text-gray-500">Avg Rating</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-black text-indigo-400">{stats.totalReviews}</p>
                            <p className="text-xs text-gray-500">Total Reviews</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-black text-gray-300">{totalRatingsCount}</p>
                            <p className="text-xs text-gray-500">Rated Items</p>
                        </div>
                    </div>
                    {ratingDistribution.some((r) => r.count > 0) ? (
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={ratingDistribution} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <YAxis type="category" dataKey="stars" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} width={40} />
                                <Tooltip content={<ChartTooltip />} />
                                <Bar dataKey="count" name="Reviews" radius={[0, 6, 6, 0]} barSize={16}>
                                    {ratingDistribution.map((_, i) => (
                                        <Cell key={i} fill={["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"][i]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[180px] flex items-center justify-center text-gray-600 text-sm">
                            No review data available
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ChartsSection;
