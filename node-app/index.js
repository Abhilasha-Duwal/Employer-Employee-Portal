const express = require("express");
const { PORT } = require("./config");
const connectMongoDb = require("./dbConnection/dbConnection");
const authRouter = require("./routes/authRoutes");
const employeeRouter = require("./routes/employeeRoutes");
const employerRouter = require("./routes/employerRoutes");
const cors = require("cors");
const passport = require("passport");

const app = express();

// Initialize Passport
app.use(passport.initialize());

app.use(cors({
  origin:"http://localhost:3001",
  methods:"GET,POST,PUT,DELETE",
  credentials:true
}));
app.use(express.json());

// setuppassport
app.use(passport.initialize());

//connection
connectMongoDb()
  .then(() => console.log("MongoDB connected!!"))
  .catch((err) => {
    console.log(err);
  });

//Middleware - Plugin
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Home API route
app.get("/api/v1", (req, res) => {
  res.send("Hello from server");
});

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users/employees", employeeRouter);
app.use("/api/v1/users/employers", employerRouter);

app.listen(PORT, () => console.log(`Server Starts at: http://localhost:${PORT}/api/v1`));
