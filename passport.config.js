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
    callbackURL: process.env.BASE_URL + FACEBOOK_REDIRECT_URL,
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
