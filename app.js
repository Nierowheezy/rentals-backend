const express = require("express");
const morgan = require("morgan");
const colors = require("colors");
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
require("dotenv/config");
const rentalRoutes = require("./routes/rentals"),
  bookingRoutes = require("./routes/bookings");
userRoutes = require("./routes/users");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

// dotenv.config({ path: './config.env' }); // if you want to use  config.env file
// // dotenv.config(); if you want to use .env file use this to configure or use the above

require("colors");

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// app.use(express.static(`${__dirname}/public`));

app.use(express.json());
app.use(compression());
app.use(helmet());
app.use(express.json());
//TODO: tighten cors
app.use(cors({ origin: "*" }));

// app.use(
//   "/reference",
//   swaggerUi.serve,
//   swaggerUi.setup(YAML.load(process.cwd() + "/docs/swagger.yml"))
// );

app.use(
  "/reference",
  swaggerUi.serve,
  swaggerUi.setup(YAML.load(`${__dirname}/docs/swagger.yml`))
);

// app.use((req, res, next) => {
//   console.log('Hello from the middleware 👋');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
//routes
app.use("/api/v1/rentals", rentalRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/users", userRoutes);

app.get("/api/v1/test", (req, res) => {
  res.send("API is running good");
});

module.exports = app;
