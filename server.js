const express = require('express');
const bodyParser = require('body-parser');
const mayaBot = require('./bots/maya');
const sophieBot = require('./bots/sophieBot');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Rota principal só para verificar se o servidor está rodando
app.get('/', (req, res) => {
  res.send('Chatbot WhatsApp está rodando 🚀');
});

// Simulando rotas para os bots (iremos integrar com o WhatsApp futuramente)
app.post('/webhook/maya', (req, res) => {
  const resposta = mayaBot(req.body.message);
  res.send({ resposta });
});

app.post('/webhook/sophie', (req, res) => {
  const resposta = sophieBot(req.body.message);
  res.send({ resposta });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
