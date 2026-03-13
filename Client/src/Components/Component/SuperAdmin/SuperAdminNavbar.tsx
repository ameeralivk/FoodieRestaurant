import React from "react";
import { useDispatch } from "react-redux";
import { Menu, Search, Bell, User, LogOut } from "lucide-react";
import { logoutAction } from "../../../redux/slice/adminSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { showConfirm } from "../../Elements/ConfirmationSwall";
import { motion } from "framer-motion";

interface NavbarProps {
  onMenuClick?: () => void;
}

const SuperAdminNavbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmed = await showConfirm(
      "Logout",
      "Do you really want to logout?",
      "Logout",
      "Cancel",
    );

    if (confirmed) {
      dispatch(logoutAction());
      navigate("/admin/login");
      Swal.fire({
        title: "Logged out",
        text: "You have been logged out safely.",
        icon: "success",
        background: "#171717",
        color: "#fff",
        confirmButtonColor: "#f59e0b",
      });
    }
  };

  return (
    <nav className="h-20 bg-neutral-900/30 backdrop-blur-md border-b border-neutral-800/50 px-8 flex items-center justify-between z-30 sticky top-0">
      {/* Left side: Search or Mobile Menu */}
      <div className="flex items-center gap-6">
        <button
          className="md:hidden p-2.5 bg-neutral-800 rounded-xl text-white hover:bg-neutral-700 transition-colors shadow-lg"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Right side: Notifications, User & Power */}
      <div className="flex items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 p-1.5 pr-4 bg-neutral-800/40 rounded-2xl border border-white/5 cursor-pointer hover:bg-neutral-800/60 transition-colors group shadow-inner"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center border border-white/10 shadow-lg shadow-amber-500/10">
              <User size={18} className="text-black font-bold" />
            </div>
            <div className="hidden xl:block">
              <p className="text-[12px] font-black text-white leading-none">
                Super Admin
              </p>
              <p className="text-[10px] text-neutral-500 font-bold uppercase mt-0.5 tracking-tighter">
                Verified Access
              </p>
            </div>
          </motion.div>

          <button
            onClick={handleLogout}
            className="p-3 bg-neutral-800/50 rounded-2xl text-neutral-500 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-300 group shadow-lg"
            title="Sign Out"
          >
            <LogOut
              size={20}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default SuperAdminNavbar;
