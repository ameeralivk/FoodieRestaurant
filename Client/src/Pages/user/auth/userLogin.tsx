import React from "react";
import { useState } from "react";
import { validateLoginForm } from "../../../Validation/AdminRegistractiorValidation";
import AdminRegisterValidation from "../../../Validation/AdminRegistractiorValidation";
import ErrorPTag from "../../../Components/Elements/ErrorParagraph";
import type { FormData } from "../../../types/userTypes";
import WarningSwal from "../../../Components/Helpers/WarningSwal";
import { Eye, EyeOff } from "lucide-react";
import {
  handleUserLogin,
  userGoogleLoginHandler,
} from "../../../services/userAuth";
import { ToastContainer } from "react-toastify";
import { GoogleLoginButton } from "../../../Components/Elements/googleLoginButton";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showErrorToast } from "../../../Components/Elements/ErrorToast";
export default function UserLoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const valid = validateLoginForm(formData);
    const len = Object.keys(valid.errors).length;
    if (len > 0) {
      for (const key in valid.errors) {
        const field = key as keyof FormData;
        setError((prev) => ({ ...prev, [field]: valid.errors[field] || "" }));
      }
      WarningSwal({ message: "Please File all the Field to Proceed" });
      return;
    }
    const fetch = async () => {
      try {
        const res = await handleUserLogin(
          formData.email,
          formData.password,
          dispatch,
        );

        if (res?.success) {
          navigate("/user");
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Something went wrong";

        showErrorToast(message);
      }
    };

    fetch();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const validation = AdminRegisterValidation(name as keyof FormData, value);
    setError((prev) => ({ ...prev, [name]: validation || "" }));
  };
  const dispatch = useDispatch();
  const googleLogin = userGoogleLoginHandler(dispatch);
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <ToastContainer />
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Welcome back
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-sm space-y-6"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email or username
            </label>
            <input
              name="email"
              onChange={handleInputChange}
              id="email"
              type="text"
              placeholder="Enter your email or username"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <ErrorPTag Text={error.email} />
          </div>

          {/* <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              onChange={handleInputChange}
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <ErrorPTag Text={error.password} />
          </div> */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>

            {/* Relative wrapper */}
            <div className="relative">
              <input
                onChange={handleInputChange}
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />

              {/* Eye icon */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <ErrorPTag Text={error.password} />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-md transition-colors"
          >
            Login
          </button>
          <GoogleLoginButton login={googleLogin} />
          <div className="text-center space-y-2">
            <a
              href="/user/register"
              className="text-sm text-gray-600 hover:text-gray-900 block"
            >
              New to Foodie? Sign up
            </a>
            <a
              href="/user/forgetPassword"
              className="text-sm text-gray-600 hover:text-gray-900 block"
            >
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
