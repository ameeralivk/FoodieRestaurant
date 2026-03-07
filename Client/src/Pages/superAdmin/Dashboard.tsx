import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SuperAdminNavbar from "../../Components/Component/SuperAdmin/SuperAdminNavbar";
import SuperAdminSidebar from "../../Components/Component/SuperAdmin/SuperAdminSideBar";
import { useQuery } from "@tanstack/react-query";
import { getAllRestaurent } from "../../services/superAdmin";
import { getUsers } from "../../services/user";
import { getAllPlan } from "../../services/planService";
import {
  Users,
  Store,
  CreditCard,
  TrendingUp,
  CheckCircle,
  ArrowUpRight,
  ShieldCheck,
  Package,
  Layers,
  ArrowRight,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { motion } from "framer-motion";

const DashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // 1. Fetch Approved Restaurants (to get joined count + subscription info)
  const { data: approvedResp, isLoading: loadingApproved } = useQuery({
    queryKey: ["superAdminApprovedRestaurants"],
    queryFn: () => getAllRestaurent(false, 1, 1000, ""),
  });

  // 2. Fetch Pending/Rejected Restaurants (applicants)
  const { data: pendingResp, isLoading: loadingPending } = useQuery({
    queryKey: ["superAdminPendingRestaurants"],
    queryFn: () => getAllRestaurent(true, 1, 1000, ""),
  });

  // 3. Fetch Users (for customer count)
  const { data: usersResp, isLoading: loadingUsers } = useQuery({
    queryKey: ["superAdminUsersCount"],
    queryFn: () => getUsers(1, 1, ""),
  });

  // 4. Fetch All Plans
  const { data: plansResp, isLoading: loadingPlans } = useQuery({
    queryKey: ["superAdminPlans"],
    queryFn: () => getAllPlan(1, 100),
  });

  // Data processing based on existing API structures
  const approvedList = approvedResp?.data || [];
  const applicantsList = pendingResp?.data || [];
  const pendingCount = applicantsList.filter(
    (r: any) => r.status === "pending",
  ).length;
  const usersTotal = usersResp?.total;
  const plans = plansResp?.data?.data || [];

  const stats = useMemo(() => {
    const subscribed = approvedList.filter((r: any) => r.subscription);
    const subscribedCount = subscribed.length;

    // Revenue from subscription prices
    const totalRevenue = subscribed.reduce((acc: number, r: any) => {
      const price = r.subscription.planPrice || r.subscription.price || 0;
      return acc + price;
    }, 0);

    // Distribution for charts
    const planCounts: Record<string, number> = {};
    subscribed.forEach((r: any) => {
      const name = r.subscription.planName || "Unknown Plan";
      planCounts[name] = (planCounts[name] || 0) + 1;
    });

    const planDistributionData = Object.keys(planCounts).map((name) => ({
      name,
      count: planCounts[name],
    }));

    // Registration trend (using creation dates)
    const trendMap: Record<string, number> = {};
    [...approvedList, ...applicantsList].forEach((r: any) => {
      if (r.createdAt) {
        const date = new Date(r.createdAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });
        trendMap[date] = (trendMap[date] || 0) + 1;
      }
    });

    const trendData = Object.keys(trendMap)
      .sort()
      .map((date) => ({
        date,
        count: trendMap[date],
      }))
      .slice(-7);

    return {
      totalJoined: approvedList.length,
      subscribedCount,
      totalRevenue,
      planDistributionData,
      trendData,
    };
  }, [approvedList, applicantsList]);

  const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6"];

  if (loadingApproved || loadingPending || loadingUsers || loadingPlans) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Customers",
      value: usersTotal,
      subValue: "Platform users",
      icon: Users,
      color: "from-blue-600/20 to-blue-500/10",
      borderColor: "border-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      title: "Joined Restaurants",
      value: stats.totalJoined,
      subValue: `${pendingCount} registration requests`,
      icon: Store,
      color: "from-amber-600/20 to-amber-500/10",
      borderColor: "border-amber-500/20",
      iconColor: "text-amber-400",
    },
    {
      title: "Bought Subscriptions",
      value: stats.subscribedCount,
      subValue: "Active paid plans",
      icon: Package,
      color: "from-purple-600/20 to-purple-500/10",
      borderColor: "border-purple-500/20",
      iconColor: "text-purple-400",
    },
    {
      title: "Generated Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      subValue: "Projected monthly",
      icon: CreditCard,
      color: "from-emerald-600/20 to-emerald-500/10",
      borderColor: "border-emerald-500/20",
      iconColor: "text-emerald-400",
    },
  ];

  return (
    <div className="flex h-screen bg-neutral-950 text-white font-sans selection:bg-amber-500/30 overflow-hidden">
      {/* 1. Full-height Sidebar */}
      <SuperAdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <SuperAdminNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 transition-all duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-extrabold bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent tracking-tight"
              >
                Dashboard Overviews
              </motion.h1>
              <p className="text-neutral-500 mt-2 font-medium">
                Real-time platform insights calculated from existing API data.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-neutral-900/50 backdrop-blur-md border border-neutral-800 p-1.5 rounded-2xl">
              <button className="px-5 py-2.5 bg-amber-500 text-black text-sm font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-colors">
                Live Insights
              </button>
              <button className="px-5 py-2.5 text-neutral-400 text-sm font-medium hover:text-white transition-colors">
                History
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`bg-gradient-to-br ${card.color} border ${card.borderColor} rounded-[2rem] p-7 backdrop-blur-3xl relative overflow-hidden group shadow-2xl shadow-black/40`}
              >
                <div className="absolute -right-6 -top-6 bg-white/5 w-32 h-32 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`p-4 rounded-2xl bg-black/40 border border-white/5 ${card.iconColor} shadow-inner`}
                  >
                    <card.icon size={28} />
                  </div>
                </div>
                <h3 className="text-neutral-400 text-sm font-bold uppercase tracking-widest mb-1">
                  {card.title}
                </h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black tracking-tighter text-white">
                    {card.value}
                  </p>
                </div>
                <p className="text-xs text-neutral-500 mt-4 flex items-center gap-1 font-medium italic">
                  <ArrowUpRight size={14} className="text-emerald-500" />
                  {card.subValue}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:col-span-2 bg-neutral-900/40 border border-neutral-800 rounded-[2.5rem] p-8 backdrop-blur-md shadow-xl"
            >
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    Registration Trend
                  </h3>
                  <p className="text-sm text-neutral-500 font-medium">
                    Daily restaurant sign-up growth metrics
                  </p>
                </div>
                <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20">
                  <TrendingUp size={24} />
                </div>
              </div>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={
                      stats.trendData.length > 0
                        ? stats.trendData
                        : [{ date: "No data", count: 0 }]
                    }
                  >
                    <defs>
                      <linearGradient
                        id="colorCount"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#f59e0b"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="#f59e0b"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="5 5"
                      stroke="#1f1f1f"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      stroke="#525252"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={15}
                    />
                    <YAxis
                      stroke="#525252"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#121212",
                        borderColor: "#262626",
                        borderRadius: "16px",
                        padding: "12px",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                      itemStyle={{ color: "#f59e0b", fontWeight: "bold" }}
                      cursor={{
                        stroke: "#f59e0b",
                        strokeWidth: 2,
                        strokeDasharray: "5 5",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#f59e0b"
                      fillOpacity={1}
                      fill="url(#colorCount)"
                      strokeWidth={4}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1 bg-neutral-900/40 border border-neutral-800 rounded-[2.5rem] p-8 backdrop-blur-md flex flex-col shadow-xl"
            >
              <h3 className="text-2xl font-black text-white tracking-tight mb-8">
                Subscriber Breakdown
              </h3>
              <div className="flex-1 space-y-7">
                {stats.planDistributionData.map((item, i) => (
                  <div key={i} className="group cursor-default">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]"
                          style={{
                            backgroundColor: COLORS[i % COLORS.length],
                            color: COLORS[i % COLORS.length],
                          }}
                        ></div>
                        <span className="text-base font-bold text-neutral-200">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-base font-black text-white">
                        {item.count}
                      </span>
                    </div>
                    <div className="h-3 bg-neutral-800/50 rounded-full overflow-hidden border border-white/5 shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${stats.subscribedCount > 0 ? (item.count / stats.subscribedCount) * 100 : 0}%`,
                        }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                    </div>
                  </div>
                ))}
                {stats.planDistributionData.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-neutral-600 py-10">
                    <Layers size={48} className="mb-4 opacity-10" />
                    <p className="text-sm font-medium italic">
                      No active subscriptions detected yet.
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-10 pt-8 border-t border-neutral-800">
                <div className="flex justify-between items-center bg-black/20 p-5 rounded-2xl border border-white/5 shadow-inner">
                  <span className="text-sm text-neutral-400 font-bold uppercase tracking-tight">
                    Total Subscribers
                  </span>
                  <span className="text-3xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                    {stats.subscribedCount}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-neutral-900/30 border border-neutral-800 rounded-[2.5rem] p-9 backdrop-blur-md shadow-xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-amber-500 tracking-tight">
                  Plan Details
                </h3>
                <ShieldCheck className="text-amber-500 opacity-40" size={28} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-neutral-500 text-[10px] uppercase font-black tracking-[0.2em] border-b border-neutral-800/50">
                      <th className="pb-6">Plan Name</th>
                      <th className="pb-6">Price</th>
                      <th className="pb-6">Term</th>
                      <th className="pb-6 text-right">Capacity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/30 leading-relaxed">
                    {plans.map((plan: any, i: number) => (
                      <tr
                        key={i}
                        className="group hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-6 font-bold text-white text-lg">
                          {plan.planName}
                        </td>
                        <td className="py-6 font-black text-emerald-400 text-lg">
                          ₹{plan.price}
                        </td>
                        <td className="py-6 text-neutral-400 font-medium">
                          {plan.duration}
                        </td>
                        <td className="py-6 text-right">
                          <span className="text-[11px] bg-neutral-800/80 px-4 py-1.5 rounded-full text-neutral-200 border border-white/5 font-black uppercase tracking-tighter">
                            {plan.noOfStaff} Units
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-b from-neutral-900/40 to-neutral-950/40 border border-neutral-800 rounded-[2.5rem] p-9 backdrop-blur-md shadow-xl"
            >
              <h3 className="text-2xl font-black text-white tracking-tight mb-8">
                Recent Applicants
              </h3>
              <div className="space-y-4">
                {applicantsList
                  .filter((r: any) => r.status === "pending")
                  .slice(0, 4)
                  .map((item: any, i: number) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.01, x: 5 }}
                      className="flex items-center justify-between p-5 bg-neutral-800/20 rounded-[1.5rem] border border-neutral-700/30 group hover:border-amber-500/40 transition-all shadow-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center text-amber-500 font-black text-xl overflow-hidden border border-white/5 shadow-inner">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            item.restaurantName?.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="text-base font-bold text-white group-hover:text-amber-500 transition-colors">
                            {item.restaurantName}
                          </p>
                          <p className="text-xs text-neutral-500 font-medium truncate max-w-[180px] mt-0.5">
                            {item.placeName || "Location pending"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-xl border border-amber-500/20 uppercase font-black tracking-widest shadow-sm">
                          Review
                        </span>
                        <p className="text-[10px] text-neutral-500 font-bold mt-2 uppercase tracking-tighter">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                {pendingCount === 0 && (
                  <div className="flex flex-col items-center justify-center py-14 text-neutral-600 bg-black/10 rounded-3xl border border-dashed border-neutral-800">
                    <CheckCircle size={48} className="mb-4 opacity-5" />
                    <p className="text-sm font-semibold tracking-wide italic">
                      No pending requests.
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={() => navigate("/superadmin/approval")}
                className="w-full mt-8 py-5 bg-white text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-3 group relative overflow-hidden active:scale-95"
              >
                Go to Applicants
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
