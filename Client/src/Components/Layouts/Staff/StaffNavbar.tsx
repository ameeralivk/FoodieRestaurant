// import { ChefHat, User, LogOut, Bell } from "lucide-react";
// import { showConfirm } from "../../Elements/ConfirmationSwall";
// import { useDispatch } from "react-redux";
// import { userLogoutAction } from "../../../redux/slice/userSlice";
// import { logoutRequest } from "../../../services/Auth";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// const StaffNavbar = () => {
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
//         navigate("/staff/login");
//         Swal.fire("Logged out!", "You have been logged out.", "success");
//       }
//     }
//   };
//   return (
//     <header className="bg-white shadow-sm sticky top-0 z-10">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <div className="flex items-center gap-2">
//             <ChefHat className="w-6 h-6 text-gray-700" />
//             <h1 className="text-xl font-bold text-gray-900">DineEasy</h1>
//           </div>

//           {/* Right Icons */}
//           <div className="flex items-center gap-4">
//             <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//               <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
//                 <Bell className="w-5 h-5 text-gray-600" />
//               </div>
//             </button>
//             <button className=" hover:bg-gray-100 rounded-full transition-colors">
//               <img
//                 className="w-8 h-8 rounded-4xl"
//                 src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL60p-Cv5yRHtLK2z80SyuAFy8Qskexvs0AQ&s"
//                 alt="Extra small avatar"
//               ></img>
//             </button>
//             <LogOut onClick={handleLogout} className=" cursor-pointer" />
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default StaffNavbar;

import { ChefHat, LogOut, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import Socket from "../../../socket";
import type { IUserOrder } from "../../../types/order";
import { playSound } from "../../../utils/PlaySound";
import { showConfirm } from "../../Elements/ConfirmationSwall";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userLogoutAction } from "../../../redux/slice/userSlice";
import Swal from "sweetalert2";
import { logoutRequest } from "../../../services/Auth";
const StaffNavbar = () => {
  const [notifications, setNotifications] = useState<IUserOrder[]>([]);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // floating popup
  const [popup, setPopup] = useState<IUserOrder | null>(null);

  useEffect(() => {
    const handleNewOrder = (order: IUserOrder) => {
      playSound();

      // add to dropdown list
      setNotifications((prev) => [order, ...prev]);

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

   useEffect(() => {
    const handleOrderCompleted = (order: IUserOrder) => {
      playSound();
  
      setNotifications((prev) => [order, ...prev]);


      setPopup(order);

      setTimeout(() => {
        setPopup(null);
      }, 4000);
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
      "Cancel"
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

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-10">
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

                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              {/* Dropdown */}
              {open && (
                <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-2xl border z-50 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                    <h3 className="font-semibold text-gray-800">
                      Notifications
                    </h3>

                    {notifications.length > 0 && (
                      <button
                        onClick={() => setNotifications([])}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  {/* Notification List */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                        <Bell size={40} className="mb-2 opacity-50" />

                        <p className="text-sm">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((n, index) => (
                        <div
                          key={index}
                          className="flex gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition border-b group"
                        >
                          {/* Blue unread dot */}
                          <div className="mt-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800 group-hover:text-black">
                              New order received
                            </p>

                            <p className="text-sm text-gray-500">
                              Table {n.tableId}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              Just now
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="text-center py-2 border-t bg-gray-50">
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        View all notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Logout */}
            <LogOut onClick={handleLogout} className="cursor-pointer hover:text-red-500 transition" />
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
