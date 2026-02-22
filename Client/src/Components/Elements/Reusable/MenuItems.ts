import {
  Home,
  Crown,
  Users,
  BarChart3,
  FileText,
  Settings,
  TableOfContents,
  Table,
  LayoutGrid,
  LayoutPanelTop,
  UtensilsCrossed,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: Home, path: "/admin/dashboard" },
  { name: "Subscription", icon: Crown, path: "/admin/subscriptionplan" },
  { name: "Staff", icon: Users, path: "/admin/staff" },
  { name: "Table", icon: Table, path: "/admin/table" },
  { name: "Category", icon: LayoutGrid, path: "/admin/category" },
  { name: "SubCategory", icon: LayoutPanelTop, path: "/admin/subcategory" },
  { name: "Varients", icon: TableOfContents, path: "/admin/varients" },
  { name: "Items", icon: UtensilsCrossed, path: "/admin/items" },
  // { name: "Analytics", icon: BarChart3 },
  // { name: "Documents", icon: FileText },
  // { name: "Settings", icon: Settings },
];

export default menuItems;
