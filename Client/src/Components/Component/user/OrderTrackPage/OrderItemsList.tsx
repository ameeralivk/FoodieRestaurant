import React from "react";
import { Check, Package , ChefHat } from "lucide-react";
import type { IOrderItem } from "../../../../types/order";

interface Props {
  orderItems: IOrderItem[];
  total: number;
}

const OrderItemsList: React.FC<Props> = ({ orderItems, total }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Order Details</h3>
      <div className="space-y-4 mb-6">
        {orderItems.map((item) => (
          <div key={item._id} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">1x {item.itemName}</p>
              <p className="text-sm text-gray-500">₹{item.price.toFixed(2)}</p>
            </div>
            <div>
              {item.itemStatus === "READY" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                  <Check className="w-4 h-4" />
                  Ready
                </span>
              ) : item.itemStatus === "PREPARING" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                  <ChefHat className="w-4 h-4" />
                  Preparing
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                  <Package className="w-4 h-4" />
                  Pending
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <span className="text-lg font-bold text-gray-900">Total:</span>
        <span className="text-lg font-bold text-gray-900">
          ₹{total.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default OrderItemsList;
