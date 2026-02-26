import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => (
    <div className="not-found">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
            <Home size={16} /> Go to Dashboard
        </Link>
    </div>
);

export default NotFoundPage;
