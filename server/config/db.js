// const { default: mongoose } = require("mongoose");

// async function ConnectDB() {
//     try {
//         await mongoose.connect(process.env.DBURI)
//           .then(() => console.log('Connected!'))
//           .catch(() => console.log(' Not Connected!'));
//     } catch (error) {
//         console.log(error.message)
//     }
// }
// module.exports = ConnectDB;

//chat gpt  code//

const mongoose = require("mongoose");

const ConnectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1); // Exit process if DB connection fails
  }
};

module.exports = ConnectDB;