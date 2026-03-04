import {
  Home,
  BarChart2,
  ShoppingCart,
  UserPenIcon,
  History,
} from "lucide-react";

const staffmenu = [
  { name: "Analytics", icon: BarChart2, path: "/staff/analytics" },
  { name: "Dashboard", icon: Home, path: "/staff/dashboard" },
  { name: "My orders", icon: ShoppingCart, path: "/staff/stafforders" },
  { name: "History", icon: History, path: "/staff/history" },
  { name: "Profile", icon: UserPenIcon, path: "/staff/profile" },
];

export default staffmenu;
