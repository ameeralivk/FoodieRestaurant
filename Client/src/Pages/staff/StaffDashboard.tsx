import SidebarLayout from "../../Components/Layouts/Admin/SidebarLayout";
import { motion } from "framer-motion";
import staffmenu from "../../Components/Elements/Reusable/StaffMenuItems";
import StaffNavbar from "../../Components/Layouts/Staff/StaffNavbar";
import StaffAvaileble from "../../Components/Component/Staff/StaffAvailableOrders.";
const Dashboard = () => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <StaffNavbar />
        <SidebarLayout theme="light" menuItems={staffmenu} active="Dashboard">
          <StaffAvaileble />
        </SidebarLayout>
      </motion.div>
    </div>
  );
};

export default Dashboard;
