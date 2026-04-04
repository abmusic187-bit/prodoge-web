import { supabase } from './supabase.js';
import * as Auth from './auth.js';
import { SB_URL } from './config.js';
async function loadComponent(name) {
    const response = await fetch(`./components/${name}.html`);
    const html = await response.text();
    document.getElementById('app-interface').innerHTML = html;
    
    // After loading, we have to re-attach the button listeners
    if(name === 'login') {
        document.getElementById('btn-google-login').onclick = () => Auth.loginWithGoogle();
    }
}
// ... initialization logic ...
