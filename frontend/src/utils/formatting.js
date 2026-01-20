export const formatMegabytes = (value) => {
  const num = Number(value || 0);
  if (Number.isNaN(num)) {
    return '0 MB';
  }

  // Operadoras e valores do Turso usam base decimal (1000),
  // então mantemos a divisão por 1000 para evitar perder ~200MB na exibição.
  if (num >= 1000) {
    return `${(num / 1000).toFixed(2)} GB`;
  }

  return `${num.toFixed(0)} MB`;
};

export const formatDateTime = (isoString) => {
  if (!isoString) return '—';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
