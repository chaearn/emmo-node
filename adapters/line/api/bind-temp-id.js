const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.post('/api/bind-temp-id', async (req, res) => {
  const { tempId, lineId } = req.body;

  if (!tempId || !lineId) {
    return res.status(400).json({ error: 'Missing tempId or lineId' });
  }

  const { data, error } = await supabase
    .from('emmo_users')
    .update({ line_id: lineId })
    .eq('id', tempId)
    .select();

  if (error) {
    console.error('❌ Failed to bind line_id:', error.message);
    return res.status(500).json({ error: 'Supabase update error' });
  }

  console.log('✅ Bound LINE ID to tempId:', data);
  return res.status(200).json({ success: true });
});

module.exports = router;