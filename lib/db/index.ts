import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI_user_management!;
const options = {}

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  // Reuse connection in development
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // New connection in production
  client = new MongoClient(MONGODB_URI, options);
  clientPromise = client.connect();
}

export default clientPromise