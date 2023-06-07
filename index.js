const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const userRoutes = require("./src/routes/user");
const studentRoutes = require("./src/routes/student");
require("dotenv").config();
const app = express();
const port = 5000;

// app use
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use("/", userRoutes);
app.use("/", studentRoutes);

// app set
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// render page
app.get("/", (req, res) => {
  res.render("pages/");
});

// server
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});

module.exports = app;
