import mongoose, { Schema } from "mongoose";
import { IUserOrderDocument } from "../types/order";
import { Types } from "mongoose";
const OrderItemSchema = new Schema(
  {
    itemId: {
      type: Schema.Types.ObjectId,
      ref: "items",
      required: true,
    },
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    itemImages: {
      type: [String],
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    variant: {
      _id: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(), 
      },
      category: {
        type: String,
      },
      option: {
        type: String,
      },
      price: {
        type: Number,
      },
    },
    assignedCookId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    itemStatus: {
      type: String,
      enum: ["PENDING", "PREPARING", "READY", "ASSIGNED"],
      default: "PENDING",
    },
    preparationTime:String,
    instraction: {
      type: String,
      default: null,
    },
    assignedAt: Date,
    preparedAt: Date,
  },
  { _id: false ,timestamps:true },
);

const UserOrderSchema = new Schema<IUserOrderDocument>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },
    orderId: {
      type: String,
      required: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    tableId: {
      type: String,
      required: true,
    },

    customerName: String,
    customerPhone: String,

    items: {
      type: [OrderItemSchema],
      required: true,
      validate: [(val: any[]) => val.length > 0, "Order must have items"],
    },

    subTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      enum: ["INR"],
      default: "INR",
    },

    orderStatus: {
      type: String,
      enum: ["PLACED", "IN_KITCHEN", "READY", "SERVED", "ASSIGNED","SERVING","PREPARING"],
      default: "PLACED",
    },

    assignedByStaffId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
     estimatedPrepTime: {
      type: Number,
      default: 0,
    },

    estimatedReadyAt: {
      type: Date,
    },
    servedAt: Date,
    
  },
  { timestamps: true },
);

const UserOrder = mongoose.model<IUserOrderDocument>(
  "UserOrder",
  UserOrderSchema,
);
export default UserOrder;
