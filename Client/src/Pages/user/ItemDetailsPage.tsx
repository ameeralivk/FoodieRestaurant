import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import VariantSelectModal from "../../Components/modals/Admin/varientSelectModal";
import type { Item } from "../../types/Items";
import {
  ChevronLeft,
  Clock,
  Star,
  Plus,
  Minus,
  Share2,
  Heart,
} from "lucide-react";
import { getItem, sendToAi } from "../../services/user";
import type { GetMenuItemsResponse } from "../../types/Items";
import { getRating } from "../../services/feedback";
import { AddToCart } from "../../services/cart";
import type { RootState } from "../../redux/store/store";
import { useSelector } from "react-redux";
import { showErrorToast } from "../../Components/Elements/ErrorToast";
import { showSuccessToast } from "../../Components/Elements/SuccessToast";
import { ToastContainer } from "react-toastify";

const ItemDetailPage: React.FC = () => {
  const { itemId, restaurantId } = useParams<{
    itemId: string;
    restaurantId: string;
  }>();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [aiDescription, setAiDescription] = useState<string>("");
  const [loadingNutrition, setLoadingNutrition] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [openVariantModal, setOpenVariantModal] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [nutrition, setNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [searchParams] = useSearchParams();
  const userId = useSelector((state: RootState) => state.userAuth.user?._id);
  const table = searchParams.get("tableId");
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<GetMenuItemsResponse>({
    queryKey: ["item", itemId],
    queryFn: () => getItem(itemId as string),
    enabled: !!itemId,
  });

  const item = data?.data.data;
  const images = item?.images ?? [];

  // Carousel Logic
  useEffect(() => {
    if (!images.length) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1,
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  // AI Description Fetching
  useEffect(() => {
    const fetchDescriptionAndNutrition = async () => {
      if (!item?.name) return;
      setLoadingNutrition(true);
      try {
        const res =
          await sendToAi(`Give me a JSON with description and nutritional info (Calories, Protein in g, Carbs in g, Fat in g) for ${item.name}.
Example format:
{
  "description": "...",
  "calories": 520,
  "protein": 32,
  "carbs": 45,
  "fat": 18
}`);
        const jsonMatch = res.reply.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON found");
        const data = JSON.parse(jsonMatch[0]);
        setAiDescription(data.description);
        setNutrition({
          calories: data.calories,
          protein: data.protein,
          carbs: data.carbs,
          fat: data.fat,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingNutrition(false);
      }
    };
    fetchDescriptionAndNutrition();
  }, [item]);

  useEffect(() => {
    const fetchRating = async () => {
      if (!item) return;
      try {
        const res = await getRating(restaurantId ? restaurantId : ""); // fetch your API
        if (res.success) {
          const matchedRating = res.data.find(
            (r: { itemId: string }) => r.itemId === item._id,
          );
          setRating(matchedRating ? matchedRating.avgRating : null);
        }
      } catch (error) {
        console.error("Failed to fetch rating:", error);
      }
    };

    fetchRating();
  }, [item]);

  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement>,
    item: Item, // use your typed Item
  ) => {
    e.stopPropagation();

    // If item has variants, open modal
    if (item.variant && item.variant.values && item.variant.values.length > 0) {
      setSelectedItem(item);
      setOpenVariantModal(true);
      return;
    }

    // No variant → add directly
    try {
      if (userId && restaurantId && table) {
        const res = await AddToCart(
          userId,
          restaurantId,
          item._id,
          table,
          quantity.toString(),
        );
        if (res.success) {
          showSuccessToast("Added to Cart Successfully");
        }
      } else {
        showErrorToast("Session expired or invalid table. Please rescan QR.");
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to add item");
    }
  };

  if (isLoading || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const totalPrice = item.price * quantity;

  return (
    <div className="min-h-screen bg-white pb-32">
      <ToastContainer />

      {/* Hero Image Section */}
      <div className="relative h-[40vh] md:h-[50vh] bg-gray-100">
        {/* Navigation Overlay */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/50 to-transparent">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-3">
            <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all">
              <Heart className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Image */}
        <img
          src={
            images[currentImageIndex] ||
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"
          }
          alt={item.name}
          className="w-full h-full object-cover"
        />

        {/* Pagination Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"}`}
              />
            ))}
          </div>
        )}
      </div>

      {openVariantModal && selectedItem && (
        <VariantSelectModal
          open={openVariantModal}
          itemName={selectedItem.name}
          basePrice={selectedItem.price}
          variant={{
            category: selectedItem.variant?.category ?? "",
            values:
              selectedItem.variant?.values?.map((v) => ({
                _id: v._id ?? `${selectedItem._id}-variant`,
                option: v.option ?? "Unknown Option",
                price: v.price ?? selectedItem.price,
              })) ?? [],
          }}
          onClose={() => {
            setOpenVariantModal(false);
            setSelectedItem(null);
          }}
          onConfirm={async ({ variantOption }) => {
            try {
              if (!userId || !restaurantId || !table || !selectedItem?._id) {
                showErrorToast("Session expired. Please rescan QR.");
                return;
              }

              const res = await AddToCart(
                userId,
                restaurantId,
                selectedItem._id,
                table,
                quantity.toString(),
                variantOption
                  ? {
                      category: selectedItem.variant?.category ?? "",
                      option: variantOption.option,
                      price: variantOption.price,
                    }
                  : undefined, // ✅ NORMAL ITEM
              );

              if (res.success) {
                showSuccessToast("Added to Cart Successfully");
              }
            } catch (err) {
              console.error(err);
              showErrorToast("Failed to add item to cart");
            } finally {
              setOpenVariantModal(false);
              setSelectedItem(null);
            }
          }}
        />
      )}

      <div className="max-w-4xl mx-auto -mt-10 relative z-10 px-4">
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
          {/* Header Info */}
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight flex-1 mr-4">
              {item.name}
            </h1>
            <div className="bg-green-50 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-green-100">
              <Star className="w-4 h-4 fill-green-500 text-green-500" />
              <span className="text-sm font-bold text-green-700">
                {rating !== null ? rating.toFixed(1) : "-"}
              </span>
            </div>
          </div>

          {/* Price & Meta */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-orange-600">
              ₹{item.price}
            </span>
            <div className="h-6 w-px bg-gray-200"></div>
            <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
              <Clock className="w-4 h-4" />
              <span>{item.preparationTime || "15-20"} min</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-gray-900 font-bold mb-2">Description</h3>
            {aiDescription ? (
              <p className="text-gray-600 text-sm leading-relaxed">
                {aiDescription}
              </p>
            ) : (
              <div className="space-y-2 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
              </div>
            )}
          </div>

          {/* Nutrition Cards */}
          <div>
            <h3 className="text-gray-900 font-bold mb-3">
              Nutrition (approx.)
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                { k: "cal", l: "Calories", v: nutrition.calories, u: "kcal" },
                { k: "pro", l: "Protein", v: nutrition.protein, u: "g" },
                { k: "fat", l: "Fat", v: nutrition.fat, u: "g" },
                { k: "car", l: "Carbs", v: nutrition.carbs, u: "g" },
              ].map((n, i) => (
                <div
                  key={i}
                  className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100"
                >
                  <div className="text-orange-600 font-bold text-lg">
                    {loadingNutrition ? "-" : n.v}
                    <span className="text-xs font-normal text-gray-400 ml-0.5">
                      {n.u}
                    </span>
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mt-1">
                    {n.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] p-4 md:px-8 z-50 rounded-t-3xl md:rounded-none">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          {/* Quantity Counter */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-1.5 border border-gray-100">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-700 hover:text-orange-600 active:scale-95 transition-all"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="w-8 text-center font-bold text-lg">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-700 hover:text-orange-600 active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Add Button */}
          <button
            onClick={(e) => handleAddToCart(e, item)}
            disabled={!item.isStock}
            className={`flex-1 flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02] active:scale-95 ${
              item.isStock
                ? "bg-gradient-to-r from-orange-500 to-amber-500"
                : "bg-gray-300 cursor-not-allowed shadow-none"
            }`}
          >
            <span>{item.isStock ? "Add to Cart" : "Out of Stock"}</span>
            <span className="bg-white/20 px-2 py-1 rounded-lg text-sm">
              ₹{totalPrice}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;
