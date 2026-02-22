import SidebarLayout from "../../Components/Layouts/Admin/SidebarLayout";
import { motion } from "framer-motion";
import staffmenu from "../../Components/Elements/Reusable/StaffMenuItems";
import StaffNavbar from "../../Components/Layouts/Staff/StaffNavbar";
import StaffProfile from "../../Components/Component/Staff/Profile";
import { useSelector } from "react-redux";
import type{ RootState } from "../../redux/store/store";
import CheffmenuItems from "../../Components/Elements/Reusable/CheffMenuItems";
const Profile = () => {
   const role = useSelector((state: RootState) => state.userAuth.user?.role);
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <StaffNavbar />
        <SidebarLayout theme="light" menuItems={role === "chef" ? CheffmenuItems : staffmenu} active="Profile">
          <StaffProfile />
        </SidebarLayout>
      </motion.div>
    </div>
  );
};

export default Profile;
