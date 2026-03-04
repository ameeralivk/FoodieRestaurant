import { TableOfContents } from "lucide-react";
import SearchBar from "../../Elements/Reusable/reusableSearchBar";
import { ToastContainer } from "react-toastify";
import ReusableModal from "../../modals/SuperAdmin/GeneralModal";
import Pagination from "../../Elements/Reusable/Pagination";
import { useState } from "react";
import ReusableTable from "../../Elements/Reusable/reusableTable";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import type { IItem} from "../../../types/Items";
import type { CategoryResponse } from "../../../types/category";
import { getAllCategory } from "../../../services/category";
import { showSuccessToast } from "../../Elements/SuccessToast";
import { useEffect } from "react";
import { showConfirm } from "../../Elements/ConfirmationSwall";
import { useQueryClient } from "@tanstack/react-query";
import { validateItem } from "../../../Validation/validateItems";
import {
  AddVarient,
  deleteVarient,
  editVarient,
  getAllVarient,
} from "../../../services/varient";
import type { IGetVariantsResponse } from "../../../types/varient";
const VarientComponent = () => {
  const [currentRow, setCurrentRow] = useState<any>(null);
  const [modalErrors, setModalErrors] = useState<{ [key: string]: string }>({});
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [modalOpen, setModalOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(3);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchTerm, setSearchQuery] = useState("");
  const restaurentId = useSelector((state: RootState) => state.auth.admin?._id);
  // const [subCategory, setSubCategory] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  // const [subCategoryId, setSubCategoryId] = useState<string>("");
  // const [categoryId, setCategoryId] = useState("");
  const [loading,setLoading] = useState(false)
  const limit = 10;
  const queryClient = useQueryClient();
  const columns = [
    { header: "VarientName", accessor: "name" },
    {
      header: "Types",
      accessor: "Varient",
      render: (value: { name: string }[]) =>
        value.map((v) => v.name).join(", "),
    },
  ];

  const {
    data: VarientList,
  } = useQuery<IGetVariantsResponse, Error>({
    queryKey: ["VarientList", restaurentId, currentPage, debouncedSearch],
    queryFn: () => getAllVarient(currentPage, limit, debouncedSearch),
  });

  // const {
  //   data: SubCategory,
  // } = useQuery<SubCategoryResponse, Error>({
  //   queryKey: ["SubCategory", restaurentId, currentPage, debouncedSearch],
  //   queryFn: () =>
  //     getAllSubCategory(
  //       restaurentId as string,
  //       currentPage,
  //       limit,
  //       debouncedSearch,
  //     ),
  //   enabled: modalOpen && !!restaurentId,
  // });

  const {
  
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
    if (VarientList?.total) {
      setTotalPages(Math.ceil(VarientList.total / limit));
    }
  }, [VarientList]);

  // useEffect(() => {
  //   if (modalMode === "edit" && currentRow && SubCategory?.data) {
  //     const names =
  //       SubCategory?.data
  //         ?.filter((sub) => sub.categoryName === currentRow?.categoryId?.name)
  //         .map((sub) => sub.name) ?? [];

  //     // setSubCategory(names);
  //   }
  // }, [modalMode, currentRow, SubCategory]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  const handleSubmit = (row: any) => {
    if (modalMode == "add") {
      const varientAdd = async () => {
        try {
          let varients = [];
          for (let char of row.skills) {
            varients.push({ name: char });
          }
          const res = await AddVarient(
            row.GroupName,
            varients,
            restaurentId as string,
          );

          if (res.success) {
            showSuccessToast(res.message);
            queryClient.invalidateQueries({
              queryKey: ["VarientList"],
            });
            setModalOpen(false);
            setCurrentRow({});
            setModalErrors({});
          }
        } catch (error) {
          setLoading(false)
          return;
        }
      };
      varientAdd();
    } else {
      const EditItem = async () => {
        try {
          let varients = [];
          for (let char of row.skills) {
            varients.push({ name: char });
          }
          console.log(currentRow._id, "ro");
          const res = await editVarient(
            currentRow._id,
            row.name,
            varients,
            restaurentId as string,
          );
          if (res.success) {
            showSuccessToast(res.message);
            queryClient.invalidateQueries({
              queryKey: ["VarientList", restaurentId],
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
  // const updateItemStatus = async (row: any, value: any) => {
  //   const confirmed = await showConfirm(
  //     "Change this status?",
  //     `Are you Wand to Change the Status?`,
  //     "Change",
  //     "Cancel",
  //   );
  //   if (!confirmed) return;
  //   const newValue = value;
  //   const changeStatus = async () => {
  //     try {
  //       const res = await changeItemStatus(row._id, newValue);
  //       if (res.success) {
  //         showSuccessToast(res.message);
  //         queryClient.invalidateQueries({
  //           queryKey: ["ItemsList", restaurentId],
  //         });
  //         setModalOpen(false);
  //       }
  //     } catch (error) {
  //       return;
  //     }
  //   };
  //   changeStatus();
  // };

  const handleFieldChange = (name: string, value: any) => {
    const updatedRow = {
      ...currentRow,
      [name]: value,
    };

    setCurrentRow(updatedRow);

    const { errors } = validateItem(updatedRow);
    setModalErrors(errors);

    // existing category logic
    // if (name === "categoryName") {
    //   // const cat = categoryData?.data?.find((c) => c.name === value);
    //   // setCategoryId(cat?.id as string);

    //   const names =
    //     SubCategory?.data
    //       ?.filter((sub) => sub.categoryName === value)
    //       .map((sub) => sub.name) ?? [];

    //   // setSubCategory(names);
    // }

    if (name === "SubcategoryName") {
      // const sub = SubCategory?.data?.find((s) => s.name === value);
      // setSubCategoryId(sub?.id as string);
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
        const res = await deleteVarient(row._id);
        if (res.success) {
          showSuccessToast(res.message);
          queryClient.invalidateQueries({
            queryKey: ["VarientList", restaurentId],
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
  const Varients = VarientList?.data;

  return (
    <div>
      <ToastContainer />
      <header className="bg-[#111214] border-b border-gray-800/70 backdrop-blur-md shadow-md sticky top-0 z-20">
        <div className="max-w-9xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-blue-600/20">
                <TableOfContents className="w-7 h-7 text-blue-400" />
              </div>

              <div>
                <h1 className="text-2xl font-semibold tracking-wide">
                  Varient Managment
                </h1>
                <p className="text-gray-400 text-sm">
                  Manage and organize your Varients efficiently
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
              <TableOfContents className="w-5 h-5" />
              <span className="font-medium">Add Varients</span>
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
        {Varients && Varients.length >= 1 ? (
          <div className="bg-[#141518] border border-gray-800/60 rounded-2xl p-6 shadow-xl backdrop-blur-md">
            <ReusableTable
              title="Staff Members"
              columns={columns}
              data={Varients}
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
            <TableOfContents className="w-20 h-20 text-gray-600 mb-6" />
            <p className="text-gray-400 text-lg mb-3">No Varients found.</p>
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
              ? "Add Varients"
              : modalMode === "edit"
                ? "Edit Varients"
                : "View Items"
          }
          submitText={
            modalMode === "add"
              ? "Create Varients"
              : modalMode === "edit"
                ? "Save Changes"
                : ""
          }
          cancelText="Close"
          mode={modalMode}
          fields={[
            {
              name: "GroupName",
              label: "GroupName *",
              type: "text",
              value: currentRow?.name || "",
            },
            {
              name: "Varieties",
              label: "Varieties *",
              type: "tags",
              value: currentRow?.Varient?.map((v: any) => v.name) || [],
            },
          ]}
          externalErrors={modalErrors}
        />
      )}
    </div>
  );
};

export default VarientComponent;
