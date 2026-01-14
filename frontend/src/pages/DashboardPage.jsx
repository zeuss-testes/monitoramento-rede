import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Pie, PieChart, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import { fetchOverview, fetchTrends, fetchNetwork } from '../api/reports.js';
import StatCard from '../components/StatCard.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import RangeSelector from '../components/RangeSelector.jsx';
import { formatMegabytes } from '../utils/formatting.js';

const COLORS = ['#3677f8', '#ffb347', '#38bdf8', '#f472b6', '#a855f7', '#22c55e'];

function DashboardPage() {
  const [range, setRange] = useState({
    startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
  });

  const overviewQuery = useQuery({
    queryKey: ['reports', 'overview', range],
    queryFn: () => fetchOverview(range),
  });

  const trendsQuery = useQuery({
    queryKey: ['reports', 'trends', range],
    queryFn: () => fetchTrends({ ...range, granularity: 'day' }),
  });

  const networkQuery = useQuery({
    queryKey: ['reports', 'network', range],
    queryFn: () => fetchNetwork(range),
  });

  const overview = overviewQuery.data;
  const trends = trendsQuery.data;
  const network = networkQuery.data;

  const trendData = useMemo(() => {
    if (!trends?.timeline?.length) {
      return [];
    }
    return trends.timeline.map((item) => ({
      bucket: item.bucket,
      megabytes: Number(item.megabytes || 0),
    }));
  }, [trends]);

  const networkData = useMemo(() => {
    if (!network?.breakdown?.length) {
      return [];
    }

    return network.breakdown.map((item) => ({
      name: item.networkType,
      value: Number(item.megabytes || 0),
      percentage: item.percentage,
    }));
  }, [network]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <SectionHeader
            title="Visão Geral"
            subtitle="Resumo consolidado do uso de dados móveis em todos os dispositivos monitorados"
          />
        </div>
        <RangeSelector value={range} onChange={setRange} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Consumido"
          value={formatMegabytes(overview?.totals?.usageMb || 0)}
          subtitle={`Período ${dayjs(range.startDate).format('DD/MM')} - ${dayjs(range.endDate).format('DD/MM')}`}
          highlight="Uso"
        />
        <StatCard
          title="Dispositivos"
          value={overview?.totals?.devices || 0}
          subtitle={overview?.devices?.length ? 'Dispositivos ativos monitorados' : 'Nenhum dispositivo cadastrado'}
          highlight="Inventário"
        />
        <StatCard
          title="Média por Linha"
          value={formatMegabytes(overview?.totals?.averageUsagePerDeviceMb || 0)}
          subtitle="Consumo médio por dispositivo"
        />
        <StatCard
          title="Limite Médio"
          value={overview?.totals?.averageLimitMb ? formatMegabytes(overview?.totals?.averageLimitMb) : '—'}
          subtitle="Base apenas em dispositivos com franquia configurada"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-2xl border border-white/5 bg-white/5 p-6 shadow-card backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Tendência de Consumo</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-white/50">MB por dia</span>
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3677f8" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#3677f8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="bucket" stroke="rgba(255,255,255,0.4)" tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" tickFormatter={(value) => `${Math.round(value)} MB`} />
                <Tooltip
                  cursor={{ stroke: '#3677f8', strokeWidth: 1, strokeDasharray: '4' }}
                  contentStyle={{ background: '#0f1729', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                  formatter={(value) => formatMegabytes(value)}
                  labelFormatter={(label) => dayjs(label).format('DD MMM')}
                />
                <Area type="monotone" dataKey="megabytes" stroke="#3677f8" strokeWidth={2} fill="url(#colorUsage)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/5 p-6 shadow-card backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Redes Utilizadas</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-white/50">MB por rede</span>
          </div>
          <div className="mt-6 h-72">
            {networkData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={networkData} innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                    {networkData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#0f1729', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                    formatter={(value, _, payload) => [formatMegabytes(value), payload?.payload?.name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-white/50">Sem dados registrados</div>
            )}
          </div>
          <div className="mt-6 space-y-2">
            {networkData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span>{item.name}</span>
                </div>
                <div className="flex gap-3 text-white/60">
                  <span>{item.percentage ? `${item.percentage}%` : '—'}</span>
                  <span>{formatMegabytes(item.value)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/5 p-6 shadow-card backdrop-blur-md">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Funcionários / Dispositivos</h2>
          <span className="text-xs uppercase tracking-[0.2em] text-white/50">Ranking por consumo total</span>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-white/60">
              <tr className="border-b border-white/10">
                <th className="py-2 font-medium">Funcionário</th>
                <th className="py-2 font-medium">IMEI</th>
                <th className="py-2 font-medium">Número</th>
                <th className="py-2 font-medium">Consumo Total</th>
              </tr>
            </thead>
            <tbody>
              {overview?.devices?.length ? (
                overview.devices
                  .slice()
                  .sort((a, b) => (b.consumoTotal || 0) - (a.consumoTotal || 0))
                  .map((device) => (
                    <tr key={device.imei} className="border-b border-white/5 last:border-none">
                      <td className="py-3 font-medium text-white">
                        <Link to={`/devices/${device.imei}`} className="hover:text-blue-400 transition-colors">
                          {device.nome || device.name || 'Sem nome'}
                        </Link>
                      </td>
                      <td className="py-3 text-white/60">{device.imei}</td>
                      <td className="py-3 text-white/60">{device.numero || device.simNumber || 'Não informado'}</td>
                      <td className="py-3 text-white">{formatMegabytes(device.consumoTotal || device.usage?.totalMb || 0)}</td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-white/50">
                    Nenhum funcionário cadastrado ou sem dados de consumo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
