import { ChefHat, LogOut, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import Socket from "../../../socket";
import type { IUserOrder } from "../../../types/order";
import { playSound } from "../../../utils/PlaySound";
import { showConfirm } from "../../Elements/ConfirmationSwall";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userLogoutAction } from "../../../redux/slice/userSlice";
import Swal from "sweetalert2";
import { logoutRequest } from "../../../services/Auth";
import type { RootState } from "../../../redux/store/store";
import { getAllNotification, markAsRead } from "../../../services/notification";
import NotificationCenter from "../../Elements/Reusable/notification";
import { showSuccessToast } from "../../Elements/SuccessToast";
interface Notification {
  _id: string;
  recipientId: string;
  recipientModel: "User" | "staff";
  message: string;
  isRead: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
const StaffNavbar = () => {
  // const [notifications, setNotifications] = useState<IUserOrder[]>([]);
  // const [notifications, setNotifications] = useState<IUserOrder[]>(() => {
  //   try {
  //     const stored = localStorage.getItem("staffNotifications");
  //     return stored ? JSON.parse(stored) : [];
  //   } catch {
  //     return [];
  //   }
  // });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const user = useSelector((state: RootState) => state.userAuth.user);
  const role = user?.role;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // floating popup
  const [popup, setPopup] = useState<IUserOrder | null>(null);
  const restaurantId = useSelector(
    (state: RootState) => state.userAuth.user?.restaurantId,
  );
  const [filter, setFilter] = useState<"unread" | "all">("unread");
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const result = await getAllNotification(
          restaurantId as string,
          user?._id,
          role === "staff" ? "staff" : "User",
        );

        if (result?.data) {
          setNotifications(result.data); // ✅ THIS SETS STATE
        }
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };

    if (restaurantId) {
      fetchNotification();
    }
  }, [restaurantId]);


  useEffect(() => {
    if (!restaurantId || !role) return;

    Socket.emit("join-restaurant", {
      restaurantId,
      role,
    });
  }, [restaurantId, role]);

  useEffect(() => {
    if (!restaurantId) return;
    Socket.emit("join-restaurant", {
      restaurantId,
      role: role,
    });
    const handleNewOrder = async (order: IUserOrder) => {
      playSound();

      // add to dropdown list
      const result = await getAllNotification(
        restaurantId as string,
        role === "staff" ? "staff" : "User",
      );

      if (result?.data) {
        setNotifications(result.data);
      }
      // show popup
      setPopup(order);

      // auto hide popup after 4 sec
      setTimeout(() => {
        setPopup(null);
      }, 4000);
    };

    Socket.on("order:new", handleNewOrder);

    return () => {
      Socket.off("order:new", handleNewOrder);
    };
  }, []);

  // useEffect(() => {
  //   const handleOrderCompleted = (order: IUserOrder) => {

  //     playSound();

  //     setPopup(order);

  //     setTimeout(() => {
  //       setPopup(null);
  //     }, 4000);
  //   };

  //   Socket.on("order:completed", handleOrderCompleted);
  //   return () => {
  //     Socket.off("order:completed", handleOrderCompleted);
  //   };
  // }, []);

  useEffect(() => {
    if (!restaurantId || !role) return;

    const handleOrderCompleted = async (order: IUserOrder) => {
      playSound();

      const result = await getAllNotification(restaurantId, role);

      if (result?.data) {
        setNotifications(result.data);
      }

      setPopup(order);

      setTimeout(() => setPopup(null), 4000);
    };

    Socket.on("order:completed", handleOrderCompleted);

    return () => {
      Socket.off("order:completed", handleOrderCompleted);
    };
  }, []);

  const handleLogout = async () => {
    const confirmed = await showConfirm(
      "Logout",
      "Do you really want to logout?",
      "Logout",
      "Cancel",
    );

    if (confirmed) {
      const res = await logoutRequest();
      if (res) {
        dispatch(userLogoutAction());
        navigate("/staff/login");
        Swal.fire("Logged out!", "You have been logged out.", "success");
      }
    }
  };

  const handleMarkAsReady = async (id: string) => {
    const mark = async () => {
      try {
        const result = await markAsRead(id);
        if (result.success) {
          showSuccessToast("mark as read successfully");
        }
      } catch (error) {
        console.log(error);
      }
    };
    mark();
  };
  const handlemarkAll = async () => {
    const mark = async () => {
      try {
        const result = await markAsRead(restaurantId, "true",user?._id);
        if (result.success) {
          showSuccessToast("mark as read successfully");
        }
      } catch (error) {
        console.log(error);
      }
    };
    mark();
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center h-16 px-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <ChefHat />
            <h1 className="font-bold">DineEasy</h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 relative">
            {/* Bell */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="relative p-2 hover:bg-gray-100 rounded-full"
              >
                <Bell />

                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              {/* Dropdown */}
              {open && (
                <div className="absolute right-8 mt-4 w-1/2 mr-96">
                  <NotificationCenter
                    notifications={notifications}
                    filter={filter}
                    onFilterChange={setFilter}
                    onMarkAsRead={(id) => {
                      setNotifications((prev) =>
                        prev.map((n) =>
                          n._id === id ? { ...n, isRead: true } : n,
                        ),
                      );
                      handleMarkAsReady(id);
                    }}
                    onMarkAllAsRead={() => {
                      setNotifications((prev) =>
                        prev.map((n) => ({ ...n, isRead: true })),
                      );
                      handlemarkAll();
                    }}
                    onClose={() => setOpen(false)}
                  />
                </div>
              )}
            </div>

            {/* Logout */}
            <LogOut
              onClick={handleLogout}
              className="cursor-pointer hover:text-red-500 transition"
            />
          </div>
        </div>
      </header>

      {/* Floating Popup Notification */}
      {popup && (
        <div className="fixed top-20 right-6 bg-white shadow-lg border rounded-lg p-4 w-72 animate-slideIn z-50">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-green-600">New Order Received</p>

              <p className="text-sm text-gray-600">Table {popup.tableId}</p>
            </div>

            <button
              onClick={() => setPopup(null)}
              className="text-gray-400 hover:text-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default StaffNavbar;
