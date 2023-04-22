const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const Admin = require("../models/Admin");
const router = express.Router();
require('express-async-errors')
const { currentUser, requireAdmin } = require('../middleware/middlewares')




// Register a new user
router.post("/register", async (req, res) => {
    // Hash the password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    const user = new Admin({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword//`${hashedPassword}.${salt}`,
    });


    await user.save();
    // Create and assign a token
    req.session.token = jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET);
    res.send({ id: user._id, name: user.name, email: user.email });


});

// Login
router.post("/login", async (req, res) => {
    // Find the user
    const user = await Admin.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Email or password is wrong");

    // Check the password
    const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if (!validPassword) return res.status(400).send("Email or password is wrong");

    // Create and assign a token
    req.session.token = jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET);
    res.send({ id: user._id, name: user.name, email: user.email });
});
router.get("/user", currentUser, (req, res) => {
    res.send({ admin: req.admin || null });
});
router.get("/logout", (req, res) => {
    req.session = null;
    res.send("Logged Out");
});

module.exports = router