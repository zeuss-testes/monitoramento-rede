function StatCard({ title, value, subtitle, highlight }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 p-6 shadow-card backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/60">{title}</p>
        {highlight ? (
          <span className="rounded-full bg-accent/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            {highlight}
          </span>
        ) : null}
      </div>
      <p className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">{value}</p>
      {subtitle ? <p className="mt-2 text-sm text-white/65">{subtitle}</p> : null}
    </div>
  );
}

export default StatCard;
