import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Layouts/userLayouts/Navbar";
import { Check, Package, Bell, ChefHat } from "lucide-react";
import type { RootState } from "../../redux/store/store";
import BottomNavBar from "../../Components/user/DownBar";
import { useSelector } from "react-redux";
import OrderStatusTimeline from "../../Components/Component/user/OrderTrackPage/OrderStatusTimeline";
import OrderProgress from "../../Components/Component/user/OrderTrackPage/OrderProgress";
import OrderItemsList from "../../Components/Component/user/OrderTrackPage/OrderItemsList";
import { useQuery } from "@tanstack/react-query";
import Socket from "../../socket";
import type { IGetOrderResponse } from "../../types/order";
import { useParams } from "react-router-dom";
import { getOrder , getOrderEstimate  } from "../../services/order";

const OrderTracking: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const userId = useSelector((state: RootState) => state.userAuth.user?._id);
  const restaurantId = useSelector(
    (state: RootState) => state.userAuth.user?.restaurantId,
  );
  const tableNo = useSelector(
    (state: RootState) => state.userAuth.user?.tableNo,
  );

  const totalTime = "15 minutes";

  const { data } = useQuery<IGetOrderResponse>({
    queryKey: ["orders", restaurantId, userId, 1, 10],
    queryFn: () => getOrder(orderId as string),
  });
  const order = data?.result;
  console.log(order, "order is her");
  const [liveOrder, setLiveOrder] = useState(order);
   const [estimate, setEstimate] = useState<{ estimatedPrepTime: number; estimatedReadyAt: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number } | null>(null);

  
  useEffect(() => {
    if (order) {
      setLiveOrder(order);
    }
  }, [order]);


   useEffect(() => {
    if (!orderId) return;
    getOrderEstimate(orderId)
      .then((res) => setEstimate(res))
      .catch(console.error);
  }, [orderId]);
  useEffect(() => {
    if (!estimate?.estimatedReadyAt) return;
    const target = new Date(estimate.estimatedReadyAt).getTime();
    const updateTimer = () => {
      // Timer stops when order is preparing or ready
      if (
        liveOrder?.orderStatus === "PREPARING" ||
        liveOrder?.orderStatus === "READY" ||
        liveOrder?.orderStatus === "COMPLETED"
      ) {
        setTimeLeft(null);
        return;
      }
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ minutes: 0, seconds: 0 });
        return;
      }
      const minutes = Math.floor(diff / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ minutes, seconds });
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [estimate, liveOrder?.orderStatus]);
  useEffect(() => {
    if (order) {
      setLiveOrder(order);
    }
  }, [order]);

  useEffect(() => {
    if (!orderId || !userId || !restaurantId) return;

    console.log("🟢 useEffect running");

    Socket.connect();

    Socket.on("connect", () => {
      console.log("🟢 Connected with id:", Socket.id);
    });

    Socket.emit("join-restaurant", {
      restaurantId,
      role: "user",
      userId,
    });

    console.log("🟢 Emitted join-restaurant");

    Socket.on("order:itemUpdated", (data) => {
      console.log("🔥 Received itemUpdated:", data);
      if (data.orderId === orderId) {
        setLiveOrder(data.order);
      }
    });

    Socket.on("order:completed", (data) => {
      if (data.orderId === orderId) {
        setLiveOrder(data.order);
      }
    });

    return () => {
      console.log("🔴 Cleaning listeners");
      Socket.off("order:itemUpdated");
      Socket.off("order:completed");
    };
  }, [orderId, userId, restaurantId]);

  const orderStatuses = [
    {
      label: "Order Placed",
      time: "",
      icon: <Check className="w-4 h-4" />,
      statusKey: "PLACED",
    },
    {
      label: "Assigned to Chef",
      time: "",
      icon: <ChefHat className="w-4 h-4" />,
      statusKey: "ASSIGNED",
    },
    {
      label: "Preparing",
      time: "",
      icon: <Package className="w-4 h-4" />,
      statusKey: "PREPARING",
    },
    {
      label: "Ready for Pickup",
      time: "",
      icon: <Bell className="w-4 h-4" />,
      statusKey: "READY",
    },
  ];

  const itemWeight = {
    PLACED: 0,
    PREPARING: 50,
    READY: 100,
  };

  const progressPercentage = liveOrder?.items?.length
    ? liveOrder.items.reduce((total, item) => {
        return (
          total + (itemWeight[item.itemStatus as keyof typeof itemWeight] || 0)
        );
      }, 0) / liveOrder.items.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-4 flex items-center justify-center mb-12">
        <div className="w-full max-w-7xl bg-white rounded-2xl shadow-sm p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Order Tracking
            </h1>
            <p className="text-sm text-gray-500">Order {order?.orderId}</p>
          </div>


             {estimate && (liveOrder?.orderStatus === "PLACED" || liveOrder?.orderStatus === "ASSIGNED") && (
            <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-100">
              <h2 className="text-lg font-semibold text-orange-800 mb-2">Preparing your order...</h2>
              <p className="text-orange-700">
                Estimated preparation time: {estimate.estimatedPrepTime} minutes
              </p>
              {timeLeft && (
                <div className="mt-2 text-2xl font-bold text-orange-600 flex items-center gap-2">
                  <span>⏳</span>
                  {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                  <span className="text-sm font-normal text-orange-600 ml-2">remaining</span>
                </div>
              )}
            </div>
          )}

          <OrderStatusTimeline
            orderStatuses={orderStatuses}
            currentStatus={
              liveOrder?.orderStatus
                ? liveOrder.orderStatus
                : order?.orderStatus || "PLACED"
            }
          />
          <OrderProgress
            progressPercentage={progressPercentage}
            totalTime={totalTime}
          />
          {/* <CountdownTimer timeRemaining={timeRemaining} /> */}
          {/* <OrderItemsList orderItems={order?.items || []} total={total || 0} /> */}
          <OrderItemsList
            orderItems={liveOrder?.items || []}
            total={
              liveOrder?.items?.reduce((sum, item) => sum + item.price, 0) || 0
            }
          />

          {/* <CallWaiterButton /> */}
        </div>
      </div>
      {restaurantId && (
        <BottomNavBar
          restaurantId={restaurantId}
          tableNo={tableNo}
          defaultActive="Orders"
          activeColor="text-orange-600"
        />
      )}
    </div>
  );
};

export default OrderTracking;
