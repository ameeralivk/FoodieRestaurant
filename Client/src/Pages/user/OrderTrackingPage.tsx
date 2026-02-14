import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Layouts/userLayouts/Navbar";
import { Check, Package, Bell,ChefHat } from "lucide-react";
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
import { getOrder } from "../../services/order";
interface OrderItem {
  id: string;
  name: string;
  price: number;
  status: "ready" | "preparing";
}

interface OrderStatus {
  label: string;
  time: string;
  completed: boolean;
  icon: React.ReactNode;
}

const OrderTracking: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const userId = useSelector((state: RootState) => state.userAuth.user?._id);
  const restaurantId = useSelector(
    (state: RootState) => state.userAuth.user?.restaurantId,
  );
  const tableNo = useSelector(
    (state: RootState) => state.userAuth.user?.tableNo,
  );
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 10,
    seconds: 0,
  });

  const estimatedTime = "10:20 AM";
  const totalTime = "15 minutes";

  const orderItems: OrderItem[] = [
    { id: "1", name: "Classic Burger", price: 12.0, status: "ready" },
    { id: "2", name: "Fries", price: 4.5, status: "ready" },
    { id: "3", name: "Coke", price: 2.5, status: "preparing" },
  ];

  const { data, isLoading } = useQuery<IGetOrderResponse>({
    queryKey: ["orders", restaurantId, userId, 1, 10],
    queryFn: () => getOrder(orderId as string),
  });
  const order = data?.result;

  //   useEffect(() => {
  //     if (order) {
  //       setLiveOrder(order);
  //     }
  //   }, [order]);

  //   useEffect(() => {
  //     if (!orderId || !userId || !restaurantId) return;

  //     Socket.connect();

  //     // ✅ Join properly (matches backend)
  //     Socket.emit("join-restaurant", {
  //       restaurantId,
  //       role: "user",
  //       userId,
  //     });

  //     // ✅ Listen for item update
  //     Socket.on("order:itemUpdated", (data) => {
  //       if (data.orderId === orderId) {
  //         setLiveOrder(data.order);
  //       }
  //     });

  //     // ✅ Listen for order completed
  //     Socket.on("order:completed", (data) => {
  //       if (data.orderId === orderId) {
  //         setLiveOrder(data.order);
  //       }
  //     });

  //     return () => {
  //       Socket.off("order:itemUpdated");
  //       Socket.off("order:completed");
  //     };
  //   }, [orderId, userId, restaurantId]);
  const [liveOrder, setLiveOrder] = useState(order);
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
      console.log("🔥 Received orderCompleted:", data);
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
  // const orderStatuses = [
  //   {
  //     label: "Order Placed",
  //     time: "",
  //     icon: <Check className="w-4 h-4" />,
  //     statusKey: "PLACED",
  //   },
  //   {
  //     label: "Preparing",
  //     time: "",
  //     icon: <Package className="w-4 h-4" />,
  //     statusKey: "PREPARING",
  //   },
  //   {
  //     label: "Ready for Pickup",
  //     time: "",
  //     icon: <Bell className="w-4 h-4" />,
  //     statusKey: "READY",
  //   },
  // ];

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

  const total = order?.items.reduce((sum, item) => sum + item.price, 0);

  // Countdown timer effect
  //   useEffect(() => {
  //     const timer = setInterval(() => {
  //       setTimeRemaining((prev) => {
  //         let { hours, minutes, seconds } = prev;

  //         if (seconds > 0) seconds--;
  //         else if (minutes > 0) {
  //           minutes--;
  //           seconds = 59;
  //         } else if (hours > 0) {
  //           hours--;
  //           minutes = 59;
  //           seconds = 59;
  //         }

  //         return { hours, minutes, seconds };
  //       });
  //     }, 1000);

  //     return () => clearInterval(timer);
  //   }, []);
  //   const present = { PLACED: 33, PREPARING: 66, READY: 100 };
  //   const progressPercentage =
  //     present[order?.orderStatus as keyof typeof present] || 0;

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
