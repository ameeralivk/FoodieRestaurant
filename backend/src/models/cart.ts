import mongoose, { Schema, Types, HydratedDocument } from "mongoose";
import { ICart } from "../types/cart";

export type CartDocument = HydratedDocument<ICart>;

const CartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    tableId: {
      type: String,
      required: true,
    },

    items: {
      type: [
        {
          itemId: {
            type: Schema.Types.ObjectId,
            ref: "Item",
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            default: 1,
          },
          images: {
            type: [String],
            default: [],
          },
          variant: {
            category: String,
            option: String,
            price: Number,
          },
          preparationTime: {
            type: Number,
          },
          instraction:{
            type:String,
            default:null
          }
        },
      ],
      default: [],
    },

    totalAmount: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

CartSchema.pre("save", function (next) {
  const cart = this as CartDocument;

  cart.totalAmount = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  next();
});

const Cart = mongoose.model<ICart>("Cart", CartSchema);
export default Cart;
