const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');


module.exports =  async function refreshToken ( req, res, next ){

    const token = req.header('x-auth-refresh');
    if(!token) return res.status(400).send("Access Denied, Token required");

    let decoded;
    try {
    decoded = jwt.verify(token, config.get("jwtPrivateKey"));

    const user = await User.findById(decoded._id);
    if(!user) return res.status(400).send('Invalid User.');

    const validToken = await bcrypt.compare(token, user.refreshToken);
    if(!validToken) return res.status(400).send("Access Denied, Incorrect Token or Expired Token");

    req.user = decoded;
    req.refreshToken = token;
    next();
    
    } catch (err) {
    return res.status(401).send('Refresh token invalid or expired.');
    }

}