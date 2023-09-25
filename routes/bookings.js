const express = require("express");
const router = express.Router();

const {
  createBooking,
  manageBookings,
} = require("../controllers/bookingController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.route("").post(authMiddleware, createBooking);
router.route("/manage").get(authMiddleware, manageBookings);

module.exports = router;
