import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IStudent extends Document {
  fullName: string;
  studentId: string;
  email: string;
  phone: string;
  major: string;
  jerseySize: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  paymentStatus: "pending" | "paid";
  paymentProofUrl?: string;
  qrCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    fullName: { type: String, required: true, trim: true },
    studentId: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: { type: String, required: true, trim: true },
    major: { type: String, required: true, trim: true },
    jerseySize: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    paymentProofUrl: { type: String, default: "" },
    qrCode: { type: String, default: "" },
  },
  { timestamps: true },
);

const StudentModel =
  (mongoose.models.Student as Model<IStudent>) ||
  mongoose.model<IStudent>("Student", StudentSchema);

export default StudentModel;
