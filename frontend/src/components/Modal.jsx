import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import clsx from 'classnames';
import { FiX } from 'react-icons/fi';

function Modal({ open, onClose, title, children, actions, size = 'md' }) {
  useEffect(() => {
    const handler = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };
    if (open) {
      window.addEventListener('keydown', handler);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-void/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={clsx(
          'relative z-10 max-h-[90vh] overflow-y-auto rounded-2xl border border-cyber-400/20 bg-space/95 backdrop-blur-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]',
          size === 'md' && 'w-full max-w-xl',
          size === 'lg' && 'w-full max-w-3xl'
        )}
      >
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-cyber-400 via-cyber-500 to-pulse" />

        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-6">
            <div>
              {title ? (
                <h2 className="font-display text-2xl font-bold text-ghost">{title}</h2>
              ) : null}
            </div>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyber-400/20 bg-cyber-400/5 text-mist transition-all hover:bg-cyber-400/15 hover:text-ghost hover:border-cyber-400/40"
              onClick={onClose}
              aria-label="Fechar"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="mt-6 text-mist">{children}</div>

          {/* Actions */}
          {actions ? (
            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-cyber-400/10">{actions}</div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default Modal;
