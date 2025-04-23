const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.post('/api/save-name-from-temp', async (req, res) => {
  const { tempId, name } = req.body;

  if (!tempId || !name) {
    return res.status(400).json({ error: 'Missing tempId or name' });
  }

  const { data, error } = await supabase
    .from('emmo_users')
    .update({ name }) // ⬅️ แค่ update ช่อง name
    .eq('id', tempId)
    .select();

  if (error) {
    console.error('❌ Failed to update name:', error.message);
    return res.status(500).json({ error: 'Supabase update error' });
  }

  console.log('✅ Updated name for tempId:', data);
  return res.status(200).json({ success: true });
});

module.exports = router;