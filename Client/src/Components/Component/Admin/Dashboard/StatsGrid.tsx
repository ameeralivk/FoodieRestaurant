import React from "react";
import {
    ShoppingCart,
    Clock,
    ChefHat,
    UtensilsCrossed,
    CheckCircle,
    XCircle,
    IndianRupee,
    MessageSquare,
    Star,
} from "lucide-react";
import StatCard from "./StatCard";
import type{ DashboardStats } from "./DashboardTypes";

interface StatsGridProps {
    stats: DashboardStats;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                <StatCard
                    icon={<ShoppingCart className="w-5 h-5 text-blue-400" />}
                    title="Total Orders"
                    value={stats.totalOrders}
                    color="text-blue-400"
                    bgColor="bg-blue-500/20"
                />
                <StatCard
                    icon={<Clock className="w-5 h-5 text-amber-400" />}
                    title="Placed"
                    value={stats.placed}
                    color="text-amber-400"
                    bgColor="bg-amber-500/20"
                />
                <StatCard
                    icon={<ChefHat className="w-5 h-5 text-violet-400" />}
                    title="In Kitchen"
                    value={stats.inKitchen}
                    color="text-violet-400"
                    bgColor="bg-violet-500/20"
                />
                <StatCard
                    icon={<UtensilsCrossed className="w-5 h-5 text-emerald-400" />}
                    title="Ready"
                    value={stats.ready}
                    color="text-emerald-400"
                    bgColor="bg-emerald-500/20"
                />
                <StatCard
                    icon={<CheckCircle className="w-5 h-5 text-cyan-400" />}
                    title="Served"
                    value={stats.served}
                    color="text-cyan-400"
                    bgColor="bg-cyan-500/20"
                />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    icon={<XCircle className="w-5 h-5 text-red-400" />}
                    title="Cancelled"
                    value={stats.cancelled}
                    color="text-red-400"
                    bgColor="bg-red-500/20"
                />
                <StatCard
                    icon={<IndianRupee className="w-5 h-5 text-green-400" />}
                    title="Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`}
                    color="text-green-400"
                    bgColor="bg-green-500/20"
                />
                <StatCard
                    icon={<MessageSquare className="w-5 h-5 text-indigo-400" />}
                    title="Total Reviews"
                    value={stats.totalReviews}
                    color="text-indigo-400"
                    bgColor="bg-indigo-500/20"
                />
                <StatCard
                    icon={<Star className="w-5 h-5 text-yellow-400" />}
                    title="Avg Rating"
                    value={stats.avgRating > 0 ? stats.avgRating.toFixed(1) + " ★" : "N/A"}
                    color="text-yellow-400"
                    bgColor="bg-yellow-500/20"
                />
            </div>
        </>
    );
};

export default StatsGrid;
