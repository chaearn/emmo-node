const axios = require('axios');
const { singleBubble, tipsCard } = require('../../../services/flex');
require('dotenv').config();

module.exports = async function handleLV1(event) {
  const userId = event.source.userId;
  const message = event.message.text.trim().toLowerCase();

  if (message === 'lesson1') {

    const tipsBubble = singleBubble(
          tipsCard({
            title, subtitle,
            quote: '“That sounds hard. I’m here if you need me.”',
            quoteColor, quoteMarkColor, startColor, endColor, ctaLabel, ctaData
          })
        );

          try {
              
              await axios.post('https://api.line.me/v2/bot/message/push', {
                  to: userId,
                  messages: [
                    { type: 'text', text: `Ok, ${userName} Let's start LV.1: LESSON 1` }
                  ]
              }, {
                  headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
                  }
              });

              // Bubble Tips
                await axios.post('https://api.line.me/v2/bot/message/push', {
                    to: userId,
                    messages: [tipsBubble]
                }, {
                    headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
                    }
                });
              console.log('📩 Replied to Start postback with Level + Carousel');
          } catch (error) {
              console.error('❌ Error replying to Start postback:', error.response?.data || error.message);
          }
    }
  };