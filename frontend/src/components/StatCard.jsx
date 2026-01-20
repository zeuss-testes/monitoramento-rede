import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';

function StatCard({ title, value, subtitle, highlight, trend }) {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend === 'up') return <FiTrendingUp className="text-pulse" size={14} />;
    if (trend === 'down') return <FiTrendingDown className="text-danger" size={14} />;
    return <FiMinus className="text-mist" size={14} />;
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl glass-card glow-border p-6 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-cyber-400/10 to-transparent rounded-bl-full" />

      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-cyber-400" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-steel">{title}</p>
          </div>
          {highlight ? (
            <span className="rounded-full bg-cyber-400/15 border border-cyber-400/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyber-300">
              {highlight}
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex items-end gap-3">
          <p className="font-display text-4xl font-bold text-ghost tracking-tight">{value}</p>
          {getTrendIcon()}
        </div>

        {subtitle ? (
          <p className="mt-3 text-sm text-mist leading-relaxed">{subtitle}</p>
        ) : null}
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyber-400/50 via-cyber-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}

export default StatCard;
