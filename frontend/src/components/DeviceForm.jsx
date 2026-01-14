import { useState, useEffect } from 'react';
import Button from './Button.jsx';

const initialState = {
  name: '',
  simNumber: '',
  dataLimitMb: '',
};

function DeviceForm({ onSubmit, onCancel, submitting, defaultValues }) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (defaultValues) {
      setForm({
        name: defaultValues.name || '',
        simNumber: defaultValues.simNumber || '',
        dataLimitMb: defaultValues.dataLimitMb ? String(defaultValues.dataLimitMb) : '',
      });
    }
  }, [defaultValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      name: form.name.trim(),
      simNumber: form.simNumber.trim() || null,
      dataLimitMb: form.dataLimitMb ? Number(form.dataLimitMb) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-white/70">
          <span className="font-medium text-white">Nome do dispositivo</span>
          <input
            required
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ex: Roteador de Vendas Sul"
            className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white focus:border-primary-400 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-white/70">
          <span className="font-medium text-white">Número do SIM</span>
          <input
            name="simNumber"
            value={form.simNumber}
            onChange={handleChange}
            placeholder="DDD + número"
            className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white focus:border-primary-400 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-white/70">
          <span className="font-medium text-white">Franquia mensal (MB)</span>
          <input
            name="dataLimitMb"
            type="number"
            min="0"
            step="1"
            value={form.dataLimitMb}
            onChange={handleChange}
            placeholder="Ex: 100000"
            className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white focus:border-primary-400 focus:outline-none"
          />
        </label>
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
}

export default DeviceForm;
