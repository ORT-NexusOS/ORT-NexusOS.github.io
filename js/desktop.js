/* ============================================================
   NEXUS OS — Desktop Manager
   O.R.T. — Ordem da Realidade e Tempo
   ============================================================ */

const Desktop = (() => {

    let _activeWindows = new Set();

    // Listener global para tecla ESC
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            // 1. Fechar Lightbox se aberto
            const lb = $('lightbox');
            if (lb && !lb.classList.contains('hidden')) {
                lb.classList.add('hidden');
                return;
            }
            // 2. Fechar overlays (Modais ou Apps)
            const overlays = Array.from(document.querySelectorAll('.app-overlay'));
            if (overlays.length > 0) {
                const latest = overlays[overlays.length - 1];

                // Se for um modal (tem classe modal-overlay-active), apenas remove
                if (latest.classList.contains('modal-overlay-active')) {
                    latest.remove();
                    Boot.playBeep(440, 0.04, 0.06);
                    return;
                }

                // Se for uma janela de App (formato overlay-appId)
                const appId = latest.id.replace('overlay-', '').replace('compose-overlay', 'emails');
                if (appId && appId !== latest.id) {
                    closeApp(appId === 'emails' ? 'emails' : appId);
                } else {
                    latest.remove();
                    Boot.playBeep(440, 0.04, 0.06);
                }
            }
        }
    });
    let _currentProfile = null;
    let _clockInterval = null;

    /* ── Init Desktop ───────────────────────────────────────── */
    function init(profile) {
        _currentProfile = profile;
        $('screen-desktop').classList.remove('hidden');

        updateWelcome(profile);
        initDataStream(); // Iniciar o fluxo de dados
        updateHeader(profile);
        startClock();
        setUniverseDate();
        renderIconGrid(profile);
        bindTaskbar();
        bindStartMenu();

        // Iniciar atmosfera CRT
        NexusAudio.startAtmosphere();

        // Iniciar escuta de e-mails e chat em tempo real
        Apps.initGlobalRealtime();

        // Render Agent Location Card on desktop
        setTimeout(() => Apps.renderAgentLocationCard?.(), 500);

        // Admin shortcut
        if (profile?.role === 'admin') {
            renderAdminNotification();
        }

        Boot.playBeep(660, 0.05, 0.07);
    }

    /* ── Data Stream Logic ─────────────────────────────────── */
    function initDataStream() {
        const stream = $('welcome-data-stream');
        if (!stream) return;

        const symbols = ['Ω', 'Δ', 'Σ', 'Φ', 'Θ', 'Ξ', 'Π', 'Ψ', '0', '1', 'X', 'F', 'A', '7', '8', '9'];
        const tags = ['[SECURE]', '[CLASSIFIED]', '[ENCRYPTED]', '[SYSTEM]', '[KERNEL]', '[O.R.T.]', '[NEXUS]'];

        function generateLine() {
            const isTag = Math.random() > 0.8;
            if (isTag) {
                const tag = tags[Math.floor(Math.random() * tags.length)];
                return `<span class="data-stream-line highlight">${tag} SESSION_ID_${Math.random().toString(16).slice(2, 6).toUpperCase()}</span>`;
            } else {
                let line = '';
                for (let i = 0; i < 4; i++) {
                    const hex = Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase();
                    line += `0x${hex} `;
                }
                const sym = symbols[Math.floor(Math.random() * symbols.length)];
                line += `| ${sym}${sym}${sym} | `;
                line += Math.random() > 0.5 ? 'OK' : 'WAIT';
                return `<span class="data-stream-line">${line}</span>`;
            }
        }

        // Pre-fill with many lines to allow scrolling
        let content = '';
        for (let i = 0; i < 40; i++) {
            content += generateLine();
        }
        // Duplicate content for seamless loop (CSS animation scrolls -50%)
        stream.innerHTML = content + content;
    }

    /* ── Welcome Message ────────────────────────────────────── */
    function updateWelcome(profile) {
        const name = profile?.display_name || profile?.username || 'AGENTE';
        const role = profile?.role?.toUpperCase() || 'AGENT';

        const pc = $('preview-content');
        if (!pc) return;
        pc.innerHTML = `
      <div class="welcome-message">
        <span class="welcome-title glow">NEXUS OS ONLINE</span>
        <div class="border-box" style="padding:16px 20px; margin: 0 auto; max-width: 380px; text-align:left;">
          <span style="font-family:var(--font-code);font-size:12px;color:var(--green-mid);letter-spacing:2px;display:block;margin-bottom:10px;">
            &gt; SESSÃO INICIADA — ${new Date().toLocaleTimeString('pt-BR')}
          </span>
          <span style="font-size:20px;color:var(--green);display:block;margin-bottom:6px;">
            BOAS-VINDAS, ${name}
          </span>
          <span style="font-family:var(--font-code);font-size:12px;color:var(--green-mid);display:block;">
            CLEARANCE: <span style="color:var(--amber)">${role}</span> &nbsp;|&nbsp;
            ORG: O.R.T.
          </span>
        </div>
        <div class="welcome-agent-sprite" style="margin-top:20px;">
          <div class="data-stream-container">
            <div class="data-stream-overlay"></div>
            <div class="data-stream-scanline"></div>
            <div class="data-stream-content" id="welcome-data-stream">
              <!-- Gerado dinamicamente -->
            </div>
          </div>
        </div>
        <span style="font-family:var(--font-code);font-size:11px;color:var(--green-dark);display:block;margin-top:16px;letter-spacing:2px;">
          Em caso de dúvidas consulte o TERMINAL &gt;_
        </span>
      </div>
    `;
    }

    const AGENT_ASCII = `   .-------.
  /  o   o  \\
 |  -------  |
 |  O.R.T.  |
  \\____|____/
     | | |
   --' | '--
     ORT-008`;

    /* ── Clock ──────────────────────────────────────────────── */
    function startClock() {
        function tick() {
            const now = new Date();
            const hh = String(now.getHours()).padStart(2, '0');
            const mm = String(now.getMinutes()).padStart(2, '0');
            const ss = String(now.getSeconds()).padStart(2, '0');
            const el = $('taskbar-time');
            if (el) el.textContent = `${hh}:${mm}:${ss}`;
        }
        tick();
        _clockInterval = setInterval(tick, 1000);
    }

    /* ── Universe Date ──────────────────────────────────────── */
    function setUniverseDate() {
        const el = $('taskbar-date');
        if (el && typeof UNIVERSE_DATE !== 'undefined') {
            el.textContent = UNIVERSE_DATE.format();
        }
    }

    /* ── Icon Grid ──────────────────────────────────────────── */
    const APPS = [
        { id: 'gallery', icon: '🖼', label: 'Arquivo\nde Artes', module: 'gallery' },
        { id: 'videos', icon: '📹', label: 'Arquivo\nde Vídeos', module: 'videos' },
        { id: 'missions', icon: '📋', label: 'Missões\nAtivas', module: 'missions' },
        { id: 'emails', icon: '📬', label: 'E-mails\nO.R.T.', module: 'emails' },
        { id: 'chat', icon: '💬', label: 'Chat\nOmega', module: 'chat' },
        { id: 'shop', icon: '🛒', label: 'Loja\nO.R.T.', module: 'shop' },
        { id: 'map', icon: '🌌', label: 'Mapa\nGaláctico', module: 'map' },
        { id: 'notepad', icon: '📝', label: 'Bloco de\nNotas', module: 'notepad' },
        { id: 'stats', icon: '👤', label: 'Status\nAgente', module: 'stats' },
        { id: 'inventory', icon: '🎒', label: 'Inventário', module: 'inventory' },
        { id: 'vault', icon: '🔒', label: 'Cofre\nO.R.T.', module: 'vault' },
        { id: 'calendar', icon: '📅', label: 'Linha do\nTempo', module: 'calendar' },
        { id: 'terminal', icon: '💻', label: 'Terminal\nCLI', module: 'terminal' },
        { id: 'combat', icon: '⚔️', label: 'Sincro\nCombate', module: 'combat', adminOnly: true },
        { id: 'admin', icon: '⚙', label: 'Painel\nADM', module: 'admin', adminOnly: true },
        { id: 'shipApp', icon: '🚀', label: 'Minha\nNave', module: 'shipApp' },
        { id: 'travelApp', icon: '🛰️', label: 'Minha\nViagem', module: 'travelApp' },
        { id: 'hangarApp', icon: '🛠️', label: 'Garagem\nO.R.T.', module: 'hangarApp' },
        { id: 'nexusBank', icon: '🏦', label: 'Nexus\nBank', module: 'nexusBank' },
    ];

    function renderIconGrid(profile) {
        const grid = $('icon-grid');
        if (!grid) return;
        grid.innerHTML = '';

        APPS.forEach(app => {
            if (app.adminOnly && profile?.role !== 'admin') return;

            const div = document.createElement('div');
            div.className = 'desktop-icon';
            div.id = `icon-${app.id}`;
            div.title = app.label.replace('\n', ' ');
            div.innerHTML = `
        <div class="icon-img">${app.icon}</div>
        <span class="icon-label">${app.label}</span>
        <div class="icon-badge hidden">0</div>
      `;
            div.addEventListener('click', () => {
                Boot.playBeep(880, 0.04, 0.08);
                openApp(app.id);
            });
            grid.appendChild(div);
        });
    }

    /* ── Open App Window ────────────────────────────────────── */
    function openApp(appId) {
        // Remove existing overlay for this app
        closeApp(appId);

        const overlay = document.createElement('div');
        overlay.className = 'app-overlay';
        overlay.id = `overlay-${appId}`;

        const win = document.createElement('div');
        win.className = 'app-window';
        win.innerHTML = Apps.render(appId);
        overlay.appendChild(win);

        // Close on overlay click (outside window)
        overlay.addEventListener('click', e => {
            if (e.target === overlay) closeApp(appId);
        });

        document.body.appendChild(overlay);
        _activeWindows.add(appId);

        // Init app logic
        Apps.init(appId);

        addTaskbarBtn(appId);
    }

    function closeApp(appId) {
        if (appId === 'travelApp' && window._isVoyageActive) {
            if (typeof showNotification === 'function') {
                showNotification('SISTEMA', 'BLOQUEIO DE SEGURANÇA: NAVE EM TRÂNSITO. AGUARDE A CHEGADA.', 'warning');
            } else if (window.Apps && Apps.showNotification) {
                Apps.showNotification('SISTEMA', 'BLOQUEIO DE SEGURANÇA: NAVE EM TRÂNSITO. AGUARDE A CHEGADA.', 'warning');
            }
            return;
        }
        const overlay = document.getElementById(`overlay-${appId}`);
        if (overlay) overlay.remove();
        _activeWindows.delete(appId);
        removeTaskbarBtn(appId);
        Boot.playBeep(440, 0.04, 0.06);
    }

    window.closeApp = closeApp;

    /* ── Taskbar App Buttons ─────────────────────────────────── */
    function addTaskbarBtn(appId) {
        const center = $('taskbar-center');
        if (!center || document.getElementById(`tb-${appId}`)) return;
        const btn = document.createElement('button');
        btn.className = 'taskbar-app-btn active';
        btn.id = `tb-${appId}`;
        btn.textContent = appId.toUpperCase();
        btn.addEventListener('click', () => openApp(appId));
        center.appendChild(btn);
    }

    function removeTaskbarBtn(appId) {
        document.getElementById(`tb-${appId}`)?.remove();
    }

    /* ── Taskbar ─────────────────────────────────────────────── */
    function bindTaskbar() {
        $('btn-start')?.addEventListener('click', toggleStartMenu);
        $('btn-logout')?.addEventListener('click', () => Auth.logout());
    }

    /* ── Start Menu ──────────────────────────────────────────── */
    function bindStartMenu() {
        document.querySelectorAll('.start-menu-item[data-app]').forEach(el => {
            el.addEventListener('click', () => {
                openApp(el.dataset.app);
                hideStartMenu();
            });
        });
        document.addEventListener('click', e => {
            const menu = $('start-menu');
            const btn = $('btn-start');
            if (menu && !menu.classList.contains('hidden') && !menu.contains(e.target) && !btn.contains(e.target)) {
                hideStartMenu();
            }
        });
    }

    function toggleStartMenu() {
        const menu = $('start-menu');
        if (!menu) return;
        menu.classList.toggle('hidden');
        Boot.playBeep(660, 0.04, 0.07);
    }

    function hideStartMenu() {
        $('start-menu')?.classList.add('hidden');
    }

    /* ── Admin Notification ──────────────────────────────────── */
    function renderAdminNotification() {
        const pc = $('preview-content');
        if (!pc) return;
        const note = document.createElement('div');
        note.className = 'notification-item';
        note.style.marginTop = '16px';
        note.innerHTML = `
      <span class="notif-sender">SISTEMA — ADM</span>
      <div style="font-size:15px;color:var(--amber);margin-top:4px;">
        Acesso de Administrador ativo. Painel ADM disponível.
      </div>
    `;
        // Insert after welcome
        pc.appendChild(note);
    }

    /* ── Badge System ────────────────────────────────────────── */
    function updateBadge(appId, value, increment = false) {
        const badge = $(`icon-${appId}`)?.querySelector('.icon-badge');
        if (!badge) return;

        let current = parseInt(badge.textContent) || 0;
        let newValue = increment ? current + value : value;

        badge.textContent = newValue;
        if (newValue > 0) {
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }

    /* ── Header Update ───────────────────────────────────────── */
    function updateHeader(profile) {
        const uEl = $('header-username');
        const cEl = $('header-clearance');
        if (uEl) uEl.textContent = profile?.display_name || profile?.username || 'AGENTE';
        if (cEl) cEl.textContent = (profile?.role || 'N/A').toUpperCase();
    }

    return { init, openApp, closeApp, updateBadge, updateHeader };

})();
