import clsx from 'classnames';

const variants = {
  primary:
    'bg-gradient-to-r from-cyber-400 to-cyber-500 text-void font-bold hover:from-cyber-300 hover:to-cyber-400 hover:shadow-glow focus-visible:outline-cyber-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none',
  secondary:
    'bg-cyber-400/10 text-cyber-300 border border-cyber-400/30 hover:bg-cyber-400/20 hover:border-cyber-400/50 focus-visible:outline-cyber-300 disabled:opacity-50 disabled:cursor-not-allowed',
  ghost:
    'bg-transparent text-mist hover:bg-cyber-400/10 hover:text-ghost focus-visible:outline-cyber-300 disabled:text-steel disabled:hover:bg-transparent disabled:cursor-not-allowed',
  danger:
    'bg-gradient-to-r from-danger to-danger-dim text-ghost font-bold hover:shadow-[0_0_20px_rgba(255,51,102,0.4)] focus-visible:outline-danger disabled:opacity-50 disabled:cursor-not-allowed',
};

function Button({ type = 'button', variant = 'primary', className, children, ...props }) {
  return (
    <button
      type={type}
      className={clsx(
        'btn-glow inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
