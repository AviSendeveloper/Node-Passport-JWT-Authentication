const Router = require('express').Router();
const User = require('../database/model/User');

Router.get('/user', async (req, res, next) => {
    const users = await User.find();
    return res.status(200).json({
        status: true,
        data: users
    });
})

module.exports = Router;