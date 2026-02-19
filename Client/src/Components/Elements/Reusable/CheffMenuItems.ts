import { Home, Settings, ShoppingCart, UserPenIcon } from "lucide-react";

const staffmenuItems = [
  { name: "Dashboard", icon: Home, path: "/staff/dashboard" },
  { name: "My orders", icon: ShoppingCart, path: "/staff/items" },
  { name: "Profile", icon: UserPenIcon, path: "/staff/profile" },
];

export default staffmenuItems;
