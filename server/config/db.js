const { default: mongoose } = require("mongoose");

async function ConnectDB() {
    try {
        await mongoose.connect(process.env.DBURI)
          .then(() => console.log('Connected!'))
          .catch(() => console.log(' Not Connected!'));
    } catch (error) {
        console.log(error.message)
    }
}
module.exports = ConnectDB;