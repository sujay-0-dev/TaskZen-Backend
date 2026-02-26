import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, AlertCircle } from 'lucide-react';

const STATUS_OPTIONS = [
    { value: 'todo', label: '📋 To Do' },
    { value: 'in-progress', label: '⚡ In Progress' },
    { value: 'done', label: '✅ Done' },
];

const TaskModal = ({ isOpen, onClose, onSubmit, task, loading }) => {
    const isEditing = !!task;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: { title: '', description: '', status: 'todo' },
    });

    useEffect(() => {
        if (isOpen) {
            reset(
                task
                    ? { title: task.title, description: task.description || '', status: task.status }
                    : { title: '', description: '', status: 'todo' }
            );
        }
    }, [isOpen, task, reset]);

    const handleFormSubmit = async (data) => {
        await onSubmit(data);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal scale-in">
                <div className="modal-header">
                    <h2 className="modal-title">{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
                    <button className="modal-close" onClick={onClose} aria-label="Close">
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="modal-body">
                        {/* Title */}
                        <div className="form-group">
                            <label className="form-label">Title *</label>
                            <input
                                className={`form-input ${errors.title ? 'error' : ''}`}
                                placeholder="Enter task title..."
                                {...register('title', {
                                    required: 'Title is required',
                                    minLength: { value: 2, message: 'Title must be at least 2 characters' },
                                    maxLength: { value: 100, message: 'Title cannot exceed 100 characters' },
                                })}
                            />
                            {errors.title && (
                                <span className="form-error">
                                    <AlertCircle size={12} /> {errors.title.message}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className={`form-textarea ${errors.description ? 'error' : ''}`}
                                placeholder="Describe the task (optional)..."
                                rows={4}
                                {...register('description', {
                                    maxLength: { value: 1000, message: 'Description cannot exceed 1000 characters' },
                                })}
                            />
                            {errors.description && (
                                <span className="form-error">
                                    <AlertCircle size={12} /> {errors.description.message}
                                </span>
                            )}
                        </div>

                        {/* Status */}
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select className="form-select" {...register('status')}>
                                {STATUS_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <><span className="spinner" /> Saving...</> : isEditing ? 'Update Task' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
