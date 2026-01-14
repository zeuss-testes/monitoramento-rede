const { all, run } = require('../db');

// Rota para acionar a migração mensal (manual ou agendada)
async function migrarMesAnterior() {
  try {
    // Data de referência: último dia do mês anterior
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = agora.getMonth(); // 0-11
    const mesAnterior = mes === 0 ? 11 : mes - 1;
    const anoMesAnterior = mes === 0 ? ano - 1 : ano;

    // Último dia do mês anterior
    const ultimoDia = new Date(anoMesAnterior, mesAnterior + 1, 0);
    const dataReferencia = ultimoDia.toISOString().split('T')[0]; // YYYY-MM-DD

    console.log(`[MIGRAÇÃO MENSAL] Iniciando migração para ${dataReferencia}`);

    // 1. Buscar todos os usuários com dados no mês anterior
    const usuarios = await all(
      `SELECT imei, nome, numero, consumo_total, dados_apps_json
       FROM registros_usuarios
       WHERE created_at <= ?`,
      [`${dataReferencia} 23:59:59`]
    );

    if (usuarios.length === 0) {
      console.log('[MIGRAÇÃO MENSAL] Nenhum usuário encontrado para migrar.');
      return { migrados: 0 };
    }

    // 2. Para cada usuário, inserir um registro em usage_logs com snapshot do mês
    let migrados = 0;
    for (const u of usuarios) {
      await run(
        `INSERT INTO usage_logs (
           imei,
           megabytes,
           network_type,
           description,
           recorded_at,
           created_at
         ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          u.imei,
          u.consumo_total || 0,
          'MONTHLY_SNAPSHOT',
          `Snapshot mensal - ${dataReferencia}`,
          `${dataReferencia} 23:59:59`,
          new Date().toISOString()
        ]
      );

      // Opcional: também armazenar dados_apps_json em usage_logs se quiser histórico por app
      // Poderíamos adicionar uma coluna dados_apps_json em usage_logs no futuro

      migrados++;
    }

    console.log(`[MIGRAÇÃO MENSAL] ${migrados} usuários migrados para ${dataReferencia}`);
    return { migrados, dataReferencia };
  } catch (err) {
    console.error('[MIGRAÇÃO MENSAL] Erro:', err);
    throw err;
  }
}

// Endpoint para acionar migração manual (testes)
async function setupMigrationRoutes(router) {
  router.post('/migrar-mes-anterior', async (req, res, next) => {
    try {
      const resultado = await migrarMesAnterior();
      res.json({
        message: 'Migração mensal executada com sucesso',
        ...resultado
      });
    } catch (error) {
      next(error);
    }
  });
}

module.exports = {
  migrarMesAnterior,
  setupMigrationRoutes
};
