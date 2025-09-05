const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        min: 3,
        max: 100
    },
    firstName: {
        type: String,
        require: true,
        trim: true,
        min: 3,
        max: 100
    },
    lastName: {
        type: String,
        require: true,
        trim: true,
        min: 10,
        max: 10
    },
    phone: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        min: 3,
        max: 100
    },
    email: {
        type: String,
        unique: true,
        require: true,
        trim: true,
    },
    password: {
        type: String,
        require: true,
        trim: true,
        min: 6,
    },
    role: {
        type: String,
        enum: ['user', 'driver', 'admin', 'employee'],
        default: 'user'
    }
}, {
    timestamps: true
});
const userModel = mongoose.model('User', userSchema);
module.exports = userModel;