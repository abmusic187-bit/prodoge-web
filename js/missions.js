import { supabase } from './supabase.js';

export async function claimDaily(userId) {
    const { data, error } = await supabase.rpc('claim_daily_bonus', { user_id_uuid: userId });
    
    if (error) {
        console.error(error);
        return { success: false, message: "System Offline" };
    }
    return data;
}    
import { supabase } from './supabase.js';
export async function getTasks(userId) {
    return await supabase.from('user_tasks').select('*').gt('remaining', 0).neq('creator_id', userId);
}
