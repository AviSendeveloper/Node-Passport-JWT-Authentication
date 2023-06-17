const jwt = require("jsonwebtoken");
const { createToken } = require("../util/jwt");

module.exports.googleLogin = (req, res) => {
    try {
        const user = req.user;
        const token = createToken({ id: user.id, firstname: user.given_name, lastname: user.family_name, email: user.email}, "30d");
        res.status(200).json({
            status: true,
            user: user,
            token: token
        });
    } catch (error) {
        console.log('Authentication fail');
    }
}

module.exports.facebookLogin = (req, res) => {
    try {
        const user = req.user;
        const token = createToken({ id: user.id, firstname: user.given_name, lastname: user.family_name, email: user.email}, "30d");
        res.status(200).json({
            status: true,
            user: user,
            token: token
        });
    } catch (error) {
        console.log('Authentication fail');
    }
}