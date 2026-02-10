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
import { getTotalOrders } from "../../../services/staffService";
// ============================================================================
// TYPES
// ============================================================================

type ItemStatus = "PENDING" | "PREPARING" | "READY";

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

const getOrderStatus = (
  items: IOrderItem[],
): "Pending" | "Preparing" | "Completed" => {
  const allReady = items.every((item) => item.itemStatus === "READY");
  if (allReady) return "Completed";

  const anyPreparing = items.some(
    (item) => item.itemStatus === "PREPARING" || item.itemStatus === "READY",
  );
  if (anyPreparing) return "Preparing";

  return "Pending";
};

const ChefPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "Pending" | "Preparing" | "Completed"
  >("Pending");
  const [selectedItem, setSelectedItem] = useState<{
    order: IUserOrder;
    item: IOrderItem;
  } | null>(null);
  const userId = useSelector((state: RootState) => state.userAuth.user?._id);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const role = useSelector((state: RootState) => state.userAuth.user?.role);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data } = useQuery<{ success: boolean; data: IUserOrder[] }>({
    queryKey: ["orders", userId, currentPage, limit],
    queryFn: () => getTotalOrders("PLACED"),
  });
  const [orders, setOrders] = useState<IUserOrder[]>([]);

  console.log(data, "data is here");

  useEffect(() => {
    if (data?.data) {
      setOrders(data.data);
    }
  }, [data]);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/universfield-new-notification-026-380249.mp3");
  }, []);

  const playSound = () => {
    audioRef.current?.play().catch(() => {});
  };

  useEffect(() => {
    const handleNewOrder = (newOrder: IUserOrder) => {
      console.log("🔥 New order received:", newOrder);

      setOrders((prev) => {
        // prevent duplicates
        if (prev?.some((o) => o.orderId === newOrder.orderId)) {
          return prev;
        }
        return [newOrder, ...prev];
      });
      playSound();
    };

    Socket.on("order:new", handleNewOrder);

    return () => {
      Socket.off("order:new", handleNewOrder);
    };
  }, []);

  const handleUpdateItem = (
    orderId: string,
    itemId: string,
    newStatus: ItemStatus,
  ) => {
    setOrders((prev) =>
      prev?.map((order) =>
        order.orderId === orderId
          ? {
              ...order,
              items: order.items.map((item) =>
                item.itemId === itemId
                  ? {
                      ...item,
                      status: newStatus,
                    }
                  : item,
              ),
            }
          : order,
      ),
    );
  };

  const filteredOrders = orders?.filter(
    (order) => getOrderStatus(order.items) === activeTab,
  );
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
      <header className="bg-white border-b border-slate-200 shadow-sm p-6 mb-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              Chef <span className="text-emerald-600">Dashboard</span>
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
                {
                  data?.data?.filter((o) => getOrderStatus(o.items) === tab)
                    .length
                }
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
              onItemClick={(o, i) => setSelectedItem({ order: o, item: i })}
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
          onClose={() => setSelectedItem(null)}
          onUpdate={handleUpdateItem}
        />
      )}

      <style>{`
        @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-scale-in { animation: scale-in 0.15s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ChefPage;
