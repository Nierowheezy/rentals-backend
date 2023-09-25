const config = require("./dev");
const mongoose = require("mongoose");
// const FakeDatabaseData = require("../seed_data/db_data");

// const fakeDatabaseData = new FakeDatabaseData(); // initialize the database class

const DB_URI = config.DB_URI;

const connectDB = async () => {
  // fakeDatabaseData.seedDB(); //seed the database
  try {
    const conn = await mongoose.connect(DB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error : ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

module.exports = connectDB;
