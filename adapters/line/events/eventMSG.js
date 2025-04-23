const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // ใช้ service role key เพราะต้องอ่านข้อมูลผู้ใช้
);

module.exports = async function handleMSG(event) {
    const userId = event.source.userId;
  
    const message = event.message.text.trim().toLowerCase();
    
      if (message === 'start') {
        try {
            const { data: user, error } = await supabase
            .from('emmo_users')
            .select('name')
            .eq('line_id', userId)
            .single();
        
            console.log(user?.name);
            const userName = user?.name || 'เพื่อนใหม่'; // fallback ถ้ายังไม่มีชื่อ
    
            await axios.post('https://api.line.me/v2/bot/message/push', {
                to: userId,
                messages: [
                {
                    type: `text`, 
                    text: `${userName} Lesson 1` // ✅ ถูกต้อง
                }
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
