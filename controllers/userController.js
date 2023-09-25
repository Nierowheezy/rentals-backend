const { normalizeErrors } = require("../helpers/mongoose");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../config/dev");

/**
 * @desc For Registering a new user
 * @route /api/v1/users/register
 * @access Public
 */
exports.register = async (req, res) => {
  const { username, email, password, passwordConfirmation } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      errors: [
        {
          title: "Data Missing!",
          detail: "Provide email and password!",
        },
      ],
    });
  }
  if (password !== passwordConfirmation) {
    return res.status(400).json({
      errors: [
        {
          title: "Invalid Password!",
          detail: "Password is not thesame as confirmation!",
        },
      ],
    });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      errors: [
        {
          title: "Invalid Email!",
          detail: "User with this email already exist!",
        },
      ],
    });
  }

  const user = new User({
    username,
    email,
    password,
  });

  user.save(function (err) {
    if (err) {
      return res.status(422).json({ errors: normalizeErrors(err.errors) });
    }
    return res.json({ registered: true });
  });
};

/**
 * @desc For Get Single Rental
 * @route /api/v1/users/auth
 * @access Public
 */
exports.auth = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({
      errors: [
        {
          title: "Data Missing!",
          detail: "Provide email and password!",
        },
      ],
    });
  }

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.status(422).json({
      errors: [
        {
          title: "Invalid User!",
          detail: "User does not exist!",
        },
      ],
    });
  }
  if (existingUser.existingPassword(password)) {
    //return jwt token
    const token = jwt.sign(
      {
        userId: existingUser.id,
        username: existingUser.username,
      },
      config.SECRET,
      { expiresIn: "1h" }
    );
    return res.json(token);
  } else {
    return res.status(422).json({
      errors: [
        {
          title: "Wrong Data!",
          detail: "Wrong email or password!",
        },
      ],
    });
  }
};
