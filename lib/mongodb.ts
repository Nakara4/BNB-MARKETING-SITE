import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB_NAME;

const options = {
  serverSelectionTimeoutMS: 8000,
  connectTimeoutMS: 8000,
  socketTimeoutMS: 20000
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
  if (error instanceof Error && error.name === "MongoNetworkError") {
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
