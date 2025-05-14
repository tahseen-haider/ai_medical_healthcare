import mongoose from "mongoose";

const MONGODB_URI = `mongodb+srv://tahsin:${process.env.ATLAS_PASSWORD}@cluster0.eox5kn5.mongodb.net/user-management`

let isConnected = false;

export async function connectToDB() {
    if(isConnected) return;
    try {
        await mongoose.connect(MONGODB_URI);
        isConnected = true;
        console.log("Database connected Successfully!")
    } catch (error) {
        console.log(error)
    }
}