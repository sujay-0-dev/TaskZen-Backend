import { useState, useCallback } from 'react';
import { tasksAPI } from '../api/tasks';

export const useTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTasks = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await tasksAPI.getAll(params);
            setTasks(data.data);
            setPagination(data.pagination);
        } catch (err) {
            setError(err.message || 'Failed to load tasks');
        } finally {
            setLoading(false);
        }
    }, []);

    const createTask = useCallback(async (taskData) => {
        const { data } = await tasksAPI.create(taskData);
        return data.data;
    }, []);

    const updateTask = useCallback(async (id, taskData) => {
        const { data } = await tasksAPI.update(id, taskData);
        return data.data;
    }, []);

    const deleteTask = useCallback(async (id) => {
        await tasksAPI.delete(id);
    }, []);

    return {
        tasks,
        pagination,
        loading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
    };
};
