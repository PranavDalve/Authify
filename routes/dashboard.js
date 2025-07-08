const express = require('express');
const router = express();
const { User } = require('../models/user');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt')
const Joi = require('joi');

router.get('/', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password -refreshToken');
    res.send(user);
});

module.exports = router;