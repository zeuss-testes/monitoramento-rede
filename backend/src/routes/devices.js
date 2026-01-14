const express = require('express');
const dayjs = require('dayjs');
const { all, get } = require('../db');

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
      dataLimitMb: null,
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

// Criação/edição/exclusão não suportadas neste modo (dados vêm do app Android)
router.post('/', (_req, res) => res.status(405).json({ error: 'Not supported' }));
router.put('/:id', (_req, res) => res.status(405).json({ error: 'Not supported' }));
router.delete('/:id', (_req, res) => res.status(405).json({ error: 'Not supported' }));

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
      consumoTotal: device.consumo_total,
      createdAt: device.created_at,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
