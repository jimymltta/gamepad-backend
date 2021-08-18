// EXPRESS CALL AND ROUTERS INITIALIZATION
const express = require("express");
const router = express.Router();
// PACKAGES IMPORTS
const axios = require("axios");

// ROUTE 1 => GET A LIST OF RECENT GAMES
router.get("/games", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.rawg.io/api/games?key=${process.env.API_KEY}&search=${req.query.search}&page=${req.query.page}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ROUTE 2 => GET A GAME INFOS BASED ON ID
router.get("/games/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.rawg.io/api/games/${req.params.id}?key=${process.env.API_KEY}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
