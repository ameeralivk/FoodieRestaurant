import type { IUserOrder } from "../../../types/order";
import { Eye ,X } from "lucide-react";
interface Props {
  order: IUserOrder;
  onClose: () => void;
}
const STATUS_COLORS: Record<string, string> = {
  PLACED: "#f59e0b",
  IN_KITCHEN: "#8b5cf6",
  ASSIGNED: "#06b6d4",
  READY: "#10b981",
  SERVED: "#3b82f6",
  SERVING: "#6366f1",
  CANCELLED: "#ef4444",
};
const STATUS_LABELS: Record<string, string> = {
  PLACED: "Placed",
  IN_KITCHEN: "In Kitchen",
  ASSIGNED: "Assigned",
  READY: "Ready",
  SERVED: "Served",
  SERVING: "Serving",
  CANCELLED: "Cancelled",
};

const OrderDetailModal: React.FC<Props> = ({ order, onClose }) => {
  const statusStr = order.orderStatus as string;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-400" />
              Order Details
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {order.orderId || order._id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)] space-y-6">
          {/* Order Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Table
              </p>
              <p className="text-white font-bold text-lg">
                Table {order.tableId}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Status
              </p>
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border mt-1"
                style={{
                  backgroundColor: `${STATUS_COLORS[statusStr] || "#9ca3af"}15`,
                  color: STATUS_COLORS[statusStr] || "#9ca3af",
                  borderColor: `${STATUS_COLORS[statusStr] || "#9ca3af"}30`,
                }}
              >
                {STATUS_LABELS[statusStr] || statusStr}
              </span>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Placed At
              </p>
              <p className="text-white font-semibold text-sm">
                {new Date(order.createdAt).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Order Items
            </h3>
            <div className="bg-gray-800/30 rounded-xl border border-gray-800 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left p-3 text-xs font-semibold text-gray-500">
                      Item
                    </th>
                    <th className="text-left p-3 text-xs font-semibold text-gray-500">
                      Variant
                    </th>
                    <th className="text-center p-3 text-xs font-semibold text-gray-500">
                      Qty
                    </th>
                    <th className="text-right p-3 text-xs font-semibold text-gray-500">
                      Price
                    </th>
                    <th className="text-center p-3 text-xs font-semibold text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-800/50 last:border-b-0"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          {item.itemImages?.[0] && (
                            <img
                              src={item.itemImages[0]}
                              alt={item.itemName}
                              className="w-10 h-10 rounded-lg object-cover border border-gray-700"
                            />
                          )}
                          <span className="text-white text-sm font-medium">
                            {item.itemName}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-gray-400 text-sm">
                        {item.variant?.option
                          ? `${item.variant.category}: ${item.variant.option}`
                          : "—"}
                      </td>
                      <td className="p-3 text-center text-white text-sm font-medium">
                        {item.quantity}
                      </td>
                      <td className="p-3 text-right text-white text-sm font-medium">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{
                            backgroundColor: `${STATUS_COLORS[item.itemStatus] || "#9ca3af"}20`,
                            color: STATUS_COLORS[item.itemStatus] || "#9ca3af",
                          }}
                        >
                          {item.itemStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-gray-800/50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-white font-medium">
                ₹{order.subTotal.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold border-t border-gray-700 pt-2">
              <span className="text-gray-300">Total Amount</span>
              <span className="text-green-400">
                ₹{order.totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
