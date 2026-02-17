// import { ChefHat, User, LogOut } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { showConfirm } from "../../Elements/ConfirmationSwall";
// import Swal from "sweetalert2";
// import { logoutRequest } from "../../../services/Auth";
// import { userLogoutAction } from "../../../redux/slice/userSlice";
// import type { RootState } from "../../../redux/store/store";
// interface NavbarProps {
//   restaurantName?: string;
//   isShowProfile?: boolean;
// }
// const Navbar = ({ restaurantName, isShowProfile = true }: NavbarProps) => {
//   const imageUrl = useSelector(
//     (state: RootState) => state.userAuth.user?.imageUrl
//   );
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const handleLogout = async () => {
//     const confirmed = await showConfirm(
//       "Logout",
//       "Do you really want to logout?",
//       "Logout",
//       "Cancel"
//     );

//     if (confirmed) {
//       const res = await logoutRequest();
//       if (res) {
//         dispatch(userLogoutAction());
//         navigate("/user/login");
//         Swal.fire("Logged out!", "You have been logged out.", "success");
//       }
//     }
//   };
//   return (
//     <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-20">
//           {/* Logo */}
//           <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
//             <div className="bg-orange-500 p-2 rounded-xl text-white shadow-lg shadow-orange-500/20">
//               <ChefHat className="w-6 h-6" />
//             </div>
//             <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
//               {restaurantName || "Foodie"}
//             </h1>
//           </div>

//           {/* Right Icons */}

//           <div className="flex items-center gap-4">
//             {isShowProfile && (
//               <button
//                 onClick={() => navigate("/user/profile")}
//                 className="group relative p-1 rounded-full transition-all duration-300 hover:ring-2 hover:ring-orange-100"
//               >
//                 <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
//                   <img
//                     src={imageUrl || "/default-avatar.png"}
//                     alt="Profile"
//                     className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
//                     onError={(e) => {
//                       (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=User&background=random";
//                     }}
//                   />
//                 </div>
//               </button>
//             )}
//             <button
//               onClick={handleLogout}
//               className="p-2.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
//               title="Logout"
//             >
//               <LogOut className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;

import { ChefHat, LogOut, Bell } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showConfirm } from "../../Elements/ConfirmationSwall";
import Swal from "sweetalert2";
import { logoutRequest } from "../../../services/Auth";
import { userLogoutAction } from "../../../redux/slice/userSlice";
import type { RootState } from "../../../redux/store/store";
import Socket from "../../../socket";
import { useEffect } from "react";
import { useState } from "react";
interface NavbarProps {
  restaurantName?: string;
  isShowProfile?: boolean;
  showBackButton?: boolean; // optional prop to show back button
}

const Navbar = ({
  restaurantName,
  isShowProfile = true,
  showBackButton = false,
}: NavbarProps) => {
  const imageUrl = useSelector(
    (state: RootState) => state.userAuth.user?.imageUrl,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.userAuth.user);

  const [notifications, setNotifications] = useState<any[]>(() => {
    const saved = localStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : [];
  });
  const [showNotifications, setShowNotifications] = useState(false);
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (!user?.restaurantId || !user?._id) return;

    Socket.connect();

    Socket.emit("join-restaurant", {
      restaurantId: user.restaurantId,
      role: "user",
      userId: user._id,
    });

    Socket.on("order:itemUpdated", (data) => {
      setNotifications((prev) => [
        {
          id: Date.now(),
          message: `Order ${data.orderId} item updated`,
          orderId: data.orderId,
        },
        ...prev,
      ]);
    });

    Socket.on("order:completed", (data) => {
      setNotifications((prev) => [
        {
          id: Date.now(),
          message: `Order ${data.orderId} completed`,
          orderId: data.orderId,
        },
        ...prev,
      ]);
    });

    return () => {
      Socket.off("order:itemUpdated");
      Socket.off("order:completed");
    };
  }, [user]);

  const removeNotification = (id: number) => {
  setNotifications((prev) => prev.filter((n) => n._id !== id));
};


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
        navigate("/user/login");
        Swal.fire("Logged out!", "You have been logged out.", "success");
      }
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left side: Back button + Logo */}
          <div className="flex items-center gap-6">
            {showBackButton && (
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                title="Go Back"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="bg-orange-500 p-2 rounded-xl text-white shadow-lg shadow-orange-500/20">
                <ChefHat className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
                {restaurantName || "Foodie"}
              </h1>
            </div>
          </div>

          {/* Right side: Profile & Logout */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full hover:bg-gray-100 transition"
            >
              <Bell className="w-5 h-5 text-gray-700" />

              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-14 w-80 bg-white shadow-lg rounded-xl border z-50 max-h-96 overflow-y-auto">
                <div className="p-3 border-b font-semibold">Notifications</div>

                {notifications.length === 0 ? (
                  <div className="p-4 text-gray-500 text-sm">
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() =>{
                         navigate(`/user/order/${n.orderId}`)
                         removeNotification(n._id)
                        }
                        }
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b text-sm"
                    >
                      {n.message}
                    </div>
                  ))
                )}
              </div>
            )}
            {isShowProfile && (
              <button
                onClick={() => navigate("/user/profile")}
                className="group relative p-1 rounded-full transition-all duration-300 hover:ring-2 hover:ring-orange-100"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <img
                    src={imageUrl || "/default-avatar.png"}
                    alt="Profile"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://ui-avatars.com/api/?name=User&background=random";
                    }}
                  />
                </div>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
