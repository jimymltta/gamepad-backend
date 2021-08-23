const mongoose = require("mongoose");

const Review = mongoose.model("Review", {
  writer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  game: String,
  title: String,
  text: String,
});

module.exports = Review;
