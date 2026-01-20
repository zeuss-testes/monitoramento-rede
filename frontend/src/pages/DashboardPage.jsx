import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Pie, PieChart, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiActivity, FiWifi, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { fetchOverview, fetchTrends, fetchNetwork } from '../api/reports.js';
import { updateDevice, deleteDevice } from '../api/devices.js';
import StatCard from '../components/StatCard.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import RangeSelector from '../components/RangeSelector.jsx';
import { formatMegabytes } from '../utils/formatting.js';
import Modal from '../components/Modal.jsx';
import DeviceForm from '../components/DeviceForm.jsx';
import Button from '../components/Button.jsx';

const COLORS = ['#00d4ff', '#00ff88', '#ffaa00', '#ff3366', '#a855f7', '#38bdf8'];

function DashboardPage() {
  const queryClient = useQueryClient();
  const [range, setRange] = useState({
    startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
  });
  const [editDevice, setEditDevice] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

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

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateDevice(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      setEditDevice(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      setConfirmDelete(null);
    },
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
          trend="up"
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
        {/* Trend Chart */}
        <div className="xl:col-span-2 rounded-2xl glass-card glow-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyber-400/10 border border-cyber-400/20">
                <FiTrendingUp className="text-cyber-400" size={20} />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-ghost">Tendência de Consumo</h2>
                <p className="text-xs text-steel uppercase tracking-wider">MB por dia</p>
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.4} />
                    <stop offset="50%" stopColor="#00d4ff" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#00d4ff" />
                    <stop offset="100%" stopColor="#00ff88" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 212, 255, 0.08)" vertical={false} />
                <XAxis
                  dataKey="bucket"
                  stroke="#5a6a8a"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#5a6a8a', fontSize: 11 }}
                />
                <YAxis
                  stroke="#5a6a8a"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#5a6a8a', fontSize: 11 }}
                  tickFormatter={(value) => `${Math.round(value)}`}
                />
                <Tooltip
                  cursor={{ stroke: '#00d4ff', strokeWidth: 1, strokeDasharray: '4' }}
                  contentStyle={{
                    background: 'rgba(15, 22, 40, 0.95)',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 212, 255, 0.2)',
                    boxShadow: '0 0 30px rgba(0, 212, 255, 0.2)'
                  }}
                  labelStyle={{ color: '#e8f4ff', fontWeight: 600 }}
                  itemStyle={{ color: '#00d4ff' }}
                  formatter={(value) => [formatMegabytes(value), 'Consumo']}
                  labelFormatter={(label) => dayjs(label).format('DD MMM YYYY')}
                />
                <Area
                  type="monotone"
                  dataKey="megabytes"
                  stroke="url(#strokeGradient)"
                  strokeWidth={2.5}
                  fill="url(#colorUsage)"
                  dot={false}
                  activeDot={{ r: 6, fill: '#00d4ff', stroke: '#0a0e17', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Network Chart */}
        <div className="rounded-2xl glass-card glow-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pulse/10 border border-pulse/20">
              <FiWifi className="text-pulse" size={20} />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-ghost">Redes Utilizadas</h2>
              <p className="text-xs text-steel uppercase tracking-wider">MB por rede</p>
            </div>
          </div>
          <div className="h-56">
            {networkData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={networkData}
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {networkData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                        style={{ filter: `drop-shadow(0 0 8px ${COLORS[index % COLORS.length]}40)` }}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15, 22, 40, 0.95)',
                      borderRadius: '12px',
                      border: '1px solid rgba(0, 212, 255, 0.2)',
                      boxShadow: '0 0 30px rgba(0, 212, 255, 0.2)'
                    }}
                    formatter={(value, _, payload) => [formatMegabytes(value), payload?.payload?.name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-mist">Sem dados registrados</div>
            )}
          </div>
          <div className="mt-4 space-y-2.5">
            {networkData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-sm py-1.5 border-b border-cyber-400/5 last:border-none">
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                      boxShadow: `0 0 10px ${COLORS[index % COLORS.length]}60`
                    }}
                  />
                  <span className="text-ghost font-medium">{item.name}</span>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-mist">{item.percentage ? `${item.percentage}%` : '—'}</span>
                  <span className="text-cyber-300 font-semibold font-mono">{formatMegabytes(item.value)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Devices Table */}
      <div className="rounded-2xl glass-card glow-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 border border-warning/20">
              <FiActivity className="text-warning" size={20} />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-ghost">Funcionários / Dispositivos</h2>
              <p className="text-xs text-steel uppercase tracking-wider">Ranking por consumo total</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-cyber-400/10">
                <th className="py-3 font-semibold text-steel text-xs uppercase tracking-wider">Funcionário</th>
                <th className="py-3 font-semibold text-steel text-xs uppercase tracking-wider">IMEI</th>
                <th className="py-3 font-semibold text-steel text-xs uppercase tracking-wider">Número</th>
                <th className="py-3 font-semibold text-steel text-xs uppercase tracking-wider text-right">Consumo Total</th>
                <th className="py-3 font-semibold text-steel text-xs uppercase tracking-wider text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {overview?.devices?.length ? (
                overview.devices
                  .slice()
                  .sort((a, b) => (b.consumoTotal || 0) - (a.consumoTotal || 0))
                  .map((device, index) => (
                    <tr
                      key={device.imei}
                      className="border-b border-cyber-400/5 last:border-none table-row-hover transition-colors"
                    >
                      <td className="py-4">
                        <Link
                          to={`/devices/${device.imei}`}
                          className="font-medium text-ghost hover:text-cyber-400 transition-colors flex items-center gap-2"
                        >
                          <span className={`h-2 w-2 rounded-full ${index < 3 ? 'bg-pulse' : 'bg-steel'}`} />
                          {device.nome || device.name || 'Sem nome'}
                        </Link>
                      </td>
                      <td className="py-4 text-mist font-mono text-xs">{device.imei}</td>
                      <td className="py-4 text-mist">{device.numero || device.simNumber || 'Não informado'}</td>
                      <td className="py-4 text-right">
                        <span className="text-cyber-300 font-bold font-mono">
                          {formatMegabytes(device.consumoTotal || device.usage?.totalMb || 0)}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditDevice(device)}
                            className="rounded-lg border border-cyber-400/20 bg-cyber-400/5 p-2 text-cyber-300 transition-all hover:bg-cyber-400/15 hover:border-cyber-400/40"
                            title="Editar dispositivo"
                          >
                            <FiEdit2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(device)}
                            className="rounded-lg border border-danger/20 bg-danger/5 p-2 text-danger transition-all hover:bg-danger/15 hover:border-danger/40"
                            title="Remover dispositivo"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-mist">
                    Nenhum funcionário cadastrado ou sem dados de consumo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edição */}
      <Modal
        open={Boolean(editDevice)}
        onClose={() => setEditDevice(null)}
        title="Editar dispositivo"
      >
        <DeviceForm
          defaultValues={editDevice}
          submitting={updateMutation.isLoading}
          onCancel={() => setEditDevice(null)}
          onSubmit={(payload) => updateMutation.mutate({ id: editDevice.id, payload })}
        />
      </Modal>

      {/* Modal de Exclusão */}
      <Modal
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Remover dispositivo"
      >
        <div className="space-y-6">
          <p className="text-mist">
            Tem certeza que deseja remover o dispositivo <strong className="text-ghost">{confirmDelete?.nome || confirmDelete?.name}</strong>? Todos os registros de
            consumo associados serão excluídos.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-cyber-400/10">
            <Button variant="ghost" onClick={() => setConfirmDelete(null)} disabled={deleteMutation.isLoading}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteMutation.mutate(confirmDelete.id)}
              disabled={deleteMutation.isLoading}
            >
              {deleteMutation.isLoading ? 'Removendo...' : 'Remover'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DashboardPage;
