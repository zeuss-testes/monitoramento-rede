const express = require('express');
const dayjs = require('dayjs');
const { all, get, run } = require('../db');

// Adapta as rotas /devices para ler registros_usuarios (compatibilidade com frontend antigo)
const router = express.Router();

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const normalized = String(value).replace(',', '.');
  const num = Number(normalized);
  return Number.isFinite(num) ? num : 0;
};

// Lista "devices" a partir de registros_usuarios (chave: imei)
router.get('/', async (_req, res, next) => {
  try {
    const rows = await all(
      `SELECT f.id,
              f.imei,
              f.nome,
              f.numero,
              f.consumo_total,
              f.limite_dados,
              f.created_at
       FROM registros_usuarios f
       ORDER BY f.created_at DESC`
    );

    const devices = rows.map((row) => ({
      id: row.id,
      name: row.nome,
      nome: row.nome, // Adicionado para compatibilidade
      simNumber: row.numero,
      numero: row.numero, // Adicionado para compatibilidade
      dataLimitMb: row.limite_dados,
      createdAt: row.created_at,
      usage: {
        totalMb: parseNumber(row.consumo_total),
      },
      imei: row.imei,
      consumoTotal: parseNumber(row.consumo_total),
    }));

    res.json(devices);
  } catch (error) {
    next(error);
  }
});

// Cria novo dispositivo
router.post('/', async (req, res, next) => {
  try {
    const { name, imei, simNumber, dataLimitMb } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'name is required' });
    }
    if (!imei || typeof imei !== 'string') {
      return res.status(400).json({ error: 'imei is required' });
    }

    const existing = await get(`SELECT * FROM registros_usuarios WHERE imei = ?`, [imei]);
    if (existing) {
      return res.status(409).json({ error: 'IMEI already exists' });
    }

    const result = await run(
      `INSERT INTO registros_usuarios (nome, imei, numero, consumo_total, limite_dados)
       VALUES (?, ?, ?, 0, ?)`,
      [name.trim(), imei.trim(), simNumber || null, dataLimitMb ? Number(dataLimitMb) : 7000]
    );

    const device = await get(`SELECT * FROM registros_usuarios WHERE id = ?`, [result.id]);

    res.status(201).json({
      id: device.id,
      name: device.nome,
      simNumber: device.numero,
      imei: device.imei,
      dataLimitMb: device.limite_dados,
      consumoTotal: device.consumo_total,
      createdAt: device.created_at,
    });
  } catch (error) {
    next(error);
  }
});

// Atualiza dispositivo por ID
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, simNumber, dataLimitMb, imei } = req.body;

    const existing = await get(`SELECT * FROM registros_usuarios WHERE id = ?`, [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Device not found' });
    }

    const updatedName = typeof name === 'string' && name.trim() ? name.trim() : existing.nome;
    const updatedNumero = simNumber !== undefined ? simNumber : existing.numero;
    const updatedImei = typeof imei === 'string' && imei.trim() ? imei.trim() : existing.imei;
    const updatedLimit = dataLimitMb !== undefined ? (dataLimitMb ? Number(dataLimitMb) : null) : existing.limite_dados;

    if (updatedLimit !== null && !Number.isFinite(updatedLimit)) {
      return res.status(400).json({ error: 'dataLimitMb must be a number' });
    }

    await run(
      `UPDATE registros_usuarios
       SET nome = ?, numero = ?, imei = ?, limite_dados = ?
       WHERE id = ?`,
      [updatedName, updatedNumero, updatedImei, updatedLimit, id]
    );

    const device = await get(`SELECT * FROM registros_usuarios WHERE id = ?`, [id]);

    res.json({
      id: device.id,
      name: device.nome,
      simNumber: device.numero,
      imei: device.imei,
      dataLimitMb: device.limite_dados,
      consumoTotal: device.consumo_total,
      createdAt: device.created_at,
    });
  } catch (error) {
    next(error);
  }
});

// Remove dispositivo por ID
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await run(`DELETE FROM registros_usuarios WHERE id = ?`, [id]);
    if (!result.changes) {
      return res.status(404).json({ error: 'Device not found' });
    }
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Uso detalhado por "device" (mapeado via imei)
// Detalhe básico por id (registros_usuarios)
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const device = await get(`SELECT * FROM registros_usuarios WHERE id = ?`, [id]);
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    res.json({
      id: device.id,
      name: device.nome,
      simNumber: device.numero,
      imei: device.imei,
      dataLimitMb: device.limite_dados,
      consumoTotal: device.consumo_total,
      createdAt: device.created_at,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
