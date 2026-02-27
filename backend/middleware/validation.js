const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

const registerValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    validate,
];

const loginValidation = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
];

const projectValidation = [
    body('name').trim().notEmpty().withMessage('Project name is required'),
    body('status').optional().isIn(['Active', 'Completed']).withMessage('Invalid status'),
    validate,
];

const createTaskValidation = [
    body('title').trim().notEmpty().withMessage('Task title is required'),
    body('projectId').notEmpty().withMessage('Project ID is required').isMongoId().withMessage('Invalid Project ID format'),
    body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority level'),
    body('status').optional().isIn(['Pending', 'In Progress', 'Done']).withMessage('Invalid status type'),
    body('description').optional({ checkFalsy: true }).trim(),
    body('dueDate').optional({ checkFalsy: true }).isISO8601().withMessage('Invalid date format'),
    validate,
];

const updateTaskValidation = [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority level'),
    body('status').optional().isIn(['Pending', 'In Progress', 'Done']).withMessage('Invalid status type'),
    body('description').optional({ checkFalsy: true }).trim(),
    body('dueDate').optional({ checkFalsy: true }).isISO8601().withMessage('Invalid date format'),
    validate,
];

module.exports = {
    registerValidation,
    loginValidation,
    projectValidation,
    createTaskValidation,
    updateTaskValidation,
};
