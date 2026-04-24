import Admin_Navbar from "../../Components/Layouts/Admin_Navbar";
import ErrorPTag from "../../Components/Elements/ErrorParagraph";
import { useState } from "react";
import type { FormData } from "../../types/AdminTypes";
import AdminRegisterValidation from "../../Validation/AdminRegistractiorValidation";
import { validateFullForm } from "../../Validation/AdminRegistractiorValidation";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";
import OTPVerificationModal from "../../Components/modals/AdminOtpModal";
import WarningSwal from "../../Components/Helpers/WarningSwal";
import { register } from "../../services/Auth";
import { loadingToast, AfterLoading } from "../../Components/Elements/Loading";
import { showErrorToast } from "../../Components/Elements/ErrorToast";
import { createOtpHandlers } from "../../Components/Helpers/Admin/handleOtpHandlers";
import { useDispatch } from "react-redux";
const AdminRegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    restaurantName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const { handleAdminVerifyOtp, handleAdminResendOtp } = createOtpHandlers(
    dispatch,
    formData.email
  );
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (modalOpen) {
        e.preventDefault();
        e.returnValue = ""; // Required for most browsers
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [modalOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const validation = AdminRegisterValidation(name as keyof FormData, value);
    setError((prev) => ({ ...prev, [name]: validation || "" }));
  };

  const handleSubmit = async () => {
    let res = validateFullForm(formData);
    let len = Object.keys(res.errors).length;
    if (len > 0) {
      for (let key in res.errors) {
        const field = key as keyof FormData;
        setError((prev) => ({ ...prev, [field]: res.errors[field] || "" }));
      }
      WarningSwal({ message: "Please File all the Field to Proceed" });
      return;
    } else {
      const formPayload = new FormData();
      (Object.keys(formData) as (keyof FormData)[]).forEach((field) => {
        const value = formData[field];
        if (typeof value === "string") {
          formPayload.append(field, value);
        }
      });
      const registerData = {
        restaurantName: formData.restaurantName,
        email: formData.email,
        password: formData.password,
        role: "admin",
      };
      try {
        const toastId = loadingToast();
        setLoading(true);
        let res = await register(registerData);
        if (res.message.success) {
          toast.dismiss(toastId);
          await AfterLoading("Sending OTP...", "✅ OTP sent successfully!");
          setModalOpen(true);
          setLoading(false);
        } else {
          setLoading(false)
          throw new Error("lfkdjslfjdasjfdsaf");
        }
      } catch (error) {
        toast.dismiss();
        if (error instanceof Error) {
          setLoading(false)
          showErrorToast(error.message);
        } 
      }
    }
  };
  return (
    <>
      {modalOpen && (
        // <OTPVerificationModal modalOpen={modalOpen} email={formData.email} />
        <OTPVerificationModal
          modalOpen={modalOpen}
          email={formData.email}
          onVerify={handleAdminVerifyOtp}
          onResend={handleAdminResendOtp}
        />
      )}
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <Admin_Navbar role={"register"} />
        <ToastContainer />
        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start ">
            {/* Form Section */}
            <div>
              <h1 className="text-4xl font-bold mb-8">
                Register Your Restaurant
              </h1>

              <div className="space-y-6">
                {/* Restaurant Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    RestaurantName
                  </label>
                  <input
                    name="restaurantName"
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Enter your restaurant name"
                    className={`w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-gray-500 focus:outline-none ${
                      error.restaurantName
                        ? "focus:border-red-600"
                        : "focus:border-green-500"
                    } transition`}
                  />
                  <ErrorPTag Text={error.restaurantName} />
                </div>

                {/* Admin Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Admin Email
                  </label>
                  <input
                    onChange={handleInputChange}
                    name="email"
                    type="email"
                    placeholder="Enter your Email"
                    className={`w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-gray-500 focus:outline-none ${
                      error.email
                        ? "focus:border-red-600"
                        : "focus:border-green-500"
                    } transition`}
                  />
                  <ErrorPTag Text={error.email} />
                </div>

                {/* Admin Password */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Admin Password
                  </label>
                  <input
                    onChange={handleInputChange}
                    name="password"
                    type="password"
                    placeholder="Enter your admin password"
                    className={`w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-gray-500 focus:outline-none ${
                      error.password
                        ? "focus:border-red-600"
                        : "focus:border-green-500"
                    } transition`}
                  />
                  <ErrorPTag Text={error.password} />
                </div>
                {/* <GoogleLoginButton login={googleLogin} /> */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`px-8 py-3 text-black font-semibold rounded transition 
                  ${
                    loading
                      ? "bg-yellow-300 cursor-not-allowed"
                      : "bg-yellow-500 hover:bg-yellow-400"
                  }
                `}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <span className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></span>
                      Loading...
                    </div>
                  ) : (
                    "Register"
                  )}
                </button>
              </div>
            </div>

            {/* Image Section */}
            <div className="hidden lg:block h-[800px]">
              <div className="rounded-lg overflow-hidden h-full">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=1000&fit=crop"
                  alt="Delicious salad"
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminRegisterPage;
