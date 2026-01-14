function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-white/5 bg-white/5 px-8 py-16 text-center text-white/70">
      <h3 className="font-display text-xl font-semibold text-white">{title}</h3>
      {description ? <p className="max-w-lg text-sm">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
