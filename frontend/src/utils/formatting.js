export const formatMegabytes = (value) => {
  const num = Number(value || 0);
  if (Number.isNaN(num)) {
    return '0 MB';
  }

  if (num >= 1024) {
    return `${(num / 1024).toFixed(2)} GB`;
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
