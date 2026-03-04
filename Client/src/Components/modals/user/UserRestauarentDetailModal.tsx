import React from "react";
import { X, MapPin, Phone, Mail, Clock, User, XCircle } from "lucide-react";

interface Coordinates {
  type: string;
  coordinates: [number, number];
}

interface PlanSnapshot {
  [key: string]: any;
}

interface Subscription {
  planSnapshot: PlanSnapshot;
  _id: string;
  restaurentId: string;
  planId: string;
  planName: string;
  [key: string]: any;
}

export interface Restaurant {
  _id: string;
  restaurantName: string;
  ownerName: string;
  email: string;
  contactNumber: number;
  placeName: string;
  location: Coordinates;
  distance?: string;
  openingTime: string;
  closingTime: string;
  restaurantPhoto: string;
  proofDocument: string;
  status: string;
  isBlocked: boolean;
  role: string;
  reason?: string;
  rejectedAt?: null | string;
  subscription?: Subscription;
}

interface RestaurantModalProps {
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RestaurantDetailsModal: React.FC<RestaurantModalProps> = ({
  restaurant,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !restaurant) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative">
          <img
            src={restaurant.restaurantPhoto}
            alt={restaurant.restaurantName}
            className="w-full h-48 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800">
              {restaurant.restaurantName}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)]">
          {/* Status and Distance */}
          <div className="flex items-center gap-3 mb-6">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                restaurant.status
              )}`}
            >
              {restaurant.status}
            </span>
            {restaurant.isBlocked && (
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800 flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                Blocked
              </span>
            )}
            {restaurant.distance && (
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                {restaurant.distance}
              </span>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Owner Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Owner Information
              </h3>

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Owner Name</p>
                  <p className="text-gray-800 font-medium">
                    {restaurant.ownerName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-800 font-medium break-all">
                    {restaurant.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Contact Number</p>
                  <p className="text-gray-800 font-medium">
                    {restaurant.contactNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Restaurant Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Restaurant Information
              </h3>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-gray-800 font-medium">
                    {restaurant.placeName}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Coordinates: {restaurant.location.coordinates[1]},{" "}
                    {restaurant.location.coordinates[0]}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Operating Hours</p>
                  <p className="text-gray-800 font-medium">
                    {restaurant.openingTime} - {restaurant.closingTime}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
