import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      requried: true,
    },
    email: {
      type: String,
      requried: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      requried: true,
    },
    avatarUrl: String, // not required?
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
