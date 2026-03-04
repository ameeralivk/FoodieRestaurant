import { Home, BarChart2, ShoppingCart,History, UserPenIcon } from "lucide-react";

const CheffmenuItems = [
  { name: "Analytics", icon: BarChart2, path: "/chef/analytics" },
  { name: "Dashboard", icon: Home, path: "/staff/dashboard" },
  { name: "Myorders", icon: ShoppingCart, path: "/staff/items" },
  { name: "History", icon: History, path: "/chef/history" },
  { name: "Profile", icon: UserPenIcon, path: "/staff/profile" },
];

export default CheffmenuItems;
