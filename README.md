# Node-Passport-JWT-Authentication
Authentication using passport and jwt in node for SPA

## Project directory structure
```bash
├── app.js
├── controllers
│   └── authController.js
├── database
│   ├── conection.js
│   └── model
│       └── User.js
├── middleware
│   └── authMiddleware.js
├── package.json
├── package-lock.json
├── passport.config.js
├── README.md
├── routes
│   ├── auth.js
│   └── user.js
├── util
│   └── jwt.js
└── views
    └── index.ejs
```

## Passport Config (passport.config.js)
> Main part responsible for OAuth2

```js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('./database/model/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.BASE_URL + process.env.GOOGLE_REDIRECT_URL,
    passReqToCallback: true
}, async (request, accessToken, refreshToken, profile, done) => {
    try {
        // need to check user details and store if needed
        if (!profile._json.email) {
            done(null, false);
        }
        
        let user = await User.findOne({email: profile._json.email});
        if (!user) {
            user = await User.create({
                firstname: profile._json.given_name,
                lastname: profile._json.family_name,
                email: profile._json.email,
            });
        }

        // pass data
        done(null, profile);
    } catch (error) {
        done(null, null);
    }
}));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.BASE_URL + process.env.FACEBOOK_REDIRECT_URL,
    profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)','email'],
    passReqToCallback: true
}, async (request, token, refreshToken, profile, done) => {
    try {
        // need to check user details and store if needed
        if (!profile._json.email) {
            done(null, false);
        }
        
        let user = await User.findOne({email: profile._json.email});
        if (!user) {
            user = await User.create({
                firstname: profile._json.given_name,
                lastname: profile._json.family_name,
                email: profile._json.email,
            });
        }

        // pass data
        done(null, profile);
    } catch (error) {
        done(null, null);
    }
}));

```


### app.js
Entry point of application

```js
const express = require('express');
const authRoute = require('./routes/auth');
...
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
require('./passport.config');
...
app.use(authRoute);
app.use('/', authMiddleware, userRoute);

connectDb().then(() => {
    app.listen('3000');
    console.log('server start');
});
```

### auth route (routes/auth.js)

```js
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
```

### Auth controller (controllers/authController.js)

```js
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
```
> one is for google login an another is for facebook login

### Auth middleware (middleware/authMiddleware)
>this middleware will check if requst has any authorise token (jwt) and if exist then parse user details from token and add it in request

```js
const { getToken } = require('../util/jwt');

const isAuth = (req, res, next) => {
    try {
        const beararHeader = req.headers['authorization'];
        if (!beararHeader) throw new Error('Token required');

        const token = beararHeader.split(' ')[1];

        const decode = getToken(token);
        
        if (decode) {
            req.user = decode;
            next();
        }
    } catch (error) {
        return res.status(403).json({
            status: false,
            message: error.message
        });
    }
}

module.exports = isAuth;
```

### JWt functionality (util/jwt.js)

```js
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
```
