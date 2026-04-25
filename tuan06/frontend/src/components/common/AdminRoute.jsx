import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-starbucks"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-cream">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Truy cập bị từ chối
          </h1>
          <p className="text-text-secondary mb-4">
            Bạn không có quyền truy cập trang này.
          </p>
          <a
            href="/menu"
            className="btn-primary inline-block"
          >
            Quay về Menu
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
