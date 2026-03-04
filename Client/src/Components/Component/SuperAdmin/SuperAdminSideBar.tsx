import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Clock,
  CreditCard,
  Building2,
  X,
  User,
  LogOut,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { logoutAction } from "../../../redux/slice/adminSlice";
import { showConfirm } from "../../Elements/ConfirmationSwall";
import Swal from "sweetalert2";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const SuperAdminSidebar: React.FC<SidebarProps> = ({
  isOpen = true,
  onClose,
}) => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/superadmin" },
    { name: "Pending Request", icon: Clock, path: "/superadmin/approval" },
    { name: "Subscription", icon: CreditCard, path: "/superadmin/subscription" },
    { name: "Users", icon: User, path: "/superadmin/users" },
    { name: "Restaurant Management", icon: Building2, path: "/superadmin/restaurants" },
  ];

  useEffect(() => {
    const current = menuItems.find((item) => item.path === location.pathname);
    if (current) {
      setActiveItem(current.name);
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    const confirmed = await showConfirm(
      "Logout",
      "Are you sure you want to end your session?",
      "Logout",
      "Cancel"
    );

    if (confirmed) {
      dispatch(logoutAction());
      navigate("/admin/login");
      Swal.fire({
        title: "Logged out",
        text: "Session ended successfully.",
        icon: "success",
        background: "#171717",
        color: "#fff",
        confirmButtonColor: "#f59e0b"
      });
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={`
        fixed md:sticky top-0 left-0 h-screen bg-neutral-900 border-r border-neutral-800/50 
        transition-all duration-500 z-50 flex flex-col
        ${isOpen ? "translate-x-0 w-72" : "-translate-x-full md:translate-x-0 w-72"}
        shadow-[5px_0_30px_rgba(0,0,0,0.5)]
      `}
      >
        <div className="flex flex-col h-full relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full pointer-events-none"></div>

          {/* Sidebar Header */}
          <div className="p-8 pb-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 rotate-3">
                <LayoutDashboard className="text-black" size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-white font-black text-xl tracking-tighter">FOODIE</h1>
                <p className="text-[10px] text-amber-500 font-bold tracking-[0.2em] uppercase leading-none">Superadmin</p>
              </div>
            </div>

            <button
              className="md:hidden text-neutral-400 hover:text-white transition-colors"
              onClick={onClose}
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
            <p className="px-4 text-[11px] font-black text-neutral-600 uppercase tracking-[0.2em] mb-4">Main Menu</p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveItem(item.name);
                    navigate(item.path);
                    if (window.innerWidth < 768 && onClose) onClose();
                  }}
                  className={`
                    w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group
                    ${isActive
                      ? "bg-gradient-to-r from-amber-500/10 to-amber-500/5 text-amber-500 shadow-inner"
                      : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200"
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                        p-2 rounded-xl transition-all duration-300
                        ${isActive ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" : "bg-neutral-800 text-neutral-500 group-hover:text-neutral-300"}
                    `}>
                      <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span className={`text-[13px] font-bold tracking-tight ${isActive ? "text-amber-500" : "text-neutral-400"}`}>
                      {item.name}
                    </span>
                  </div>
                  {isActive && (
                    <motion.div layoutId="sidebar-chevron">
                      <ChevronRight size={14} className="opacity-50" />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-6 mt-auto border-t border-neutral-800/50 bg-neutral-900/50 backdrop-blur-md">
            <div className="flex items-center gap-4 p-3 bg-black/20 rounded-2xl border border-white/5 mb-6 group cursor-pointer hover:border-white/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform duration-300">
                <User size={20} className="text-white" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-white truncate">Administrator</p>
                <p className="text-[10px] text-neutral-500 font-medium truncate uppercase">Master Control</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-neutral-800/50 text-neutral-400 hover:bg-red-500/10 hover:text-red-500 border border-transparent hover:border-red-500/20 transition-all duration-300 group"
            >
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-black uppercase tracking-widest">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SuperAdminSidebar;
