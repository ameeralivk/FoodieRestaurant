// import React, { useState } from "react";
// import StaffOrderCard from "../../Elements/Staff/StaffOrderCard";
// import { useQuery } from "@tanstack/react-query";
// import type { IUserOrder } from "../../../types/order";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../redux/store/store";
// import {
//   changeOrderStatus,
//   getTotalOrders,
// } from "../../../services/staffService";
// import { showSuccessToast } from "../../Elements/SuccessToast";
// import { assignOrder } from "../../../services/staffService";
// import { useEffect } from "react";
// import { playSound } from "../../../utils/PlaySound";
// import { useQueryClient } from "@tanstack/react-query";
// import Socket from "../../../socket";
// import { ToastContainer } from "react-toastify";
// import { showErrorToast } from "../../Elements/ErrorToast";
// import StaffOrderStats from "../../Elements/Staff/StaffOrderState";
// const StaffSelectedOrders: React.FC = () => {
//   const queryClient = useQueryClient();

//   const [currentPage] = useState(1);
//   const restaurantId = useSelector(
//     (state: RootState) => state.userAuth.user?.restaurantId,
//   );
//   const [readyOrders, setReadyOrders] = useState<IUserOrder[]>([]);
//   const role = useSelector((state: RootState) => state.userAuth.user?.role);
//   const staffId = useSelector((state: RootState) => state.userAuth.user?._id);
//   const limit = 100;

//   const userId = useSelector((state: RootState) => state.userAuth.user?._id);

//   const { data, refetch } = useQuery<{ success: boolean; data: IUserOrder[] }>({
//     queryKey: ["orders", userId, currentPage, limit],
//     queryFn: () => getTotalOrders(restaurantId as string),
//   });

//   useEffect(() => {
//     if (data?.data) {
//       const ready = data.data.filter(
//         (o) =>
//           o.assignedByStaffId &&
//           o.items.every(
//             (i) => i.itemStatus === "READY" && o.orderStatus != "SERVED",
//           ),
//       );

//       setReadyOrders(ready);
//     }
//   }, [data]);

//   useEffect(() => {
//     if (!restaurantId) return;
//     Socket.emit("join-restaurant", {
//       restaurantId,
//       role, // "staff"
//     });

//     console.log(`Joining staff room for restaurant ${restaurantId}`);
//     const handleOrderCompleted = (socketData: {
//       order: IUserOrder;
//       orderId: string;
//       message: string;
//     }) => {
//       showSuccessToast("New Order is added");
//       refetch();
//       // 🔊 play sound
//       playSound();

//       // ✅ Update React Query cache
//       setReadyOrders((prev) => [...prev, socketData.order]);
//     };

//     Socket.on("order:completed", handleOrderCompleted);

//     return () => {
//       Socket.off("order:completed", handleOrderCompleted);
//     };
//   }, [restaurantId, role, userId, currentPage, limit, queryClient]);

//   const handleServing = async (orderId: string, status: string) => {
//     try {
//       if (status === "SERVED") return showErrorToast("Order already Served");
//       const result = await changeOrderStatus(
//         orderId,
//         status === "SERVING" ? "SERVED" : "SERVING",
//       );
//       if (result.success) {
//         showSuccessToast("Order Status Changed to Serving");
//         refetch();
//       } else if (!result.success) {
//         showErrorToast("Order Status changing failed");
//       }
//     } catch (error: any) {
//       showErrorToast(error.message);
//     }
//   };

//   const handleAssignOrder = async (orderId: string) => {
//     try {
//       const result = await assignOrder(orderId, staffId as string);
//       if (result.success) {
//         showSuccessToast("Order Assigning Completed");
//         refetch();
//       } else {
//         showErrorToast("Order Assigning Failed");
//       }
//     } catch (error) {
//       showErrorToast("Order Assigning Failed");
//       return;
//     }
//   };
//   console.log(data?.data, "data is ehre ameer ali vk");
//   // const readyOrder = data?.data.filter((o) => o.orderStatus === "READY");
//   // const servingOrders = data?.data.filter((o) => o.orderStatus === "SERVING");
//   // const completedOrders = data?.data.filter((o) => o.orderStatus === "SERVED");

//   const isToday = (date?: string | Date) => {
//     if (!date) return false;

//     const d = new Date(date);
//     const t = new Date();

//     return (
//       d.getFullYear() === t.getFullYear() &&
//       d.getMonth() === t.getMonth() &&
//       d.getDate() === t.getDate()
//     );
//   };

//   const readyOrder = data?.data.filter(
//     (o) => o.orderStatus === "READY" && isToday(o.createdAt),
//   );

//   const servingOrders = data?.data.filter(
//     (o) => o.orderStatus === "SERVING" && isToday(o.createdAt),
//   );

//   const completedOrders = data?.data.filter(
//     (o) => o.orderStatus === "SERVED" && isToday(o.createdAt),
//   );

//   return (
//     <div className="p-6">
//       <StaffOrderStats
//         readyCount={readyOrder?.length || 0}
//         servingCount={servingOrders?.length || 0}
//         completedCount={completedOrders?.length || 0}
//       />
//       <ToastContainer />
//       <h1 className="text-2xl font-bold mb-4">Staff Dashboard</h1>

//       <div className="grid grid-cols-3 gap-4">
//         {readyOrders?.map((order) => (
//           <StaffOrderCard
//             key={order.orderId}
//             order={order}
//             onServing={() => handleServing(order.orderId, order.orderStatus)}
//             onAssign={() => handleAssignOrder(order.orderId)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default StaffSelectedOrders;


import React, { useState, useEffect } from "react";
import StaffOrderCard from "../../Elements/Staff/StaffOrderCard";
import { useQuery} from "@tanstack/react-query";
import type { IUserOrder } from "../../../types/order";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import {
  changeOrderStatus,
  getTotalOrders,
  assignOrder 
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
  const user = useSelector((state: RootState) => state.userAuth.user);
  const realRestaurantId = user?.restaurantId;
  const role = user?.role;
  const staffId = user?._id;
  const userId = user?._id;
  const limit = 100;

  const [readyOrders, setReadyOrders] = useState<IUserOrder[]>([]);

  const { data, refetch, isLoading } = useQuery<{ success: boolean; data: IUserOrder[] }>({
    queryKey: ["orders", userId, limit],
    queryFn: () => getTotalOrders(realRestaurantId as string),
    enabled: !!realRestaurantId
  });

  useEffect(() => {
    if (data?.data) {
      const ready = data.data.filter(
        (o) => o.assignedByStaffId === userId && 
               o.items.every((i) => i.itemStatus === "READY") && 
               o.orderStatus !== "SERVED"
      );
      setReadyOrders(ready);
    }
  }, [data, userId]);
  
  useEffect(() => {
    if (!realRestaurantId) return;
    Socket.emit("join-restaurant", { restaurantId: realRestaurantId, role });

    const handleOrderCompleted = () => {
      showSuccessToast("🎉 Order Manifest Ready for Pickup!");
      refetch();
      playSound();
    };

    Socket.on("order:completed", handleOrderCompleted);
    return () => { Socket.off("order:completed", handleOrderCompleted); };
  }, [realRestaurantId, role, refetch]);

  const handleServing = async (orderId: string, status: string) => {
    try {
      if (status === "SERVED") return showErrorToast("Order already Served");
      const result = await changeOrderStatus(orderId, status === "SERVING" ? "SERVED" : "SERVING");
      if (result.success) {
        showSuccessToast("Task Progression Successful");
        refetch();
      } else {
        showErrorToast("Progression Failed");
      }
    } catch (error: any) {
      showErrorToast(error.message);
    }
  };

  const handleAssignOrder = async (orderId: string) => {
    try {
      const result = await assignOrder(orderId, staffId as string);
      if (result.success) {
        showSuccessToast("Manifest Assignment Logged");
        refetch();
      }
    } catch (error) {
      showErrorToast("Assignment Failed");
    }
  };

  const readyCounter = data?.data.filter((o) => o.orderStatus === "READY").length || 0;
  const servingCounter = data?.data.filter((o) => o.orderStatus === "SERVING").length || 0;
  const completedCounter = data?.data.filter((o) => o.orderStatus === "SERVED").length || 0;

  return (
    <div className="max-w-9xl mx-auto px-6 pb-16 pt-4">
      <StaffOrderStats
        readyCount={readyCounter}
        servingCount={servingCounter}
        completedCount={completedCounter}
      />
      <ToastContainer hideProgressBar autoClose={3000} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4 group">
                  <div className="p-3.5 bg-indigo-600 rounded-2xl text-white shadow-2xl shadow-indigo-100 ring-4 ring-indigo-50 group-hover:scale-110 transition-transform duration-300">
                      <BarChart3 className="w-8 h-8" />
                  </div>
                  Service <span className="text-indigo-600">Dashboard</span>
              </h2>
              <p className="text-gray-500 font-medium mt-2 ml-1">Real-time task synchronization for floor service</p>
          </div>
          
          <div className="flex items-center gap-4">
              <div className="bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                  <Package className="w-5 h-5 text-indigo-400" />
                  <span className="text-sm font-black text-gray-900">{readyOrders.length} Manifests Active</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-indigo-50 text-indigo-600 px-5 py-3 rounded-2xl border border-indigo-100 font-black text-[10px] uppercase tracking-[0.3em] shadow-sm">
                  <Zap className="w-4 h-4 animate-pulse text-indigo-500" />
                  Live Sync
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence mode="popLayout">
          {readyOrders?.map((order, idx) => (
            <motion.div
              key={order.orderId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <StaffOrderCard
                order={order}
                onServing={() => handleServing(order.orderId, order.orderStatus)}
                onAssign={() => handleAssignOrder(order.orderId)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {readyOrders.length === 0 && !isLoading && (
          <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-40 bg-white rounded-[4rem] border-2 border-dashed border-gray-100 shadow-inner"
          >
              <div className="w-24 h-24 bg-gray-50 rounded-[40%] flex items-center justify-center mb-6 border border-gray-100">
                  <Truck className="w-12 h-12 text-gray-200" />
              </div>
              <div className="text-center">
                  <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Floor Clear</h3>
                  <p className="text-gray-400 font-medium max-w-sm mx-auto italic">No orders are currently manifesting for pickup. All tickets are either being processed or served.</p>
              </div>
              <button onClick={() => refetch()} className="mt-10 px-8 py-3.5 bg-[#0a0c14] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all flex items-center gap-3 group">
                  Refresh Manifests
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
          </motion.div>
      )}

      {isLoading && (
          <div className="min-h-[400px] flex items-center justify-center bg-white/50 rounded-[4rem] border border-gray-100">
              <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
      )}
    </div>
  );
};

export default StaffSelectedOrders;