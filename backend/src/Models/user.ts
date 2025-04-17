import mongoose, { Schema } from "mongoose";

interface IUser {
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  isLoggedIn: boolean;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  isLoggedIn: { type: Boolean, default: false },
});

const User = mongoose.model("User", UserSchema)

export default User