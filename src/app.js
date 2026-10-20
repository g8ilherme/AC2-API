const express = require('express');
const app = express();

app.use(express.json());
app.use('/professores', require('./routes/professoresRoutes'));
app.use((req, res) => res.status(404).json({ mensagem: 'Rota não encontrada' }));
app.use((erro, req, res, next) => {
  if (erro.type === 'entity.parse.failed') return res.status(400).json({ mensagem: 'JSON inválido' });
  if (erro.type === 'entity.too.large') return res.status(413).json({ mensagem: 'Corpo muito grande' });
  console.error(erro);
  return res.status(500).json({ mensagem: 'Erro interno do servidor' });
});

module.exports = app;
