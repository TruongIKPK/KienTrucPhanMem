import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../common';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      navigate('/menu');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-starbucks-accent rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🍜</span>
        </div>
        <h1 className="text-2xl font-bold text-starbucks">Đăng nhập</h1>
        <p className="text-text-secondary mt-2">
          Chào mừng bạn trở lại!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-error rounded-lg text-error text-sm">
            {error}
          </div>
        )}

        <Input
          name="username"
          label="Tên đăng nhập"
          placeholder="Nhập tên đăng nhập"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <Input
          name="password"
          type="password"
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Button 
          type="submit" 
          loading={loading} 
          className="w-full mt-4"
        >
          Đăng nhập
        </Button>

        <p className="text-center text-text-secondary mt-4">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-starbucks-accent font-semibold hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
