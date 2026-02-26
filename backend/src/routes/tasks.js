const express = require('express');
const router = express.Router();
const {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    taskValidation,
    updateTaskValidation,
    validate,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

// All task routes are protected
router.use(protect);

router.route('/').get(getTasks).post(taskValidation, validate, createTask);

router.route('/:id').get(getTask).put(updateTaskValidation, validate, updateTask).delete(deleteTask);

module.exports = router;
