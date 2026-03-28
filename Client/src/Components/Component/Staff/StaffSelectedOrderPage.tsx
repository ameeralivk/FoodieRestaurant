

import React, { useState, useEffect } from "react";
import StaffOrderCard from "../../Elements/Staff/StaffOrderCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { IUserOrder } from "../../../types/order";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import {
  changeOrderStatus,
  getTotalOrders,
  assignOrder,
} from "../../../services/staffService";
import { showSuccessToast } from "../../Elements/SuccessToast";
import { showErrorToast } from "../../Elements/ErrorToast";
import { playSound } from "../../../utils/PlaySound";
import Socket from "../../../socket";
import { ToastContainer } from "react-toastify";
import StaffOrderStats from "../../Elements/Staff/StaffOrderState";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Zap, Package, BarChart3, ChevronRight } from "lucide-react";

const StaffSelectedOrders: React.FC = () => {
  const queryClient = useQueryClient();

  const [currentPage] = useState(1);
  const restaurantId = useSelector(
    (state: RootState) => state.userAuth.user?.restaurantId,
  );
  const [readyOrders, setReadyOrders] = useState<IUserOrder[]>([]);
  const role = useSelector((state: RootState) => state.userAuth.user?.role);
  const staffId = useSelector((state: RootState) => state.userAuth.user?._id);
  const userId = useSelector((state: RootState) => state.userAuth.user?._id);

  const limit = 100;

  const { data, refetch, isLoading } = useQuery<{
    success: boolean;
    data: IUserOrder[];
  }>({
    queryKey: ["orders", userId, currentPage, limit],
    queryFn: () => getTotalOrders(restaurantId as string),
  });

  // ✅ SAME LOGIC (unchanged)
  useEffect(() => {
    if (data?.data) {
      const ready = data.data.filter(
        (o) =>
          o.assignedByStaffId &&
          o.items.every(
            (i) => i.itemStatus === "READY" && o.orderStatus != "SERVED",
          ),
      );

      setReadyOrders(ready);
    }
  }, [data]);

  // ✅ SAME SOCKET LOGIC
  useEffect(() => {
    if (!restaurantId) return;

    Socket.emit("join-restaurant", {
      restaurantId,
      role,
    });

    const handleOrderCompleted = (socketData: {
      order: IUserOrder;
      orderId: string;
      message: string;
    }) => {
      showSuccessToast("New Order is added");
      refetch();
      playSound();

      setReadyOrders((prev) => [...prev, socketData.order]);
    };

    Socket.on("order:completed", handleOrderCompleted);

    return () => {
      Socket.off("order:completed", handleOrderCompleted);
    };
  }, [restaurantId, role, userId, currentPage, limit, queryClient]);

  // ✅ SAME HANDLERS
  const handleServing = async (orderId: string, status: string) => {
    try {
      if (status === "SERVED") return showErrorToast("Order already Served");

      const result = await changeOrderStatus(
        orderId,
        status === "SERVING" ? "SERVED" : "SERVING",
      );

      if (result.success) {
        showSuccessToast("Order Status Changed");
        refetch();
      } else {
        showErrorToast("Failed");
      }
    } catch (error: any) {
      showErrorToast(error.message);
    }
  };

  const handleAssignOrder = async (orderId: string) => {
    try {
      const result = await assignOrder(orderId, staffId as string);
      if (result.success) {
        showSuccessToast("Order Assigned");
        refetch();
      } else {
        showErrorToast("Failed");
      }
    } catch {
      showErrorToast("Failed");
    }
  };

  const isToday = (date?: string | Date) => {
    if (!date) return false;

    const d = new Date(date);
    const t = new Date();

    return (
      d.getFullYear() === t.getFullYear() &&
      d.getMonth() === t.getMonth() &&
      d.getDate() === t.getDate()
    );
  };

  const readyOrder = data?.data.filter(
    (o) => o.orderStatus === "READY" && isToday(o.createdAt),
  );

  const servingOrders = data?.data.filter(
    (o) => o.orderStatus === "SERVING" && isToday(o.createdAt),
  );

  const completedOrders = data?.data.filter(
    (o) => o.orderStatus === "SERVED" && isToday(o.createdAt),
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <StaffOrderStats
        readyCount={readyOrder?.length || 0}
        servingCount={servingOrders?.length || 0}
        completedCount={completedOrders?.length || 0}
      />

      <ToastContainer />

      {/* 🔥 Header UI */}
      <div className="flex justify-between items-center mb-10 mt-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="text-indigo-600" />
            Staff Dashboard
          </h1>
          <p className="text-gray-500 text-sm">Real-time order tracking</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white shadow px-4 py-2 rounded-xl flex items-center gap-2">
            <Package className="text-indigo-500 w-5 h-5" />
            <span className="font-semibold">{readyOrders.length} Active</span>
          </div>

          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold">
            <Zap className="animate-pulse w-4 h-4" />
            LIVE
          </div>
        </div>
      </div>

      {/* 🔥 Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {readyOrders.map((order, idx) => (
            <motion.div
              key={order.orderId}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <StaffOrderCard
                order={order}
                onServing={() =>
                  handleServing(order.orderId, order.orderStatus)
                }
                onAssign={() => handleAssignOrder(order.orderId)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 🔥 Empty State */}
      {readyOrders.length === 0 && !isLoading && (
        <div className="text-center py-20">
          <Truck className="mx-auto text-gray-300 w-16 h-16 mb-4" />
          <h2 className="text-xl font-semibold">No Orders</h2>
          <p className="text-gray-400 text-sm mb-4">
            All orders are completed or processing
          </p>

          <button
            onClick={() => refetch()}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 mx-auto"
          >
            Refresh <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* 🔥 Loader */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default StaffSelectedOrders;
