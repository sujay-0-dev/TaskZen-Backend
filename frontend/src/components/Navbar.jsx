import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, LogOut, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logged out successfully!');
            navigate('/login');
        } catch {
            toast.error('Failed to logout');
        }
    };

    const initials = user?.name
        ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <nav className="navbar">
            <Link to="/dashboard" className="navbar-brand">
                <div className="navbar-brand-icon">
                    <CheckSquare size={18} color="#fff" />
                </div>
                <span>TaskFlow</span>
            </Link>

            <div className="navbar-right">
                <Link
                    to="/profile"
                    className={`navbar-user ${location.pathname === '/profile' ? 'navbar-user--active' : ''}`}
                    title="My Profile"
                >
                    <div className="navbar-avatar">{initials}</div>
                    <span className="user-name">{user?.name}</span>
                </Link>
                <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleLogout}
                    title="Logout"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                    <LogOut size={15} />
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
