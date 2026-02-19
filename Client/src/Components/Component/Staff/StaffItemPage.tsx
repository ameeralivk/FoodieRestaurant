// import React, { useState } from "react";
// import ChefUpdateItemModal from "../../modals/Cheff/CheffUpdateItemModal";
// import { useQuery } from "@tanstack/react-query";
// import { getTotalOrders } from "../../../services/staffService";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../redux/store/store";
// import type { IUserOrder } from "../../../types/order";
// type ItemStatus = "assigned" | "preparing" | "ready";

// interface Order {
//   id: string;
//   orderNumber: string;
//   tableNumber: number;
// }

// interface OrderItem {
//   id: string;
//   name: string;
//   quantity: number;
//   station: string;
//   status: ItemStatus;
// }

// interface MyItem {
//   order: Order;
//   item: OrderItem;
// }

// const MyItemsSection = () => {
//   const [selectedItem, setSelectedItem] = useState<MyItem | null>(null);
//   const userId = useSelector((state: RootState) => state.userAuth.user?._id);
//   const [currentPage, setCurrentPage] = useState(1);
//   const restaurantId = useSelector(
//     (state: RootState) => state.userAuth.user?.restaurantId,
//   );
//   const limit = 10;
//   // ✅ Dummy Data
//   const myItems: MyItem[] = [
//     {
//       order: {
//         id: "ORD-101",
//         orderNumber: "ORD-101",
//         tableNumber: 4,
//       },
//       item: {
//         id: "ITEM-1",
//         name: "Burger",
//         quantity: 2,
//         station: "Grill",
//         status: "assigned",
//       },
//     },
//     {
//       order: {
//         id: "ORD-102",
//         orderNumber: "ORD-102",
//         tableNumber: 3,
//       },
//       item: {
//         id: "ITEM-2",
//         name: "Shawarma",
//         quantity: 1,
//         station: "Arabic",
//         status: "preparing",
//       },
//     },
//     {
//       order: {
//         id: "ORD-103",
//         orderNumber: "ORD-103",
//         tableNumber: 7,
//       },
//       item: {
//         id: "ITEM-3",
//         name: "Biryani",
//         quantity: 3,
//         station: "Main",
//         status: "ready",
//       },
//     },
//   ];

//   const { data } = useQuery<{ success: boolean; data: IUserOrder[] }>({
//     queryKey: ["orders", userId, currentPage, limit],
//     queryFn: () => getTotalOrders(restaurantId as string, "true"),
//   });

//   console.log(data, "ameer");

//   // ✅ Update handler
//   const handleUpdateStatus = (
//     orderId: string,
//     itemId: string,
//     newStatus: ItemStatus,
//   ) => {
//     console.log("Updating:", orderId, itemId, newStatus);

//     // here call your API
//     // assignChefToItem or updateItemStatus API

//     setSelectedItem(null);
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-6 pb-8">
//       {/* Heading */}
//       <h2 className="text-xl font-bold mb-4">My Items ({myItems.length})</h2>

//       {/* Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {myItems.map(({ order, item }) => (
//           <button
//             key={item.id}
//             onClick={() => setSelectedItem({ order, item })}
//             className="bg-white border rounded-xl p-5 hover:border-emerald-500 hover:shadow-md transition text-left"
//           >
//             <div className="text-sm text-gray-500">
//               {order.orderNumber} • Table {order.tableNumber}
//             </div>

//             <div className="font-bold text-lg">{item.name}</div>

//             <div className="text-sm">Qty: {item.quantity}</div>

//             <div className="text-xs text-gray-500 mt-2">
//               Station: {item.station}
//             </div>

//             <div className="text-xs font-bold mt-2 text-emerald-600">
//               Status: {item.status}
//             </div>
//           </button>
//         ))}
//       </div>

//       {/* ✅ Modal */}
//       {selectedItem && (
//         <ChefUpdateItemModal
//           order={selectedItem.order}
//           item={selectedItem.item}
//           onClose={() => setSelectedItem(null)}
//           onUpdate={handleUpdateStatus}
//         />
//       )}
//     </div>
//   );
// };

// export default MyItemsSection;

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
import { useEffect, useRef } from "react";
import Socket from "../../../socket";
import ChefOrderStats from "../../Elements/Staff/chefOrderState";

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
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [ordersData, setOrdersData] = useState<{
    success: boolean;
    data: IUserOrder[];
  } | null>(null);

  const [loading, setLoading] = useState(false);

  //   const { data } = useQuery<{ success: boolean; data: MyItem[] }>(
  //     ["orders", userId, currentPage, limit],
  //     () => getTotalOrders(restaurantId as string, "true")
  //   );

  useEffect(() => {
    if (!userId) return;

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

        const response = await getTotalOrders(restaurantId as string);

        setOrdersData(response);
      } catch (error) {
        console.error("Failed to fetch total orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchTotalOrders();
    }
  }, [restaurantId]);

  // map API data to your MyItem type (if needed)
  const Items: AssignedItem[] = data?.data || [];

  const handleUpdateStatus = async (
    orderId: string,
    itemId: string,
    newStatus: ItemStatus,
    varient?: IVarientItemType,
  ) => {
    console.log(varient, "varient is here amere");
    let result = await updateOrder(
      orderId,
      itemId,
      newStatus,
      varient?._id.toString(),
    );
    console.log(result, "resule");
    if (result.success) {
      showSuccessToast("order updated Successfully");
      refetch();
    }

    // Call API to update item status
    setSelectedItem(null);
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
    myReady:
      data?.data.filter(
        (d) => d.item.assignedCookId && d.item.itemStatus === "READY",
      ).length || 0,
  };

  return (
    <div className="max-w-9xl mx-auto px-6 pb-8">
      <ChefOrderStats stats={stats} />
      <h2 className="text-xl font-bold mb-4">My Items ({Items.length})</h2>
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

            {/* {item.station && (
              <div className="text-xs text-gray-500 mt-2">
                Station: {item.station}
              </div>
            )} */}

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
