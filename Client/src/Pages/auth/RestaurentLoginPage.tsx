import Admin_Navbar from "../../Components/Layouts/Admin_Navbar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { handleLogin } from "../../services/Auth";
import { ToastContainer } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import WarningSwal from "../../Components/Helpers/WarningSwal";
import ErrorPTag from "../../Components/Elements/ErrorParagraph";
import type { AdminType } from "../../types/AdminTypes";
import { loginAction, setAuth } from "../../redux/slice/adminSlice";
import { useGoogleLoginHandler } from "../../services/Auth";
import { useDispatch } from "react-redux";
import { GoogleLoginButton } from "../../Components/Elements/googleLoginButton";
import AdminRegisterValidation, {
  validateLoginForm,
} from "../../Validation/AdminRegistractiorValidation";
const RestaurentLoginPage = () => {
  interface FormData {
    email: string;
    password: string;
  }
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const [error, setError] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const nav = () => {
    navigate("/Admin/Register");
  };
  // const dispatch = useDispatch();
  // const googleLogin = useGoogleLoginHandler(dispatch);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const validation = AdminRegisterValidation(name as keyof FormData, value);
    setError((prev) => ({ ...prev, [name]: validation || "" }));
  };

  const handleLoginButton = async () => {
    try {
      const valid = validateLoginForm(formData);
      let len = Object.keys(valid.errors).length;
      if (len > 0) {
        for (let key in valid.errors) {
          const field = key as keyof FormData;
          setError((prev) => ({ ...prev, [field]: valid.errors[field] || "" }));
        }
        WarningSwal({ message: "Please File all the Field to Proceed" });
        return;
      }

      const response = await handleLogin(formData.email, formData.password);
      const saveddata: AdminType = {
        _id: response.admin._id,
        restaurantName: response.admin.restaurantName,
        email: response.admin.email,
        role: response.admin.role,
        googleId: response.admin.googleId,
        imageUrl: response.admin.imageUrl,
        status: response.admin.status,
      };

      dispatch(
        loginAction({
          admin: saveddata,
        })
      );
      dispatch(setAuth({ isAuthenticated: true }));
      if (saveddata.role === "superadmin") {
        navigate("/superadmin/dashboard");
      } else {
        navigate("/admin/onboarding");
      }
    } catch (error: unknown) {
      return
      // if (error instanceof Error) {
      //   showErrorToast(String(error));
      // } else {
      //   showErrorToast(String(error));
      // }
    }
  };
  const googleLogin = useGoogleLoginHandler(dispatch);
  return (
    <div className="bg-black min-h-screen">
      <div className=" sticky top-0">
        <Admin_Navbar role={"register"} />
      </div>
      <ToastContainer />
      <div className="relative z-10 flex justify-center items-center h-[calc(100vh-80px)] px-4">
        <div className="bg-slate-900/80 backdrop-blur-md w-full max-w-sm rounded-xl border border-amber-400/40 text-white p-8 shadow-2xl">
          <h1 className="text-3xl font-semibold text-amber-400 mb-6 text-center">
            Restaurant Login
          </h1>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col text-left">
              <label className="mb-1 text-sm font-medium">
                Restaurant Email
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                type="text"
                placeholder="Enter your restaurant name"
                className="border border-amber-400/50 bg-transparent rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-all"
              />
              <ErrorPTag Text={error.email} />
            </div>

            <div className="flex flex-col text-left">
              <label className="mb-1 text-sm font-medium">Password</label>

              {/* Relative wrapper */}
              <div className="relative">
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full border border-amber-400/50 bg-transparent rounded-md px-3 py-2 pr-10 text-sm placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-all"
                />

                {/* Eye icon */}
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-400"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>

              <ErrorPTag Text={error.password} />

              <a
                onClick={() => navigate("/Admin/forgetPassword")}
                className="text-[13px] text-blue-600 text-start cursor-pointer underline hover:text-blue-300"
              >
                Forget Your Password?
              </a>
            </div>

            <button
              onClick={handleLoginButton}
              type="submit"
              className="mt-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold py-2 rounded-md transition-all shadow-md"
            >
              Sign In
            </button>
            <GoogleLoginButton login={googleLogin} />
            <div className="text-sm text-center">
              <a
                onClick={nav}
                className="text-blue-400 hover:underline hover:text-blue-300 transition-colors cursor-pointer"
              >
                Don’t have an account? Sign Up
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurentLoginPage;
