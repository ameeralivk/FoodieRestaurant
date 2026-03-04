import React from "react";
import { Clock, ChefHat, CheckCircle2 ,Truck } from "lucide-react";
import type {
  IOrderItem,
  IUserOrder,
  OrderItemStatus,
} from "../../../types/order";
type ItemStatus = OrderItemStatus;



interface Props {
  order: IUserOrder;
  onItemClick: (order: IUserOrder, item: IOrderItem) => void;
}

const getProgress = (items: IOrderItem[]) => {
  const ready = items.filter((item) => item.itemStatus === "READY").length;
  const preparing = items.filter(
    (item) => item.itemStatus === "PREPARING",
  ).length;
  const pending = items.filter((item) => item.itemStatus === "PENDING").length;
  const total = items.length;
  const percentage = Math.round((ready / total) * 100);

  return { ready, preparing, pending, total, percentage };
};

// =======================
// ITEM STATUS BADGE
// =======================
const ItemStatusBadge: React.FC<{ status: ItemStatus }> = ({ status }) => {
  const configs: Record<ItemStatus, any> = {
    PENDING: {
      bg: "bg-slate-100",
      text: "text-slate-700",
      border: "border-slate-300",
      icon: <Clock className="w-3 h-3" />,
    },

    ASSIGNED: {
      bg: "bg-purple-100",
      text: "text-purple-700",
      border: "border-purple-300",
      icon: <ChefHat className="w-3 h-3" />,
    },

    PREPARING: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      border: "border-amber-300",
      icon: <ChefHat className="w-3 h-3" />,
    },

    READY: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      border: "border-emerald-300",
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    SERVING: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      border: "border-blue-300",
      icon: <Truck className="w-3 h-3" />, 
    },
  };

  const config = configs[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${config.bg} ${config.text} ${config.border}`}
    >
      {config.icon}
      {status}
    </span>
  );
};


const OrderCard: React.FC<Props> = ({ order, onItemClick }) => {
  const progress = getProgress(order.items);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-baseline gap-3 mb-1">
              <h3 className="text-lg font-bold text-slate-900">
                {order.orderId}
              </h3>
              <span className="text-2xl font-black text-slate-900">
                Table {order.tableId}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock className="w-4 h-4" />
              <span>
                {new Date(order.createdAt).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600">Progress</span>
            <span className="text-xs font-bold text-slate-900">
              {progress.ready}/{progress.total} ready
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-2">
          {order.items.map((item) => (
            <button
              key={item._id}
              onClick={() => onItemClick(order, item)}
              className="w-full p-3 rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all text-left group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 group-hover:text-emerald-700">
                      {item.itemName}
                    </span>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      × {item.quantity}
                    </span>
                  </div>
                  {item.variant && (
                    <div className="text-xs text-blue-700 italic bg-blue-100 px-2 py-1 rounded-md mb-1">
                      🛍 Variant: {item.variant.option}
                    </div>
                  )}

                  {item.instraction && (
                    <div className="text-xs text-amber-700 italic bg-amber-100 px-2 py-1 rounded-md mb-1">
                      🍴 Instruction: {item.instraction}
                    </div>
                  )}
                </div>
                <ItemStatusBadge status={item.itemStatus} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
