export interface TableColumn {
  header: string;
  className?: string;
}

export interface IPlanSnapshot {
  duration: string;          
  features: string[];         
  noOfDishes: number;
  noOfStaff: number;
  planName: string;
  planPrice: number;
}

export interface ISubscription {
  _id: string;
  restaurentId: string;
  planId: string;
  planName: string;
  planPrice: number;
  planSnapshot: IPlanSnapshot;
  startDate: string;         
  renewalDate: string;        
  status:string;
  stripeSessionId: string;
  stripePaymentIntentId: string;
  createdAt: string;
  updatedAt: string;
}


export interface RestaurantApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  loading: boolean;
  data: {
    _id: string;
    restaurantName: string;
    location: string;
    owner: string;
    contact: string;
    isBlocked:boolean;
    planName: string;
    status: string;
    nextDueDate: string;
    startingTime: string;
    endingTime: string;
    subcription:ISubscription;
    amount: string;
    restaurantImage: string;
    verificationDocument: string;
    rejectedAt: Date;
    reason: string;
  };
}

export interface SubscriptionPlan {
  _id?: string;
  planName: string;
  price: number;
  duration: string;
  noOfDishes: number;
  noOfStaff: number;
  features: string[];
}

export interface Subscription {
  id: number;
  planName: string;
  price: number;
  duration: string;
  features: string[];
}


export interface Restaurant {
  _id: string;
  restaurantName: string;
  ownerName: string;
  email: string;
  contactNumber: number;
  role: string;

  openingTime: string;
  closingTime: string;

  placeName: string;

  location: {
    type: "Point";
    coordinates: [number, number];
  };

  restaurantPhoto: string;
  proofDocument: string;

  status: "pending" | "approved" | "rejected";
  isBlocked: boolean;

  subscription: string | null;

  reason: string;
  rejectedAt: string | null;
}
