const router = require("express").Router();
const employerController = require("../controllers/employerControllers")
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdminEmployer,
  verifyTokenAndEmployer,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");

// ADD MORE DETAILS FOR EMPLOYER
router.patch("/:id", verifyTokenAndAdmin, employerController.updateEmployerToAddMoreDetails);

// Edit EMPLOYER DETAILS BY ID
router.put("/find/:id", verifyTokenAndAdmin, employerController.updateEmployerDetailsById);

// UPDATE Employer detail by employer itself
router.put("/:id", verifyTokenAndAuthorization, employerController.updateOwnDetailByEmployerById);

//DELETE USER BY ID
router.delete("/:id", verifyTokenAndAdmin, employerController.deleteEmployerById);

//GET USER BY ID
router.get("/:id", verifyTokenAndAdmin, employerController.getEmployerById);

//GET ALL Employers
router.get("/", verifyTokenAndAdmin, employerController.getAllEmployers);

module.exports = router;
