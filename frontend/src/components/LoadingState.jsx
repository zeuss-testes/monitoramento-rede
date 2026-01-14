function LoadingState({ message = 'Carregando...' }) {
  return (
    <div className="flex items-center justify-center rounded-2xl border border-white/5 bg-white/5 py-10 text-sm text-white/60">
      {message}
    </div>
  );
}

export default LoadingState;
