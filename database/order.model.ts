import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IOrder extends Document {
  name: string;
  email: string;
  phone: string;
  year: string;

  rollNo: {
    rollPrefix: string;
    rollNumber: number;
  };

  size: "M" | "L" | "XL";

  paymentProofUrl?: string;

  status: "confirmed" | "unchecked" | "rejected";
  isRegistrant: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: { type: String, required: true, trim: true },

    year: { type: String, required: true, trim: true },

    rollNo: {
      type: {
        rollPrefix: { type: String, required: true, trim: true },
        rollNumber: { type: Number, required: true, min: 1, max: 150 },
      },
      required: true,
      default: { rollPrefix: "", rollNumber: 1 },
    },

    // 🧥 NEW FIELD
    size: {
      type: String,
      enum: ["M", "L", "XL"],
      required: true,
      default: "L",
    },

    paymentProofUrl: { type: String, default: "" },

    status: {
      type: String,
      enum: ["confirmed", "unchecked", "rejected"],
      default: "unchecked",
      required: true,
    },

    isRegistrant: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true },
);

// optional indexing (same style as Student)
OrderSchema.index({ year: 1, "rollNo.rollNumber": 1 });

const OrderModel =
  (mongoose.models.Order as Model<IOrder>) ||
  mongoose.model<IOrder>("Order", OrderSchema);

export default OrderModel;
