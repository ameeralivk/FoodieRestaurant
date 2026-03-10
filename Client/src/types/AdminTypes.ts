export interface FormData {
  restaurantName: string;
  email: string;
  password: string;
}

export interface loginForm {
  email: string;
  password: string;
}

export interface RestaurantFormData {
  email: string;
  restaurantName: string;
  ownerName: string;
  contactNumber: string;
  address: string;
  openingTime: string;
  closingTime: string;
  proofDocument: File | null;
  restaurantPhoto: File | null;
  latitude: string;
  longitude: string;
}

export interface AdminType {
  name?: string;
  phone?: string;
  _id: string;
  role: string;
  restaurantName?: string;
  email: string;
  googleId: string;
  imageUrl: string;
  status: string;
  rejectionReason?: string;
  rejectedAt?: Date | null;
}

export interface ForgetPasswordFormData {
  email: string;
}

export interface resetPassword {
  email: string;
  newPassword: string;
  token: string;
}

export interface RegisterFormData {
  restaurantName: string;
  ownerName: string;
  contactNumber: string;
  address: string;
  openingTime: string;
  closingTime: string;
  restaurantPhoto?: File | null;
  proofDocument?: File | null;
  latitude: string;
  longitude: string;
}

export interface AdminStatus {
  status: string;
  rejectedAt: string | null;
  reason: string | null;
}
