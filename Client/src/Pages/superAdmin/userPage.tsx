// import SuperAdminNavbar from "../../Components/Component/SuperAdmin/SuperAdminNavbar";
// import SuperAdminSidebar from "../../Components/Component/SuperAdmin/SuperAdminSideBar";
// import UserPage from "../../Components/Component/SuperAdmin/UserPage";
// const SuperAdminUserPage = () => {
//   return (
//     <div className="flex flex-col h-screen bg-black">
//       {/* Navbar */}
//       <div className="shrink-0">
//         <SuperAdminNavbar />
//       </div>

//       {/* Main Content Wrapper */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar (left) */}
//         <div className="w-64 shrink-0">
//           <SuperAdminSidebar />
//         </div>

//         <div className="flex-1 bg-neutral-900 p-6 overflow-y-auto">
//           <div className="bg-neutral-900 text-amber-50 w-full h-full rounded-xl">
//             <UserPage />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SuperAdminUserPage;
import { useState } from "react";
import SuperAdminNavbar from "../../Components/Component/SuperAdmin/SuperAdminNavbar";
import SuperAdminSidebar from "../../Components/Component/SuperAdmin/SuperAdminSideBar";
import UserPage from "../../Components/Component/SuperAdmin/UserPage";

const SuperAdminUserPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-neutral-950 text-white font-sans selection:bg-amber-500/30 overflow-hidden">
      {/* 1. Full-height Sidebar */}
      <SuperAdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <SuperAdminNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 transition-all duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent tracking-tight">
                Users Management
              </h1>
              <p className="text-neutral-500 mt-2 font-medium">Monitor and manage all customer accounts registered on the platform.</p>
            </div>
          </div>
          <div className="bg-neutral-900/40 border border-neutral-800 rounded-[2.5rem] p-8 backdrop-blur-md shadow-xl">
            <UserPage />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminUserPage;
