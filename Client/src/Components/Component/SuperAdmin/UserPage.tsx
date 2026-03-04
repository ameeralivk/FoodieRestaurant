import { useState } from "react";
import ReusableTable from "../../Elements/Reusable/reusableTable";
import Pagination from "../../Elements/Reusable/Pagination";
import { useQuery } from "@tanstack/react-query";
import { changeUserStatus, getUsers } from "../../../services/user";
import type { IUser } from "../../../types/userTypes";
import { useEffect } from "react";
import { showConfirm } from "../../Elements/ConfirmationSwall";
import { useQueryClient } from "@tanstack/react-query";
import SearchBar from "../../Elements/Reusable/reusableSearchBar";
import { ToastContainer } from "react-toastify";
import { showSuccessToast } from "../../Elements/SuccessToast";
const UserPage = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const limit = 10;
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    {
      header: "Created At",
      accessor: "createdAt",
      render: (value: string) => {
        const date = new Date(value);
        return date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      },
    },
    {
      header: "Status",
      accessor: "isBlocked",
      render: (isAvailable: boolean) => {
        const label = isAvailable ? "NotAvailable" : "Available";
        const classes = isAvailable
          ? "bg-red-500/20 text-red-400"
          : "bg-green-500/20 text-green-400";

        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${classes}`}>
            {label}
          </span>
        );
      },
    },
  ];

  const { data, isLoading, isFetching } = useQuery<any, Error>({
    queryKey: ["activeUser", currentPage, limit, debouncedSearch],
    queryFn: () => getUsers(currentPage, limit, debouncedSearch),
    staleTime: 5000,
  });

  const updateUserStatus = async (row: any, value: boolean) => {
    const confirmed = await showConfirm(
      "Change this status?",
      `Are you Wand to Change the Status?`,
      "Change",
      "Cancel"
    );
    if (!confirmed) return;
    const changeStatus = async () => {
      try {
        setLoading(true)
        const res = await changeUserStatus(row.id, value);
        if (res.success) {
          showSuccessToast(res.message);
          setLoading(false)
          queryClient.invalidateQueries({
            queryKey: ["activeUser"],
          });
        }
      } catch (error) {
        return;
      }
    };
    changeStatus();
  };
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const Users: IUser[] = data?.users?.users ?? [];
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (data?.users?.totalPages) {
      setTotalPages(data.users.totalPages);
    }
  }, [data]);
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);
  return (
    <div>
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl ml-8 font-bold text-white">User Details</h1>
      </div>
      <div className="flex justify-between items-center mb-4 mt-6 ml-8">
        <SearchBar
          placeholder="Search staff by name or email..."
          onSearch={handleSearch}
        />
      </div>
      {Users.length >= 1 ? (
        <div className="bg-[#141518] border border-gray-800/60 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <ReusableTable
            title="Users"
            columns={columns}
            data={Users}
            loading={loading || isLoading || isFetching}
            minWidth="min-w-[100px]"
            imageField={{
              accessor: "imageUrl",
              size: "w-12 h-12",
              rounded: true,
            }}
            toggleField={{
              accessor: "isBlocked",
              invert: true,
              toggleSize: "10",
              onToggle: (row, value) => {
                updateUserStatus(row, value);
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
          <p className="text-gray-400 text-lg mb-3">No staff members found.</p>
          <p className="text-gray-500 mb-8">
            Start by adding your first staff member.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserPage;
