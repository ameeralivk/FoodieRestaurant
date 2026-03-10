// import React, { useState, useRef, useEffect } from "react";
// import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";
// import type{ ISubscriptionPlan } from "../../../types/PlanTypes";
// import { getAllPlan, makePayment } from "../../../services/planService";
// import LoadingCard from "../../Elements/Reusable/CardLoading";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../redux/store/store";
// const AdminSubscriptionPlans: React.FC = () => {
//   const restuarentId = useSelector(
//     (state: RootState) => state.auth.admin?._id as string
//   );
//   const [plan, setPlans] = useState<ISubscriptionPlan[]>([]);
//   const [fullplan, setFullPlan] = useState<ISubscriptionPlan[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState<{
//     Id: string | null;
//     amount: number | null;
//   }>({ Id: "", amount: null });
//   const [openModal, setOpenModal] = useState(false);
//   const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
//     "monthly"
//   ); // <- new state

//   const scrollRef = useRef<HTMLDivElement | null>(null);

//   const scrollLeft = () => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
//     }
//   };

//   const handlePayment = async (plan: {
//     Id: string | null;
//     amount: number | null;
//     planName: string;
//   }) => {
//     try {
//       const res = await makePayment(
//         plan.amount,
//         restuarentId,
//         plan.Id,
//         plan.planName
//       );
//       window.location.href = res.data.url;
//     } catch (error) {
//       alert(error);
//     }
//     `x`;
//   };

//   const scrollRight = () => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
//     }
//   };

//   const fetchPlans = async () => {
//     try {
//       setLoading(true);
//       const response = await getAllPlan();
//       await new Promise((res) => setTimeout(res, 300));
//       setFullPlan(response.data.data);

//       // Filter initial monthly plans
//       const monthlyPlans = response.data.data.filter((p: ISubscriptionPlan) => {
//         const day = p.duration.split(" ")[0];
//         return Number(day) < 364 && p.duration != "1 Year"; // monthly < 1 year
//       });
//       setPlans(monthlyPlans);
//     } catch (error) {
//       console.error("Error loading plans:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPlans();
//   }, []);

//   const handleBillingCycle = (cycle: "monthly" | "yearly") => {
//     setBillingCycle(cycle);
//     setLoading(true);

//     setTimeout(() => {
//       const filteredPlans = fullplan.filter((p) => {
//         const [value, unit] = p.duration.split(" ");
//         const num = Number(value);

//         if (cycle === "monthly") {
//           return (
//             (unit.toLowerCase().includes("day") && num < 365) ||
//             (unit.toLowerCase().includes("month") && num * 30 < 365)
//           );
//         } else {
//           return (
//             unit.toLowerCase().includes("year") ||
//             (unit.toLowerCase().includes("day") && num >= 365) ||
//             (unit.toLowerCase().includes("month") && num * 30 >= 365)
//           );
//         }
//       });

//       setPlans(filteredPlans);
//       setLoading(false);
//     }, 300);
//   };

//   return (
//     <div className="min-h-screen bg-[#0f0f0f] text-white p-8">
//       <div className="max-w-6xl mx-auto relative">
//         <h1 className="text-3xl font-bold mb-2">Subscription Plans</h1>
//         <p className="text-gray-400 mb-6">
//           Choose the plan that fits your business.
//         </p>

//         {/* Billing cycle buttons */}
//         <div className="flex gap-4 mb-10">
//           <button
//             onClick={() => handleBillingCycle("monthly")}
//             className={`px-6 py-2 rounded-lg border border-gray-700 ${
//               billingCycle === "monthly"
//                 ? "bg-white text-black"
//                 : "bg-gray-900 text-gray-300"
//             }`}
//           >
//             Monthly
//           </button>

//           <button
//             onClick={() => handleBillingCycle("yearly")}
//             className={`px-6 py-2 rounded-lg border border-gray-700 ${
//               billingCycle === "yearly"
//                 ? "bg-white text-black"
//                 : "bg-gray-900 text-gray-300"
//             }`}
//           >
//             Yearly
//           </button>
//         </div>
//         {openModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
//             <div className="relative w-full max-w-md">
//               {/* Close button */}
//               <button
//                 onClick={() => setOpenModal(false)}
//                 className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
//               >
//                 <X className="w-6 h-6" />
//               </button>

//               {/* <Elements stripe={stripePromise}>
//                 <CheckoutForm closeModal={() => setOpenModal(false)} amount={selectedPlan.amount} />
//               </Elements> */}
//             </div>
//           </div>
//         )}
//         {plan.length > 3 && (
//           <>
//             <button
//               onClick={scrollLeft}
//               className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#1a1a1a] p-2 rounded-full border border-gray-700 hover:bg-gray-800 z-10 mt-15"
//             >
//               <ChevronLeft size={45} />
//             </button>

//             <button
//               onClick={scrollRight}
//               className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#1a1a1a] p-2 rounded-full border border-gray-700 hover:bg-gray-800 z-10 mt-15"
//             >
//               <ChevronRight size={45} />
//             </button>
//           </>
//         )}

//         <div ref={scrollRef} className="overflow-x-auto scrollbar-hide">
//           <div className="flex gap-6 min-w-max pb-4">
//             {loading
//               ? [...Array(3)].map((_, i) => <LoadingCard key={i} />)
//               : plan.map((plan) => (
//                   <div
//                     key={plan._id}
//                     className="bg-[#1a1a1a] w-80 p-6 rounded-lg border border-gray-800 flex-shrink-0"
//                   >
//                     <h3 className="text-xl font-semibold mb-2">
//                       {plan.planName}
//                     </h3>

//                     <p className="text-3xl font-bold">
//                       ₹{plan.price}
//                       <span className="text-sm font-normal text-gray-400 ml-1">
//                         {plan.duration}
//                       </span>
//                     </p>

//                     <hr className="my-4 border-gray-800" />

//                     <ul className="space-y-2 mb-6">
//                       <li className="flex items-center gap-2">
//                         <Check className="w-5 h-5 text-green-400" />
//                         <span className="text-gray-300">
//                           No of Dishes: {plan.noOfDishes}
//                         </span>
//                       </li>

//                       {/* ⭐ DEFAULT FEATURE 2 — No of Staff */}
//                       <li className="flex items-center gap-2">
//                         <Check className="w-5 h-5 text-green-400" />
//                         <span className="text-gray-300">
//                           No of Staff: {plan.noOfStaff}
//                         </span>
//                       </li>
//                       {plan.features.map((f, i) => (
//                         <li key={i} className="flex items-center gap-2">
//                           {f.length ? (
//                             <Check className="w-5 h-5 text-green-400" />
//                           ) : (
//                             <X className="w-5 h-5 text-gray-600" />
//                           )}
//                           <span
//                             className={
//                               f.length ? "text-gray-300" : "text-gray-600"
//                             }
//                           >
//                             {f}
//                           </span>
//                         </li>
//                       ))}
//                     </ul>

//                     <button
//                       onClick={() => {
//                         setSelectedPlan({ Id: plan._id, amount: plan.price });
//                         handlePayment({
//                           Id: plan._id,
//                           amount: plan.price,
//                           planName: plan.planName,
//                         });
//                       }}
//                       className={`w-full py-2 rounded-lg border border-gray-700 font-semibold transition ${
//                         selectedPlan.Id === plan._id
//                           ? "bg-white text-black"
//                           : "bg-gray-900 text-gray-300 hover:bg-gray-800"
//                       }`}
//                     >
//                       {selectedPlan.Id === plan._id
//                         ? "Selected"
//                         : "Select Plan"}
//                     </button>
//                   </div>
//                 ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminSubscriptionPlans;

import React, { useState, useRef, useEffect } from "react";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { ISubscriptionPlan, PlanDto } from "../../../types/PlanTypes";
import {
  getAllPlan,
  makePayment,
  getActivePlanByRestaurant,
  upgradeSubscription,
} from "../../../services/planService";
import LoadingCard from "../../Elements/Reusable/CardLoading";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store/store";
import toast from "react-hot-toast";
import { showConfirm } from "../../Elements/ConfirmationSwall";
const AdminSubscriptionPlans: React.FC = () => {
  const restuarentId = useSelector(
    (state: RootState) => state.auth.admin?._id as string,
  );
  const [plan, setPlans] = useState<ISubscriptionPlan[]>([]);
  const [fullplan, setFullPlan] = useState<ISubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    Id: string | null;
    amount: number | null;
  }>({ Id: "", amount: null });
  const [openModal, setOpenModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  ); // <- new state
  const [activePlan, setActivePlan] = useState<PlanDto | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const handlePayment = async (plan: {
    Id: string | null;
    amount: number | null;
    planName: string;
  }) => {
    try {
      setProcessing(true);
      const res = await makePayment(
        plan.amount,
        restuarentId,
        plan.Id,
        plan.planName,
      );
      window.location.href = res.data.url;
    } catch (error: any) {
      toast.error(error.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleUpgrade = async (newPlanId: string) => {
    const confirmed = await showConfirm(
      "Are you sure you want to upgrade? This will charge a prorated amount immediately",
    );

    if (!confirmed) return;

    try {
      setProcessing(true);
      const res = await upgradeSubscription(restuarentId, newPlanId);
      if (res.url) {
        window.location.href = res.url;
      } else if (res.success) {
        toast.success(res.message);
        fetchActivePlan();
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Upgrade failed");
    } finally {
      setProcessing(false);
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await getAllPlan();
      await new Promise((res) => setTimeout(res, 300));
      setFullPlan(response.data.data);

      const monthlyPlans = response.data.data.filter((p: ISubscriptionPlan) => {
        const day = p.duration.split(" ")[0];
        return Number(day) < 364 && p.duration != "1 Year";
      });
      setPlans(monthlyPlans);
    } catch (error) {
      console.error("Error loading plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivePlan = async () => {
    if (!restuarentId) return;
    try {
      const res = await getActivePlanByRestaurant(restuarentId);
      if (
        res.success &&
        res.data?.plan &&
        Object.keys(res.data.plan).length > 0
      ) {
        setActivePlan(res.data.plan);
      } else {
        setActivePlan(null);
      }
    } catch (error) {
      console.error("Error fetching active plan:", error);
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchActivePlan();
  }, [restuarentId]);

  const handleBillingCycle = (cycle: "monthly" | "yearly") => {
    setBillingCycle(cycle);
    setLoading(true);

    setTimeout(() => {
      const filteredPlans = fullplan.filter((p) => {
        const [value, unit] = p.duration.split(" ");
        const num = Number(value);

        if (cycle === "monthly") {
          return (
            (unit.toLowerCase().includes("day") && num < 365) ||
            (unit.toLowerCase().includes("month") && num * 30 < 365)
          );
        } else {
          return (
            unit.toLowerCase().includes("year") ||
            (unit.toLowerCase().includes("day") && num >= 365) ||
            (unit.toLowerCase().includes("month") && num * 30 >= 365)
          );
        }
      });

      setPlans(filteredPlans);
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-8">
      <div className="max-w-6xl mx-auto relative">
        <h1 className="text-3xl font-bold mb-2">Subscription Plans</h1>
        <p className="text-gray-400 mb-6">
          Choose the plan that fits your business.
        </p>

        {/* Billing cycle buttons */}
        <div className="flex gap-4 mb-10">
          <button
            onClick={() => handleBillingCycle("monthly")}
            className={`px-6 py-2 rounded-lg border border-gray-700 ${
              billingCycle === "monthly"
                ? "bg-white text-black"
                : "bg-gray-900 text-gray-300"
            }`}
          >
            Monthly
          </button>

          <button
            onClick={() => handleBillingCycle("yearly")}
            className={`px-6 py-2 rounded-lg border border-gray-700 ${
              billingCycle === "yearly"
                ? "bg-white text-black"
                : "bg-gray-900 text-gray-300"
            }`}
          >
            Yearly
          </button>
        </div>
        {openModal && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-md">
              {/* Close button */}
              <button
                onClick={() => setOpenModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>

              {/* <Elements stripe={stripePromise}>
                <CheckoutForm closeModal={() => setOpenModal(false)} amount={selectedPlan.amount} />
              </Elements> */}
            </div>
          </div>
        )}
        {plan.length > 3 && (
          <>
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#1a1a1a] p-2 rounded-full border border-gray-700 hover:bg-gray-800 z-10 mt-15"
            >
              <ChevronLeft size={45} />
            </button>

            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#1a1a1a] p-2 rounded-full border border-gray-700 hover:bg-gray-800 z-10 mt-15"
            >
              <ChevronRight size={45} />
            </button>
          </>
        )}

        <div ref={scrollRef} className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-6 min-w-max pb-4">
            {loading
              ? [...Array(3)].map((_, i) => <LoadingCard key={i} />)
              : plan.map((plan) => (
                  <div
                    key={plan._id}
                    className={`bg-[#1a1a1a] w-80 p-6 rounded-lg border flex-shrink-0 relative transition-all duration-300 ${
                      activePlan?.planName === plan.planName
                        ? "border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/50"
                        : "border-gray-800"
                    }`}
                  >
                    {activePlan?.planName === plan.planName && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                        Current Plan
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{plan.planName}</h3>
                      {activePlan?.planName === plan.planName && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                            activePlan.status === "active"
                              ? "bg-green-500/20 text-green-500"
                              : "bg-red-500/20 text-red-500"
                          }`}
                        >
                          {activePlan.status}
                        </span>
                      )}
                    </div>

                    <p className="text-3xl font-bold">
                      ₹{plan.price}
                      <span className="text-sm font-normal text-gray-400 ml-1">
                        {plan.duration}
                      </span>
                    </p>

                    {activePlan?.planName === plan.planName && (
                      <p className="text-[10px] text-gray-500 mt-1">
                        Expires:{" "}
                        {new Date(activePlan.renewalDate).toLocaleDateString()}
                      </p>
                    )}

                    <hr className="my-4 border-gray-800" />

                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-400" />
                        <span className="text-gray-300">
                          No of Dishes: {plan.noOfDishes}
                        </span>
                      </li>

                      {/* ⭐ DEFAULT FEATURE 2 — No of Staff */}
                      <li className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-400" />
                        <span className="text-gray-300">
                          No of Staff: {plan.noOfStaff}
                        </span>
                      </li>
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          {f.length ? (
                            <Check className="w-5 h-5 text-green-400" />
                          ) : (
                            <X className="w-5 h-5 text-gray-600" />
                          )}
                          <span
                            className={
                              f.length ? "text-gray-300" : "text-gray-600"
                            }
                          >
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => {
                        if (activePlan?.planName === plan.planName) return;

                        if (activePlan) {
                          if (plan.price > activePlan.planPrice) {
                            setSelectedPlan({
                              Id: plan._id,
                              amount: plan.price,
                            });
                            handleUpgrade(plan._id);
                          } else {
                            toast.error(
                              "Downgrading is not supported at this time.",
                            );
                          }
                          return;
                        }

                        setSelectedPlan({ Id: plan._id, amount: plan.price });
                        handlePayment({
                          Id: plan._id,
                          amount: plan.price,
                          planName: plan.planName,
                        });
                      }}
                      disabled={
                        activePlan?.planName === plan.planName ||
                        processing ||
                        (activePlan && plan.price <= activePlan.planPrice)
                          ? true
                          : false
                      }
                      className={`w-full py-2 rounded-lg border border-gray-700 font-semibold transition ${
                        activePlan?.planName === plan.planName
                          ? "bg-orange-500/20 text-orange-500 border-orange-500/50 cursor-default"
                          : activePlan && plan.price <= activePlan.planPrice
                            ? "bg-gray-800 text-gray-500 cursor-not-allowed border-gray-800"
                            : selectedPlan.Id === plan._id
                              ? "bg-white text-black"
                              : "bg-gray-900 text-gray-300 hover:bg-gray-800"
                      } ${processing ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {processing && selectedPlan.Id === plan._id
                        ? "Processing..."
                        : activePlan?.planName === plan.planName
                          ? "Current Active Plan"
                          : activePlan
                            ? plan.price > activePlan.planPrice
                              ? "Upgrade Plan"
                              : "Unavailable"
                            : selectedPlan.Id === plan._id
                              ? "Selected"
                              : "Select Plan"}
                    </button>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSubscriptionPlans;
