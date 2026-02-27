const express = require('express');
const taskRoute = express.Router();
const verifyToken = require('../../middleware/jwt');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/task.controller');
const { createTaskValidation, updateTaskValidation } = require('../../middleware/validation');

taskRoute.post('/create', verifyToken, createTaskValidation, createTask);
taskRoute.get('/getAll/:projectId', verifyToken, getTasks);
taskRoute.put('/update/:id', verifyToken, updateTaskValidation, updateTask);
taskRoute.delete('/delete/:id', verifyToken, deleteTask);

module.exports = taskRoute;

