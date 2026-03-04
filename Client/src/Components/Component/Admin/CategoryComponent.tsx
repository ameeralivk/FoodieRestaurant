import { ToastContainer } from "react-toastify";
import { LayoutGrid } from "lucide-react";
import { useState } from "react";
import SearchBar from "../../Elements/Reusable/reusableSearchBar";
import ReusableTable from "../../Elements/Reusable/reusableTable";
import Pagination from "../../Elements/Reusable/Pagination";
import ReusableModal from "../../modals/SuperAdmin/GeneralModal";
import { useQuery } from "@tanstack/react-query";
import type { RootState } from "../../../redux/store/store";
import { useSelector } from "react-redux";
import { showSuccessToast } from "../../Elements/SuccessToast";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  addCategory,
  deleteCategory,
  editCategory,
  getAllCategory,
} from "../../../services/category";
import { showConfirm } from "../../Elements/ConfirmationSwall";
import type {
  Category,
  CategoryFormData,
  CategoryResponse,
} from "../../../types/category";
import { validateCategory } from "../../../Validation/categoryValidation";
const CategoryComponent = () => {
  const [currentRow, setCurrentRow] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [modalErrors, setModalErrors] = useState<{ [key: string]: string }>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchTerm, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const restaurentId = useSelector((state: RootState) => state.auth.admin?._id);
  const limit = 10;
  const columns = [
    { header: "CategoryName", accessor: "name" },
    { header: "Description", accessor: "description" },
  ];
  const queryClient = useQueryClient();
  const { data } = useQuery<CategoryResponse, Error>({
    queryKey: [
      "activeCategory",
      restaurentId,
      currentPage,
      limit,
      debouncedSearch,
    ],
    queryFn: () =>
      getAllCategory(
        restaurentId as string,
        currentPage,
        limit,
        debouncedSearch,
      ),
    staleTime: 5000,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (data?.total) {
      setTotalPages(Math.ceil(data.total / limit));
    }
  }, [data]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
  };
  const handleView = (row: CategoryFormData) => {
    setCurrentRow(row);
    setModalOpen(true);
    setModalMode("view");
  };
  const handleDelete = async (row: Category) => {
    const confirmed = await showConfirm(
      "Delete this Category?",
      `Are you sure you want to delete ${row.name}?`,
      "Delete",
      "Cancel",
    );
    if (!confirmed) return;
    const del = async () => {
      try {
        const res = await deleteCategory(restaurentId, row.id);
        if (res.success) {
          showSuccessToast(res.message);
          queryClient.invalidateQueries({
            queryKey: ["activeCategory", restaurentId],
          });
          setModalOpen(false);
        }
      } catch (error) {
        return;
      }
    };
    del();
  };
  const handleEdit = (row: any) => {
    setCurrentRow(row);
    setModalOpen(true);
    setModalMode("edit");
  };
  const handleFieldChange = (name: string, value: any) => {
    const updatedRow = { ...currentRow, [name]: value };
    setCurrentRow(updatedRow);
    const validationErrors = validateCategory(updatedRow);
    setModalErrors(validationErrors.errors);
  };

  const handleSubmit = (row: CategoryFormData) => {
    const data = {
      name: row.name,
      description: row.description,
    };
    const validate = validateCategory(data);
    if (!validate.isValid) {
      setModalErrors(validate.errors);
      return;
    }
    if (modalMode == "add") {
      const addcategory = async () => {
        try {
          const res = await addCategory(
            row.name,
            row.description,
            restaurentId,
          );
          if (res.success) {
            showSuccessToast(res.message);
            queryClient.invalidateQueries({
              queryKey: ["activeCategory", restaurentId],
            });
            setModalOpen(false);
            setCurrentRow({});
            setModalErrors({});
          }
        } catch (error) {
          return;
        }
      };
      addcategory();
    } else {
      const editcategory = async () => {
        try {
          setLoading(true)
          const res = await editCategory(restaurentId, currentRow.id, data);
          if (res.success) {
            showSuccessToast(res.message);
            queryClient.invalidateQueries({
              queryKey: ["activeCategory", restaurentId],
            });
            setLoading(false)
            setModalOpen(false);
            setModalErrors({});
            setCurrentRow({});
          }
        } catch (error) {
          console.error(error);
          return { success: false };
        }
      };
      editcategory();
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const Categories = data?.data ? data?.data : [];
  return (
    <div>
      <ToastContainer />
      <header className="bg-[#111214] border-b border-gray-800/70 backdrop-blur-md shadow-md sticky top-0 z-20">
        <div className="max-w-9xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-blue-600/20">
                <LayoutGrid className="w-7 h-7 text-blue-400" />
              </div>

              <div>
                <h1 className="text-2xl font-semibold tracking-wide">
                  Category Management
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
              <LayoutGrid className="w-5 h-5" />
              <span className="font-medium">Add Category</span>
            </button>
          </div>
        </div>
      </header>
      <div className="ml-4">
        <div className="flex justify-between items-center mb-4 mt-6 ml-8">
          <SearchBar
            placeholder="Search staff by name or email..."
            onSearch={handleSearch}
          />
        </div>
        {Categories.length >= 1 ? (
          <div className="bg-[#141518] border border-gray-800/60 rounded-2xl p-6 shadow-xl backdrop-blur-md">
            <ReusableTable
              title="Staff Members"
              columns={columns}
              data={Categories}
              loading={loading}
              minWidth="min-w-[100px]"
              actions={[
                { type: "view", onClick: handleView },
                { type: "edit", onClick: handleEdit },
                { type: "delete", onClick: handleDelete },
              ]}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center py-24 bg-[#141518] border border-gray-800/60 rounded-2xl shadow-xl">
            <LayoutGrid className="w-20 h-20 text-gray-600 mb-6" />
            <p className="text-gray-400 text-lg mb-3">
              No staff members found.
            </p>
            <p className="text-gray-500 mb-8">
              Start by adding your first staff member.
            </p>
          </div>
        )}
      </div>
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
              ? "Add Category"
              : modalMode === "edit"
                ? "Edit Category"
                : "View Category"
          }
          submitText={
            modalMode === "add"
              ? "Create Category"
              : modalMode === "edit"
                ? "Save Changes"
                : ""
          }
          cancelText="Close"
          mode={modalMode}
          fields={[
            {
              name: "name",
              label: "Category Name *",
              type: "text",
              value: currentRow?.name || "",
            },
            {
              name: "description",
              label: "Description *",
              type: "text",
              value: currentRow?.description || "",
            },
          ]}
          externalErrors={modalErrors}
        />
      )}
    </div>
  );
};

export default CategoryComponent;
