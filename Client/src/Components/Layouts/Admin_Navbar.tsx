import React, { useState } from "react";
import { ChefHat, Menu, X, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logoutAction, setAuth } from "../../redux/slice/adminSlice";
import { showConfirm } from "../Elements/ConfirmationSwall";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { logoutRequest } from "../../services/Auth";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
interface role {
  role: String;
  restaurantName?: String;
}
const Admin_Navbar: React.FC<role> = ({ role, restaurantName }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function handleLogout() {
    showConfirm("Logout", "Do you really want to logout?", "Logout", "Cancel")
      .then(async (confirmed) => {
        if (confirmed) {
          const res = await logoutRequest();
          if (res) {
            dispatch(logoutAction());
            dispatch(setAuth({ isAuthenticated: false }));
            Swal.fire("Logged out!", "You have been logged out.", "success");
            navigate("/admin/login");
          }
        }
      })
      .catch((err) => console.error(err));
  }
  return (
    <nav className="h-16 bg-black text-white border-b border-gray-700 sticky top-0 z-50 flex justify-between items-center px-6">
      {/* Left section - Logo */}
      <div className="flex items-center gap-3">
        <ChefHat size={22} className="text-[#EDAB12]" />
        <span className="cursor-pointer font-semibold tracking-wide text-sm ml-6 sm:text-base">
          {restaurantName}
        </span>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center gap-6 mr-6">
        {!isAuthenticated && (
          <div>
            <button className="bg-[#EDAB12] text-black font-medium w-20 rounded-md h-[30px] hover:bg-yellow-400 transition">
              Login
            </button>
            <button className="bg-[#383329] w-24 rounded-md h-[30px] hover:bg-[#4a4033] transition">
              Sign Up
            </button>
          </div>
        )}
        {role == "admin" && <LogOut color="white" onClick={handleLogout} />}
      </ul>

      <button
        className="md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle Menu"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-black border-t border-gray-800 flex flex-col items-center py-4 space-y-4 md:hidden">
          <li
            className="list-none cursor-pointer hover:text-[#EDAB12]"
            onClick={() => setMenuOpen(false)}
          >
            Menu
          </li>
          <li
            className="list-none cursor-pointer hover:text-[#EDAB12]"
            onClick={() => setMenuOpen(false)}
          >
            About
          </li>
          <li
            className="list-none cursor-pointer hover:text-[#EDAB12]"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </li>

          <button className="bg-[#EDAB12] text-black font-medium w-28 rounded-md h-[30px] hover:bg-yellow-400 transition">
            Login
          </button>
          <button className="bg-[#383329] w-32 rounded-md h-[30px] hover:bg-[#4a4033] transition">
            Sign Up
          </button>
        </div>
      )}
    </nav>
  );
};

export default Admin_Navbar;
