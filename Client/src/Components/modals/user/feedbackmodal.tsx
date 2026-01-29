import React from "react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: {
    itemId: string;
    itemName: string;
    itemImage?: string;
  }[];
  feedbacks: Record<string, { rating: number; comment: string }>;
  setFeedbacks: React.Dispatch<
    React.SetStateAction<Record<string, { rating: number; comment: string }>>
  >;
  onSubmit: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  items,
  feedbacks,
  setFeedbacks,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center">
      <div className="bg-white w-full max-w-2xl rounded-2xl p-6 max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Order Feedback</h2>

        {items.map((item) => (
          <div
            key={item.itemId}
            className="border rounded-xl p-4 mb-4"
          >
            <div className="flex gap-4 items-center mb-3">
              <img
                src={item.itemImage || "/placeholder.png"}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <p className="font-semibold">{item.itemName}</p>
            </div>

            {/* Rating */}
            <div className="flex gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() =>
                    setFeedbacks((prev) => ({
                      ...prev,
                      [item.itemId]: {
                        ...prev[item.itemId],
                        rating: star,
                      },
                    }))
                  }
                  className={`text-xl ${
                    star <= (feedbacks[item.itemId]?.rating || 0)
                      ? "text-orange-500"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            {/* Comment */}
            <textarea
              className="w-full border rounded-lg p-2"
              placeholder="Write your feedback..."
              value={feedbacks[item.itemId]?.comment || ""}
              onChange={(e) =>
                setFeedbacks((prev) => ({
                  ...prev,
                  [item.itemId]: {
                    ...prev[item.itemId],
                    comment: e.target.value,
                  },
                }))
              }
            />
          </div>
        ))}

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 rounded-lg bg-teal-600 text-white"
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
