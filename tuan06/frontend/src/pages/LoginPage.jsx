import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoginForm } from '../components/auth';
import { Loading } from '../components/common';

const LoginPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen />;
  }

  if (user) {
    return <Navigate to="/menu" replace />;
  }

  return (
    <div className="min-h-screen bg-warm-cream flex items-center justify-center px-4 py-12">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
