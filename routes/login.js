const jwt = require('jsonwebtoken');
const Joi = require('joi');
const express = require('express');
const router = express();
const { User } = require('../models/user');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid User.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send("Incorrect Password");

    const accessToken = user.generateAccessToken();
    let refreshToken = user.generateRefreshToken();

    res.send({
        message: "Login Successful",
        accessToken: accessToken,
        refreshToken: refreshToken
    });

    const salt = await bcrypt.genSalt(10);
    refreshToken = await bcrypt.hash(refreshToken, salt);

    user.refreshToken = refreshToken;

    user = await user.save()
})

function validate(req){
    const schema = Joi.object({
        email: Joi.string().min(5).max(225).required().email(),
        password: Joi.string().min(6).max(1024).required()
    })

    return schema.validate(req);
}


module.exports = router;