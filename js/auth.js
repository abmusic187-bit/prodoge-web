import { supabase } from './supabase.js';
export async function loginWithGoogle() {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
}
