const jwt = require("jsonwebtoken");
require('dotenv').config();
const secret = process.env.JWT_SECRET;

const createToken = (payload, expTime) => {
    const token = jwt.sign(
        { ...payload },
        secret,
        { expiresIn: expTime }
    );

    return token;
}

const getToken = (token) => {
    let result = ''
    try {
        result = jwt.verify(token, secret);
        return result;
    } catch (error) {
        throw error
    }
}

exports.createToken = createToken;
exports.getToken = getToken;