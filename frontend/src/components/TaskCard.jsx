import { Clock, Edit2, Trash2, Circle } from 'lucide-react';

const STATUS_CONFIG = {
    'todo': { label: 'To Do', className: 'badge-todo', dot: '#3b82f6' },
    'in-progress': { label: 'In Progress', className: 'badge-in-progress', dot: '#f59e0b' },
    'done': { label: 'Done', className: 'badge-done', dot: '#22c55e' },
};

const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

const TaskCard = ({ task, onEdit, onDelete }) => {
    const status = STATUS_CONFIG[task.status] || STATUS_CONFIG['todo'];

    return (
        <div className="task-card">
            <div className="task-card-header">
                <h3 className="task-title">{task.title}</h3>
                <div className="task-actions">
                    <button
                        className="btn-icon"
                        onClick={() => onEdit(task)}
                        title="Edit task"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        <Edit2 size={15} />
                    </button>
                    <button
                        className="btn-icon"
                        onClick={() => onDelete(task)}
                        title="Delete task"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            </div>

            {task.description && (
                <p className="task-desc">{task.description}</p>
            )}

            <div className="task-footer">
                <span className={`badge ${status.className}`}>
                    <Circle size={6} fill="currentColor" />
                    {status.label}
                </span>
                <span className="task-date" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={11} />
                    {formatDate(task.createdAt)}
                </span>
            </div>
        </div>
    );
};

export default TaskCard;
