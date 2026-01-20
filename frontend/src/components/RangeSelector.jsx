import dayjs from 'dayjs';
import { FiCalendar } from 'react-icons/fi';

const presets = [
  {
    label: '7 dias',
    getRange: () => ({
      startDate: dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
      endDate: dayjs().format('YYYY-MM-DD'),
    }),
  },
  {
    label: 'Este mês',
    getRange: () => ({
      startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
      endDate: dayjs().format('YYYY-MM-DD'),
    }),
  },
  {
    label: '30 dias',
    getRange: () => ({
      startDate: dayjs().subtract(29, 'day').format('YYYY-MM-DD'),
      endDate: dayjs().format('YYYY-MM-DD'),
    }),
  },
];

function RangeSelector({ value, onChange }) {
  const update = (updates) => {
    onChange({ ...value, ...updates });
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl glass-card glow-border p-4">
      {/* Presets */}
      <div className="flex gap-2 text-xs">
        {presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className="rounded-lg border border-cyber-400/20 bg-cyber-400/5 px-3 py-1.5 font-semibold text-mist transition-all hover:bg-cyber-400/15 hover:text-cyber-300 hover:border-cyber-400/40"
            onClick={() => onChange(preset.getRange())}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Date inputs */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          <span className="text-steel text-xs uppercase tracking-wider font-semibold">Início</span>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-400" size={14} />
            <input
              type="date"
              value={value.startDate}
              onChange={(event) => update({ startDate: event.target.value })}
              className="rounded-lg border border-cyber-400/20 bg-space/80 pl-9 pr-3 py-2 text-ghost font-mono text-sm focus:border-cyber-400 focus:outline-none focus:ring-1 focus:ring-cyber-400/30 transition-all"
            />
          </div>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-steel text-xs uppercase tracking-wider font-semibold">Fim</span>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-400" size={14} />
            <input
              type="date"
              value={value.endDate}
              onChange={(event) => update({ endDate: event.target.value })}
              className="rounded-lg border border-cyber-400/20 bg-space/80 pl-9 pr-3 py-2 text-ghost font-mono text-sm focus:border-cyber-400 focus:outline-none focus:ring-1 focus:ring-cyber-400/30 transition-all"
            />
          </div>
        </label>
      </div>
    </div>
  );
}

export default RangeSelector;
