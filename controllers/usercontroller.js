
const UserService = require('../services/userservice');

class UserController {
    async signup(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({
                    message: 'Name, email, and password are required.'
                });
            }

            const user = await UserService.signup(name, email, password);

            return res.status(201).json({
                message: 'User registered successfully',
                user
            });
        } catch (error) {
            if (error.message === 'User with this email already exists.') {
                return res.status(409).json({ message: error.message });
            }

            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    message: 'Email and password are required.'
                });
            }

            const result = await UserService.loginUser(email, password);

            return res.status(200).json({
                message: 'Login successful',
                user: result.user,
                token: result.token
            });
        } catch (error) {
            if (error.message === 'User not found.') {
                return res.status(404).json({ message: error.message });
            }

            if (error.message === 'Invalid password.') {
                return res.status(401).json({ message: error.message });
            }

            if (error.message === 'User account is inactive.') {
                return res.status(403).json({ message: error.message });
            }

            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            return res.status(200).json({
                message: 'Users retrieved successfully',
                users
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async addUserProfile(req, res) {
        try {
            const { userId } = req.params;
            const profile = await UserService.addUserProfile(userId, req.body);

            return res.status(201).json({
                message: 'User profile created successfully',
                profile
            });
        } catch (error) {
            if (error.message === 'Invalid user ID') {
                return res.status(400).json({ message: error.message });
            }

            if (error.message === 'User not found') {
                return res.status(404).json({ message: error.message });
            }

            if (error.message === 'User profile already exists') {
                return res.status(409).json({ message: error.message });
            }

            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new UserController();
