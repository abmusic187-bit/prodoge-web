import { SB_URL, SB_KEY } from './config.js';
export const supabase = window.supabase.createClient(SB_URL, SB_KEY);
