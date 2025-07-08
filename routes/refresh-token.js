const express = require('express');
const router = express();
const refreshtoken = require('../middleware/refreshtoken');
const { User } = require('../models/user');

router.post('/', refreshtoken, async (req, res) => {
    const user = await User.findById(req.user._id);
    if(!user) return res.status(400).send('Invalid User.');

    const accessToken = user.generateAccessToken();

    res.header('x-auth-token', accessToken).send(accessToken);
})

module.exports = router;