import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <header className="global-nav flex items-center justify-between px-6">
      <Link to="/" className="text-tagline font-display">
        FlashSale
      </Link>
      <nav className="flex items-center gap-6">
        <Link to="/" className="hover:opacity-80">
          Sản phẩm
        </Link>
        <button
          className="btn-dark-utility"
          onClick={() => navigate("/cart")}
          type="button"
        >
          Giỏ hàng
        </button>
      </nav>
    </header>
  );
}
