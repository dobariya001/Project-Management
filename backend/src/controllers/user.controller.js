const userService = require('../services/userService');

const register = async (req, res) => {
  try {
    await userService.registerUser(req.body);
    res.status(201).json({ status: true, message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await userService.loginUser(email, password);

    res.status(200).json({
      status: true,
      message: 'User logged In successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

module.exports = { register, login };
