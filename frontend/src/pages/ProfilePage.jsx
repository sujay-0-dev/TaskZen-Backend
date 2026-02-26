import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/auth';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import {
    User, Mail, Calendar, Shield, CheckCircle2,
    Edit2, Save, X, Eye, EyeOff, AlertCircle, ClipboardList
} from 'lucide-react';

const ProfilePage = () => {
    const { user, login } = useAuth();
    const [editingName, setEditingName] = useState(false);
    const [changingPwd, setChangingPwd] = useState(false);
    const [savingName, setSavingName] = useState(false);
    const [savingPwd, setSavingPwd] = useState(false);
    const [showPwd, setShowPwd] = useState(false);
    const [showNewPwd, setShowNewPwd] = useState(false);

    const nameForm = useForm({ defaultValues: { name: user?.name || '' } });
    const pwdForm = useForm();

    const initials = user?.name
        ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    const joinDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : 'N/A';

    const handleSaveName = async (data) => {
        if (data.name.trim() === user?.name) { setEditingName(false); return; }
        setSavingName(true);
        try {
            await authAPI.updateProfile({ name: data.name.trim() });
            toast.success('Name updated successfully!');
            setEditingName(false);
            // Refresh user data
            window.location.reload();
        } catch (err) {
            toast.error(err.message || 'Failed to update name');
        } finally {
            setSavingName(false);
        }
    };

    const handleChangePassword = async (data) => {
        setSavingPwd(true);
        try {
            await authAPI.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
            toast.success('Password changed successfully!');
            setChangingPwd(false);
            pwdForm.reset();
        } catch (err) {
            toast.error(err.message || 'Failed to change password');
        } finally {
            setSavingPwd(false);
        }
    };

    return (
        <>
            <Navbar />
            <main className="dashboard">
                <div className="container" style={{ maxWidth: 680 }}>

                    {/* Header */}
                    <div className="dashboard-header">
                        <h1>My Profile</h1>
                        <p>Manage your account details and security settings.</p>
                    </div>

                    {/* Avatar Card */}
                    <div className="profile-avatar-card card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                        <div className="profile-avatar-section">
                            <div className="profile-avatar-large">{initials}</div>
                            <div>
                                <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                    {user?.name}
                                </h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>{user?.email}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
                                    <CheckCircle2 size={13} color="var(--success)" />
                                    <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>Account Active</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>

                        {/* Name */}
                        <div className="profile-info-card card" style={{ padding: '1.5rem' }}>
                            <div className="flex-between" style={{ marginBottom: editingName ? '1rem' : 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div className="profile-field-icon" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                                        <User size={16} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Full Name</div>
                                        {!editingName && (
                                            <div style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 500, marginTop: '0.15rem' }}>{user?.name}</div>
                                        )}
                                    </div>
                                </div>
                                {!editingName ? (
                                    <button className="btn btn-secondary btn-sm" onClick={() => setEditingName(true)}>
                                        <Edit2 size={13} /> Edit
                                    </button>
                                ) : (
                                    <button className="btn-icon" onClick={() => setEditingName(false)}>
                                        <X size={16} color="var(--text-muted)" />
                                    </button>
                                )}
                            </div>

                            {editingName && (
                                <form onSubmit={nameForm.handleSubmit(handleSaveName)} style={{ display: 'flex', gap: '0.75rem' }}>
                                    <input
                                        className={`form-input ${nameForm.formState.errors.name ? 'error' : ''}`}
                                        placeholder="Enter your name"
                                        {...nameForm.register('name', {
                                            required: 'Name is required',
                                            minLength: { value: 2, message: 'At least 2 characters' },
                                        })}
                                        style={{ flex: 1 }}
                                    />
                                    <button type="submit" className="btn btn-primary btn-sm" disabled={savingName}>
                                        {savingName ? <span className="spinner" /> : <><Save size={13} /> Save</>}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Email */}
                        <div className="profile-info-card card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div className="profile-field-icon" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>
                                    <Mail size={16} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email Address</div>
                                    <div style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 500, marginTop: '0.15rem' }}>{user?.email}</div>
                                </div>
                                <div style={{ marginLeft: 'auto' }}>
                                    <span className="badge badge-done" style={{ fontSize: '0.65rem' }}>Verified</span>
                                </div>
                            </div>
                        </div>

                        {/* Member Since */}
                        <div className="profile-info-card card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div className="profile-field-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
                                    <Calendar size={16} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Member Since</div>
                                    <div style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 500, marginTop: '0.15rem' }}>{joinDate}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <div className="flex-between" style={{ marginBottom: changingPwd ? '1.25rem' : 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div className="profile-field-icon" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
                                    <Shield size={16} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>Change Password</div>
                                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Update your account password</div>
                                </div>
                            </div>
                            {!changingPwd ? (
                                <button className="btn btn-secondary btn-sm" onClick={() => setChangingPwd(true)}>
                                    <Edit2 size={13} /> Change
                                </button>
                            ) : (
                                <button className="btn-icon" onClick={() => { setChangingPwd(false); pwdForm.reset(); }}>
                                    <X size={16} color="var(--text-muted)" />
                                </button>
                            )}
                        </div>

                        {changingPwd && (
                            <form onSubmit={pwdForm.handleSubmit(handleChangePassword)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {/* Current */}
                                <div className="form-group">
                                    <label className="form-label">Current password</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showPwd ? 'text' : 'password'}
                                            className={`form-input ${pwdForm.formState.errors.currentPassword ? 'error' : ''}`}
                                            placeholder="Enter current password"
                                            style={{ paddingRight: '2.75rem' }}
                                            {...pwdForm.register('currentPassword', { required: 'Required' })}
                                        />
                                        <button type="button" onClick={() => setShowPwd(p => !p)}
                                            style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-muted)', padding: 0 }}>
                                            {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                    {pwdForm.formState.errors.currentPassword && (
                                        <span className="form-error"><AlertCircle size={12} /> {pwdForm.formState.errors.currentPassword.message}</span>
                                    )}
                                </div>

                                {/* New */}
                                <div className="form-group">
                                    <label className="form-label">New password</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showNewPwd ? 'text' : 'password'}
                                            className={`form-input ${pwdForm.formState.errors.newPassword ? 'error' : ''}`}
                                            placeholder="At least 6 characters"
                                            style={{ paddingRight: '2.75rem' }}
                                            {...pwdForm.register('newPassword', {
                                                required: 'Required',
                                                minLength: { value: 6, message: 'Min 6 characters' },
                                            })}
                                        />
                                        <button type="button" onClick={() => setShowNewPwd(p => !p)}
                                            style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-muted)', padding: 0 }}>
                                            {showNewPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                    {pwdForm.formState.errors.newPassword && (
                                        <span className="form-error"><AlertCircle size={12} /> {pwdForm.formState.errors.newPassword.message}</span>
                                    )}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button type="submit" className="btn btn-primary" disabled={savingPwd}>
                                        {savingPwd ? <><span className="spinner" /> Saving...</> : <><Save size={14} /> Update Password</>}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                </div>
            </main>
        </>
    );
};

export default ProfilePage;
