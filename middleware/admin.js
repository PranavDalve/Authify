const { User } = require("../models/user")

module.exports = async function admin(req, res, next){
    const user = await User.findById(req.user._id);

    if(user.role === "admin") return next();

    else{
        return res.status(400).send("Access Denied. Admin Only"); 
    }

}