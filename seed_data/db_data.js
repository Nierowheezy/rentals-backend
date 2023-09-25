const Rental = require("../models/Rental");
const User = require("../models/User");
const Booking = require("../models/Booking");

const fakeData = require("./data.json");

class DatabaseData {
  constructor() {
    this.rentals = fakeData.rentals;
    this.users = fakeData.users;
  }

  async cleanDb() {
    await User.remove({});
    await Rental.remove({});
    await Booking.remove({});
  }

  pushDataToDb() {
    const newUser1 = new User(this.users[0]);
    const newUser2 = new User(this.users[1]);

    this.rentals.forEach((rental) => {
      const newRental = new Rental(rental);
      newRental.user = newUser1;

      newUser1.rentals.push(newRental);

      //save data to db
      newRental.save();
      // setTimeout(() => {

      // }, 3000);
    });
    newUser1.save();
    newUser2.save();
  }

  async seedDB() {
    await this.cleanDb();
    this.pushDataToDb();
  }
}

module.exports = DatabaseData;
