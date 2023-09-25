const Booking = require("../models/Booking");
const Rental = require("../models/Rental");
const { normalizeErrors } = require("../helpers/mongoose");
const moment = require("moment");
const User = require("../models/User");

/*
 *
 * @desc For create a booking
 * @route /api/v1/bookings
 * @access Public
 */
exports.createBooking = function (req, res) {
  const { startAt, endAt, totalPrice, guests, days, rental } = req.body;
  const user = res.locals.user;

  const booking = new Booking({ startAt, endAt, totalPrice, guests, days });

  Rental.findById(rental._id)
    .populate("bookings")
    .populate("user")
    .exec(function (err, foundRental) {
      if (err) {
        return res.status(422).json({ errors: normalizeErrors(err.errors) });
      }

      if (foundRental.user.id === user.id) {
        return res.status(400).json({
          errors: [
            {
              title: "Invalid User!",
              detail: "Cannot create a booking on your rental!",
            },
          ],
        });
      }

      if (isValidBooking(booking, foundRental)) {
        booking.user = user;
        booking.rental = foundRental;
        foundRental.bookings.push(booking);

        booking.save(function (err) {
          if (err) {
            return res
              .status(422)
              .json({ errors: normalizeErrors(err.errors) });
          }
          foundRental.save();
          User.update(
            { _id: user.id },
            { $push: { bookings: booking } },
            function () {}
          );

          return res.json({ startAt: booking.startAt, endAt: booking.endAt });
        });

        //update rental and user
      } else {
        return res.status(400).json({
          errors: [
            {
              title: "Invalid Booking!",
              detail: "Choosen dates are already taken!",
            },
          ],
        });
      }
    });
};

function isValidBooking(propsedBooking, rental) {
  let isValid = true;
  if (rental.bookings && rental.bookings.length > 0) {
    isValid = rental.bookings.every(function (booking) {
      const propsedStart = moment(propsedBooking.startAt);
      const propsedEnd = moment(propsedBooking.endAt);

      const actualStart = moment(booking.startAt);
      const actualEnd = moment(booking.endAt);

      if (
        (actualStart < propsedStart && actualEnd < propsedStart) ||
        (propsedEnd < actualEnd && propsedEnd < actualStart)
      ) {
        return true;
      } else {
        return false;
      }
    });
  }
  return isValid;
}

/**
 * @desc For manage bookings
 * @route /api/v1/bookings/manage
 * @access Public
 */

exports.manageBookings = async (req, res) => {
  const user = res.locals.user;

  Booking.where({ user })
    .populate("rental")
    .exec(function (err, foundBookings) {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }

      return res.json(foundBookings);
    });
};
