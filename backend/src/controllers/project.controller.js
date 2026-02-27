const projectService = require('../services/projectService');

const createProject = async (req, res) => {
  try {
    const project = await projectService.createProject(req.body, req.user.id);
    res.status(201).json({ status: true, data: project });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const result = await projectService.getAllProjects(req.user.id, req.query);
    res.status(200).json({
      status: true,
      data: result.projects,
      totalPages: result.totalPages,
      currentPage: req.query.page || 1,
      totalProjects: result.totalProjects
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id, req.user.id);
    res.status(200).json({ status: true, data: project });
  } catch (error) {
    res.status(error.message === 'Project not found' ? 404 : 500).json({
      status: false,
      message: error.message
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await projectService.updateProject(req.params.id, req.user.id, req.body);
    res.status(200).json({ status: true, data: project });
  } catch (error) {
    res.status(error.message === 'Project not found' ? 404 : 500).json({
      status: false,
      message: error.message
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    await projectService.deleteProject(req.params.id, req.user.id);
    res.status(200).json({ status: true, message: 'Project and associated tasks deleted' });
  } catch (error) {
    res.status(error.message === 'Project not found' ? 404 : 500).json({
      status: false,
      message: error.message
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const stats = await projectService.getStats(req.user.id);
    res.status(200).json({ status: true, data: stats });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = { createProject, getProjects, getProjectById, updateProject, deleteProject, getDashboardStats };
