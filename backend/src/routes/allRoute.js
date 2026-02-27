const express = require('express');
const userRoute = require('./user.routes');
const projectRoute = require('./project.routes');
const taskRoute = require('./task.routes');

const router = express.Router();

const verifyToken = require('../../middleware/jwt');
const { isAdmin } = require('../../middleware/role');

router.use('/auth', userRoute);
router.use('/project', projectRoute);
router.use('/task', taskRoute);

router.get('/admin-only', verifyToken, isAdmin, (req, res) => {
    res.json({ status: true, message: 'Welcome Admin!' });
});

module.exports = router;
