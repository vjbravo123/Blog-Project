import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Will be hashed
    image: { type: String, default: "" },
    role: { 
      type: String, 
      enum: ["user", "author", "admin"], 
      default: "user" 
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;