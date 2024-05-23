const mongoose = require("mongoose");
const { MONGO_DATABASE, MONGO_USER, MONGO_PASSWORD } = require("../config");
mongoose.set("strictQuery", true);

const url = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@mongo-db:27017/${MONGO_DATABASE}?authSource=admin`;

const connectMongoDb = async () => {
  try {
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectMongoDb;
