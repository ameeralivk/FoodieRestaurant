import { useState } from "react";
import { Users } from "lucide-react";
import ReusableTable from "../../Elements/Reusable/reusableTable";
import ReusableModal from "../../modals/SuperAdmin/GeneralModal";
import { showErrorToast } from "../../Elements/ErrorToast";
import { ToastContainer } from "react-toastify";
import { showConfirm } from "../../Elements/ConfirmationSwall";
import Pagination from "../../Elements/Reusable/Pagination";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import type { RootState } from "../../../redux/store/store";
import {
  addStaff,
  changeStaffStatus,
  deleteStaff,
  editStaff,
  getAllStaff,
} from "../../../services/staffService";
import type { IStaffAdd } from "../../../types/staffTypes";
import ReusableWarningModal from "../../Elements/Reusable/ResusableWarningModal";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../Elements/Reusable/reusableSearchBar";
import { toast } from "react-toastify";
import { showSuccessToast } from "../../Elements/SuccessToast";
import { useQueryClient } from "@tanstack/react-query";
import { loadingToast } from "../../Elements/Loading";
import type { Staff } from "../../../types/staffTypes";
import { StaffValidation } from "../../../Validation/staffAddValidation";
export interface StaffListResponse {
  success: boolean;
  message?: string;
  total?: number;
  data: Staff[];
}

const StaffManagementPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [loading, setLoading] = useState(false);
  // const [staff, setStaff] = useState<Staff[]>([]);
  const [form, setFormData] = useState({ staffName: "", email: "", role: "" });
  const [modalErrors, setModalErrors] = useState<{ [key: string]: string }>({});
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [currentRow, setCurrentRow] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const limit = 10;
  const queryClient = useQueryClient();
  const restaurentId = useSelector(
    (state: RootState) => state?.auth?.admin?._id
  );

  const columns = [
    { header: "Staff Name", accessor: "staffName" },
    { header: "Email", accessor: "email" },
    {
      header: "Status",
      accessor: "isBlocked",
      render: (isBlocked: boolean) => {
        const label = isBlocked ? "Blocked" : "Active";
        const classes = isBlocked
          ? "bg-red-500/20 text-red-400"
          : "bg-green-500/20 text-green-400";

        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${classes}`}>
            {label}
          </span>
        );
      },
    },

    { header: "role", accessor: "role" },
  ];
  function handleView(row: string) {
    setCurrentRow(row);
    setModalMode("view");
    setModalOpen(true);
  }


  const { data} = useQuery<StaffListResponse, Error>({
    queryKey: ["activePlan", restaurentId, currentPage, limit, searchTerm],
    queryFn: () =>
      getAllStaff(restaurentId as string, currentPage, limit, searchTerm),
    staleTime: 5000,
  });
  console.log(data, "data is here");
  useEffect(() => {
    if (data?.total) {
      setTotalPages(Math.ceil(data.total / limit));
    }
  }, [data]);

  const staff = data?.data ?? [];
  async function updateStaffStatus(row: Staff, value: boolean) {
    const confirmed = await showConfirm(
      "Change this status?",
      `Are you Wand to Change the Status?`,
      "Change",
      "Cancel"
    );
    if (!confirmed) return;
    const changeStatus = async () => {
      try {
        const result = await changeStaffStatus(row._id, !value);
        if (result.success) {
          showSuccessToast(result.message);
          queryClient.invalidateQueries({
            queryKey: ["activePlan", restaurentId],
          });
        }
      } catch (error: any) {
        showErrorToast(error.message);
      }
    };
    changeStatus();
  }

  function handleDelete(row: Staff) {
    try {
      const del = async () => {
        const confirmed = await showConfirm(
          "Delete this plan?",
          `Are you sure you want to delete "fdsafjdlsa"?`,
          "Delete",
          "Cancel"
        );

        if (!confirmed) return;
        const result = await deleteStaff(row._id);
        if (result.success) {
          queryClient.invalidateQueries({
            queryKey: ["activePlan", restaurentId],
          });
          showSuccessToast(result.message);
        }
      };
      del();
    } catch (error:any) {
      showErrorToast(error.message);
    }
  }

  async function handleSubmit(row: any) {
    const payloadForm = {
      staffName: row.staffName,
      email: row.email,
      role: row.role,
    };
    const validate = StaffValidation(payloadForm);
    if (Object.keys(validate).length > 0) {
      setModalErrors(validate);
      return;
    }
    setFormData(payloadForm);
    if (!restaurentId) return;
    setLoading(true);
    const payload: IStaffAdd = {
      restaurantId: restaurentId,
      staffName: row.staffName,
      email: row.email,
      role: row.role,
    };

    const toastId = loadingToast();

    try {
      let res;

      if (modalMode === "edit") {
        res = await editStaff(currentRow._id, payload);
      } else {
        res = await addStaff(payload);
      }

      toast.dismiss(toastId);

      if (res.success) {
        showSuccessToast(res.message);
        setModalErrors({});
        setLoading(false);
        queryClient.invalidateQueries({
          queryKey: ["activePlan", restaurentId],
        });

        setModalOpen(false);
        setCurrentRow(null);
      } else {
        setLoading(false);
        showErrorToast(res.message);
      }
    } catch (error: any) {
      setLoading(false);
      toast.dismiss(toastId);

      if (error?.response?.data?.message === "No active subscription plan") {
        setLoading(false);
        setModalOpen(false);
        setWarningModal(true);
      } else {
        return;
      }
    }
  }

  const handleConfirm = () => {
    navigate("/admin/subscriptionplan");
    setDismissed(false);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCancel = () => {
    setDismissed(false);
  };

  function handleFieldChange(name: string, value: string) {
    const updatedForm = {
      ...form,
      [name]: value,
    };

    setFormData(updatedForm);

    const validate = StaffValidation(updatedForm);
    setModalErrors(validate);
  }

  return (
    <div className="min-h-screen bg-[#0e0f11]  text-gray-200">
      {warningModal && dismissed && (
        <ReusableWarningModal
          isOpen={warningModal}
          title="Upgrade Your Plan"
          message="A subscription is required to use this feature."
          confirmText="Upgrade Now"
          cancelText="Not Now"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
      {/* Header */}
      <header className="bg-[#111214] border-b border-gray-800/70 backdrop-blur-md shadow-md sticky top-0 z-20">
        <div className="max-w-9xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-blue-600/20">
                <Users className="w-7 h-7 text-blue-400" />
              </div>

              <div>
                <h1 className="text-2xl font-semibold tracking-wide">
                  Staff Management
                </h1>
                <p className="text-gray-400 text-sm">
                  Manage and organize your team efficiently
                </p>
              </div>
            </div>

            {/* Add Staff Button */}
            <button
              onClick={() => {
                setModalOpen(true);
                setModalMode("add");
              }}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg 
                     transition-all duration-200 active:scale-95"
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Add Staff</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-9xl mx-auto px-6">
        <ToastContainer />
        <div className="flex justify-between items-center mb-4 mt-6 ml-8">
          <SearchBar
            placeholder="Search staff by name or email..."
            onSearch={(query) => {
              setSearchQuery(query);
              setCurrentPage(1);
            }}
          />
        </div>

        {staff.length >= 1 ? (
          <div className="bg-[#141518] border border-gray-800/60 rounded-2xl p-6 shadow-xl backdrop-blur-md">
            <ReusableTable
              title="Staff Members"
              columns={columns}
              data={staff}
              loading={loading}
              minWidth="min-w-[100px]"
              actions={[
                { type: "view", onClick: handleView },
                // { type: "edit", onClick: handleEdit },
                { type: "delete", onClick: handleDelete },
              ]}
              toggleField={{
                accessor: "isBlocked",
                invert: true,
                onToggle: (row, value) => {
                  updateStaffStatus(row, !value);
                },
              }}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center py-24 bg-[#141518] border border-gray-800/60 rounded-2xl shadow-xl">
            <Users className="w-20 h-20 text-gray-600 mb-6" />
            <p className="text-gray-400 text-lg mb-3">
              No staff members found.
            </p>
            <p className="text-gray-500 mb-8">
              Start by adding your first staff member.
            </p>
          </div>
        )}

        {/* Footer spacing */}
        <div className="py-10" />
      </main>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <ReusableModal
          isOpen={modalOpen}
          tagName="skills"
          onClose={() => {
            setModalOpen(false);
            setCurrentRow(null);
            setModalErrors({});
          }}
          onSubmit={handleSubmit}
          onFieldChange={handleFieldChange}
          loading={loading}
          title={
            modalMode === "add"
              ? "Add Staff"
              : modalMode === "edit"
              ? "Edit Staff"
              : "View Staff"
          }
          submitText={
            modalMode === "add"
              ? "Create Plan"
              : modalMode === "edit"
              ? "Save Changes"
              : ""
          }
          cancelText="Close"
          mode={modalMode}
          fields={[
            {
              name: "staffName",
              label: "Staff Name *",
              type: "text",
              value: currentRow?.staffName || "",
            },
            {
              name: "email",
              label: "Email *",
              type: "text",
              value: currentRow?.email || "",
            },
            {
              name: "role",
              label: "role",
              type: "select",
              options: ["Chef", "Staff"],
              value: currentRow?.role || [],
            },
          ]}
          externalErrors={modalErrors}
        />
      )}
    </div>
  );
};

export default StaffManagementPage;
