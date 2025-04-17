import mongoose, { Schema } from "mongoose";

interface Iotp extends mongoose.Document {
  otp: string;
  email: string;
  expiresAt: Date;
}

const OtpSchema = new Schema<Iotp>({
  otp: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  expiresAt: { type: Date, default: Date.now, expires: 600 },
});

const Otp = mongoose.model("OtpDB", OtpSchema);

export default Otp;
