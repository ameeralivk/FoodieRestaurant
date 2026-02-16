// import React, { useState } from "react";
// import { X, UserPlus, ChefHat, CheckCircle2 } from "lucide-react";

// export type ItemStatus = "assigned" | "preparing" | "ready";

// export interface Order {
//   id: string;
//   orderNumber: string;
//   tableNumber: number;
// }

// export interface OrderItem {
//   id: string;
//   name: string;
//   quantity: number;
//   station: string;
//   status: ItemStatus;
// }

// interface Props {
//   order: Order;
//   item: OrderItem;
//   onClose: () => void;
//   onUpdate: (
//     orderId: string,
//     itemId: string,
//     newStatus: ItemStatus
//   ) => void;
// }

// const ChefUpdateItemModal: React.FC<Props> = ({
//   order,
//   item,
//   onClose,
//   onUpdate,
// }) => {
//   const [selectedStatus, setSelectedStatus] =
//     useState<ItemStatus>(item.status);

//   const handleUpdate = () => {
//     onUpdate(order.id, item.id, selectedStatus);
//     onClose();
//   };

//   // Allowed transitions
//   const availableStatuses: ItemStatus[] = [];

//   if (item.status === "assigned") {
//     availableStatuses.push("assigned", "preparing");
//   }

//   if (item.status === "preparing") {
//     availableStatuses.push("preparing", "ready");
//   }

//   if (item.status === "ready") {
//     availableStatuses.push("ready");
//   }

//   return (
//     <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">

//       {/* Modal */}
//       <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">

//         {/* Header */}
//         <div className="p-6 border-b">

//           <div className="flex justify-between items-center">

//             <div>
//               <h2 className="text-xl font-bold">
//                 Update Item Status
//               </h2>

//               <p className="text-sm text-gray-500">
//                 {order.orderNumber} • Table {order.tableNumber}
//               </p>
//             </div>

//             <button
//               onClick={onClose}
//               className="p-2 hover:bg-gray-100 rounded-lg"
//             >
//               <X size={20} />
//             </button>

//           </div>

//         </div>

//         {/* Item Info */}
//         <div className="p-6">

//           <div className="bg-gray-50 p-4 rounded-lg mb-4">

//             <div className="font-bold text-lg">
//               {item.name}
//             </div>

//             <div className="text-sm text-gray-500">
//               Quantity: {item.quantity}
//             </div>

//           </div>

//           {/* Status buttons */}
//           <div className="space-y-3">

//             {availableStatuses.includes("assigned") && (
//               <button
//                 onClick={() => setSelectedStatus("assigned")}
//                 disabled={item.status !== "assigned"}
//                 className={`w-full p-4 rounded-lg border text-left flex gap-3 items-center
//                 ${
//                   selectedStatus === "assigned"
//                     ? "border-blue-500 bg-blue-50"
//                     : "border-gray-200"
//                 }`}
//               >
//                 <UserPlus className="text-blue-600" />
//                 <div>
//                   <div className="font-semibold">
//                     Assigned
//                   </div>
//                   <div className="text-xs text-gray-500">
//                     Item assigned but not started
//                   </div>
//                 </div>
//               </button>
//             )}

//             {availableStatuses.includes("preparing") && (
//               <button
//                 onClick={() => setSelectedStatus("preparing")}
//                 className={`w-full p-4 rounded-lg border text-left flex gap-3 items-center
//                 ${
//                   selectedStatus === "preparing"
//                     ? "border-amber-500 bg-amber-50"
//                     : "border-gray-200"
//                 }`}
//               >
//                 <ChefHat className="text-amber-600" />
//                 <div>
//                   <div className="font-semibold">
//                     Preparing
//                   </div>
//                   <div className="text-xs text-gray-500">
//                     Item is being cooked
//                   </div>
//                 </div>
//               </button>
//             )}

//             {availableStatuses.includes("ready") && (
//               <button
//                 onClick={() => setSelectedStatus("ready")}
//                 disabled={item.status === "ready"}
//                 className={`w-full p-4 rounded-lg border text-left flex gap-3 items-center
//                 ${
//                   selectedStatus === "ready"
//                     ? "border-green-500 bg-green-50"
//                     : "border-gray-200"
//                 }`}
//               >
//                 <CheckCircle2 className="text-green-600" />
//                 <div>
//                   <div className="font-semibold">
//                     Ready
//                   </div>
//                   <div className="text-xs text-gray-500">
//                     Item ready for pickup
//                   </div>
//                 </div>
//               </button>
//             )}

//           </div>

//         </div>

//         {/* Footer */}
//         <div className="p-6 border-t flex gap-3">

//           <button
//             onClick={onClose}
//             className="flex-1 bg-gray-100 hover:bg-gray-200 p-3 rounded-lg"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleUpdate}
//             disabled={selectedStatus === item.status}
//             className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-lg disabled:opacity-50"
//           >
//             Update
//           </button>

//         </div>

//       </div>

//     </div>
//   );
// };

// export default ChefUpdateItemModal;

import React, { useState } from "react";
import { X, UserPlus, ChefHat, CheckCircle2 } from "lucide-react";
import type { AssignedItem, AssignItem } from "../../../types/order";
import type { IVarientItemType } from "../../../types/varient";

export type ItemStatus = "ASSIGNED" | "PREPARING" | "READY" | "PENDING";

export interface Order {
  orderId: string;
  orderNumber: string;
  tableNumber: number;
}

export interface OrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  station?: string;
  itemStatus: ItemStatus;
  instruction?: string | null;
  variant?: IVarientItemType;
  assignedCookId?: string;
  itemImages?: string[];
  price: number;
}

interface Props {
  tableNo: string;
  orderId: string;
  item: AssignItem;
  onClose: () => void;
  onUpdate: (orderId: string, itemId: string, newStatus: ItemStatus,variant?:IVarientItemType) => void;
}

const ChefUpdateItemModal: React.FC<Props> = ({
  tableNo,
  orderId,
  item,
  onClose,
  onUpdate,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<ItemStatus>(
    item.itemStatus,
  );

  const handleUpdate = () => {
    if(!item.variant){
      onUpdate(orderId, item.itemId, selectedStatus);
    }else{
       onUpdate(orderId, item.itemId, selectedStatus,item.variant);
    }
    onClose();
  };

  // Allowed transitions
  const availableStatuses: ItemStatus[] = [];
  if (item.itemStatus === "ASSIGNED") {
    availableStatuses.push("ASSIGNED", "PREPARING");
  } else if (item.itemStatus === "PREPARING") {
    availableStatuses.push("PREPARING", "READY");
  } else if (item.itemStatus === "READY") {
    availableStatuses.push("READY");
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      {/* Modal */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Update Item Status</h2>
            <p className="text-sm text-gray-500">
              {orderId} • Table {tableNo}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Item Info */}
        <div className="p-6">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="font-bold text-lg">{item.itemName}</div>
            <div className="text-sm text-gray-500">
              Quantity: {item.quantity}
            </div>
            {item.variant && (
              <div className="text-xs text-gray-500 mt-1">
                Variant: {item.variant?.option}
              </div>
            )}
            {item.instruction && (
              <div className="text-xs text-gray-700 mt-2 bg-yellow-50 p-2 rounded-md border-l-4 border-yellow-400">
                <span className="font-semibold">Note:</span> {item.instruction}
              </div>
            )}
          </div>

          {/* Status buttons */}
          <div className="space-y-3">
            {availableStatuses.includes("ASSIGNED") && (
              <button
                onClick={() => setSelectedStatus("ASSIGNED")}
                disabled={item.itemStatus !== "ASSIGNED"}
                className={`w-full p-4 rounded-lg border text-left flex gap-3 items-center ${
                  selectedStatus === "ASSIGNED"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <UserPlus className="text-blue-600" />
                <div>
                  <div className="font-semibold">Assigned</div>
                  <div className="text-xs text-gray-500">
                    Item assigned but not started
                  </div>
                </div>
              </button>
            )}

            {availableStatuses.includes("PREPARING") && (
              <button
                onClick={() => setSelectedStatus("PREPARING")}
                className={`w-full p-4 rounded-lg border text-left flex gap-3 items-center ${
                  selectedStatus === "PREPARING"
                    ? "border-amber-500 bg-amber-50"
                    : "border-gray-200"
                }`}
              >
                <ChefHat className="text-amber-600" />
                <div>
                  <div className="font-semibold">Preparing</div>
                  <div className="text-xs text-gray-500">
                    Item is being cooked
                  </div>
                </div>
              </button>
            )}

            {availableStatuses.includes("READY") && (
              <button
                onClick={() => setSelectedStatus("READY")}
                disabled={item.itemStatus === "READY"}
                className={`w-full p-4 rounded-lg border text-left flex gap-3 items-center ${
                  selectedStatus === "READY"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200"
                }`}
              >
                <CheckCircle2 className="text-green-600" />
                <div>
                  <div className="font-semibold">Ready</div>
                  <div className="text-xs text-gray-500">
                    Item ready for pickup
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 p-3 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={selectedStatus === item.itemStatus}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-lg disabled:opacity-50"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChefUpdateItemModal;
