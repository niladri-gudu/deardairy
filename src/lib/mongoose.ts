import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) throw new Error("Missing MONGODB_URI");

const globalWithMongoose = global as typeof globalThis & {
  _mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

if (!globalWithMongoose._mongoose) {
  globalWithMongoose._mongoose = { conn: null, promise: null };
}

const cached = globalWithMongoose._mongoose;

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "deardiary",
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
