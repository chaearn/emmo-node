// services/supabase-service.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function getScenario(chapter_id) {
  const { data, error } = await supabase
    .from('scenarios')
    .select('*')
    .eq('chapter_id', chapter_id)
    .single();

  if (error || !data) {
    console.error('❌ Failed to load scenario:', error?.message);
    return null;
  }
  return data;
}

async function getReferencePhrases() {
  const { data, error } = await supabase
    .from('phrases_lib')
    .select('*');

  if (error || !data) {
    console.error('❌ Failed to load phrases:', error?.message);
    return null;
  }
  return data;
}

module.exports = {
  getScenario,
  getReferencePhrases
};
