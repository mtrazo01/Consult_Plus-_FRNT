require('dotenv').config({ quiet: true });
const express = require('express');
const cors = require('cors');

const usuarioRoutes = require('./routes/usuarioRoutes');
const consultaRoutes = require('./routes/consultaRoutes');
const especialidadeRoutes = require('./routes/especialidadeRoutes');
const medicoRoutes = require('./routes/medicoRoutes');
const ubsRoutes = require('./routes/ubsRoutes.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Logger de requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Rotas
app.use('/usuarios', usuarioRoutes);
app.use('/consultas', consultaRoutes);
app.use('/especialidades', especialidadeRoutes);
app.use('/medicos', medicoRoutes);
app.use('/ubs', ubsRoutes);

// Rota raiz (para testar se o servidor está rodando)
app.get('/', (req, res) => {
  res.json({ 
    message: 'API ConsultPlus funcionando!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    path: req.originalUrl 
  });
});

app.use((err, req, res, next) => {
  console.error(`[ERRO] ${err.stack}`);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`📡 Acesso local: http://localhost:${PORT}`);
  console.log(`🌐 Acesso na rede: http://192.168.15.185:${PORT}`);
});