import { ChartNoAxesColumn, UtensilsCrossed } from "lucide-react";
import SearchBar from "../../Elements/Reusable/reusableSearchBar";
import { ToastContainer } from "react-toastify";
import ReusableModal from "../../modals/SuperAdmin/GeneralModal";
import Pagination from "../../Elements/Reusable/Pagination";
import { useState } from "react";
import ReusableTable from "../../Elements/Reusable/reusableTable";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  addItems,
  changeItemStatus,
  deleteItem,
  editItem,
  getAllItems,
} from "../../../services/ItemsService";
import type { RootState } from "../../../redux/store/store";
import type { IItem, IItemResponse } from "../../../types/Items";
import type { CategoryResponse } from "../../../types/category";
import { getAllCategory } from "../../../services/category";
import { showSuccessToast } from "../../Elements/SuccessToast";
import { useEffect } from "react";
import { getAllSubCategory } from "../../../services/subCategory";
import { showConfirm } from "../../Elements/ConfirmationSwall";
import { useQueryClient } from "@tanstack/react-query";
import type { SubCategoryResponse } from "../../../types/subCategory";
import { getAllVarient } from "../../../services/varient";
import type { IGetVariantsResponse } from "../../../types/varient";
import {
  validateImages,
  validateItem,
} from "../../../Validation/validateItems";
import { showErrorToast } from "../../Elements/ErrorToast";
const ItemComponent = () => {
  const [currentRow, setCurrentRow] = useState<any>(null);
  const [modalErrors, setModalErrors] = useState<{ [key: string]: string }>({});
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(3);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchTerm, setSearchQuery] = useState("");
  const restaurentId = useSelector((state: RootState) => state.auth.admin?._id);
  const [subCategory, setSubCategory] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [subCategoryId, setSubCategoryId] = useState<string>("");
  const [categoryId, setCategoryId] = useState("");
  const limit = 10;
  const queryClient = useQueryClient();
  const columns = [
    { header: "Item Name", accessor: "name" },
    { header: "Price", accessor: "price" },
    {
      header: "Stock",
      accessor: "stock",
      render: (value: number | null | undefined) => {
        return value ?? "Null";
      },
    },
    {
      header: "Preparation Time",
      accessor: "preparationTime",
      render: (value: number | null | undefined) => {
        return value != null ? `${value} minutes` : "—";
      },
    },
    {
      header: "Created At",
      accessor: "createdAt",
      render: (value: string) => {
        const date = new Date(value);
        return date.toLocaleDateString();
      },
    },
  ];

  const {
    data: VarientList,
    isLoading: isVarientCaLoading,
    isFetching: isVarientFetching,
  } = useQuery<IGetVariantsResponse, Error>({
    queryKey: ["VarientList", restaurentId, currentPage, debouncedSearch],
    queryFn: () => getAllVarient(currentPage, limit, debouncedSearch),
  });
  console.log(VarientList, "list is ehre amere");

  const {
    data: ItemsList,
    isLoading: isItemCaLoading,
    isFetching: isItemFetching,
  } = useQuery<IItemResponse, Error>({
    queryKey: ["ItemsList", restaurentId, currentPage, debouncedSearch],
    queryFn: () =>
      getAllItems(restaurentId as string, currentPage, limit, debouncedSearch),
  });

  const {
    data: SubCategory,
    isLoading: isSubCategoryLoading,
    isFetching: isSubCategoryFetching,
  } = useQuery<SubCategoryResponse, Error>({
    queryKey: ["SubCategory", restaurentId, currentPage, debouncedSearch],
    queryFn: () =>
      getAllSubCategory(
        restaurentId as string,
        currentPage,
        limit,
        debouncedSearch,
      ),
    enabled: modalOpen && !!restaurentId,
  });

  const variantMap =
    VarientList?.data?.reduce((acc: any, v) => {
      acc[v.name] = v.Varient.map((opt) => opt.name);
      return acc;
    }, {}) || {};

  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    isFetching: isCategoryFetching,
  } = useQuery<CategoryResponse, Error>({
    queryKey: ["categories", restaurentId],
    queryFn: () =>
      getAllCategory(restaurentId as string, currentPage, limit, ""),
    enabled: modalOpen && !!restaurentId,
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
    if (ItemsList?.total) {
      setTotalPages(Math.ceil(ItemsList.total / limit));
    }
  }, [ItemsList]);

  useEffect(() => {
    if (modalMode === "edit" && currentRow && SubCategory?.data) {
      const names =
        SubCategory?.data
          ?.filter((sub) => sub.categoryName === currentRow?.categoryId?.name)
          .map((sub) => sub.name) ?? [];

      setSubCategory(names);
    }
  }, [modalMode, currentRow, SubCategory]);

  const categoryList = categoryData?.data.map((cat) => cat.name);
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  const handleSubmit = (row: any) => {
    const { isValid, errors } = validateItem(row);
    if (!isValid) {
      setModalErrors(errors);
      return;
    }
    const formData = new FormData();
    formData.append("name", row.name);
    formData.append("price", row.price);
    formData.append("stock", row.stock);
    formData.append("maxQuantityPerOrder", row.maxQuantityPerOrder);
    formData.append("preparationTime", row.preparationTime);
    formData.append("categoryId", categoryId || currentRow?.categoryId?._id);
    if (subCategory.length) {
      formData.append(
        "subCategoryId",
        subCategoryId || currentRow?.subCategoryId?._id,
      );
    }
    formData.append("restaurantId", restaurentId as string);
    if (row.variantPricing) {
      formData.append("variantPricing", JSON.stringify(row.variantPricing));
    }
    row.images?.forEach((file: File) => {
      formData.append("images", file);
    });

    for (let [key, val] of formData.entries()) {
      console.log(key, val);
    }

    if (modalMode == "add") {
      const itemsAdd = async () => {
        try {
          const res = await addItems(formData);
          if (res.success) {
            showSuccessToast(res.message);
            queryClient.invalidateQueries({
              queryKey: ["ItemsList", restaurentId],
            });
            setModalOpen(false);
            setCurrentRow({});
            setModalErrors({});
          }
        } catch (error) {
          return;
        }
      };
      itemsAdd();
    } else {
      const EditItem = async () => {
        try {
          const res = await editItem(currentRow._id, formData);
          if (res.success) {
            showSuccessToast(res.message);
            queryClient.invalidateQueries({
              queryKey: ["ItemsList", restaurentId],
            });
            setModalOpen(false);
            setCurrentRow({});
            setModalErrors({});
          }
        } catch (error) {
          return;
        }
      };
      EditItem();
    }
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
  const updateItemStatus = async (row: any, value: any) => {
    const confirmed = await showConfirm(
      "Change this status?",
      `Are you Wand to Change the Status?`,
      "Change",
      "Cancel",
    );
    if (!confirmed) return;
    const newValue = value;
    const changeStatus = async () => {
      try {
        const res = await changeItemStatus(row._id, newValue);
        if (res.success) {
          showSuccessToast(res.message);
          queryClient.invalidateQueries({
            queryKey: ["ItemsList", restaurentId],
          });
          setModalOpen(false);
        }
      } catch (error) {
        return;
      }
    };
    changeStatus();
  };

  const handleFieldChange = (name: string, value: any) => {
    const updatedRow = {
      ...currentRow,
      [name]: value,
    };
    console.log(updatedRow, "rowlsleodlsod");
    setCurrentRow(updatedRow);

    const { errors } = validateItem(updatedRow);
    setModalErrors(errors);

    // existing category logic
    if (name === "categoryName") {
      const cat = categoryData?.data?.find((c) => c.name === value);
      setCategoryId(cat?.id as string);

      const names =
        SubCategory?.data
          ?.filter((sub) => sub.categoryName === value)
          .map((sub) => sub.name) ?? [];

      setSubCategory(names);
    }

    if (name === "SubcategoryName") {
      const sub = SubCategory?.data?.find((s) => s.name === value);
      setSubCategoryId(sub?.id as string);
    }
  };

  const handleDelete = async (row: IItem) => {
    const confirmed = await showConfirm(
      "Delete this Item?",
      `Are you sure you want to delete ${row.name}?`,
      "Delete",
      "Cancel",
    );
    if (!confirmed) return;
    const del = async () => {
      try {
        const res = await deleteItem(row._id);
        if (res.success) {
          showSuccessToast(res.message);
          queryClient.invalidateQueries({
            queryKey: ["ItemsList", restaurentId],
          });
          setModalOpen(false);
        }
      } catch (error) {
        return;
      }
    };
    del();
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const Items = ItemsList?.data;
  return (
    <div>
      <ToastContainer />
      <header className="bg-[#111214] border-b border-gray-800/70 backdrop-blur-md shadow-md sticky top-0 z-20">
        <div className="max-w-9xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-blue-600/20">
                <UtensilsCrossed className="w-7 h-7 text-blue-400" />
              </div>

              <div>
                <h1 className="text-2xl font-semibold tracking-wide">
                  Items Management
                </h1>
                <p className="text-gray-400 text-sm">
                  Manage and organize your Items efficiently
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
              <UtensilsCrossed className="w-5 h-5" />
              <span className="font-medium">Add Items</span>
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
        {Items && Items.length >= 1 ? (
          <div className="bg-[#141518] border border-gray-800/60 rounded-2xl p-6 shadow-xl backdrop-blur-md">
            <ReusableTable
              title="Staff Members"
              columns={columns}
              data={Items}
              loading={loading}
              minWidth="min-w-[100px]"
              actions={[
                { type: "view", onClick: handleView },
                { type: "edit", onClick: handleEdit },
                { type: "delete", onClick: handleDelete },
              ]}
              toggleField={{
                accessor: "isActive",
                invert: false,
                onToggle: (row, value) => {
                  updateItemStatus(row, value);
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
            <UtensilsCrossed className="w-20 h-20 text-gray-600 mb-6" />
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
              ? "Add Items"
              : modalMode === "edit"
                ? "Edit Items"
                : "View Items"
          }
          submitText={
            modalMode === "add"
              ? "Create Items"
              : modalMode === "edit"
                ? "Save Changes"
                : ""
          }
          cancelText="Close"
          mode={modalMode}
          fields={[
            {
              name: "name",
              label: "Item Name *",
              type: "text",
              value: currentRow?.name || "",
            },
            {
              name: "price",
              label: "Price *",
              type: "number",
              value: currentRow?.price || "",
            },
            {
              name: "stock",
              label: "Stock *",
              type: "number",
              placeholder: "Enter Stock : Optional",
              value: currentRow?.stock || "",
            },
            {
              name: "points",
              label: "Points *",
              type: "number",
              placeholder: "Enter Points : Optional",
              value: currentRow?.points || "",
            },
            {
              name: "preparationTime",
              label: "PrepartionTime (minutes)",
              type: "number",
              placeholder: "preparationTime : Optional",
              value: currentRow?.preparationTime || "",
            },
             {
              name: "maxQuantityPerOrder",
              label: "maxQuantityPerOrder *",
              type: "number",
              placeholder: "Enter maxQuantityPerOrder: Optional",
              value: currentRow?.maxQuantityPerOrder || "",
            },
            {
              name: "categoryName",
              label: "Main Category",
              type: "select",
              options: categoryList,
              value: currentRow?.categoryId?.name || [],
            },
            {
              name: "SubcategoryName",
              label: "SubCategory Name",
              type: "select",
              options: subCategory,
              value: currentRow?.subCategoryId?.name || [],
            },
            {
              name: "variant",
              label: "Variant Pricing",
              type: "variant-price",
              variantMap: variantMap,
              value: currentRow?.variant || {
                category: "",
                values: [],
              },
            },

            {
              name: "images",
              label: "Images",
              type: "image",
              value: currentRow?.images,
            },
          ]}
          externalErrors={modalErrors}
        />
      )}
    </div>
  );
};

export default ItemComponent;
