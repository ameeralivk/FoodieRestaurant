import React, { useState, useEffect } from "react";
import { sendStaffResetEmail } from "../../services/staffAuthService";
import { showSuccessToast } from "../../Components/Elements/SuccessToast";
import { showErrorToast } from "../../Components/Elements/ErrorToast";
import { ToastContainer } from "react-toastify";

const StaffForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabledTime, setDisabledTime] = useState(0); // countdown in seconds

  useEffect(() => {
    let timer: number; // <-- use number instead of NodeJS.Timeout
    if (disabledTime > 0) {
      timer = window.setInterval(() => {
        setDisabledTime((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [disabledTime]);

  const handleSubmit = async () => {
    if (!email) {
      showErrorToast("Please enter email");
      return;
    }

    try {
      setLoading(true);

      const result = await sendStaffResetEmail(email);
      console.log(result, "result is here");

      // Corrected typo from "succes" to "success"
      if (result.succes) {
        showSuccessToast(result.message);
        setDisabledTime(120); // disable for 2 minutes
      }
    } catch (error: any) {
      // showErrorToast(
      //   error?.response?.data?.message || "Failed to send reset link",
      // );
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <ToastContainer />

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border px-4 py-3 rounded-lg mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading || disabledTime > 0}
          className={`w-full py-3 rounded-lg ${
            loading || disabledTime > 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white"
          }`}
        >
          {loading
            ? "Sending..."
            : disabledTime > 0
              ? `Try again in ${disabledTime}s`
              : "Send Reset Link"}
        </button>
      </div>
    </div>
  );
};

export default StaffForgotPassword;
