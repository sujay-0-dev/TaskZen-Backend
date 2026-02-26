import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { CheckSquare, AlertCircle, Eye, EyeOff } from 'lucide-react';

const RegisterPage = () => {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPwd, setShowPwd] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await registerUser({ name: data.name, email: data.email, password: data.password });
            toast.success('Account created! Welcome to TaskFlow 🎉');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                {/* Logo */}
                <div className="auth-logo">
                    <div className="auth-logo-icon">
                        <CheckSquare size={20} color="#fff" />
                    </div>
                    <span className="auth-logo-text">TaskFlow</span>
                </div>

                <h1 className="auth-title">Create account</h1>
                <p className="auth-subtitle">Start managing your tasks today</p>

                <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    {/* Name */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">Full name</label>
                        <input
                            id="name"
                            type="text"
                            className={`form-input ${errors.name ? 'error' : ''}`}
                            placeholder="John Doe"
                            autoComplete="name"
                            {...register('name', {
                                required: 'Name is required',
                                minLength: { value: 2, message: 'Name must be at least 2 characters' },
                            })}
                        />
                        {errors.name && (
                            <span className="form-error"><AlertCircle size={12} /> {errors.name.message}</span>
                        )}
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email address</label>
                        <input
                            id="email"
                            type="email"
                            className={`form-input ${errors.email ? 'error' : ''}`}
                            placeholder="you@example.com"
                            autoComplete="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                            })}
                        />
                        {errors.email && (
                            <span className="form-error"><AlertCircle size={12} /> {errors.email.message}</span>
                        )}
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                id="password"
                                type={showPwd ? 'text' : 'password'}
                                className={`form-input ${errors.password ? 'error' : ''}`}
                                placeholder="At least 6 characters"
                                autoComplete="new-password"
                                style={{ paddingRight: '2.75rem' }}
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPwd((p) => !p)}
                                style={{
                                    position: 'absolute', right: '0.875rem', top: '50%',
                                    transform: 'translateY(-50%)', background: 'none',
                                    color: 'var(--text-muted)', padding: 0,
                                }}
                            >
                                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="form-error"><AlertCircle size={12} /> {errors.password.message}</span>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
                        <input
                            id="confirmPassword"
                            type={showPwd ? 'text' : 'password'}
                            className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                            placeholder="Repeat your password"
                            autoComplete="new-password"
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: (v) => v === watch('password') || 'Passwords do not match',
                            })}
                        />
                        {errors.confirmPassword && (
                            <span className="form-error"><AlertCircle size={12} /> {errors.confirmPassword.message}</span>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                        {loading ? <><span className="spinner" /> Creating account...</> : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account?{' '}
                    <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
