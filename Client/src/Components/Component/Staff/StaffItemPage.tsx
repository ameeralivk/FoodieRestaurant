import React, { useState } from "react";
import ChefUpdateItemModal from "../../modals/Cheff/CheffUpdateItemModal";
import { useQuery } from "@tanstack/react-query";
import { updateOrder } from "../../../services/staffService";
import { showSuccessToast } from "../../Elements/SuccessToast";
import {
  getAssignedItems,
  getTotalOrders,
} from "../../../services/staffService";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import type {
  AssignedItem,
  AssignedItemsResponse,
  IUserOrder,
} from "../../../types/order";
import { ToastContainer } from "react-toastify";
import type { IVarientItemType } from "../../../types/varient";
import { useEffect } from "react";
import Socket from "../../../socket";
import ChefOrderStats from "../../Elements/Staff/chefOrderState";
import { useQueryClient } from "@tanstack/react-query";
export type ItemStatus = "ASSIGNED" | "PREPARING" | "READY" | "PENDING";

interface Order {
  orderId: string;
  orderNumber: string;
  tableNumber: number;
}

interface OrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  station?: string;
  itemStatus: ItemStatus;
  instruction?: string | null;
  variant?: IVarientItemType | null;
  assignedCookId?: string;
  itemImages?: string[];
  price: number;
}

interface MyItem {
  order: Order;
  item: OrderItem;
}

export interface CheffItemResponse {
  success: boolean;
  data: MyItem[];
}

const MyItemsSection: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<AssignedItem | null>(null);
  const userId = useSelector((state: RootState) => state.userAuth.user?._id);
  const restaurantId = useSelector(
    (state: RootState) => state.userAuth.user?.restaurantId,
  );
  const [currentPage] = useState(1);
  const limit = 10;
  const [ordersData, setOrdersData] = useState<{
    success: boolean;
    data: IUserOrder[];
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  //   const { data } = useQuery<{ success: boolean; data: MyItem[] }>(
  //     ["orders", userId, currentPage, limit],
  //     () => getTotalOrders(restaurantId as string, "true")
  //   );

  useEffect(() => {
    if (!userId) return;
    Socket.emit("join-restaurant", {
      restaurantId,
      role: "chef",
    });
    // join cook room
    Socket.emit("joinRoom", `${userId}-cook`);

    const handleItemAssigned = () => {
      console.log("🔔 New item assigned");
      showSuccessToast("New item assigned to you 👨‍🍳");
    };
    Socket.on("order:itemAssigned", handleItemAssigned);
    return () => {
      Socket.off("order:itemAssigned", handleItemAssigned);
    };
  }, [userId]);

  const { data, refetch } = useQuery<AssignedItemsResponse>({
    queryKey: ["orders", userId, currentPage, limit],
    queryFn: () => getAssignedItems(restaurantId as string, userId as string),
  });
  useEffect(() => {
    const fetchTotalOrders = async () => {
      try {
        setLoading(true);
        // const response = await getTotalOrders(restaurantId as string);
        // setOrdersData(response);
        const isToday = (date: string) => {
          const d = new Date(date);
          const t = new Date();

          return (
            d.getFullYear() === t.getFullYear() &&
            d.getMonth() === t.getMonth() &&
            d.getDate() === t.getDate()
          );
        };

        const response = await getTotalOrders(restaurantId as string);

        const todayOrders = response.data.filter((order: any) =>
          isToday(order.createdAt),
        );

        setOrdersData({ ...response, data: todayOrders });
      } catch (error) {
        console.error("Failed to fetch total orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchTotalOrders();
    }
  }, [restaurantId, data, queryClient]);

  // map API data to your MyItem type (if needed)
  const Items: AssignedItem[] =
    data?.data.filter((order) => order.item.itemStatus != "READY") || [];

  const handleUpdateStatus = async (
    orderId: string,
    itemId: string,
    newStatus: ItemStatus,
    varient?: IVarientItemType,
  ) => {
    const result = await updateOrder(
      orderId,
      itemId,
      newStatus,
      varient?._id.toString(),
    );

    if (result.success) {
      showSuccessToast("order updated Successfully");
      refetch();
    }

    // Call API to update item status
    setSelectedItem(null);
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

  const stats = {
    // Items not assigned to any cook
    available:
      ordersData?.data
        ?.flatMap((order) => order.items)
        ?.filter((item) => item.itemStatus === "PENDING")?.length ?? 0,

    // Items assigned to this cook but not started (ASSIGNED)
    myAssigned:
      data?.data.filter(
        (d) => d.item.assignedCookId && d.item.itemStatus === "ASSIGNED",
      ).length || 0,

    // Items preparing
    myPreparing:
      data?.data.filter(
        (d) => d.item.assignedCookId && d.item.itemStatus === "PREPARING",
      ).length || 0,

    // Items ready
    // myReady:
    //   data?.data.filter(
    //     (d) => d.item.assignedCookId && d.item.itemStatus === "READY",
    //   ).length || 0,
    myReady:
      data?.data.filter(
        (d) =>
          d.item.assignedCookId &&
          d.item.itemStatus === "READY" &&
          isToday(d.createdAt), // 👈 this line added
      ).length || 0,
  };

  return (
    <div className="max-w-9xl mx-auto px-6 pb-8">
      <ChefOrderStats stats={stats} />
      <h2 className="text-xl font-bold mb-4">My Items ({Items.length})</h2>
      {loading && <h1>Loading........</h1>}
      <ToastContainer />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Items.map(({ orderId, item, tableNumber, orderStatus }) => (
          <button
            key={item.itemId}
            onClick={() =>
              setSelectedItem({
                orderId,
                item,
                tableNumber: tableNumber,
                orderStatus: orderStatus,
              })
            }
            className="bg-white border rounded-xl p-5 hover:border-emerald-500 hover:shadow-md transition text-left"
          >
            <div className="text-sm text-gray-500">
              {orderId} • Table {tableNumber}
            </div>

            <div className="font-bold text-lg">{item.itemName}</div>

            <div className="text-sm">Qty: {item.quantity}</div>

            <div className="text-xs font-bold mt-2 text-emerald-600">
              Status: {item.itemStatus}
            </div>
          </button>
        ))}
      </div>
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

