

import { useEffect, useState } from "react";
import SuperAdminNavbar from "../../Components/Component/SuperAdmin/SuperAdminNavbar";
import SuperAdminSidebar from "../../Components/Component/SuperAdmin/SuperAdminSideBar";
import ReusableTable from "../../Components/Elements/Reusable/reusableTable";
import type { SubscriptionPlan } from "../../types/SuperAdmin";
import Pagination from "../../Components/Elements/Reusable/Pagination";
import { createPlan, deletePlan } from "../../services/planService";
import { showErrorToast } from "../../Components/Elements/ErrorToast";
import { showSuccessToast } from "../../Components/Elements/SuccessToast";
import { ToastContainer } from "react-toastify";
import { PlanAddingValidation } from "../../Validation/planAddingvalidation";
import type { ISubscriptionPlan } from "../../types/PlanTypes";
import { showConfirm } from "../../Components/Elements/ConfirmationSwall";
import { getAllPlan, editPlan } from "../../services/planService";
import ReusableModal from "../../Components/modals/SuperAdmin/GeneralModal";
export default function SubscriptionPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalErrors, setModalErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SubscriptionPlan | any>({});
  const [plan, setPlans] = useState<ISubscriptionPlan[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const fetchPlans = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getAllPlan(page, 10);
      await new Promise((res) => setTimeout(res, 300));
      setPlans(response.data.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error("Error loading plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    fetchPlans(currentPage);
  }, [currentPage]);
  const columns = [
    { header: "Plan Name", accessor: "planName" },
    { header: "Price", accessor: "price" },
    { header: "Duration", accessor: "duration" },
    { header: "Features", accessor: "features" },
    { header: "No Of Staff", accessor: "noOfStaff" },
  ];

  const handleSubmit = async (data: SubscriptionPlan) => {
    try {
      const errors = PlanAddingValidation(data);
      if (Object.keys(errors).length) {
        setModalErrors(errors);
        return;
      } else {
        if (modalMode == "add") {
          const confirmed = await showConfirm(
            "Add this plan?",
            `Are you sure you want to Add "${data.planName}"?`,
            "Add",
            "Cancel",
          );

          if (!confirmed) return;
          const create = async () => {
            const res = await createPlan(data);
            if (res.success) {
              setModalOpen(false);
              setModalErrors({});
              showSuccessToast(res.message);
              fetchPlans();
            } else {
              showErrorToast(res.message);
            }
          };
          create();
        } else if (modalMode == "edit") {
          try {
            const edit = async () => {
              const id = currentRow._id;
              const confirmed = await showConfirm(
                "Edit this plan?",
                `Are you sure you want to Add "${data.planName}"?`,
                "Edit",
                "Cancel",
              );

              if (!confirmed) return;
              const res = await editPlan(id, data);
              if (res.success) {
                setModalOpen(false);
                setModalErrors({});
                showSuccessToast(res.message);
                fetchPlans();
                setCurrentRow(null);
              } else {
                showErrorToast(res.message);
              }
            };
            edit();
          } catch (error: any) {
            showErrorToast(error.message);
          }
        }
      }
    } catch (error: any) {
      showErrorToast(error.message);
    }
  };
  const handleFieldChange = (name: string, value: any) => {
    const updatedForm = { ...formData, [name]: value };

    setFormData(updatedForm);

    const errors = PlanAddingValidation(updatedForm);
    setModalErrors(errors);
  };

  const handleView = (row: any) => {
    setCurrentRow(row);
    setModalMode("view");
    setModalOpen(true);
  };
  const handleEdit = (row: any) => {
    setCurrentRow(row);
    setFormData(row);
    setModalMode("edit");
    setModalOpen(true);
  };
  const handleDelete = (row: any) => {
    try {
      const del = async () => {
        const confirmed = await showConfirm(
          "Delete this plan?",
          `Are you sure you want to delete "${row.planName}"?`,
          "Delete",
          "Cancel",
        );

        if (!confirmed) return;
        const res = await deletePlan(row._id);
        if (res.success) {
          setModalOpen(false);
          setModalErrors({});
          showSuccessToast(res.message);
          fetchPlans();
        } else {
          showErrorToast(res.message);
        }
      };
      del();
    } catch (error: any) {
      showErrorToast(error.message);
    }
  };
  return (
    <div className="flex h-screen bg-neutral-950 text-white font-sans selection:bg-amber-500/30 overflow-hidden">
      <ToastContainer />

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
                Subscription Plans
              </h1>
              <p className="text-neutral-500 mt-2 font-medium">
                Manage and define restaurant subscription tiers and pricing.
              </p>
            </div>
            <button
              onClick={() => {
                (setModalOpen(true), setModalMode("add"));
              }}
              className="px-6 py-3 bg-amber-500 text-black text-sm font-black rounded-xl shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all flex items-center gap-2 active:scale-95 uppercase tracking-widest"
            >
              <div className="bg-black/10 p-1 rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
              New Plan
            </button>
          </div>

          <div className="bg-neutral-900/40 border border-neutral-800 rounded-[2.5rem] p-8 backdrop-blur-md shadow-xl mb-10">
            <ReusableTable
              title="Current Active Plans"
              columns={columns}
              data={plan}
              loading={loading}
              actions={[
                { type: "view", onClick: handleView },
                { type: "edit", onClick: handleEdit },
                { type: "delete", onClick: handleDelete },
              ]}
            />
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </main>
      </div>
      {/* MODAL (Transparent Background) */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center 
          bg-black/40 backdrop-blur-sm"
        >
          <ReusableModal
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setCurrentRow(null);
              setModalErrors({});
            }}
            onSubmit={handleSubmit}
            onFieldChange={handleFieldChange}
            title={
              modalMode === "add"
                ? "Add Subscription Plan"
                : modalMode === "edit"
                  ? "Edit Subscription Plan"
                  : "View Subscription Plan"
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
                name: "planName",
                label: "Plan Name *",
                type: "text",
                value: currentRow?.planName || "",
              },
              {
                name: "price",
                label: "Price *",
                type: "number",
                value: currentRow?.price || "",
              },
              {
                name: "duration",
                label: "Duration",
                type: "duration",
                options: ["1 Month", "6 Month", "1 Year"],
                value: currentRow?.duration,
              },
              {
                name: "noOfStaff",
                label: "No of staff *",
                type: "number",
                value: currentRow?.noOfDishes || "",
              },
              {
                name: "noOfDishes",
                label: "No of Dish *",
                type: "number",
                value: currentRow?.noOfStaff || "",
              },
              {
                name: "features",
                label: "Features",
                type: "multi-select",
                options: [
                  "Access to full menu",
                  "Priority support",
                  "Weekly Report",
                  "Monthly Analytics",
                  "All Basic Plan Support",
                  "Analytic Dashboard(limited)",
                ],
                value: currentRow?.features || [],
              },
            ]}
            externalErrors={modalErrors}
          />
        </div>
      )}
    </div>
  );
}
