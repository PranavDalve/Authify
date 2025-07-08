const express = require('express');
const router = express();
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const config = require('config');

router.post('/', auth, async (req, res) => {
    user = await User.findById(req.user._id);
    const token = jwt.sign({_id: user._id},config.get('jwtPrivateKey'), {expiresIn: '5m'});

    const salt = await bcrypt.genSalt(10);
    const resetPasswordToken = await bcrypt.hash(token, salt);  

    user.resetPasswordToken = resetPasswordToken;
    await user.save();

    res.send(token);
    
})

module.exports = router;