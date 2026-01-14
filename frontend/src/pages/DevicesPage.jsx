import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
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

      <div className="grid gap-4 rounded-3xl border border-white/5 bg-white/5 p-6 shadow-card backdrop-blur">
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Total</p>
            <p className="mt-2 font-display text-2xl font-semibold text-white">{totals.count}</p>
            <p className="text-sm text-white/60">Dispositivos cadastrados</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Com franquia</p>
            <p className="mt-2 font-display text-2xl font-semibold text-white">{totals.withLimit}</p>
            <p className="text-sm text-white/60">Linhas com limite configurado</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Consumo total</p>
            <p className="mt-2 font-display text-2xl font-semibold text-white">{formatMegabytes(totals.usage)}</p>
            <p className="text-sm text-white/60">
              Atualizado em {dayjs().format('DD/MM/YYYY [às] HH:mm')}
            </p>
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
          onSubmit={(payload) => updateMutation.mutate({ id: editDevice.imei, payload })}
        />
      </Modal>

      <Modal
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Remover dispositivo"
      >
        <div className="space-y-6 text-white/80">
          <p>
            Tem certeza que deseja remover o dispositivo <strong>{confirmDelete?.name}</strong>? Todos os registros de
            consumo associados serão excluídos.
          </p>
          <div className="flex justify-end gap-3">
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
