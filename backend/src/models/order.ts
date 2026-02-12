import mongoose, { Schema } from "mongoose";
import { IUserOrderDocument } from "../types/order";

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
      category: String,
      option: String,
      price: Number,
    },
    assignedCookId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    itemStatus: {
      type: String,
      enum: ["PENDING", "PREPARING", "READY"],
      default: "PENDING",
    },
    instraction:{
      type:String,
      default:null
    },
    assignedAt: Date,
    preparedAt: Date,
  },
  { _id: false },
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
      enum: ["PLACED", "IN_KITCHEN", "READY", "SERVED"],
      default: "PLACED",
    },

    assignedByStaffId: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
