// EXPRESS & ROUTER INITIALIZATION
const express = require("express");
const router = express.Router();

// MODELS AND MIDDLEWARES
const isAuthenticated = require("../middlewares/isAuthenticated");
const User = require("../models/User");
const Review = require("../models/Review");

router.post("/game/addReview", async (req, res) => {
  try {
    const newReview = new Review({
      writer: req.user,
      title: req.fields.title,
      text: req.fields.text,
    });

    if (title && text) {
      await newReview.save();
      res.status(200).json(req.user);
    } else {
      res.status(400).json({ message: "Title and text are required" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
