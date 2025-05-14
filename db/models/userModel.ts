import mongoose from "mongoose";
import { number } from "zod";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
  },
  phone: {
    type: String,
  },
  image: {
    type: String,
  },
  is_admin: {
    type: Boolean,
    default: false,
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
  },
});

export const User = mongoose.model("User", userSchema);
