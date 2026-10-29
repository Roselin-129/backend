const express = require('express');
const router = express.Router();
const UserController = require('../controllers/usercontroller');

router.post('/signup', (req, res) =>
    UserController.signup(req, res)
);

router.post('/login', (req, res) =>
    UserController.login(req, res)
);

module.exports = router;