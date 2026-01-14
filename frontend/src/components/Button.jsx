import clsx from 'classnames';

const variants = {
  primary:
    'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-400 hover:to-primary-500 focus-visible:outline-primary-300 disabled:opacity-60 disabled:cursor-not-allowed',
  ghost:
    'bg-white/0 text-white/80 hover:bg-white/10 focus-visible:outline-white disabled:text-white/40 disabled:hover:bg-white/0 disabled:cursor-not-allowed',
  danger:
    'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500 focus-visible:outline-red-400 disabled:opacity-60 disabled:cursor-not-allowed',
};

function Button({ type = 'button', variant = 'primary', className, children, ...props }) {
  return (
    <button
      type={type}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:shadow-md active:shadow-sm disabled:shadow-none',
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
