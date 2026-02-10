
import SidebarLayout from "../../Components/Layouts/Admin/SidebarLayout";
import DashboardComponent from "../../Components/Component/Staff/DashboardComponent";
import staffmenuItems from "../../Components/Elements/Reusable/StaffMenuItems";
import StaffNavbar from "../../Components/Layouts/Staff/StaffNavbar";
import ChefDashboard from "../../Components/Component/Staff/DashboardComponent";
const Dashboard = () => {
  return (
    <div>
      <StaffNavbar />
      <SidebarLayout
        theme="light"
        menuItems={staffmenuItems}
        active="Dashboard"
      >
        <ChefDashboard/>
      </SidebarLayout>
    </div>
  );
};

export default Dashboard;
