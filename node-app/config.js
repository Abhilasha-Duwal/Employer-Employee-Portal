const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_DATABASE = process.env.MONGO_DATABASE
const MONGO_USER = process.env.MONGO_USER || root;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || root;
const PASSWORD_SECRET = process.env.PASSWORD_SECRET || secret-pass;
const JWT_SECRET = process.env.JWT_SECRET || secret;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

module.exports = {
    PORT,
    MONGO_DATABASE,
    MONGO_USER,
    MONGO_PASSWORD,
    PASSWORD_SECRET,
    JWT_SECRET,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL
  };