const mongoose = require('mongoose');
require('dotenv').config();

const connectionUrl = process.env.DATABASE_URL;

module.exports = async () => {
    const response = await mongoose.connect(connectionUrl);
    console.log('Database connected!');
}