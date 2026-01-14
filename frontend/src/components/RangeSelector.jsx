import dayjs from 'dayjs';

const presets = [
  {
    label: 'Últimos 7 dias',
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
    label: 'Últimos 30 dias',
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
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 shadow-card backdrop-blur">
      <div className="flex gap-2 text-xs text-white/60">
        {presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className="rounded-full border border-white/10 bg-white/10 px-3 py-1 font-medium text-white/80 transition hover:bg-primary-500/30 hover:text-white"
            onClick={() => onChange(preset.getRange())}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
        <label className="flex items-center gap-2">
          <span>Início</span>
          <input
            type="date"
            value={value.startDate}
            onChange={(event) => update({ startDate: event.target.value })}
            className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-white focus:border-primary-400 focus:outline-none"
          />
        </label>
        <label className="flex items-center gap-2">
          <span>Fim</span>
          <input
            type="date"
            value={value.endDate}
            onChange={(event) => update({ endDate: event.target.value })}
            className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-white focus:border-primary-400 focus:outline-none"
          />
        </label>
      </div>
    </div>
  );
}

export default RangeSelector;
