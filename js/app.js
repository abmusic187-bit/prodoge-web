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

async function setupDashboard(authUser) import * as Missions from './missions.js'; // Ensure this is imported at the top

// ... existing code ...

const dailyBtn = document.getElementById('btn-daily-claim');
if (dailyBtn) {
    dailyBtn.onclick = async () => {
        const result = await Missions.claimDaily(authUser.id);
        if (result.success) {
            alert("✅ " + result.message);
            location.reload(); // Refresh to show new balance
        } else {
            alert("⏳ " + result.message);
        }
    };
}
{
    const { data: user } = await supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle();
    // ... inside setupDashboard(authUser) ...

const deployBtn = document.getElementById('btn-deploy-boost');
if (deployBtn) {
    deployBtn.onclick = async () => {
        const url = document.getElementById('ad-url').value;
        const qty = parseInt(document.getElementById('ad-count').value);
        const platform = document.getElementById('ad-platform').value;
        const cost = qty * 50;

        if (user.tokens < cost) return alert("Insufficient ELITE balance.");

        const { error } = await supabase.rpc('deploy_social_boost', {
            target_url: url,
            platform_name: platform,
            target_qty: qty,
            total_cost: cost
        });

        if (!error) {
            alert("Mission Broadcasted!");
            location.reload();
        } else {
            alert("Error: " + error.message);
        }
    };
    }
    
    if (user) {
        document.getElementById('bal-display').innerText = user.tokens.toFixed(2);
        document.getElementById('ref-code').innerText = user.referral_code;
        // Start the mining tickers here...
    }
}

init();
