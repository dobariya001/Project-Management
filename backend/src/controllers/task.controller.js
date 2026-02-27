const taskService = require('../services/taskService');

const createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.body, req.user.id);
    res.status(201).json({ status: true, data: task });
  } catch (error) {
    res.status(error.message.includes('not found') ? 403 : 500).json({
      status: false,
      message: error.message
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getTasksByProject(req.params.projectId, req.user.id);
    res.status(200).json({ status: true, data: tasks });
  } catch (error) {
    res.status(error.message.includes('not found') ? 403 : 500).json({
      status: false,
      message: error.message
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body);
    res.status(200).json({ status: true, data: task });
  } catch (error) {
    res.status(error.message === 'Task not found' ? 404 : 500).json({
      status: false,
      message: error.message
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    await taskService.deleteTask(req.params.id);
    res.status(200).json({ status: true, message: 'Task deleted' });
  } catch (error) {
    res.status(error.message === 'Task not found' ? 404 : 500).json({
      status: false,
      message: error.message
    });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
