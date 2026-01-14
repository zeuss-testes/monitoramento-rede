const express = require('express');
const dayjs = require('dayjs');
const isoWeek = require('dayjs/plugin/isoWeek');

dayjs.extend(isoWeek);
const { all } = require('../db');

const router = express.Router();

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const normalized = String(value).replace(',', '.');
  const num = Number(normalized);
  return Number.isFinite(num) ? num : 0;
};

const parseRange = (startDate, endDate) => {
  const start = startDate ? dayjs(startDate).startOf('day') : dayjs().startOf('month');
  const end = endDate ? dayjs(endDate).endOf('day') : dayjs().endOf('day');

  if (!start.isValid() || !end.isValid()) {
    const error = new Error('Invalid date range');
    error.status = 400;
    throw error;
  }

  if (end.isBefore(start)) {
    const error = new Error('endDate must be after startDate');
    error.status = 400;
    throw error;
  }

  return { start, end };
};

router.get('/overview', async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const { start, end } = parseRange(startDate, endDate);

    const rows = await all(
      `SELECT f.id,
              f.imei,
              f.nome,
              f.numero,
              f.consumo_total,
              f.created_at
       FROM registros_usuarios f
       ORDER BY f.nome ASC`,
      []
    );

    const devices = rows.map((row) => ({
      id: row.id,
      imei: row.imei,
      name: row.nome,
      numero: row.numero,
      consumoTotal: parseNumber(row.consumo_total),
      usage: {
        totalMb: parseNumber(row.consumo_total),
      },
    }));

    const totalUsage = devices.reduce((sum, item) => sum + parseNumber(item.usage.totalMb), 0);

    res.json({
      range: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
      totals: {
        devices: devices.length,
        usageMb: totalUsage,
        averageUsagePerDeviceMb: devices.length ? totalUsage / devices.length : 0,
      },
      devices,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/trends', async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const { start, end } = parseRange(startDate, endDate);

    // Sem usage_logs: retornar linha do tempo vazia, mantendo compatibilidade de contrato
    const timeline = [];

    res.json({
      range: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
      granularity: 'day',
      timeline,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/network', async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const { start, end } = parseRange(startDate, endDate);

    // Sem usage_logs: retornar breakdown vazio
    const breakdown = [];

    res.json({
      range: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
      totalMb: 0,
      breakdown,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
