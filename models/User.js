const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    min: [4, , "Too short, min is 4 characters"],
    max: [32, "Too long, max is 32 characters"],
  },
  email: {
    type: String,
    min: [4, , "Too short, min is 4 characters"],
    max: [32, "Too long, max is 32 characters"],
    unique: true,
    lowercase: true,
    required: "Email is required",
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
  },
  password: {
    type: String,
    min: [4, , "Too short, min is 4 characters"],
    max: [32, "Too long, max is 32 characters"],
    required: "Password is required",
  },
  rentals: [{ type: Schema.Types.ObjectId, ref: "Rental" }],
  bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
  createdAt: { type: Date, default: Date.now },
});

userSchema.methods.existingPassword = function (requestPassword) {
  return bcrypt.compareSync(requestPassword, this.password);
};

//hash password with bcrypt

userSchema.pre("save", function (next) {
  const user = this;
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(user.password, salt, function (err, hashedPassword) {
      user.password = hashedPassword;
      next();
    });
  });
});

const User = mongoose.model("User", userSchema);

module.exports = User;
