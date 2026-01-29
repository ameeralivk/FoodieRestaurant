import React, { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (instruction: string) => void;
}

const CookingInstructionModal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [instruction, setInstruction] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-2xl p-5">
        <h2 className="text-lg font-bold mb-2">Cooking Instructions</h2>

        <textarea
          placeholder="E.g. Less spicy, no onion, extra cheese..."
          className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          rows={4}
          onChange={(e) => setInstruction(e.target.value)}
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(instruction)}
            className="px-4 py-2 rounded-lg bg-orange-600 text-white"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookingInstructionModal;
