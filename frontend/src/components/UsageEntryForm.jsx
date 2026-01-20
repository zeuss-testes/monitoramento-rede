import { useState } from 'react';
import Button from './Button.jsx';
import { FiDatabase, FiWifi, FiClock, FiFileText } from 'react-icons/fi';

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
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-ghost flex items-center gap-2">
            <FiDatabase className="text-cyber-400" size={14} />
            Consumo registrado (MB)
          </span>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            name="megabytes"
            value={form.megabytes}
            onChange={handleChange}
            placeholder="Ex: 512"
            className="rounded-xl border border-cyber-400/20 bg-space/80 px-4 py-3 text-ghost placeholder:text-steel focus:border-cyber-400 focus:outline-none focus:ring-1 focus:ring-cyber-400/30 transition-all font-mono"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-ghost flex items-center gap-2">
            <FiWifi className="text-cyber-400" size={14} />
            Rede
          </span>
          <select
            name="networkType"
            value={form.networkType}
            onChange={handleChange}
            className="rounded-xl border border-cyber-400/20 bg-space/80 px-4 py-3 text-ghost focus:border-cyber-400 focus:outline-none focus:ring-1 focus:ring-cyber-400/30 transition-all"
          >
            {networkOptions.map((option) => (
              <option key={option} value={option} className="bg-space">
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-ghost flex items-center gap-2">
            <FiClock className="text-cyber-400" size={14} />
            Data e hora
          </span>
          <input
            type="datetime-local"
            name="recordedAt"
            value={form.recordedAt}
            onChange={handleChange}
            className="rounded-xl border border-cyber-400/20 bg-space/80 px-4 py-3 text-ghost focus:border-cyber-400 focus:outline-none focus:ring-1 focus:ring-cyber-400/30 transition-all font-mono"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm sm:col-span-2">
          <span className="font-semibold text-ghost flex items-center gap-2">
            <FiFileText className="text-cyber-400" size={14} />
            Descrição
          </span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            placeholder="Ex: Atualização do app de campo"
            className="rounded-xl border border-cyber-400/20 bg-space/80 px-4 py-3 text-ghost placeholder:text-steel focus:border-cyber-400 focus:outline-none focus:ring-1 focus:ring-cyber-400/30 transition-all resize-none"
          />
        </label>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-cyber-400/10">
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
