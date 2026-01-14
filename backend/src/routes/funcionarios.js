const express = require('express');
const dayjs = require('dayjs');
const { all, get } = require('../db');
const { setupMigrationRoutes } = require('../services/monthlyMigration');

const router = express.Router();

// Configurar rotas de migração mensal
setupMigrationRoutes(router);

// Lista funcionários (registros_usuarios) com soma de uso
router.get('/', async (_req, res, next) => {
  try {
    const usuarios = await all(
      `SELECT f.*,
              IFNULL(SUM(u.megabytes), 0) AS total_usage
       FROM registros_usuarios f
       LEFT JOIN usage_logs u ON u.imei = f.imei
       GROUP BY f.imei
       ORDER BY f.created_at DESC`
    );

    res.json(
      usuarios.map((func) => ({
        id: func.id,
        imei: func.imei,
        nome: func.nome,
        numero: func.numero,
        consumoTotal: func.consumo_total,
        createdAt: func.created_at,
        dadosAppsJson: func.dados_apps_json,
        usage: {
          totalMb: Number(func.total_usage || 0),
        },
      }))
    );
  } catch (error) {
    next(error);
  }
});

// Cria funcionário
router.post('/', async (req, res, next) => {
  try {
    const { imei, nome, numero, consumoTotal, dadosAppsJson } = req.body;

    if (!imei || typeof imei !== 'string') {
      return res.status(400).json({ error: 'imei is required' });
    }
    if (!nome || typeof nome !== 'string') {
      return res.status(400).json({ error: 'nome is required' });
    }
    if (!numero || typeof numero !== 'string') {
      return res.status(400).json({ error: 'numero is required' });
    }

    const normalizedConsumo =
      consumoTotal === undefined || consumoTotal === null
        ? 0
        : Number.isFinite(Number(consumoTotal))
        ? Number(consumoTotal)
        : NaN;

    if (Number.isNaN(normalizedConsumo)) {
      return res.status(400).json({ error: 'consumoTotal must be a number' });
    }

    const result = await run(
      `INSERT INTO registros_usuarios (imei, nome, numero, consumo_total, dados_apps_json)
       VALUES (?, ?, ?, ?, ?)`,
      [imei.trim(), nome.trim(), numero.trim(), normalizedConsumo, dadosAppsJson || null]
    );

    const usuario = await get(`SELECT * FROM registros_usuarios WHERE id = ?`, [result.id]);

    res.status(201).json({
      id: usuario.id,
      imei: usuario.imei,
      nome: usuario.nome,
      numero: usuario.numero,
      consumoTotal: usuario.consumo_total,
      createdAt: usuario.created_at,
      dadosAppsJson: usuario.dados_apps_json,
    });
  } catch (error) {
    next(error);
  }
});

// Atualiza funcionário por imei
router.put('/:imei', async (req, res, next) => {
  try {
    const { imei } = req.params;
    const { nome, numero, consumoTotal, dadosAppsJson } = req.body;

    const existing = await get(`SELECT * FROM registros_usuarios WHERE imei = ?`, [imei]);
    if (!existing) {
      return res.status(404).json({ error: 'Usuario not found' });
    }

    const updatedNome = typeof nome === 'string' && nome.trim() ? nome.trim() : existing.nome;
    const updatedNumero = numero !== undefined ? numero : existing.numero;
    const updatedConsumo =
      consumoTotal === null
        ? 0
        : consumoTotal !== undefined
        ? Number(consumoTotal)
        : existing.consumo_total;

    if (updatedConsumo !== null && !Number.isFinite(updatedConsumo)) {
      return res.status(400).json({ error: 'consumoTotal must be a number' });
    }

    await run(
      `UPDATE registros_usuarios
       SET nome = ?, numero = ?, consumo_total = ?, dados_apps_json = ?
       WHERE imei = ?`,
      [updatedNome, updatedNumero, updatedConsumo, dadosAppsJson || null, imei]
    );

    const usuario = await get(`SELECT * FROM registros_usuarios WHERE imei = ?`, [imei]);

    res.json({
      id: usuario.id,
      imei: usuario.imei,
      nome: usuario.nome,
      numero: usuario.numero,
      consumoTotal: usuario.consumo_total,
      createdAt: usuario.created_at,
      dadosAppsJson: usuario.dados_apps_json,
    });
  } catch (error) {
    next(error);
  }
});

// Remove funcionário por imei
router.delete('/:imei', async (req, res, next) => {
  try {
    const { imei } = req.params;
    const result = await run(`DELETE FROM registros_usuarios WHERE imei = ?`, [imei]);
    if (!result.changes) {
      return res.status(404).json({ error: 'Usuario not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Insere uso para imei
router.post('/:imei/usage', async (req, res, next) => {
  try {
    const { imei } = req.params;
    const { megabytes, networkType, description, recordedAt } = req.body;

    const usuario = await get(`SELECT imei FROM registros_usuarios WHERE imei = ?`, [imei]);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario not found' });
    }

    const amount = Number(megabytes);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: 'megabytes must be a positive number' });
    }

    const timestamp = recordedAt ? dayjs(recordedAt) : dayjs();
    if (!timestamp.isValid()) {
      return res.status(400).json({ error: 'recordedAt must be a valid date' });
    }

    await run(
      `UPDATE registros_usuarios 
       SET consumo_total = ? 
       WHERE imei = ?`,
      [amount, imei]
    );

    res.status(201).json({
      success: true,
      imei: imei,
      consumoTotal: amount,
      timestamp: timestamp.toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Busca dispositivo por IMEI ou ID
router.get('/:identifier', async (req, res, next) => {
  try {
    const { identifier } = req.params;
    
    // Tenta buscar por IMEI primeiro, senão por ID numérico
    let usuario;
    if (/^\d+$/.test(identifier)) {
      // É numérico, busca por ID
      usuario = await get(`SELECT * FROM registros_usuarios WHERE id = ?`, [identifier]);
    } else {
      // Busca por IMEI
      usuario = await get(`SELECT * FROM registros_usuarios WHERE imei = ?`, [identifier]);
    }
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario not found' });
    }

    res.json({
      id: usuario.id,
      imei: usuario.imei,
      nome: usuario.nome,
      numero: usuario.numero,
      consumoTotal: usuario.consumo_total,
      createdAt: usuario.created_at,
      dadosAppsJson: usuario.dados_apps_json,
    });
  } catch (error) {
    next(error);
  }
});

// Remove dispositivo por IMEI ou ID
router.delete('/:identifier', async (req, res, next) => {
  try {
    const { identifier } = req.params;
    
    let result;
    if (/^\d+$/.test(identifier)) {
      // É numérico, remove por ID
      result = await run(`DELETE FROM registros_usuarios WHERE id = ?`, [identifier]);
    } else {
      // Remove por IMEI
      result = await run(`DELETE FROM registros_usuarios WHERE imei = ?`, [identifier]);
    }
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Usuario not found' });
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Consulta uso por imei com filtros
router.get('/:imei/usage', async (req, res, next) => {
  try {
    const { imei } = req.params;
    const { startDate, endDate } = req.query;

    const usuario = await get(`SELECT * FROM registros_usuarios WHERE imei = ?`, [imei]);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario not found' });
    }

    let start = startDate ? dayjs(startDate).startOf('day') : null;
    let end = endDate ? dayjs(endDate).endOf('day') : null;

    if (startDate && (!start || !start.isValid())) {
      return res.status(400).json({ error: 'startDate is invalid' });
    }
    if (endDate && (!end || !end.isValid())) {
      return res.status(400).json({ error: 'endDate is invalid' });
    }
    if (start && end && end.isBefore(start)) {
      return res.status(400).json({ error: 'endDate must be after startDate' });
    }

    const conditions = ['imei = ?'];
    const params = [imei];
    if (start) {
      conditions.push('recorded_at >= ?');
      params.push(start.toISOString());
    }
    if (end) {
      conditions.push('recorded_at <= ?');
      params.push(end.toISOString());
    }

    const usageEntries = await all(
      `SELECT *
       FROM usage_logs
       WHERE ${conditions.join(' AND ')}
       ORDER BY recorded_at DESC`,
      params
    );

    const total = usageEntries.reduce((sum, item) => sum + Number(item.megabytes), 0);

    res.json({
      usuario: {
        id: usuario.id,
        imei: usuario.imei,
        nome: usuario.nome,
        numero: usuario.numero,
        consumoTotal: usuario.consumo_total,
      },
      filters: {
        startDate: start ? start.toISOString() : null,
        endDate: end ? end.toISOString() : null,
      },
      usage: {
        totalMb: total,
        entries: usageEntries.map((entry) => ({
          id: entry.id,
          imei: entry.imei,
          megabytes: entry.megabytes,
          networkType: entry.network_type,
          description: entry.description,
          recordedAt: entry.recorded_at,
          createdAt: entry.created_at,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Detalhes do dispositivo por IMEI
router.get('/:imei/details', async (req, res, next) => {
  try {
    const { imei } = req.params;
    
    // Busca informações básicas do dispositivo
    const dispositivo = await get(
      `SELECT * FROM registros_usuarios WHERE imei = ?`,
      [imei]
    );
    
    if (!dispositivo) {
      return res.status(404).json({ error: 'Dispositivo não encontrado' });
    }

    // Busca histórico de uso completo
    const historicoUso = await all(
      `SELECT * FROM usage_logs 
       WHERE imei = ? 
       ORDER BY recorded_at DESC 
       LIMIT 100`,
      [imei]
    );

    // Calcula estatísticas de uso
    const totalUsage = historicoUso.reduce((sum, entry) => sum + Number(entry.megabytes), 0);
    const mediaDiaria = historicoUso.length > 0 ? totalUsage / historicoUso.length : 0;
    
    // Últimos 7 dias de uso
    const seteDiasAtras = dayjs().subtract(7, 'day').startOf('day');
    const usoRecente = historicoUso.filter(entry => 
      dayjs(entry.recorded_at).isAfter(seteDiasAtras)
    );
    const totalRecente = usoRecente.reduce((sum, entry) => sum + Number(entry.megabytes), 0);

    // Estatísticas por tipo de rede
    const usoPorRede = historicoUso.reduce((acc, entry) => {
      const rede = entry.network_type || 'UNKNOWN';
      acc[rede] = (acc[rede] || 0) + Number(entry.megabytes);
      return acc;
    }, {});

    // Primeiro e último registro
    const primeiroRegistro = historicoUso[historicoUso.length - 1];
    const ultimoRegistro = historicoUso[0];

    const responseData = {
      dispositivo: {
        imei: dispositivo.imei,
        nome: dispositivo.nome,
        numero: dispositivo.numero,
        consumoTotal: Number(dispositivo.consumo_total || 0),
        createdAt: dispositivo.created_at,
        updatedAt: dispositivo.updated_at
      },
      estatisticas: {
        totalUsage: Number(totalUsage.toFixed(2)),
        mediaDiaria: Number(mediaDiaria.toFixed(2)),
        totalUltimos7Dias: Number(totalRecente.toFixed(2)),
        usoPorRede,
        primeiroRegistro: primeiroRegistro ? {
          data: primeiroRegistro.recorded_at,
          megabytes: Number(primeiroRegistro.megabytes),
        } : null,
        ultimoRegistro: ultimoRegistro ? {
          data: ultimoRegistro.recorded_at,
          megabytes: Number(ultimoRegistro.megabytes),
        } : null,
        totalRegistros: historicoUso.length,
      },
      historico: historicoUso.slice(0, 20).map(entry => ({
        id: entry.id,
        megabytes: Number(entry.megabytes),
        networkType: entry.network_type,
        description: entry.description,
        recordedAt: entry.recorded_at,
        createdAt: entry.created_at,
      })),
    };

    // Adiciona dados_apps_json se existir
    if (dispositivo.dados_apps_json) {
      try {
        responseData.appsUsage = JSON.parse(dispositivo.dados_apps_json);
      } catch (e) {
        console.warn('Erro ao parsear dados_apps_json para IMEI', imei, e.message);
        responseData.appsUsage = [];
      }
    } else {
      responseData.appsUsage = [];
    }

    res.json(responseData);
  } catch (error) {
    next(error);
  }
});

// Histórico mensal de um dispositivo via usage_logs (snapshots)
router.get('/:imei/historico', async (req, res, next) => {
  try {
    const { imei } = req.params;

    const historico = await all(
      `SELECT recorded_at, megabytes, description, created_at
       FROM usage_logs
       WHERE imei = ? AND network_type = 'MONTHLY_SNAPSHOT'
       ORDER BY recorded_at DESC
       LIMIT 24`,
      [imei]
    );

    res.json({
      imei,
      historico: historico.map(entry => ({
        data: entry.recorded_at,
        megabytes: Number(entry.megabytes),
        description: entry.description,
        geradoEm: entry.created_at
      }))
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
