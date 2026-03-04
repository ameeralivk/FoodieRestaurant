import {motion} from "framer-motion"
import StaffNavbar from "../../Components/Layouts/Staff/StaffNavbar";
import SidebarLayout from "../../Components/Layouts/Admin/SidebarLayout";
import staffmenu from "../../Components/Elements/Reusable/StaffMenuItems";
import StaffHistoryContent from "../../Components/Component/Staff/StaffHistoryContent";
const StaffHistory = () => {
    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <StaffNavbar />
                <SidebarLayout theme="light" menuItems={staffmenu} active="History">
                    <StaffHistoryContent />
                </SidebarLayout>
            </motion.div>
        </div>
    );
};

export default StaffHistory;