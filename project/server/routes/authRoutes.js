const express = require("express");
const router = express.Router();
const { registerUser, upload } = require("../controllers/authController");

router.post("/register", upload, registerUser);

module.exports = router;
// Add this to your server route (authRoutes.js)
router.post("/register", (req, res, next) => {
    console.log("Request received at /register");
    next();
  }, upload, registerUser);