const express = require('express');
const router = express();
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user');
const config = require('config');

router.post('/', auth,  async (req,res) => {
    let user = await User.findById(req.user._id);

    const { error } = validate(req.body);
    if(!error)  return res.status(400).send(error.details[0].message);

    const token = req.header('x-auth-resetToken');
    if(!token) return res.status(400).send("Provide Token or token Expired");

    const validateToken = await bcrypt.compare(token, user.resetPasswordToken);
    if(!validateToken) return res.status(400).send("Invalid Token");

    user.password = req.body.password;

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    user.resetPasswordToken = null;

    await user.save();

    res.send("Password changed successfully");
    
})

module.exports = router;