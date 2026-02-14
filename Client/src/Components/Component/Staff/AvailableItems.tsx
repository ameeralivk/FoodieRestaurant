import React, { useState } from "react";
import { Package, UserPlus } from "lucide-react";
import ChefAssignModal from "../../modals/Cheff/CheffAssignModal";
import { useQuery } from "@tanstack/react-query";
import type { IUserOrder } from "../../../types/order";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import { useQueryClient } from "@tanstack/react-query";
import {
  assignChefToItem,
  getTotalOrders,
} from "../../../services/staffService";
import { showSuccessToast } from "../../Elements/SuccessToast";
type UserRole = "chef" | "staff";
interface User {
  id: string;
  name: string;
  role: UserRole;
  station?: string;
}

const AvailableItemsSection = () => {
  // 🔹 Dummy Data
  const userId = useSelector((state: RootState) => state.userAuth.user?._id);
  const StaffName = useSelector(
    (state: RootState) => state.userAuth.user?.name,
  );
  const queryClient = useQueryClient();
  const restaurantId = useSelector(
    (state: RootState) => state.userAuth.user?.restaurantId,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 1000;
  const { data } = useQuery<{ success: boolean; data: IUserOrder[] }>({
    queryKey: ["orders", userId, currentPage, limit],
    queryFn: () => getTotalOrders(restaurantId as string),
  });

  let items =
    data?.data.flatMap((order) =>
      order.items
        .filter((item) => !item.assignedCookId)
        .map((item) => ({
          orderId: order.orderId,
          tableId: order.tableId,
          orderStatus: order.orderStatus,
          createdAt: order.createdAt,
          restaurantId: order.restaurantId,

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

  const currentUser: User = {
    id: "chef1",
    name: "Chef Ameer",
    role: "chef",
    station: "Main Course",
  };

  const assignItemToChef = async (orderId: string, itemId: string) => {
    let res = await assignChefToItem(orderId, itemId, userId ? userId : "");
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
              key={item.itemId}
              onClick={() =>
                setSelectedItem({
                  orderId: item.orderId,
                  itemId: item.itemId,
                  price: item.price,
                  itemName: item.itemName,
                  quantity: item.quantity,
                  createdAt: item.createdAt,
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
          onAssign={(orderId, itemId) => assignItemToChef(orderId, itemId)}
        />
      )}

      {/* Optional: Just to see selected item in console */}
      {selectedItem && console.log("Selected:", selectedItem)}
    </div>
  );
};

export default AvailableItemsSection;
