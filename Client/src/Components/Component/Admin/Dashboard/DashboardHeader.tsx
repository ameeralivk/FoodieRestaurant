import React from "react";
import { Activity } from "lucide-react";
import type{ TimeFilter } from "./DashboardTypes";

interface DashboardHeaderProps {
    filter: TimeFilter;
    onFilterChange: (f: TimeFilter) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ filter, onFilterChange }) => {
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
                    <Activity className="w-7 h-7 text-blue-400" />
                    Dashboard Overview
                </h1>
                <p className="text-gray-500 mt-1 text-sm">
                    Monitor orders, revenue, and reviews in real time
                </p>
            </div>

            <div className="flex bg-gray-900 rounded-xl border border-gray-800 p-1 gap-1">
                {(["today", "week", "month", "all"] as TimeFilter[]).map((f) => (
                    <button
                        key={f}
                        onClick={() => onFilterChange(f)}
                        className={`px-4 py-2 text-sm font-semibold capitalize rounded-lg transition-all duration-200 ${filter === f
                                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DashboardHeader;
