import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

interface Props {
  email: string;
  onSubmit: (otp: string) => void;
  onResend: () => void;
  loading?: boolean;
}

const RESEND_TIME = 120; // 2 minutes

const OtpVerificationPage: React.FC<Props> = ({
  email,
  onSubmit,
  onResend,
  loading = false,
}) => {
  const [otp, setOtp] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(RESEND_TIME);

  // ⏱ Start timer when modal opens
  useEffect(() => {
    setCanResend(false);
    setTimer(RESEND_TIME);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    if (otp.length === 6) {
      onSubmit(otp);
    }
  };

  const handleResend = () => {
    onResend();
    setCanResend(false);
    setTimer(RESEND_TIME);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl p-6">
        {/* Close */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={() => onSubmit("")}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-center mb-2">
          OTP Verification
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Enter the OTP sent to <span className="font-medium">{email}</span>
        </p>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border rounded px-4 py-2 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="------"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-4 bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* ⏳ Timer / Resend */}
        {!canResend ? (
          <p className="text-center text-sm text-gray-500 mt-4">
            Resend OTP in <span className="font-medium">{formatTime(timer)}</span>
          </p>
        ) : (
          <button
            onClick={handleResend}
            className="w-full mt-4 text-sm text-pink-600 hover:underline"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default OtpVerificationPage;
