import { ChefHat, AlertCircle, X } from "lucide-react";
type FlattenedItem = {
  orderId: string;
  tableId: number;
  itemId: string;
  itemName: string;
  quantity: number;
  itemStatus: string;
  assignedCookId?: string;
  price: number;
  itemImages?: string[];
  createdAt: string;
};

const ChefAssignModal: React.FC<{
  item: FlattenedItem;
  currentChef: String;
  onClose: () => void;
  onAssign: (orderId: string, itemId: string) => void;
}> = ({ item, currentChef, onClose, onAssign }) => {
  const handleAssign = () => {
    onAssign(item.orderId, item.itemId);
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex justify-between">
            <div>
              <h2 className="text-2xl font-black">Assign to Yourself</h2>

              <p className="text-sm text-slate-600">
                Order {item.orderId} • Table {item.tableId}
              </p>

              <p className="text-xs text-slate-500">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>

            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Item info */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border">
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold text-lg">{item.itemName}</h3>

                <div className="text-sm text-slate-600">
                  Quantity: {item.quantity}
                </div>

                <div className="text-sm text-slate-600">
                  Price: ₹{item.price}
                </div>
              </div>

              {item.itemImages?.[0] && (
                <img
                  src={item.itemImages[0]}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
            </div>
          </div>

          {/* Chef info */}
          <div className="bg-emerald-50 p-4 rounded-xl border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-md">
                <ChefHat className="w-6 h-6" />
              </div>

              <div>
                <div className="font-bold">{currentChef}</div>

                {/* <div className="text-sm text-slate-600">
                  {currentChef.station}
                </div> */}
              </div>
            </div>
          </div>

          {/* Info box */}
          <div className="bg-blue-50 border p-4 rounded-lg">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />

              <div className="text-sm text-blue-800">
                <div className="font-semibold">By assigning this item:</div>

                <ul className="text-xs list-disc list-inside">
                  <li>You'll prepare this item</li>

                  <li>It appears in your Preparing tab</li>

                  <li>You control its status</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="p-6 border-t flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-100 py-3 rounded-xl font-bold"
          >
            Cancel
          </button>

          <button
            onClick={handleAssign}
            className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold"
          >
            Assign to Me
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChefAssignModal;
