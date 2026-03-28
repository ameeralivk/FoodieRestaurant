


import React from "react";
import { motion } from "framer-motion";
import { 
    Clock, 
    User, 
    CheckCircle2, 
    MapPin, 
    ChevronRight, 
    CreditCard,
    Zap,
    Truck,
    Hash
} from "lucide-react";
import type { IUserOrder, OrderItemStatus } from "../../../types/order";

export type ItemStatus = "preparing" | "ready" | "served";
export type OrderStatus = "ready" | "serving" | "completed";

const ItemStatusBadge: React.FC<{ status: OrderItemStatus }> = ({ status }) => {
  const colors = {
    PENDING: "bg-gray-100 text-gray-500 border border-gray-200",
    ASSIGNED: "bg-blue-50 text-blue-600 border border-blue-100",
    PREPARING: "bg-amber-50 text-amber-600 border border-amber-100",
    READY: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    SERVING: "bg-orange-50 text-orange-600 border-orange-100",
    SERVED: "bg-gray-100 text-gray-800 border border-gray-300",
  };

  return (
    <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-wider ${colors[status] || colors.PENDING}`}>
      {status}
    </span>
  );
};

type Props = {
  order: IUserOrder;
  onAssign?: () => void;
  onServing?: () => void;
};

const StaffOrderCard: React.FC<Props> = ({ order, onAssign, onServing }) => {
  const allItemsReady = order.items.every(i => i.itemStatus === "READY");
  const isServed = order.orderStatus === "SERVED";

  return (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -8, transition: { duration: 0.2 } }}
        className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:shadow-indigo-100/40 transition-all duration-300 relative overflow-hidden group flex flex-col h-full"
    >
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
            <Truck className="w-32 h-32" />
        </div>

        {/* Card Header */}
        <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="space-y-1.5 text-left">
                <div className="flex items-center gap-2 mb-1">
                    <Hash className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-[11px] font-black text-gray-400 tracking-widest uppercase italic group-hover:text-indigo-600 transition-colors">
                        #{order.orderId.slice(-8).toUpperCase()}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-[1.25rem] group-hover:scale-110 transition-transform shadow-sm">
                        <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-xl font-black text-gray-900 leading-none">Table {order.tableId}</span>
                </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 rounded-full border border-gray-100">
                    <Clock className="w-3 h-3" />
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex items-center gap-1.5 text-gray-900 font-black text-lg scale-90 sm:scale-100 origin-right transition-transform group-hover:scale-110">
                    <CreditCard className="w-4 h-4 text-emerald-500" />
                    ₹{order.totalAmount}
                </div>
            </div>
        </div>

        {/* Item List */}
        <div className="space-y-4 mb-10 flex-grow relative z-10 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
            {order.items.map((item) => (
                <div key={item._id} className="flex justify-between items-center group/item transition-all p-1 hover:bg-gray-50 rounded-2xl">
                    <div className="flex flex-col">
                        <span className="text-[13px] font-black text-gray-700 leading-tight group-hover/item:translate-x-1 transition-transform">{item.itemName}</span>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Qty: {item.quantity}</span>
                        </div>
                    </div>
                    <ItemStatusBadge status={item.itemStatus} />
                </div>
            ))}
        </div>

        {/* Readiness Alert */}
        {allItemsReady && !isServed && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-4 bg-emerald-50 border border-emerald-100/50 rounded-3xl relative z-10 flex items-center gap-3 overflow-hidden group/alert shadow-sm"
            >
                <div className="absolute top-0 right-0 p-3 opacity-[0.08] group-hover/alert:scale-110 transition-transform">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-50 transition-transform group-hover/alert:rotate-12">
                    <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-0.5">Kitchen Status</span>
                    <span className="text-[11px] font-black text-emerald-700 italic">Order Manifest Ready for Pickup</span>
                </div>
            </motion.div>
        )}

        {/* Conditional Buttons */}
        <div className="mt-auto relative z-10 w-full pt-6 border-t border-gray-50 flex gap-4">
            {order.orderStatus === "READY" && onAssign && (
                <button
                    onClick={onAssign}
                    className="w-full bg-[#0a0c14] hover:bg-indigo-600 text-white font-black py-4.5 rounded-[1.75rem] text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-gray-200 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group/btn"
                >
                    <User className="w-4 h-4" />
                    Assign Manifest
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
            )}

            {order.orderStatus === "SERVING" && onServing && (
                <button
                    onClick={onServing}
                    className="w-full bg-indigo-600 hover:bg-emerald-600 text-white font-black py-4.5 rounded-[1.75rem] text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group/btn"
                >
                    <Zap className="w-4 h-4" />
                    Mark as Served
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
            )}

            {order.orderStatus === "SERVED" && (
                <div className="w-full bg-emerald-100 text-emerald-700 font-black py-4.5 rounded-[1.75rem] text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 border-2 border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" />
                    Served Complete
                </div>
            )}

            {order.orderStatus === "ASSIGNED" && onServing && (
                <button
                    onClick={onServing}
                    className="w-full bg-indigo-600 hover:bg-emerald-600 text-white font-black py-4.5 rounded-[1.75rem] text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group/btn"
                >
                    <Truck className="w-4 h-4" />
                    Start Serving
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
            )}
        </div>
    </motion.div>
  );
};

export default StaffOrderCard;
