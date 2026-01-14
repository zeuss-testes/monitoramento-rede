import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import clsx from 'classnames';

function Modal({ open, onClose, title, children, actions, size = 'md' }) {
  useEffect(() => {
    const handler = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };
    if (open) {
      window.addEventListener('keydown', handler);
    }
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur" onClick={onClose} />
      <div
        className={clsx(
          'relative z-10 max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-slate-950/90 p-8 shadow-card backdrop-blur-xl',
          size === 'md' && 'w-full max-w-xl',
          size === 'lg' && 'w-full max-w-3xl'
        )}
      >
        <div className="flex items-start justify-between gap-10">
          <div>
            {title ? <h2 className="font-display text-2xl font-semibold text-white">{title}</h2> : null}
          </div>
          <button
            type="button"
            className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/60 hover:bg-white/10"
            onClick={onClose}
          >
            fechar
          </button>
        </div>
        <div className="mt-6 text-white/80">{children}</div>
        {actions ? <div className="mt-8 flex justify-end gap-3">{actions}</div> : null}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
