import Admin_Navbar from "../Components/Layouts/Admin_Navbar";
import {
  Instagram,
  Twitter,
  Facebook,
  QrCode,
  Smartphone,
  Zap,
  ChartBar,
  ChefHat,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const handleRestaurentButton = () => {
    navigate("/admin/Login");
  };
  const handleUserButton = () => {
    navigate("/user/Login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden selection:bg-orange-500 selection:text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <Admin_Navbar role={"login"} />
      </div>

      {/* Hero Section */}
      <div className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden bg-slate-900">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] rounded-full bg-orange-600/30 blur-[120px] mix-blend-screen animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] rounded-full bg-amber-500/20 blur-[100px] mix-blend-screen"></div>
          <div className="absolute top-[20%] right-[20%] w-[30%] h-[50%] rounded-full bg-purple-600/20 blur-[100px] mix-blend-screen"></div>
          {/* Overlay existing image */}
          <div className="absolute inset-0 bg-[url('/pexels-andrea-prochilo-3062027-34575931.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/80 to-slate-900"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-12 lg:mt-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-ping"></span>
            <span className="text-sm font-medium text-amber-100 tracking-wide uppercase">
              The Future of Dining is Here
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tight leading-[1.1]">
            Transform Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 drop-shadow-sm">
              Restaurant Experience
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Foodie Palace offers a seamless, QR-based digital dining system.
            Digitize your menus, empower your customers to order instantly from
            their phones, and manage your restaurant effortlessly from one smart
            dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={handleRestaurentButton}
              className="group relative flex items-center justify-center gap-3 w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-4 px-10 rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 hover:-translate-y-1"
            >
              <span>Partner With Us</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={handleUserButton}
              className="group relative flex items-center justify-center gap-3 w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-4 px-10 rounded-2xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1"
            >
              <QrCode className="w-5 h-5" />
              <span>Customer Login</span>
            </button>
          </div>
        </div>
      </div>

      {/* Features Showcase Section */}
      <div className="py-24 bg-slate-50 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Everything You Need To Thrive
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We bridge the gap between hungry customers and efficient kitchen
              management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <QrCode className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Scan & Order System
              </h3>
              <p className="text-slate-500 leading-relaxed">
                Customers scan a QR code placed on their table to browse
                visually rich menus and place orders without waiting for a
                waiter.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Real-time Operations
              </h3>
              <p className="text-slate-500 leading-relaxed">
                Orders go straight to the kitchen display. Reduce human error,
                speed up serving times, and increase table turnover.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <CreditCard className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Seamless Wallet Payments
              </h3>
              <p className="text-slate-500 leading-relaxed">
                Quick checkout with built-in digital wallets. Split bills, add
                tips, and pay securely directly from the web app.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ChartBar className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Analytics Dashboard
              </h3>
              <p className="text-slate-500 leading-relaxed">
                Get powerful insights into daily sales, top-selling items, peak
                hours, and staff performance through your admin panel.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Smartphone className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                No App Download Needed
              </h3>
              <p className="text-slate-500 leading-relaxed">
                Everything works fluidly within the mobile browser. Maximum
                convenience for your guests with zero friction.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform duration-300 group">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ChefHat className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Staff Management
              </h3>
              <p className="text-slate-500 leading-relaxed">
                Effortless way to manage and monitor your team. Track
                attendance, assign roles, and keep your restaurant running
                smoothly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-slate-900 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">
            Ready to upgrade your restaurant?
          </h2>
          <p className="text-xl text-slate-400 mb-10">
            Join Foodie Palace today and provide your customers with an
            unforgettable dining experience.
          </p>
          <button
            onClick={handleRestaurentButton}
            className="bg-white text-slate-900 font-bold py-4 px-12 rounded-full shadow-xl hover:shadow-2xl hover:bg-slate-50 transition-all duration-300 transform hover:-translate-y-1 text-lg"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
