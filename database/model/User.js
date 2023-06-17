const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        require: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String
    }
}, { timestamps: true });

module.exports = model('users', userSchema);