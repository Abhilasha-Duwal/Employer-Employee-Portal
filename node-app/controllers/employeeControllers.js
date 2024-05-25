const Employee = require("../models/employee");
const CryptoJS = require("crypto-js");
const employeeUploadQueue = require("../employeeUpload/employeeUploadQueue");

// Function to Upload  list of all employees in Bulk from Excel files.
const uploadEmployeeController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const job = await employeeUploadQueue.add({ fileBuffer: req.file.buffer });

    // Wait for the job to complete and get the result
    const result = await job.finished();

    if (result.errors && result.errors.length > 0) {
      return res.status(400).json({ errors: result.errors });
    }

    return res
      .status(200)
      .json({ message: result.message || "File uploaded successfully" });
  } catch (error) {
    console.error("Error processing file upload:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ADD MORE DETAILS FOR EMPLOYEE
const updateEmployeeToAddMoreDetails = async (req, res) => {
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
const updateEmployeeDetailsById = async (req, res) => {
  const userId = req.params.id;
  const updateFields = req.body; // Fields to update

  try {
    // Find the user by ID
    const user = await Employee.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
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

// UPDATE USER and IF ROLE IS EMPLOYEE  UPDATE DETAILS EXCEPT annual salary, job title and user role fields
const updateOwnDetailByEmployeeById = async (req, res) => {
  try {
    // Fetch the existing user
    const existingUser = await Employee.findById(req.params.id);
    console.log("Existing User:", existingUser);

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user is authorized to perform the update
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        error: "You are not allowed to update this user",
      });
    }

    // Check if the user is trying to update restricted fields
    if (req.user.userRole === "employee") {
      if (
        req.body.annualSalary !== undefined ||
        req.body.jobTitle !== undefined ||
        req.body.userRole !== undefined
      ) {
        return res.status(403).json({
          error:
            "You are not authorized to update annual salary, job title, or user role",
        });
      }
    }

    // Encrypt password if it's being updated
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASSWORD_SECRET
      ).toString();
    }

    // Update the user
    const updatedUser = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true } // Ensure 'new: true' returns the updated document
    );
    console.log("Updated User:", updatedUser);

    // Check if the updated user is valid
    if (!updatedUser) {
      return res.status(500).json({ error: "Failed to update user" });
    }

    // Extract only the updated fields
    const updatedFields = {};
    for (const key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        updatedFields[key] = updatedUser[key];
      }
    }
    console.log("Updated Fields:", updatedFields);

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
    console.error("Error during update:", err);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: err });
  }
};

//DELETE USER BY ID
const deleteEmployeeById = async (req, res) => {
  try {
    await Employee.findById(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
};

// Controller to get own employee's details by their own ID
const getEmployeeDetailsByOwnId = async (req, res) => {
  try {
    // Fetch the employee details by their own ID
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Check if the authenticated user is authorized to access the employee details
    if (req.params.id !== req.user.id) {
      return res.status(403).json({
        error: "You are not authorized to access this employee's details",
      });
    }

    // Decrypt the fetched password if it exists
    if (employee.password) {
      const decryptedPassword = CryptoJS.AES.decrypt(
        employee.password,
        process.env.PASSWORD_SECRET
      ).toString(CryptoJS.enc.Utf8);
      employee.password = decryptedPassword;
    }

    // Return the employee details
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err });
  }
};

//GET USER BY ID
const getEmployeeById = async (req, res) => {
  try {
    const user = await Employee.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
};

//GET ALL Employees
const getAllEmployees = async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await Employee.find().sort({ _id: -1 }).limit(1)
      : await Employee.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  uploadEmployeeController,
  updateEmployeeToAddMoreDetails,
  updateEmployeeDetailsById,
  updateOwnDetailByEmployeeById,
  deleteEmployeeById,
  getEmployeeDetailsByOwnId,
  getEmployeeById,
  getAllEmployees,
};
