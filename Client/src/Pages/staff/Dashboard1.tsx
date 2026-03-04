import SidebarLayout from "../../Components/Layouts/Admin/SidebarLayout";
import { motion } from "framer-motion";
import StaffNavbar from "../../Components/Layouts/Staff/StaffNavbar";
import AvailableItemsSection from "../../Components/Component/Staff/AvailableItems";
import CheffmenuItems from "../../Components/Elements/Reusable/CheffMenuItems";
const Dashboard = () => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <StaffNavbar />
        <SidebarLayout
          theme="light"
          menuItems={CheffmenuItems}
          active="Dashboard"
        >
          <AvailableItemsSection />
        </SidebarLayout>
      </motion.div>
    </div>
  );
};

export default Dashboard;
