const axios = require('axios');
// const { singleBubble } = require('../../../services/flex/bubbles');
const tipsCard = require('../../../services/flex/cards/tipsCard');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // ใช้ service role key เพราะต้องอ่านข้อมูลผู้ใช้
);

require('dotenv').config();

module.exports = async function eventLV(event) {

  const userId = event.source.userId;
  const data = event.postback.data;
  const { data: user } = await supabase
  .from('emmo_users')
  .select('name')
  .eq('line_id', event.source.userId)
  .single();

  console.log(user?.name);
  const userName = user?.name || 'เพื่อนใหม่'; // fallback ถ้ายังไม่มีชื่อ
  if (data === 'lesson1') {

    const tipBubble = tipsCard({
      title: 'Mini Tip:',
      subtitle: 'What to say instead of “Be positive!”',
      quote: '“That sounds hard. I’m here if you need me.”',
      ctaLabel: 'Save this tip',
      ctaData: 'save_tip_1'
    });

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
                    messages: [{
                      type: 'flex',
                      altText: 'Mini Tip',
                      contents: tipBubble
                    }]
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