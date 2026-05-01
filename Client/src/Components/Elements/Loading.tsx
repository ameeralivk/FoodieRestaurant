  
  
import {  toast } from "react-toastify";
export const loadingToast =() =>{
 return toast.loading("Processing... Please wait");
} 


export const AfterLoading = async (
  message: string = "Processing... Please wait",
  successMessage: string = "✅ Successfully completed!"
) => {
  const loadingId = toast.loading(message, {
    position: "top-center",
    theme: "colored",
    style: {
      backgroundColor: "#111827",
      color: "#facc15",
      fontWeight: "bold",
    },
  });

  try {
    // Simulate short wait if needed (optional)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.update(loadingId, {
      render: successMessage,
      type: "success",
      isLoading: false,
      position: "top-center",
      theme: "colored",
      style: {
        backgroundColor: "#111827",
        color: "#facc15",
        fontWeight: "bold",
      },
      autoClose: 2000,
      closeOnClick: true,
    });

    return true;
  } catch{
    toast.update(loadingId, {
      render: "❌ Something went wrong!",
      type: "error",
      isLoading: false,
      autoClose: 2000,
    });
    return false;
  }
};