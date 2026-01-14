const express = require('express');
const cors = require('cors');
require('dotenv').config();

const devicesRouter = require('./routes/devices'); // compat: rota expõe registros_usuarios
const funcionariosRouter = require('./routes/funcionarios');
const reportsRouter = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Log simples de requisições para ajudar a depurar integração com o app Android
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/devices', devicesRouter); // compat com frontend antigo
app.use('/funcionarios', funcionariosRouter);
app.use('/reports', reportsRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Mobile data monitor backend running on port ${PORT}`);
});
