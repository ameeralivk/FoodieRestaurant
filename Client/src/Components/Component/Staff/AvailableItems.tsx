// import { useState } from "react";
// import { Package, UserPlus } from "lucide-react";
// import ChefAssignModal from "../../modals/Cheff/CheffAssignModal";
// import { useQuery } from "@tanstack/react-query";
// import type { IUserOrder } from "../../../types/order";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../redux/store/store";
// import { useQueryClient } from "@tanstack/react-query";
// import { useEffect } from "react";
// import Socket from "../../../socket";
// import {
//   assignChefToItem,
//   getTotalOrders,
// } from "../../../services/staffService";
// import { showSuccessToast } from "../../Elements/SuccessToast";
// import type {  IVarientItemType } from "../../../types/varient";
// import { ToastContainer } from "react-toastify";
// import { useRef } from "react";

// const AvailableItemsSection = () => {
//   // 🔹 Dummy Data

//   const userId = useSelector((state: RootState) => state.userAuth.user?._id);
//   const StaffName = useSelector(
//     (state: RootState) => state.userAuth.user?.name,
//   );
//   const queryClient = useQueryClient();
//    const audioRef = useRef<HTMLAudioElement | null>(null);
//   const restaurantId = useSelector(
//     (state: RootState) => state.userAuth.user?.restaurantId,
//   );
//   const [currentPage] = useState(1);
//   const limit = 1000;

//    useEffect(() => {
//       const audio = new Audio(
//         "/sounds/universfield-new-notification-026-380249.mp3",
//       );
  
//       audio.preload = "auto";
//       audioRef.current = audio;
  
//       // 🔓 unlock audio after first user interaction
//       const unlockAudio = () => {
//         audio
//           .play()
//           .then(() => {
//             audio.pause();
//             audio.currentTime = 0;
//             console.log("🔓 Audio unlocked");
//           })
//           .catch(() => {});
  
//         window.removeEventListener("click", unlockAudio);
//       };
  
//       window.addEventListener("click", unlockAudio);
  
//       return () => {
//         window.removeEventListener("click", unlockAudio);
//       };
//     }, []);
  
//    const playSound = () => {
//       if (!audioRef.current) return;
  
//       audioRef.current.currentTime = 0;
  
//       audioRef.current
//         .play()
//         .then(() => {
//           console.log("🔊 Sound played");
//         })
//         .catch((err) => {
//           console.log("❌ Sound blocked:", err);
//         });
//     };

//   useEffect(() => {
//     if (!restaurantId) return;

//     // connect socket if not connected
//     if (!Socket.connected) {
//       Socket.connect();
//     }

//     // join restaurant room
//     Socket.emit("join-restaurant", {
//       restaurantId,
//       role: "chef", // or "staff" based on your page
//     });

//     console.log("✅ Joined restaurant:", restaurantId);

//     // ✅ ONLY new order notification
//     const handleNewOrder = (newOrder: IUserOrder) => {
//       console.log("🔥 New order received:", newOrder);
       
//       playSound()

//       showSuccessToast(`New Order from Table ${newOrder.tableId}`);

//       // 🔄 refresh orders list
//       queryClient.invalidateQueries({
//         queryKey: ["orders", userId, currentPage, limit],
//       });
//     };

//     Socket.on("order:new", handleNewOrder);

//     return () => {
//       Socket.off("order:new", handleNewOrder);
//     };
//   }, [restaurantId, userId, currentPage, limit, queryClient]);

//   const { data } = useQuery<{ success: boolean; data: IUserOrder[] }>({
//     queryKey: ["orders", userId, currentPage, limit],
//     queryFn: () => getTotalOrders(restaurantId as string),
//   });

//   const today = new Date();
// today.setHours(0, 0, 0, 0);

// const tomorrow = new Date(today);
// tomorrow.setDate(tomorrow.getDate() + 1);

//   let items =
//     data?.data.filter(
//       (order) =>
//         new Date(order.createdAt) >= today &&
//         new Date(order.createdAt) < tomorrow
//     ).
//     flatMap((order) =>
//       order.items
//         .filter((item) => !item.assignedCookId)
//         .map((item) => ({
//           orderId: order.orderId,
//           tableId: order.tableId,
//           orderStatus: order.orderStatus,
//           createdAt: order.createdAt,
//           restaurantId: order.restaurantId,

//           variantId: item.variant?._id ?? null, // ✅ add this
//           varient: item.variant,

//           itemId: item.itemId,
//           itemName: item.itemName,
//           quantity: item.quantity,
//           itemStatus: item.itemStatus,
//           assignedCookId: item.assignedCookId,
//           price: item.price,
//           itemImages: item.itemImages,
//         })),
//     ) || [];

//   console.log(items, "items");
//   const [selectedItem, setSelectedItem] = useState<any>(null);

//   const assignItemToChef = async (
//     orderId: string,
//     itemId: string,
//     variant: IVarientItemType,
//   ) => {
//     let res = await assignChefToItem(
//       orderId,
//       itemId,
//       userId ? userId : "",
//       variant?._id?.toString(),
//     );
//     if (res.success) {
//       showSuccessToast("Item Assignedment Completed");
//       queryClient.invalidateQueries({
//         queryKey: ["orders", userId, currentPage, limit],
//       });

//       setSelectedItem(null);
//     }
//   };

//   return (
//     <div>
//       <ToastContainer />
//       <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
//         Available Items
//         <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
//           {items.length}
//         </span>
//       </h2>

//       {items?.length === 0 ? (
//         <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
//           <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//           <h3 className="text-lg font-bold text-slate-900 mb-2">
//             No Available Items
//           </h3>
//           <p className="text-slate-600">All items are assigned or completed</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//           {items?.map((item) => (
//             <button
//               // key={item.itemId}
//               key={`${item.orderId}-${item.itemId}-${item.variantId ?? "no-variant"}`}
//               onClick={() =>
//                 setSelectedItem({
//                   orderId: item.orderId,
//                   itemId: item.itemId,
//                   price: item.price,
//                   itemName: item.itemName,
//                   quantity: item.quantity,
//                   variantId: item.variantId,
//                   createdAt: item.createdAt,
//                   varient: item.varient,
//                   tableId: item.tableId,
//                   mode: "assign",
//                 })
//               }
//               className="bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-100 transition-all text-left group overflow-hidden"
//             >
//               {/* Image */}
//               <div className="relative h-40 w-full overflow-hidden bg-slate-100">
//                 <img
//                   src={item.itemImages?.[0]}
//                   alt={item.itemName}
//                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                 />

//                 {/* Status badge */}
//                 <span className="absolute top-2 right-2 text-xs font-bold bg-emerald-500 text-white px-2 py-1 rounded-full">
//                   {item.itemStatus}
//                 </span>
//               </div>

//               {/* Content */}
//               <div className="p-4">
//                 {/* Order + Table */}
//                 <div className="text-xs text-slate-500 mb-1">
//                   Order: {item.orderId}
//                 </div>

//                 <div className="text-xs text-slate-500 mb-2">
//                   Table: {item.tableId}
//                 </div>

//                 {/* Item Name */}
//                 <div className="font-bold text-slate-800 text-lg group-hover:text-emerald-600 transition-colors">
//                   {item.itemName}
//                 </div>

//                 {/* Quantity + Price */}
//                 <div className="flex justify-between items-center mt-2">
//                   <div className="text-sm text-slate-600">
//                     Qty: <span className="font-semibold">{item.quantity}</span>
//                   </div>

//                   <div className="text-sm font-bold text-emerald-600">
//                     ₹{item.price}
//                   </div>
//                 </div>

//                 {/* Time */}
//                 <div className="text-xs text-slate-400 mt-2">
//                   {new Date(item.createdAt).toLocaleTimeString()}
//                 </div>

//                 {/* Assign hint */}
//                 <div className="flex items-center justify-end mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
//                   <div className="flex items-center gap-1 text-emerald-600 text-sm font-semibold">
//                     <UserPlus className="w-4 h-4" />
//                     Assign to me
//                   </div>
//                 </div>
//               </div>
//             </button>
//           ))}
//         </div>
//       )}

//       {selectedItem && selectedItem.mode === "assign" && (
//         <ChefAssignModal
//           item={selectedItem}
//           currentChef={StaffName ? StaffName : ""}
//           onClose={() => setSelectedItem(null)}
//           onAssign={(orderId, itemId, variant) =>
//             assignItemToChef(orderId, itemId, variant)
//           }
//         />
//       )}

//       {/* Optional: Just to see selected item in console */}
//       {selectedItem && console.log("Selected:", selectedItem)}
//     </div>
//   );
// };

// export default AvailableItemsSection;


import { useState, useEffect, useRef } from "react";
import { 
    Package, 
    UserPlus, 
    Clock, 
    Hash, 
    MapPin, 
    Zap,
    UtensilsCrossed
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ChefAssignModal from "../../modals/Cheff/CheffAssignModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { IUserOrder } from "../../../types/order";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import { 
    assignChefToItem, 
    getTotalOrders 
} from "../../../services/staffService";
import { showSuccessToast } from "../../Elements/SuccessToast";
import type { IVarientItemType } from "../../../types/varient";
import { ToastContainer } from "react-toastify";
import Socket from "../../../socket";

const AvailableItemsSection = () => {
  const userId = useSelector((state: RootState) => state.userAuth.user?._id);
  const StaffName = useSelector((state: RootState) => state.userAuth.user?.name);
  const restaurantId = useSelector((state: RootState) => state.userAuth.user?.restaurantId);
  const queryClient = useQueryClient();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const limit = 1000;
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    const audio = new Audio("/sounds/universfield-new-notification-026-380249.mp3");
    audio.preload = "auto";
    audioRef.current = audio;

    const unlockAudio = () => {
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
      }).catch(() => {});
      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);
    return () => { window.removeEventListener("click", unlockAudio); };
  }, []);
  
  const playSound = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(err => console.log("Sound blocked:", err));
  };

  useEffect(() => {
    if (!restaurantId) return;
    if (!Socket.connected) Socket.connect();

    Socket.emit("join-restaurant", { restaurantId, role: "chef" });

    const handleNewOrder = (newOrder: IUserOrder) => {
      playSound();
      showSuccessToast(`🔥 New Order from Table ${newOrder.tableId}`);
      queryClient.invalidateQueries({ queryKey: ["orders", userId, limit] });
    };

    Socket.on("order:new", handleNewOrder);
    return () => { Socket.off("order:new", handleNewOrder); };
  }, [restaurantId, userId, limit, queryClient]);

  const { data, isLoading } = useQuery<{ success: boolean; data: IUserOrder[] }>({
    queryKey: ["orders", userId, limit],
    queryFn: () => getTotalOrders(restaurantId as string),
    enabled: !!restaurantId
  });

  const items = data?.data.flatMap((order) =>
    order.items
      .filter((item) => !item.assignedCookId)
      .map((item) => ({
        orderId: order.orderId,
        tableId: order.tableId,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
        restaurantId: order.restaurantId,
        variantId: item.variant?._id ?? null,
        varient: item.variant,
        itemId: item.itemId,
        itemName: item.itemName,
        quantity: item.quantity,
        itemStatus: item.itemStatus,
        assignedCookId: item.assignedCookId,
        price: item.price,
        itemImages: item.itemImages,
      }))
  ) || [];

  const assignItemToChef = async (orderId: string, itemId: string, variant: IVarientItemType) => {
    let res = await assignChefToItem(orderId, itemId, userId ? userId : "", variant?._id?.toString());
    if (res.success) {
      showSuccessToast("Item self-assigned successfully 👨‍🍳");
      queryClient.invalidateQueries({ queryKey: ["orders", userId, limit] });
      setSelectedItem(null);
    }
  };

  return (
    <div className="max-w-9xl mx-auto px-6 pb-12">
      <ToastContainer hideProgressBar draggable autoClose={4000} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-4 group">
              <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-xl shadow-emerald-200 group-hover:scale-110 transition-transform duration-300">
                  <UtensilsCrossed className="w-8 h-8" />
              </div>
              <div className="flex flex-col">
                  <span>Available Orders</span>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Pending Kitchen Tasks</span>
              </div>
          </h2>
          
          <div className="flex items-center gap-4">
              <div className="bg-white px-4 py-2.5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2">
                  <Package className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-black text-gray-900">{items.length} Tasks Found</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2.5 rounded-2xl border border-emerald-100 font-black text-[10px] uppercase tracking-[0.2em] shadow-sm">
                  <Zap className="w-4 h-4 animate-pulse" />
                  Ready to Assign
              </div>
          </div>
      </div>

      {isLoading ? (
          <div className="min-h-[400px] flex items-center justify-center bg-white/50 rounded-[4rem] border border-gray-100">
              <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
          </div>
      ) : items.length === 0 ? (
          <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-gray-100 shadow-inner"
          >
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-12 h-12 text-gray-200" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Kitchen Zero</h3>
              <p className="text-gray-400 font-medium max-w-xs mx-auto">No orders are currently waiting for assignment. All items are either assigned or completed.</p>
          </motion.div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.button
                  key={`${item.orderId}-${item.itemId}-${item.variantId ?? "no-variant"}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  onClick={() => setSelectedItem({ ...item, mode: "assign" })}
                  className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:shadow-emerald-100/40 hover:border-emerald-500 transition-all duration-300 text-left group overflow-hidden"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-gray-50">
                    <img
                      src={item.itemImages?.[0] || "/placeholder-dish.jpg"}
                      alt={item.itemName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-95 group-hover:brightness-100"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                        <span className="backdrop-blur-md bg-white/70 text-[10px] font-black uppercase text-emerald-700 px-3 py-1.5 rounded-xl border border-white/50 shadow-sm tracking-widest leading-none">
                            {item.itemStatus}
                        </span>
                    </div>
                    <div className="absolute bottom-4 left-4">
                        <div className="backdrop-blur-md bg-black/30 text-white px-3 py-1 rounded-xl text-xs font-black uppercase tracking-widest border border-white/20 shadow-lg">
                            ₹{item.price}
                        </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                <Hash className="w-3 h-3" />
                                {item.orderId.slice(-8).toUpperCase()}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                                    <MapPin className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-sm font-black text-gray-900 group-hover:text-emerald-600 transition-colors">Table {item.tableId}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantity</span>
                            <span className="text-2xl font-black text-gray-900 leading-none mt-1">{item.quantity}</span>
                        </div>
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 mb-6 leading-tight group-hover:text-emerald-600 transition-colors">
                      {item.itemName}
                    </h3>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                        <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-200 hover:scale-105 active:scale-95 transition-all">
                            <UserPlus className="w-4 h-4" />
                            Self-Assign
                        </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
      )}

      {selectedItem && selectedItem.mode === "assign" && (
        <ChefAssignModal
          item={selectedItem}
          currentChef={StaffName || ""}
          onClose={() => setSelectedItem(null)}
          onAssign={(orderId, itemId, variant) =>
            assignItemToChef(orderId, itemId, variant)
          }
        />
      )}
    </div>
  );
};

export default AvailableItemsSection;

