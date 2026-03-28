
import React, { useState, useEffect } from "react";
import StaffOrderCard from "../../Elements/Staff/StaffOrderCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { IUserOrder } from "../../../types/order";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import { getTotalOrders, assignOrder } from "../../../services/staffService";
import { showSuccessToast } from "../../Elements/SuccessToast";
import { showErrorToast } from "../../Elements/ErrorToast";
import { playSound } from "../../../utils/PlaySound";
import Socket from "../../../socket";
import { ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

import { Zap, ChevronRight, Bell, ClipboardCheck, ChefHat } from "lucide-react";

const StaffDashboard: React.FC = () => {
  const queryClient = useQueryClient();

  const [currentPage] = useState(1);

  const restaurantId = useSelector(
    (state: RootState) => state.userAuth.user?.restaurantId,
  );
  const role = useSelector((state: RootState) => state.userAuth.user?.role);
  const staffId = useSelector((state: RootState) => state.userAuth.user?._id);
  const userId = useSelector((state: RootState) => state.userAuth.user?._id);

  const limit = 100;

  const [readyOrders, setReadyOrders] = useState<IUserOrder[]>([]);

  // ✅ ORIGINAL QUERY
  const { data, refetch, isLoading } = useQuery<{
    success: boolean;
    data: IUserOrder[];
  }>({
    queryKey: ["orders", userId, currentPage, limit],
    queryFn: () => getTotalOrders(restaurantId as string),
  });

  // ✅ ORIGINAL FILTER LOGIC (fixed item check safely)
  useEffect(() => {
    if (data?.data) {
      const today = new Date().toDateString();

      const ready = data.data.filter((o) => {
        const orderDate = new Date(o.createdAt).toDateString();

        return (
          orderDate === today &&
          o.items.every((item: any) =>
            item.status ? item.status === "READY" : o.orderStatus === "READY",
          )
        );
      });

      setReadyOrders(ready);
    }
  }, [data]);

  // ✅ SOCKET (duplicate-safe)
  useEffect(() => {
    if (!restaurantId) return;

    Socket.emit("join-restaurant", {
      restaurantId,
      role,
    });

    const handleOrderCompleted = (socketData: { order: IUserOrder }) => {
      showSuccessToast("New Order is added");
      playSound();
      refetch();
      setReadyOrders((prev) => {
        const exists = prev.some((o) => o.orderId === socketData.order.orderId);
        return exists ? prev : [...prev, socketData.order];
      });
    };

    Socket.on("order:completed", handleOrderCompleted);

    return () => {
      Socket.off("order:completed", handleOrderCompleted);
    };
  }, [restaurantId, role, userId, currentPage, limit, queryClient]);

  // ✅ ASSIGN LOGIC (unchanged)
  const handleAssignOrder = async (orderId: string) => {
    try {
      const result = await assignOrder(orderId, staffId as string);

      if (result.success) {
        showSuccessToast("Order Assigning Completed");
        refetch();
      } else {
        showErrorToast("Order Assigning Failed");
      }
    } catch (error) {
      showErrorToast("Order Assigning Failed");
    }
  };

  return (
    <div className="max-w-9xl mx-auto px-6 pb-20 pt-4">
      <ToastContainer hideProgressBar autoClose={4000} />

      {/* 🔥 HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <h2 className="text-4xl font-black flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow">
            <Bell className="w-8 h-8" />
          </div>
          <div>
            <div>Available Orders</div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">
              Ready for pickup
            </div>
          </div>
        </h2>

        <div className="flex items-center gap-4">
          <div className="bg-white px-5 py-3 rounded-2xl border flex items-center gap-3 shadow-sm">
            <ClipboardCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-bold">
              {readyOrders.length} Ready
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-blue-50 text-blue-600 px-5 py-3 rounded-2xl text-xs font-bold">
            <Zap className="w-4 h-4 animate-pulse" />
            Live Sync
          </div>
        </div>
      </div>

      {/* 🔄 LOADING */}
      {isLoading ? (
        <div className="flex justify-center py-24">
          <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : readyOrders.length === 0 ? (
        /* 📭 EMPTY STATE */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24 border-dashed border-2 rounded-3xl bg-white"
        >
          <ChefHat className="w-14 h-14 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold mb-2">
            All orders are completed 🎉
          </h3>
          <p className="text-gray-400 text-sm">
            New orders will appear automatically
          </p>

          <button
            onClick={() => refetch()}
            className="mt-6 px-6 py-2 bg-black text-white rounded-xl flex items-center gap-2 mx-auto hover:bg-blue-600 transition"
          >
            Refresh
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      ) : (
        /* 📦 GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {readyOrders.map((order, idx) => (
              <motion.div
                key={order.orderId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ delay: idx * 0.05 }}
              >
                <StaffOrderCard
                  order={order}
                  onAssign={() => handleAssignOrder(order.orderId)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
