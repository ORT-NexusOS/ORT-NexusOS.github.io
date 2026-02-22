/* ============================================================
   NEXUS OS — Boot Sequence & Login Controller
   O.R.T. — Ordem da Realidade e Tempo
   ============================================================ */

const Boot = (() => {

    /* ── Web Audio: CRT Sounds ──────────────────────────────── */
    let audioCtx = null;

    function getAudioCtx() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        return audioCtx;
    }

    function playBeep(freq = 880, dur = 0.06, vol = 0.08) {
        if (!NEXUS_CONFIG.audio.enabled) return;
        try {
            const ctx = getAudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(vol * NEXUS_CONFIG.audio.masterVolume, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + dur);
        } catch (e) { /* silence on error */ }
    }

    function playBootStart() {
        if (!NEXUS_CONFIG.audio.enabled) return;
        // Startup chord sequence
        [440, 660, 880].forEach((f, i) => {
            setTimeout(() => playBeep(f, 0.2, 0.12), i * 150);
        });
    }

    function playCRTHum() {
        if (!NEXUS_CONFIG.audio.enabled) return;
        try {
            const ctx = getAudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(60, ctx.currentTime);
            gain.gain.setValueAtTime(0.018 * NEXUS_CONFIG.audio.masterVolume, ctx.currentTime);
            osc.start(ctx.currentTime);
            // Store for later stop
            Boot._humOsc = osc;
            Boot._humGain = gain;
        } catch (e) { /* silence */ }
    }

    function stopCRTHum() {
        try {
            if (Boot._humGain) Boot._humGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
            if (Boot._humOsc) setTimeout(() => Boot._humOsc.stop(), 600);
            Boot._humOsc = null;
            Boot._humGain = null;
        } catch (e) { /* silence */ }
    }

    /* ── Boot Messages ──────────────────────────────────────── */
    const BOOT_MESSAGES = [
        { text: 'NEXUS OS v7.3.1 — INITIALIZING...', cls: 'sys', delay: 300 },
        { text: 'Verificando hardware de sistema... ', cls: 'ok', delay: 500 },
        { text: 'Carregando módulos do kernel... ', cls: 'ok', delay: 400 },
        { text: 'Iniciando protocolo de segurança O.R.T...', cls: '', delay: 500 },
        { text: 'Criptografia de dados: AES-512... ', cls: 'ok', delay: 350 },
        { text: 'Verificando licença do sistema...', cls: '', delay: 400 },
        { text: 'LICENSE: O.R.T. CLASSIFIED — LVL OMEGA', cls: 'sys', delay: 200 },
        { text: 'Conectando ao Mainframe O.R.T...', cls: '', delay: 700 },
        { text: 'CONNECTION ESTABLISHED', cls: 'sys', delay: 300 },
        { text: 'Carregando perfis de usuário...', cls: '', delay: 400 },
        { text: 'Sistema pronto. ACCESS REQUIRED.', cls: 'sys', delay: 200 },
    ];

    /* ── DOM helpers ────────────────────────────────────────── */
    const $ = id => document.getElementById(id);
    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    /* ── Boot Sequence ──────────────────────────────────────── */
    async function runBootSequence() {

        playBootStart();
        playCRTHum();

        const scanline = $('boot-scanline');
        const logo = $('boot-logo');
        const progressWrap = $('boot-progress-wrap');
        const progressFill = $('boot-progress-bar-fill');
        const progressPct = $('boot-progress-pct');
        const messages = $('boot-messages');
        const ortBadge = $('boot-ort-badge');

        // 1. Scanline sweeps down
        await sleep(200);
        if (scanline) scanline.style.top = '100%';
        await sleep(1400);

        // 2. Show logo
        if (logo) logo.classList.add('visible');
        playBeep(1200, 0.08, 0.15);
        await sleep(400);
        playBeep(900, 0.08, 0.15);
        await sleep(300);

        // 3. Show progress and messages
        if (progressWrap) progressWrap.classList.add('visible');
        if (messages) messages.classList.add('visible');
        if (ortBadge) ortBadge.classList.add('visible');

        let progress = 0;
        const progressPerMsg = 90 / BOOT_MESSAGES.length;

        for (const msg of BOOT_MESSAGES) {
            await sleep(msg.delay);

            // Add message line
            if (messages) {
                const line = document.createElement('span');
                line.className = `boot-line ${msg.cls}`;
                line.textContent = '> ' + msg.text;
                messages.appendChild(line);
                messages.scrollTop = messages.scrollHeight;
            }

            playBeep(440 + Math.random() * 200, 0.03, 0.05);

            // Update progress
            progress += progressPerMsg;
            if (progressFill) progressFill.style.width = Math.min(progress, 90) + '%';
            if (progressPct) progressPct.textContent = Math.floor(Math.min(progress, 90)) + '%';
        }

        // 4. Complete progress
        await sleep(300);
        if (progressFill) progressFill.style.width = '100%';
        if (progressPct) progressPct.textContent = '100%';
        playBeep(440, 0.05, 0.08);
        await sleep(100);
        playBeep(660, 0.05, 0.08);
        await sleep(100);
        playBeep(880, 0.15, 0.12);

        // 5. Flash and transition to login
        await sleep(500);
        stopCRTHum();

        const bootScreen = $('screen-boot');
        bootScreen.classList.add('screen-flash');
        await sleep(400);

        bootScreen.style.display = 'none';
        showLogin();
    }

    /* ── Login Screen ───────────────────────────────────────── */
    function showLogin() {
        const loginScreen = $('screen-login');
        if (loginScreen) loginScreen.classList.remove('hidden');

        // Focus username field
        setTimeout(() => {
            const u = $('login-username');
            if (u) u.focus();
        }, 300);

        // Animate login box in
        const loginBox = $('login-box');
        if (loginBox) {
            loginBox.style.opacity = '0';
            loginBox.style.transform = 'translateY(16px)';
            setTimeout(() => {
                loginBox.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                loginBox.style.opacity = '1';
                loginBox.style.transform = 'translateY(0)';
            }, 100);
        }

        // Enter key on fields submits
        ['login-username', 'login-password'].forEach(id => {
            const el = $(id);
            if (el) el.addEventListener('keydown', e => {
                if (e.key === 'Enter') attemptLogin();
            });
        });

        $('btn-login')?.addEventListener('click', attemptLogin);
    }

    /* ── Login Attempt ──────────────────────────────────────── */
    async function attemptLogin() {
        const email = $('login-username')?.value?.trim();
        const password = $('login-password')?.value?.trim();
        const statusEl = $('login-status');

        if (!email || !password) {
            setLoginStatus('CAMPOS OBRIGATÓRIOS — INSIRA CREDENCIAIS', 'error');
            playBeep(220, 0.15, 0.12);
            return;
        }

        setLoginStatus('AUTENTICANDO... AGUARDE', 'info');
        playBeep(660, 0.05, 0.08);

        const result = await Auth.login(email, password);

        if (result.success) {
            setLoginStatus('ACESSO AUTORIZADO — CARREGANDO SISTEMA', 'ok');
            playBeep(880, 0.08, 0.1);
            await sleep(400);
            playBeep(1100, 0.1, 0.12);
            await sleep(600);

            $('screen-login').classList.add('hidden');
            Desktop.init(result.user);

        } else {
            setLoginStatus('ACESSO NEGADO — ' + (result.error || 'CREDENCIAIS INVÁLIDAS'), 'error');
            playBeep(180, 0.3, 0.15);

            // Shake animation
            const box = $('login-box');
            if (box) {
                box.style.animation = 'shake 0.3s ease';
                setTimeout(() => box.style.animation = '', 300);
            }
        }
    }

    function setLoginStatus(msg, cls) {
        const el = $('login-status');
        if (!el) return;
        el.textContent = msg;
        el.className = cls;
    }

    /* ── Public API ─────────────────────────────────────────── */
    return { runBootSequence, showLogin, playBeep };

})();

/* ── Shake keyframe (injected) ──────────────────────────── */
const _style = document.createElement('style');
_style.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-8px); }
    40%      { transform: translateX(8px); }
    60%      { transform: translateX(-5px); }
    80%      { transform: translateX(5px); }
  }
`;
document.head.appendChild(_style);
