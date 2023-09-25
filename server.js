const app = require("./app");

const connectDB = require("./config/db");
connectDB();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("API is running good");
});

app.listen(PORT, console.log(`Server is running on port ${PORT}`.yellow.bold));
