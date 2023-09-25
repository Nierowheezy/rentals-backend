const Rental = require("../models/Rental");
const { normalizeErrors } = require("../helpers/mongoose");
const User = require("../models/User");

exports.getsecret = async (req, res) => {
  res.json({ secret: true });
};

/**
 * @desc For Get Single Rental
 * @route /api/v1/rentals/:id
 * @access Public
 */
exports.getRentalById = (req, res) => {
  const { id } = req.params;
  Rental.findById(id)
    .populate("user", "username -_id")
    .populate("bookings", "startAt endAt -_id")
    .exec(function (err, foundRental) {
      if (err) {
        res.status(404).json({
          errors: [
            {
              title: "Rental Error",
              detail: "Could not find Rental!",
            },
          ],
        });
      }
      return res.status(200).json({
        success: true,
        data: foundRental,
        message: `Rental fetched successfully`,
      });
    });
};

/**
 * @desc For Get All Rentals
 * @route /api/v1/rentals
 * @access Public
 */
exports.getAllRentals = (req, res) => {
  const { city } = req.query;

  const query = city ? { city: city.toLowerCase() } : {};

  Rental.find(query)
    .select("-bookings")
    .exec(function (err, foundRental) {
      if (err) {
        return res.status(422).json({ errors: normalizeErrors(err.errors) });
      }

      if (city && foundRental.length === 0) {
        return res.status(404).json({
          errors: [
            {
              title: "No Rentals Found!",
              detail: `There are no rentals for city ${city}`,
            },
          ],
        });
      }

      return res.json({
        success: true,
        data: foundRental,
        message: `Rental fetched successfully`,
      });
    });
};

/**
 * @desc For create a new rental
 * @route /api/v1/rentals
 * @access Public
 */
exports.createRental = async (req, res) => {
  const {
    title,
    city,
    street,
    category,
    image,
    shared,
    bedrooms,
    description,
    dailyRate,
  } = req.body;

  const user = res.locals.user;

  const newRental = new Rental({
    title,
    city,
    street,
    category,
    image,
    shared,
    bedrooms,
    description,
    dailyRate,
  });

  newRental.user = user;

  Rental.create(newRental, function (err, createdRental) {
    if (err) {
      return res.status(422).json({ errors: normalizeErrors(err.errors) });
    }

    User.update(
      { _id: user.id },
      { $push: { rentals: createdRental } },
      function () {}
    );

    return res.json(createdRental);
  });
};

/**
 * @desc For Update Task
 * @route /api/task/:id
 * @access Public
 */
exports.updateTask = async (req, res) => {};

/**
 * @desc For Delete rental
 * @route /api/v1/rentals/id
 * @access Public
 */
exports.deleteRental = async (req, res) => {
  const user = res.locals.user;

  Rental.findById(req.params.id)
    .populate("user", "_id")
    .populate({
      path: "bookings",
      select: "startAt",
      match: { startAt: { $gt: new Date() } },
    })
    .exec(function (err, foundRental) {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }

      if (!user || !foundRental || !foundRental.user) {
        return res.status(404).send({
          errors: [
            {
              title: "Invalid User!",
              detail: `user cannot be found we guess rental was deleted!`,
            },
          ],
        });
      }

      if (user.id !== foundRental.user.id) {
        return res.status(404).send({
          errors: [
            {
              title: "Invalid User!",
              detail: `You don't own this rental!`,
            },
          ],
        });
      }

      if (foundRental.bookings.length > 0) {
        return res.status(404).send({
          errors: [
            {
              title: "You have active bookings!",
              detail: `cannot delete rental with active bookings!`,
            },
          ],
        });
      }

      foundRental.remove(err, function () {
        if (err)
          return res.status(422).json({ errors: normalizeErrors(err.errors) });
      });

      res.json({ status: "rental deleted successfully" });
    });
};

/**
 * @desc For Delete rental
 * @route /api/v1/rentals/manage
 * @access Public
 */

exports.manageRental = async (req, res) => {
  const user = res.locals.user;

  Rental.where({ user })
    .populate("bookings")
    .exec(function (err, foundRentals) {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }

      return res.json(foundRentals);
    });
};
