function LoadingState({ message = 'Carregando...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl glass-card py-12">
      {/* Animated loading spinner */}
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2 border-cyber-400/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyber-400 animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-pulse animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
      </div>
      <span className="text-sm text-mist font-medium">{message}</span>
    </div>
  );
}

export default LoadingState;
