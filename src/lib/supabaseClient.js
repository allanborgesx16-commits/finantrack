import { createClient } from '@supabase/supabase-js';

// Publishable keys identify the project; row access is enforced by database RLS.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lkyhffuvjresqhtvlaug.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_y_O-Sn6VvWMiSiHYZp-Mmw_HvMNPV2j';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
