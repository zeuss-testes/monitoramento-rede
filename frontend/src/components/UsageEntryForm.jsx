import { useState } from 'react';
import Button from './Button.jsx';

const networkOptions = ['4G', '5G', 'LTE', '3G', 'WI-FI'];

const initialState = {
  megabytes: '',
  networkType: '4G',
  description: '',
  recordedAt: new Date().toISOString().slice(0, 16),
};

function UsageEntryForm({ onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(initialState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      megabytes: Number(form.megabytes),
      networkType: form.networkType,
      description: form.description.trim() || null,
      recordedAt: form.recordedAt ? new Date(form.recordedAt).toISOString() : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-white/70">
          <span className="font-medium text-white">Consumo registrado (MB)</span>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            name="megabytes"
            value={form.megabytes}
            onChange={handleChange}
            placeholder="Ex: 512"
            className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white focus:border-primary-400 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-white/70">
          <span className="font-medium text-white">Rede</span>
          <select
            name="networkType"
            value={form.networkType}
            onChange={handleChange}
            className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white focus:border-primary-400 focus:outline-none"
          >
            {networkOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm text-white/70">
          <span className="font-medium text-white">Data e hora</span>
          <input
            type="datetime-local"
            name="recordedAt"
            value={form.recordedAt}
            onChange={handleChange}
            className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white focus:border-primary-400 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-white/70 sm:col-span-2">
          <span className="font-medium text-white">Descrição</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            placeholder="Ex: Atualização do app de campo"
            className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white focus:border-primary-400 focus:outline-none"
          />
        </label>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" type="button" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Registrando...' : 'Registrar consumo'}
        </Button>
      </div>
    </form>
  );
}

export default UsageEntryForm;
