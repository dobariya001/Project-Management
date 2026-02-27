const Project = require('../models/Project');
const Task = require('../models/Task');

const createProject = async (projectData, userId) => {
    return await Project.create({
        ...projectData,
        owner: userId,
    });
};

const getAllProjects = async (userId, queryParams) => {
    const { page = 1, limit = 9, search = '', status } = queryParams;
    const query = { owner: userId };

    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }

    if (status) {
        query.status = status;
    }

    const projects = await Project.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    const count = await Project.countDocuments(query);

    return {
        projects,
        totalPages: Math.ceil(count / limit),
        totalProjects: count
    };
};

const getProjectById = async (projectId, userId) => {
    const project = await Project.findOne({ _id: projectId, owner: userId });
    if (!project) throw new Error('Project not found');
    return project;
};

const updateProject = async (projectId, userId, updateData) => {
    const project = await Project.findOneAndUpdate(
        { _id: projectId, owner: userId },
        updateData,
        { new: true }
    );
    if (!project) throw new Error('Project not found');
    return project;
};

const deleteProject = async (projectId, userId) => {
    const project = await Project.findOneAndDelete({ _id: projectId, owner: userId });
    if (!project) throw new Error('Project not found');

    await Task.deleteMany({ projectId });
    return true;
};

const getStats = async (userId) => {
    const projectCount = await Project.countDocuments({ owner: userId });
    const projects = await Project.find({ owner: userId }, '_id');
    const projectIds = projects.map(p => p._id);
    const taskCount = await Task.countDocuments({ projectId: { $in: projectIds } });

    return {
        totalProjects: projectCount,
        totalTasks: taskCount
    };
};

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    getStats
};
