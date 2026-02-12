import React from "react";

interface Props {
  progressPercentage: number;
  totalTime: string;
}

const OrderProgress: React.FC<Props> = ({ progressPercentage, totalTime }) => {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">
        Order Progress
      </h3>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            progressPercentage >= 100 ? "bg-green-500" : "bg-orange-500"
          }`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      {/* <p className="text-xs text-gray-500">Estimated time: {totalTime}</p> */}
    </div>
  );
};

export default OrderProgress;
