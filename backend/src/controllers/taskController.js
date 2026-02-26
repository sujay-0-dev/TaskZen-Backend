const { body, query } = require('express-validator');
const Task = require('../models/Task');
const { validate } = require('../middleware/validate');

// Validation rules
const taskValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Title must be 2-100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description cannot exceed 1000 characters'),
    body('status')
        .optional()
        .isIn(['todo', 'in-progress', 'done'])
        .withMessage('Status must be: todo, in-progress, or done'),
];

const updateTaskValidation = [
    body('title')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Title cannot be empty')
        .isLength({ min: 2, max: 100 })
        .withMessage('Title must be 2-100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description cannot exceed 1000 characters'),
    body('status')
        .optional()
        .isIn(['todo', 'in-progress', 'done'])
        .withMessage('Status must be: todo, in-progress, or done'),
];

// @desc    Get all tasks for current user (with pagination, filter, search)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
        const skip = (page - 1) * limit;

        // Build query filters
        const filter = { userId: req.user._id };

        if (req.query.status && ['todo', 'in-progress', 'done'].includes(req.query.status)) {
            filter.status = req.query.status;
        }

        if (req.query.search && req.query.search.trim()) {
            filter.title = { $regex: req.query.search.trim(), $options: 'i' };
        }

        const [tasks, total] = await Promise.all([
            Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Task.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            data: tasks,
            pagination: {
                currentPage: page,
                totalPages,
                totalTasks: total,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found.' });
        }

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
    try {
        const { title, description, status } = req.body;

        const task = await Task.create({
            title,
            description,
            status: status || 'todo',
            userId: req.user._id,
        });

        res.status(201).json({ success: true, data: task, message: 'Task created successfully.' });
    } catch (error) {
        next(error);
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
    try {
        const { title, description, status } = req.body;

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { title, description, status },
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found.' });
        }

        res.status(200).json({ success: true, data: task, message: 'Task updated successfully.' });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found.' });
        }

        res.status(200).json({ success: true, message: 'Task deleted successfully.' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    taskValidation,
    updateTaskValidation,
    validate,
};
