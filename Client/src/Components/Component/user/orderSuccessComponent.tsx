import React from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import { useSearchParams } from "react-router-dom";
const OrderSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const restaurantId = useSelector(
    (state: RootState) => state.userAuth.user?.restaurantId
  );
  const tableNo = useSelector(
    (state: RootState) => state.userAuth.user?.tableNo
  );
  const Navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>

        {/* Main Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 text-lg">
            Thank you for your purchase. Your order has been successfully
            placed.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Order Number</p>
              <p className="text-lg font-semibold text-gray-900">{orderId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Order Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => Navigate("/user/order")}
            className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            Track Order
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
          <button
            onClick={() =>
              Navigate(`/user/restaurant/${restaurantId}?table=${tableNo}`)
            }
            className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact our support team at{" "}
            <a
              href="mailto:support@example.com"
              className="text-blue-600 hover:underline"
            >
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
