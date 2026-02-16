import React from "react";
import { Clock, User } from "lucide-react";
import type { IUserOrder, OrderItemStatus } from "../../../types/order";
export type ItemStatus = "preparing" | "ready" | "served";

export type OrderStatus = "ready" | "serving" | "completed";

export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  status: ItemStatus;
};

export type Staff = {
  id: string;
  name: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  tableNumber: number;
  orderTime: string;
  totalAmount: number;
  status: OrderStatus;
  items: OrderItem[];
  assignedStaff?: Staff;
};

const ItemStatusBadge: React.FC<{ status: OrderItemStatus }> = ({ status }) => {
  const colors = {
    PENDING: "bg-gray-100 text-gray-700 border border-gray-300",
    ASSIGNED: "bg-blue-100 text-blue-700 border border-blue-300",
    PREPARING: "bg-amber-100 text-amber-700 border border-amber-300",
    READY: "bg-emerald-100 text-emerald-700 border border-emerald-300",
  };

  return (
    <span className={`text-xs font-bold px-2 py-1 rounded ${colors[status]}`}>
      {status}
    </span>
  );
};

type Props = {
  order: IUserOrder;
  onAssign?: () => void;
};

const StaffOrderCard: React.FC<Props> = ({
  order,
  onAssign,
}) => {
  // const isAssignedToMe = order.assignedStaff?.id === currentStaff.id;

return (
  <div
    className="
      bg-white
      rounded-xl
      border
      shadow-sm
      p-3 sm:p-4
      w-full
      hover:shadow-md
      transition
    "
  >
    {/* Header */}
    <div className="flex justify-between gap-2 mb-3">
      <div className="min-w-0">
        <h3 className="font-bold text-sm sm:text-base truncate">
          {order.orderId}
        </h3>

        <p className="text-xs sm:text-sm text-gray-500">
          Table {order.tableId}
        </p>

        <p className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1">
          <Clock size={14} />
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="font-bold text-sm sm:text-base whitespace-nowrap">
        ₹{order.totalAmount}
      </div>
    </div>

    {/* Items */}
    <div className="space-y-2 mb-3 max-h-40 overflow-y-auto pr-1">
      {order.items.map((item) => (
        <div
          key={item._id}
          className="
            flex
            justify-between
            items-center
            bg-gray-50
            p-2
            rounded
            gap-2
          "
        >
          <span className="text-xs sm:text-sm truncate">
            {item.itemName} × {item.quantity}
          </span>

          <ItemStatusBadge status={item.itemStatus} />
        </div>
      ))}
    </div>

    {/* Button */}
    <button
      onClick={onAssign}
      className="
        w-full
        bg-black
        hover:bg-gray-800
        active:bg-gray-900
        text-white
        text-xs sm:text-sm
        py-2
        rounded
        transition
        cursor-pointer
      "
    >
      Assign to Me
    </button>
  </div>
);

};

export default StaffOrderCard;
