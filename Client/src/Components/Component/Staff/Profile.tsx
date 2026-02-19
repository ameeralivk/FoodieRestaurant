import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Shield,
  Calendar,
  CheckCircle,
  XCircle,
  Lock,
} from "lucide-react";
// 1. Import your Modal component here
import ChangePasswordModal from "../../modals/Cheff/StaffPasswordChangeModal";
import { useQuery } from "@tanstack/react-query";
import { changeStaffPassword, getStaff } from "../../../services/staffService";
import type { RootState } from "../../../redux/store/store";
import { useSelector } from "react-redux";
import type { StaffResponseDTO } from "../../../types/staffTypes";
import { showErrorToast } from "../../Elements/ErrorToast";
import { showSuccessToast } from "../../Elements/SuccessToast";

export interface StaffMember {
  _id: string;
  staffName: string;
  restaurantId: string;
  email: string;
  role: "chef" | "staff" | string;
  status: boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

const StaffProfile: React.FC = () => {
  // 2. Add state to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const staffId = useSelector((state: RootState) => state.userAuth.user?._id);
  const { data } = useQuery<{ success: boolean; data: StaffResponseDTO }>({
    queryKey: ["orders", staffId],
    queryFn: () => getStaff(staffId as string),
  });

  const handlePasswordChange = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    const result = await changeStaffPassword(currentPassword, newPassword);
    console.log("Password change result:", result); // ✅ you’ll see this in console

    if (result.success) {
      showSuccessToast("Password changed Successfully");
    } else {
      showErrorToast(result.message || "Password change failed");
    }
  };

  const staff = data?.data;
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Staff Profile</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-32 bg-gradient-to-r dark:from-indigo-500 from-blue-500 to-purple-600" />

          <div className="px-8 pb-8">
            <div className="relative flex flex-col md:flex-row items-end -mt-12 gap-6 mb-8">
              <div className="w-32 h-32 bg-white p-2 rounded-2xl shadow-lg">
                <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                  <User size={48} />
                </div>
              </div>

              <div className="flex-1 pb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {staff?.staffName}
                </h2>
                <p className="text-gray-500 flex items-center gap-1 uppercase tracking-wider text-xs font-semibold">
                  <Shield size={14} /> {staff?.role}
                </p>
              </div>

              <div className="pb-2">
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                    staff?.status
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {staff?.status ? "Active Account" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Contact Details
                </h3>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Mail className="text-blue-500" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Email Address</p>
                    <p className="text-sm font-medium text-gray-800">
                      {staff?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Calendar className="text-purple-500" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Joined Date</p>
                    <p className="text-sm font-medium text-gray-800">
                      {new Date(
                        staff?.createdAt || Date.now(),
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  System Status
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {/* <div className="p-4 border border-gray-100 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Access Status</p>
                    {staff.isBlocked ? (
                      <div className="flex items-center gap-1 text-red-600 font-semibold">
                        <XCircle size={16} /> Blocked
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-green-600 font-semibold">
                        <CheckCircle size={16} /> Permitted
                      </div>
                    )}
                  </div> */}

                  <div className="p-4 border border-gray-100 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Restaurant ID</p>
                    <p className="text-sm font-mono text-gray-700">
                      ...{staff?.restaurantId.slice(-6)}
                    </p>
                  </div>
                </div>

                {/* 3. Attach the click handler to the button */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-black transition-all active:scale-[0.98]"
                >
                  <Lock size={18} />
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Add the Modal component at the bottom */}
      {staff && (
        <ChangePasswordModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          staff={staff} // now TS knows it's defined
          onSubmit={handlePasswordChange}
        />
      )}
    </div>
  );
};

export default StaffProfile;
