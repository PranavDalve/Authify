const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function auth(req, res, next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access Denied. Token Required');

    try{
        const decoded = jwt.verify(token, config.get("jwtPrivateKey"))
        req.user = decoded;
        next();
    }
    catch (ex) {
        if (ex.name === 'TokenExpiredError') {
            return res.status(401).send('Access token expired. Please refresh your token.');
        }
        return res.status(400).send('Invalid token.');
    }
} 