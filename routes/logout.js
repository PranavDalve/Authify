const express = require('express');
const refreshtoken = require('../middleware/refreshtoken');
const router = express();
const mongoose = require('mongoose');
const { User } = require('../models/user');

router.post('/', refreshtoken, async (req, res) => {
    const user = await User.findById(req.user._id);
    if(!user) return res.status(400).send('Invalid User.');

    user.refreshToken = null;
    await user.save()

    res.send("User successfully logged out")
})

module.exports = router;