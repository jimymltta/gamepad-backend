// EXPRESS & ROUTER INITIALIZATION
const express = require("express");
const router = express.Router();

// MODELS AND MIDDLEWARES
const isAuthenticated = require("../middlewares/isAuthenticated");
const User = require("../models/User");
const Review = require("../models/Review");

// ROUTE 1 => ADD A REVIEW
router.post("/game/addReview", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ token: req.fields.token });
    let game = 0;
    for (let i = 0; i < user.reviews.length; i++) {
      if (user.reviews[i] === req.fields.game_id) {
        game++;
        break;
      }
    }
    if (game === 0) {
      user.reviews.push(req.fields.game_id);
      await user.save();
      const newReview = new Review({
        writer: user,
        game: req.fields.game_id,
        title: req.fields.title,
        text: req.fields.text,
      });
      await newReview.save();
      res.json(newReview);
    } else {
      res.status(409).json({
        message: "You can't post a review on a game you already reviewed",
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ROUTE 2 => DELETE A REVIEW
router.post("/game/deleteReview", isAuthenticated, (req, res) => {
  try {
    await Review.findByIdAndDelete(req.fields.id);
    res.status(200).json({ message: "Review succesfully deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
