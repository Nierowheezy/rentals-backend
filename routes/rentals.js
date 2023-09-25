const express = require("express");
const router = express.Router();

const {
  getAllRentals,
  getRentalById,
  getsecret,
  createRental,
  deleteRental,
  manageRental,
} = require("../controllers/rentalController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.route("/secret").get(authMiddleware, getsecret);
router.route("/manage").get(authMiddleware, manageRental);
router.route("/").get(getAllRentals);
router.route("/:id").get(getRentalById);
router.route("/").post(authMiddleware, createRental);
router.route("/:id").delete(authMiddleware, deleteRental);
// router.route("/:id").put(updateTask);

module.exports = router;
