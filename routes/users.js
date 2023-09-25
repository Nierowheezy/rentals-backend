const express = require("express");
const router = express.Router();

const { register, auth } = require("../controllers/userController");

router.route("/auth").post(auth);
router.route("/register").post(register);

module.exports = router;
