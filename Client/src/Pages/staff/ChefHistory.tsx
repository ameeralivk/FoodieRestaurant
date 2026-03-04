
import {motion} from "framer-motion"
import StaffNavbar from "../../Components/Layouts/Staff/StaffNavbar";
import SidebarLayout from "../../Components/Layouts/Admin/SidebarLayout";
import CheffmenuItems from "../../Components/Elements/Reusable/CheffMenuItems";
import ChefHistoryContent from "../../Components/Component/Staff/ChefHistoryContent";
const ChefHistory = () => {
    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <StaffNavbar />
                <SidebarLayout theme="light" menuItems={CheffmenuItems} active="History">
                    <ChefHistoryContent />
                </SidebarLayout>
            </motion.div>
        </div>
    );
};

export default ChefHistory;