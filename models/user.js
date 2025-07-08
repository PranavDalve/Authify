const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');


const userschema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50
    },

    email:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
        maxLength: 1024
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    isActive:{
        type: String,
        default: true
    },
    refreshToken: {
        type: String
    },
    resetPasswordToken:{
        type: String
    },
    resetPasswordExpires:{
        type: Date
    }
}, {timestamps: true})

userschema.methods.generateAccessToken = function(){
    const token = jwt.sign({_id: this._id}, config.get('jwtPrivateKey'), {expiresIn: '15m'});
    return token;
}

userschema.methods.generateRefreshToken = function(){
    const token = jwt.sign({_id: this._id}, config.get('jwtPrivateKey'), {expiresIn: '7d'});
    return token;
}

const User = new mongoose.model('User', userschema);

function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(1024).required(),
        role: Joi.string(),
        isVerified: Joi.boolean(),
        isActive: Joi.string(),
        refreshToken: Joi.string(),
        resetPasswordToken: Joi.string(),
        resetPasswordExpires: Joi.string()
    })

    return schema.validate(user)
}

module.exports.User = User;
exports.validate = validateUser;