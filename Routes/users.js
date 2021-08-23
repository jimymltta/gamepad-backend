// EXPRESS CALL AND ROUTERS INITIALIZATION
const express = require("express");
const router = express.Router();
// PACKAGES IMPORTS
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

// MODEL IMPORT
const User = require("../models/User");
const isAuthenticated = require("../middlewares/isAuthenticated");

// ROUTE 1 => SIGN UP
router.post("/user/signup", async (req, res) => {
  try {
    // Verifying if the email doesn't already exists in the DB
    const user = await User.findOne({ email: req.fields.email });

    if (!user) {
      // PASSWORD MANAGEMENT
      // SALT GENERATION
      const salt = uid2(64);
      console.log("SALT ==>", salt);

      // HASH GENERATION
      const hash = SHA256(req.fields.password + salt).toString(encBase64);
      console.log("HASH ==>", hash);

      // TOKEN GENERATION
      const token = uid(64);
      console.log("TOKEN ==>", token);

      // USER CREATION
      const newUser = new User({
        email: req.fields.email,
        account: {
          username: req.fields.username,
        },
        token: token,
        hash: hash,
        salt: salt,
      });

      // SAVE USER TO DB
      await newUser.save();

      res.status(200).json({
        _id: newUser._id,
        token: token,
        account: {
          username: req.fields.username,
        },
      });
    } else {
      res.status(409).json({ message: "This email already exists" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// ROUTE 2 => LOG IN
router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.fields.email });
    const password = req.fields.password;
    const newHash = SHA256(password + user.salt).toString(encBase64);

    if (newHash === user.hash) {
      res.status(200).json({
        _id: user._id,
        token: user.token,
        account: user.account,
      });
    } else {
      res.status(400).json({ message: "Wrong email or password" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ROUTE 3 => ADD A FAVORITE
router.post("/user/addFavorite", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ token: req.fields.token });
    if (user) {
      for (let i = 0; i < user.favs.length; i++) {
        if (user.favs[i].id === req.fiels.game.id) {
          return res
            .status(400)
            .json({ message: "This game is already in your collection" });
        }
      }
      user.favs.push(req.fields.game);
      await user.save();
      res
        .status(200)
        .json({ message: "Game succesfully added to your collection" });
    } else {
      res.status(401).json({
        message: "You need to be logged in to add a game to your collection",
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ROUTE 4 => REMOVE A FAVORITE
router.post("/user/removeFavorite", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ token: req.fields.token });
    for (let i = 0; user.favs.length; i++) {
      if (user.favs[i].id === req.fields.game.id) {
        user.favs.splice(i, 1);
      }
    }
    await user.save();
    res
      .status(200)
      .json({ message: "Game successfully deleted from your collection" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ROUTE 5 => SHOW THE COLLECTION
// router.get("/user/favs", isAuthenticated, (req, res) => {
//   try {
//     const user = await User.findOne({token: req.fields.token});

//   } catch (error) {
//     res.status(400).json({message: error.message})
//   }
// })

module.exports = router;
