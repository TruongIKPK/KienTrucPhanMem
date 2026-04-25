const Loading = ({ message = 'Đang tải...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-starbucks-light rounded-full animate-spin border-t-starbucks-accent"></div>
      </div>
      <p className="text-text-secondary font-medium">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-warm-cream flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  );
};

export default Loading;
