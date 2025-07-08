const express = require('express');
const { User } = require('../models/user');
const router = express();
const bcrypt = require('bcrypt')
const auth = require('../middleware/auth');
const Joi = require('joi');


router.put('/', auth, async (req, res) => {
    const { error } = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findById(req.user._id);
    if(!user) return res.status(400).send("No Such user present");

    if(user.password) user.password = req.body.password;
    else return res.status(400).send("Please enter the password")

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    res.send("Password Changed Successfully");
})

function validate(req){
    const schema = Joi.object({
        password: Joi.string().min(6).max(1024).required()
    })

    return schema.validate(req);
}

module.exports = router;