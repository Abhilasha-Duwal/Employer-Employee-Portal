const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
} = require("../config");
const Admin = require("../models/admin");
const Employee = require("../models/employee");
const Employer = require("../models/employer");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Register New Employer
const registerEmployer = async (req, res) => {
  const {
    username,
    email,
    password,
    address,
    annualSalary,
    jobTitle,
    userRole,
  } = req.body;

  try {
    // Check if the userRole is "employer"
    if (userRole !== 'employer') {
      return res.status(400).json({ message: "Only 'employer' role can be registered" });
    }

    const existingUser = await Employer.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newEmployer = new Employer({
      username,
      email,
      password: CryptoJS.AES.encrypt(
        password,
        process.env.PASSWORD_SECRET
      ).toString(),
      address,
      annualSalary,
      jobTitle,
      userRole,
    });

    const savedUser = await newEmployer.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Register New Employee
const registerEmployee = async (req, res) => {
  const {
    username,
    email,
    password,
    address,
    mobile,
    annualSalary,
    jobTitle,
    userRole,
  } = req.body;

  try {
    // Check if the userRole is "employee"
    if (userRole !== 'employee') {
      return res.status(400).json({ message: "Only 'employee' role can be registered" });
    }

    const existingUser = await Employee.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newEmployee = new Employee({
      username,
      email,
      password: CryptoJS.AES.encrypt(
        password,
        process.env.PASSWORD_SECRET
      ).toString(),
      address,
      mobile,
      annualSalary,
      jobTitle,
      userRole,
    });

    const savedUser = await newEmployee.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error("Error registering employee:", err);
    res.status(500).json(err);
  }
};

// Normal Login Employee Route Controller
const login = async (req, res) => {
  try {
    const user = await Admin.findOne({ email: req.body.email });
    if (!user) return res.status(401).json("Wrong credentials");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASSWORD_SECRET
    );
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (originalPassword !== req.body.password)
      return res.status(401).json("Wrong credentials");

    const accessToken = jwt.sign(
      {
        id: user._id,
        userRole: user.userRole,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const { password, ...others } = user._doc;

    return res.status(200).json({ ...others, accessToken });
  } catch (err) {
    return res.status(500).json(err);
  }
};

// Normal Login Employee Route Controller
const loginEmployee = async (req, res) => {
  try {
    const user = await Employee.findOne({ email: req.body.email });
    if (!user) return res.status(401).json("Wrong credentials");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASSWORD_SECRET
    );
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (originalPassword !== req.body.password)
      return res.status(401).json("Wrong credentials");

    const accessToken = jwt.sign(
      {
        id: user._id,
        userRole: user.userRole,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const { password, ...others } = user._doc;

    return res.status(200).json({ ...others, accessToken });
  } catch (err) {
    return res.status(500).json(err);
  }
};

// Normal Login Employer Route Controller
const loginEmployer = async (req, res) => {
  try {
    const user = await Employer.findOne({ email: req.body.email });
    if (!user) return res.status(401).json("Wrong credentials");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASSWORD_SECRET
    );
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (originalPassword !== req.body.password)
      return res.status(401).json("Wrong credentials");

    const accessToken = jwt.sign(
      {
        id: user._id,
        userRole: user.userRole,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const { password, ...others } = user._doc;

    return res.status(200).json({ ...others, accessToken });
  } catch (err) {
    return res.status(500).json(err);
  }
};

// Configure Passport with Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user exists in the database
        let user = await Employer.findOne({ googleId: profile.id });

        // If user does not exist, create a new user
        if (!user) {
          user = new Employer({
            googleId: profile.id,
            email: profile.emails[0].value,
            // Add other necessary fields
          });
          await user.save();
        }

        // Generate JWT token
        const token = jwt.sign(
          {
            id: user._id,
            userRole: user.userRole,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        done(null, { user, token });
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Google OAuth Login Route Controller for users
const googleLogin = (req, res, next) => {
  // Redirect user to Google OAuth
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
};

// Google OAuth Callback Route Controller
const googleCallback = (req, res) => {
  const { user, token } = req.user;
  res.status(200).json({ user, token });
};

module.exports = {
  registerEmployer,
  registerEmployee,
  login,
  loginEmployee,
  loginEmployer,
  googleLogin,
  googleCallback,
};
