const express = require("express");
const bodyParser = require("body-parser");
const searchRouter = require("./routes/searchRoutes");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use("/search", searchRouter);

app.get("/", (req, res) => {
  res.send("Hello!");
});

module.exports = app;
