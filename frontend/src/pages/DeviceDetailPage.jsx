import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { getDeviceDetails, deleteDevice, getDeviceHistory } from '../api/devices.js';
import SectionHeader from '../components/SectionHeader.jsx';
import Button from '../components/Button.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Modal from '../components/Modal.jsx';
import { formatMegabytes } from '../utils/formatting.js';

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
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <SectionHeader
          title={dispositivo.nome || 'Dispositivo'}
          subtitle={
            dispositivo.numero
              ? `IMEI ${dispositivo.imei} — Número ${dispositivo.numero} — monitorando desde ${dayjs(dispositivo.createdAt).format('DD/MM/YYYY')}`
              : `IMEI ${dispositivo.imei} — monitorando desde ${dayjs(dispositivo.createdAt).format('DD/MM/YYYY')}`
          }
          action={
            <div className="flex flex-wrap gap-3">
              <Button variant="ghost" onClick={() => setDeleteModalOpen(true)}>
                Remover dispositivo
              </Button>
            </div>
          }
        />
      </div>

      {/* Informações Completas do Dispositivo */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Informações Completas do Dispositivo</h3>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/5 bg-white/5 p-6 shadow-card backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">IMEI do Dispositivo</p>
            <p className="mt-2 font-display text-2xl font-semibold text-white break-all">
              {dispositivo.imei || 'N/A'}
            </p>
            <p className="mt-2 text-sm text-white/60">
              Identificação única internacional de equipamento móvel
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/5 p-6 shadow-card backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Nome do Usuário</p>
            <p className="mt-2 font-display text-2xl font-semibold text-white">
              {dispositivo.nome || 'N/A'}
            </p>
            <p className="mt-2 text-sm text-white/60">
              Nome cadastrado no sistema
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/5 p-6 shadow-card backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Número de Telefone</p>
            <p className="mt-2 font-display text-2xl font-semibold text-white">
              {dispositivo.numero || 'Não informado'}
            </p>
            <p className="mt-2 text-sm text-white/60">
              Contato do usuário
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/5 p-6 shadow-card backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Data de Cadastro</p>
            <p className="mt-2 font-display text-2xl font-semibold text-white">
              {dayjs(dispositivo.createdAt).format('DD/MM/YYYY')}
            </p>
            <p className="mt-2 text-sm text-white/60">
              {dayjs(dispositivo.createdAt).format('HH:mm')} — Início do monitoramento
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/5 p-6 shadow-card backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Última Atualização</p>
            <p className="mt-2 font-display text-2xl font-semibold text-white">
              {dispositivo.updatedAt ? dayjs(dispositivo.updatedAt).format('DD/MM/YYYY') : 'N/A'}
            </p>
            <p className="mt-2 text-sm text-white/60">
              {dispositivo.updatedAt ? dayjs(dispositivo.updatedAt).format('HH:mm') : 'Sem atualizações'} — Última sincronização
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/5 p-6 shadow-card backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Status do Dispositivo</p>
            <p className="mt-2 font-display text-2xl font-semibold text-green-400">
              {estatisticas.totalRegistros > 0 ? 'Ativo' : 'Inativo'}
            </p>
            <p className="mt-2 text-sm text-white/60">
              {estatisticas.totalRegistros > 0 ? 'Enviando dados regularmente' : 'Sem registros recentes'}
            </p>
          </div>
        </div>
      </div>

      {/* Estatísticas de Uso Detalhadas */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Estatísticas de Consumo Detalhadas</h3>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/5 bg-white/5 p-6 shadow-card backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Consumo Total</p>
            <p className="mt-2 font-display text-3xl font-semibold text-white">
              {formatMegabytes(estatisticas.totalUsage || 0)}
            </p>
            <p className="mt-2 text-sm text-white/60">
              Acumulado no banco de dados ({estatisticas.totalRegistros} registros)
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/5 p-6 shadow-card backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Média Diária</p>
            <p className="mt-2 font-display text-3xl font-semibold text-white">
              {formatMegabytes(estatisticas.mediaDiaria || 0)}
            </p>
            <p className="mt-2 text-sm text-white/60">
              Baseada nos {estatisticas.totalRegistros} registros disponíveis
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/5 p-6 shadow-card backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Últimos 7 Dias</p>
            <p className="mt-2 font-display text-3xl font-semibold text-white">
              {formatMegabytes(estatisticas.totalUltimos7Dias || 0)}
            </p>
            <p className="mt-2 text-sm text-white/60">
              Consumo recente do período
            </p>
          </div>
        </div>
      </div>

      {/* Timeline de Atividade */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Timeline de Atividade</h3>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/5 bg-white/5 p-6 shadow-card backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Primeiro Registro</p>
            <p className="mt-2 font-display text-xl font-semibold text-white">
              {estatisticas.primeiroRegistro ? formatMegabytes(estatisticas.primeiroRegistro.megabytes) : 'N/A'}
            </p>
            <p className="mt-2 text-sm text-white/60">
              {estatisticas.primeiroRegistro ? dayjs(estatisticas.primeiroRegistro.data).format('DD/MM/YYYY HH:mm') : 'Sem registros'}
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/5 p-6 shadow-card backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Último Registro</p>
            <p className="mt-2 font-display text-xl font-semibold text-white">
              {estatisticas.ultimoRegistro ? formatMegabytes(estatisticas.ultimoRegistro.megabytes) : 'N/A'}
            </p>
            <p className="mt-2 text-sm text-white/60">
              {estatisticas.ultimoRegistro ? dayjs(estatisticas.ultimoRegistro.data).format('DD/MM/YYYY HH:mm') : 'Sem registros'}
            </p>
          </div>
        </div>
      </div>

      {/* Informações Técnicas do IMEI */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Informações Técnicas do IMEI</h3>
        <div className="rounded-2xl border border-white/5 bg-white/5 p-6 shadow-card backdrop-blur">
          <div className="grid gap-6 lg:grid-cols-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Tipo de IMEI</p>
              <p className="mt-2 font-display text-lg font-semibold text-white">
                {dispositivo.imei && dispositivo.imei.length === 15 ? 'IMEI Padrão' : 'IMEI Inválido'}
              </p>
              <p className="mt-1 text-sm text-white/60">
                Formato de 15 dígitos
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Código do País</p>
              <p className="mt-2 font-display text-lg font-semibold text-white">
                {dispositivo.imei ? dispositivo.imei.substring(0, 2) : 'N/A'}
              </p>
              <p className="mt-1 text-sm text-white/60">
                Código de registro do fabricante
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Código do Fabricante</p>
              <p className="mt-2 font-display text-lg font-semibold text-white">
                {dispositivo.imei ? dispositivo.imei.substring(2, 8) : 'N/A'}
              </p>
              <p className="mt-1 text-sm text-white/60">
                Identificação do fabricante (TAC)
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Código do Modelo</p>
              <p className="mt-2 font-display text-lg font-semibold text-white">
                {dispositivo.imei ? dispositivo.imei.substring(6, 8) : 'N/A'}
              </p>
              <p className="mt-1 text-sm text-white/60">
                Identificação do modelo específico
              </p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-3">Estrutura Completa do IMEI</p>
            <div className="flex flex-wrap gap-2">
              {dispositivo.imei && dispositivo.imei.split('').map((digit, index) => (
                <div key={index} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="text-sm font-mono text-white">{digit}</span>
                </div>
              ))}
              {(!dispositivo.imei || dispositivo.imei.length !== 15) && (
                <div className="col-span-15 text-center text-white/60 py-4">
                  IMEI não disponível ou inválido
                </div>
              )}
            </div>
            <div className="mt-3 text-sm text-white/60">
              <p>• Posições 1-2: Código do país</p>
              <p>• Posições 3-8: Código do fabricante (TAC)</p>
              <p>• Posições 9-14: Número de série</p>
              <p>• Posição 15: Dígito verificador (Luhn)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Uso por Tipo de Rede */}
      {Object.keys(estatisticas.usoPorRede || {}).length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-6">Uso por Tipo de Rede</h3>
          <div className="grid gap-4">
            {Object.entries(estatisticas.usoPorRede).map(([rede, consumo]) => (
              <div key={rede} className="flex justify-between items-center p-4 rounded-xl border border-white/5 bg-white/5">
                <span className="text-white font-medium">{rede}</span>
                <span className="text-white font-semibold">{formatMegabytes(consumo)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Consumo por Aplicativo (Mês Atual) */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Consumo por Aplicativo (Mês Atual)</h3>
        {device.appsUsage && device.appsUsage.length > 0 ? (
          <div className="rounded-2xl border border-white/5 bg-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                      Aplicativo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                      Pacote
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                      Dados Móveis
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                      Wi‑Fi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {device.appsUsage
                    .filter(app => app.total_mb >= 10)
                    .sort((a, b) => b.total_mb - a.total_mb)
                    .map((app, index) => (
                      <tr key={index} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {app.app}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80 font-mono">
                          {app.package}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {formatMegabytes(app.mobile_mb)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                          {formatMegabytes(app.wifi_mb)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                          {formatMegabytes(app.total_mb)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/5 bg-white/5 p-12 text-center">
            <p className="text-white/60">Nenhum dado de consumo por aplicativo disponível para o mês atual.</p>
          </div>
        )}
      </div>

      {/* Histórico Recente */}
      {historico.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-6">Histórico Recente</h3>
          <div className="rounded-2xl border border-white/5 bg-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                      Consumo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                      Rede
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                      Descrição
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {historico.map((entry) => (
                    <tr key={entry.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                        {dayjs(entry.recordedAt).format('DD/MM/YYYY HH:mm')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {formatMegabytes(entry.megabytes)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                        {entry.networkType}
                      </td>
                      <td className="px-6 py-4 text-sm text-white/80">
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

      {/* Histórico Mensal (Snapshots) */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Histórico Mensal (Consumo Fechado)</h3>
        {history.length > 0 ? (
          <div className="rounded-2xl border border-white/5 bg-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                      Mês/Ano
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                      Consumo Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                      Gerado em
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {history.map((entry, index) => (
                    <tr key={index} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {dayjs(entry.data).format('MM/YYYY')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                        {formatMegabytes(entry.megabytes)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                        {entry.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                        {dayjs(entry.geradoEm).format('DD/MM/YYYY HH:mm')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/5 bg-white/5 p-12 text-center">
            <p className="text-white/60">Nenhum histórico mensal disponível ainda. Os snapshots são gerados ao final de cada mês.</p>
          </div>
        )}
      </div>

      <Modal open={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Remover dispositivo">
        <div className="space-y-6 text-white/80">
          <p>
            Tem certeza que deseja remover <strong>{dispositivo.nome || 'este dispositivo'}</strong>? Todos os dados associados serão excluídos.
          </p>
          <div className="flex justify-end gap-3">
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
