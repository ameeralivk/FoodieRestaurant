
import {motion} from "framer-motion"
import StaffNavbar from "../../Components/Layouts/Staff/StaffNavbar";
import SidebarLayout from "../../Components/Layouts/Admin/SidebarLayout";
import StaffAnalyticsContent from "../../Components/Component/Staff/StaffAnalyticContent";
import staffmenu from "../../Components/Elements/Reusable/StaffMenuItems";
const StaffAnalytics = () => {
    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <StaffNavbar />
                <SidebarLayout theme="light" menuItems={staffmenu} active="Analytics">
                    <StaffAnalyticsContent />
                </SidebarLayout>
            </motion.div>
        </div>
    );
};

export default StaffAnalytics;