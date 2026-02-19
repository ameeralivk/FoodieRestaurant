import { Home, Settings, ShoppingCart, UserPenIcon } from "lucide-react";

const staffmenu = [
  { name: "Dashboard", icon: Home, path: "/staff/dashboard" },
  { name: "My orders", icon: ShoppingCart, path: "/staff/stafforders" },
  { name: "Profile", icon: UserPenIcon, path: "/staff/profile" },
];

export default staffmenu;
