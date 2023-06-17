const express = require('express');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const connectDb = require('./database/conection');
const authMiddleware = require('./middleware/authMiddleware');
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
require('./passport.config');

app.get('/', (req, res, next) => {
    res.render('index');
});
app.use(authRoute);
app.use('/', authMiddleware, userRoute);

connectDb().then(() => {
    app.listen('3000');
    console.log('server start');
});