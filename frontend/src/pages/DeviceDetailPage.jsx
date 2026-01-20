import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { FiSmartphone, FiUser, FiPhone, FiCalendar, FiClock, FiActivity, FiDatabase, FiWifi, FiCpu, FiTrash2 } from 'react-icons/fi';
import { getDeviceDetails, deleteDevice, getDeviceHistory } from '../api/devices.js';
import SectionHeader from '../components/SectionHeader.jsx';
import Button from '../components/Button.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Modal from '../components/Modal.jsx';
import { formatMegabytes } from '../utils/formatting.js';

function InfoCard({ icon: Icon, label, value, subtitle, color = 'cyber' }) {
  const colorClasses = {
    cyber: 'bg-cyber-400/10 border-cyber-400/20 text-cyber-400',
    pulse: 'bg-pulse/10 border-pulse/20 text-pulse',
    warning: 'bg-warning/10 border-warning/20 text-warning',
    danger: 'bg-danger/10 border-danger/20 text-danger',
  };

  return (
    <div className="rounded-2xl glass-card glow-border p-5 transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-start gap-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${colorClasses[color]}`}>
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-[0.25em] text-steel font-semibold">{label}</p>
          <p className="mt-1 font-display text-xl font-bold text-ghost truncate">{value}</p>
          {subtitle && <p className="mt-1 text-sm text-mist">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

function DeviceDetailPage() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const deviceQuery = useQuery({
    queryKey: ['devices', deviceId],
    queryFn: () => getDeviceDetails(deviceId),
    enabled: Boolean(deviceId),
  });

  const historyQuery = useQuery({
    queryKey: ['deviceHistory', deviceId],
    queryFn: () => getDeviceHistory(deviceId),
    enabled: Boolean(deviceId),
  });

  const device = deviceQuery.data;
  const history = historyQuery.data?.historico || [];

  const deleteMutation = useMutation({
    mutationFn: () => deleteDevice(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      navigate('/devices');
    },
  });

  if (deviceQuery.isLoading) {
    return <LoadingState message="Carregando detalhes do dispositivo..." />;
  }

  if (deviceQuery.isError) {
    return (
      <ErrorState
        message="Não foi possível carregar os dados do dispositivo."
        onRetry={() => deviceQuery.refetch()}
      />
    );
  }

  if (!device) {
    return <ErrorState message="Dispositivo não encontrado." onRetry={() => navigate('/devices')} />;
  }

  const dispositivo = device.dispositivo || {};
  const estatisticas = device.estatisticas || {};
  const historico = device.historico || [];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <SectionHeader
          title={dispositivo.nome || 'Dispositivo'}
          subtitle={
            dispositivo.numero
              ? `IMEI ${dispositivo.imei} — Número ${dispositivo.numero} — monitorando desde ${dayjs(dispositivo.createdAt).format('DD/MM/YYYY')}`
              : `IMEI ${dispositivo.imei} — monitorando desde ${dayjs(dispositivo.createdAt).format('DD/MM/YYYY')}`
          }
        />
        <Button variant="danger" onClick={() => setDeleteModalOpen(true)} className="flex items-center gap-2">
          <FiTrash2 size={16} />
          Remover dispositivo
        </Button>
      </div>

      {/* Device Info Cards */}
      <div>
        <h3 className="flex items-center gap-2 text-lg font-bold text-ghost mb-6">
          <FiSmartphone className="text-cyber-400" size={20} />
          Informações do Dispositivo
        </h3>
        <div className="grid gap-4 lg:grid-cols-3">
          <InfoCard
            icon={FiCpu}
            label="IMEI"
            value={dispositivo.imei || 'N/A'}
            subtitle="Identificação única do equipamento"
            color="cyber"
          />
          <InfoCard
            icon={FiUser}
            label="Nome do Usuário"
            value={dispositivo.nome || 'N/A'}
            subtitle="Nome cadastrado no sistema"
            color="pulse"
          />
          <InfoCard
            icon={FiPhone}
            label="Telefone"
            value={dispositivo.numero || 'Não informado'}
            subtitle="Contato do usuário"
            color="warning"
          />
          <InfoCard
            icon={FiCalendar}
            label="Data de Cadastro"
            value={dayjs(dispositivo.createdAt).format('DD/MM/YYYY')}
            subtitle={`${dayjs(dispositivo.createdAt).format('HH:mm')} — Início do monitoramento`}
            color="cyber"
          />
          <InfoCard
            icon={FiClock}
            label="Última Atualização"
            value={dispositivo.updatedAt ? dayjs(dispositivo.updatedAt).format('DD/MM/YYYY') : 'N/A'}
            subtitle={dispositivo.updatedAt ? `${dayjs(dispositivo.updatedAt).format('HH:mm')} — Última sincronização` : 'Sem atualizações'}
            color="cyber"
          />
          <InfoCard
            icon={FiActivity}
            label="Status"
            value={estatisticas.totalRegistros > 0 ? 'Ativo' : 'Inativo'}
            subtitle={estatisticas.totalRegistros > 0 ? 'Enviando dados regularmente' : 'Sem registros recentes'}
            color={estatisticas.totalRegistros > 0 ? 'pulse' : 'danger'}
          />
        </div>
      </div>

      {/* Usage Stats */}
      <div>
        <h3 className="flex items-center gap-2 text-lg font-bold text-ghost mb-6">
          <FiDatabase className="text-pulse" size={20} />
          Estatísticas de Consumo
        </h3>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl glass-card glow-border p-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-steel font-semibold">Consumo Total</p>
            <p className="mt-3 font-display text-4xl font-bold text-gradient-cyber">
              {formatMegabytes(estatisticas.totalUsage || 0)}
            </p>
            <p className="mt-2 text-sm text-mist">
              Acumulado no banco de dados ({estatisticas.totalRegistros} registros)
            </p>
          </div>
          <div className="rounded-2xl glass-card glow-border p-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-steel font-semibold">Média Diária</p>
            <p className="mt-3 font-display text-4xl font-bold text-ghost">
              {formatMegabytes(estatisticas.mediaDiaria || 0)}
            </p>
            <p className="mt-2 text-sm text-mist">
              Baseada nos registros disponíveis
            </p>
          </div>
          <div className="rounded-2xl glass-card glow-border p-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-steel font-semibold">Últimos 7 Dias</p>
            <p className="mt-3 font-display text-4xl font-bold text-ghost">
              {formatMegabytes(estatisticas.totalUltimos7Dias || 0)}
            </p>
            <p className="mt-2 text-sm text-mist">
              Consumo recente do período
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h3 className="flex items-center gap-2 text-lg font-bold text-ghost mb-6">
          <FiClock className="text-warning" size={20} />
          Timeline de Atividade
        </h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl glass-card glow-border p-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-steel font-semibold">Primeiro Registro</p>
            <p className="mt-3 font-display text-2xl font-bold text-ghost">
              {estatisticas.primeiroRegistro ? formatMegabytes(estatisticas.primeiroRegistro.megabytes) : 'N/A'}
            </p>
            <p className="mt-2 text-sm text-mist">
              {estatisticas.primeiroRegistro ? dayjs(estatisticas.primeiroRegistro.data).format('DD/MM/YYYY HH:mm') : 'Sem registros'}
            </p>
          </div>
          <div className="rounded-2xl glass-card glow-border p-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-steel font-semibold">Último Registro</p>
            <p className="mt-3 font-display text-2xl font-bold text-ghost">
              {estatisticas.ultimoRegistro ? formatMegabytes(estatisticas.ultimoRegistro.megabytes) : 'N/A'}
            </p>
            <p className="mt-2 text-sm text-mist">
              {estatisticas.ultimoRegistro ? dayjs(estatisticas.ultimoRegistro.data).format('DD/MM/YYYY HH:mm') : 'Sem registros'}
            </p>
          </div>
        </div>
      </div>

      {/* IMEI Technical Info */}
      <div>
        <h3 className="flex items-center gap-2 text-lg font-bold text-ghost mb-6">
          <FiCpu className="text-cyber-400" size={20} />
          Informações Técnicas do IMEI
        </h3>
        <div className="rounded-2xl glass-card glow-border p-6">
          <div className="grid gap-6 lg:grid-cols-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-steel font-semibold">Tipo de IMEI</p>
              <p className="mt-2 font-display text-lg font-bold text-ghost">
                {dispositivo.imei && dispositivo.imei.length === 15 ? 'IMEI Padrão' : 'IMEI Inválido'}
              </p>
              <p className="mt-1 text-sm text-mist">Formato de 15 dígitos</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-steel font-semibold">Código do País</p>
              <p className="mt-2 font-display text-lg font-bold text-cyber-300 font-mono">
                {dispositivo.imei ? dispositivo.imei.substring(0, 2) : 'N/A'}
              </p>
              <p className="mt-1 text-sm text-mist">Código de registro</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-steel font-semibold">Código Fabricante</p>
              <p className="mt-2 font-display text-lg font-bold text-cyber-300 font-mono">
                {dispositivo.imei ? dispositivo.imei.substring(2, 8) : 'N/A'}
              </p>
              <p className="mt-1 text-sm text-mist">Identificação TAC</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-steel font-semibold">Código Modelo</p>
              <p className="mt-2 font-display text-lg font-bold text-cyber-300 font-mono">
                {dispositivo.imei ? dispositivo.imei.substring(6, 8) : 'N/A'}
              </p>
              <p className="mt-1 text-sm text-mist">Modelo específico</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-cyber-400/10">
            <p className="text-[10px] uppercase tracking-[0.25em] text-steel font-semibold mb-4">Estrutura Completa do IMEI</p>
            <div className="flex flex-wrap gap-2">
              {dispositivo.imei && dispositivo.imei.split('').map((digit, index) => (
                <div
                  key={index}
                  className="w-9 h-9 rounded-lg bg-cyber-400/10 border border-cyber-400/20 flex items-center justify-center transition-all hover:bg-cyber-400/20 hover:border-cyber-400/40"
                >
                  <span className="text-sm font-mono font-bold text-cyber-300">{digit}</span>
                </div>
              ))}
              {(!dispositivo.imei || dispositivo.imei.length !== 15) && (
                <div className="text-center text-mist py-4">
                  IMEI não disponível ou inválido
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Network Usage */}
      {Object.keys(estatisticas.usoPorRede || {}).length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-ghost mb-6">
            <FiWifi className="text-pulse" size={20} />
            Uso por Tipo de Rede
          </h3>
          <div className="grid gap-3">
            {Object.entries(estatisticas.usoPorRede).map(([rede, consumo]) => (
              <div key={rede} className="flex justify-between items-center p-4 rounded-xl glass-card glow-border">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-cyber-400" style={{ boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)' }} />
                  <span className="text-ghost font-medium">{rede}</span>
                </div>
                <span className="text-cyber-300 font-bold font-mono">{formatMegabytes(consumo)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* App Usage Table */}
      <div>
        <h3 className="flex items-center gap-2 text-lg font-bold text-ghost mb-6">
          <FiActivity className="text-warning" size={20} />
          Consumo por Aplicativo (Mês Atual)
        </h3>
        {device.appsUsage && device.appsUsage.length > 0 ? (
          <div className="rounded-2xl glass-card glow-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cyber-400/10">
                    <th className="px-6 py-4 text-left text-[10px] font-semibold text-steel uppercase tracking-wider">
                      Aplicativo
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-semibold text-steel uppercase tracking-wider">
                      Pacote
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-semibold text-steel uppercase tracking-wider">
                      Dados Móveis
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-semibold text-steel uppercase tracking-wider">
                      Wi‑Fi
                    </th>
                    <th className="px-6 py-4 text-right text-[10px] font-semibold text-steel uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {device.appsUsage
                    .filter(app => app.total_mb >= 10)
                    .sort((a, b) => b.total_mb - a.total_mb)
                    .map((app, index) => (
                      <tr key={index} className="border-b border-cyber-400/5 last:border-none table-row-hover transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-ghost">
                          {app.app}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-mist font-mono text-xs">
                          {app.package}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-ghost">
                          {formatMegabytes(app.mobile_mb)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-mist">
                          {formatMegabytes(app.wifi_mb)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-cyber-300 text-right font-mono">
                          {formatMegabytes(app.total_mb)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl glass-card glow-border p-12 text-center">
            <p className="text-mist">Nenhum dado de consumo por aplicativo disponível para o mês atual.</p>
          </div>
        )}
      </div>

      {/* Recent History */}
      {historico.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-ghost mb-6">
            <FiClock className="text-cyber-400" size={20} />
            Histórico Recente
          </h3>
          <div className="rounded-2xl glass-card glow-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cyber-400/10">
                    <th className="px-6 py-4 text-left text-[10px] font-semibold text-steel uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-semibold text-steel uppercase tracking-wider">
                      Consumo
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-semibold text-steel uppercase tracking-wider">
                      Rede
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-semibold text-steel uppercase tracking-wider">
                      Descrição
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {historico.map((entry) => (
                    <tr key={entry.id} className="border-b border-cyber-400/5 last:border-none table-row-hover transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-mist font-mono">
                        {dayjs(entry.recordedAt).format('DD/MM/YYYY HH:mm')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-cyber-300 font-mono">
                        {formatMegabytes(entry.megabytes)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-mist">
                        {entry.networkType}
                      </td>
                      <td className="px-6 py-4 text-sm text-mist">
                        {entry.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Monthly History */}
      <div>
        <h3 className="flex items-center gap-2 text-lg font-bold text-ghost mb-6">
          <FiCalendar className="text-pulse" size={20} />
          Histórico Mensal (Consumo Fechado)
        </h3>
        {history.length > 0 ? (
          <div className="rounded-2xl glass-card glow-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cyber-400/10">
                    <th className="px-6 py-4 text-left text-[10px] font-semibold text-steel uppercase tracking-wider">
                      Mês/Ano
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-semibold text-steel uppercase tracking-wider">
                      Consumo Total
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-semibold text-steel uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-semibold text-steel uppercase tracking-wider">
                      Gerado em
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry, index) => (
                    <tr key={index} className="border-b border-cyber-400/5 last:border-none table-row-hover transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-ghost">
                        {dayjs(entry.data).format('MM/YYYY')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-cyber-300 font-mono">
                        {formatMegabytes(entry.megabytes)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-mist">
                        {entry.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-steel font-mono">
                        {dayjs(entry.geradoEm).format('DD/MM/YYYY HH:mm')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl glass-card glow-border p-12 text-center">
            <p className="text-mist">Nenhum histórico mensal disponível ainda. Os snapshots são gerados ao final de cada mês.</p>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <Modal open={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Remover dispositivo">
        <div className="space-y-6">
          <p className="text-mist">
            Tem certeza que deseja remover <strong className="text-ghost">{dispositivo.nome || 'este dispositivo'}</strong>? Todos os dados associados serão excluídos.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-cyber-400/10">
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)} disabled={deleteMutation.isLoading}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isLoading}>
              {deleteMutation.isLoading ? 'Removendo...' : 'Remover'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DeviceDetailPage;
