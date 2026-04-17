// import { toast } from "react-toastify";
// export const showErrorToast = (message: string = "Something went wrong!") => {
//   toast.error(message, {
//     icon: () => <span className="text-xl">⚠️</span>,
//     position: "top-center",
//     autoClose: 3000,
//     hideProgressBar: true,
//     closeOnClick: true,
//     pauseOnHover: true,
//     draggable: true,
//     className: "bg-white/90 backdrop-blur-md shadow-2xl border border-red-100 rounded-2xl !mb-4 text-sm font-bold text-gray-800",
//     style: {
//       padding: "16px",
//       borderRadius: "16px",
//       boxShadow: "0 10px 40px -10px rgba(239,68,68,0.3)",
//     },
//   });
// };

import { toast } from "react-toastify";

let isErrorToastVisible = false; // ✅ global flag

export const showErrorToast = (
  message: string = "Something went wrong!"
) => {
  if (isErrorToastVisible) return; // 🚫 block multiple toasts

  isErrorToastVisible = true;

  toast.error(message, {
    icon: () => <span className="text-xl">⚠️</span>,
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    className:
      "bg-white/90 backdrop-blur-md shadow-2xl border border-red-100 rounded-2xl !mb-4 text-sm font-bold text-gray-800",
    style: {
      padding: "16px",
      borderRadius: "16px",
      boxShadow: "0 10px 40px -10px rgba(239,68,68,0.3)",
    },
    onClose: () => {
      isErrorToastVisible = false; // ✅ reset after close
    },
  });
};