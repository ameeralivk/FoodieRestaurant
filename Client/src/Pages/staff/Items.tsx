import React from "react";
import { motion } from "framer-motion";
import StaffNavbar from "../../Components/Layouts/Staff/StaffNavbar";
import SidebarLayout from "../../Components/Layouts/Admin/SidebarLayout";
import staffmenuItems from "../../Components/Elements/Reusable/StaffMenuItems";

const Items = () => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <StaffNavbar />
        <SidebarLayout theme="light" menuItems={staffmenuItems} active="Items">
          <h1>hi hllafjdklaf</h1>
        </SidebarLayout>
      </motion.div>
    </div>
  );
};

export default Items;
