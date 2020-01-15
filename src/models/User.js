const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const userSchema = new Schema({
    'email': {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    'password': {
        type: String,
        required: true
    },
    'role': {
        type: String,
        default: 'basic',
        enum: ["basic", "supervisor", "admin"]
    },
    accessToken: {
        type: String
    }
});

const User = mongoose.model('user', userSchema);

module.exports = User;