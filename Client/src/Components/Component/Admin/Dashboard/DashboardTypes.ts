import type { IUserOrder } from "../../../../types/order";

export type TimeFilter = "today" | "week" | "month" | "all";

export interface DashboardStats {
    totalOrders: number;
    placed: number;
    inKitchen: number;
    ready: number;
    served: number;
    assigned: number;
    serving: number;
    cancelled: number;
    totalRevenue: number;
    totalReviews: number;
    avgRating: number;
}

export const STATUS_COLORS: Record<string, string> = {
    PLACED: "#f59e0b",
    IN_KITCHEN: "#8b5cf6",
    ASSIGNED: "#06b6d4",
    READY: "#10b981",
    SERVED: "#3b82f6",
    SERVING: "#6366f1",
    CANCELLED: "#ef4444",
};

export const STATUS_LABELS: Record<string, string> = {
    PLACED: "Placed",
    IN_KITCHEN: "In Kitchen",
    ASSIGNED: "Assigned",
    READY: "Ready",
    SERVED: "Served",
    SERVING: "Serving",
    CANCELLED: "Cancelled",
};

export const CHART_COLORS = ["#f59e0b", "#8b5cf6", "#06b6d4", "#10b981", "#3b82f6", "#6366f1", "#ef4444"];

export const ORDERS_PER_PAGE = 10;

export const filterByTime = (orders: IUserOrder[], filter: TimeFilter): IUserOrder[] => {
    if (filter === "all") return orders;
    const now = new Date();
    return orders.filter((order) => {
        const d = new Date(order.createdAt);
        if (filter === "today") return d.toDateString() === now.toDateString();
        if (filter === "week") {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return d >= weekAgo;
        }
        if (filter === "month") {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return d >= monthAgo;
        }
        return true;
    });
};
