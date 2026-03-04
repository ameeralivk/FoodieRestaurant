import mongoose, { Schema } from 'mongoose';
import { IGroup } from '../types/varient';
const VariantSchema = new Schema({
  name: { type: String, required: true }
});

const GroupSchema = new Schema<IGroup>({
  name: { type: String, required: true },
  Varients: [VariantSchema],
  isActive: { type: Boolean, default: true },
  restaurantId: {
  type: Schema.Types.ObjectId,
  ref: "admins", 
 },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IGroup>('VarientSchema', GroupSchema);
