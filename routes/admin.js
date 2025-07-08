const express = require('express');
const mongoose = require('mongoose');
const { User } = require('../models/user');
const router = express();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Joi = require('joi')


router.get('/me', [auth, admin], async (req, res) => {
    const user = await User.findById(req.user._id).select('-password -refreshToken');
    res.send(user);
})

router.get('/', [auth, admin], async (req, res) => {
    const user = await User.find().select('-password -refreshToken');
    res.send(user);
})

router.put('/:id', [auth, admin], async(req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findById(req.params.id);
    if(!user) return res.status(400).send("No such user present");
    
    const updatable = ['isVerified', 'isActive', 'role'];
    const hasValidField = updatable.some(field => field in req.body);
  
    if (!hasValidField) {
      return res.status(400).send("Body must include at least one valid field: isVerified, isActive, or role");
    }
  
    if ('isVerified' in req.body) user.isVerified = req.body.isVerified;
    if ('isActive' in req.body) user.isActive = req.body.isActive;
    if ('role' in req.body) user.role = req.body.role;
  

    user = await user.save();
    res.send("Update Successful")
})

router.delete("/:id", [auth, admin], async (req, res) => {

    let user = await User.findByIdAndDelete(req.params.id);
    if(!user) return res.status(400).send("No such user present");

    res.send("Deleted successfully");

})

function validate(req) {
    const schema = Joi.object({
        isVerified: Joi.boolean(),
        isActive: Joi.string(),
        role: Joi.string().valid('user', 'admin')
    }) // At least one field must be present
    
    return schema.validate(req);
}

module.exports = router;