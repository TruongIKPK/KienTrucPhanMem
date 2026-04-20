import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common';

const HomePage = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: '🍜',
      title: 'Menu đa dạng',
      description: 'Hàng trăm món ăn ngon được chuẩn bị mỗi ngày',
    },
    {
      icon: '⚡',
      title: 'Đặt hàng nhanh',
      description: 'Chỉ vài bước đơn giản để có bữa ăn ngon',
    },
    {
      icon: '💳',
      title: 'Thanh toán dễ dàng',
      description: 'Hỗ trợ nhiều phương thức thanh toán',
    },
  ];

  return (
    <div className="min-h-screen bg-warm-cream">
      {/* Hero Section */}
      <section className="bg-starbucks-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Đặt món ăn<br />
                <span className="text-gold">ngon & tiện lợi</span>
              </h1>
              <p className="text-white/70 text-lg mb-8">
                Hệ thống đặt món ăn nội bộ dành cho nhân viên. 
                Khám phá menu phong phú và đặt hàng chỉ với vài cú click.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/menu">
                  <Button variant="white" className="w-full sm:w-auto px-8 py-3">
                    Xem Menu
                  </Button>
                </Link>
                {!user && (
                  <Link to="/register">
                    <Button variant="outline" className="w-full sm:w-auto px-8 py-3 border-white text-white hover:bg-white/10">
                      Đăng ký ngay
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="w-80 h-80 bg-gradient-to-br from-starbucks to-starbucks-accent rounded-full flex items-center justify-center shadow-frap">
                <span className="text-9xl">🍲</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-starbucks mb-4">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Hệ thống đặt món hiện đại, nhanh chóng và tiện lợi cho mọi nhân viên
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-starbucks-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-starbucks mb-2">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-starbucks py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Bắt đầu đặt món ngay!
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            Đăng ký tài khoản hoặc đăng nhập để bắt đầu khám phá menu và đặt món yêu thích của bạn.
          </p>
          <Link to="/menu">
            <Button variant="white" className="px-8 py-3">
              Khám phá Menu
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-starbucks-dark text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-starbucks-accent rounded-full flex items-center justify-center">
                <span className="text-xl">🍜</span>
              </div>
              <span className="font-bold text-lg">Food Order</span>
            </div>
            <p className="text-white/50 text-sm">
              © 2024 Mini Food Ordering System - Nhóm 03
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
