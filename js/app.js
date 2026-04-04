import { supabase } from './supabase.js';
import * as Auth from './auth.js';
import * as UI from './ui.js';

// Global access for HTML onclick attributes
window.showTab = UI.showTab;

async function init() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        // 1. Load Login Component
        await loadPage('login');
        document.getElementById('btn-google-login').onclick = () => Auth.loginWithGoogle();
    } else {
        // 2. Load Dashboard Component
        await loadPage('dashboard');
        setupDashboard(session.user);
    }
}

async function loadPage(name) {
    const target = document.getElementById('app-interface');
    try {
        const response = await fetch(`./components/${name}.html`);
        if (!response.ok) throw new Error(`Failed to load ${name}`);
        const html = await response.text();
        target.innerHTML = html;
    } catch (err) {
        target.innerHTML = `<div class="p-10 text-red-500 font-bold">Error: ${err.message}. Check if components/${name}.html exists!</div>`;
    }
}

async function setupDashboard(authUser) {
    const { data: user } = await supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle();
    
    if (user) {
        document.getElementById('bal-display').innerText = user.tokens.toFixed(2);
        document.getElementById('ref-code').innerText = user.referral_code;
        // Start the mining tickers here...
    }
}

init();
