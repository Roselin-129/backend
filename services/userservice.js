const User = require('../models/usermodel');
const bcrypt = require('bcrypt');
const tokenService = require('../jwt/token.service')

class UserService {
    async signup(name, email, password) {
//         if (!name || !email || !password) {
//             res.status(400).json({ message: 'Name, email, and password are required.' });
// }   
const existingUser = await User.findOne({ email });
if (existingUser) {
            throw new Error('User with this email already exists.');
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
const user=await User.create({ name, email, password: hashedPassword });
        return user;
    }  
    async loginUser(email, password) {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new Error('User not found.');
        }   
        if (!user.isActive) {
            throw new Error('User account is inactive.');
        }
    const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid password.');
        }   
    const payload = { id: user._id,
         email: user.email,
          isActive: user.isActive,
         };
     const token=tokenService.generateToken(payload);
     const userWithoutPassword = { ...user.toObject(), password: undefined };
     delete userWithoutPassword.password;
        return { user: userWithoutPassword, token };    
    }

    
    async getAllUsers() {
        const users = await User.find({ isActive: true }, { password: 0 });
        return users;
    }

    async addUserProfile(userId, profileData) {
        if(!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID');
        }   
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const userProfile=await UserProfile.create({ user: userId,
            age: profileData.age,
            dob: profileData.dob,
            bio: profileData.bio
         });
  user.profile = userProfile._id;
        await user.save();
        return userProfile;
    }   
}

module.exports = new UserService(); 
