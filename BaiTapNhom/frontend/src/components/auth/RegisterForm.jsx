import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../common';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: 'USER',
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setErrors({
        submit: err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md">
        <div className="card text-center">
          <div className="w-16 h-16 bg-starbucks-light rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-starbucks" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-starbucks mb-2">Đăng ký thành công!</h2>
          <p className="text-text-secondary">
            Đang chuyển hướng đến trang đăng nhập...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-starbucks-accent rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🍜</span>
        </div>
        <h1 className="text-2xl font-bold text-starbucks">Tạo tài khoản</h1>
        <p className="text-text-secondary mt-2">
          Đăng ký để bắt đầu đặt món
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card">
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 border border-error rounded-lg text-error text-sm">
            {errors.submit}
          </div>
        )}

        <Input
          name="username"
          label="Tên đăng nhập"
          placeholder="Nhập tên đăng nhập"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          required
        />

        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="Nhập địa chỉ email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <Input
          name="password"
          type="password"
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        <Input
          name="confirmPassword"
          type="password"
          label="Xác nhận mật khẩu"
          placeholder="Nhập lại mật khẩu"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />

        <Button 
          type="submit" 
          loading={loading} 
          className="w-full mt-4"
        >
          Đăng ký
        </Button>

        <p className="text-center text-text-secondary mt-4">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-starbucks-accent font-semibold hover:underline">
            Đăng nhập
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
