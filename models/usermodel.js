const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // profile: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'UserProfile'
    // }
},
{
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);