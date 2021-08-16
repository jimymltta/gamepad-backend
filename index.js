// PACKAGES IMPORTS
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// SERVER'S INITIALIZATION
const app = express();
app.use(cors());

// TODO : Database connexion

// ROUTES IMPORTS
const gamesRoute = require("./Routes/games");
app.use(gamesRoute);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to RAWG API! 🎮" });
});

// UNDEFINED ROUTES MANAGEMENT
app.all("*", (req, res) => {
  res.status(400).json({ message: "Page not found" });
});

// LISTEN TO A PORT (4000)
app.listen(4000, () => {
  console.log("⚡️ Server started! ⚡️");
});
