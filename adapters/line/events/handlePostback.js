// adapters/line/events/handlePostback.js
const axios = require('axios');
const { buildLessonCarousel } = require('../../../services/flex-builder');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // ใช้ service role key เพราะต้องอ่านข้อมูลผู้ใช้
);

module.exports = async function handlePostback(event) {
  const userId = event.source.userId;
  const data = event.postback.data;
  const { data: user } = await supabase
  .from('emmo_users')
  .select('name')
  .eq('line_id', event.source.userId)
  .single();

  console.log(user?.name);
  const userName = user?.name || 'เพื่อนใหม่'; // fallback ถ้ายังไม่มีชื่อ

  if (data === 'Start') {
    try {
      // ข้อความต้อนรับก่อน carousel
      await axios.post('https://api.line.me/v2/bot/message/push', {
        to: userId,
        messages: [
          { type: 'text', text: 'LEVEL 1: Listening Gently' },
          { type: 'text', text: '“Sometimes the kindest thing we can do is just be there.”' }
        ]
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
        }
      });

      // Carousel lesson selector
      await axios.post('https://api.line.me/v2/bot/message/push', {
        to: userId,
        messages: [buildLessonCarousel()]
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
        }
      });

      console.log('📩');
    } catch (error) {
      console.error('❌ Error replying to Start postback:', error.response?.data || error.message);
    }
  }
  
  if (data === 'lesson1') {
   
    try {
      // ข้อความต้อนรับก่อน carousel
      await axios.post('https://api.line.me/v2/bot/message/push', {
        to: userId,
        messages: [
          // { type: 'text', text: 'LEVEL 1' },
          { type: 'text', text: `Ok, ${userName} Let's start LV.1: LESSON 1` }
        ]
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
