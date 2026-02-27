const express = require('express');
const { register, login } = require('../controllers/user.controller');
const { registerValidation, loginValidation } = require('../../middleware/validation');
const userRoute = express.Router();

userRoute.post('/register', registerValidation, register);
userRoute.post('/login', loginValidation, login);

module.exports = userRoute;

