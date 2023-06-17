const passport = require('passport');
const Router = require('express').Router();
const authController = require('../controllers/authController');

Router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

Router.use('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/failed' }), authController.googleLogin);

Router.get('/failed', (req, res, next) => {
    res.json({
        status: false,
        message: 'Authentication failed'
    });
})

module.exports = Router;