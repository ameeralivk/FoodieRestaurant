
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
  AlertTriangle,
  Zap,
  BarChart2,
  Clock,
  DollarSign,
  Activity,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { motion } from "framer-motion";

const COLORS = [
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

const DashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const { data: approvedResp, isLoading: loadingApproved } = useQuery({
    queryKey: ["superAdminApprovedRestaurants"],
    queryFn: () => getAllRestaurent(false, 1, 1000, ""),
  });

  const { data: pendingResp, isLoading: loadingPending } = useQuery({
    queryKey: ["superAdminPendingRestaurants"],
    queryFn: () => getAllRestaurent(true, 1, 1000, ""),
  });

  const { data: usersResp, isLoading: loadingUsers } = useQuery({
    queryKey: ["superAdminUsersCount"],
    queryFn: () => getUsers(1, 1, ""),
  });

  const { data: plansResp, isLoading: loadingPlans } = useQuery({
    queryKey: ["superAdminPlans"],
    queryFn: () => getAllPlan(1, 100),
  });

  const approvedList = approvedResp?.data || [];
  const applicantsList = pendingResp?.data || [];
  const pendingCount = applicantsList.filter(
    (r: any) => r.status === "pending",
  ).length;
  const usersTotal = usersResp?.users?.total || 0;
  const plans = plansResp?.data?.data || [];

  const stats = useMemo(() => {
    const subscribed = approvedList.filter((r: any) => r.subscription);
    const subscribedCount = subscribed.length;
    const subscriptionRate =
      approvedList.length > 0
        ? Math.round((subscribedCount / approvedList.length) * 100)
        : 0;

    // Revenue totals
    const totalRevenue = subscribed.reduce((acc: number, r: any) => {
      const price = r.subscription.planPrice || r.subscription.price || 0;
      return acc + price;
    }, 0);

    // Plan distribution for bar chart
    const planCounts: Record<string, { count: number; revenue: number }> = {};
    subscribed.forEach((r: any) => {
      const name = r.subscription.planName || "Unknown";
      const price = r.subscription.planPrice || 0;
      if (!planCounts[name]) planCounts[name] = { count: 0, revenue: 0 };
      planCounts[name].count += 1;
      planCounts[name].revenue += price;
    });

    const planDistributionData = Object.keys(planCounts).map((name) => ({
      name,
      count: planCounts[name].count,
      revenue: planCounts[name].revenue,
    }));

    // Avg revenue per plan
    const avgRevenuePerSub =
      subscribedCount > 0 ? Math.round(totalRevenue / subscribedCount) : 0;

    // Expiring soon (within 30 days)
    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const expiringSoon = subscribed.filter((r: any) => {
      const renewal = r.subscription.renewalDate
        ? new Date(r.subscription.renewalDate)
        : null;
      return renewal && renewal > now && renewal <= in30Days;
    });

    // Plan-wise subscriber pie data
    const pieData = planDistributionData.map((p) => ({
      name: p.name,
      value: p.count,
    }));

    // Registration trend
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
      .map((date) => ({ date, count: trendMap[date] }))
      .slice(-7);

    // Revenue trend by subscription start date
    const revTrendMap: Record<string, number> = {};
    subscribed.forEach((r: any) => {
      const sd = r.subscription.startDate
        ? new Date(r.subscription.startDate).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })
        : null;
      if (sd)
        revTrendMap[sd] =
          (revTrendMap[sd] || 0) + (r.subscription.planPrice || 0);
    });
    const revTrendData = Object.keys(revTrendMap)
      .sort()
      .map((date) => ({ date, revenue: revTrendMap[date] }))
      .slice(-7);

    // Restaurants without subscription
    const unsubscribedCount = approvedList.length - subscribedCount;

    // Expiring soon list (top 4)
    const expiringSoonList = expiringSoon.slice(0, 4).map((r: any) => ({
      name: r.restaurantName,
      plan: r.subscription.planName,
      renewalDate: r.subscription.renewalDate,
      image: r.imageUrl,
    }));

    return {
      totalJoined: approvedList.length,
      subscribedCount,
      totalRevenue,
      subscriptionRate,
      avgRevenuePerSub,
      planDistributionData,
      pie: pieData,
      trendData,
      revTrendData,
      expiringSoon: expiringSoonList,
      expiringSoonCount: expiringSoon.length,
      unsubscribedCount,
    };
  }, [approvedList, applicantsList]);

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
      title: "Active Subscriptions",
      value: stats.subscribedCount,
      subValue: `${stats.subscriptionRate}% subscription rate`,
      icon: Package,
      color: "from-purple-600/20 to-purple-500/10",
      borderColor: "border-purple-500/20",
      iconColor: "text-purple-400",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      subValue: `Avg ₹${stats.avgRevenuePerSub.toLocaleString()} / subscriber`,
      icon: CreditCard,
      color: "from-emerald-600/20 to-emerald-500/10",
      borderColor: "border-emerald-500/20",
      iconColor: "text-emerald-400",
    },
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-3 shadow-2xl text-sm">
          <p className="text-neutral-400 font-semibold mb-1">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} style={{ color: p.color }} className="font-black">
              {p.name === "revenue" ? `₹${p.value.toLocaleString()}` : p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-neutral-950 text-white font-sans selection:bg-amber-500/30 overflow-hidden">
      <SuperAdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <SuperAdminNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 transition-all duration-300">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-extrabold bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent tracking-tight"
              >
                Dashboard Overview
              </motion.h1>
              <p className="text-neutral-500 mt-2 font-medium">
                Real-time platform insights · Subscription analytics
              </p>
            </div>
          </div>

          {/* Stat Cards */}
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

          {/* ── SUBSCRIPTION ANALYTICS HEADER ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <Activity size={20} className="text-amber-400" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Subscription Analytics
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-amber-500/30 to-transparent ml-2" />
          </motion.div>

          {/* ── SUBSCRIPTION MINI-STATS ROW ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
            {[
              {
                label: "Subscription Rate",
                value: `${stats.subscriptionRate}%`,
                sub: `${stats.subscribedCount} of ${stats.totalJoined}`,
                icon: PieChartIcon,
                color: "text-violet-400",
                bg: "bg-violet-500/10 border-violet-500/20",
              },
              {
                label: "Avg Revenue / Sub",
                value: `₹${stats.avgRevenuePerSub.toLocaleString()}`,
                sub: "per subscriber",
                icon: DollarSign,
                color: "text-emerald-400",
                bg: "bg-emerald-500/10 border-emerald-500/20",
              },
              {
                label: "Expiring in 30 Days",
                value: stats.expiringSoonCount,
                sub: "need attention",
                icon: Clock,
                color: "text-rose-400",
                bg: "bg-rose-500/10 border-rose-500/20",
              },
              {
                label: "Unsubscribed",
                value: stats.unsubscribedCount,
                sub: "not yet subscribed",
                icon: AlertTriangle,
                color: "text-amber-400",
                bg: "bg-amber-500/10 border-amber-500/20",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4 }}
                className={`${item.bg} border rounded-3xl p-5 backdrop-blur-md flex flex-col gap-3`}
              >
                <div
                  className={`p-2.5 rounded-xl bg-black/30 w-fit ${item.color}`}
                >
                  <item.icon size={20} />
                </div>
                <p className="text-2xl font-black text-white">{item.value}</p>
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="text-xs text-neutral-600 font-medium mt-0.5">
                    {item.sub}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── CHARTS ROW 1 ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Registration Trend */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:col-span-2 bg-neutral-900/40 border border-neutral-800 rounded-[2.5rem] p-8 backdrop-blur-md shadow-xl"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    Registration Trend
                  </h3>
                  <p className="text-sm text-neutral-500 font-medium">
                    Daily restaurant sign-up growth
                  </p>
                </div>
                <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20">
                  <TrendingUp size={24} />
                </div>
              </div>
              <div className="h-[280px] w-full">
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
                      tickMargin={12}
                    />
                    <YAxis
                      stroke="#525252"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
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
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Subscriber Breakdown (Pie) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-neutral-900/40 border border-neutral-800 rounded-[2.5rem] p-8 backdrop-blur-md shadow-xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-white tracking-tight">
                  Plan Distribution
                </h3>
                <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
                  <PieChartIcon size={18} className="text-purple-400" />
                </div>
              </div>
              {stats.pie.length > 0 ? (
                <div className="flex-1 flex flex-col items-center">
                  <div className="h-[180px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.pie}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {stats.pie.map((_: any, index: number) => (
                            <Cell
                              key={index}
                              fill={COLORS[index % COLORS.length]}
                              stroke="transparent"
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#141414",
                            borderColor: "#262626",
                            borderRadius: "12px",
                          }}
                          itemStyle={{ color: "#fff" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2 w-full">
                    {stats.pie.map((item: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                              backgroundColor: COLORS[i % COLORS.length],
                            }}
                          />
                          <span className="text-neutral-300 font-semibold">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-white font-black">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-neutral-600 py-8">
                  <Layers size={48} className="mb-4 opacity-10" />
                  <p className="text-sm font-medium italic">
                    No active subscriptions yet.
                  </p>
                </div>
              )}
              <div className="mt-6 pt-5 border-t border-neutral-800">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
                    Total Subscribers
                  </span>
                  <span className="text-2xl font-black text-emerald-400">
                    {stats.subscribedCount}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── CHARTS ROW 2 ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue per Plan (Bar Chart) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-neutral-900/40 border border-neutral-800 rounded-[2.5rem] p-8 backdrop-blur-md shadow-xl"
            >
              <div className="flex justify-between items-center mb-7">
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">
                    Revenue per Plan
                  </h3>
                  <p className="text-sm text-neutral-500 font-medium">
                    Total earnings from each plan
                  </p>
                </div>
                <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <BarChart2 size={20} className="text-emerald-400" />
                </div>
              </div>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.planDistributionData} barSize={32}>
                    <CartesianGrid
                      strokeDasharray="4 4"
                      stroke="#1f1f1f"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#525252"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                    />
                    <YAxis
                      stroke="#525252"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `₹${v}`}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "rgba(255,255,255,0.03)" }}
                    />
                    <Bar dataKey="revenue" radius={[10, 10, 0, 0]}>
                      {stats.planDistributionData.map(
                        (_: any, index: number) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ),
                      )}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Revenue Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-neutral-900/40 border border-neutral-800 rounded-[2.5rem] p-8 backdrop-blur-md shadow-xl"
            >
              <div className="flex justify-between items-center mb-7">
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">
                    Revenue Trend
                  </h3>
                  <p className="text-sm text-neutral-500 font-medium">
                    By subscription start date
                  </p>
                </div>
                <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <TrendingUp size={20} className="text-blue-400" />
                </div>
              </div>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={
                      stats.revTrendData.length > 0
                        ? stats.revTrendData
                        : [{ date: "No data", revenue: 0 }]
                    }
                  >
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
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
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={12}
                    />
                    <YAxis
                      stroke="#525252"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `₹${v}`}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{
                        stroke: "#10b981",
                        strokeWidth: 2,
                        strokeDasharray: "5 5",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorRev)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* ── BOTTOM ROW ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Plan Details Table */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-neutral-900/30 border border-neutral-800 rounded-[2.5rem] p-9 backdrop-blur-md shadow-xl"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-black text-amber-500 tracking-tight">
                    Plan Catalogue
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    All active subscription plans
                  </p>
                </div>
                <ShieldCheck className="text-amber-500 opacity-40" size={28} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-neutral-500 text-[10px] uppercase font-black tracking-[0.2em] border-b border-neutral-800/50">
                      <th className="pb-5">Plan</th>
                      <th className="pb-5">Price</th>
                      <th className="pb-5">Term</th>
                      <th className="pb-5 text-right">Subscribers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/30">
                    {plans.map((plan: any, i: number) => {
                      const match = stats.planDistributionData.find(
                        (p: any) => p.name === plan.planName,
                      );
                      const subCount = match?.count || 0;
                      return (
                        <tr
                          key={i}
                          className="group hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="py-5">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-2.5 h-2.5 rounded-full"
                                style={{
                                  backgroundColor: COLORS[i % COLORS.length],
                                }}
                              />
                              <span className="font-bold text-white">
                                {plan.planName}
                              </span>
                            </div>
                          </td>
                          <td className="py-5 font-black text-emerald-400">
                            ₹{plan.price}
                          </td>
                          <td className="py-5 text-neutral-400 font-medium text-sm">
                            {plan.duration}
                          </td>
                          <td className="py-5 text-right">
                            <span
                              className={`text-xs px-3 py-1.5 rounded-full font-black uppercase tracking-tight ${subCount > 0 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-neutral-800 text-neutral-500 border border-neutral-700"}`}
                            >
                              {subCount} active
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {plans.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-10 text-neutral-600 text-sm italic"
                        >
                          No plans found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Expiring Soon */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-neutral-900/30 border border-neutral-800 rounded-[2.5rem] p-9 backdrop-blur-md shadow-xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">
                    Expiring Soon
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    Subscriptions ending within 30 days
                  </p>
                </div>
                <div className="p-2.5 bg-rose-500/10 rounded-xl border border-rose-500/20">
                  <Clock size={20} className="text-rose-400" />
                </div>
              </div>
              <div className="flex-1 space-y-4 max-h-[420px] overflow-y-auto pr-2">
                {stats.expiringSoon.length > 0 ? (
                  stats.expiringSoon.map((item: any, i: number) => {
                    const daysLeft = item.renewalDate
                      ? Math.max(
                          0,
                          Math.ceil(
                            (new Date(item.renewalDate).getTime() -
                              Date.now()) /
                              (1000 * 60 * 60 * 24),
                          ),
                        )
                      : 0;
                    return (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.01, x: 4 }}
                        className="flex items-center justify-between p-5 bg-rose-500/5 rounded-[1.5rem] border border-rose-500/20 group hover:border-rose-500/40 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-2xl bg-neutral-900 flex items-center justify-center text-amber-500 font-black text-xl overflow-hidden border border-white/5">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              item.name?.charAt(0)
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-white">{item.name}</p>
                            <p className="text-xs text-neutral-500 mt-0.5">
                              {item.plan}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-xs font-black px-3 py-1.5 rounded-xl ${daysLeft <= 7 ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-orange-500/10 text-orange-400 border border-orange-500/20"}`}
                          >
                            {daysLeft}d left
                          </span>
                          <p className="text-[10px] text-neutral-600 mt-1.5">
                            {new Date(item.renewalDate).toLocaleDateString()}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-14 text-neutral-700 bg-black/10 rounded-3xl border border-dashed border-neutral-800">
                    <CheckCircle size={40} className="mb-3 opacity-10" />
                    <p className="text-sm font-semibold italic">
                      All subscriptions are healthy.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* ── RECENT APPLICANTS ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gradient-to-b from-neutral-900/40 to-neutral-950/40 border border-neutral-800 rounded-[2.5rem] p-9 backdrop-blur-md shadow-xl"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">
                  Recent Applicants
                </h3>
                <p className="text-sm text-neutral-500 mt-1">
                  Pending restaurant registrations
                </p>
              </div>
              <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <Zap size={18} className="text-amber-400" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applicantsList
                .filter((r: any) => r.status === "pending")
                .slice(0, 4)
                .map((item: any, i: number) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.01, x: 4 }}
                    className="flex items-center justify-between p-5 bg-neutral-800/20 rounded-[1.5rem] border border-neutral-700/30 group hover:border-amber-500/40 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-neutral-900 flex items-center justify-center text-amber-500 font-black text-xl overflow-hidden border border-white/5">
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
                        <p className="font-bold text-white group-hover:text-amber-500 transition-colors">
                          {item.restaurantName}
                        </p>
                        <p className="text-xs text-neutral-500 truncate max-w-[180px] mt-0.5">
                          {item.placeName || "Location pending"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-xl border border-amber-500/20 uppercase font-black tracking-widest">
                        Review
                      </span>
                      <p className="text-[10px] text-neutral-500 font-bold mt-2">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              {pendingCount === 0 && (
                <div className="col-span-2 flex flex-col items-center justify-center py-14 text-neutral-600 bg-black/10 rounded-3xl border border-dashed border-neutral-800">
                  <CheckCircle size={48} className="mb-4 opacity-5" />
                  <p className="text-sm font-semibold italic">
                    No pending requests.
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => navigate("/superadmin/approval")}
              className="w-full mt-8 py-5 bg-white text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-3 group active:scale-95"
            >
              Go to Applicants
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
