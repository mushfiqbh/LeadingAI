import { supabase } from '../services/supabaseClient';
(async () => {
  const { data, error } = await supabase.rpc('execute_sql', { 
    sql: "SELECT definition FROM pg_proc WHERE proname = 'match_documents';" 
  });
  if (error) console.error('Error:', error);
  else console.log('Definition:', data);
  process.exit(0);
})();
