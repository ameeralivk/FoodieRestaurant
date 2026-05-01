import React, { useState } from "react";
import { validateUserRegister } from "../../../Validation/userRegistervalidation";
import ErrorPTag from "../../../Components/Elements/ErrorParagraph";
import { handleUserRegister } from "../../../services/userAuth";
import { AfterLoading } from "../../../Components/Elements/Loading";
import { loadingToast } from "../../../Components/Elements/Loading";
import { toast, ToastContainer } from "react-toastify";
import { createOtpHandlers } from "../../../Components/Helpers/Admin/handleOtpHandlers";
import { useDispatch } from "react-redux";
import OTPVerificationModal from "../../../Components/modals/AdminOtpModal";
import { showErrorToast } from "../../../Components/Elements/ErrorToast";
interface registerFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function UserSignUpPage() {
  const [formData, setFormData] = useState<registerFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const dispatch = useDispatch();
  const { handleUserResendOtp, handleUserVerifyOtp } = createOtpHandlers(
    dispatch,
    formData.email,
  );
  const [error, setError] = useState({
    nameError: "",
    emailError: "",
    passwordError: "",
    confirmPasswordError: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const { errors } = validateUserRegister(
      { ...formData, [name]: value },
      name,
    );

    setError((prev) => ({
      ...prev,
      [`${name}Error`]: errors[name] || "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, errors } = validateUserRegister({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    if (!isValid) {
      setError({
        nameError: errors.name || "",
        emailError: errors.email || "",
        passwordError: errors.password || "",
        confirmPasswordError: errors.confirmPasswordError || "",
      });
      return;
    }
    setError({
      nameError: "",
      emailError: "",
      passwordError: "",
      confirmPasswordError: "",
    });

    const fetch = async () => {
      const toastId = loadingToast();
      try {
        const res = await handleUserRegister(
          formData.name,
          formData.email,
          formData.password,
        );

        if (res.success) {
          toast.dismiss(toastId);
          await AfterLoading("Sending OTP...", "✅ OTP sent successfully!");
          setModalOpen(true);
        } else {
          throw new Error("lfkdjslfjdasjfdsaf");
        }
      } catch (error: unknown) {
        toast.dismiss(toastId);

        const message =
          error instanceof Error ? error.message : "Something went wrong";

        showErrorToast(message);
      }
    };
    fetch();
  };

  console.log(error, "error");

  return (
    <>
      {modalOpen && (
        // <OTPVerificationModal modalOpen={modalOpen} email={formData.email} />
        <OTPVerificationModal
          modalOpen={modalOpen}
          email={formData.email}
          onVerify={handleUserVerifyOtp}
          onResend={handleUserResendOtp}
        />
      )}
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
        <ToastContainer />
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-10">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Create Account
          </h1>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                required
              />
              <ErrorPTag Text={error.nameError} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email or username
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email or username"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                required
              />
              <ErrorPTag Text={error.emailError} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                required
              />
              <ErrorPTag Text={error.passwordError} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Enter Confirm password"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                required
              />
              <ErrorPTag Text={error.confirmPasswordError} />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 rounded-lg transition-colors mt-3"
            >
              Sign Up
            </button>

            <div className="text-center mt-6 text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/user/login"
                className="text-orange-600 font-medium hover:underline"
              >
                Log in
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
