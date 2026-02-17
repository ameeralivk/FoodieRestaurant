import SidebarLayout from "../../Components/Layouts/Admin/SidebarLayout";
import { motion } from "framer-motion";
import staffmenu from "../../Components/Elements/Reusable/StaffMenuItems";
import StaffNavbar from "../../Components/Layouts/Staff/StaffNavbar";
import StaffSelectedOrders from "../../Components/Component/Staff/StaffSelectedOrderPage";
const StaffOrders = () => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <StaffNavbar />
        <SidebarLayout theme="light" menuItems={staffmenu} active="My orders">
          <StaffSelectedOrders />
        </SidebarLayout>
      </motion.div>
    </div>
  );
};

export default StaffOrders;
