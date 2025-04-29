// server.js
require('dotenv').config(); // ✅ load .env at the top

const express = require('express');
const cors = require('cors');
const lineWebhook = require('./adapters/line');
const analyzeConversation = require('./api/emmo-chat');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Emmo backend is running!');
});

app.post('/webhook', lineWebhook);
app.post('/emmo-chat', analyzeConversation);

app.listen(port, () => {
  console.log(`🚀 Emmo backend listening at http://localhost:${port}`);
});

const saveNameFromTemp = require('./api/save-name-from-temp');
app.use(saveNameFromTemp);