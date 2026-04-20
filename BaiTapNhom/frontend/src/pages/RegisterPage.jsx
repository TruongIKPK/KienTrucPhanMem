import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RegisterForm } from '../components/auth';
import { Loading } from '../components/common';

const RegisterPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen />;
  }

  if (user) {
    return <Navigate to="/menu" replace />;
  }

  return (
    <div className="min-h-screen bg-warm-cream flex items-center justify-center px-4 py-12">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
