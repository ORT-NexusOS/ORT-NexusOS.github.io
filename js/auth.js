/* ============================================================
   NEXUS OS — Authentication Module (Supabase)
   O.R.T. — Ordem da Realidade e Tempo
   ============================================================ */

const Auth = (() => {

    let _supabase = null;
    let _currentUser = null;
    let _currentProfile = null;

    /* ── Initialize Supabase Client ─────────────────────────── */
    function init() {
        if (NEXUS_CONFIG.supabase.url === 'YOUR_SUPABASE_URL') {
            console.warn('[NEXUS OS] Supabase não configurado. Usando modo demo.');
            return false;
        }
        try {
            _supabase = supabase.createClient(
                NEXUS_CONFIG.supabase.url,
                NEXUS_CONFIG.supabase.anonKey
            );
            return true;
        } catch (e) {
            console.error('[NEXUS OS] Falha ao inicializar Supabase:', e);
            return false;
        }
    }

    /* ── Demo Mode (sem Supabase configurado) ───────────────── */
    const DEMO_USERS = {
        'admin@ort.gov': {
            password: 'admin123',
            profile: {
                id: 'demo-admin',
                username: 'ADM_NEXUS',
                email: 'admin@ort.gov',
                role: 'admin',
                display_name: 'Mestre da O.R.T.'
            }
        },
        'agente@ort.gov': {
            password: 'agente123',
            profile: {
                id: 'demo-agent',
                username: 'AGENTE_001',
                email: 'agente@ort.gov',
                role: 'agent',
                display_name: 'Agente 001'
            }
        }
    };

    /* ── Login ──────────────────────────────────────────────── */
    async function login(email, password) {
        // Demo mode
        if (!_supabase) {
            const demo = DEMO_USERS[email?.toLowerCase()];
            if (demo && demo.password === password) {
                _currentProfile = demo.profile;
                _currentUser = { id: demo.profile.id, email };
                return { success: true, user: _currentProfile };
            }
            return { success: false, error: 'CREDENCIAIS INVÁLIDAS' };
        }

        // Real Supabase auth
        try {
            const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
            if (error) return { success: false, error: error.message.toUpperCase() };

            // Fetch profile with role
            const profile = await fetchProfile(data.user.id);
            _currentUser = data.user;
            _currentProfile = profile;
            return { success: true, user: profile };

        } catch (e) {
            return { success: false, error: 'FALHA DE CONEXÃO' };
        }
    }

    /* ── Fetch User Profile ─────────────────────────────────── */
    async function fetchProfile(userId) {
        if (!_supabase) return null;
        const { data, error } = await _supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (error) return { id: userId, role: 'agent', username: 'AGENTE', display_name: 'Agente' };
        return data;
    }

    /* ── Logout ─────────────────────────────────────────────── */
    async function logout() {
        if (_supabase) await _supabase.auth.signOut();
        _currentUser = null;
        _currentProfile = null;
        location.reload();
    }

    /* ── Check Session on Page Load ─────────────────────────── */
    async function checkExistingSession() {
        if (!_supabase) return null;
        try {
            const { data } = await _supabase.auth.getSession();
            if (data?.session?.user) {
                const profile = await fetchProfile(data.session.user.id);
                _currentUser = data.session.user;
                _currentProfile = profile;
                return profile;
            }
        } catch (e) { /* no session */ }
        return null;
    }

    /* ── Supabase DB helpers ─────────────────────────────────── */
    function db() { return _supabase; }

    /* ── Getters ────────────────────────────────────────────── */
    function getProfile() { return _currentProfile; }
    function getUser() { return _currentUser; }
    function isAdmin() { return _currentProfile?.role === 'admin'; }
    function isLoggedIn() { return !!_currentProfile; }

    function hasAccess(module) {
        if (!_currentProfile) return false;
        if (_currentProfile.role === 'admin') return true;
        if (_currentProfile.role === 'agent') return true;
        // restricted role: check modules list
        const allowed = _currentProfile.allowed_modules;
        if (!allowed) return false;
        return allowed.includes(module);
    }

    /* ── Admin: Create User ─────────────────────────────────── */
    async function adminCreateUser({ email, password, username, display_name, role }) {
        if (!_supabase) return { success: false, error: 'Supabase não configurado' };
        // Uses admin API via Supabase edge functions or server-side
        // For demo, we'll use signUp + insert profile
        try {
            const { data, error } = await _supabase.auth.signUp({ email, password });
            if (error) return { success: false, error: error.message };

            await _supabase.from('profiles').insert({
                id: data.user.id, email, username, display_name, role,
                allowed_modules: null
            });
            return { success: true };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    /* ── Admin: List Users ──────────────────────────────────── */
    async function adminListUsers() {
        if (!_supabase) {
            // Demo: return demo users
            return { success: true, data: Object.values(DEMO_USERS).map(u => u.profile) };
        }
        const { data, error } = await _supabase.from('profiles').select('*').order('created_at');
        if (error) return { success: false, error: error.message, data: [] };
        return { success: true, data: data || [] };
    }

    /* ── Admin: Update User Role ────────────────────────────── */
    async function adminUpdateUser(userId, updates) {
        if (!_supabase) return { success: false, error: 'Modo demo' };
        const { error } = await _supabase.from('profiles').update(updates).eq('id', userId);
        if (error) return { success: false, error: error.message };
        return { success: true };
    }

    /* ── Admin: Delete User ─────────────────────────────────── */
    async function adminDeleteUser(userId) {
        if (!_supabase) return { success: false, error: 'Modo demo' };
        const { error } = await _supabase.from('profiles').delete().eq('id', userId);
        if (error) return { success: false, error: error.message };
        return { success: true };
    }

    /* ── Init and Public API ─────────────────────────────────── */
    init();

    return {
        login, logout, checkExistingSession,
        getProfile, getUser, isAdmin, isLoggedIn, hasAccess, db,
        adminCreateUser, adminListUsers, adminUpdateUser, adminDeleteUser
    };

})();
