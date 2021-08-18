const mongoose = require("mongoose");

const Review = mongoose.model("Review", {
  writer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: String,
  text: String,
});

module.exports = Review;
