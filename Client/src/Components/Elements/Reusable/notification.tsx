import React from "react";
import { Bell, Check, X } from "lucide-react";

// ✅ Backend notification type
export interface BackendNotification {
  _id: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  recipientId: string;
  recipientModel: string;
  isDeleted: boolean;
}

interface NotificationCenterProps {
  notifications: BackendNotification[];
  filter: "unread" | "all";
  onFilterChange: (filter: "unread" | "all") => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClose?: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  filter,
  onFilterChange,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
}) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const displayedNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  return (
    <div className="max-w-md w-110 mr-36 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 flex justify-between items-start">
        <div className="flex gap-4">
          <div className="bg-blue-50 p-3 rounded-2xl">
            <Bell className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
            <p className="text-sm text-gray-500">
              {unreadCount} unread notifications
            </p>
          </div>
        </div>

        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-6 pb-4 flex justify-between items-center">
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => onFilterChange("unread")}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold ${
              filter === "unread" ? "bg-blue-600 text-white" : "text-gray-600"
            }`}
          >
            Unread ({unreadCount})
          </button>

          {/* <button
            onClick={() => onFilterChange("all")}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold ${
              filter === "all" ? "bg-blue-600 text-white" : "text-gray-600"
            }`}
          >
            All
          </button> */}
        </div>

        <button
          onClick={onMarkAllAsRead}
          className="bg-blue-500 p-2 rounded-xl text-white hover:bg-blue-600"
        >
          <Check className="w-5 h-5" />
        </button>
      </div>

      {/* List */}
      <div className="px-4 pb-6 space-y-3 max-h-[400px] overflow-y-auto">
        {displayedNotifications.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-6">
            No notifications
          </div>
        )}

        {displayedNotifications.map((note) => (
          <div
            key={note._id}
            className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="font-semibold text-gray-800">Order Update</div>

              <div className="flex items-center gap-2">
                {!note.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                )}

                <span className="text-xs text-gray-400">
                  {new Date(note.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-3">{note.message}</div>

            {!note.isRead && (
              <div className="flex justify-end">
                <button
                  onClick={() => onMarkAsRead(note._id)}
                  className="bg-blue-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-600"
                >
                  Mark as read
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationCenter;
