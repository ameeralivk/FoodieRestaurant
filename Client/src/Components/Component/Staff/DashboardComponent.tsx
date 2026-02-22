import React, { useState } from "react";
import { ChefHat } from "lucide-react";
import UpdateItemModal from "../../Elements/Staff/UpdateItemModal";
import OrderCard from "../../Elements/Staff/OrderCard";
import type { IUserOrder } from "../../../types/order";
import Socket from "../../../socket";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import type { RootState } from "../../../redux/store/store";
import type { IOrderItem } from "../../../types/order";
import { useRef } from "react";
import { getTotalOrders, updateOrder } from "../../../services/staffService";
import { useQueryClient } from "@tanstack/react-query";
import { showSuccessToast } from "../../Elements/SuccessToast";
import { ToastContainer } from "react-toastify";


type ItemStatus = "PENDING" | "PREPARING" | "READY"|"ASSIGNED"|"SERVING";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  status: ItemStatus;
  preparedBy?: string;
  station?: string; // e.g., "Grill", "Fryer", "Wok", "Dessert"
}

interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  orderTime: string;
}

const ChefPage: React.FC = () => {
  const queryClient = useQueryClient();
  const role = useSelector((state: RootState) => state.userAuth.user?.role);
  const defaultTab = role === "chef" ? "Pending" : "Completed";
  const [activeTab, setActiveTab] = useState<
    "Pending" | "Preparing" | "Completed"
  >(defaultTab);
  const [selectedItem, setSelectedItem] = useState<{
    order: IUserOrder;
    item: IOrderItem;
  } | null>(null);
  const userId = useSelector((state: RootState) => state.userAuth.user?._id);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [notifications, setNotifications] = useState<
    { id: string; message: string }[]
  >([]);

  const [currentPage, setCurrentPage] = useState(1);
  const restaurantId = useSelector(
    (state: RootState) => state.userAuth.user?.restaurantId,
  );
  const limit = 10;

  const { data } = useQuery<{ success: boolean; data: IUserOrder[] }>({
    queryKey: ["orders", userId, currentPage, limit],
    queryFn: () => getTotalOrders(restaurantId as string),
  });
  const [orders, setOrders] = useState<IUserOrder[]>([]);

  useEffect(() => {
    if (data?.data) {
      setOrders(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (!restaurantId || role !== "staff") return;

    // Join staff room
    Socket.emit("join-restaurant", {
      restaurantId,
      role, // "staff"
    });

    console.log(`Joining staff room for restaurant ${restaurantId}`);
  }, [restaurantId, role]);

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
    if (!restaurantId || role !== "chef") return; // ensure chef

    console.log("Joining chef room for restaurant:", restaurantId);

    Socket.emit("join-restaurant", {
      restaurantId,
      role, // this is critical
    });

    const handleNewOrder = (newOrder: IUserOrder) => {
      console.log("🔥 New order received:", newOrder);


      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      const notification = {
        id: newOrder.orderId,
        message: `New Order from Table ${newOrder.tableId}`,
      };

      setNotifications((prev) => [notification, ...prev]);

      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== newOrder.orderId),
        );
      }, 4000);

      playSound();
    };

    Socket.on("order:new", handleNewOrder);

    return () => {
      Socket.off("order:new", handleNewOrder);
    };
  }, [restaurantId, role]);


  const tabCounts = {
    Pending:
      orders?.filter(
        (order) =>
          order.items.some((i) => i.itemStatus === "PENDING") &&
          !order.items.some((i) => i.itemStatus === "PREPARING"),
      ).length ?? 0,

    Preparing:
      orders?.filter(
        (order) =>
          !order.items.every((i) => i.itemStatus === "READY") &&
          order.items.some((i) => i.itemStatus !== "PENDING"),
      ).length ?? 0,

    Completed:
      orders?.filter((order) =>
        order.items.every((i) => i.itemStatus === "READY"),
      ).length ?? 0,
  };

  const handleUpdateItem = async (
    orderId: string,
    itemId: string,
    newStatus: ItemStatus,
  ) => {
    let result = await updateOrder(orderId, itemId, newStatus);
    if (result.success) {
      showSuccessToast("order updated Successfully");
      setOrders((prev) => {
        return prev?.map((order) => {
          if (order.orderId === orderId) {
            return {
              ...order,
              items: order.items.map((item) => {
                if (item.itemId === itemId) {
                  return { ...item, itemStatus: newStatus };
                }
                return item;
              }),
            };
          }
          return order;
        });
      });
    }
  };

  useEffect(() => {
    if (!restaurantId || role !== "staff") return;

    const handleOrderCompleted = (data: {
      order: IUserOrder;
      orderId: string;
      message: string;
    }) => {
      console.log("✅ Order completed received on staff:", data.order);
      setOrders((prev) => [...prev, data.order]);
      // Add to notifications
      setNotifications((prev) => [
        { id: data.orderId, message: data.message },
        ...prev,
      ]);

      // Remove notification after 4 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== data.orderId));
      }, 4000);

      // Play notification sound
      playSound();
    };

    Socket.on("order:completed", handleOrderCompleted);

    return () => {
      Socket.off("order:completed", handleOrderCompleted);
    };
  }, [restaurantId, role]);

  useEffect(() => {
    console.log("Orders state changed:", orders);
  }, [orders]);
  const filteredOrders = orders?.filter((order) => {
    if (activeTab === "Pending") {
      return (
        order.items.some((i) => i.itemStatus === "PENDING") &&
        !order.items.some((i) => i.itemStatus === "PREPARING")
      );
    }
    // if (activeTab === "Preparing") {
    //   return order.items.some((i) => i.itemStatus === "PREPARING");
    // }
    if (activeTab === "Preparing") {
      return (
        !order.items.every((i) => i.itemStatus === "READY") &&
        order.items.some((i) => i.itemStatus !== "PENDING")
      );
    }

    if (activeTab === "Completed") {
      return order.items.every((i) => i.itemStatus === "READY");
    }
    return false;
  });

  const totalItems = orders?.reduce(
    (sum, order) => sum + order.items.length,
    0,
  );
  const readyItems = orders?.reduce(
    (sum, order) =>
      sum + order.items.filter((i) => i.itemStatus === "READY").length,
    0,
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <ToastContainer />
      <header className="bg-white border-b border-slate-200 shadow-sm p-6 mb-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              {role} <span className="text-emerald-600">Dashboard</span>
            </h1>
            <p className="text-slate-600">Real-time Kitchen Management</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-black text-slate-900">
                {readyItems}/{totalItems}
              </div>
              <div className="text-sm text-slate-600 font-bold">
                Items Ready
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
              <ChefHat />
            </div>
          </div>
        </div>
      </header>

      {/* 🔔 Notification Toasts */}
      <div className="fixed top-5 right-5 space-y-3 z-50">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl animate-slide-in"
          >
            🔥 {n.message}
          </div>
        ))}
      </div>

      <div className="bg-white border-b border-slate-200 mb-8">
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          {(role === "chef"
            ? (["Pending", "Preparing"] as const)
            : (["Completed"] as const)
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 font-bold text-sm border-b-2 transition-all ${
                activeTab === tab
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-500"
              }`}
            >
              {tab} Orders
              <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-100 text-xs">
                {tabCounts[tab]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders && filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onItemClick={(o, i) => {
                if (role == "staff") return;
                setSelectedItem({ order: o, item: i });
              }}
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-slate-400 font-bold">
            No {activeTab} orders at the moment.
          </div>
        )}
      </main>

      {selectedItem && (
        <UpdateItemModal
          order={selectedItem.order}
          item={selectedItem.item}
          tab={activeTab}
          onClose={() => setSelectedItem(null)}
          onUpdate={handleUpdateItem}
        />
      )}

      <style>{`
      @keyframes slide-in {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .animate-slide-in {
        animation: slide-in 0.3s ease-out forwards;
      }
        @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-scale-in { animation: scale-in 0.15s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ChefPage;
