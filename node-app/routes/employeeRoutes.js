const router = require("express").Router();
const employeeController = require("../controllers/employeeControllers")
const upload = require('../middlewares/uploadFile');
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdminEmployer,
  verifyTokenAndEmployer,
} = require("../middlewares/verifyToken");

// upload list of all employees in Bulk from Excel files.
router.post('/upload', upload.single('file'), verifyTokenAndEmployer, employeeController.uploadEmployeeController);

// ADD MORE DETAILS FOR EMPLOYEE
router.patch("/:id", verifyTokenAndEmployer, employeeController.updateEmployeeToAddMoreDetails);

// Edit EMPLOYEE DETAILS BY ID
router.put("/find/:id", verifyTokenAndEmployer, employeeController.updateEmployeeDetailsById);

// UPDATE USER AND IF ROLE IS EMPLOYEE UPDATE DETAILS EXCEPT annual salary, job title and user role fields
router.put("/:id", verifyTokenAndAuthorization, employeeController.updateOwnDetailByEmployeeById);

//DELETE USER BY ID
router.delete("/:id", verifyTokenAndAdminEmployer, employeeController.deleteEmployeeById);

//GET USER BY ID
router.get("/:id", verifyTokenAndAdminEmployer, employeeController.getEmployeeById);

//GET ALL Employees
router.get("/employees", verifyTokenAndEmployer, employeeController.getAllEmployees);

module.exports = router;
