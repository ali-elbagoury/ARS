const { MongoClient } = require("mongodb");
require("dotenv").config();

// Connection settings optimized for Atlas
const options = {
  maxPoolSize: 10,
  connectTimeoutMS: 10000,  // Increased timeout for Atlas
  socketTimeoutMS: 45000,   // Increased socket timeout
  serverSelectionTimeoutMS: 10000,
  retryWrites: true,
  retryReads: true,
  ssl: true,               // Required for Atlas
  tlsAllowInvalidCertificates: false
};

let client;
let dbInstance;
let isConnected = false;

async function connectToDB() {
  if (isConnected) return dbInstance;

  try {
    if (!process.env.ATLAS_URI) {
      throw new Error("ATLAS_URI not found in environment variables");
    }

    client = new MongoClient(process.env.ATLAS_URI, options);
    await client.connect();
    
    // Verify connection
    await client.db("admin").command({ ping: 1 });
    dbInstance = client.db(); // Uses database from connection string
    
    isConnected = true;
    console.log("✅ MongoDB Atlas connection established");
    return dbInstance;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    await closeConnection();
    throw error;
  }
}

function getDB() {
  if (!isConnected || !dbInstance) {
    throw new Error("Database not connected. Call connectToDB() first.");
  }
  return dbInstance;
}

async function closeConnection() {
  if (client) {
    try {
      await client.close();
      console.log("🔴 MongoDB connection closed");
    } catch (error) {
      console.error("❌ Error closing connection:", error.message);
    } finally {
      client = null;
      dbInstance = null;
      isConnected = false;
    }
  }
}

async function checkConnection() {
  try {
    if (!isConnected) return false;
    await dbInstance.command({ ping: 1 });
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  connectToDB,
  getDB,
  closeConnection,
  checkConnection
};