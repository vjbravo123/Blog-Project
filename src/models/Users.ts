import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // Hashed. 'select: false' prevents it from returning in queries by default
    image: { type: String, default: "" },
    role: { 
      type: String, 
      enum: ["user", "author", "admin"], 
      default: "user" 
    },
    isActive: { type: Boolean, default: true }, // New field for Active status
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;