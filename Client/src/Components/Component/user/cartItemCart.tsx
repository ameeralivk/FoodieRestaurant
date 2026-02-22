
import { useState } from "react";
import type { CartItem } from "../../../types/cart";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { Variant } from "../../../types/Items";

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (_id: string, change: number, variant?: Variant) => void | Promise<void>;
  onRemove: (id: string, variant?: Variant) => void | Promise<void>;
  onUpdateInstruction?: (
    itemId: string,
    instruction: string,
    variant?: Variant
  ) => void | Promise<void>;
}


const CartItemCard = ({
  item,
  onUpdateQuantity,
  onRemove,
  onUpdateInstruction,
}: CartItemCardProps) => {
  const [showInstruction, setShowInstruction] = useState(false);
  const [instruction, setInstruction] = useState(item.instruction || "");

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-4">
      {/* Image & Main Info */}
      <div className="flex items-center gap-4 flex-1 w-full sm:w-auto">
        <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
          <img
            src={item.images[0] || "/placeholder-food.jpg"}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200";
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 line-clamp-2 mb-1">
            {item.name}
          </h3>

          <p className="text-sm font-medium text-gray-500">
            ₹{item.price}
          </p>

          {item?.variant?.option && (
            <p className="text-sm font-medium text-gray-500">
              {item.variant.option}
            </p>
          )}

          {/* Saved Instruction */}
          {item.instruction && !showInstruction && (
            <p className="text-xs text-gray-500 italic mt-1">
              “{item.instruction}”
            </p>
          )}

          {/* Add / Edit Instruction */}
          <div className="mt-2">
            {!showInstruction ? (
              <button
                onClick={() => setShowInstruction(true)}
                className="text-sm text-orange-600 font-medium hover:underline"
              >
                {item.instruction
                  ? "Edit cooking instruction"
                  : "+ Add cooking instruction"}
              </button>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder="e.g. Less spicy, no onion"
                  className="flex-1 px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                  maxLength={120}
                />
                <button
                  onClick={() => {
                    onUpdateInstruction?.(
                      item.itemId,
                      instruction,
                      item.variant
                    );
                    setShowInstruction(false);
                  }}
                  className="px-3 py-1.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-6 mt-2 sm:mt-0">
        {/* Quantity Controls */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
          <button
            onClick={() =>
              onUpdateQuantity(item.itemId, -1, item.variant)
            }
            className="w-8 h-8 rounded-md bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-orange-600 hover:scale-105 transition-all"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="w-6 text-center font-bold text-gray-900">
            {item.quantity}
          </span>

          <button
            onClick={() =>
              onUpdateQuantity(item.itemId, 1, item.variant)
            }
            className="w-8 h-8 rounded-md bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-orange-600 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Total & Remove */}
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg text-gray-900 min-w-[4rem] text-right">
            ₹{item.price * item.quantity}
          </span>

          <button
            onClick={() => onRemove(item.itemId, item.variant)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Remove item"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
