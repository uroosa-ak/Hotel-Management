const mongoose = require("mongoose");
const dns = require("dns");

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore if custom DNS cannot be set
}

const ConnectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.DBURI;
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Primary MongoDB connection failed (${error.message}). Attempting local fallback...`);
    try {
      const localConn = await mongoose.connect("mongodb://127.0.0.1:27017/hotel-management", { serverSelectionTimeoutMS: 3000 });
      console.log(`Connected to Local MongoDB: ${localConn.connection.host}`);
    } catch (localErr) {
      console.error(`MongoDB connection error: ${localErr.message}`);
    }
  }
};

module.exports = ConnectDB;