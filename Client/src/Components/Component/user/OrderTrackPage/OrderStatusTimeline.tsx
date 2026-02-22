

import React from "react";

interface OrderStatus {
  label: string;
  time: string;
  icon: React.ReactNode;
  statusKey: string; // unique key to identify this step
}

interface Props {
  orderStatuses: OrderStatus[];
  currentStatus: string; // e.g., "preparing"
}

const OrderStatusTimeline: React.FC<Props> = ({ orderStatuses, currentStatus }) => {
  // determine step completion dynamically
  const getCompletion = (stepKey: string) => {
    const currentIndex = orderStatuses.findIndex((s) => s.statusKey === currentStatus);
    const stepIndex = orderStatuses.findIndex((s) => s.statusKey === stepKey);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "pending";
  };

  return (
    <div className="mb-8">
      {orderStatuses.map((status, index) => {
        const completion = getCompletion(status.statusKey);

        return (
          <div key={index} className="flex items-start mb-4 last:mb-0">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                completion === "completed"
                  ? "bg-gray-900 border-gray-900"
                  : completion === "current"
                  ? "bg-orange-500 border-orange-500"
                  : "bg-white border-gray-300"
              }`}
            >
              <div
                className={
                  completion === "completed" || completion === "current"
                    ? "text-white"
                    : "text-gray-400"
                }
              >
                {status.icon}
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p
                className={`font-medium ${
                  completion === "completed" || completion === "current"
                    ? "text-gray-900"
                    : "text-gray-500"
                }`}
              >
                {status.label}
              </p>
              <p className="text-sm text-gray-500">{status.time}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatusTimeline;

