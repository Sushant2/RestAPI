const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checek-auth");
// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// const User = require("../models/user");
const userController = require("../controllers/user");

router.post("/signup", userController.user_create);

router.post("/login", userController.users_login);

router.delete("/:userId", checkAuth, userController.users_deleted);

module.exports = router;
