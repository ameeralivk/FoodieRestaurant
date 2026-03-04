import React, { useState } from "react";
import StaffOrderCard from "../../Elements/Staff/StaffOrderCard";
import { useQuery } from "@tanstack/react-query";
import type { IUserOrder } from "../../../types/order";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import { getTotalOrders } from "../../../services/staffService";
import { showSuccessToast } from "../../Elements/SuccessToast";
import { assignOrder } from "../../../services/staffService";
import { useEffect } from "react";
import { playSound } from "../../../utils/PlaySound";
import { useQueryClient } from "@tanstack/react-query";
import Socket from "../../../socket";
import { ToastContainer } from "react-toastify";
import { showErrorToast } from "../../Elements/ErrorToast";
const StaffDashboard: React.FC = () => {
  const queryClient = useQueryClient();

  const [currentPage] = useState(1);
  const restaurantId = useSelector(
    (state: RootState) => state.userAuth.user?.restaurantId,
  );
  const [readyOrders, setReadyOrders] = useState<IUserOrder[]>([]);
  const role = useSelector((state: RootState) => state.userAuth.user?.role);
  const staffId = useSelector((state: RootState) => state.userAuth.user?._id);
  const limit = 100;

  const userId = useSelector((state: RootState) => state.userAuth.user?._id);

  const { data, refetch } = useQuery<{ success: boolean; data: IUserOrder[] }>({
    queryKey: ["orders", userId, currentPage, limit],
    queryFn: () => getTotalOrders(restaurantId as string),
  });

  useEffect(() => {
    if (data?.data) {
      const ready = data.data.filter((o) =>
        o.items.every(() => o.orderStatus === "READY"),
      );

      setReadyOrders(ready);
    }
  }, [data]);

  useEffect(() => {
    if (!restaurantId) return;
    Socket.emit("join-restaurant", {
      restaurantId,
      role, // "staff"
    });

    console.log(`Joining staff room for restaurant ${restaurantId}`);
    const handleOrderCompleted = (socketData: {
      order: IUserOrder;
      orderId: string;
      message: string;
    }) => {
      console.log("✅ Order completed received on staff:", socketData.order);
      showSuccessToast("New Order is added");
      // 🔊 play sound
      playSound();

      // ✅ Update React Query cache
      setReadyOrders((prev) => [...prev, socketData.order]);
    };

    Socket.on("order:completed", handleOrderCompleted);

    return () => {
      Socket.off("order:completed", handleOrderCompleted);
    };
  }, [restaurantId, role, userId, currentPage, limit, queryClient]);

  const handleAssignOrder = async (orderId: string) => {
    try {
      const result = await assignOrder(orderId, staffId as string);
      if (result.success) {
        showSuccessToast("Order Assigning Completed");
        refetch();
      } else {
        showErrorToast("Order Assigning Failed");
      }
    } catch (error) {
      showErrorToast("Order Assigning Failed");
      return;
    }
  };

  return (
    <div className="p-6">

      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Staff Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        {readyOrders?.map((order) => (
          <StaffOrderCard
            key={order.orderId}
            order={order}
            onAssign={() => handleAssignOrder(order.orderId)}
          />
        ))}
      </div>
    </div>
  );
};

export default StaffDashboard;
