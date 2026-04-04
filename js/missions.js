import { supabase } from './supabase.js';
export async function getTasks(userId) {
    return await supabase.from('user_tasks').select('*').gt('remaining', 0).neq('creator_id', userId);
}
