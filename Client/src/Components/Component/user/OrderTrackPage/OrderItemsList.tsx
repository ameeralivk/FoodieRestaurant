import React, { useEffect, useState } from "react";
import { Check, Package, ChefHat, UserCheck } from "lucide-react";
import type { IOrderItem } from "../../../../types/order";

interface Props {
  orderItems: IOrderItem[];
  total: number;
}

const OrderItemsList: React.FC<Props> = ({ orderItems, total }) => {
  const [timers, setTimers] = useState<Record<string, number>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTimers: Record<string, number> = {};

      orderItems.forEach((item) => {
        if (item.itemStatus === "PREPARING" && item.updatedAt) {
          const start = new Date(item.updatedAt).getTime();

          const totalSeconds = Number(item.preparationTime) * 60;

          const elapsedSeconds = Math.floor((Date.now() - start) / 1000);

          const remaining = Math.max(totalSeconds - elapsedSeconds, 0);

          updatedTimers[item.itemId] = remaining;
        }
      });

      setTimers(updatedTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [orderItems]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Order Details</h3>

      <div className="space-y-4 mb-6">
        {orderItems.map((item) => (
          <div key={item.itemId} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">
                {item.quantity} x {item.itemName}
              </p>
              <p className="text-sm text-gray-500">₹{item.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center gap-3">
              {/* TIMER */}
              {item.itemStatus === "PREPARING" && (
                <span className="text-sm font-mono text-gray-700">
                  Estimated prep time:{" "}
                  {formatTime(
                    timers[item.itemId] ?? Number(item.preparationTime) * 60,
                  )}
                </span>
              )}

              {/* STATUS BADGE */}
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
              ) : item.itemStatus === "ASSIGNED" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                  <UserCheck className="w-4 h-4" />
                  Assigned
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
