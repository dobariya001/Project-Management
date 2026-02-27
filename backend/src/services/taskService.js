const Task = require('../models/Task');
const Project = require('../models/Project');

const createTask = async (taskData, userId) => {
    const { projectId } = taskData;
    const projectExists = await Project.findOne({ _id: projectId, owner: userId });
    if (!projectExists) throw new Error('Project not found or access denied');

    return await Task.create(taskData);
};

const getTasksByProject = async (projectId, userId) => {
    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project) throw new Error('Project not found or access denied');

    return await Task.find({ projectId }).sort({ createdAt: -1 });
};

const updateTask = async (taskId, updateData) => {
    const task = await Task.findByIdAndUpdate(taskId, updateData, { new: true });
    if (!task) throw new Error('Task not found');
    return task;
};

const deleteTask = async (taskId) => {
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) throw new Error('Task not found');
    return true;
};

module.exports = {
    createTask,
    getTasksByProject,
    updateTask,
    deleteTask
};
