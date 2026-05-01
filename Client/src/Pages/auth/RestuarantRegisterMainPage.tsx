import { useState } from "react";
import {
  Upload,
  MapPin,
  Clock,
  Phone,
  User,
  FileText,
  Camera,
} from "lucide-react";
import type { RestaurantFormData } from "../../types/AdminTypes";
import StaticMap from "../../Components/Component/RestaurantMainRegistraction/Map";
import { updateDocument } from "../../services/Auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateStatus } from "../../redux/slice/adminSlice";
import type { RootState } from "../../redux/store/store";
import { validateRestaurantForm } from "../../Validation/mainRegisterFormValidation";
import ErrorPTag from "../../Components/Elements/ErrorParagraph";
import { getStatus, registerRestaurant } from "../../services/Auth";
import { ToastContainer } from "react-toastify";
import RegistrationSuccessModal from "../../Components/modals/registractionCompletedModal";
import { useNavigate } from "react-router-dom";
import Admin_Navbar from "../../Components/Layouts/Admin_Navbar";
import RejectionModal from "../../Components/modals/reuploadModal";
import type { AdminStatus } from "../../types/AdminTypes";

const RestaurantMainRegistration = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof RestaurantFormData, string>>
  >({});
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setSuccessModal] = useState(false);
  const [position, setPosition] = useState<[number, number]>([11.051, 76.0711]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const restaurantName =
    useSelector((state: RootState) => state.auth.admin?.restaurantName) || "";
  const email = useSelector(
    (state: RootState) => state.auth.admin?.email || ""
  );
  const navigate = useNavigate();
  const adminId = useSelector((state: RootState) => state.auth.admin?._id);
  const [adminStatus, setAdminStatus] = useState<AdminStatus | null>(null);
  const [formData, setFormData] = useState<RestaurantFormData>({
    email: email,
    restaurantName: restaurantName,
    ownerName: "",
    contactNumber: "",
    address: "",
    openingTime: "",
    closingTime: "",
    proofDocument: null,
    restaurantPhoto: null,
    latitude: "",
    longitude: "",
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          search
        )}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        // Move the map
        setPosition([latitude, longitude]);

        // Also select the location in formData
        setFormData((prev) => ({
          ...prev,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        }));

        // Clear any previous errors related to location
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.latitude;
          delete newErrors.longitude;
          return newErrors;
        });
      } else {
        alert("Location not found!");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  useEffect(() => {
    const fetchStatus = async () => {
      if (!adminId) return;

      try {
        const data = await getStatus(adminId);
        setAdminStatus(data); // ⬅️ Store received API response in state
      } catch (err) {
        console.error(err);
      }
    };

    fetchStatus();
  }, [adminId]);

  useEffect(() => {
    if (
      adminStatus?.status === "pending" ||
      adminStatus?.status === "resubmitted"
    ) {
      setSuccessModal(true);
    } else {
      setSuccessModal(false);
    }
    if (adminStatus?.status === "approved") {
      navigate("/admin/dashboard");
    }
    if (adminStatus?.status === "rejected") {
      setIsModalOpen(true);
    }
  }, [adminStatus, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (value.trim() !== "") {
        delete newErrors[name as keyof RestaurantFormData];
      }
      return newErrors;
    });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "proofDocument" | "restaurantPhoto"
  ) => {
    const file = e.target.files?.[0] ?? null;
    setFormData((prev) => ({ ...prev, [fieldName]: file }));
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (file) delete newErrors[fieldName];
      return newErrors;
    });
  };

  const handleSubmit = async () => {
    try {
      const { isValid, errors } = validateRestaurantForm(formData);

      if (!isValid) {
        setErrors(errors);
        return;
      }

      setLoading(true);

      const res = await registerRestaurant(formData);

      if (res.success) {
        dispatch(updateStatus("pending"));
        window.location.reload();
      } else {
        console.error("Registration failed:", res.message);
      }
    } catch (error) {
      console.error("Error during submission:", error);
    } finally {
      setLoading(false);
    }
  };

  async function handleReupload(file: File) {
    try {
      await updateDocument(adminId as string, file);
      setAdminStatus({
        status: "resubmitted",
        reason: "",
        rejectedAt: "",
      });
      setIsModalOpen(false);
    } catch {
      alert("Reupload failed:");
    }
  }

  return (
    <>
      <Admin_Navbar role={"admin"} />
      <ToastContainer />
      <div className="min-h-screen bg-black p-8">
        {showSuccessModal && <RegistrationSuccessModal />}
        <RejectionModal
          isOpen={isModalOpen}
          // onClose={() => setIsModalOpen(false)}
          rejectionReason={adminStatus?.reason ? adminStatus?.reason : ""}
          documentType="proof"
          onReupload={handleReupload}
        />
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <h1 className="text-5xl font-bold text-yellow-500 text-center mb-12">
            Restaurant Registration
          </h1>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="bg-linear-to-b from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 space-y-6">
              {/* Restaurant Name */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleInputChange}
                  placeholder="Enter restaurant name"
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-400"
                />
                <ErrorPTag Text={errors.restaurantName} />
              </div>

              {/* Owner Name */}
              <div>
                <label className=" text-white font-semibold mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Owner Name
                </label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  placeholder="Enter owner name"
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-400"
                />
                <ErrorPTag Text={errors.ownerName} />
              </div>

              {/* Contact Number */}
              <div>
                <label className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  placeholder="Enter contact number"
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-400"
                />
                <ErrorPTag Text={errors.contactNumber} />
              </div>

              {/* Restaurant Address */}
              <div>
                <label className=" text-white font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Restaurant Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter complete address"
                  rows={4}
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-400 resize-none"
                />
                <ErrorPTag Text={errors.address} />
              </div>
            </div>

            {/* Right Column */}
            <div className=" bg-linear-to-b from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 space-y-6">
              {/* Opening and Closing Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className=" text-white font-semibold mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Opening Time
                  </label>
                  <input
                    type="time"
                    name="openingTime"
                    value={formData.openingTime}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <ErrorPTag Text={errors.openingTime} />
                </div>
                <div>
                  <label className=" text-white font-semibold mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Closing Time
                  </label>
                  <input
                    type="time"
                    name="closingTime"
                    value={formData.closingTime}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <ErrorPTag Text={errors.closingTime} />
                </div>
              </div>

              {/* Restaurant Proof Document */}
              <div>
                <label className=" text-white font-semibold mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Restaurant Proof Document
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, "proofDocument")}
                    className="hidden"
                    id="proofDocument"
                  />
                  <label
                    htmlFor="proofDocument"
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 rounded-lg px-4 py-3 transition duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="truncate">
                      {formData.proofDocument
                        ? formData.proofDocument.name
                        : "Upload Document"}
                    </span>
                  </label>
                  <ErrorPTag Text={errors.proofDocument} />
                </div>
              </div>

              {/* Restaurant Photo */}
              <div>
                <label className=" text-white font-semibold mb-2 flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Restaurant Photo
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "restaurantPhoto")}
                    className="hidden"
                    id="restaurantPhoto"
                  />
                  <label
                    htmlFor="restaurantPhoto"
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 rounded-lg px-4 py-3 transition duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="truncate">
                      {formData.restaurantPhoto
                        ? formData.restaurantPhoto.name
                        : "Upload Photo"}
                    </span>
                  </label>
                  <ErrorPTag Text={errors.restaurantPhoto} />
                </div>
              </div>

              {/* Submit Button */}
              {/* <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg mt-8"
              >
                Register Restaurant
              </button> */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading} // Prevent multiple clicks
                className={`w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg mt-8 flex items-center justify-center`}
              >
                {loading ? (
                  // Spinner
                  <svg
                    className="animate-spin h-5 w-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                ) : (
                  "Register Restaurant"
                )}
              </button>
            </div>
          </div>
          <ErrorPTag Text={errors.latitude || errors.longitude} />
          <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search location..."
              className="w-full border text-white border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button
              type="submit"
              className="bg-yellow-500 text-white px-4 rounded-md hover:bg-yellow-600 transition"
            >
              Search
            </button>
          </form>
          <div>
            <h1 className="text-white text-2xl p-3">Select Your location</h1>
            <StaticMap
              initialLatitude={position[0]}
              initialLongitude={position[1]}
              zoom={13}
              height="h-80"
              onLocationSelect={(lat, lng) => {
                setFormData((prev) => ({
                  ...prev,
                  latitude: lat.toString(),
                  longitude: lng.toString(),
                }));

                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.latitude;
                  delete newErrors.longitude;
                  return newErrors;
                });
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RestaurantMainRegistration;
