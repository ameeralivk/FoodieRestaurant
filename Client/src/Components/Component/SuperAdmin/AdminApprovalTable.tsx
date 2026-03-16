import React, { useState, useEffect } from "react";
import RestaurantRow from "../../Elements/SuperAdmin/AdminTableRow";
import TableHeader from "../../Elements/SuperAdmin/TableHeader";
import type { Restaurant, TableColumn } from "../../../types/SuperAdmin";
import RestaurantApprovalModal from "../../modals/SuperAdmin/RestaurentApprovalModal";
import { getAllRestaurent } from "../../../services/superAdmin";
import LoadingRow from "../../Elements/SuperAdmin/LoadingRow";

const Table: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">{children}</table>
    </div>
  );
};
interface TableExampleProps {
  approval?: boolean;
}
const TableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <tbody>{children}</tbody>;
};

export default function TableExample({ approval }: TableExampleProps) {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / limit);
  const [searchTerm, setSearchTerm] = useState("");
  const columns: TableColumn[] = [
    { header: "Restaurant Name" },
    { header: "Owner" },
    { header: "Location" },
    { header: "Subscription Plan" },
    { header: "Blocked" },
    { header: "Status" },
    { header: "Action" },
  ];

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await getAllRestaurent(
        approval ? approval : false,
        page,
        limit,
        searchTerm,
      );
      if (response && response.success) {
        await new Promise((res) => setTimeout(res, 500));
          let filterData = response.data.filter(
            (res:Restaurant) => res.location.coordinates.length > 0,
          );
        setRestaurants(filterData);
        setTotal(response.pagination.total);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getAllRestaurent(
          approval ? approval : false,
          page,
          limit,
          searchTerm,
        );
        if (response && response.success) {
          await new Promise((res) => setTimeout(res, 300));
          console.log(response.data)
          let filterData = response.data.filter(
            (res:Restaurant) => res.location.coordinates.length > 0,
          );
          setRestaurants(filterData);
          setTotal(response.pagination.total);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, searchTerm]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-stone-900 to-neutral-950 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-amber-100 mb-6">
          Restaurant Management
        </h1>

        {/* Modal */}
        <RestaurantApprovalModal
          isOpen={modalOpen}
          onClose={async () => {
            setLoading(true);
            setModalLoading(false);
            setModalOpen(false);
            setTimeout(async () => {
              await fetchRestaurants();
              setLoading(false);
            }, 0);
          }}
          onApprove={() => console.log("Approved!")}
          data={selectedRestaurant}
          loading={modalLoading}
        />

        {/* Table */}
        <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-amber-900/30 p-6">
          <div className="mb-4 flex items-center gap-4">
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1); // reset to first page when searching
              }}
              className="px-4 py-2 rounded border border-amber-700 bg-black/20 text-amber-100 w-full"
            />
          </div>

          <Table>
            <TableHeader columns={columns} />
            <TableBody>
              {loading ? (
                <LoadingRow colSpan={columns.length} />
              ) : restaurants.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center p-4 text-amber-200"
                  >
                    No restaurants found
                  </td>
                </tr>
              ) : (
                restaurants.map((rest) => (
                  <RestaurantRow
                    key={rest._id}
                    name={rest.restaurantName}
                    owner={rest.ownerName}
                    location={rest.placeName}
                    plan={rest.planName || "Free"}
                    status={rest.status}
                    isBlocked={rest.isBlocked}
                    onView={() => {
                      setModalOpen(true);
                      setModalLoading(true);

                      // simulate delay for loading indicator
                      setTimeout(() => {
                        setSelectedRestaurant({
                          _id: rest._id,
                          restaurantName: rest.restaurantName,
                          owner: rest.ownerName,
                          location: rest.placeName,
                          contact: rest.contactNumber,
                          planName: rest.planName || "Free",
                          status: rest.status,
                          startingTime: rest.openingTime,
                          isBlocked: rest.isBlocked,
                          endingTime: rest.closingTime,
                          nextDueDate: rest.nextDueDate || "N/A",
                          amount: rest.amount || "N/A",
                          subcription: rest.subscription,
                          restaurantImage: rest.restaurantPhoto
                            ? rest.restaurantPhoto
                            : undefined,
                          verificationDocument: rest.proofDocument
                            ? rest.proofDocument
                            : undefined,
                          reason: rest.reason,
                          rejectedAt: rest.rejectedAt,
                        });
                        setModalLoading(false);
                      }, 500); // 0.5s delay to show spinner
                    }}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-center items-center gap-6 mt-6 text-amber-100">
          <button
            className="px-4 py-2 bg-amber-700 rounded disabled:opacity-40"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>

          <span>
            Page {page} / {totalPages || 1}
          </span>

          <button
            className="px-4 py-2 bg-amber-700 rounded disabled:opacity-40"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
