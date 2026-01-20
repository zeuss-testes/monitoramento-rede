import { FiAlertTriangle } from 'react-icons/fi';

function ErrorState({ message = 'Não foi possível carregar os dados.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-danger/30 bg-danger/10 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-danger/20 border border-danger/30">
        <FiAlertTriangle className="text-danger" size={24} />
      </div>
      <span className="text-sm text-danger/90">{message}</span>
      {onRetry ? (
        <button
          type="button"
          className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-danger transition-all hover:bg-danger/20 hover:border-danger/50"
          onClick={onRetry}
        >
          Tentar novamente
        </button>
      ) : null}
    </div>
  );
}

export default ErrorState;
