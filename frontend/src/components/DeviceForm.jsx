import { useState, useEffect } from 'react';
import Button from './Button.jsx';
import { FiSmartphone, FiCreditCard, FiDatabase } from 'react-icons/fi';

const initialState = {
  name: '',
  imei: '',
  simNumber: '',
  dataLimitMb: '',
};

function DeviceForm({ onSubmit, onCancel, submitting, defaultValues }) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (defaultValues) {
      setForm({
        name: defaultValues.name || '',
        imei: defaultValues.imei || '',
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
      imei: form.imei.trim(),
      simNumber: form.simNumber.trim() || null,
      dataLimitMb: form.dataLimitMb ? Number(form.dataLimitMb) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-ghost flex items-center gap-2">
            <FiSmartphone className="text-cyber-400" size={14} />
            Nome do dispositivo
          </span>
          <input
            required
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ex: Roteador de Vendas Sul"
            className="rounded-xl border border-cyber-400/20 bg-space/80 px-4 py-3 text-ghost placeholder:text-steel focus:border-cyber-400 focus:outline-none focus:ring-1 focus:ring-cyber-400/30 transition-all"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-ghost flex items-center gap-2">
            <FiSmartphone className="text-cyber-400" size={14} />
            IMEI
          </span>
          <input
            required
            name="imei"
            value={form.imei}
            onChange={handleChange}
            placeholder="Ex: 123456789012345"
            className="rounded-xl border border-cyber-400/20 bg-space/80 px-4 py-3 text-ghost placeholder:text-steel focus:border-cyber-400 focus:outline-none focus:ring-1 focus:ring-cyber-400/30 transition-all font-mono"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-ghost flex items-center gap-2">
            <FiCreditCard className="text-cyber-400" size={14} />
            Número do SIM
          </span>
          <input
            name="simNumber"
            value={form.simNumber}
            onChange={handleChange}
            placeholder="DDD + número"
            className="rounded-xl border border-cyber-400/20 bg-space/80 px-4 py-3 text-ghost placeholder:text-steel focus:border-cyber-400 focus:outline-none focus:ring-1 focus:ring-cyber-400/30 transition-all font-mono"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm sm:col-span-2">
          <span className="font-semibold text-ghost flex items-center gap-2">
            <FiDatabase className="text-cyber-400" size={14} />
            Franquia mensal (MB)
          </span>
          <input
            name="dataLimitMb"
            type="number"
            min="0"
            step="1"
            value={form.dataLimitMb}
            onChange={handleChange}
            placeholder="Ex: 100000"
            className="rounded-xl border border-cyber-400/20 bg-space/80 px-4 py-3 text-ghost placeholder:text-steel focus:border-cyber-400 focus:outline-none focus:ring-1 focus:ring-cyber-400/30 transition-all font-mono"
          />
        </label>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-cyber-400/10">
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
