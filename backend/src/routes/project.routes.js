const express = require('express');
const projectRoute = express.Router();
const { createProject, getProjects, getProjectById, updateProject, deleteProject, getDashboardStats } = require('../controllers/project.controller');
const verifyToken = require('../../middleware/jwt');
const { projectValidation } = require('../../middleware/validation');

projectRoute.post('/create', verifyToken, projectValidation, createProject);
projectRoute.get('/getAll', verifyToken, getProjects);
projectRoute.get('/stats', verifyToken, getDashboardStats);
projectRoute.get('/get/:id', verifyToken, getProjectById);
projectRoute.put('/update/:id', verifyToken, projectValidation, updateProject);
projectRoute.delete('/delete/:id', verifyToken, deleteProject);


module.exports = projectRoute;

