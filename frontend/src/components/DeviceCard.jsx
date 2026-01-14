import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { useMemo } from 'react';
import { formatMegabytes } from '../utils/formatting.js';

function UsageBar({ value, limit }) {
  const percentage = limit ? Math.min((value / limit) * 100, 100) : 0;
  return (
    <div className="mt-4 h-2 w-full rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary-500 via-primary-400 to-accent shadow-[0_0_0_1px_rgba(15,23,42,0.45)]"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

function DeviceCard({ device, onEdit, onDelete }) {
  const percent = device.dataLimitMb ? device.usage?.percentage : null;

  // Se o dispositivo veio do app Android, o nome segue o padrão "Funcionario - Modelo do aparelho"
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
    <div className="group flex h-full flex-col rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/80 via-slate-900/70 to-slate-950/60 p-6 shadow-card backdrop-blur-xl transition hover:-translate-y-1 hover:border-primary-400/60 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">Dispositivo</p>
          <h3 className="mt-2 font-display text-xl font-semibold text-white">{deviceLabel || device.name}</h3>
          {employeeName ? (
            <p className="mt-1 text-xs text-white/60">Funcionário: <span className="text-white/85">{employeeName}</span></p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => onDelete(device)}
          className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50 transition hover:border-red-400/70 hover:bg-red-500/15 hover:text-red-100"
        >
          remover
        </button>
      </div>
      <dl className="mt-4 space-y-1.5 text-sm text-white/65">
        <div className="flex justify-between">
          <dt>SIM</dt>
          <dd className="text-white">{device.simNumber || '—'}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Franquia</dt>
          <dd className="text-white">
            {device.dataLimitMb ? formatMegabytes(device.dataLimitMb) : 'Sem limite'}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt>Consumo</dt>
          <dd className="text-white">{formatMegabytes(device.usage?.totalMb || 0)}</dd>
        </div>
      </dl>
      {device.dataLimitMb ? <UsageBar value={device.usage?.totalMb || 0} limit={device.dataLimitMb} /> : null}
      <div className="mt-6 flex items-center justify-between text-sm text-white/60">
        <div>
          {percent ? (
            <p>
              <span className="text-white">{percent}%</span> da franquia consumida
            </p>
          ) : (
            <p>Consumo monitorado em tempo real</p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onEdit(device)}
            className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            editar
          </button>
          <Link
            to={`/devices/${device.imei}`}
            className="inline-flex items-center gap-2 rounded-full border border-primary-400/60 bg-primary-500/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-100 transition hover:bg-primary-500/25 hover:border-primary-300"
          >
            detalhes <FiChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DeviceCard;
