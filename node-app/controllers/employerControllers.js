const Employer = require("../models/employer");
const CryptoJS = require("crypto-js");

// ADD MORE DETAILS FOR EMPLOYER
const updateEmployerToAddMoreDetails = async (req, res) => {
  const userId = req.params.id;
  const updateFields = req.body; // New fields to add or update

  try {
    // Find the user by ID
    const user = await Employee.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user with new fields
    for (const key in updateFields) {
      user[key] = updateFields[key];
    }

    // Save the updated user
    await user.save();

    res
      .status(200)
      .json({ message: "added new detail to the user successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Edit EMPLOYEE DETAILS BY ID BUT IF EMPLOYER CAN NOT CHANGE ADMIN DETAILS
const updateEmployerDetailsById = async (req, res) => {
  const userId = req.params.id;
  const updateFields = req.body; // Fields to update

  try {
    // Find the user by ID
    const user = await Employer.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the requester is an employer trying to update admin details
    if (req.user.userRole === "employer" && user.userRole === "admin") {
      return res.status(403).json({
        message: "You are not allowed to update admin details",
      });
    }

    // Update user fields
    for (const key in updateFields) {
      if (Object.prototype.hasOwnProperty.call(updateFields, key)) {
        user[key] = updateFields[key];
      }
    }

    // Save the updated user
    await user.save();

    return res
      .status(200)
      .json({ message: "User details updated successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// UPDATE Employer detail by employer itself
const updateOwnDetailByEmployerById = async (req, res) => {
  try {
    // Fetch the existing user
    const existingUser = await Employer.findById(req.params.id);

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user is authorized to perform the update
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        error: "You are not allowed to update this user",
      });
    }

    // Encrypt password if it's being updated
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASSWORD_SECRET
      ).toString();
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    // Extract only the updated fields
    const updatedFields = {};
    for (const key in req.body) {
      updatedFields[key] = updatedUser[key];
    }

    // Create success message
    const fieldNames = Object.keys(updatedFields);
    let successMessage = "You have successfully changed ";
    if (fieldNames.length === 1) {
      successMessage += `${fieldNames[0]}.`;
    } else {
      successMessage += `${fieldNames.slice(0, -1).join(", ")}`;
      successMessage += ` and ${fieldNames.slice(-1)}.`;
    }

    return res.status(200).json({ message: successMessage });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: err });
  }
};

//DELETE USER BY ID
const deleteEmployerById = async (req, res) => {
  try {
    await Employer.findById(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
};

//GET USER BY ID
const getEmployerById = async (req, res) => {
  try {
    const user = await Employer.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
};

//GET ALL Employers
const getAllEmployers = async (req, res) => {
  const query = req.query.new;
  try {
    console.log("User making request:", req.user); // Debugging line
    const users = query
      ? await Employer.find().sort({ _id: -1 }).limit(1)
      : await Employer.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  updateEmployerToAddMoreDetails,
  updateEmployerDetailsById,
  updateOwnDetailByEmployerById,
  deleteEmployerById,
  getEmployerById,
  getAllEmployers,
};
