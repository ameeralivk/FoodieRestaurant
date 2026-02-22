import React, { useState, createContext, useContext } from 'react';
import { Clock, User, LogOut, ChefHat, CheckCircle2, Truck, UtensilsCrossed, AlertCircle, X, UserPlus, Package } from 'lucide-react';



type ItemStatus = 'pending' | 'assigned' | 'preparing' | 'ready';
type OrderStatus = 'pending' | 'preparing' | 'ready' | 'serving' | 'completed';
type UserRole = 'chef' | 'staff';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  status: ItemStatus;
  station: string;
  assignedChef?: {
    id: string;
    name: string;
  };
  assignedAt?: string;
  completedAt?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  tableNumber: number;
  items: OrderItem[];
  orderTime: string;
  status: OrderStatus;
  totalAmount: number;
  assignedStaff?: {
    id: string;
    name: string;
  };
  staffAssignedAt?: string;
  servedAt?: string;
}

interface User {
  id: string;
  name: string;
  role: UserRole;
  station?: string;
}

interface AppContextType {
  currentUser: User;
  orders: Order[];
  assignItemToChef: (orderId: string, itemId: string, chefId: string, chefName: string) => void;
  updateItemStatus: (orderId: string, itemId: string, newStatus: ItemStatus) => void;
  assignOrderToStaff: (orderId: string, staffId: string, staffName: string) => void;
  updateOrderToServing: (orderId: string) => void;
  updateOrderToCompleted: (orderId: string) => void;
  setCurrentUser: (user: User) => void;
}



const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-001',
    orderNumber: 'ORD-001',
    tableNumber: 12,
    orderTime: '18:25',
    status: 'pending',
    totalAmount: 850.00,
    items: [
      { id: 'item-001-1', name: 'Chicken Biryani', quantity: 2, status: 'pending', station: 'Main Kitchen' },
      { id: 'item-001-2', name: 'Raita', quantity: 2, status: 'pending', station: 'Cold Station' },
      { id: 'item-001-3', name: 'Gulab Jamun', quantity: 3, status: 'pending', station: 'Dessert' }
    ]
  },
  {
    id: 'ord-002',
    orderNumber: 'ORD-002',
    tableNumber: 5,
    orderTime: '18:30',
    status: 'preparing',
    totalAmount: 720.00,
    items: [
      { 
        id: 'item-002-1', 
        name: 'Margherita Pizza', 
        quantity: 1, 
        status: 'preparing', 
        station: 'Pizza Oven',
        assignedChef: { id: 'chef-002', name: 'Chef Marco' },
        assignedAt: '18:31'
      },
      { id: 'item-002-2', name: 'Caesar Salad', quantity: 1, status: 'pending', station: 'Cold Station' },
      { id: 'item-002-3', name: 'Tiramisu', quantity: 2, status: 'pending', station: 'Dessert' }
    ]
  },
  {
    id: 'ord-003',
    orderNumber: 'ORD-003',
    tableNumber: 8,
    orderTime: '18:32',
    status: 'ready',
    totalAmount: 550.00,
    items: [
      { 
        id: 'item-003-1', 
        name: 'Masala Dosa', 
        quantity: 3, 
        status: 'ready', 
        station: 'South Indian',
        assignedChef: { id: 'chef-003', name: 'Chef Kumar' },
        assignedAt: '18:33',
        completedAt: '18:45'
      },
      { 
        id: 'item-003-2', 
        name: 'Filter Coffee', 
        quantity: 3, 
        status: 'ready', 
        station: 'Beverage',
        assignedChef: { id: 'chef-003', name: 'Chef Kumar' },
        assignedAt: '18:33',
        completedAt: '18:35'
      }
    ]
  },
  {
    id: 'ord-004',
    orderNumber: 'ORD-004',
    tableNumber: 3,
    orderTime: '18:35',
    status: 'serving',
    totalAmount: 980.00,
    items: [
      { 
        id: 'item-004-1', 
        name: 'Classic Burger', 
        quantity: 2, 
        status: 'ready', 
        station: 'Grill',
        assignedChef: { id: 'chef-001', name: 'Chef John' },
        completedAt: '18:48'
      },
      { 
        id: 'item-004-2', 
        name: 'French Fries', 
        quantity: 2, 
        status: 'ready', 
        station: 'Fryer',
        assignedChef: { id: 'chef-001', name: 'Chef John' },
        completedAt: '18:48'
      }
    ],
    assignedStaff: { id: 'staff-001', name: 'Arjun Menon' },
    staffAssignedAt: '18:49'
  },
  {
    id: 'ord-005',
    orderNumber: 'ORD-005',
    tableNumber: 7,
    orderTime: '18:38',
    status: 'preparing',
    totalAmount: 650.00,
    items: [
      { 
        id: 'item-005-1', 
        name: 'Paneer Tikka', 
        quantity: 1, 
        status: 'assigned', 
        station: 'Tandoor',
        assignedChef: { id: 'chef-004', name: 'Chef Ravi' },
        assignedAt: '18:39'
      },
      { id: 'item-005-2', name: 'Butter Naan', quantity: 4, status: 'pending', station: 'Tandoor' },
      { 
        id: 'item-005-3', 
        name: 'Dal Makhani', 
        quantity: 1, 
        status: 'preparing', 
        station: 'Main Kitchen',
        assignedChef: { id: 'chef-004', name: 'Chef Ravi' },
        assignedAt: '18:39'
      }
    ]
  }
];



const calculateOrderStatus = (items: OrderItem[]): OrderStatus => {
  const allReady = items.every(item => item.status === 'ready');
  if (allReady) return 'ready';
  
  const anyInProgress = items.some(item => item.status === 'assigned' || item.status === 'preparing' || item.status === 'ready');
  if (anyInProgress) return 'preparing';
  
  return 'pending';
};

const getItemProgress = (items: OrderItem[]) => {
  const ready = items.filter(i => i.status === 'ready').length;
  const preparing = items.filter(i => i.status === 'preparing').length;
  const assigned = items.filter(i => i.status === 'assigned').length;
  const pending = items.filter(i => i.status === 'pending').length;
  const total = items.length;
  const percentage = Math.round((ready / total) * 100);
  
  return { ready, preparing, assigned, pending, total, percentage };
};


const AppContext = createContext<AppContextType | null>(null);

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};



const ItemStatusBadge: React.FC<{ status: ItemStatus }> = ({ status }) => {
  const configs = {
    pending: {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
      label: 'Pending',
      icon: <Clock className="w-3 h-3" />
    },
    assigned: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-300',
      label: 'Assigned',
      icon: <UserPlus className="w-3 h-3" />
    },
    preparing: {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      border: 'border-amber-300',
      label: 'Preparing',
      icon: <ChefHat className="w-3 h-3" />
    },
    ready: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      border: 'border-emerald-300',
      label: 'Ready',
      icon: <CheckCircle2 className="w-3 h-3" />
    }
  };

  const config = configs[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${config.bg} ${config.text} ${config.border}`}>
      {config.icon}
      {config.label}
    </span>
  );
};



const ChefAssignModal: React.FC<{
  order: Order;
  item: OrderItem;
  currentChef: User;
  onClose: () => void;
  onAssign: (orderId: string, itemId: string, chefId: string, chefName: string) => void;
}> = ({ order, item, currentChef, onClose, onAssign }) => {
  
  const handleAssign = () => {
    onAssign(order.id, item.id, currentChef.id, currentChef.name);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Assign to Yourself</h2>
              <p className="text-sm text-slate-600 mt-1">
                Order {order.orderNumber} • Table {order.tableNumber}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
              <span className="text-sm font-bold text-slate-600 bg-white px-3 py-1 rounded-lg border border-slate-200">
                × {item.quantity}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <ChefHat className="w-4 h-4" />
              <span>{item.station}</span>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center">
                {currentChef.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="font-bold text-slate-900">{currentChef.name}</div>
                <div className="text-sm text-slate-600">{currentChef.station}</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">By assigning this item:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>You'll be responsible for preparing it</li>
                  <li>It will appear in your "My Items" section</li>
                  <li>You can update its status as you cook</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-200"
          >
            Assign to Me
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
      `}</style>
    </div>
  );
};

const ChefUpdateItemModal: React.FC<{
  order: Order;
  item: OrderItem;
  onClose: () => void;
  onUpdate: (orderId: string, itemId: string, newStatus: ItemStatus) => void;
}> = ({ order, item, onClose, onUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState<ItemStatus>(item.status);

  const handleUpdate = () => {
    onUpdate(order.id, item.id, selectedStatus);
    onClose();
  };

  // Can only update from assigned -> preparing -> ready
  const availableStatuses: ItemStatus[] = [];
  if (item.status === 'assigned') {
    availableStatuses.push('assigned', 'preparing');
  } else if (item.status === 'preparing') {
    availableStatuses.push('preparing', 'ready');
  } else if (item.status === 'ready') {
    availableStatuses.push('ready');
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Update Status</h2>
              <p className="text-sm text-slate-600 mt-1">
                Order {order.orderNumber} • Table {order.tableNumber}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
              <span className="text-sm font-bold text-slate-600 bg-white px-3 py-1 rounded-lg border border-slate-200">
                × {item.quantity}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {availableStatuses.includes('assigned' as ItemStatus) && (
              <button
                onClick={() => setSelectedStatus('assigned')}
                disabled={item.status !== 'assigned'}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  selectedStatus === 'assigned'
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-300'
                } ${item.status !== 'assigned' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <UserPlus className="w-5 h-5 text-blue-700" />
                  <div>
                    <div className="font-bold text-slate-900">Assigned</div>
                    <div className="text-xs text-slate-600">Item assigned, not yet started</div>
                  </div>
                </div>
              </button>
            )}

            {availableStatuses.includes('preparing' as ItemStatus) && (
              <button
                onClick={() => setSelectedStatus('preparing')}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  selectedStatus === 'preparing'
                    ? 'border-amber-400 bg-amber-50'
                    : 'border-slate-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ChefHat className="w-5 h-5 text-amber-700" />
                  <div>
                    <div className="font-bold text-slate-900">Preparing</div>
                    <div className="text-xs text-slate-600">Currently cooking</div>
                  </div>
                </div>
              </button>
            )}

            {availableStatuses.includes('ready' as ItemStatus) && (
              <button
                onClick={() => setSelectedStatus('ready')}
                disabled={item.status === 'ready'}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  selectedStatus === 'ready'
                    ? 'border-emerald-400 bg-emerald-50'
                    : 'border-slate-200 hover:border-emerald-300'
                } ${item.status === 'ready' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <div>
                    <div className="font-bold text-slate-900">Ready</div>
                    <div className="text-xs text-slate-600">Completed & ready for pickup</div>
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={selectedStatus === item.status}
            className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
};

const ChefDashboard: React.FC = () => {
  const { currentUser, orders, assignItemToChef, updateItemStatus } = useApp();
  const [selectedItem, setSelectedItem] = useState<{ order: Order; item: OrderItem; mode: 'assign' | 'update' } | null>(null);

  // Get available items (pending, no chef assigned)
  const availableItems = orders
    .filter(o => o.status !== 'completed' && o.status !== 'serving')
    .flatMap(order => 
      order.items
        .filter(item => item.status === 'pending' && !item.assignedChef)
        .map(item => ({ order, item }))
    );

  // Get my assigned items
  const myItems = orders
    .filter(o => o.status !== 'completed')
    .flatMap(order =>
      order.items
        .filter(item => item.assignedChef?.id === currentUser.id)
        .map(item => ({ order, item }))
    );

  const stats = {
    available: availableItems.length,
    myAssigned: myItems.filter(({ item }) => item.status === 'assigned').length,
    myPreparing: myItems.filter(({ item }) => item.status === 'preparing').length,
    myReady: myItems.filter(({ item }) => item.status === 'ready').length
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-900">
                Chef <span className="text-emerald-600">Dashboard</span>
              </h1>
              <p className="text-slate-600 mt-1">Self-assign and manage order items</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-black text-xl flex items-center justify-center shadow-lg">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-900">{currentUser.name}</div>
                <div className="text-sm text-slate-600">{currentUser.station}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="text-slate-600 text-sm font-medium mb-1">Available</div>
            <div className="text-3xl font-black text-slate-900">{stats.available}</div>
          </div>
          <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm">
            <div className="text-blue-600 text-sm font-medium mb-1">Assigned</div>
            <div className="text-3xl font-black text-blue-700">{stats.myAssigned}</div>
          </div>
          <div className="bg-white rounded-xl border border-amber-200 p-5 shadow-sm">
            <div className="text-amber-600 text-sm font-medium mb-1">Preparing</div>
            <div className="text-3xl font-black text-amber-700">{stats.myPreparing}</div>
          </div>
          <div className="bg-white rounded-xl border border-emerald-200 p-5 shadow-sm">
            <div className="text-emerald-600 text-sm font-medium mb-1">Ready</div>
            <div className="text-3xl font-black text-emerald-700">{stats.myReady}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-8 space-y-8">
        {/* My Items */}
        {myItems.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              My Items
              <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {myItems.length}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myItems.map(({ order, item }) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem({ order, item, mode: 'update' })}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all text-left"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-sm text-slate-500 mb-1">{order.orderNumber} • Table {order.tableNumber}</div>
                      <div className="font-bold text-slate-900 text-lg">{item.name}</div>
                      <div className="text-sm text-slate-600 mt-1">× {item.quantity}</div>
                    </div>
                    <ItemStatusBadge status={item.status} />
                  </div>
                  <div className="text-xs text-slate-500">{item.station}</div>
                  {item.assignedAt && (
                    <div className="text-xs text-slate-500 mt-2">
                      Assigned at {item.assignedAt}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Available Items */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            Available Items
            <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {availableItems.length}
            </span>
          </h2>
          {availableItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">No Available Items</h3>
              <p className="text-slate-600">All items are assigned or completed</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableItems.map(({ order, item }) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem({ order, item, mode: 'assign' })}
                  className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-5 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-sm text-slate-500 mb-1">{order.orderNumber} • Table {order.tableNumber}</div>
                      <div className="font-bold text-slate-900 text-lg group-hover:text-emerald-700">{item.name}</div>
                      <div className="text-sm text-slate-600 mt-1">× {item.quantity}</div>
                    </div>
                    <div className="text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <UserPlus className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">{item.station}</div>
                  <div className="text-xs text-emerald-600 font-semibold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to assign to yourself
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedItem && selectedItem.mode === 'assign' && (
        <ChefAssignModal
          order={selectedItem.order}
          item={selectedItem.item}
          currentChef={currentUser}
          onClose={() => setSelectedItem(null)}
          onAssign={assignItemToChef}
        />
      )}

      {selectedItem && selectedItem.mode === 'update' && (
        <ChefUpdateItemModal
          order={selectedItem.order}
          item={selectedItem.item}
          onClose={() => setSelectedItem(null)}
          onUpdate={updateItemStatus}
        />
      )}
    </div>
  );
};



const StaffOrderCard: React.FC<{
  order: Order;
  currentStaff: User;
  onAssign?: () => void;
  onServing?: () => void;
  onCompleted?: () => void;
}> = ({ order, currentStaff, onAssign, onServing, onCompleted }) => {
  const progress = getItemProgress(order.items);
  const isAssignedToMe = order.assignedStaff?.id === currentStaff.id;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-baseline gap-3 mb-1">
              <h3 className="text-lg font-bold text-slate-900">{order.orderNumber}</h3>
              <span className="text-2xl font-black text-slate-900">Table {order.tableNumber}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock className="w-4 h-4" />
              <span>{order.orderTime}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-600">Total</div>
            <div className="text-lg font-black text-slate-900">₹{order.totalAmount}</div>
          </div>
        </div>

        {/* Items */}
        <div className="mb-4 space-y-2">
          {order.items.map(item => (
            <div key={item.id} className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900">{item.name}</span>
                <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded">
                  × {item.quantity}
                </span>
              </div>
              <ItemStatusBadge status={item.status} />
            </div>
          ))}
        </div>

        {/* Progress */}
        {order.status === 'ready' && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-bold text-sm">All items ready for pickup!</span>
            </div>
          </div>
        )}

        {/* Assigned Staff */}
        {order.assignedStaff && (
          <div className="mb-4 flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-slate-400" />
            <span className={isAssignedToMe ? 'text-slate-900 font-semibold' : 'text-slate-600'}>
              {isAssignedToMe ? 'You' : order.assignedStaff.name}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {order.status === 'ready' && !order.assignedStaff && onAssign && (
            <button
              onClick={onAssign}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
            >
              Assign to Me
            </button>
          )}

          {order.status === 'ready' && isAssignedToMe && onServing && (
            <button
              onClick={onServing}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
            >
              Start Serving
            </button>
          )}

          {order.status === 'serving' && isAssignedToMe && onCompleted && (
            <button
              onClick={onCompleted}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
            >
              Mark as Delivered
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const StaffDashboard: React.FC = () => {
  const { currentUser, orders, assignOrderToStaff, updateOrderToServing, updateOrderToCompleted } = useApp();

  const readyOrders = orders.filter(o => o.status === 'ready');
  const servingOrders = orders.filter(o => o.status === 'serving' && o.assignedStaff?.id === currentUser.id);
  const completedOrders = orders.filter(o => o.status === 'completed');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-900">
                Staff <span className="text-emerald-600">Dashboard</span>
              </h1>
              <p className="text-slate-600 mt-1">Pick up and deliver ready orders</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-black text-xl flex items-center justify-center shadow-lg">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-900">{currentUser.name}</div>
                <div className="text-sm text-slate-600">Server</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-emerald-200 p-5 shadow-sm">
            <div className="text-emerald-600 text-sm font-medium mb-1">Ready for Pickup</div>
            <div className="text-3xl font-black text-emerald-700">{readyOrders.length}</div>
          </div>
          <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm">
            <div className="text-blue-600 text-sm font-medium mb-1">Currently Serving</div>
            <div className="text-3xl font-black text-blue-700">{servingOrders.length}</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="text-slate-600 text-sm font-medium mb-1">Completed</div>
            <div className="text-3xl font-black text-slate-700">{completedOrders.length}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-8 space-y-8">
        {/* Ready Orders */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            Ready for Pickup
            <span className="text-sm font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              {readyOrders.length}
            </span>
          </h2>
          {readyOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
              <CheckCircle2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">No Ready Orders</h3>
              <p className="text-slate-600">All orders are being prepared or already served</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {readyOrders.map(order => (
                <StaffOrderCard
                  key={order.id}
                  order={order}
                  currentStaff={currentUser}
                  onAssign={() => assignOrderToStaff(order.id, currentUser.id, currentUser.name)}
                  onServing={() => updateOrderToServing(order.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Serving Orders */}
        {servingOrders.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
              Currently Serving
              <span className="text-sm font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                {servingOrders.length}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {servingOrders.map(order => (
                <StaffOrderCard
                  key={order.id}
                  order={order}
                  currentStaff={currentUser}
                  onCompleted={() => updateOrderToCompleted(order.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'chef-001',
    name: 'Chef Ravi Kumar',
    role: 'chef',
    station: 'Main Kitchen'
  });
  
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  const assignItemToChef = (orderId: string, itemId: string, chefId: string, chefName: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.map(item =>
          item.id === itemId
            ? { 
                ...item, 
                status: 'assigned' as ItemStatus, 
                assignedChef: { id: chefId, name: chefName },
                assignedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
              }
            : item
        );
        const newStatus = calculateOrderStatus(updatedItems);
        return { ...order, items: updatedItems, status: newStatus };
      }
      return order;
    }));
  };

  const updateItemStatus = (orderId: string, itemId: string, newStatus: ItemStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.map(item =>
          item.id === itemId
            ? { 
                ...item, 
                status: newStatus,
                completedAt: newStatus === 'ready' ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : item.completedAt
              }
            : item
        );
        const orderStatus = calculateOrderStatus(updatedItems);
        return { ...order, items: updatedItems, status: orderStatus };
      }
      return order;
    }));
  };

  const assignOrderToStaff = (orderId: string, staffId: string, staffName: string) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? { 
            ...order, 
            assignedStaff: { id: staffId, name: staffName },
            staffAssignedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
          }
        : order
    ));
  };

  const updateOrderToServing = (orderId: string) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status: 'serving' as OrderStatus } : order
    ));
  };

  const updateOrderToCompleted = (orderId: string) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId 
        ? { 
            ...order, 
            status: 'completed' as OrderStatus,
            servedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
          } 
        : order
    ));
  };

  const contextValue: AppContextType = {
    currentUser,
    orders,
    assignItemToChef,
    updateItemStatus,
    assignOrderToStaff,
    updateOrderToServing,
    updateOrderToCompleted,
    setCurrentUser
  };

  // Simple role switcher
  const [view, setView] = useState<'chef' | 'staff'>('chef');

  return (
    <AppContext.Provider value={contextValue}>
      <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-2 flex gap-2 border border-slate-200">
        <button
          onClick={() => {
            setView('chef');
            setCurrentUser({
              id: 'chef-001',
              name: 'Chef Ravi Kumar',
              role: 'chef',
              station: 'Main Kitchen'
            });
          }}
          className={`px-4 py-2 rounded font-semibold text-sm transition-colors ${
            view === 'chef'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Chef View
        </button>
        <button
          onClick={() => {
            setView('staff');
            setCurrentUser({
              id: 'staff-001',
              name: 'Arjun Menon',
              role: 'staff'
            });
          }}
          className={`px-4 py-2 rounded font-semibold text-sm transition-colors ${
            view === 'staff'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Staff View
        </button>
      </div>

      {view === 'chef' ? <ChefDashboard /> : <StaffDashboard />}
    </AppContext.Provider>
  );
};

export default App;