const axios = require('axios');
const { singleBubble, imageCTA } = require('../../../services/flex');
require('dotenv').config();

module.exports = async function handleFollow(event) {
  const userId = event.source.userId;

  const welcomeBubble = singleBubble(
    imageCTA({
      imageUrl: 'https://cdn.prod.website-files.com/68012eaec3b0222963a7e735/6801301b6c621cc9553d0f22_Frame%2014.png',
      title: 'Hey, it’s Emmo here.',
      text: 'Think of me like a friend who helps you show up when someone you love is hurting. We’ll learn, practice, and figure it out together — one reply at a time.',
      ctaAction: {
        type: 'postback',
        label: "Let's Start",
        data: 'Start',
        displayText: "Let's Start"
      }
    })
  );

  try {
    await axios.post('https://api.line.me/v2/bot/message/push', {
      to: userId,
      messages: [welcomeBubble]
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
      }
    });

    console.log('✅ Welcome bubble sent to', userId);
  } catch (error) {
    console.error('❌ Failed to send welcome bubble:', error.response?.data || error.message);
  }
};