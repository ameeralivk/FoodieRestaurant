import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showErrorToast } from "../../Elements/ErrorToast";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { checkTable } from "../../../services/user";
import { setTableNo } from "../../../redux/slice/userSlice";
interface TableNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: string | null;
  onConfirm?: (table: string) => void;
}

const TableNumberModal: React.FC<TableNumberModalProps> = ({
  isOpen,
  onClose,
  restaurantId,
  onConfirm,
}) => {
  const [tableNumber, setTableNumber] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  if (!isOpen) return null;

  // const handleContinue = async () => {
  //   const tableExist = await checkTable(restaurantId as string, tableNumber);
  //   if (!tableExist) {
  //     showErrorToast("Table not exist");
  //   }
  //   if (!isRestaurantOpen) {
  //     showErrorToast("Restaurant is not open");
  //     return;
  //   }
  //   if (restaurantName) {
  //     dispatch(setRestaurantName(restaurantName));
  //   }
  //   if (!tableNumber) {
  //     showErrorToast("Please enter TableNo");
  //     return;
  //   }
  //   navigate(`/user/restaurant/${restaurantId}?table=${tableNumber}`);
  //   setTableNumber("");
  //   onClose();
  // };

  const handleContinue = async () => {
    const tableExist = await checkTable(restaurantId as string, tableNumber);
    if (!tableExist) {
      showErrorToast("Table not exist");
    }
    if (!tableNumber) {
      showErrorToast("Please enter TableNo");
      return;
    }

    if (onConfirm) {
      onConfirm(tableNumber);
    } else if (
      !location.pathname.includes(`/user/restaurant/${restaurantId}`)
    ) {
      navigate(`/user/restaurant/${restaurantId}?table=${tableNumber}`);
      dispatch(setTableNo(tableNumber));
    }

    setTableNumber("");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <ToastContainer />
      {/* Faded background */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white/30"></div>

      {/* Modal content */}
      <div className="relative bg-white rounded-xl p-6 w-80 sm:w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Enter Your Table Number</h2>

        <input
          type="number"
          placeholder="Table Number"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setTableNumber("");
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableNumberModal;

// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { showErrorToast } from "../../Elements/ErrorToast";
// import { useDispatch } from "react-redux";
// import { setTableNo } from "../../../redux/slice/userSlice";
// import { checkTable } from "../../../services/user";

// interface TableNumberModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   restaurantId: string | null;
//   onConfirm?: (table: string) => void;
// }

// const TableNumberModal: React.FC<TableNumberModalProps> = ({
//   isOpen,
//   onClose,
//   restaurantId,
//   onConfirm,
// }) => {
//   const [tableNumber, setTableNumber] = useState("");
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();

//   if (!isOpen) return null;

//   const handleContinue = async () => {
//     if (!tableNumber) {
//       showErrorToast("Please enter TableNo");
//       return;
//     }

//     const tableExist = await checkTable(restaurantId as string, tableNumber);
//     if (!tableExist) {
//       showErrorToast("Table not exist");
//     }

//     if (onConfirm) {
//       onConfirm(tableNumber);
//     } else if (
//       !location.pathname.includes(`/user/restaurant/${restaurantId}`)
//     ) {
//       navigate(`/user/restaurant/${restaurantId}?table=${tableNumber}`);
//       dispatch(setTableNo(tableNumber));
//     }

//     setTableNumber("");
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50">
//       {/* Faded background */}
//       <div className="absolute inset-0 backdrop-blur-sm bg-white/30"></div>

//       {/* Modal content */}
//       <div className="relative bg-white rounded-xl p-6 w-80 sm:w-96 shadow-lg">
//         <h2 className="text-xl font-bold mb-4">Enter Your Table Number</h2>

//         <input
//           type="number"
//           placeholder="Table Number"
//           value={tableNumber}
//           onChange={(e) => setTableNumber(e.target.value)}
//           className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
//         />

//         <div className="flex justify-end gap-3">
//           <button
//             onClick={() => {
//               setTableNumber("");
//               onClose();
//             }}
//             className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleContinue}
//             className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition"
//           >
//             Continue
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TableNumberModal;
