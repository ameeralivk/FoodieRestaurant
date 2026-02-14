
// // export default PageWrapper;

// // PageWrapper.tsx
// import type { ReactNode } from "react";
// import { motion } from "framer-motion";

// interface PageWrapperProps {
//   children: ReactNode;
// }

// const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
//   return (
//     <motion.div
//       key={Math.random()} // forces remount on fast route changes
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -30 }}
//       transition={{
//         duration: 0.6, // slightly slower
//         ease: "easeOut",
//         delay: 0.1, // small wait before animation starts
//       }}
//     >
//       {children}
//     </motion.div>
//   );
// };

// export default PageWrapper;

// PageWrapper.tsx
// import type { ReactNode } from "react";
// import { motion } from "framer-motion";
// import { Toaster } from "react-hot-toast";
// import { useEffect } from "react";
// import Socket from "../../../socket";
// import toast from "react-hot-toast";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../redux/store/store";
// interface PageWrapperProps {
//   children: ReactNode;
// }

// const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
//   const role = useSelector((state: RootState) => state.userAuth.user?.role);
//   const restaurantId = useSelector(
//     (state: RootState) => state.userAuth.user?.restaurantId,
//   );
//   useEffect(() => {
//     Socket.connect();
//     console.log(role);
//     if (restaurantId && role) {
//       Socket.emit("join-restaurant", {
//         restaurantId,
//         role,
//       });
//     }

//     const handleItemUpdated = (data: any) => {
//       console.log("🔥 item updated", data);
//       toast.success("Item status updated");
//     };

//     const handleOrderCompleted = (data: any) => {
//       console.log("🔥 order completed", data);
//       toast.success("Your order is completed 🎉");
//     };

//     Socket.on("order:itemUpdated", handleItemUpdated);
//     Socket.on("order:completed", handleOrderCompleted);

//     return () => {
//       Socket.off("order:itemUpdated", handleItemUpdated);
//       Socket.off("order:completed", handleOrderCompleted);
//     };
//   }, []);
//   return (
//     <>
//       <Toaster position="top-right" />
//       <motion.div
//         key={Math.random()} // forces remount on fast route changes
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -20 }}
//         transition={{ duration: 0.4, ease: "easeOut" }}
//       >
//         {children}
//       </motion.div>
//     </>
//   );
// };

// const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
//   const role = useSelector((state: RootState) => state.userAuth.user?.role);
//   const restaurantId = useSelector(
//     (state: RootState) => state.userAuth.user?.restaurantId,
//   );

//   useEffect(() => {
//     if (!restaurantId || !role) return;

//     Socket.connect();

//     Socket.emit("join-restaurant", {
//       restaurantId,
//       role,
//     });

//     const handleItemUpdated = (data: any) => {
//       toast.success("Item status updated");
//     };

//     const handleOrderCompleted = (data: any) => {
//       toast.success("Your order is completed 🎉");
//     };

//     Socket.off("order:itemUpdated");
//     Socket.off("order:completed");

//     Socket.on("order:itemUpdated", handleItemUpdated);
//     Socket.on("order:completed", handleOrderCompleted);

//     return () => {
//       Socket.off("order:itemUpdated", handleItemUpdated);
//       Socket.off("order:completed", handleOrderCompleted);
//     };
//   }, [restaurantId, role]);

//   return (
//     <>
//       <Toaster position="top-right" />
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -20 }}
//         transition={{ duration: 0.4, ease: "easeOut" }}
//       >
//         {children}
//       </motion.div>
//     </>
//   );
// };


import type{ ReactNode } from "react";
import { motion } from "framer-motion";

interface PageWrapperProps {
  children: ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};



export default PageWrapper;
