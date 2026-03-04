import React from "react";
import Navbar from "../../Components/Layouts/userLayouts/Navbar";
import { useQuery } from "@tanstack/react-query";
import { generateInvoicePDF } from "../../Components/Helpers/user/invoiceDownloarder";
import { AddFeedback } from "../../services/feedback";
import {  getOrder } from "../../services/order";
import BottomNavBar from "../../Components/user/DownBar";
import type { IGetOrderResponse } from "../../types/order";
import FeedbackModal from "../../Components/modals/user/feedbackmodal";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { RootState } from "../../redux/store/store";
import { useState } from "react";
import { showSuccessToast } from "../../Components/Elements/SuccessToast";
import { ToastContainer } from "react-toastify";

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const userId = useSelector((state: RootState) => state.userAuth.user?._id);
  const restaurantId = useSelector(
    (state: RootState) => state.userAuth.user?.restaurantId,
  );
  const table = useSelector((state: RootState) => state.userAuth.user?.tableNo);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState<
    Record<string, { rating: number; comment: string }>
  >({});
  const { data } = useQuery<IGetOrderResponse>({
    queryKey: ["orders", restaurantId, userId, orderId],
    queryFn: () => getOrder(orderId as string),
  });
  const order = data?.result;

  const handleSubmitAllFeedback = async () => {
    if (!order) return;

    try {
      let res = await Promise.all(
        Object.entries(feedbacks).map(([itemId, value]) =>
          AddFeedback(
            order.restaurantId,
            order._id,
            itemId,
            value.rating,
            value.comment,
          ),
        ),
      );

      setFeedbackOpen(false);
      const allSuccess = res.every((res) => res.success);
      if (allSuccess) {
        showSuccessToast("Feedback Added successfully");
      }
      // optional: toast.success("Feedback submitted successfully");
    } catch (error: any) {
      console.error("Failed to submit feedback", error);
      // optional: toast.error("Something went wrong");
    }
  };

  const uniqueItems = React.useMemo(() => {
    if (!order) return [];

    return Array.from(
      new Map(
        order.items.map((item) => [
          item.itemId, // 👈 uniqueness by product
          {
            itemId: item.itemId,
            itemName: item.itemName,
            itemImage: item.itemImages?.[0],
          },
        ]),
      ).values(),
    );
  }, [order]);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <Navbar showBackButton={true} />
      <ToastContainer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">Order Details</h2>
        <p className="text-gray-600 mb-8">
          Complete information about your order
        </p>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-orange-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Order Summary
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-semibold">Order Status</span>
              <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md">
                {order?.orderStatus}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Order ID</span>
              <span className="font-medium">#{order?.orderId}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Table</span>
              <span className="font-medium">Table {order?.tableId}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount</span>
              <span className="font-medium">
                {formatCurrency(Number(order?.totalAmount))}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium">Online Payment</span>
            </div>
          </div>
        </div>

        {/* Ordered Items */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-orange-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Ordered Items
          </h3>

          <div className="space-y-6">
            {order?.items.map((item) => (
              <div
                key={item.itemId}
                className="border-b border-gray-200 last:border-0 pb-6 last:pb-0"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{item.itemName}</h4>
                    <p className="text-gray-500 text-sm">
                      Quantity: {item.quantity}
                    </p>
                    {item?.variant?.option && (
                      <p className="text-gray-500 text-sm">
                        Varient: {item.variant?.option}
                      </p>
                    )}
                  </div>
                  <span className="font-medium">
                    {formatCurrency(item.price)}
                  </span>
                </div>
                <FeedbackModal
                  isOpen={feedbackOpen}
                  onClose={() => setFeedbackOpen(false)}
                  items={uniqueItems}
                  feedbacks={feedbacks}
                  setFeedbacks={setFeedbacks}
                  onSubmit={handleSubmitAllFeedback}
                />

                {/* Item Image Placeholder */}
                <div className="w-full  h-40 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={item.itemImages?.[0] || "/placeholder.png"}
                    alt={item.itemName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-orange-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Details
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">
                {formatCurrency(Number(order?.totalAmount))}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Discount</span>
              <span className="font-medium">₹0.00</span>
            </div>

            <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-200">
              <span>Total</span>
              <span>{formatCurrency(Number(order?.totalAmount))}</span>
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        {/* <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-orange-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Order Timeline
          </h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium">Order Placed</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <Circle className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-500">Preparing</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <Truck className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-500">Out for Delivery</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-500">Delivered</span>
            </div>
          </div>
        </div> */}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-16">
          {/* <button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl font-bold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
            Mark Tip
          </button> */}
          <button
            onClick={() => {
              if (!order) {
                return "order not found";
              }
              generateInvoicePDF(order);
            }}
            className="bg-white border-2 border-orange-200 text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-orange-50 transition-all shadow-md hover:shadow-lg"
          >
            Download Invoice
          </button>
          <button
            onClick={() => setFeedbackOpen(true)}
            className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Add Feedback
          </button>
        </div>
      </div>
      {restaurantId && (
        <BottomNavBar
          restaurantId={restaurantId}
          tableNo={table ? table : ""}
        />
      )}
    </div>
  );
};

export default OrderDetail;
