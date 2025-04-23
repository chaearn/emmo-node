// services/analyze-chat.js

const axios = require('axios');

async function analyzeWithGPT({ prompt }) {
  const start = Date.now(); // ⏱️ เริ่มจับเวลา

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4',
      messages: [{ role: 'system', content: prompt }],
      temperature: 0.7,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );

  const end = Date.now(); // ⏱️ จบเวลา
  console.log(`⏱️ GPT-4 response time: ${(end - start) / 1000}s`);

  return response.data.choices[0].message.content.trim();
}

module.exports = { analyzeWithGPT };