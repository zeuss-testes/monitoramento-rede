function ErrorState({ message = 'Não foi possível carregar os dados.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 py-12 text-center text-sm text-red-200">
      <span>{message}</span>
      {onRetry ? (
        <button
          type="button"
          className="rounded-full border border-red-400/40 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-red-200 transition hover:bg-red-500/20"
          onClick={onRetry}
        >
          Tentar novamente
        </button>
      ) : null}
    </div>
  );
}

export default ErrorState;
