const mongoose = require('mongoose');
const User = require('../models/usermodel');
const UserProfile = require('../models/userprofilemodel');
const bcrypt = require('bcrypt');
const tokenService = require('../jwt/token.service');

class UserService {
    async signup(name, email, password) {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error('User with this email already exists.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        return await User.create({ name, email, password: hashedPassword });
    }

    async loginUser(email, password) {
        const user = await User.findOne({ email }).select('+password');

        if (!user) throw new Error('User not found.');
        if (!user.isActive) throw new Error('User account is inactive.');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Invalid password.');

        const token = tokenService.generateToken({
            id: user._id,
            email: user.email,
            isActive: user.isActive
        });

        const userData = user.toObject();
        delete userData.password;

        return { user: userData, token };
    }

    async getAllUsers() {
        return await User.find({ isActive: true }, { password: 0 });
    }

    async addUserProfile(userId, profileData) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID');
        }

        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        const existingProfile = await UserProfile.findOne({
            user: userId,
            isDeleted: { $ne: true }
        });

        if (existingProfile) {
            throw new Error('User profile already exists');
        }

        return await UserProfile.create({
            user: userId,
            age: profileData.age,
            dob: profileData.dob,
            bio: profileData.bio
        });
    }
}

module.exports = new UserService();
