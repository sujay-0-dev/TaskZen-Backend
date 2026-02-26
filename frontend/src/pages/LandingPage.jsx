import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    CheckSquare, ArrowRight, Shield, Zap, Layout,
    Search, Filter, Globe, Star, ChevronRight
} from 'lucide-react';

const FEATURES = [
    {
        icon: <Shield size={22} />,
        title: 'Secure by Design',
        desc: 'JWT auth via httpOnly cookies, AES-256 encrypted payloads, bcrypt password hashing.',
        color: 'var(--accent)',
        bg: 'var(--accent-light)',
    },
    {
        icon: <Zap size={22} />,
        title: 'Real-Time Updates',
        desc: 'Instant task creation, editing and deletion with optimistic UI and toast notifications.',
        color: 'var(--warning)',
        bg: 'var(--warning-bg)',
    },
    {
        icon: <Layout size={22} />,
        title: 'Smart Dashboard',
        desc: 'Stats overview, Kanban-style status cards, and a fully responsive grid layout.',
        color: 'var(--success)',
        bg: 'var(--success-bg)',
    },
    {
        icon: <Search size={22} />,
        title: 'Search & Filter',
        desc: 'Debounced search by title and one-click filter by status: Todo, In Progress, Done.',
        color: 'var(--info)',
        bg: 'var(--info-bg)',
    },
    {
        icon: <Filter size={22} />,
        title: 'Pagination',
        desc: 'Server-side paginated task listing with configurable page size for fast performance.',
        color: '#a78bfa',
        bg: 'rgba(167, 139, 250, 0.15)',
    },
    {
        icon: <Globe size={22} />,
        title: 'RESTful API',
        desc: 'Full CRUD REST endpoints with structured JSON responses and proper HTTP status codes.',
        color: '#f472b6',
        bg: 'rgba(244, 114, 182, 0.15)',
    },
];

const STATS = [
    { value: '100%', label: 'RESTful API' },
    { value: 'AES-256', label: 'Encryption' },
    { value: 'JWT', label: 'Auth Cookies' },
    { value: 'MongoDB', label: 'Atlas DB' },
];

const LandingPage = () => {
    const { user } = useAuth();

    return (
        <div className="landing">
            {/* ── Navbar ─────────────────────────────────── */}
            <header className="landing-nav">
                <div className="nav-inner">
                    <div className="landing-brand">
                        <div className="landing-brand-icon">
                            <CheckSquare size={18} color="#fff" />
                        </div>
                        <span className="landing-brand-text">TaskFlow</span>
                    </div>
                    <div className="nav-actions">
                        {user ? (
                            <Link to="/dashboard" className="btn btn-primary">
                                Go to Dashboard <ArrowRight size={15} />
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-secondary">Sign In</Link>
                                <Link to="/register" className="btn btn-primary">Get Started <ChevronRight size={14} /></Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* ── Hero ────────────────────────────────────── */}
            <section className="hero">
                <div className="hero-glow hero-glow-left" />
                <div className="hero-glow hero-glow-right" />
                <div className="hero-inner">
                    <div className="hero-badge">
                        <Star size={12} fill="currentColor" /> Production-Ready Full Stack App
                    </div>
                    <h1 className="hero-title">
                        Manage Tasks <br />
                        <span className="hero-title-gradient">Smarter &amp; Faster</span>
                    </h1>
                    <p className="hero-desc">
                        A secure, modern task management platform built with Node.js, React &amp; MongoDB Atlas.
                        JWT authentication, AES-256 encryption, and a silky smooth dashboard — all in one.
                    </p>
                    <div className="hero-actions">
                        {user ? (
                            <Link to="/dashboard" className="btn btn-primary btn-lg">
                                Open Dashboard <ArrowRight size={17} />
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-primary btn-lg">
                                    Start for Free <ArrowRight size={17} />
                                </Link>
                                <Link to="/login" className="btn btn-secondary btn-lg">Sign In</Link>
                            </>
                        )}
                    </div>

                    {/* Stats bar */}
                    <div className="hero-stats">
                        {STATS.map((s) => (
                            <div key={s.label} className="hero-stat">
                                <div className="hero-stat-value">{s.value}</div>
                                <div className="hero-stat-label">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features ─────────────────────────────────── */}
            <section className="features-section">
                <div className="features-inner">
                    <div className="features-header">
                        <h2 className="section-title">Everything you need</h2>
                        <p className="section-desc">Built to assessment spec — secure, structured, and scalable.</p>
                    </div>
                    <div className="features-grid">
                        {FEATURES.map((f) => (
                            <div key={f.title} className="feature-card">
                                <div className="feature-icon" style={{ background: f.bg, color: f.color }}>
                                    {f.icon}
                                </div>
                                <h3 className="feature-title">{f.title}</h3>
                                <p className="feature-desc">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ─────────────────────────────────────── */}
            <section className="cta-section">
                <div className="cta-card">
                    <div className="cta-glow" />
                    <h2 className="cta-title">Ready to get organized?</h2>
                    <p className="cta-desc">Create your account in seconds. No credit card required.</p>
                    <Link to="/register" className="btn btn-primary btn-lg">
                        Create Free Account <ArrowRight size={17} />
                    </Link>
                </div>
            </section>

            {/* ── Footer ─────────────────────────────────── */}
            <footer className="landing-footer">
                <div className="footer-inner">
                    <div className="landing-brand" style={{ opacity: 0.7 }}>
                        <div className="landing-brand-icon" style={{ width: 24, height: 24 }}>
                            <CheckSquare size={13} color="#fff" />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>TaskFlow</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                        Full Stack Developer Technical Assessment — Node.js · React · MongoDB
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
