import mongoose, { Schema, Document } from "mongoose";
import { IAdmin } from "../types/admin";
import {  string } from "zod";
const adminSchema = new Schema<IAdmin>(
  {
    role: { type: String, required: true },
    restaurantName: { type: String },
    email: { type: String, required: true },
    ownerName: { type: String, required: false },
    contactNumber: { type: Number, required: false },
    restaurantAddress: { type: String, required: false },
    openingTime: { type: String, required: false },
    closingTime: { type: String, required: false },
    restaurantPhoto: { type: String, required: false },
    proofDocument: { type: String, required: false },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: false,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: false,
      },
    },
    password: { type: String },
    isDeleted: { type: Boolean, default: false },
    googleID: { type: String },
    imageUrl: { type: String },
    isBlocked: { type: Boolean, default: false },
    placeName: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "resubmitted"],
    },
    rejectionReason: { type: string },
    rejectedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export type AdminDocument = IAdmin & Document;
const Admin = mongoose.model<AdminDocument>("Admin", adminSchema);
export default Admin;
