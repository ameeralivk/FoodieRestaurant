import React from "react";

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    color: string;
    bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color, bgColor }) => (
    <div className="group relative bg-gray-900 rounded-2xl border border-gray-800 p-5 hover:border-gray-700 hover:shadow-lg hover:shadow-black/20 transition-all duration-300 overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
            <div className={`w-full h-full rounded-full ${bgColor}`} />
        </div>
        <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgColor}`}>
                {icon}
            </div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</span>
        </div>
        <p className={`text-3xl font-black ${color}`}>{value}</p>
    </div>
);

export default StatCard;
