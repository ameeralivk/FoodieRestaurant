import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { useEffect } from "react";
import WarningSwal from "../../../Components/Helpers/WarningSwal";
import { handleUserForgetPasswordSubmit } from "../../../services/userAuth";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted] = useState(false);
  const [hidden, setIsHidden] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      WarningSwal({ message: "Please Fill the Email and Continue" });
      return;
    } else if (email && !emailRegex.test(email)) {
      WarningSwal({ message: "Please Enter Correct Email Formate" });
      return;
    } else {
      setIsHidden(true);
      let res = await handleUserForgetPasswordSubmit({ email });
      if (!res) {
        setIsHidden(false);
        return;
      }
      const hiddenUntil = Date.now() + 2 * 60 * 1000;
      localStorage.setItem("hiddenUntil", hiddenUntil.toString());
      setTimeout(() => {
        setIsHidden(false);
        localStorage.removeItem("hiddenUntil");
      }, 2 * 60 * 1000);
    }
  };

  const handleBackToLogin = () => {
    navigate("/user/login");
  };
  useEffect(() => {
    const hiddenUntil = localStorage.getItem("hiddenUntil");
    if (hiddenUntil && Date.now() < Number(hiddenUntil)) {
      setIsHidden(true);
      const remaining = Number(hiddenUntil) - Date.now();
      setTimeout(() => setIsHidden(false), remaining);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-amber-950 h-3.5 w-full"></div>
      <ToastContainer />
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-lg shadow-lg p-12 w-full max-w-md">
          {!isSubmitted ? (
            <>
              <h1 className="text-4xl font-bold text-gray-900 text-center mb-3">
                Forgot Password?
              </h1>
              <p className="text-gray-600 text-center mb-8">
                No worries! Enter your email and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700"
                  />
                </div>
                {!hidden ? (
                  <button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 mb-6"
                  >
                    Send Reset Link
                  </button>
                ) : (
                  <p className="text-amber-50">
                    Button will reappear after 2 minutes...
                  </p>
                )}
              </form>

              <button
                onClick={handleBackToLogin}
                className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition duration-200"
              >
                <ArrowLeft size={20} />
                Back to Login
              </button>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-green-600" size={32} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Check your email
              </h1>
              <p className="text-gray-600 mb-8">
                We've sent a password reset link to
                <br />
                <span className="font-semibold text-gray-900">{email}</span>
              </p>
              <button
                onClick={handleBackToLogin}
                className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition duration-200"
              >
                <ArrowLeft size={20} />
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
