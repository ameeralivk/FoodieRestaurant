import { useState } from "react";
import { Package, UserPlus } from "lucide-react";
import ChefAssignModal from "../../modals/Cheff/CheffAssignModal";
import { useQuery } from "@tanstack/react-query";
import type { IUserOrder } from "../../../types/order";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import Socket from "../../../socket";
import {
  assignChefToItem,
  getTotalOrders,
} from "../../../services/staffService";
import { showSuccessToast } from "../../Elements/SuccessToast";
import type {  IVarientItemType } from "../../../types/varient";
import { ToastContainer } from "react-toastify";
import { useRef } from "react";

const AvailableItemsSection = () => {
  // 🔹 Dummy Data

  const userId = useSelector((state: RootState) => state.userAuth.user?._id);
  const StaffName = useSelector(
    (state: RootState) => state.userAuth.user?.name,
  );
  const queryClient = useQueryClient();
   const audioRef = useRef<HTMLAudioElement | null>(null);
  const restaurantId = useSelector(
    (state: RootState) => state.userAuth.user?.restaurantId,
  );
  const [currentPage] = useState(1);
  const limit = 1000;

   useEffect(() => {
      const audio = new Audio(
        "/sounds/universfield-new-notification-026-380249.mp3",
      );
  
      audio.preload = "auto";
      audioRef.current = audio;
  
      // 🔓 unlock audio after first user interaction
      const unlockAudio = () => {
        audio
          .play()
          .then(() => {
            audio.pause();
            audio.currentTime = 0;
            console.log("🔓 Audio unlocked");
          })
          .catch(() => {});
  
        window.removeEventListener("click", unlockAudio);
      };
  
      window.addEventListener("click", unlockAudio);
  
      return () => {
        window.removeEventListener("click", unlockAudio);
      };
    }, []);
  
   const playSound = () => {
      if (!audioRef.current) return;
  
      audioRef.current.currentTime = 0;
  
      audioRef.current
        .play()
        .then(() => {
          console.log("🔊 Sound played");
        })
        .catch((err) => {
          console.log("❌ Sound blocked:", err);
        });
    };

  useEffect(() => {
    if (!restaurantId) return;

    // connect socket if not connected
    if (!Socket.connected) {
      Socket.connect();
    }

    // join restaurant room
    Socket.emit("join-restaurant", {
      restaurantId,
      role: "chef", // or "staff" based on your page
    });

    console.log("✅ Joined restaurant:", restaurantId);

    // ✅ ONLY new order notification
    const handleNewOrder = (newOrder: IUserOrder) => {
      console.log("🔥 New order received:", newOrder);
       
      playSound()

      showSuccessToast(`New Order from Table ${newOrder.tableId}`);

      // 🔄 refresh orders list
      queryClient.invalidateQueries({
        queryKey: ["orders", userId, currentPage, limit],
      });
    };

    Socket.on("order:new", handleNewOrder);

    return () => {
      Socket.off("order:new", handleNewOrder);
    };
  }, [restaurantId, userId, currentPage, limit, queryClient]);

  const { data } = useQuery<{ success: boolean; data: IUserOrder[] }>({
    queryKey: ["orders", userId, currentPage, limit],
    queryFn: () => getTotalOrders(restaurantId as string),
  });

  const today = new Date();
today.setHours(0, 0, 0, 0);

const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

  let items =
    data?.data.filter(
      (order) =>
        new Date(order.createdAt) >= today &&
        new Date(order.createdAt) < tomorrow
    ).
    flatMap((order) =>
      order.items
        .filter((item) => !item.assignedCookId)
        .map((item) => ({
          orderId: order.orderId,
          tableId: order.tableId,
          orderStatus: order.orderStatus,
          createdAt: order.createdAt,
          restaurantId: order.restaurantId,

          variantId: item.variant?._id ?? null, // ✅ add this
          varient: item.variant,

          itemId: item.itemId,
          itemName: item.itemName,
          quantity: item.quantity,
          itemStatus: item.itemStatus,
          assignedCookId: item.assignedCookId,
          price: item.price,
          itemImages: item.itemImages,
        })),
    ) || [];

  console.log(items, "items");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const assignItemToChef = async (
    orderId: string,
    itemId: string,
    variant: IVarientItemType,
  ) => {
    let res = await assignChefToItem(
      orderId,
      itemId,
      userId ? userId : "",
      variant?._id?.toString(),
    );
    if (res.success) {
      showSuccessToast("Item Assignedment Completed");
      queryClient.invalidateQueries({
        queryKey: ["orders", userId, currentPage, limit],
      });

      setSelectedItem(null);
    }
  };

  return (
    <div>
      <ToastContainer />
      <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
        Available Items
        <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {items.length}
        </span>
      </h2>

      {items?.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            No Available Items
          </h3>
          <p className="text-slate-600">All items are assigned or completed</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items?.map((item) => (
            <button
              // key={item.itemId}
              key={`${item.orderId}-${item.itemId}-${item.variantId ?? "no-variant"}`}
              onClick={() =>
                setSelectedItem({
                  orderId: item.orderId,
                  itemId: item.itemId,
                  price: item.price,
                  itemName: item.itemName,
                  quantity: item.quantity,
                  variantId: item.variantId,
                  createdAt: item.createdAt,
                  varient: item.varient,
                  tableId: item.tableId,
                  mode: "assign",
                })
              }
              className="bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-100 transition-all text-left group overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                <img
                  src={item.itemImages?.[0]}
                  alt={item.itemName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Status badge */}
                <span className="absolute top-2 right-2 text-xs font-bold bg-emerald-500 text-white px-2 py-1 rounded-full">
                  {item.itemStatus}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Order + Table */}
                <div className="text-xs text-slate-500 mb-1">
                  Order: {item.orderId}
                </div>

                <div className="text-xs text-slate-500 mb-2">
                  Table: {item.tableId}
                </div>

                {/* Item Name */}
                <div className="font-bold text-slate-800 text-lg group-hover:text-emerald-600 transition-colors">
                  {item.itemName}
                </div>

                {/* Quantity + Price */}
                <div className="flex justify-between items-center mt-2">
                  <div className="text-sm text-slate-600">
                    Qty: <span className="font-semibold">{item.quantity}</span>
                  </div>

                  <div className="text-sm font-bold text-emerald-600">
                    ₹{item.price}
                  </div>
                </div>

                {/* Time */}
                <div className="text-xs text-slate-400 mt-2">
                  {new Date(item.createdAt).toLocaleTimeString()}
                </div>

                {/* Assign hint */}
                <div className="flex items-center justify-end mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-1 text-emerald-600 text-sm font-semibold">
                    <UserPlus className="w-4 h-4" />
                    Assign to me
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedItem && selectedItem.mode === "assign" && (
        <ChefAssignModal
          item={selectedItem}
          currentChef={StaffName ? StaffName : ""}
          onClose={() => setSelectedItem(null)}
          onAssign={(orderId, itemId, variant) =>
            assignItemToChef(orderId, itemId, variant)
          }
        />
      )}

      {/* Optional: Just to see selected item in console */}
      {selectedItem && console.log("Selected:", selectedItem)}
    </div>
  );
};

export default AvailableItemsSection;
