import { ToastContainer } from "react-toastify";
import { LayoutPanelTop } from "lucide-react";
import { useState } from "react";
import SearchBar from "../../Elements/Reusable/reusableSearchBar";
import ReusableTable from "../../Elements/Reusable/reusableTable";
import ReusableModal from "../../modals/SuperAdmin/GeneralModal";
import Pagination from "../../Elements/Reusable/Pagination";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import {
  addSubCategory,
  deleteSubCategory,
  editSubCategory,
  getAllSubCategory,
} from "../../../services/subCategory";
import { useQueryClient } from "@tanstack/react-query";
import { showSuccessToast } from "../../Elements/SuccessToast";
import type { CategoryResponse } from "../../../types/category";
import { getAllCategory } from "../../../services/category";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { showConfirm } from "../../Elements/ConfirmationSwall";
import type {
  SubCategory,
  subCategoryData,
  SubCategoryFormData,
  SubCategoryResponse,
} from "../../../types/subCategory";
import { validateSubCategory } from "../../../Validation/subCategoryValidation";
const SubCategoryComponent = () => {
  const [currentRow, setCurrentRow] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [modalErrors, setModalErrors] = useState<{ [key: string]: string }>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const restaurentId = useSelector((state: RootState) => state.auth.admin?._id);
  const limit = 10;
  const queryClient = useQueryClient();

  const {
    data: categoryData,
  } = useQuery<CategoryResponse, Error>({
    queryKey: ["categories", restaurentId],
    queryFn: () =>
      getAllCategory(restaurentId as string, currentPage, limit, ""),
  });

  const {
    data: subCategoryData,
  } = useQuery<SubCategoryResponse, Error>({
    queryKey: ["subCategories", restaurentId, currentPage, debouncedSearch],
    queryFn: () =>
      getAllSubCategory(
        restaurentId as string,
        currentPage,
        limit,
        debouncedSearch
      ),
  });

  const subCategories = subCategoryData?.data;
  const categoryNames: string[] =
    categoryData?.data?.map((category) => category.name) ?? [];

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
    if (subCategoryData?.total) {
      setTotalPages(Math.ceil(subCategoryData.total / limit));
    }
  }, [subCategoryData]);

  const columns = [
    { header: "SubCategoryName", accessor: "name" },
    { header: "Description", accessor: "description" },
    { header: "Category", accessor: "categoryName" },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  const handleView = (row: any) => {
    setCurrentRow(row);
    setModalOpen(true);
    setModalMode("view");
  };
  const handleEdit = (row: any) => {
    setCurrentRow(row);
    setModalOpen(true);
    setModalMode("edit");
  };
  const handleDelete = async (row: SubCategory) => {
    const confirmed = await showConfirm(
      "Delete this SubCategory?",
      `Are you sure you want to delete ${row.name}?`,
      "Delete",
      "Cancel"
    );
    if (!confirmed) return;
    const del = async () => {
      try {
        setLoading(true)
        const res = await deleteSubCategory(row.id);
        if (res.success) {
          setLoading(false)
          showSuccessToast(res.message);
          queryClient.invalidateQueries({
            queryKey: ["subCategories", restaurentId],
          });
          setModalOpen(false);
        }
      } catch (error) {
        setLoading(false)
        return;
      }
    };
    del();
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleSubmit = (row: SubCategoryFormData) => {
    const category = categoryData?.data?.find(
      (cat) => cat.name === row.categoryName
    );
    const data: subCategoryData = {
      name: row.name,
      description: row.description,
      restaurantId: restaurentId,
      categoryId: category?.id,
    };
    const validate = validateSubCategory(data);
    if (!validate.isValid) {
      setModalErrors(validate.errors);
      return;
    }
    if (modalMode == "add") {
      const addsubCategory = async () => {
        try {
          const res = await addSubCategory(data);
          if (res.success) {
            showSuccessToast(res.message);
            queryClient.invalidateQueries({
              queryKey: ["subCategories", restaurentId],
            });
            setModalOpen(false);
            setCurrentRow({});
            setModalErrors({});
          }
        } catch (error) {
          return;
        }
      };
      addsubCategory();
    } else {
      const editsubcategory = async () => {
        try {
          const res = await editSubCategory(currentRow.id, data);
          if (res.success) {
            showSuccessToast(res.message);
            queryClient.invalidateQueries({
              queryKey: ["subCategories", restaurentId],
            });
            setModalOpen(false);
            setModalErrors({});
            setCurrentRow({});
          }
        } catch (error) {
          return;
        }
      };
      editsubcategory();
    }
  };
  const handleFieldChange = (name: string, value: any) => {
    let updatedRow = { ...currentRow, [name]: value };
    if (name === "categoryName") {
      updatedRow = { ...currentRow, ["categoryId"]: value };
    }
    setCurrentRow(updatedRow);
    const validationErrors = validateSubCategory(updatedRow);
    console.log(validationErrors, "error");
    setModalErrors(validationErrors.errors);
  };

  return (
    <div>
      <ToastContainer />
      <header className="bg-[#111214] border-b border-gray-800/70 backdrop-blur-md shadow-md sticky top-0 z-20">
        <div className="max-w-9xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-blue-600/20">
                <LayoutPanelTop className="w-7 h-7 text-blue-400" />
              </div>

              <div>
                <h1 className="text-2xl font-semibold tracking-wide">
                  SubCategory Management
                </h1>
                <p className="text-gray-400 text-sm">
                  Manage and organize your SubCategory efficiently
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
              <LayoutPanelTop className="w-5 h-5" />
              <span className="font-medium">Add SubCategory</span>
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
        {subCategories && subCategories.length >= 1 ? (
          <div className="bg-[#141518] border border-gray-800/60 rounded-2xl p-6 shadow-xl backdrop-blur-md">
            <ReusableTable
              title="Staff Members"
              columns={columns}
              data={subCategories}
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
            <LayoutPanelTop className="w-20 h-20 text-gray-600 mb-6" />
            <p className="text-gray-400 text-lg mb-3">No SubCategory found.</p>
            <p className="text-gray-500 mb-8">
              Start by adding your first subCategory.
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
              ? "Add SubCategory"
              : modalMode === "edit"
              ? "Edit SubCategory"
              : "View SubCategory"
          }
          submitText={
            modalMode === "add"
              ? "Create SubCategory"
              : modalMode === "edit"
              ? "Save Changes"
              : ""
          }
          cancelText="Close"
          mode={modalMode}
          fields={[
            {
              name: "name",
              label: "SubCategory Name *",
              type: "text",
              value: currentRow?.name || "",
            },
            {
              name: "description",
              label: "Description *",
              type: "text",
              value: currentRow?.description || "",
            },
            {
              name: "categoryName",
              label: "Main Category",
              type: "select",
              options: categoryNames,
              value: currentRow?.categoryName || [],
            },
          ]}
          externalErrors={modalErrors}
        />
      )}
    </div>
  );
};

export default SubCategoryComponent;
