import React, { useState } from "react";
import { Clock, ChefHat, CheckCircle2, X } from "lucide-react";
import type { IOrderItem, IUserOrder, OrderItemStatus } from "../../../types/order";

// =======================
// TYPES
// =======================
type ItemStatus = "PENDING" | "PREPARING" | "READY";

interface Props {
  order: IUserOrder;
  item: IOrderItem;
  tab: "Pending" | "Preparing" | "Completed";
  onClose: () => void;
  onUpdate: (orderId: string, itemId: string, newStatus: OrderItemStatus) => void;
}

// =======================
// COMPONENT
// =======================
const UpdateItemModal: React.FC<Props> = ({
  order,
  item,
  onClose,
  onUpdate,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderItemStatus>(
    item.itemStatus,
  );

  const handleUpdate = () => {
    console.log("Hellow");
    onUpdate(order.orderId, item.itemId, selectedStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Update Item</h2>
            <p className="text-sm text-slate-600 mt-1">
              Order {order.orderId} • Table {order.tableId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900">
                {item.itemName}
              </h3>
              <span className="text-sm font-bold text-slate-600 bg-white px-3 py-1 rounded-lg border border-slate-200">
                × {item.quantity}
              </span>
            </div>
            {/* {item.station && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <ChefHat className="w-4 h-4" />
                <span>{item.station}</span>
              </div>
            )} */}
          </div>

          {/* Chef Name */}
          {/* <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Chef Name</label>
            <input
              type="text"
              value={chefName}
              onChange={(e) => { setChefName(e.target.value); setShowError(false); }}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
            {showError && (
              <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> Chef name is required for Preparing/Ready status
              </p>
            )}
          </div> */}

          {/* Status Buttons */}
        <div className="space-y-2">
  <label className="block text-sm font-bold text-slate-700 mb-3">
    Update Status
  </label>

  {(["PENDING", "PREPARING", "READY"] as ItemStatus[]).map((status) => {
    // Hide buttons that are below or equal to current item status
    if (
      (item.itemStatus === "PENDING" && status === "PENDING") ||
      (item.itemStatus === "PREPARING" &&
        (status === "PENDING" || status === "PREPARING")) ||
      (item.itemStatus === "READY")
    ) {
      return null;
    }

    return (
      <button
        key={status}
        onClick={() => setSelectedStatus(status)}
        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
          selectedStatus === status
            ? "border-emerald-400 bg-emerald-50 shadow-sm"
            : "border-slate-200 hover:border-slate-300 bg-white"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {status === "PENDING" && (
              <Clock className="w-5 h-5 text-slate-400" />
            )}
            {status === "PREPARING" && (
              <ChefHat className="w-5 h-5 text-amber-600" />
            )}
            {status === "READY" && (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            )}
            <div className="font-bold text-slate-900">{status}</div>
          </div>

          {selectedStatus === status && (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          )}
        </div>
      </button>
    );
  })}
</div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200"
          >
            Update Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateItemModal;
