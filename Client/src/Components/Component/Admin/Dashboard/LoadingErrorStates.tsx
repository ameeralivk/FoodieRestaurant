import React from "react";
import { Loader2, AlertCircle } from "lucide-react";

export const LoadingState: React.FC = () => (
    <div className="min-h-[500px] flex flex-col items-center justify-center gap-4 bg-black">
        <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
        <p className="text-gray-400 font-medium">Loading dashboard data…</p>
    </div>
);

export const ErrorState: React.FC<{ message: string }> = ({ message }) => (
    <div className="min-h-[500px] flex flex-col items-center justify-center gap-4 bg-black">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-red-400 font-semibold text-lg">Something went wrong</p>
        <p className="text-gray-500 text-sm max-w-md text-center">{message}</p>
    </div>
);
