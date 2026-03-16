import React from "react";
import { X } from "lucide-react";
import type { RestaurantApprovalModalProps } from "../../../types/SuperAdmin";
import Swal from "sweetalert2";
import {
  approveRestaurant,
  rejectRestaurant,
} from "../../../services/superAdmin";
import { useState } from "react";
import handleDownload from "../../../utils/superAdmin/download";
import ErrorPTag from "../../Elements/ErrorParagraph";
import { changeRestaurantStatus } from "../../../services/SuperAdmin.restaurent";
const RestaurantApprovalModal: React.FC<RestaurantApprovalModalProps> = ({
  isOpen,
  onClose,
  onApprove,
  data,
  loading = false,
}) => {
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectLoading, setRejectLoading] = useState(false);
  const [error, setError] = useState("");
  if (!isOpen) return null;

  const handleApprove = async () => {
    if (!data?._id) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to approve this restaurant?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      try {
        await approveRestaurant(data._id);
        Swal.fire("Approved!", "Restaurant has been approved.", "success");
        onApprove();
        onClose();
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Failed to approve the restaurant.", "error");
      }
    }
  };

  const handleStatusChange = async () => {
    if (!data?._id) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${
        data.isBlocked ? "UnBlock" : "Block"
      } this restaurant?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${data.isBlocked ? "UnBlock" : "Block"} it!`,
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      try {
        await changeRestaurantStatus(data._id, !data.isBlocked);
        Swal.fire(
          "Approved!",
          `Restaurant has been ${data.isBlocked ? "UnBlock" : "Block"} .`,
          "success"
        );
        onApprove();
        onClose();
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Failed to approve the restaurant.", "error");
      }
    }
  };
  const handleReject = async () => {
    if (!data?._id) return;
    if (rejectReason === "") {
      setError("Enter the Reason To continue");
      return;
    }
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to reject this restaurant?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reject it!",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      try {
        await rejectRestaurant(data._id, rejectReason);
        Swal.fire("rejected!", "Restaurant has been rejected.", "success");
        onApprove();
        onClose();
      } catch (err) {
        setRejectLoading(false)
        console.error(err);
        Swal.fire("Error!", "Failed to approve the restaurant.", "error");
      }
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-neutral-900 rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-neutral-900 border-b border-neutral-800 p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Review Restaurant Details
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Verify the authenticity before approval
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            // Loading indicator
            <div className="flex flex-col items-center justify-center p-10">
              <div className="w-12 h-12 border-4 border-t-amber-500 border-gray-300 rounded-full animate-spin"></div>
              <span className="mt-4 text-gray-400 text-lg">Loading...</span>
            </div>
          ) : !data ? (
            // No data fallback (optional)
            <div className="text-center text-gray-400 py-10">
              No restaurant data available.
            </div>
          ) : (
            <>
              {/* Restaurant Details */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Restaurant Details
                </h2>

                <div className="bg-neutral-800 rounded-lg p-6">
                  <div className="flex gap-6">
                    {/* Left side */}
                    <div className="flex-1 space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-4">
                          Basic Info
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">
                              Restaurant Name
                            </p>
                            <p className="text-sm text-white">
                              {data.restaurantName}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Location</p>
                            <p className="text-sm text-white">
                              {data.location}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Owner</p>
                            <p className="text-sm text-white">{data.owner}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Contact</p>
                            <p className="text-sm text-white">{data.contact}</p>
                          </div>
                        </div>
                      </div>

                      {/* Subscription */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-4">
                          Subscription Plan
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Plan Name</p>
                            <p className="text-sm text-white">
                              {data?.subcription?.planName || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Status</p>
                            <p className="text-sm text-white">{data.status}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">
                              Next Due Date
                            </p>
                            <p className="text-sm text-white">
                              {new Date(
                                data?.subcription?.renewalDate
                              ).toLocaleDateString("en-IN") == "Invalid Date"
                                ? "N/A"
                                : new Date(
                                    data?.subcription?.renewalDate
                                  ).toLocaleDateString("en-IN")}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">
                              Monthly Cost
                            </p>
                            <p className="text-sm text-white">
                              {data?.subcription?.planPrice || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">
                              Opening Time
                            </p>
                            <p className="text-sm text-white">
                              {data.startingTime}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">
                              Closing Time
                            </p>
                            <p className="text-sm text-white">
                              {data.endingTime}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right side - image */}
                    <div className="w-64 h-48 flex-shrink-0">
                      <img
                        src={data.restaurantImage}
                        alt="Restaurant"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-800 p-6 rounded-lg flex flex-col items-center gap-4">
                {data?.verificationDocument?.endsWith(".pdf") ? (
                  // PDF → Only download button
                  <a
                    href={data.verificationDocument}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="px-6 py-2 cursor-pointer bg-yellow-500 rounded-md text-black hover:bg-yellow-600 transition"
                  >
                    Download PDF
                  </a>
                ) : (
                  // Image → Show preview + download
                  <>
                    <img
                      src={data.verificationDocument}
                      alt="Verification Document"
                      className="w-full h-96 object-contain rounded-lg"
                    />
                    <a
                      onClick={() => handleDownload(data.verificationDocument)}
                      download
                      className="px-6 py-2 cursor-pointer bg-yellow-500 rounded-md text-black hover:bg-yellow-600 transition"
                    >
                      Download
                    </a>
                  </>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                {data.status != "approved" && data.status != "rejected" && (
                  <>
                    <button
                      onClick={onClose}
                      className="px-6 py-2 bg-neutral-700 rounded-md text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setShowRejectReason((prev) => !prev)}
                      className="px-6 py-2 bg-red-600 rounded-md text-white hover:bg-red-700 transition"
                    >
                      Reject
                    </button>
                  </>
                )}

                {data.status != "approved" && data.status != "rejected" && (
                  <button
                    onClick={handleApprove}
                    className="px-6 py-2 bg-amber-600 rounded-md text-white cursor-pointer"
                  >
                    Approve
                  </button>
                )}
              </div>
            </>
          )}
          {showRejectReason && data.status != "rejected" && (
            <div className="mt-4 bg-neutral-800 p-4 rounded-lg space-y-2">
              <label className="text-white font-semibold">
                Enter rejection reason:
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                placeholder="Type the reason for rejection"
              />
              <ErrorPTag Text={error} />
              <button
                onClick={handleReject}
                disabled={rejectLoading || !rejectReason.trim()}
                className="px-4 py-2 bg-red-500 rounded-md text-white hover:bg-red-600 transition disabled:opacity-50"
              >
                {rejectLoading ? "Submitting..." : "Submit Rejection"}
              </button>
            </div>
          )}
          {((data?.status != "approved" && data?.status == "rejected") ||
            (data?.status == "resubmitted" && data?.rejectedAt)) && (
            <div className="bg-gray-900 mt-6 text-white p-6 rounded-lg shadow-md border border-gray-700 max-w-5xl mx-auto">
              <h2 className="text-xl font-bold mb-2 flex items-center">
                <svg
                  className="w-6 h-6 text-red-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
                {data?.reason
                  ? "Document Previously Rejected — Reason:"
                  : "Document Rejected"}
              </h2>

              <p className="text-gray-400 mb-1">
                <span className="font-semibold">Rejected At:</span>{" "}
                {new Date(data?.rejectedAt).toLocaleString()}
              </p>

              <p className="text-gray-400">
                <span className="font-semibold">Reason:</span> {data?.reason}
              </p>
            </div>
          )}
          {data?.status !== "pending" &&
            data?.status !== "rejected" &&
            data?.status !== "resubmited" && (
              <div>
                {data?.isBlocked ? (
                  <button
                    onClick={handleStatusChange}
                    className="bg-green-600 ml-18 cursor-pointer w-[800px] h-10 mt-4 rounded-md"
                  >
                    UnBlock
                  </button>
                ) : (
                  <button
                    onClick={handleStatusChange}
                    className="bg-red-600 ml-18 cursor-pointer w-[800px] h-10 mt-4 rounded-md"
                  >
                    Block
                  </button>
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantApprovalModal;
