const Button = ({ 
  children, 
  variant = 'primary', 
  type = 'button',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = 'font-semibold py-2 px-6 rounded-pill transition-all duration-200 ease-out active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-starbucks-accent text-white hover:bg-starbucks',
    outline: 'bg-transparent text-starbucks-accent border border-starbucks-accent hover:bg-starbucks-light',
    dark: 'bg-starbucks-dark text-white hover:bg-black',
    white: 'bg-white text-starbucks-accent border border-white hover:bg-gray-100',
    ghost: 'bg-transparent text-starbucks-accent hover:bg-starbucks-light',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle 
              className="opacity-25" 
              cx="12" cy="12" r="10" 
              stroke="currentColor" 
              strokeWidth="4"
              fill="none"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Đang xử lý...
        </span>
      ) : children}
    </button>
  );
};

export default Button;
