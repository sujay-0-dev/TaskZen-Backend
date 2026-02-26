import { X, AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
            <div className="modal scale-in" style={{ maxWidth: 400 }}>
                <div className="modal-header">
                    <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertTriangle size={20} color="var(--danger)" />
                        {title || 'Confirm'}
                    </h2>
                    <button className="modal-close" onClick={onCancel}><X size={16} /></button>
                </div>
                <div className="modal-body">
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                        {message || 'Are you sure you want to proceed?'}
                    </p>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>
                        Cancel
                    </button>
                    <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
                        {loading ? <><span className="spinner" /> Deleting...</> : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
