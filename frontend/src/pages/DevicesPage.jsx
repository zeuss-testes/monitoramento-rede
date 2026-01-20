import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { FiServer, FiDatabase, FiClock, FiSmartphone } from 'react-icons/fi';
import { listDevices, updateDevice, deleteDevice } from '../api/devices.js';
import SectionHeader from '../components/SectionHeader.jsx';
import Button from '../components/Button.jsx';
import DeviceCard from '../components/DeviceCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Modal from '../components/Modal.jsx';
import DeviceForm from '../components/DeviceForm.jsx';
import { formatMegabytes } from '../utils/formatting.js';

function DevicesPage() {
  const queryClient = useQueryClient();
  const [editDevice, setEditDevice] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const devicesQuery = useQuery({
    queryKey: ['devices'],
    queryFn: () => listDevices(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateDevice(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      setEditDevice(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      setConfirmDelete(null);
    },
  });

  const totals = useMemo(() => {
    if (!devicesQuery.data) return { count: 0, withLimit: 0, usage: 0 };
    const devices = devicesQuery.data;
    const usage = devices.reduce((sum, device) => sum + Number(device.usage?.totalMb || 0), 0);
    const withLimit = devices.filter((device) => device.dataLimitMb).length;
    return {
      count: devices.length,
      withLimit,
      usage,
    };
  }, [devicesQuery.data]);

  if (devicesQuery.isLoading) {
    return <LoadingState message="Carregando dispositivos..." />;
  }

  if (devicesQuery.isError) {
    return (
      <ErrorState
        message="Não foi possível carregar os dispositivos."
        onRetry={() => devicesQuery.refetch()}
      />
    );
  }

  const devices = devicesQuery.data || [];

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SectionHeader
          title="Inventário de Dispositivos"
          subtitle="Gerencie franquias de dados e acompanhe o consumo de cada linha monitorada"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 rounded-2xl glass-card glow-border p-6">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyber-400/10 border border-cyber-400/20">
              <FiSmartphone className="text-cyber-400" size={22} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-steel font-semibold">Total</p>
              <p className="mt-1 font-display text-3xl font-bold text-ghost">{totals.count}</p>
              <p className="text-sm text-mist">Dispositivos cadastrados</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pulse/10 border border-pulse/20">
              <FiServer className="text-pulse" size={22} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-steel font-semibold">Com franquia</p>
              <p className="mt-1 font-display text-3xl font-bold text-ghost">{totals.withLimit}</p>
              <p className="text-sm text-mist">Linhas com limite</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 border border-warning/20">
              <FiDatabase className="text-warning" size={22} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-steel font-semibold">Consumo total</p>
              <p className="mt-1 font-display text-3xl font-bold text-ghost">{formatMegabytes(totals.usage)}</p>
              <div className="flex items-center gap-1.5 text-sm text-mist">
                <FiClock size={12} />
                <span>Atualizado {dayjs().format('HH:mm')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {devices.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {devices.map((device) => (
            <DeviceCard
              key={device.imei}
              device={device}
              onEdit={() => setEditDevice(device)}
              onDelete={() => setConfirmDelete(device)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhum dispositivo cadastrado"
          description="Instale o aplicativo de celular nos dispositivos que deseja monitorar. Eles aparecerão aqui automaticamente quando forem usados."
        />
      )}

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

      <Modal
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Remover dispositivo"
      >
        <div className="space-y-6">
          <p className="text-mist">
            Tem certeza que deseja remover o dispositivo <strong className="text-ghost">{confirmDelete?.name}</strong>? Todos os registros de
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

export default DevicesPage;
