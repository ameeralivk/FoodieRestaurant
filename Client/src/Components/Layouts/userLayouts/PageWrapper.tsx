// // // PageWrapper.tsx
// // import type{ ReactNode } from "react";
// // import { motion } from "framer-motion";

// // interface PageWrapperProps {
// //   children: ReactNode;
// // }

// // const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
// //   return (
// //     <motion.div
// //       initial={{ opacity: 0, y: 20 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       exit={{ opacity: 0, y: -20 }}
// //       transition={{ duration: 0.5, ease: "easeOut" }}
// //     >
// //       {children}
// //     </motion.div>
// //   );
// // };

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
import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageWrapperProps {
  children: ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <motion.div
      key={Math.random()} // forces remount on fast route changes
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
