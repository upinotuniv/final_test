const express = require("express");
const router = express.Router();
const user = require("../controllers/user");

router.post("/sign-up", user.Register);
router.post("/sign-in", user.Login);
router.get("/logout", user.Logout);

module.exports = router;
