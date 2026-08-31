const mongoose = require('c:/Users/DNT-Haroon/Desktop/Hotel-Management/server/node_modules/mongoose');
const DBURI = 'mongodb://127.0.0.1:27017/hotel-management';

async function check() {
  try {
    console.log("Connecting to local MongoDB...");
    await mongoose.connect(DBURI, { serverSelectionTimeoutMS: 2000 });
    console.log("Connected successfully to local MongoDB!");

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections in database:");
    for (let col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(` - ${col.name}: ${count} documents`);
    }
  } catch (err) {
    console.error("Local Database connection error:", err.message);
  } finally {
    try {
      await mongoose.disconnect();
    } catch {}
    console.log("Disconnected.");
  }
}

check();
