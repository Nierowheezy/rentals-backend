const Rental = require("../models/Rental");
const User = require("../models/User");

class DatabaseData {
  constructor() {
    this.rentals = [
      {
        title: "Nice view on ocean",
        city: "San Francisco",
        street: "Main street",
        category: "condo",
        image:
          "https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/5/image.jpeg",
        bedrooms: 4,
        shared: true,
        description: "Very nice apartment in center of the city.",
        dailyRate: 43,
      },
      {
        title: "Modern apartment in center",
        city: "New York",
        street: "Time Square",
        category: "apartment",
        image:
          "https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/5/image.jpeg",
        bedrooms: 1,
        shared: false,
        description: "Very nice apartment in center of the city.",
        dailyRate: 11,
      },
      {
        title: "Old house in nature",
        city: "Spisska Nova Ves",
        street: "Banicka 1",
        category: "house",
        image:
          "https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/5/image.jpeg",
        bedrooms: 5,
        shared: true,
        description: "Very nice apartment in center of the city.",
        dailyRate: 23,
      },
    ];

    this.users = [
      {
        username: "user1",
        email: "user1@gmail.com",
        password: "111111",
      },
      {
        username: "user2",
        email: "user2@gmail.com",
        password: "111111",
      },
    ];
  }

  async cleanDb() {
    await User.remove({});
    await Rental.remove({});
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
