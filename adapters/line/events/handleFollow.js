// adapters/line/events/handleFollow.js
const axios = require('axios');
const { buildWelcomeFlex } = require('../../../services/flex-builder');

module.exports = async function handleFollow(event) {
  const userId = event.source.userId;

  const message = {
    to: userId,
    messages: [buildWelcomeFlex()]
  };

  try {
    await axios.post('https://api.line.me/v2/bot/message/push', message, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
      }
    });
    console.log('✅ Flex message sent to', userId);
  } catch (error) {
    console.error('❌ Failed to send message:', error.response?.data || error.message);
  }
};
