// import React, { useState } from "react";
// import ChefUpdateItemModal from "../../modals/Cheff/CheffUpdateItemModal";
// import { useQuery } from "@tanstack/react-query";
// import { updateOrder } from "../../../services/staffService";
// import { showSuccessToast } from "../../Elements/SuccessToast";
// import {
//   getAssignedItems,
//   getTotalOrders,
// } from "../../../services/staffService";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../redux/store/store";
// import type {
//   AssignedItem,
//   AssignedItemsResponse,
//   IUserOrder,
// } from "../../../types/order";
// import { ToastContainer } from "react-toastify";
// import type { IVarientItemType } from "../../../types/varient";
// import { useEffect } from "react";
// import Socket from "../../../socket";
// import ChefOrderStats from "../../Elements/Staff/chefOrderState";
// import { useQueryClient } from "@tanstack/react-query";
// export type ItemStatus = "ASSIGNED" | "PREPARING" | "READY" | "PENDING";

// interface Order {
//   orderId: string;
//   orderNumber: string;
//   tableNumber: number;
// }

// interface OrderItem {
//   itemId: string;
//   itemName: string;
//   quantity: number;
//   station?: string;
//   itemStatus: ItemStatus;
//   instruction?: string | null;
//   variant?: IVarientItemType | null;
//   assignedCookId?: string;
//   itemImages?: string[];
//   price: number;
// }

// interface MyItem {
//   order: Order;
//   item: OrderItem;
// }

// export interface CheffItemResponse {
//   success: boolean;
//   data: MyItem[];
// }

// const MyItemsSection: React.FC = () => {
//   const [selectedItem, setSelectedItem] = useState<AssignedItem | null>(null);
//   const userId = useSelector((state: RootState) => state.userAuth.user?._id);
//   const restaurantId = useSelector(
//     (state: RootState) => state.userAuth.user?.restaurantId,
//   );
//   const [currentPage] = useState(1);
//   const limit = 10;
//   const [ordersData, setOrdersData] = useState<{
//     success: boolean;
//     data: IUserOrder[];
//   } | null>(null);

//   const [loading, setLoading] = useState(false);
//   const queryClient = useQueryClient();

//   //   const { data } = useQuery<{ success: boolean; data: MyItem[] }>(
//   //     ["orders", userId, currentPage, limit],
//   //     () => getTotalOrders(restaurantId as string, "true")
//   //   );

//   useEffect(() => {
//     if (!userId) return;
//     Socket.emit("join-restaurant", {
//       restaurantId,
//       role: "chef",
//     });
//     // join cook room
//     Socket.emit("joinRoom", `${userId}-cook`);

//     const handleItemAssigned = () => {
//       console.log("🔔 New item assigned");
//       showSuccessToast("New item assigned to you 👨‍🍳");
//     };
//     Socket.on("order:itemAssigned", handleItemAssigned);
//     return () => {
//       Socket.off("order:itemAssigned", handleItemAssigned);
//     };
//   }, [userId]);

//   const { data, refetch } = useQuery<AssignedItemsResponse>({
//     queryKey: ["orders", userId, currentPage, limit],
//     queryFn: () => getAssignedItems(restaurantId as string, userId as string),
//   });
//   useEffect(() => {
//     const fetchTotalOrders = async () => {
//       try {
//         setLoading(true);
//         // const response = await getTotalOrders(restaurantId as string);
//         // setOrdersData(response);
//         const isToday = (date: string) => {
//           const d = new Date(date);
//           const t = new Date();

//           return (
//             d.getFullYear() === t.getFullYear() &&
//             d.getMonth() === t.getMonth() &&
//             d.getDate() === t.getDate()
//           );
//         };

//         const response = await getTotalOrders(restaurantId as string);

//         const todayOrders = response.data.filter((order: any) =>
//           isToday(order.createdAt),
//         );

//         setOrdersData({ ...response, data: todayOrders });
//       } catch (error) {
//         console.error("Failed to fetch total orders:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (restaurantId) {
//       fetchTotalOrders();
//     }
//   }, [restaurantId, data, queryClient]);

//   // map API data to your MyItem type (if needed)
//   const Items: AssignedItem[] =
//     data?.data.filter((order) => order.item.itemStatus != "READY") || [];

//   const handleUpdateStatus = async (
//     orderId: string,
//     itemId: string,
//     newStatus: ItemStatus,
//     varient?: IVarientItemType,
//   ) => {
//     let result = await updateOrder(
//       orderId,
//       itemId,
//       newStatus,
//       varient?._id.toString(),
//     );

//     if (result.success) {
//       showSuccessToast("order updated Successfully");
//       refetch();
//     }

//     // Call API to update item status
//     setSelectedItem(null);
//   };

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

//   const stats = {
//     // Items not assigned to any cook
//     available:
//       ordersData?.data
//         ?.flatMap((order) => order.items)
//         ?.filter((item) => item.itemStatus === "PENDING")?.length ?? 0,

//     // Items assigned to this cook but not started (ASSIGNED)
//     myAssigned:
//       data?.data.filter(
//         (d) => d.item.assignedCookId && d.item.itemStatus === "ASSIGNED",
//       ).length || 0,

//     // Items preparing
//     myPreparing:
//       data?.data.filter(
//         (d) => d.item.assignedCookId && d.item.itemStatus === "PREPARING",
//       ).length || 0,

//     // Items ready
//     // myReady:
//     //   data?.data.filter(
//     //     (d) => d.item.assignedCookId && d.item.itemStatus === "READY",
//     //   ).length || 0,
//     myReady:
//       data?.data.filter(
//         (d) =>
//           d.item.assignedCookId &&
//           d.item.itemStatus === "READY" &&
//           isToday(d.createdAt), // 👈 this line added
//       ).length || 0,
//   };

//   return (
//     <div className="max-w-9xl mx-auto px-6 pb-8">
//       <ChefOrderStats stats={stats} />
//       <h2 className="text-xl font-bold mb-4">My Items ({Items.length})</h2>
//       {loading && <h1>Loading........</h1>}
//       <ToastContainer />
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {Items.map(({ orderId, item, tableNumber, orderStatus }) => (
//           <button
//             key={item.itemId}
//             onClick={() =>
//               setSelectedItem({
//                 orderId,
//                 item,
//                 tableNumber: tableNumber,
//                 orderStatus: orderStatus,
//               })
//             }
//             className="bg-white border rounded-xl p-5 hover:border-emerald-500 hover:shadow-md transition text-left"
//           >
//             <div className="text-sm text-gray-500">
//               {orderId} • Table {tableNumber}
//             </div>

//             <div className="font-bold text-lg">{item.itemName}</div>

//             <div className="text-sm">Qty: {item.quantity}</div>

//             <div className="text-xs font-bold mt-2 text-emerald-600">
//               Status: {item.itemStatus}
//             </div>
//           </button>
//         ))}
//       </div>
//       {selectedItem && (
//         <ChefUpdateItemModal
//           tableNo={selectedItem.tableNumber}
//           orderId={selectedItem.orderId}
//           item={selectedItem.item}
//           onClose={() => setSelectedItem(null)}
//           onUpdate={handleUpdateStatus}
//         />
//       )}
//     </div>
//   );
// };

// export default MyItemsSection;

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChefUpdateItemModal from "../../modals/Cheff/CheffUpdateItemModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  updateOrder,
  getAssignedItems,
  getTotalOrders,
} from "../../../services/staffService";
import { showSuccessToast } from "../../Elements/SuccessToast";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import type {
  AssignedItem,
  AssignedItemsResponse,
  IUserOrder,
} from "../../../types/order";
import { ToastContainer } from "react-toastify";
import type { IVarientItemType } from "../../../types/varient";
import Socket from "../../../socket";
import ChefOrderStats from "../../Elements/Staff/chefOrderState";
import {
  Clock,
  ChefHat,
  Package,
  ChevronRight,
  Flame,
  Zap,
  MapPin,
  Hash,
} from "lucide-react";

export type ItemStatus = "ASSIGNED" | "PREPARING" | "READY" | "PENDING";

const MyItemsSection: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<AssignedItem | null>(null);
  const userId = useSelector((state: RootState) => state.userAuth.user?._id);
  const restaurantId = useSelector(
    (state: RootState) => state.userAuth.user?.restaurantId,
  );
  const queryClient = useQueryClient();
  const [ordersData, setOrdersData] = useState<{
    success: boolean;
    data: IUserOrder[];
  } | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  useEffect(() => {
    if (!userId) return;
    Socket.emit("join-restaurant", { restaurantId, role: "chef" });
    Socket.emit("joinRoom", `${userId}-cook`);

    const handleItemAssigned = () => {
      showSuccessToast("New item assigned to you 👨‍🍳");
      queryClient.invalidateQueries({ queryKey: ["orders", userId] });
    };
    Socket.on("order:itemAssigned", handleItemAssigned);
    return () => {
      Socket.off("order:itemAssigned", handleItemAssigned);
    };
  }, [userId, restaurantId, queryClient]);

  const {
    data,
    refetch,
    isLoading: isLoadingItems,
  } = useQuery<AssignedItemsResponse>({
    queryKey: ["orders", userId],
    queryFn: () => getAssignedItems(restaurantId as string, userId as string),
    enabled: !!userId && !!restaurantId,
  });

  useEffect(() => {
    const fetchTotalOrders = async () => {
      try {
        setIsLoadingStats(true);
        const response = await getTotalOrders(restaurantId as string);
        setOrdersData(response);
      } catch (error) {
        console.error("Failed to fetch total orders:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };
    if (restaurantId) fetchTotalOrders();
  }, [restaurantId, data]);

  const Items =
    data?.data?.filter((order) => order.item.itemStatus !== "READY") || [];

  const handleUpdateStatus = async (
    orderId: string,
    itemId: string,
    newStatus: ItemStatus,
    varient?: IVarientItemType,
  ) => {
    let result = await updateOrder(
      orderId,
      itemId,
      newStatus,
      varient?._id.toString(),
    );
    if (result.success) {
      showSuccessToast("Task updated successfully!");
      refetch();
    }
    setSelectedItem(null);
  };

  const stats = {
    available:
      ordersData?.data
        ?.flatMap((o) => o.items)
        ?.filter((i) => i.itemStatus === "PENDING")?.length ?? 0,
    myAssigned:
      data?.data.filter((d) => d.item.itemStatus === "ASSIGNED").length || 0,
    myPreparing:
      data?.data.filter((d) => d.item.itemStatus === "PREPARING").length || 0,
    myReady:
      data?.data.filter((d) => d.item.itemStatus === "READY").length || 0,
  };

  return (
    <div className="max-w-9xl mx-auto px-6 pb-12">
      <ChefOrderStats stats={stats} />
       {isLoadingStats && <p>Loading.........</p>}
      <div className="flex items-center justify-between mb-8 group">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <div className="p-2 bg-emerald-600 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
            <ChefHat className="w-6 h-6" />
          </div>
          My Active Tasks
          <span className="text-sm font-black bg-gray-100 px-3 py-1 rounded-full text-gray-400 align-middle">
            {Items.length}
          </span>
        </h2>
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
          <Zap className="w-3 h-3 animate-pulse" />
          Live Priorities
        </div>
      </div>

      <ToastContainer hideProgressBar draggable autoClose={3000} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {Items.map(({ orderId, item, tableNumber }, idx) => (
            <motion.button
              key={item.itemId}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              onClick={() =>
                setSelectedItem({
                  orderId,
                  item,
                  tableNumber,
                  orderStatus: "PENDING",
                } as any)
              }
              className="group bg-white rounded-[3rem] p-8 text-left border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:shadow-emerald-100/40 hover:border-emerald-500 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                <Flame className="w-32 h-32" />
              </div>

              <div className="flex flex-col h-full relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <Hash className="w-3 h-3" />
                      {orderId.slice(-8).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-black text-gray-900">
                        Table {tableNumber}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${
                      item.itemStatus === "PREPARING"
                        ? "bg-orange-50 text-orange-600 border-orange-100"
                        : "bg-blue-50 text-blue-600 border-blue-100"
                    }`}
                  >
                    {item.itemStatus}
                  </div>
                </div>

                <div className="mb-6 flex-grow">
                  <h3 className="text-2xl font-black text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {item.itemName}
                  </h3>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                      <Package className="w-4 h-4" />
                      QTY:{" "}
                      <span className="text-gray-900 font-black">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                      <Clock className="w-4 h-4" />
                      Active Now
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Action Required
                  </span>
                  <div className="p-3 bg-gray-50 group-hover:bg-emerald-600 group-hover:text-white rounded-2xl transition-all duration-300">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {Items.length === 0 && !isLoadingItems && (
        <div className="flex flex-col items-center justify-center py-32 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200">
          <Package className="w-20 h-20 text-gray-200 mb-6" />
          <div className="text-center">
            <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
              You're All Caught Up!
            </h3>
            <p className="text-gray-400 font-medium max-w-xs mx-auto">
              No active tasks assigned to you right now. Take a break or check
              available orders.
            </p>
          </div>
        </div>
      )}

      {selectedItem && (
        <ChefUpdateItemModal
          tableNo={selectedItem.tableNumber}
          orderId={selectedItem.orderId}
          item={selectedItem.item}
          onClose={() => setSelectedItem(null)}
          onUpdate={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default MyItemsSection;
