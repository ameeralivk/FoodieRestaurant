import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import type { RootState } from "../../../redux/store/store";
import type { IUserOrder } from "../../../types/order";
import { getTotalOrders } from "../../../services/staffService";
import { getRating, type ItemRating } from "../../../services/feedback";

// Sub-components
import DashboardHeader from "./Dashboard/DashboardHeader";
import StatsGrid from "./Dashboard/StatsGrid";
import ChartsSection from "./Dashboard/ChartsSection";
import RecentOrdersTable from "./Dashboard/RecentOrdersTable";
import OrderDetailModal from "./Dashboard/OrderDetailModal";
import { LoadingState, ErrorState } from "./Dashboard/LoadingErrorStates";

// Types & Constants
import {
  type TimeFilter,
  type DashboardStats,
  STATUS_COLORS,
  STATUS_LABELS,
  ORDERS_PER_PAGE,
  filterByTime,
} from "./Dashboard/DashboardTypes";

// ─── Main Component ─────────────────────────────────────
const DashboardPage: React.FC = () => {
  const [filter, setFilter] = useState<TimeFilter>("all");
  const [ordersPage, setOrdersPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<IUserOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const RestaurantId = useSelector(
    (state: RootState) => state.auth.admin?._id as string
  );

  // Fetch all orders for this restaurant
  const {
    data: ordersRes,
    isLoading: ordersLoading,
    error: ordersError,
  } = useQuery<{ success: boolean; data: IUserOrder[] }>({
    queryKey: ["dashboard-orders", RestaurantId],
    queryFn: () => getTotalOrders(RestaurantId),
    enabled: !!RestaurantId,
    refetchInterval: 30000, // Refresh every 30s
  });

  // Fetch ratings/reviews
  const {
    data: ratingsRes,
    isLoading: ratingsLoading,
    error: ratingsError,
  } = useQuery({
    queryKey: ["dashboard-ratings", RestaurantId],
    queryFn: () => getRating(RestaurantId),
    enabled: !!RestaurantId,
  });

  const allOrders = ordersRes?.data ?? [];
  const ratings: ItemRating[] = ratingsRes?.data ?? [];

  // ─── Derived data ───────────────────────────────────
  const filteredOrders = useMemo(() => filterByTime(allOrders, filter), [allOrders, filter]);

  const stats: DashboardStats = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const placed = filteredOrders.filter((o) => o.orderStatus === "PLACED").length;
    const inKitchen = filteredOrders.filter((o) => o.orderStatus === "IN_KITCHEN").length;
    const ready = filteredOrders.filter((o) => o.orderStatus === "READY").length;
    const served = filteredOrders.filter((o) => o.orderStatus === "SERVED").length;
    const assigned = filteredOrders.filter((o) => o.orderStatus === "ASSIGNED").length;
    const serving = filteredOrders.filter((o) => o.orderStatus === "SERVING").length;
    const cancelled = filteredOrders.filter((o) => (o.orderStatus as string) === "CANCELLED").length;
    const totalRevenue = filteredOrders
      .filter((o) => (o.orderStatus as string) !== "CANCELLED")
      .reduce((sum, o) => sum + o.totalAmount, 0);
    const totalReviews = ratings.reduce((sum, r) => sum + r.totalReviews, 0);
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.avgRating * r.totalReviews, 0) /
        (totalReviews || 1)
        : 0;

    return {
      totalOrders,
      placed,
      inKitchen,
      ready,
      served,
      assigned,
      serving,
      cancelled,
      totalRevenue,
      totalReviews,
      avgRating,
    };
  }, [filteredOrders, ratings]);

  // Orders by Status pie chart data
  const statusChartData = useMemo(() => {
    const statusMap: Record<string, number> = {};
    filteredOrders.forEach((o) => {
      const s = o.orderStatus as string;
      statusMap[s] = (statusMap[s] || 0) + 1;
    });
    return Object.entries(statusMap).map(([status, count]) => ({
      name: STATUS_LABELS[status] || status,
      value: count,
      color: STATUS_COLORS[status] || "#9ca3af",
    }));
  }, [filteredOrders]);

  // Revenue over time (daily aggregation)
  const revenueChartData = useMemo(() => {
    const dayMap: Record<string, number> = {};
    filteredOrders
      .filter((o) => (o.orderStatus as string) !== "CANCELLED")
      .forEach((o) => {
        const date = new Date(o.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        });
        dayMap[date] = (dayMap[date] || 0) + o.totalAmount;
      });
    return Object.entries(dayMap)
      .map(([date, revenue]) => ({ date, revenue: Math.round(revenue) }))
      .slice(-14); // Last 14 data points
  }, [filteredOrders]);

  // Orders Trend (daily count)
  const ordersTrendData = useMemo(() => {
    const dayMap: Record<string, number> = {};
    filteredOrders.forEach((o) => {
      const date = new Date(o.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });
      dayMap[date] = (dayMap[date] || 0) + 1;
    });
    return Object.entries(dayMap)
      .map(([date, orders]) => ({ date, orders }))
      .slice(-14);
  }, [filteredOrders]);

  // Rating distribution (1-5 stars)
  const ratingDistribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0]; // index 0 = 1 star, 4 = 5 star
    ratings.forEach((r) => {
      const bucket = Math.max(0, Math.min(4, Math.round(r.avgRating) - 1));
      dist[bucket] += r.totalReviews;
    });
    return dist.map((count, i) => ({
      stars: `${i + 1} ★`,
      count,
    }));
  }, [ratings]);

  // Sorted + searched orders for table (paginated)
  const sortedOrders = useMemo(() => {
    let orders = [...filteredOrders];
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      orders = orders.filter(
        (o) =>
          (o.orderId || o._id).toLowerCase().includes(q) ||
          o.tableId.toLowerCase().includes(q)
      );
    }
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [filteredOrders, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(sortedOrders.length / ORDERS_PER_PAGE));
  const paginatedOrders = sortedOrders.slice(
    (ordersPage - 1) * ORDERS_PER_PAGE,
    ordersPage * ORDERS_PER_PAGE
  );

  // Reset page when filter or search changes
  const handleFilterChange = (f: TimeFilter) => {
    setFilter(f);
    setOrdersPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setOrdersPage(1);
  };

  // ─── Loading / Error ────────────────────────────────
  const isLoading = ordersLoading || ratingsLoading;
  const errorMsg = ordersError
    ? (ordersError as Error).message
    : ratingsError
      ? (ratingsError as Error).message
      : "";

  if (isLoading) return <LoadingState />;
  if (errorMsg) return <ErrorState message={errorMsg} />;

  // ─── Render ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto">
        <DashboardHeader filter={filter} onFilterChange={handleFilterChange} />

        <StatsGrid stats={stats} />

        <ChartsSection
          statusChartData={statusChartData}
          revenueChartData={revenueChartData}
          ordersTrendData={ordersTrendData}
          ratingDistribution={ratingDistribution}
          stats={stats}
          totalRatingsCount={ratings.length}
        />

        <RecentOrdersTable
          paginatedOrders={paginatedOrders}
          sortedOrdersLength={sortedOrders.length}
          searchQuery={searchQuery}
          onSearch={handleSearch}
          onSelectOrder={setSelectedOrder}
          ordersPage={ordersPage}
          setOrdersPage={setOrdersPage}
          totalPages={totalPages}
        />

        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;