import { supabase } from './supabase.js';
import * as Auth from './auth.js';
import * as UI from './ui.js';
import * as Missions from './missions.js'; // Correctly placed at the top

// Global access for HTML onclick attributes
window.showTab = UI.showTab;

async function init() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        // 1. Load Login Component
        await loadPage('login');
        const loginBtn = document.getElementById('btn-google-login');
        if (loginBtn) loginBtn.onclick = () => Auth.loginWithGoogle();
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
    // Fetch user profile from Supabase
    const { data: user } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

    if (!user) return;

    // 1. Update UI with User Data
    const balDisplay = document.getElementById('bal-display');
    const refCode = document.getElementById('ref-code');
    
    if (balDisplay) balDisplay.innerText = user.tokens.toFixed(2);
    if (refCode) refCode.innerText = user.referral_code || "ALPHA";

    // 2. Setup Daily Claim Button
    const dailyBtn = document.getElementById('btn-daily-claim');
    if (dailyBtn) {
        dailyBtn.onclick = async () => {
            const result = await Missions.claimDaily(authUser.id);
            if (result.success) {
                alert("✅ " + result.message);
                location.reload();
            } else {
                alert("⏳ " + result.message);
            }
        };
    }

    // 3. Setup Social Boost Button
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
    
    // Start Mining Tickers or other dashboard logic here
}

// Start the App
init();
