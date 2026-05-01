import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import SearchBar from "../../Elements/Reusable/reusableSearchBar";
import { useState } from "react";
import Pagination from "../../Elements/Reusable/Pagination";
import ReusableModal from "../../modals/SuperAdmin/GeneralModal";
import ReusableTable from "../../Elements/Reusable/reusableTable";
import type { GetTablesResponse } from "../../../types/tableTypes";
import { useEffect } from "react";
import { showConfirm } from "../../Elements/ConfirmationSwall";
import {
  addTable,
  changeTableAvailability,
  deleteTable,
  editTable,
} from "../../../services/table";
import { showSuccessToast } from "../../Elements/SuccessToast";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getTables } from "../../../services/table";
import { TableValidation } from "../../../Validation/tableValidation";
const TableComponent = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalPages, setTotalPages] = useState(3);
  const [modalErrors, setModalErrors] = useState<{ [key: string]: string }>({});
  const [currentRow, setCurrentRow] = useState<any>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [searchTerm, setSearchQuery] = useState("");
  const restaurentId = useSelector((state: RootState) => state.auth.admin?._id);
  const limit = 10;
  const queryClient = useQueryClient();

  const { data } = useQuery<GetTablesResponse, Error>({
    queryKey: [
      "activeTable",
      restaurentId,
      currentPage,
      limit,
      debouncedSearch,
    ],
    queryFn: () =>
      getTables(restaurentId as string, currentPage, limit, debouncedSearch),
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

  const tables = data?.data ?? [];
  const columns = [
    { header: "TableNo", accessor: "tableNo" },
    { header: "Seating Capacity", accessor: "seatingCapacity" },
    {
      header: "Status",
      accessor: "isAvailable",
      render: (isAvailable: boolean) => {
        const label = isAvailable ? "Available" : "NotAvailable";
        const classes = isAvailable
          ? "bg-green-500/20 text-green-400"
          : "bg-red-500/20 text-red-400";

        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${classes}`}>
            {label}
          </span>
        );
      },
    },
  ];

  const updateTableStatus = async (row: any, value: any) => {
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
        const res = await changeTableAvailability(newValue, row._id);
        if (res.success) {
          showSuccessToast(res.message);
          // queryClient.invalidateQueries({
          //   queryKey: ["activeTable", restaurentId],
          // });
          queryClient.setQueryData<GetTablesResponse>(
            ["activeTable", restaurentId, currentPage, limit, searchTerm],
            (oldData) => {
              if (!oldData) return oldData;
              return {
                ...oldData,
                data: oldData.data.map((table) =>
                  table._id === row._id
                    ? { ...table, isAvailable: newValue }
                    : table,
                ),
              };
            },
          );
          setModalOpen(false);
        }
      } catch (error) {
        return;
      }
    };
    changeStatus();
  };

  const handleView = (row: any) => {
    setCurrentRow(row);
    setModalOpen(true);
    setModalMode("view");
  };

  const handleDelete = async (row: any) => {
    const confirmed = await showConfirm(
      "Delete this Table?",
      `Are you sure you want to delete "fdsafjdlsa"?`,
      "Delete",
      "Cancel",
    );

    if (!confirmed) return;
    const del = async () => {
      try {
        const res = await deleteTable(row._id);
        if (res.success) {
          showSuccessToast(res.message);
          queryClient.invalidateQueries({
            queryKey: ["activeTable", restaurentId],
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleEdit = (row: any) => {
    setCurrentRow(row);
    setModalOpen(true);
    setModalMode("edit");
  };
  const handleSubmit = (row: any) => {
    console.log(row);
    let data = {
      tableNo: row.tableNo,
      seatingCapacity: row.seatingCapacity,
      description: row.skills,
      isAvailable: true,
      restaurantId: restaurentId,
    };
    const validate = TableValidation(data);
    if (Object.keys(validate).length > 0) {
      setModalErrors(validate);
      return;
    }
    if (modalMode == "add") {
      const addtable = async () => {
        try {
          setLoading(true);
          const res = await addTable(data);
          if (res.success) {
            showSuccessToast(res.message);
            queryClient.invalidateQueries({
              queryKey: ["activeTable", restaurentId],
            });
            setLoading(false);
            setModalOpen(false);
            setCurrentRow({});
            setModalErrors({});
          }
        } catch (error) {
          setLoading(false);
          return;
        }
      };
      addtable();
    } else {
      const edittable = async () => {
        try {
          const res = await editTable(data, currentRow._id);
          if (res.success) {
            showSuccessToast(res.message);
            queryClient.invalidateQueries({
              queryKey: ["activeTable", restaurentId],
            });
            setModalOpen(false);
            setModalErrors({});
            setCurrentRow({});
          }
        } catch {
          return;
        }
      };
      edittable();
    }
  };

  const handleFieldChange = (name: string, value: any) => {
    const updatedRow = { ...currentRow, [name]: value };
    setCurrentRow(updatedRow);
    const validationErrors = TableValidation(updatedRow);
    console.log(validationErrors, "error");
    setModalErrors(validationErrors);
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
                <TableRestaurantIcon className="w-7 h-7 text-blue-400" />
              </div>

              <div>
                <h1 className="text-2xl font-semibold tracking-wide">
                  Table Management
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
              <TableRestaurantIcon className="w-5 h-5" />
              <span className="font-medium">Add Staff</span>
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
        {tables.length >= 1 ? (
          <div className="bg-[#141518] border border-gray-800/60 rounded-2xl p-6 shadow-xl backdrop-blur-md">
            <ReusableTable
              title="Staff Members"
              columns={columns}
              data={tables}
              loading={loading}
              minWidth="min-w-[100px]"
              qrField={{ enabled: true, urlAccessor: "qrCodeUrl" }}
              actions={[
                { type: "view", onClick: handleView },
                { type: "edit", onClick: handleEdit },
                { type: "delete", onClick: handleDelete },
              ]}
              toggleField={{
                accessor: "isAvailable",
                invert: false,
                onToggle: (row, value) => {
                  updateTableStatus(row, value);
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
            <TableRestaurantIcon className="w-20 h-20 text-gray-600 mb-6" />
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
              ? "Add Table"
              : modalMode === "edit"
                ? "Edit Table"
                : "View Table"
          }
          submitText={
            modalMode === "add"
              ? "Create Table"
              : modalMode === "edit"
                ? "Save Changes"
                : ""
          }
          cancelText="Close"
          mode={modalMode}
          fields={[
            {
              name: "tableNo",
              label: "Table No *",
              type: "number",
              value: currentRow?.tableNo || "",
            },
            {
              name: "seatingCapacity",
              label: "Seating Capacity *",
              type: "number",
              value: currentRow?.seatingCapacity || "",
            },

            {
              name: "description",
              label: "Description",
              type: "tags",
              value: currentRow?.description || [],
            },
          ]}
          externalErrors={modalErrors}
        />
      )}
    </div>
  );
};

export default TableComponent;
