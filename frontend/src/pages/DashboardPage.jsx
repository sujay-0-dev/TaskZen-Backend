import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { tasksAPI } from '../api/tasks';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { toast } from 'react-toastify';
import {
    Plus, Search, CheckSquare, Clock, Zap, CheckCircle2,
    ChevronLeft, ChevronRight, ClipboardList
} from 'lucide-react';

const FILTERS = [
    { label: 'All', value: '' },
    { label: 'To Do', value: 'todo' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Done', value: 'done' },
];

const DashboardPage = () => {
    const { user } = useAuth();
    const { tasks, pagination, loading, error, fetchTasks, createTask, updateTask, deleteTask } = useTasks();

    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 });

    const searchRef = useRef(null);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            loadTasks(1, filter, search);
        }, 400);
        return () => clearTimeout(timer);
        // eslint-disable-next-line
    }, [search]);

    const loadTasks = useCallback(
        async (p = page, f = filter, s = search) => {
            await fetchTasks({ page: p, limit: 9, status: f || undefined, search: s || undefined });
        },
        [fetchTasks, page, filter, search]
    );

    // Load stats (all tasks counts)
    const loadStats = useCallback(async () => {
        try {
            const [all, todo, inP, done] = await Promise.all([
                tasksAPI.getAll({ limit: 1 }),
                tasksAPI.getAll({ limit: 1, status: 'todo' }),
                tasksAPI.getAll({ limit: 1, status: 'in-progress' }),
                tasksAPI.getAll({ limit: 1, status: 'done' }),
            ]);
            setStats({
                total: all.data.pagination?.totalTasks || 0,
                todo: todo.data.pagination?.totalTasks || 0,
                inProgress: inP.data.pagination?.totalTasks || 0,
                done: done.data.pagination?.totalTasks || 0,
            });
        } catch { /* ignore */ }
    }, []);

    useEffect(() => {
        loadTasks(1, filter, search);
        loadStats();
        setPage(1);
        // eslint-disable-next-line
    }, [filter]);

    useEffect(() => {
        loadTasks(page, filter, search);
        // eslint-disable-next-line
    }, [page]);

    const handleCreateTask = async (data) => {
        setModalLoading(true);
        try {
            await createTask(data);
            toast.success('✅ Task created!');
            setModalOpen(false);
            setEditingTask(null);
            await loadTasks(1, filter, search);
            await loadStats();
            setPage(1);
        } catch (err) {
            toast.error(err.message || 'Failed to create task');
        } finally {
            setModalLoading(false);
        }
    };

    const handleUpdateTask = async (data) => {
        setModalLoading(true);
        try {
            await updateTask(editingTask._id, data);
            toast.success('✏️ Task updated!');
            setModalOpen(false);
            setEditingTask(null);
            await loadTasks(page, filter, search);
            await loadStats();
        } catch (err) {
            toast.error(err.message || 'Failed to update task');
        } finally {
            setModalLoading(false);
        }
    };

    const handleDeleteTask = async () => {
        setDeleteLoading(true);
        try {
            await deleteTask(deleteTarget._id);
            toast.success('🗑️ Task deleted!');
            setDeleteTarget(null);
            const newPage = tasks.length === 1 && page > 1 ? page - 1 : page;
            setPage(newPage);
            await loadTasks(newPage, filter, search);
            await loadStats();
        } catch (err) {
            toast.error(err.message || 'Failed to delete task');
        } finally {
            setDeleteLoading(false);
        }
    };

    const openEdit = (task) => { setEditingTask(task); setModalOpen(true); };
    const openCreate = () => { setEditingTask(null); setModalOpen(true); };

    const totalPages = pagination?.totalPages || 1;

    return (
        <>
            <Navbar />
            <main className="dashboard">
                <div className="container">
                    {/* Header */}
                    <div className="dashboard-header">
                        <h1>Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋</h1>
                        <p>Manage and track all your tasks from one place.</p>
                    </div>

                    {/* Stats */}
                    <div className="stats-row">
                        <div className="stat-card">
                            <div className="stat-icon purple"><CheckSquare size={20} /></div>
                            <div>
                                <div className="stat-label">Total Tasks</div>
                                <div className="stat-value">{stats.total}</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon blue"><ClipboardList size={20} /></div>
                            <div>
                                <div className="stat-label">To Do</div>
                                <div className="stat-value">{stats.todo}</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon amber"><Zap size={20} /></div>
                            <div>
                                <div className="stat-label">In Progress</div>
                                <div className="stat-value">{stats.inProgress}</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon green"><CheckCircle2 size={20} /></div>
                            <div>
                                <div className="stat-label">Done</div>
                                <div className="stat-value">{stats.done}</div>
                            </div>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="toolbar">
                        <div className="search-wrap">
                            <Search size={16} />
                            <input
                                ref={searchRef}
                                className="search-input"
                                placeholder="Search tasks..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="filter-tabs">
                            {FILTERS.map((f) => (
                                <button
                                    key={f.value}
                                    className={`filter-tab ${filter === f.value ? 'active' : ''}`}
                                    onClick={() => setFilter(f.value)}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>

                        <button className="btn btn-primary" onClick={openCreate} id="create-task-btn">
                            <Plus size={16} />
                            New Task
                        </button>
                    </div>

                    {/* Task List */}
                    {error && (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger)' }}>
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex-center" style={{ padding: '4rem' }}>
                            <div className="spinner" style={{ width: 36, height: 36 }} />
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="empty-state">
                            <CheckSquare size={56} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                            <h3>No tasks found</h3>
                            <p>
                                {search
                                    ? `No results for "${search}"`
                                    : filter
                                        ? `No tasks with status "${filter}"`
                                        : 'Create your first task to get started!'}
                            </p>
                            {!search && !filter && (
                                <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={openCreate}>
                                    <Plus size={16} /> Create Task
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="tasks-grid">
                            {tasks.map((task) => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    onEdit={openEdit}
                                    onDelete={setDeleteTarget}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <span className="pagination-info">
                                Page {pagination?.currentPage} of {totalPages} ({pagination?.totalTasks} tasks)
                            </span>
                            <button
                                className="page-btn"
                                onClick={() => setPage((p) => p - 1)}
                                disabled={!pagination?.hasPrevPage}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const p = getPageNumbers(pagination?.currentPage || 1, totalPages)[i];
                                return p ? (
                                    <button
                                        key={p}
                                        className={`page-btn ${p === page ? 'active' : ''}`}
                                        onClick={() => setPage(p)}
                                    >
                                        {p}
                                    </button>
                                ) : null;
                            })}
                            <button
                                className="page-btn"
                                onClick={() => setPage((p) => p + 1)}
                                disabled={!pagination?.hasNextPage}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Task Modal */}
            <TaskModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditingTask(null); }}
                onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                task={editingTask}
                loading={modalLoading}
            />

            {/* Confirm Delete */}
            <ConfirmDialog
                isOpen={!!deleteTarget}
                title="Delete Task"
                message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
                onConfirm={handleDeleteTask}
                onCancel={() => setDeleteTarget(null)}
                loading={deleteLoading}
            />
        </>
    );
};

// Helpers
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
};

const getPageNumbers = (current, total) => {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 3) return [1, 2, 3, 4, 5];
    if (current >= total - 2) return [total - 4, total - 3, total - 2, total - 1, total];
    return [current - 2, current - 1, current, current + 1, current + 2];
};

export default DashboardPage;
