import { Link } from 'react-router-dom';
import { FiChevronRight, FiSmartphone, FiAlertTriangle } from 'react-icons/fi';
import { useMemo } from 'react';
import { formatMegabytes } from '../utils/formatting.js';

function UsageBar({ value, limit }) {
  const percentage = limit ? Math.min((value / limit) * 100, 100) : 0;
  const isWarning = percentage >= 80;
  const isCritical = percentage >= 95;

  return (
    <div className="mt-5">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] uppercase tracking-wider text-steel font-semibold">Consumo</span>
        <span className={`text-xs font-bold ${isCritical ? 'text-danger' : isWarning ? 'text-warning' : 'text-cyber-400'}`}>
          {percentage.toFixed(1)}%
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-space border border-cyber-400/10 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${isCritical
              ? 'bg-gradient-to-r from-danger to-danger-dim shadow-[0_0_15px_rgba(255,51,102,0.5)]'
              : isWarning
                ? 'bg-gradient-to-r from-warning to-warning-dim shadow-[0_0_15px_rgba(255,170,0,0.4)]'
                : 'bg-gradient-to-r from-cyber-400 to-pulse shadow-[0_0_15px_rgba(0,212,255,0.4)]'
            }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function DeviceCard({ device, onEdit, onDelete }) {
  const percent = device.dataLimitMb ? device.usage?.percentage : null;
  const isOverLimit = percent && percent >= 80;

  const { employeeName, deviceLabel } = useMemo(() => {
    if (!device?.name) return { employeeName: null, deviceLabel: '' };
    const parts = String(device.name).split(' - ');
    if (parts.length >= 2) {
      const [employee, ...rest] = parts;
      return { employeeName: employee, deviceLabel: rest.join(' - ') };
    }
    return { employeeName: null, deviceLabel: device.name };
  }, [device?.name]);

  return (
    <div className="group relative flex h-full flex-col rounded-2xl glass-card glow-border p-6 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
      {/* Status indicator */}
      <div className="absolute top-4 right-4">
        {isOverLimit ? (
          <div className="flex items-center gap-1.5 text-warning">
            <FiAlertTriangle size={14} />
            <span className="text-[9px] uppercase tracking-wider font-semibold">Alerta</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pulse opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-pulse" />
            </span>
            <span className="text-[9px] uppercase tracking-wider text-pulse font-semibold">Ativo</span>
          </div>
        )}
      </div>

      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyber-400/20 to-cyber-600/10 border border-cyber-400/20">
          <FiSmartphone className="text-cyber-400" size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-[0.25em] text-steel font-semibold mb-1">Dispositivo</p>
          <h3 className="font-display text-lg font-bold text-ghost truncate">{deviceLabel || device.name}</h3>
          {employeeName ? (
            <p className="mt-0.5 text-xs text-mist">
              Funcionário: <span className="text-ghost font-medium">{employeeName}</span>
            </p>
          ) : null}
        </div>
      </div>

      <dl className="mt-5 space-y-2.5 text-sm">
        <div className="flex justify-between items-center py-2 border-b border-cyber-400/5">
          <dt className="text-steel text-xs uppercase tracking-wider">SIM</dt>
          <dd className="text-ghost font-medium font-mono text-sm">{device.simNumber || '—'}</dd>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-cyber-400/5">
          <dt className="text-steel text-xs uppercase tracking-wider">Franquia</dt>
          <dd className="text-ghost font-medium">
            {device.dataLimitMb ? formatMegabytes(device.dataLimitMb) : <span className="text-mist">Sem limite</span>}
          </dd>
        </div>
        <div className="flex justify-between items-center py-2">
          <dt className="text-steel text-xs uppercase tracking-wider">Consumo Total</dt>
          <dd className="text-cyber-300 font-bold">{formatMegabytes(device.usage?.totalMb || 0)}</dd>
        </div>
      </dl>

      {device.dataLimitMb ? <UsageBar value={device.usage?.totalMb || 0} limit={device.dataLimitMb} /> : null}

      <div className="mt-6 pt-4 border-t border-cyber-400/10 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(device)}
            className="rounded-lg border border-cyber-400/20 bg-cyber-400/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyber-300 transition-all hover:bg-cyber-400/15 hover:border-cyber-400/40"
          >
            editar
          </button>
          <button
            type="button"
            onClick={() => onDelete(device)}
            className="rounded-lg border border-danger/20 bg-danger/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-danger transition-all hover:bg-danger/15 hover:border-danger/40"
          >
            remover
          </button>
        </div>
        <Link
          to={`/devices/${device.imei}`}
          className="group/btn inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyber-400 to-cyber-500 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-void transition-all hover:shadow-glow hover:from-cyber-300 hover:to-cyber-400"
        >
          detalhes
          <FiChevronRight size={14} className="transition-transform group-hover/btn:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

export default DeviceCard;
