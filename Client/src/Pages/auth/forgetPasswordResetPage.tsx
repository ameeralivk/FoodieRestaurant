import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { handleresetPasswordForm } from "../../services/Auth";
import { ToastContainer } from "react-toastify";
import { showSuccessToast } from "../../Components/Elements/SuccessToast";
export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ confirm?: string }>({});
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    number: false,
  });
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";
  // Check password requirements
  useEffect(() => {
    setRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password) && /[a-z]/.test(password),
      number: /\d/.test(password),
    });
  }, [password]);

  const handleReset = async () => {
    const newErrors: { confirm?: string } = {};
    if (password !== confirmPassword) {
      newErrors.confirm = "Passwords do not match";
    }
    if (
      !requirements.length ||
      !requirements.uppercase ||
      !requirements.number
    ) {
      newErrors.confirm = "Password does not meet all requirements";
    }
    setErrors(newErrors);
    const role = searchParams.get("role") as "admin" | "user";
    if (Object.keys(newErrors).length === 0) {
      const res = await handleresetPasswordForm(
        {
          email,
          newPassword: password,
          token,
        },
        role,
      );
      if (res?.success) {
        if (role == "admin") {
          showSuccessToast(res.message);
          setTimeout(() => {
            navigate("/admin/login");
          }, 2000);
        } else if (role == "user") {
          showSuccessToast(res.message);
          setTimeout(() => {
            navigate("/user/login");
          }, 2000);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <ToastContainer />
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600">Enter your new password below</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
            {errors.confirm && (
              <p className="text-red-500 text-sm mt-1">{errors.confirm}</p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700 font-medium mb-2">
              Password requirements:
            </p>
            <ul className="text-sm space-y-1">
              <li
                className={`flex items-center ${
                  requirements.length ? "text-green-600" : "text-red-500"
                }`}
              >
                • At least 8 characters long
              </li>
              <li
                className={`flex items-center ${
                  requirements.uppercase ? "text-green-600" : "text-red-500"
                }`}
              >
                • Contains uppercase and lowercase letters
              </li>
              <li
                className={`flex items-center ${
                  requirements.number ? "text-green-600" : "text-red-500"
                }`}
              >
                • Includes at least one number
              </li>
            </ul>
          </div>

          <button
            onClick={handleReset}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}
