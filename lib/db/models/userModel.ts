// import mongoose from "mongoose";
// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   age: {
//     type: Number,
//   },
//   gender: {
//     type: String,
//     enum: ["Male", "Female"],
//   },
//   phone: {
//     type: String,
//   },
//   image: {
//     type: String,
//   },
//   role: {
//     type: String,
//     enum: ["admin", "user"],
//     default: "user",
//   },
//   is_verified: {
//     type: Boolean,
//     default: false,
//   },
//   token: {
//     type: String,
//   },
// });

// export const User = mongoose.models.User || mongoose.model("User", userSchema);
