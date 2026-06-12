import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IStudent extends Document {
  name: string;

  email: string;
  phone: string;
  year: string;
  rollNo: string;

  paymentProofUrl?: string;

  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    rollNo: { type: String, required: true, unique: true, trim: true },

    paymentProofUrl: { type: String, default: "" },
  },
  { timestamps: true },
);

const StudentModel =
  (mongoose.models.Student as Model<IStudent>) ||
  mongoose.model<IStudent>("Student", StudentSchema);

export default StudentModel;
