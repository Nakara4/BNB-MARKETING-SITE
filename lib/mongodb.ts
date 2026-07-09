import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB_NAME;

// Optimized MongoDB connection options for better performance and stability
const options = {
  // Timeout for server selection (finding a healthy server to connect to)
  // Reduced from 8s to 5s to fail fast if database is unreachable
  serverSelectionTimeoutMS: 5000,

  // Timeout for establishing initial connection
  // Reduced from 8s to 5s for quicker failure detection
  connectTimeoutMS: 5000,

  // Timeout for socket operations (read/write)
  // Slightly reduced from 20s to 15s to prevent hanging requests
  socketTimeoutMS: 15000,

  // Connection pool settings for better concurrency
  // Minimum pool size (connections always open)
  minPoolSize: 2,

  // Maximum pool size (max concurrent connections)
  // Adjusted for typical Vercel serverless scale
  maxPoolSize: 10,

  // Wait queue timeout - how long to wait for an available connection
  waitQueueTimeoutMS: 10000,

  // Retry logic for transient connection failures
  retryWrites: true,
  retryReads: true,

  // Connection monitoring
  monitorCommands: process.env.NODE_ENV === "development"
};

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient> | undefined;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function createClientPromise() {
  if (!uri) {
    throw new Error("Missing MONGODB_URI. Add it to .env.local before running the app.");
  }

  client = new MongoClient(uri, options);
  return client.connect().catch((error) => {
    if (process.env.NODE_ENV === "development") {
      global._mongoClientPromise = undefined;
    }
    clientPromise = undefined;
    throw error;
  });
}

function getClientPromise() {
  if (!uri) {
    throw new Error("Missing MONGODB_URI. Add it to .env.local before running the app.");
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = createClientPromise();
    }
    return global._mongoClientPromise;
  }

  clientPromise ??= createClientPromise();
  return clientPromise;
}

export async function getDb() {
  const clientPromise = getClientPromise();
  const connectedClient = await clientPromise;
  return connectedClient.db(databaseName || undefined);
}

export function formatMongoError(error: unknown) {
  if (
    error instanceof Error &&
    (error.name === "MongoNetworkError" ||
      error.name === "MongoServerSelectionError" ||
      error.message.includes("ETIMEDOUT") ||
      error.message.includes("ENETUNREACH"))
  ) {
    return "Cannot connect to MongoDB Atlas. Check Atlas Network Access, your internet connection, and that your current IP address is allowed.";
  }

  if (error instanceof Error && error.message.includes("queryTxt")) {
    return "Cannot resolve the MongoDB Atlas SRV record. Check your MONGODB_URI and DNS/network connection.";
  }

  if (error instanceof Error && error.message.includes("MONGODB_URI")) {
    return error.message;
  }

  return error instanceof Error ? error.message : "MongoDB connection failed.";
}
