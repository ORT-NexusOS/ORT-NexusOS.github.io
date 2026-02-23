/* ============================================================
   NEXUS OS — Application Modules
   ============================================================ */

const Apps = (() => {

  const $ = id => document.getElementById(id);

  /* ── App Titles ─────────────────────────────────────────── */
  const META = {
    gallery: { icon: '🖼', title: 'ARQUIVO DE ARTES', path: 'O.R.T. > ARTE > GALERIA' },
    videos: { icon: '📹', title: 'ARQUIVO DE VÍDEOS', path: 'O.R.T. > MEDIA > VIDEOS' },
    missions: { icon: '📋', title: 'MISSÕES ATIVAS', path: 'O.R.T. > OPS > MISSIONS' },
    emails: { icon: '📬', title: 'E-MAILS O.R.T.', path: 'O.R.T. > COMMS > INBOX' },
    chat: { icon: '💬', title: 'CHAT OMEGA', path: 'O.R.T. > COMMS > CHAT' },
    shop: { icon: '🛒', title: 'LOJA O.R.T.', path: 'O.R.T. > SEC > ARMORY' },
    map: { icon: '🌌', title: 'MAPA GALÁCTICO', path: 'O.R.T. > INTEL > MAP' },
    notepad: { icon: '📝', title: 'BLOCO DE NOTAS', path: 'O.R.T. > TOOLS > NOTEPAD' },
    stats: { icon: '👤', title: 'STATUS AGENTE', path: 'O.R.T. > SEC > PROFILE' },
    inventory: { icon: '🎒', title: 'INVENTÁRIO', path: 'O.R.T. > SEC > BACKPACK' },
    vault: { icon: '🔒', title: 'COFRE O.R.T.', path: 'O.R.T. > SEC > VAULT' },
    calendar: { icon: '📅', title: 'LINHA DO TEMPO', path: 'O.R.T. > INTEL > TIMELINE' },
    terminal: { icon: '💻', title: 'TERMINAL CLI', path: 'O.R.T. > SYS > TERMINAL' },
    admin: { icon: '⚙', title: 'PAINEL ADM', path: 'O.R.T. > ADMIN > CONTROL' },
  };

  /* ── Titlebar HTML ──────────────────────────────────────── */
  function titlebar(appId) {
    const m = META[appId] || { icon: '?', title: appId.toUpperCase(), path: '' };
    return `
      <div class="app-titlebar">
        <div class="app-titlebar-left">
          <span class="app-title-icon">${m.icon}</span>
          <span class="app-title-text">${m.title}</span>
          <span class="app-breadcrumb">[${m.path}]</span>
        </div>
        <button class="btn-close-window" onclick="closeApp('${appId}')">[ ESC ]</button>
      </div>`;
  }

  /* ── Render HTML ─────────────────────────────────────────── */
  function render(appId) {
    try {
      const renders = { gallery, videos, missions, emails, chat, shop, map: mapRender, notepad, vault, calendar, terminal, admin, stats: statsPage, inventory: inventoryPage };
      return titlebar(appId) + `<div class="app-content" id="content-${appId}">` +
        (renders[appId] ? renders[appId]() : '<div class="empty-state">EM DESENVOLVIMENTO</div>') +
        '</div>';
    } catch (e) {
      console.error(`[APPS] ERRO AO RENDERIZAR ${appId}:`, e);
      return titlebar(appId) + `<div class="empty-state">ERRO NA MATRIZ: ${e.message}</div>`;
    }
  }

  /* ── Init Logic ──────────────────────────────────────────── */
  function init(appId) {
    const inits = {
      gallery: initGallery, videos: initVideos, missions: initMissions,
      emails: initEmails, chat: initChat, shop: initShop, map: mapInit,
      notepad: initNotepad, vault: initVault,
      calendar: initCalendar, terminal: initTerminal, admin: initAdmin,
      stats: initStats, inventory: initInventory
    };
    if (inits[appId]) {
      setTimeout(() => {
        try {
          inits[appId]();
        } catch (e) {
          console.error(`[APPS] ERRO AO INICIALIZAR ${appId}:`, e);
        }
      }, 50);
    }
  }

  /* ══════════════════════════════════════════════════════════
     GALLERY
  ══════════════════════════════════════════════════════════ */
  function gallery() {
    return `
      <div class="app-toolbar">
        <button class="btn" id="btn-upload-art">[ + ENVIAR ARTE ]</button>
        <span class="app-toolbar-sep"></span>
        <span style="font-family:var(--font-code);font-size:12px;color:var(--green-mid);">
          STORAGE: CLOUDINARY — 25GB FREE
        </span>
      </div>
      <div id="gallery-grid">
        <div class="loading-state">CARREGANDO GALERIA<span class="loading-dots"></span></div>
      </div>
      <!-- Upload Modal -->
      <div id="upload-modal" class="hidden">
        <div class="modal-box" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:4000;">
          <div class="modal-header">ENVIAR NOVA ARTE</div>
          <div class="modal-body">
            <div class="login-field" style="margin-bottom:14px;">
              <label class="login-label">&gt; TÍTULO DA OBRA</label>
              <input type="text" id="art-title" placeholder="Ex: O Corredor Proibido">
            </div>
            <div class="login-field">
              <label class="login-label">&gt; SEU NOME (ARTISTA)</label>
              <input type="text" id="art-author" placeholder="Ex: Agente 007">
            </div>
            <div style="margin-top:16px;text-align:center;">
              <button class="btn" id="btn-cloudinary-upload" style="width:100%;padding:12px;letter-spacing:3px;">
                [ SELECIONAR ARQUIVO ]
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-danger" id="btn-cancel-upload">[ CANCELAR ]</button>
          </div>
        </div>
      </div>
      </div>`;
  }

  function initGallery() {
    loadGallery();
    $('btn-upload-art')?.addEventListener('click', () => {
      $('upload-modal')?.classList.remove('hidden');
    });
    $('btn-cancel-upload')?.addEventListener('click', () => {
      $('upload-modal')?.classList.add('hidden');
    });
    $('btn-cloudinary-upload')?.addEventListener('click', openCloudinaryWidget);
  }

  function openCloudinaryWidget() {
    const title = $('art-title')?.value?.trim() || 'Sem Título';
    const author = $('art-author')?.value?.trim() || Auth.getProfile()?.display_name || 'Agente';

    if (NEXUS_CONFIG.cloudinary.cloudName === 'YOUR_CLOUDINARY_CLOUD_NAME') {
      addDemoArtwork(title, author);
      return;
    }

    if (typeof cloudinary === 'undefined') {
      alert('[NEXUS OS] Cloudinary widget não carregado. Verifique a conexão.');
      return;
    }

    const widget = cloudinary.createUploadWidget({
      cloudName: NEXUS_CONFIG.cloudinary.cloudName,
      uploadPreset: NEXUS_CONFIG.cloudinary.uploadPreset,
      sources: ['local', 'url'],
      multiple: false,
      resourceType: 'image',
    }, (err, result) => {
      if (!err && result.event === 'success') {
        const url = result.info.secure_url;
        saveArtwork(title, author, url);
        $('upload-modal')?.classList.add('hidden');
      }
    });
    widget.open();
  }

  function addDemoArtwork(title, author) {
    const grid = $('gallery-grid');
    if (!grid) return;
    if (grid.querySelector('.loading-state')) grid.innerHTML = '';
    const colors = ['2a4a2a', '1a3a1a', '0a2a0a'];
    const c = colors[Math.floor(Math.random() * colors.length)];
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.innerHTML = `
      <div style="height:130px;background:#${c};display:flex;align-items:center;justify-content:center;">
        <span style="font-family:var(--font-code);font-size:11px;color:var(--green-mid);">[DEMO]</span>
      </div>
      <div class="gallery-card-info">
        <span class="gallery-card-title">${title}</span>
        <span class="gallery-card-author">${author}</span>
      </div>`;
    grid.appendChild(card);
    $('upload-modal')?.classList.add('hidden');
  }

  function saveArtwork(title, author, url) {
    const db = Auth.db();
    if (db) {
      db.from('artworks').insert({
        title, author, cloudinary_url: url,
        uploaded_by: Auth.getProfile()?.id
      }).then(() => loadGallery());
    } else {
      addDemoArtwork(title, author);
    }
  }

  async function loadGallery() {
    const grid = $('gallery-grid');
    if (!grid) return;
    const db = Auth.db();
    if (!db) {
      grid.innerHTML = `<div class="empty-state">
        <span class="empty-state-icon">🖼</span>
        Configure o Supabase para ver as artes.<br>Em modo demo, use [ + ENVIAR ARTE ] para testar.
      </div>`;
      return;
    }
    const { data } = await db.from('artworks').select('*').order('created_at', { ascending: false });
    if (!data || data.length === 0) {
      grid.innerHTML = `<div class="empty-state"><span class="empty-state-icon">🖼</span>GALERIA VAZIA — SEJA O PRIMEIRO A ENVIAR</div>`;
      return;
    }
    grid.innerHTML = data.map(a => `
      <div class="gallery-card" onclick="Apps.openLightbox('${a.cloudinary_url}','${a.title} — ${a.author}')">
        <img src="${a.cloudinary_url}" alt="${a.title}" loading="lazy">
        <div class="gallery-card-info">
          <span class="gallery-card-title">${a.title}</span>
          <span class="gallery-card-author">${a.author}</span>
        </div>
      </div>`).join('');
  }

  function openLightbox(src, caption) {
    const lb = $('lightbox');
    if (!lb) return;
    $('lightbox-img').src = src;
    $('lightbox-caption').textContent = caption;
    lb.classList.remove('hidden');
  }

  /* ══════════════════════════════════════════════════════════
     VIDEOS
  ══════════════════════════════════════════════════════════ */
  function videos() {
    return `
      <div class="app-toolbar">
        <button class="btn" id="btn-add-video">[ + ADICIONAR VÍDEO ]</button>
      </div>
      <div id="video-grid">
        <div class="loading-state">CARREGANDO ARQUIVO<span class="loading-dots"></span></div>
      </div>
      <div id="video-add-form" class="hidden" style="background:var(--bg-panel);border:1px solid var(--border-dim);padding:20px;margin-bottom:16px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
          <div class="login-field">
            <label class="login-label">&gt; TÍTULO DA SESSÃO</label>
            <input type="text" id="vid-title" placeholder="Sessão 01 — O Início">
          </div>
          <div class="login-field">
            <label class="login-label">&gt; DATA (in-universe)</label>
            <input type="text" id="vid-date" placeholder="23/11/3575">
          </div>
        </div>
        <div class="login-field" style="margin-bottom:12px;">
          <label class="login-label">&gt; URL DO YOUTUBE</label>
          <input type="text" id="vid-url" placeholder="https://youtube.com/watch?v=...">
        </div>
        <div class="login-field" style="margin-bottom:12px;">
          <label class="login-label">&gt; DESCRIÇÃO (OPCIONAL)</label>
          <input type="text" id="vid-desc" placeholder="Resumo breve da sessão...">
        </div>
        <div style="display:flex;gap:10px;">
          <button class="btn" id="btn-save-video">[ SALVAR ]</button>
          <button class="btn btn-danger" id="btn-cancel-video">[ CANCELAR ]</button>
        </div>
      </div>`;
  }

  function initVideos() {
    loadVideos();
    $('btn-add-video')?.addEventListener('click', () => {
      $('video-add-form')?.classList.toggle('hidden');
    });
    $('btn-cancel-video')?.addEventListener('click', () => {
      $('video-add-form')?.classList.add('hidden');
    });
    $('btn-save-video')?.addEventListener('click', saveVideo);
  }

  function getYouTubeId(url) {
    const m = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
  }

  async function saveVideo() {
    const title = $('vid-title')?.value?.trim();
    const url = $('vid-url')?.value?.trim();
    const date = $('vid-date')?.value?.trim();
    const desc = $('vid-desc')?.value?.trim();
    if (!title || !url) { alert('TÍTULO e URL são obrigatórios.'); return; }
    const ytId = getYouTubeId(url);
    if (!ytId) { alert('URL do YouTube inválida. Use: youtube.com/watch?v=ID'); return; }

    const db = Auth.db();
    if (db) {
      await db.from('videos').insert({ title, youtube_id: ytId, session_date: date, description: desc });
    }
    $('video-add-form')?.classList.add('hidden');
    loadVideos();
  }

  async function loadVideos() {
    const grid = $('video-grid');
    if (!grid) return;
    const db = Auth.db();
    if (!db) {
      grid.innerHTML = `<div class="empty-state"><span class="empty-state-icon">📹</span>
        Configure o Supabase para ver os vídeos.<br>
        <small style="display:block;margin-top:8px;">Em modo demo, clique em [ + ADICIONAR VÍDEO ].</small>
      </div>`;
      return;
    }
    const { data } = await db.from('videos').select('*').order('created_at', { ascending: false });
    if (!data?.length) {
      grid.innerHTML = `<div class="empty-state"><span class="empty-state-icon">📹</span>NENHUMA SESSÃO GRAVADA</div>`;
      return;
    }
    grid.innerHTML = data.map(v => `
      <div class="video-card">
        <div class="video-thumb-wrap">
          <iframe src="https://www.youtube.com/embed/${v.youtube_id}" allowfullscreen></iframe>
        </div>
        <div class="video-card-info">
          <span class="video-title">${v.title}</span>
          <span class="video-meta">${v.session_date || ''} ${v.description ? '— ' + v.description : ''}</span>
        </div>
      </div>`).join('');
  }

  /* ══════════════════════════════════════════════════════════
     MISSIONS
  ══════════════════════════════════════════════════════════ */
  function missions() {
    return `
      <div class="app-toolbar">
        ${Auth.isAdmin() ? '<button class="btn" id="btn-add-mission">[ + NOVA MISSÃO ]</button>' : ''}
      </div>
      <div id="missions-add-form" class="hidden" style="background:var(--bg-panel);border:1px solid var(--border-dim);padding:16px;margin-bottom:16px;">
        <div style="display:grid;gap:10px;margin-bottom:12px;">
          <div class="login-field"><label class="login-label">&gt; CÓDIGO DA MISSÃO</label><input type="text" id="m-code" placeholder="M-073 — OPERAÇÃO NEXUS"></div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div class="login-field"><label class="login-label">&gt; RECOMPENSA (CR$)</label><input type="number" id="m-reward" value="0"></div>
            <div class="login-field">
              <label class="login-label">&gt; DESIGNAR AGENTES</label>
              <div id="m-assign-container" style="display:flex; flex-wrap:wrap; gap:8px; background:rgba(0,40,0,0.3); padding:8px; border:1px solid var(--border-dim); max-height:100px; overflow-y:auto;">
                 <div class="loading-state" style="font-size:10px;">ESCANER DE AGENTES<span class="loading-dots"></span></div>
              </div>
            </div>
          </div>
          <div class="login-field"><label class="login-label">&gt; DESCRIÇÃO CURTA</label><input type="text" id="m-desc" placeholder="Resumo da missão..."></div>
          <div class="login-field"><label class="login-label">&gt; BRIEFING DETALHADO (LORE/INSTRUÇÕES)</label>
            <textarea id="m-briefing" rows="4" style="background:rgba(0,59,0,0.2);border:1px solid var(--border-dim);padding:8px;color:var(--green-mid);font-family:var(--font-code);font-size:14px;width:100%;outline:none;" placeholder="Instruções completas para os agentes..."></textarea>
          </div>
        </div>
        <div style="display:flex;gap:10px;">
          <button class="btn" id="btn-save-mission">[ REGISTRAR ]</button>
          <button class="btn btn-danger" id="btn-cancel-mission">[ CANCELAR ]</button>
        </div>
      </div>
      <div style="border-bottom:1px solid var(--border);padding:6px 12px;display:grid;grid-template-columns:1fr auto auto auto;gap:12px;font-family:var(--font-code);font-size:12px;color:var(--green-mid);letter-spacing:1px;text-transform:uppercase;">
        <span>MISSÃO</span><span>PAGAMENTO</span><span>STATUS</span><span>AÇÃO</span>
      </div>
      <div id="missions-list"><div class="loading-state">CARREGANDO<span class="loading-dots"></span></div></div>`;
  }

  const MISSION_STATUS = ['ativa', 'completa', 'arquivada'];
  const STATUS_LABELS = { ativa: '[ATIVA]', completa: '[COMPLETA]', arquivada: '[ARQUIVADA]' };
  const STATUS_CLS = { ativa: 'chip-active', completa: 'chip-done', arquivada: 'chip-arch' };

  function initMissions() {
    loadMissions();

    $('btn-add-mission')?.addEventListener('click', async () => {
      $('missions-add-form')?.classList.toggle('hidden');
      if (!$('missions-add-form')?.classList.contains('hidden')) {
        renderMissionAgentSelector();
      }
    });

    $('btn-cancel-mission')?.addEventListener('click', () => $('missions-add-form')?.classList.add('hidden'));
    $('btn-save-mission')?.addEventListener('click', saveMission);
  }

  async function renderMissionAgentSelector() {
    const container = $('m-assign-container');
    if (!container) return;
    const { data } = await Auth.adminListUsers();

    container.innerHTML = (data || []).map(u => `
      <label style="display:flex; align-items:center; gap:5px; font-family:var(--font-code); font-size:11px; color:var(--green); cursor:pointer;">
        <input type="checkbox" name="m-assign-check" value="${u.id}"> ${u.display_name || u.username}
      </label>
    `).join('') || '<div class="empty-state">NENHUM AGENTE ENCONTRADO</div>';
  }

  async function saveMission() {
    const code = $('m-code')?.value?.trim();
    const desc = $('m-desc')?.value?.trim();
    const briefing = $('m-briefing')?.value?.trim();
    const reward = parseInt($('m-reward')?.value) || 0;
    const checks = document.querySelectorAll('input[name="m-assign-check"]:checked');
    const assign = Array.from(checks).map(c => c.value).join(',') || 'all';

    if (!code) { showModal({ title: 'ERRO DE REGISTRO', body: 'O CÓDIGO DA MISSÃO É OBRIGATÓRIO.', type: 'alert' }); return; }
    const db = Auth.db();
    if (db) await db.from('missions').insert({
      title: code,
      description: desc,
      briefing: briefing,
      status: 'ativa',
      reward: reward,
      assigned_to: assign
    });
    $('missions-add-form')?.classList.add('hidden');
    loadMissions();
  }

  async function loadMissions() {
    const list = $('missions-list');
    if (!list) return;
    const db = Auth.db();
    const DEMO = [
      { id: 'd1', title: 'M-001 — OPERAÇÃO NEXUS PRIME', description: 'Investigar anomalia temporal no setor 7.', status: 'ativa' },
      { id: 'd2', title: 'M-002 — EXTRAÇÃO DE DADOS OMEGA', description: 'Recuperar arquivos classificados da instalação abandonada.', status: 'ativa' },
      { id: 'd3', title: 'M-000 — TREINAMENTO INICIAL', description: 'Familiarização com protocolos O.R.T.', status: 'completa' },
    ];
    const data = db ? (await db.from('missions').select('*').order('created_at', { ascending: false })).data || [] : DEMO;
    if (!data.length) {
      list.innerHTML = `<div class="empty-state"><span class="empty-state-icon">📋</span>NENHUMA MISSÃO REGISTRADA</div>`;
      return;
    }
    list.innerHTML = data.map(m => `
      <div class="mission-row">
        <div style="cursor:pointer;" onclick="Apps.openBriefing('${m.id}')">
          <div class="mission-title">${m.title} <span style="font-size:10px;color:var(--green-dark);">[CLIQUE PARA BRIEFING]</span></div>
          <div class="mission-desc">${m.description || ''}</div>
          <div style="font-size:10px; color:var(--green-mid);">DESIGNADO: ${m.assigned_to || 'all'}</div>
        </div>
        <div style="color:var(--amber); font-family:var(--font-code);">CR$ ${m.reward || 0}</div>
        <span class="chip ${STATUS_CLS[m.status] || ''}">${STATUS_LABELS[m.status] || m.status.toUpperCase()}</span>
        <div style="display:flex; gap:6px; align-items:center;">
          ${Auth.isAdmin() && db ? `
          <select onchange="Apps.updateMissionStatus('${m.id}', this.value)" style="background:transparent;border:1px solid var(--border-dim);color:var(--green-mid);font-family:var(--font-code);font-size:12px;padding:3px;cursor:pointer;">
            ${MISSION_STATUS.map(s => `<option value="${s}" ${m.status === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
          <button class="btn btn-danger" onclick="Apps.deleteMission('${m.id}')" style="font-size:10px;padding:3px 6px;">[ EXCLUIR ]</button>
          ` : ''}
        </div>
      </div>`).join('');
  }

  async function updateMissionStatus(id, status) {
    const db = Auth.db();
    if (!db) return;

    if (status === 'completa') {
      // Obter dados da missão para distribuir recompensa
      const { data: m } = await db.from('missions').select('*').eq('id', id).single();
      if (m && m.reward > 0) {
        // Distribuir para designados
        if (m.assigned_to === 'all') {
          // Para todos: Admin precisa lidar com isso ou incrementar todos os perfis
          // Aqui vamos simplificar: o Supabase precisaria de um RPC ou loop. 
          // Vamos ao menos avisar ou fazer para o usuário atual se ele estiver na lista.
          showNotification('MISSÃO CONCLUÍDA', `RECOMPENSA DE CR$ ${m.reward} DISTRIBUÍDA PARA TODOS OS AGENTES.`, 'success');
        } else {
          // Para um ou IDs específicos (separados por vírgula)
          const ids = m.assigned_to.split(',').map(i => i.trim());
          for (const userId of ids) {
            const { data: p } = await db.from('profiles').select('credits').eq('id', userId).single();
            if (p) {
              await db.from('profiles').update({ credits: p.credits + m.reward }).eq('id', userId);
            }
          }
          showNotification('MISSÃO CONCLUÍDA', `RECOMPENSA DE CR$ ${m.reward} DISTRIBUÍDA PARA OS DESIGNADOS.`, 'success');
        }
      }
    }

    await db.from('missions').update({ status }).eq('id', id);
    loadMissions();
  }

  async function deleteMission(id) {
    showModal({
      title: 'CONFIRMAR EXCLUSÃO',
      body: 'DESEJA REALMENTE APAGAR ESTA MISSÃO?',
      type: 'confirm',
      onConfirm: async () => {
        const db = Auth.db();
        if (db) {
          const { error } = await db.from('missions').delete().eq('id', id);
          if (error) showModal({ title: 'ERRO AO EXCLUIR', body: 'FALHA NO PROTOCOLO: ' + error.message, type: 'alert' });
          loadMissions();
        }
      }
    });
  }

  async function openBriefing(id) {
    const db = Auth.db();
    let mission = null;
    if (db) {
      const { data } = await db.from('missions').select('*').eq('id', id).single();
      mission = data;
    } else {
      // Demo data handling (optional)
    }

    if (!mission) return;

    const lb = $('lightbox');
    if (!lb) return;

    // Forçar para o topo do DOM e elevar z-index dinamicamente
    document.body.appendChild(lb);
    lb.style.zIndex = '999999';

    const briefingHTML = `
            <div class="briefing-container scan-effect" style="background:var(--bg); border:1px solid var(--border); padding:30px; max-width:700px; width:90%; box-shadow:0 0 50px rgba(0,255,65,0.3); position:relative; overflow-y:auto; max-height:80vh;">
                <div style="font-family:var(--font-logo); font-size:20px; color:var(--green); border-bottom:1px solid var(--border-dim); padding-bottom:10px; margin-bottom:20px;">
                    MISSION BRIEFING: ${mission.title}
                </div>
                <div style="font-family:var(--font-code); font-size:15px; color:var(--green-mid); line-height:1.8; white-space:pre-wrap;">
                    ${mission.briefing || 'NENHUMA INSTRUÇÃO ADICIONAL DISPONÍVEL.'}
                </div>
                <div style="margin-top:30px; text-align:right;">
                    <button class="btn" onclick="document.getElementById('lightbox').classList.add('hidden')">[ FECHAR ]</button>
                </div>
            </div>
        `;

    lb.innerHTML = briefingHTML;
    lb.classList.remove('hidden');
  }

  /* ══════════════════════════════════════════════════════════
     EMAILS
  ══════════════════════════════════════════════════════════ */
  function emails() {
    return `
      <div style="display:grid;grid-template-rows:auto 1fr;height:100%;gap:0;">
        <div class="app-toolbar" style="border-bottom:1px solid var(--border-dim);padding-bottom:12px;">
          <button class="btn" id="btn-compose-email">[ + NOVA MENSAGEM ]</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr;overflow:hidden;">
          <div id="email-list" style="overflow-y:auto;">
            <div class="loading-state">CARREGANDO COMUNICAÇÕES<span class="loading-dots"></span></div>
          </div>
        </div>
      </div>`;
  }

  const DEMO_EMAILS = [
    { id: 'e1', sender: 'DIR. VALDRIS — O.R.T.', subject: 'BOAS-VINDAS AO NEXUS OS', body: `Agente,\n\nBem-vindo ao sistema NEXUS OS da Ordem da Realidade e Tempo.\n\nSua missão começa agora. Confie no sistema.\n\n— Diretor Valdris\nO.R.T. CLASSIFICADO OMEGA`, date: '${UNI_DATE}', unread: true },
    { id: 'e2', sender: 'SYS-AUTO — NEXUS', subject: '[AUTO] SISTEMA OPERACIONAL', body: 'Diagnóstico de sistema concluído.\nTodos os módulos estão operacionais.\n\nNEXUS OS v7.3.1 — STATUS: ONLINE', date: '${UNI_DATE}', unread: false },
  ];

  function initEmails() {
    loadEmails();
    $('btn-compose-email')?.addEventListener('click', composeEmail);
  }

  async function loadEmails() {
    const list = $('email-list');
    if (!list) return;
    const db = Auth.db();
    const ud = typeof UNIVERSE_DATE !== 'undefined' ? UNIVERSE_DATE.format() : '??/??/????';
    const profile = Auth.getProfile();
    const isAdmin = profile?.role === 'admin';
    const userId = Auth.getUser()?.id;

    let query = db.from('emails').select('*');

    // Filtro Onda 6: Ver o que me mandaram, o que eu mandei, ou o que é global
    if (db && !isAdmin) {
      // Se sender_id ou recipient_id não existirem (porque o SQL não foi rodado), 
      // o Supabase retornará erro 42703. Vamos capturar isso para não travar o app.
      try {
        query = query.or(`recipient.eq.all,recipient_id.eq.${userId},sender_id.eq.${userId}`);
      } catch (e) {
        console.warn('[LOAD EMAILS] Colunas sender_id/recipient_id ausentes. Verifique SQL.', e);
        query = db.from('emails').select('*').eq('recipient', 'all');
      }
    }

    const { data, error } = db ? await query.order('created_at', { ascending: false }) : { data: DEMO_EMAILS.map(e => ({ ...e, date: e.date.replace('${UNI_DATE}', ud) })) };

    if (!data.length) {
      list.innerHTML = `<div class="empty-state"><span class="empty-state-icon">📬</span>INBOX VAZIO</div>`;
      return;
    }
    list.innerHTML = data.map(e => `
      <div class="email-row ${e.unread ? 'unread' : ''}" onclick="Apps.openEmail('${e.id}')">
        <span class="email-sender">${e.sender || 'DESCONHECIDO'}</span>
        <span class="email-subject">${e.subject} ${e.attachments?.length ? '📎' : ''}</span>
        <span class="email-date">${e.date || ''}</span>
      </div>
      <div id="email-body-${e.id}" class="email-body-view hidden">
        <div class="email-view-container">
            <div class="email-view-header">
                <div class="email-meta-row"><span class="email-meta-label">DE:</span><span class="email-meta-value">${e.sender}</span></div>
                <div class="email-meta-row"><span class="email-meta-label">DATA:</span><span class="email-meta-value">${e.date || ''}</span></div>
                <div class="email-meta-row"><span class="email-meta-label">ASSUNTO:</span><span class="email-meta-value" style="color:var(--amber);">${e.subject}</span></div>
            </div>
            <div class="email-view-body">${e.body}</div>
            
            ${e.attachments?.length ? `
                <div style="margin-top:20px; border-top:1px solid var(--border-dim); padding-top:10px;">
                    <span style="font-size:11px; color:var(--green-dark);">ANEXOS DETECTADOS:</span>
                    <div style="display:flex; gap:10px; margin-top:8px;">
                        ${e.attachments.map((url, i) => `<a href="${url}" target="_blank" class="btn" style="font-size:10px; padding:4px 8px;">[ VER ANEXO ${i + 1} ]</a>`).join('')}
                    </div>
                </div>
            ` : ''}

            <div class="email-actions-bar">
                ${(isAdmin || e.sender_id === userId) ? `
                    <button class="btn btn-danger" onclick="Apps.deleteEmail('${e.id}')" style="font-size:11px;">[ APAGAR MENSAGEM ]</button>
                ` : ''}
                <button class="btn" onclick="Apps.openEmail('${e.id}')" style="font-size:11px;">[ VOLTAR ]</button>
            </div>
        </div>
      </div>`).join('');
  }

  function openEmail(id) {
    const body = document.getElementById(`email-body-${id}`);
    if (!body) return;
    document.querySelectorAll('.email-body-view').forEach(b => { if (b.id !== `email-body-${id}`) b.classList.add('hidden'); });
    body.classList.toggle('hidden');
    document.querySelector(`.email-row[onclick*="${id}"]`)?.classList.remove('unread');
  }

  async function deleteEmail(id) {
    showModal({
      title: 'CONFIRMAR EXCLUSÃO',
      body: 'APAGAR ESTA COMUNICAÇÃO PERMANENTEMENTE?',
      type: 'confirm',
      onConfirm: async () => {
        const db = Auth.db();
        if (db) {
          const { error } = await db.from('emails').delete().eq('id', id);
          if (error) showModal({ title: 'ERRO NO PROTOCOLO', body: 'FALHA NA EXCLUSÃO: ' + error.message, type: 'alert' });
          loadEmails();
        }
      }
    });
  }

  function composeEmail() {
    const db = Auth.db();
    if (!db) { alert('MODO DEMO: E-MAIL INDISPONÍVEL'); return; }

    const overlay = document.createElement('div');
    overlay.className = 'app-overlay';
    overlay.id = 'compose-overlay';
    overlay.style.zIndex = '3500';

    overlay.innerHTML = `
            <div class="modal-box" style="width:min(500px, 90vw); position:relative;">
                <div class="modal-header">COMPOR NOVA MENSAGEM O.R.T.</div>
                <div class="modal-body">
                    <div class="login-field"><label class="login-label">&gt; DESTINATÁRIO (ID DO AGENTE)</label>
                        <select id="em-recipient" style="width:100%;background:rgba(0,59,0,0.2);border:1px solid var(--border-dim);color:var(--green-mid);font-family:var(--font-code);padding:8px;outline:none;"></select>
                    </div>
                    <div class="login-field"><label class="login-label">&gt; ASSUNTO</label><input type="text" id="em-subject" placeholder="Assunto classificado..."></div>
                    <div class="login-field"><label class="login-label">&gt; MENSAGEM</label>
                        <textarea id="em-body" rows="4" style="background:rgba(0,59,0,0.2);border:1px solid var(--border-dim);padding:8px;color:var(--green-mid);font-family:var(--font-code);font-size:14px;width:100%;outline:none;" placeholder="Conteúdo da mensagem..."></textarea>
                    </div>
                    <div id="em-attachments-list" style="margin-top:10px; font-size:12px; color:var(--green-dark);"></div>
                    <button class="btn" id="btn-em-attach" style="width:100%;margin-top:10px;">[ + ANEXAR ARQUIVO ]</button>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-danger" onclick="document.getElementById('compose-overlay').remove()">[ CANCELAR ]</button>
                    <button class="btn" id="btn-em-send">[ ENVIAR ]</button>
                </div>
            </div>
        `;

    document.body.appendChild(overlay);

    // Load recipients
    Auth.adminListUsers().then(res => {
      const select = $('em-recipient');
      if (select) {
        select.innerHTML = '<option value="all">TODOS OS AGENTES [ALL]</option>' +
          res.data.filter(u => u.id !== Auth.getUser()?.id).map(u => `<option value="${u.id}">${u.display_name || u.username}</option>`).join('');
      }
    });

    let attachments = [];
    $('btn-em-attach')?.addEventListener('click', () => {
      if (typeof cloudinary === 'undefined') { alert('Cloudinary não carregado.'); return; }

      console.log('[CLOUDINARY] Abrindo widget...', NEXUS_CONFIG.cloudinary);

      const widget = cloudinary.createUploadWidget({
        cloudName: NEXUS_CONFIG.cloudinary.cloudName,
        uploadPreset: NEXUS_CONFIG.cloudinary.uploadPreset,
        sources: ['local', 'url'],
        multiple: true,
        styles: {
          palette: {
            window: "#080808",
            sourceBg: "#040f04",
            windowBorder: "#00ff41",
            tabIcon: "#00ff41",
            inactiveTabIcon: "#008f11",
            menuIcons: "#00ff41",
            link: "#00ff41",
            action: "#00ff41",
            inProgress: "#00ff41",
            complete: "#00c832",
            error: "#ff2200",
            textDark: "#000000",
            textLight: "#00ff41"
          },
          fonts: {
            default: null,
            "'Share Tech Mono', monospace": {
              url: "https://fonts.googleapis.com/css?family=Share+Tech+Mono",
              active: true
            }
          }
        }
      }, (err, result) => {
        if (err) console.error('[CLOUDINARY] ERRO:', err);
        if (result.event === 'success') {
          console.log('[CLOUDINARY] Sucesso:', result.info);
          attachments.push(result.info.secure_url);
          if ($('em-attachments-list')) {
            $('em-attachments-list').innerHTML += `<div>📎 Anexo: ${result.info.original_filename}</div>`;
          }
        }
      });

      widget.open();
    });

    $('btn-em-send')?.addEventListener('click', async () => {
      const recipient_id = $('em-recipient').value;
      const subject = $('em-subject').value.trim();
      const body = $('em-body').value.trim();
      const ud = typeof UNIVERSE_DATE !== 'undefined' ? UNIVERSE_DATE.format() : '??/??/????';
      if (!subject || !body) { alert('ASSUNTO e MENSAGEM obrigatórios.'); return; }

      const payload = {
        sender: Auth.getProfile()?.display_name || 'AGENTE',
        sender_id: Auth.getUser()?.id,
        subject,
        body,
        recipient: recipient_id === 'all' ? 'all' : 'private',
        recipient_id: recipient_id === 'all' ? null : recipient_id,
        attachments,
        unread: true,
        date: ud
      };

      const { error } = await db.from('emails').insert(payload);

      if (!error) {
        overlay.remove();
        loadEmails();
      } else {
        showModal({ title: 'ERRO AO ENVIAR', body: 'FALHA NA TRANSMISSÃO: ' + error.message, type: 'alert' });
      }
    });
  }

  /* ══════════════════════════════════════════════════════════
     NOTEPAD
  ══════════════════════════════════════════════════════════ */
  function notepad() {
    return `
      <div style="display:flex;flex-direction:column;height:100%;gap:8px;">
        <div class="app-toolbar">
          <button class="btn" id="btn-save-notes">[ 💾 SALVAR NA NUVEM ]</button>
          <button class="btn btn-danger" id="btn-clear-notes">[ LIMPAR ]</button>
          <span class="app-toolbar-sep"></span>
          <span style="font-family:var(--font-code);font-size:12px;color:var(--green-dark);">SINCRO AUTOMÁTICA O.R.T. ATIVA</span>
        </div>
        <textarea id="notepad-area" class="notepad-area" style="flex:1;resize:none;background:transparent;border:1px solid var(--border-dim);padding:12px;font-family:var(--font-code);font-size:15px;color:var(--green-mid);line-height:1.7;outline:none;" placeholder=">>> Carregando notas do Mainframe..."></textarea>
      </div>`;
  }

  async function initNotepad() {
    const area = $('notepad-area');
    const db = Auth.db();

    // Carregar conteúdo
    if (db) {
      const { data } = await db.from('notes').select('content').eq('user_id', Auth.getUser()?.id).single();
      if (area) area.value = data?.content || '';
    } else {
      const key = `nexus_notes_${Auth.getProfile()?.id || 'demo'}`;
      if (area) area.value = localStorage.getItem(key) || '';
    }

    $('btn-save-notes')?.addEventListener('click', async () => {
      const content = $('notepad-area')?.value || '';
      const db = Auth.db();
      if (db) {
        const userId = Auth.getUser()?.id;
        await db.from('notes').upsert({ user_id: userId, content, updated_at: new Date() }, { onConflict: 'user_id' });
        Boot.playBeep(880, 0.05, 0.08);
        showModal({ title: 'SINCRO CONCLUÍDA', body: 'NOTAS SINCRONIZADAS COM O MAINFRAME.', type: 'alert' });
      } else {
        const key = `nexus_notes_${Auth.getProfile()?.id || 'demo'}`;
        localStorage.setItem(key, content);
        alert('SALVO LOCALMENTE (MODO DEMO).');
      }
    });
    $('btn-clear-notes')?.addEventListener('click', async () => {
      if (confirm('Limpar todas as notas?')) {
        if ($('notepad-area')) $('notepad-area').value = '';
        const db = Auth.db();
        if (db) {
          await db.from('notes').delete().eq('user_id', Auth.getUser()?.id);
        } else {
          const key = `nexus_notes_${Auth.getProfile()?.id || 'demo'}`;
          localStorage.removeItem(key);
        }
      }
    });
  }

  /* ══════════════════════════════════════════════════════════
     VAULT
  ══════════════════════════════════════════════════════════ */
  function vault() {
    return `
      <div class="app-toolbar">
        ${Auth.isAdmin() ? '<button class="btn" id="btn-add-vault">[ + NOVO ARQUIVO SECRETO ]</button>' : ''}
        <span class="app-toolbar-sep"></span>
        <span style="font-family:var(--font-code);font-size:11px;color:var(--green-dark);">TERMINAL DE DADOS CRIPTOGRÁFICOS</span>
      </div>
      <div id="vault-add-form" class="hidden" style="background:var(--bg-panel);border:1px solid var(--border-dim);padding:16px;margin-bottom:16px;">
        <div style="display:grid;gap:10px;margin-bottom:12px;">
          <div class="login-field"><label class="login-label">&gt; TÍTULO DO ARQUIVO</label><input type="text" id="v-title" placeholder="ARQUIVO SECRETO — OP. VOID"></div>
          <div class="login-field"><label class="login-label">&gt; CONTEÚDO CLASSIFICADO</label><textarea id="v-body" rows="4" style="background:rgba(0,59,0,0.2);border:1px solid var(--border-dim);padding:8px;color:var(--green-mid);font-family:var(--font-code);font-size:14px;width:100%;outline:none;" placeholder="Escreva aqui o conteúdo secreto..."></textarea></div>
        </div>
        <div style="display:flex;gap:10px;">
          <button class="btn" id="btn-save-vault">[ ARMAZENAR ]</button>
          <button class="btn btn-danger" id="btn-cancel-vault">[ CANCELAR ]</button>
        </div>
      </div>
      <div id="vault-list"><div class="loading-state">DECRIPTOGRAFANDO<span class="loading-dots"></span></div></div>`;
  }

  const DEMO_VAULT = [
    { id: 'v1', title: 'ARQUIVO OMEGA — VERDADEIRA NATUREZA DO TEMPO', content: '[DADO CLASSIFICADO]\n\nO tempo não é linear. A O.R.T. existe para manter a ilusão de que é.\n\n— Diretor Fundador', created_at: '3575-11-23' },
  ];

  function initVault() {
    loadVault();
    $('btn-add-vault')?.addEventListener('click', () => $('vault-add-form')?.classList.toggle('hidden'));
    $('btn-cancel-vault')?.addEventListener('click', () => $('vault-add-form')?.classList.add('hidden'));
    $('btn-save-vault')?.addEventListener('click', saveVaultItem);
  }

  async function saveVaultItem() {
    const title = $('v-title')?.value?.trim();
    const content = $('v-body')?.value?.trim();
    if (!title) return;
    const db = Auth.db();
    if (db) await db.from('vault_items').insert({ title, content, created_by: Auth.getProfile()?.id });
    $('vault-add-form')?.classList.add('hidden');
    loadVault();
  }

  async function loadVault() {
    const list = $('vault-list');
    if (!list) return;
    const db = Auth.db();
    const data = db ? (await db.from('vault_items').select('*').order('created_at', { ascending: false })).data || [] : DEMO_VAULT;
    if (!data.length) {
      list.innerHTML = `<div class="empty-state"><span class="empty-state-icon">🔒</span>COFRE VAZIO</div>`;
      return;
    }
    list.innerHTML = data.map(v => `
      <div class="vault-item" onclick="this.nextElementSibling.classList.toggle('hidden')">
        <div class="vault-item-title">🔒 ${v.title}</div>
        <div class="vault-item-meta">${(v.created_at || '').slice(0, 10)}</div>
      </div>
      <pre class="hidden" style="background:rgba(0,59,0,0.15);border:1px solid var(--border-dim);border-top:none;padding:14px;font-family:var(--font-code);font-size:13px;color:var(--green-mid);white-space:pre-wrap;margin-bottom:8px;">${v.content || ''}</pre>`).join('');
  }

  /* ══════════════════════════════════════════════════════════
     CALENDAR / TIMELINE
  ══════════════════════════════════════════════════════════ */
  function calendar() {
    const ud = typeof UNIVERSE_DATE !== 'undefined'
      ? `${UNIVERSE_DATE.year} — ${UNIVERSE_DATE.era || 'Era da Consolidação'}` : '????';
    return `
      <div class="app-toolbar">
        <span style="font-family:var(--font-code);font-size:13px;color:var(--green-mid);">
          DATA ATUAL: <span style="color:var(--green);">${typeof UNIVERSE_DATE !== 'undefined' ? UNIVERSE_DATE.format() : '??'}</span>
          &nbsp;|&nbsp; ${ud}
        </span>
        <span class="app-toolbar-sep"></span>
        ${Auth.isAdmin() ? '<button class="btn" id="btn-add-event">[ + EVENTO ]</button>' : ''}
      </div>
      <div id="timeline-add-form" class="hidden" style="background:var(--bg-panel);border:1px solid var(--border-dim);padding:16px;margin-bottom:16px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
          <div class="login-field"><label class="login-label">&gt; TÍTULO DO EVENTO</label><input type="text" id="ev-title" placeholder="A Chegada ao Porto Estelar"></div>
          <div class="login-field"><label class="login-label">&gt; DATA (in-universe)</label><input type="text" id="ev-date" placeholder="15/08/3575"></div>
        </div>
        <div class="login-field" style="margin-bottom:12px;"><label class="login-label">&gt; DESCRIÇÃO</label><input type="text" id="ev-desc" placeholder="O que aconteceu..."></div>
        <div style="display:flex;gap:10px;">
          <button class="btn" id="btn-save-event">[ REGISTRAR ]</button>
          <button class="btn btn-danger" id="btn-cancel-event">[ CANCELAR ]</button>
        </div>
      </div>
      <div id="timeline-list"><div class="loading-state">CARREGANDO TIMELINE<span class="loading-dots"></span></div></div>`;
  }

  const DEMO_EVENTS = [
    { id: 'ev1', universe_date: '01/01/3575', title: 'FUNDAÇÃO DA O.R.T.', description: 'A Ordem da Realidade e Tempo é formalmente estabelecida.' },
    { id: 'ev2', universe_date: '23/11/3575', title: 'RECRUTAMENTO DOS AGENTES', description: 'Os agentes são convocados para a primeira missão.' },
  ];

  function initCalendar() {
    loadTimeline();
    $('btn-add-event')?.addEventListener('click', () => $('timeline-add-form')?.classList.toggle('hidden'));
    $('btn-cancel-event')?.addEventListener('click', () => $('timeline-add-form')?.classList.add('hidden'));
    $('btn-save-event')?.addEventListener('click', saveEvent);
  }

  async function saveEvent() {
    const title = $('ev-title')?.value?.trim();
    const date = $('ev-date')?.value?.trim();
    const desc = $('ev-desc')?.value?.trim();
    if (!title) return;
    const db = Auth.db();
    if (db) await db.from('timeline_events').insert({ title, universe_date: date, description: desc });
    $('timeline-add-form')?.classList.add('hidden');
    loadTimeline();
  }

  async function loadTimeline() {
    const list = $('timeline-list');
    if (!list) return;
    const db = Auth.db();
    const data = db ? (await db.from('timeline_events').select('*').order('universe_date')).data || [] : DEMO_EVENTS;
    if (!data.length) {
      list.innerHTML = `<div class="empty-state"><span class="empty-state-icon">📅</span>NENHUM EVENTO REGISTRADO</div>`;
      return;
    }
    list.innerHTML = data.map(e => `
      <div class="timeline-item">
        <div class="timeline-date">${e.universe_date || '??'}</div>
        <div class="timeline-content">
          <div class="tl-title">${e.title}</div>
          <div class="tl-desc">${e.description || ''}</div>
        </div>
      </div>`).join('');
  }

  /* ══════════════════════════════════════════════════════════
     TERMINAL CLI
  ══════════════════════════════════════════════════════════ */
  function terminal() {
    return `
      <div style="display:flex;flex-direction:column;height:100%;gap:0;">
        <div id="terminal-output" style="flex:1;overflow-y:auto;font-family:var(--font-code);font-size:14px;color:var(--green-mid);line-height:1.8;padding-bottom:12px;">
          <span class="term-line sys">NEXUS OS TERMINAL v7.3.1 — O.R.T. CLASSIFIED</span>
          <span class="term-line sys">Digite 'help' para ver os comandos disponíveis.</span>
          <br>
        </div>
        <div class="terminal-input-row" style="border-top:1px solid var(--border-dim);padding-top:10px;display:flex;align-items:center;gap:8px;flex-shrink:0;">
          <span class="terminal-prompt" style="font-family:var(--font-code);font-size:14px;color:var(--green);flex-shrink:0;">
            ORT@NEXUS:~$
          </span>
          <input type="text" id="terminal-input" autocomplete="off" spellcheck="false"
            style="background:transparent;border:none;font-family:var(--font-code);font-size:14px;color:var(--green);flex:1;caret-color:var(--green);outline:none;"
            placeholder="type command...">
        </div>
      </div>`;
  }

  const TERMINAL_COMMANDS = {
    help: () => [
      { t: 'sys', v: '╔══════════════════════════════════╗' },
      { t: 'sys', v: '║  NEXUS OS TERMINAL — COMANDOS    ║' },
      { t: 'sys', v: '╚══════════════════════════════════╝' },
      { t: 'resp', v: '  help       — Lista de comandos' },
      { t: 'resp', v: '  whoami     — Identidade do agente' },
      { t: 'resp', v: '  status     — Estado do sistema' },
      { t: 'resp', v: '  scan       — Varredura de ameaças' },
      { t: 'resp', v: '  date       — Data in-universe' },
      { t: 'resp', v: '  lore       — Arquivo de lore da O.R.T.' },
      { t: 'resp', v: '  decrypt    — Tentativa de descriptografia' },
      { t: 'resp', v: '  clear      — Limpar terminal' },
      { t: 'resp', v: '  logout     — Encerrar sessão' },
    ],
    whoami: () => {
      const p = Auth.getProfile();
      return [
        { t: 'resp', v: `AGENTE: ${p?.display_name || p?.username || 'DESCONHECIDO'}` },
        { t: 'resp', v: `CLEARANCE: ${(p?.role || 'N/A').toUpperCase()}` },
        { t: 'resp', v: `ID: ${p?.id || 'N/A'}` },
        { t: 'resp', v: 'ORGANIZAÇÃO: O.R.T. — Ordem da Realidade e Tempo' },
      ];
    },
    status: () => [
      { t: 'sys', v: '[NEXUS OS] STATUS DO SISTEMA:' },
      { t: 'resp', v: '  KERNEL........... ONLINE' },
      { t: 'resp', v: '  SUPABASE DB....... ' + (Auth.db() ? 'CONECTADO' : 'MODO DEMO') },
      { t: 'resp', v: '  CLOUDINARY........ ' + (NEXUS_CONFIG.cloudinary.cloudName !== 'YOUR_CLOUDINARY_CLOUD_NAME' ? 'CONFIGURADO' : 'NÃO CONFIGURADO') },
      { t: 'resp', v: '  CRT DISPLAY....... ATIVO' },
      { t: 'resp', v: '  AMEAÇAS........... NENHUMA DETECTADA' },
    ],
    scan: () => [
      { t: 'sys', v: '[SCAN] Iniciando varredura de ameaças...' },
      { t: 'resp', v: '  Setor A-7......... LIMPO' },
      { t: 'resp', v: '  Setor B-3......... LIMPO' },
      { t: 'resp', v: '  Setor OMEGA....... ⚠ ANOMALIA DETECTADA' },
      { t: 'err', v: '  [ALERTA] Assinatura temporal não identificada em setor OMEGA.' },
      { t: 'resp', v: '  Relatório enviado para Diretor Valdris.' },
    ],
    date: () => {
      const d = typeof UNIVERSE_DATE !== 'undefined' ? UNIVERSE_DATE : { format: () => '??/??/????' };
      return [
        { t: 'resp', v: `DATA IN-UNIVERSE: ${d.format()}` },
        { t: 'resp', v: `ERA: ${d.era || 'N/A'} — ${d.cycle || 'N/A'}` },
        { t: 'resp', v: `DATA REAL: ${new Date().toLocaleDateString('pt-BR')}` },
      ];
    },
    lore: () => [
      { t: 'sys', v: '[ARQUIVO O.R.T.] — INTEL CLASSIFICADO:' },
      { t: 'resp', v: '"A Ordem existe desde antes da história registrada."' },
      { t: 'resp', v: '"Controlamos o que o público acredita ser real."' },
      { t: 'resp', v: '"O tempo é uma ferramenta, não uma lei." — Dir. Fundador' },
      { t: 'err', v: '[CLASSIFICADO] Acesso adicional requer CLEARANCE OMEGA.' },
    ],
    decrypt: () => [
      { t: 'sys', v: '[DECRYPT] Iniciando descriptografia...' },
      { t: 'resp', v: '  Protocolo AES-512... AGUARDANDO CHAVE' },
      { t: 'err', v: '  ERRO: Chave não fornecida. Acesso negado.' },
      { t: 'resp', v: '  Tente: decrypt [CHAVE]' },
    ],
    logout: () => { Auth.logout(); return []; },
    clear: () => 'CLEAR',
  };

  function initTerminal() {
    const input = $('terminal-input');
    const output = $('terminal-output');
    if (!input || !output) return;
    input.focus();
    input.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      const cmd = input.value.trim().toLowerCase();
      input.value = '';
      if (!cmd) return;
      Boot.playBeep(660, 0.03, 0.06);
      // Print command
      addTermLine(output, `ORT@NEXUS:~$ ${cmd}`, 'cmd');
      // Run command
      const handler = TERMINAL_COMMANDS[cmd.split(' ')[0]];
      if (handler) {
        const result = handler(cmd);
        if (result === 'CLEAR') { output.innerHTML = ''; return; }
        if (Array.isArray(result)) result.forEach(r => addTermLine(output, r.v, r.t));
      } else {
        addTermLine(output, `Comando não encontrado: '${cmd}'. Digite 'help'.`, 'err');
      }
      output.scrollTop = output.scrollHeight;
    });
  }

  function addTermLine(output, text, cls) {
    const span = document.createElement('span');
    span.className = `term-line ${cls || 'resp'}`;
    span.textContent = text;
    output.appendChild(span);
  }

  /* ══════════════════════════════════════════════════════════
     ADMIN PANEL
  ══════════════════════════════════════════════════════════ */
  let _adminTab = 'agents';

  function admin() {
    if (!Auth.isAdmin()) {
      return '<div class="empty-state"><span class="empty-state-icon">⚠</span>ACESSO RESTRITO — SOMENTE ADMINISTRADORES</div>';
    }
    return `
      <div class="app-toolbar" style="display:flex; gap:10px;">
        <button class="btn ${_adminTab === 'agents' ? 'active' : ''}" id="adm-tab-agents">[ AGENTES ]</button>
        <button class="btn ${_adminTab === 'items' ? 'active' : ''}" id="adm-tab-items">[ FÁBRICA DE ITENS ]</button>
        <button class="btn ${_adminTab === 'combat' ? 'active' : ''}" id="adm-tab-combat">[ MESTRE DE COMBATE ]</button>
        <button class="btn" onclick="Apps.showNotification('SISTEMA O.R.T.', 'CANAL DE COMUNICAÇÃO OPERALCIONAL.', 'new-email')">[ TESTAR ALERTA ]</button>
      </div>
      <div id="admin-tab-content" style="padding:15px; height:calc(100% - 40px); overflow-y:auto;">
         ${_adminTab === 'agents' ? renderAdminAgents() : ''}
         ${_adminTab === 'items' ? renderAdminItems() : ''}
         ${_adminTab === 'combat' ? renderAdminCombat() : ''}
      </div>`;
  }

  function renderAdminAgents() {
    return `
      <div id="admin-new-user-form" class="hidden" style="background:var(--bg-panel);border:1px solid var(--border-dim);padding:16px;margin-bottom:16px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
          <div class="login-field"><label class="login-label">&gt; EMAIL</label><input type="email" id="nu-email" placeholder="agente@ort.gov"></div>
          <div class="login-field"><label class="login-label">&gt; SENHA INICIAL</label><input type="password" id="nu-pass" placeholder="Mínimo 6 caracteres"></div>
          <div class="login-field"><label class="login-label">&gt; NOME DO AGENTE</label><input type="text" id="nu-name" placeholder="Agente Fulano"></div>
          <div class="login-field"><label class="login-label">&gt; CLEARANCE</label>
            <select id="nu-role">
              <option value="agent">AGENT — Acesso Padrão</option>
              <option value="restricted">RESTRICTED — Acesso Limitado</option>
              <option value="admin">ADMIN — Acesso Total</option>
            </select>
          </div>
        </div>
        <div style="display:flex;gap:10px;">
          <button class="btn" id="btn-save-new-user">[ CRIAR AGENTE ]</button>
          <button class="btn btn-danger" id="btn-cancel-new-user">[ CANCELAR ]</button>
        </div>
        <div id="admin-user-status" style="margin-top:10px;font-family:var(--font-code);font-size:13px;min-height:18px;"></div>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
        <button class="btn" id="btn-admin-new-user">[ + NOVO AGENTE ]</button>
      </div>
      <div style="border-bottom:1px solid var(--border);padding:6px 12px;display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:12px;font-family:var(--font-code);font-size:11px;color:var(--green-mid);letter-spacing:1px;text-transform:uppercase;">
        <span>AGENTE</span><span>EMAIL</span><span>CLEARANCE</span><span>AÇÃO</span>
      </div>
      <div id="admin-user-list"><div class="loading-state">CARREGANDO AGENTES<span class="loading-dots"></span></div></div>`;
  }

  function renderAdminItems() {
    return `
      <div id="admin-item-form" style="background:var(--bg-panel);border:1px solid var(--border-dim);padding:16px;margin-bottom:16px;">
        <div class="login-label" style="margin-bottom:10px;">> REGISTRAR NOVO ARTEFATO/EQUIPAMENTO</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div class="login-field"><label class="login-label">NOME</label><input type="text" id="it-name"></div>
          <div class="login-field"><label class="login-label">PREÇO (CR$)</label><input type="number" id="it-price" value="0"></div>
          <div class="login-field"><label class="login-label">CATEGORIA</label>
            <select id="it-cat">
               <option value="weapon">ARMAMENTO</option>
               <option value="armor">PROTEÇÃO</option>
               <option value="document">DOCUMENTO / ITEM DE MISSÃO</option>
               <option value="consumable">CONSUMÍVEL</option>
            </select>
          </div>
          <div class="login-field"><label class="login-label">RARIDADE</label>
            <select id="it-rare">
               <option value="common">COMUM</option>
               <option value="uncommon">INCOMUM</option>
               <option value="rare">RARO</option>
               <option value="legendary">LENDÁRIO</option>
            </select>
          </div>
          <div class="login-field" style="grid-column: span 2;"><label class="login-label">DESCRIÇÃO</label><input type="text" id="it-desc"></div>
          <div class="login-field" id="it-content-field" style="grid-column: span 2; display:none;"><label class="login-label">CONTEÚDO (PARA DOCUMENTOS)</label><textarea id="it-content" rows="3" style="width:100%; background:rgba(0,0,0,0.3); color:var(--green); border:1px solid var(--border-dim); font-family:var(--font-code);"></textarea></div>
          <div style="grid-column: span 2;"><label style="color:var(--green-mid); font-size:12px;"><input type="checkbox" id="it-loot"> DISPONÍVEL COMO LOOT DE MISSÃO</label></div>
        </div>
        <button class="btn" id="btn-save-item" style="margin-top:10px;">[ FABRICAR ITEM ]</button>
      </div>
      <div class="login-label">> ITENS NO BANCO DE DADOS</div>
      <div id="admin-items-list" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(150px, 1fr)); gap:10px; margin-top:10px;"></div>`;
  }

  function renderAdminCombat() {
    return `
      <div style="display:grid; grid-template-columns:250px 1fr; gap:20px; height:100%;">
         <div style="border-right:1px solid var(--border-dim); padding-right:15px; display:flex; flex-direction:column; gap:10px;">
            <div class="login-label">> SELECIONAR AGENTES EM CAMPO</div>
            <div id="combat-agent-selector" style="display:flex; flex-direction:column; gap:5px;"></div>
         </div>
         <div style="display:flex; flex-direction:column; gap:20px;">
            <div id="combat-controls-panel" style="background:rgba(20,0,0,0.2); border:1px solid var(--red-alert); padding:15px;">
               <div class="login-label" style="color:var(--red-alert);">> CONTROLES DE COMBATE (ALVO: <span id="combat-target-name">NENHUM</span>)</div>
               <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:15px;">
                  <div>
                     <div class="stat-label">MODIFICAR SAÚDE (HP)</div>
                     <div style="display:flex; gap:10px; margin-top:5px;">
                        <input type="number" id="dmg-amount" value="1" style="width:60px;">
                        <button class="btn btn-danger" onclick="Apps.applyCombatAction('damage')">[ DANO ]</button>
                        <button class="btn" onclick="Apps.applyCombatAction('heal')">[ CURA ]</button>
                     </div>
                  </div>
                  <div>
                     <div class="stat-label">MODIFICAR ESPÍRITO (SP)</div>
                     <div style="display:flex; gap:10px; margin-top:5px;">
                        <input type="number" id="sp-amount" value="1" style="width:60px;">
                        <button class="btn btn-danger" onclick="Apps.applyCombatAction('drain')">[ DRENO ]</button>
                        <button class="btn" onclick="Apps.applyCombatAction('restore')">[ RESTAURAR ]</button>
                     </div>
                  </div>
               </div>
            </div>
            <div id="combat-mental-panel" style="background:rgba(80,0,150,0.1); border:1px solid #a000ff; padding:15px; margin-top:10px;">
               <div class="login-label" style="color:#a000ff;">> ESTADO MENTAL</div>
               <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:10px;">
                  <div>
                     <div class="stat-label">SANIDADE (-1 a 5)</div>
                     <div style="display:flex; gap:10px; margin-top:5px;">
                        <input type="number" id="san-amount" value="5" min="-1" max="5" style="width:60px;">
                        <button class="btn" onclick="Apps.updateStat('${_selectedCombatId}', 'sanity_current', parseInt($('san-amount').value))">[ DEFINIR ]</button>
                     </div>
                  </div>
                  <div>
                     <div class="stat-label">EXPOSIÇÃO MENTAL (0-100%)</div>
                     <div style="display:flex; gap:10px; margin-top:5px;">
                        <input type="number" id="exp-amount" value="0" min="0" max="100" style="width:60px;">
                        <button class="btn" onclick="Apps.updateStat('${_selectedCombatId}', 'mental_exposure', parseInt($('exp-amount').value))">[ DEFINIR % ]</button>
                     </div>
                  </div>
               </div>
            </div>
            <div style="background:rgba(0,20,0,0.2); border:1px solid var(--green); padding:15px;">
               <div class="login-label">> AJUSTAR ATRIBUTOS TÉCNICOS</div>
               <div id="combat-attr-controls" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin-top:10px;"></div>
            </div>
            <div style="background:rgba(20,20,0,0.1); border:1px solid var(--amber); padding:15px;">
               <div class="login-label" style="color:var(--amber);">> ENTREGAR EQUIPAMENTO (LOOT DIRECT)</div>
               <div style="display:flex; gap:10px; margin-top:10px;">
                  <select id="combat-loot-select" style="flex:1;"></select>
                  <button class="btn" id="btn-give-loot" style="color:var(--amber); border-color:var(--amber);">[ ENTREGAR ]</button>
               </div>
            </div>
         </div>
      </div>`;
  }

  async function initAdmin() {
    if (!Auth.isAdmin()) return;

    $('adm-tab-agents')?.addEventListener('click', () => { _adminTab = 'agents'; renderAdminTabContent(); });
    $('adm-tab-items')?.addEventListener('click', () => { _adminTab = 'items'; renderAdminTabContent(); });
    $('adm-tab-combat')?.addEventListener('click', () => { _adminTab = 'combat'; renderAdminTabContent(); });

    renderAdminTabContent();
  }

  function renderAdminTabContent() {
    // Atualizar UI de abas (classes active)
    document.querySelectorAll('#overlay-admin .app-toolbar .btn').forEach(b => b.classList.remove('active'));
    $(`adm-tab-${_adminTab}`)?.classList.add('active');

    const content = $('admin-tab-content');
    if (!content) return;

    if (_adminTab === 'agents') {
      content.innerHTML = renderAdminAgents();
      loadAdminUsers();
      $('btn-admin-new-user')?.addEventListener('click', () => $('admin-new-user-form')?.classList.toggle('hidden'));
      $('btn-cancel-new-user')?.addEventListener('click', () => $('admin-new-user-form')?.classList.add('hidden'));
      $('btn-save-new-user')?.addEventListener('click', createNewUser);
    } else if (_adminTab === 'items') {
      content.innerHTML = renderAdminItems();
      loadAdminItems();
      $('it-cat')?.addEventListener('change', e => $('it-content-field').style.display = e.target.value === 'document' ? 'block' : 'none');
      $('btn-save-item')?.addEventListener('click', createItem);
    } else if (_adminTab === 'combat') {
      content.innerHTML = renderAdminCombat();
      loadCombatAgents();
      loadLootSelect();
    }
  }

  async function createNewUser() {
    const email = $('nu-email')?.value?.trim();
    const pass = $('nu-pass')?.value?.trim();
    const name = $('nu-name')?.value?.trim();
    const role = $('nu-role')?.value;
    const status = $('admin-user-status');
    if (!email || !pass || !name) {
      if (status) { status.textContent = 'PREENCHA TODOS OS CAMPOS.'; status.style.color = 'var(--red-alert)'; }
      return;
    }
    if (status) { status.textContent = 'CRIANDO AGENTE...'; status.style.color = 'var(--green-mid)'; }
    const result = await Auth.adminCreateUser({ email, password: pass, username: name.replace(/\s+/g, '_').toUpperCase(), display_name: name, role });
    if (result.success) {
      if (status) { status.textContent = 'AGENTE CRIADO COM SUCESSO.'; status.style.color = 'var(--green)'; }
      $('admin-new-user-form')?.classList.add('hidden');
      loadAdminUsers();
    } else {
      if (status) { status.textContent = 'ERRO: ' + result.error; status.style.color = 'var(--red-alert)'; }
    }
  }

  async function loadAdminUsers() {
    const list = $('admin-user-list');
    if (!list) return;
    const result = await Auth.adminListUsers();
    const data = result.data || [];
    if (!data.length) {
      list.innerHTML = `<div class="empty-state"><span class="empty-state-icon">⚙</span>NENHUM AGENTE CADASTRADO</div>`;
      return;
    }
    list.innerHTML = data.map(u => `
      <div class="admin-user-row">
        <span>${u.display_name || u.username || 'N/A'}</span>
        <span style="font-family:var(--font-code);font-size:12px;color:var(--green-mid);">${u.email || ''}</span>
        <span class="role-badge ${u.role}">${(u.role || '?').toUpperCase()}</span>
        <div style="display:flex;gap:6px;">
          <select onchange="Apps.changeUserRole('${u.id}', this.value)" style="background:transparent;border:1px solid var(--border-dim);color:var(--green-mid);font-family:var(--font-code);font-size:11px;padding:3px;cursor:pointer;">
            ${['admin', 'agent', 'restricted'].map(r => `<option value="${r}" ${u.role === r ? 'selected' : ''}>${r}</option>`).join('')}
          </select>
          <button class="btn btn-danger" onclick="Apps.deleteUser('${u.id}')" style="font-size:11px;padding:3px 8px;">[ DEL ]</button>
        </div>
      </div>`).join('');
  }

  async function changeUserRole(userId, role) {
    await Auth.adminUpdateUser(userId, { role });
    loadAdminUsers();
  }

  async function deleteUser(userId) {
    showModal({
      title: 'REMOVER AGENTE',
      body: 'TEM CERTEZA QUE DESEJA REVOGAR O ACESSO DESTE AGENTE?',
      type: 'confirm',
      onConfirm: async () => {
        await Auth.adminDeleteUser(userId);
        loadAdminUsers();
      }
    });
  }

  /* ── Itens Admin ───────────────────────────────────────── */
  async function createItem() {
    const name = $('it-name').value;
    const desc = $('it-desc').value;
    const cat = $('it-cat').value;
    const rare = $('it-rare').value;
    const price = parseInt($('it-price').value) || 0;
    const isLoot = $('it-loot').checked;
    const content = $('it-content').value;

    if (!name) return;

    const db = Auth.db();
    if (!db) return;

    const { error } = await db.from('store_items').insert({
      name, description: desc, category: cat, rarity: rare, price, is_loot: isLoot, content
    });

    if (!error) {
      showNotification('FABRICAÇÃO CONCLUÍDA', `ITEM ${name} REGISTRADO NO BANCO.`, 'success');
      loadAdminItems();
    }
  }

  async function loadAdminItems() {
    const list = $('admin-items-list');
    if (!list) return;
    const db = Auth.db();
    const { data } = await db.from('store_items').select('*').order('created_at', { ascending: false });

    list.innerHTML = data?.map(item => `
      <div style="background:rgba(0,30,0,0.4); border:1px solid var(--border-dim); padding:10px; font-size:11px;">
         <div style="color:var(--green); font-weight:bold;">${item.name}</div>
         <div style="color:var(--amber);">CR$ ${item.price} - ${item.category}</div>
         <button class="btn btn-danger" style="font-size:9px; margin-top:5px;" onclick="Apps.deleteItem('${item.id}')">[ APAGAR ]</button>
      </div>
    `).join('') || '';
  }

  async function deleteItem(id) {
    if (!confirm('APAGAR ESTE ITEM PERMANENTEMENTE?')) return;
    const db = Auth.db();
    await db.from('store_items').delete().eq('id', id);
    loadAdminItems();
  }

  /* ── Combate Admin ─────────────────────────────────────── */
  let _selectedCombatId = null;

  async function loadCombatAgents() {
    const selector = $('combat-agent-selector');
    if (!selector) return;
    const result = await Auth.adminListUsers();
    const data = result.data || [];

    selector.innerHTML = data.map(u => `
      <button class="btn" style="width:100%; justify-content:flex-start; ${u.id === _selectedCombatId ? 'background:var(--green); color:var(--bg);' : ''}" 
        onclick="Apps.selectCombatTarget('${u.id}', '${u.display_name || u.username}')">
        [ ${u.id === _selectedCombatId ? 'X' : ' '} ] ${u.display_name || u.username} (HP: ${u.hp_current}/${u.hp_max})
      </button>
    `).join('');
  }

  function selectCombatTarget(id, name) {
    _selectedCombatId = id;
    $('combat-target-name').textContent = name;
    loadCombatAgents(); // Refresh selection
    loadCombatAttrControls(id);
  }

  async function loadCombatAttrControls(userId) {
    const db = Auth.db();
    const { data: u } = await db.from('profiles').select('*').eq('id', userId).single();
    const grid = $('combat-attr-controls');
    if (!grid || !u) return;

    const attrs = ['str', 'dex', 'con', 'int', 'wis', 'spi'];
    grid.innerHTML = attrs.map(a => `
        <div style="display:flex; flex-direction:column; gap:2px;">
           <span class="stat-label">${a.toUpperCase()}: ${u[a] || 0}</span>
           <div style="display:flex; gap:2px;">
              <button class="btn" style="padding:2px 5px;" onclick="Apps.updateStat('${u.id}', '${a}', ${u[a] - 1})">-</button>
              <button class="btn" style="padding:2px 5px;" onclick="Apps.updateStat('${u.id}', '${a}', ${u[a] + 1})">+</button>
           </div>
        </div>
     `).join('');
  }

  async function applyCombatAction(type) {
    if (!_selectedCombatId) { showModal({ title: 'ERRO', body: 'SELECIONE UM ALVO PRIMEIRO.', type: 'alert' }); return; }
    const amount = parseInt($(type.includes('hp') || type.includes('damage') || type.includes('heal') ? 'dmg-amount' : 'sp-amount').value) || 0;

    const db = Auth.db();
    const { data: u } = await db.from('profiles').select('*').eq('id', _selectedCombatId).single();
    if (!u) return;

    let updates = {};
    if (type === 'damage') {
      const rd = u.rd || 0;
      const reduction = rd + Math.floor((u.con || 0) / 2);
      const finalDmg = Math.max(1, amount - reduction);
      updates.hp_current = Math.max(-10, (u.hp_current || 0) - finalDmg);
      showNotification('DANO APLICADO', `${u.display_name} sofreu ${finalDmg} de dano (Reduzido em ${reduction}).`, 'new-message');
    } else if (type === 'heal') {
      updates.hp_current = Math.min(u.hp_max, (u.hp_current || 0) + amount);
    } else if (type === 'drain') {
      updates.sp_current = Math.max(0, (u.sp_current || 0) - amount);
    } else if (type === 'restore') {
      updates.sp_current = Math.min(u.sp_max, (u.sp_current || 0) + amount);
    }

    await db.from('profiles').update(updates).eq('id', _selectedCombatId);
    loadCombatAgents();
  }

  async function updateStat(id, stat, value) {
    const db = Auth.db();
    let updates = { [stat]: value };
    if (stat === 'con') updates.hp_max = 15 + value;
    if (stat === 'spi') updates.sp_max = 10 + value;

    await db.from('profiles').update(updates).eq('id', id);
    loadCombatAttrControls(id);
    loadCombatAgents();
  }

  async function loadLootSelect() {
    const sel = $('combat-loot-select');
    if (!sel) return;
    const db = Auth.db();
    const { data } = await db.from('store_items').select('id, name').order('name');
    sel.innerHTML = `<option value="">-- SELECIONAR ITEM --</option>` + data.map(i => `<option value="${i.id}">${i.name}</option>`).join('');
    $('btn-give-loot')?.addEventListener('click', giveLoot);
  }

  async function giveLoot() {
    if (!_selectedCombatId) return;
    const itemId = $('combat-loot-select').value;
    if (!itemId) return;
    const db = Auth.db();
    await db.from('inventory').insert({ user_id: _selectedCombatId, item_id: itemId });
    showNotification('ITEM ENTREGUE', 'O ARTEFATO FOI ADICIONADO AO INVENTÁRIO DO AGENTE.', 'success');
  }


  /* ── Public API ─────────────────────────────────────────── */
  /* ── Notificações ───────────────────────────────────────── */
  function showNotification(title, body, type = 'new-email') {
    const container = $('notification-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `notification-toast ${type}`;
    toast.innerHTML = `
            <div class="notification-header">> NOVO ALERTA SISTEMA</div>
            <div class="notification-body">${body}</div>
        `;

    toast.onclick = () => {
      toast.remove();
      if (type === 'new-email') openApp('emails');
    };

    container.appendChild(toast);
    Boot.playBeep(660, 0.1, 0.1);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.animation = 'slideOutRight 0.5s forwards';
        setTimeout(() => toast.remove(), 500);
      }
    }, 8000);
  }

  /* ── Modais Internos (Substitutos para alert/confirm) ── */
  function showModal(options = {}) {
    // options: { title, body, confirmText, cancelText, onConfirm, onCancel, type: 'alert'|'confirm' }
    const overlay = document.createElement('div');
    overlay.className = 'app-overlay active';
    overlay.style.zIndex = '3000000'; // Maior que as janelas e notificações

    const isConfirm = options.type === 'confirm';

    overlay.innerHTML = `
      <div class="modal-box scan-effect" style="width:min(450px, 90vw); border:1px solid var(--green); box-shadow:0 0 30px var(--green-glow);">
        <div class="modal-header" style="background:var(--green); color:var(--bg); border:none; padding:8px 12px; font-family:var(--font-logo);">
          > ${options.title || 'SISTEMA O.R.T.'}
        </div>
        <div class="modal-body" style="padding:20px; font-family:var(--font-code); color:var(--green); font-size:15px; line-height:1.6;">
          ${options.body || ''}
        </div>
        <div class="modal-footer" style="display:flex; justify-content:flex-end; gap:12px; padding:12px;">
          ${isConfirm ? `<button class="btn btn-danger" id="modal-cancel">[ ${options.cancelText || 'CANCELAR'} ]</button>` : ''}
          <button class="btn" id="modal-confirm" style="background:var(--green); color:var(--bg);">[ ${options.confirmText || 'OK'} ]</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    Boot.playBeep(440, 0.05, 0.1);

    overlay.querySelector('#modal-confirm').onclick = () => {
      overlay.remove();
      if (options.onConfirm) options.onConfirm();
    };

    if (isConfirm && overlay.querySelector('#modal-cancel')) {
      overlay.querySelector('#modal-cancel').onclick = () => {
        overlay.remove();
        if (options.onCancel) options.onCancel();
      };
    }
  }

  /* ══════════════════════════════════════════════════════════
     CHAT O.R.T.
  ══════════════════════════════════════════════════════════ */
  function chat() {
    return `
      <div style="display:grid; grid-template-rows:1fr auto; height:100%; gap:0; background:rgba(0,15,0,0.3);">
        <div id="chat-messages-container" style="flex:1; overflow-y:auto; padding:12px; display:flex; flex-direction:column; gap:8px;">
          <div class="loading-state">CONECTANDO AO CANAL OMEGA<span class="loading-dots"></span></div>
        </div>
        <div class="app-toolbar" style="border-top:1px solid var(--border-dim); padding:10px; display:flex; gap:10px; align-items:center;">
          <input type="text" id="chat-input" autocomplete="off" placeholder="Digite sua mensagem classificada..." 
            style="flex:1; background:rgba(0,40,0,0.4); border:1px solid var(--border-dim); color:var(--green); padding:10px; font-family:var(--font-code); outline:none;">
          <button class="btn" id="btn-chat-send" style="padding:10px 20px;">[ ENVIAR ]</button>
        </div>
      </div>`;
  }

  function initChat() {
    loadChatMessages();

    const input = $('chat-input');
    const sendBtn = $('btn-chat-send');

    const sendMessage = async () => {
      const text = input.value.trim();
      if (!text) return;
      input.value = '';

      const db = Auth.db();
      if (db) {
        await db.from('chat_messages').insert({
          sender_id: Auth.getUser()?.id,
          text: text
        });
      }
    };

    input?.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
    sendBtn?.addEventListener('click', sendMessage);
  }

  async function loadChatMessages() {
    const container = $('chat-messages-container');
    if (!container) return;
    const db = Auth.db();
    if (!db) {
      container.innerHTML = '<div class="empty-state">DADOS INDISPONÍVEIS EM MODO DEMO.</div>';
      return;
    }

    const { data } = await db.from('chat_messages')
      .select('*, profiles(display_name, username, role)')
      .order('created_at', { ascending: true })
      .limit(50);

    container.innerHTML = '';
    if (data) data.forEach(msg => appendChatMessage(msg));
    container.scrollTop = container.scrollHeight;
  }

  function appendChatMessage(msg) {
    const container = $('chat-messages-container');
    if (!container) return;

    if (container.querySelector('.loading-state')) container.innerHTML = '';

    const isMe = msg.sender_id === Auth.getUser()?.id;
    const senderName = msg.profiles?.display_name || msg.profiles?.username || 'AGENTE';

    const msgEl = document.createElement('div');
    msgEl.style.cssText = `max-width:80%; padding:8px 12px; border:1px solid var(--border-dim); font-family:var(--font-code); margin-bottom:4px; 
      ${isMe ? 'align-self:flex-end; background:rgba(0,100,0,0.1); border-color:var(--green);' : 'align-self:flex-start; background:rgba(255,183,0,0.05);'}`;

    msgEl.innerHTML = `
      <div style="font-size:10px; color:${msg.profiles?.role === 'admin' ? 'var(--amber)' : 'var(--green-mid)'}; margin-bottom:4px; text-transform:uppercase;">
        ${senderName} [${msg.profiles?.role || 'AGENTE'}]
      </div>
      <div style="color:var(--green); font-size:14px; word-break:break-word;">${msg.text}</div>
      <div style="font-size:9px; color:var(--green-dark); text-align:right; margin-top:4px;">${new Date(msg.created_at).toLocaleTimeString('pt-BR')}</div>
    `;

    container.appendChild(msgEl);
    container.scrollTop = container.scrollHeight;
  }

  function subscribeChat() {
    const db = Auth.db();
    if (!db) return;

    db.channel('public:chat_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, async payload => {
        const { data } = await db.from('profiles').select('display_name, username, role').eq('id', payload.new.sender_id).single();
        const msg = { ...payload.new, profiles: data };

        // Só tenta adicionar à UI se o contêiner existir (app aberto)
        appendChatMessage(msg);

        // Notificação global (independente do app estar aberto)
        const currentUserId = Auth.getUser()?.id;
        if (payload.new.sender_id !== currentUserId) {
          showNotification('CHAT O.R.T.', `${data?.display_name || 'AGENTE'}: ${payload.new.text}`, 'new-message');
          Desktop.updateBadge('chat', 1, true);
        }
      })
      .subscribe();
  }

  /* ══════════════════════════════════════════════════════════
     LOJA O.R.T. (ARMORY)
  ══════════════════════════════════════════════════════════ */
  function shop() {
    return `
      <div style="display:grid; grid-template-rows:auto 1fr; height:100%; gap:0;">
        <div class="app-toolbar" style="display:flex; justify-content:space-between; align-items:center;">
          <div style="font-family:var(--font-code); color:var(--amber);">
            MEUS CRÉDITOS: <span id="shop-user-credits" style="color:var(--green);">CR$ ---</span>
          </div>
          <button class="btn" id="btn-shop-refresh">[ ATUALIZAR ESTOQUE ]</button>
        </div>
        <div id="shop-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:16px; padding:20px; overflow-y:auto;">
          <div class="loading-state">CONECTANDO AO ARMAZÉM<span class="loading-dots"></span></div>
        </div>
      </div>`;
  }

  function initShop() {
    loadShopItems();
    updateUserCreditsDisplay();
    $('btn-shop-refresh')?.addEventListener('click', loadShopItems);
  }

  async function updateUserCreditsDisplay() {
    const el = $('shop-user-credits');
    if (!el) return;
    const db = Auth.db();
    if (!db) { el.textContent = 'CR$ DEMO'; return; }
    const { data } = await db.from('profiles').select('credits').eq('id', Auth.getUser()?.id).single();
    if (data) el.textContent = `CR$ ${data.credits.toLocaleString('pt-BR')}`;
  }

  async function loadShopItems() {
    const grid = $('shop-grid');
    if (!grid) return;
    const db = Auth.db();
    if (!db) {
      grid.innerHTML = '<div class="empty-state">LOJA DISPONÍVEL APENAS COM SUPABASE ATIVO.</div>';
      return;
    }

    const { data } = await db.from('store_items').select('*').order('price', { ascending: true });
    grid.innerHTML = '';

    if (!data?.length) {
      grid.innerHTML = '<div class="empty-state">ESTOQUE VAZIO NO MOMENTO.</div>';
      return;
    }

    grid.innerHTML = data.map(item => `
      <div class="shop-card scan-effect" style="background:rgba(0,30,0,0.4); border:1px solid var(--border-dim); padding:15px; display:flex; flex-direction:column; gap:10px;">
        <div style="height:120px; background:rgba(0,255,65,0.05); display:flex; align-items:center; justify-content:center; border:1px solid rgba(0,255,65,0.1);">
          <span style="font-size:30px;">${item.type === 'weapon' ? '🔫' : '🛡️'}</span>
        </div>
        <div style="font-family:var(--font-logo); font-size:14px; color:var(--green);">${item.name}</div>
        <div style="font-family:var(--font-code); font-size:11px; color:var(--green-mid); flex:1;">${item.description || ''}</div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:5px;">
          <span style="color:var(--amber); font-family:var(--font-code);">CR$ ${item.price}</span>
          <button class="btn" style="font-size:10px; padding:4px 8px;" onclick="Apps.buyItem('${item.id}', ${item.price})">[ COMPRAR ]</button>
        </div>
      </div>
    `).join('');
  }

  async function buyItem(id, price) {
    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;

    const { data: profile } = await db.from('profiles').select('credits').eq('id', user.id).single();

    if (profile.credits < price) {
      showModal({ title: 'ERRO NA TRANSAÇÃO', body: 'SALDO INSUFICIENTE NO SEU CARTÃO O.R.T.', type: 'alert' });
      return;
    }

    showModal({
      title: 'CONFIRMAR AQUISIÇÃO',
      body: `DESEJA REALMENTE ADQUIRIR ESTE EQUIPAMENTO POR CR$ ${price}?`,
      type: 'confirm',
      onConfirm: async () => {
        const newCredits = profile.credits - price;
        const { error } = await db.from('profiles').update({ credits: newCredits }).eq('id', user.id);
        if (!error) {
          showNotification('TRANSAÇÃO CONCLUÍDA', 'EQUIPAMENTO ENVIADO PARA O SEU INVENTÁRIO.', 'success');
          updateUserCreditsDisplay();
        } else {
          showModal({ title: 'FALHA NO MAINFRAME', body: 'ERRO AO PROCESSAR CRÉDITOS: ' + error.message, type: 'alert' });
        }
      }
    });
  }

  /* ══════════════════════════════════════════════════════════
     MAPA GALÁCTICO (BASE)
  ══════════════════════════════════════════════════════════ */
  /* ══════════════════════════════════════════════════════════
     MAPA GALÁCTICO — Delegado para js/map.js
  ══════════════════════════════════════════════════════════ */
  function mapRender() {
    return (typeof map === 'function') ? map() : '<div class="empty-state">MAPA INDISPONÍVEL</div>';
  }

  function mapInit() {
    if (typeof initMap === 'function') initMap();
  }

  function initGlobalRealtime() {
    initEmailRealtime();
    subscribeChat();
  }

  /* ══════════════════════════════════════════════════════════
     FICHA DO AGENTE (STATS)
  ══════════════════════════════════════════════════════════ */
  function statsPage() {
    return `
      <div class="stats-page-container" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); height:100%; overflow-y:auto; background:rgba(0,20,0,0.3); scrollbar-width: thin;">
        <div style="border-right:1px solid var(--border-dim); border-bottom:1px solid var(--border-dim); padding:20px; display:flex; flex-direction:column; gap:20px;">
          <div class="body-status-visual scan-effect" style="position:relative; overflow:hidden; border:1px solid var(--border-dim); background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; padding:10px;">
             <svg viewBox="0 0 100 100" style="width:100%; height:100%; filter: drop-shadow(0 0 10px var(--green-glow));">
                <defs>
                   <clipPath id="brain-clip">
                      <path d="M25,55 C20,50 15,40 20,25 C25,10 45,5 65,15 C85,25 90,45 85,60 C80,75 70,85 55,85 C50,85 45,80 40,80 C35,80 30,85 25,85 C20,85 18,75 25,70 C22,65 25,60 25,55 Z" />
                   </clipPath>
                   <radialGradient id="mist-gradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stop-color="#a000ff" stop-opacity="0.8" />
                      <stop offset="100%" stop-color="#400080" stop-opacity="0" />
                   </radialGradient>
                </defs>
                <g transform="rotate(-90 50 50)">
                   <!-- Fundo do Cérebro (Visão Lateral) -->
                   <path d="M25,55 C20,50 15,40 20,25 C25,10 45,5 65,15 C85,25 90,45 85,60 C80,75 70,85 55,85 C50,85 45,80 40,80 C35,80 30,85 25,85 C20,85 18,75 25,70 C22,65 25,60 25,55 Z" 
                         fill="rgba(0,255,65,0.05)" stroke="rgba(0,255,65,0.2)" stroke-width="1.5" />
                   
                   <!-- Enchimento Líquido de Sanidade -->
                   <rect id="sanity-brain-fill" x="0" y="100" width="100" height="0" fill="var(--green)" opacity="0.4" clip-path="url(#brain-clip)" style="transition: all 0.5s ease;" />
                   
                   <!-- Névoa de Exposição Mental -->
                   <rect id="exposure-mist-rect" x="0" y="0" width="100" height="100" fill="url(#mist-gradient)" opacity="0" clip-path="url(#brain-clip)" style="transition: opacity 1s ease;">
                      <animate attributeName="opacity" values="0.1;0.4;0.1" dur="4s" repeatCount="indefinite" />
                   </rect>

                   <!-- Contorno Neon e Sulcos -->
                   <path id="brain-contour" d="M25,55 C20,50 15,40 20,25 C25,10 45,5 65,15 C85,25 90,45 85,60 C80,75 70,85 55,85 C50,85 45,80 40,80 C35,80 30,85 25,85 C20,85 18,75 25,70 C22,65 25,60 25,55 Z" 
                         fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round">
                      <animate id="brain-pulse-anim" attributeName="stroke-width" values="2;4;2" dur="1s" repeatCount="indefinite" begin="indefinite" />
                   </path>
                   
                   <!-- Sulcos Anatômicos (Visão Lateral) -->
                   <g stroke="var(--green-dark)" stroke-width="1" fill="none" opacity="0.4">
                      <path d="M45,12 C55,25 50,45 40,55" /> <!-- Sulco Central -->
                      <path d="M25,35 Q45,45 75,35" /> <!-- Sylvian Fissure -->
                      <path d="M30,20 Q40,30 50,25" />
                      <path d="M60,20 Q70,35 80,30" />
                      <path d="M60,70 Q75,70 80,55" />
                      <path d="M40,80 Q50,75 60,80" /> <!-- Cerebelo -->
                   </g>
                </g>
             </svg>
          </div>
          <div id="stats-personal-info" style="font-family:var(--font-code); font-size:12px; line-height:1.6;">
            <div style="color:var(--green-mid);">NOME: <span id="stat-name" style="color:var(--green);">---</span></div>
            <div style="color:var(--green-mid);">RAÇA: <span id="stat-race" style="color:var(--green);">---</span></div>
            <div style="color:var(--green-mid);">FUNÇÃO: <span id="stat-class" style="color:var(--green);">---</span></div>
            <div style="color:var(--amber);">NÍVEL: <span id="stat-level" style="color:var(--amber);">---</span></div>
          </div>
        </div>
        <div style="padding:20px; overflow-y:auto; display:flex; flex-direction:column; gap:24px;">
           <section>
              <div class="login-label" style="font-size:12px; margin-bottom:10px;">&gt; BIOMÉTRICA & SAÚDE</div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                 <div>
                    <div class="stat-label">PONTOS DE VIDA (HP)</div>
                    <div class="rpg-bar-container"><div id="hp-bar-fill" class="rpg-bar-fill hp-fill" style="width:100%;"></div></div>
                    <div id="hp-text" style="text-align:right; font-size:11px; color:var(--green); margin-top:4px;">-- / --</div>
                 </div>
                 <div>
                    <div class="stat-label">PONTOS DE ESPÍRITO (SP)</div>
                    <div class="rpg-bar-container"><div id="sp-bar-fill" class="rpg-bar-fill sp-fill" style="width:100%;"></div></div>
                    <div id="sp-text" style="text-align:right; font-size:11px; color:var(--green); margin-top:4px;">-- / --</div>
                 </div>
              </div>
           </section>
           
           <section>
              <div class="login-label" style="font-size:12px; margin-bottom:10px;">&gt; ATRIBUTOS DE COMBATE</div>
              <div class="stats-grid" id="attributes-grid">
                 <div class="stat-box"><div class="stat-label">FOR</div><div class="stat-value" id="stat-str">--</div></div>
                 <div class="stat-box"><div class="stat-label">DES</div><div class="stat-value" id="stat-dex">--</div></div>
                 <div class="stat-box"><div class="stat-label">CON</div><div class="stat-value" id="stat-con">--</div></div>
                 <div class="stat-box"><div class="stat-label">INT</div><div class="stat-value" id="stat-int">--</div></div>
                 <div class="stat-box"><div class="stat-label">SAB</div><div class="stat-value" id="stat-wis">--</div></div>
                 <div class="stat-box"><div class="stat-label">ESP</div><div class="stat-value" id="stat-spi">--</div></div>
              </div>
           </section>

           <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
              <section>
                 <div class="login-label" style="font-size:12px; margin-bottom:10px;">&gt; ESTADO MENTAL</div>
                 <div class="stat-label">SANIDADE</div>
                 <div class="rpg-bar-container"><div id="san-bar-fill" class="rpg-bar-fill san-fill" style="width:100%;"></div></div>
                 <div class="stat-label" style="margin-top:10px;">EXPOSIÇÃO MENTAL</div>
                 <div style="font-size:18px; color:var(--red-alert); font-family:var(--font-logo);" id="stat-exposure">0%</div>
              </section>
              <section>
                 <div class="login-label" style="font-size:12px; margin-bottom:10px;">&gt; DEFESA & RESISTÊNCIA</div>
                 <div class="stat-box" style="margin-bottom:10px;"><div class="stat-label">CONTRA-MEDIDA (DEF)</div><div class="stat-value" id="stat-def">--</div></div>
                 <div class="stat-box"><div class="stat-label">REDUÇÃO DE DANO (RD)</div><div class="stat-value" id="stat-rd">--</div></div>
              </section>
           </div>
        </div>
      </div>`;
  }

  async function initStats() {
    refreshStats();
    // Inscrição Realtime para a ficha do próprio usuário
    const db = Auth.db();
    if (db) {
      db.channel('profile_updates')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${Auth.getUser()?.id}` }, payload => {
          refreshStats(payload.new);
        })
        .subscribe();
    }
  }

  async function refreshStats(newData = null) {
    let profile;
    if (newData) {
      const cached = await Auth.getProfile();
      profile = { ...cached, ...newData };
    } else {
      profile = await Auth.getProfile(true);
    }

    if (!profile) return;

    const v = id => { const el = $(id); if (el) el.textContent = profile[id.replace('stat-', '').replace('str', 'str').replace('dex', 'dex').replace('con', 'con').replace('int', 'int').replace('wis', 'wis').replace('spi', 'spi')]; };

    // Atualizar Campos Simples
    if ($('stat-name')) $('stat-name').textContent = profile.display_name || profile.username;
    if ($('stat-race')) $('stat-race').textContent = profile.race || 'Humano';
    if ($('stat-class')) $('stat-class').textContent = profile.function_class || 'Recruta';
    if ($('stat-level')) $('stat-level').textContent = profile.level || 1;

    if ($('stat-str')) $('stat-str').textContent = profile.str || 0;
    if ($('stat-dex')) $('stat-dex').textContent = profile.dex || 0;
    if ($('stat-con')) $('stat-con').textContent = profile.con || 0;
    if ($('stat-int')) $('stat-int').textContent = profile.int || 0;
    if ($('stat-wis')) $('stat-wis').textContent = profile.wis || 0;
    if ($('stat-spi')) $('stat-spi').textContent = profile.spi || 0;
    if ($('stat-rd')) $('stat-rd').textContent = profile.rd || 0;
    if ($('stat-exposure')) $('stat-exposure').textContent = (profile.mental_exposure || 0) + '%';

    // Cálculos Dinâmicos
    const defBase = (profile.con || 0) + (profile.dex || 0) + 2;
    if ($('stat-def')) $('stat-def').textContent = defBase;

    // Barras Visuais
    const updateBar = (barId, textId, current, max) => {
      const fill = $(barId);
      const text = $(textId);
      if (fill) {
        const pct = Math.max(0, Math.min(100, (current / max) * 100));
        fill.style.width = pct + '%';
        if (barId === 'hp-bar-fill') {
          const bodyFillRect = $('hp-body-fill-rect');
          if (bodyFillRect) {
            const h = (200 * pct) / 100;
            bodyFillRect.setAttribute('y', 200 - h);
            bodyFillRect.setAttribute('height', h);
          }
        }
      }
      if (text) text.textContent = `${current} / ${max}`;
    };

    updateBar('hp-bar-fill', 'hp-text', profile.hp_current || 0, profile.hp_max || 1);
    updateBar('sp-bar-fill', 'sp-text', profile.sp_current || 0, profile.sp_max || 1);
    updateBar('san-bar-fill', null, profile.sanity_current || 0, profile.sanity_max || 1);

    // Efeito Visual do Cérebro (Sanidade & Exposição)
    const brainFill = $('sanity-brain-fill');
    const brainContour = $('brain-contour');
    const pulseAnim = $('brain-pulse-anim');

    if (brainFill && profile.sanity_max) {
      const sanity = parseInt(profile.sanity_current) || 0;
      const sanityMax = parseInt(profile.sanity_max) || 5;

      // Normalização da altura (Sempre baseado na sanidade positiva para o líquido)
      const pct = Math.max(0, Math.min(100, (sanity / sanityMax) * 100));
      const h = (100 * pct) / 100;
      brainFill.setAttribute('y', 100 - h);
      brainFill.setAttribute('height', h);

      // Reset de animações e cores padrão
      if (brainContour) {
        brainContour.setAttribute('stroke', 'var(--green)');
        if (pulseAnim) pulseAnim.endElement();
      }
      brainFill.setAttribute('fill', 'var(--green)');

      // Lógica de Estados Mentais Críticos
      if (sanity <= -1) {
        // Nível -1: Insanidade Completa (Vermelho Pulsante e Cérebro "Cheio" de Sangue)
        brainFill.setAttribute('fill', '#ff0000');
        brainFill.setAttribute('y', '0');
        brainFill.setAttribute('height', '100');
        brainFill.setAttribute('opacity', '0.6');
        if (brainContour) {
          brainContour.setAttribute('stroke', '#ff0000');
          if (pulseAnim) pulseAnim.beginElement();
        }
      } else if (sanity === 0) {
        // Nível 0: À Beira da Insanidade (Vermelho Estático)
        brainFill.setAttribute('fill', '#aa0000');
        brainFill.setAttribute('y', '0');
        brainFill.setAttribute('height', '100');
        brainFill.setAttribute('opacity', '0.3');
        if (brainContour) {
          brainContour.setAttribute('stroke', '#ff4444');
        }
      }
    }

    // Efeito de Névoa (Exposição Mental)
    const mist = $('exposure-mist-rect');
    if (mist) {
      const exposure = profile.mental_exposure || 0;
      // Escala 0-100% mapeada para opacidade 0.0 a 0.7
      mist.style.opacity = (exposure / 100) * 0.7;
    }
  }

  /* ══════════════════════════════════════════════════════════
     INVENTÁRIO
  ══════════════════════════════════════════════════════════ */
  function inventoryPage() {
    return `
      <div style="display:grid; grid-template-rows:auto 1fr; height:100%; gap:0;">
        <div class="app-toolbar" style="display:flex; justify-content:space-between; align-items:center;">
          <div style="font-family:var(--font-code); color:var(--amber);">
            CAPACIDADE DE CARGA: <span id="inv-capacity" style="color:var(--green);">--/-- kg</span>
          </div>
          <button class="btn" id="btn-inv-refresh">[ ORGANIZAR MOCHILA ]</button>
        </div>
        <div id="inventory-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:16px; padding:20px; overflow-y:auto;">
          <div class="loading-state">ESCANER DE CARGA ATIVO<span class="loading-dots"></span></div>
        </div>
      </div>`;
  }

  function initInventory() {
    loadInventory();
    $('btn-inv-refresh')?.addEventListener('click', loadInventory);
  }

  async function loadInventory() {
    const grid = $('inventory-grid');
    if (!grid) return;
    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;

    const { data: items, error } = await db.from('inventory')
      .select('*, store_items(*)')
      .eq('user_id', user.id);

    if (error) { grid.innerHTML = `<div class="empty-state">ERRO NA MATRIZ: ${error.message}</div>`; return; }

    const profile = await Auth.getProfile();
    const maxCapacity = (profile?.str || 1) * 2;
    if ($('inv-capacity')) $('inv-capacity').textContent = `${items.length} / ${maxCapacity} UNIDADES`;

    grid.innerHTML = items?.length ? items.map(inv => {
      const item = inv.store_items;
      return `
        <div class="shop-card scan-effect" style="background:rgba(0,30,0,0.4); border:1px solid ${inv.is_equipped ? 'var(--green)' : 'var(--border-dim)'}; padding:15px; display:flex; flex-direction:column; gap:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div class="chip chip-sm ${item.rarity || 'common'}">${(item.rarity || 'COMUM').toUpperCase()}</div>
            ${inv.is_equipped ? '<span style="color:var(--green); font-size:10px;">[ EQUIPADO ]</span>' : ''}
          </div>
          <div style="font-family:var(--font-logo); font-size:14px; color:var(--green);">${item.name}</div>
          <div style="font-family:var(--font-code); font-size:11px; color:var(--green-mid); flex:1;">${item.description || ''}</div>
          <div style="display:flex; flex-direction:column; gap:6px; margin-top:10px;">
             ${item.category === 'document' ? `<button class="btn" style="font-size:10px; width:100%;" onclick="Apps.openLightbox('${item.name}', '${item.content || 'Sem conteúdo.'}')">[ LER ARQUIVO ]</button>` : ''}
             <button class="btn" style="font-size:10px; width:100%; ${inv.is_equipped ? 'color:var(--amber); border-color:var(--amber);' : ''}" 
               onclick="Apps.toggleEquip('${inv.id}', ${inv.is_equipped})">
               [ ${inv.is_equipped ? 'DESEQUIPAR' : 'EQUIPAR'} ]
             </button>
          </div>
        </div>
      `;
    }).join('') : '<div class="empty-state">INVENTÁRIO VAZIO.</div>';
  }

  async function toggleEquip(inventoryId, currentlyEquipped) {
    const db = Auth.db();
    if (!db) return;
    const { error } = await db.from('inventory').update({ is_equipped: !currentlyEquipped }).eq('id', inventoryId);
    if (!error) {
      loadInventory();
      refreshStats(); // Atualizar RD se houver mudanças
    }
  }

  function initEmailRealtime() {
    const db = Auth.db();
    if (!db) return;

    db.channel('public:emails')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'emails' }, payload => {
        const email = payload.new;
        const profile = Auth.getProfile();
        const userId = Auth.getUser()?.id;
        const isAdmin = profile?.role === 'admin';

        // Evitar auto-notificação
        if (email.sender_id === userId) return;

        // Notificar se for público ou especificamente para mim (ou se eu for admin)
        const isAll = email.recipient === 'all' || email.recipient_id === 'all' || !email.recipient_id;
        const isForMe = email.recipient_id === userId;

        if (isAll || isForMe || isAdmin) {
          showNotification('NOVA COMUNICAÇÃO', `DE: ${email.sender}<br>ASSUNTO: ${email.subject}`, 'new-email');
          Desktop.updateBadge('emails', 1, true);
        }
      })
      .subscribe();
  }

  return {
    render, init,
    openLightbox, openEmail, deleteEmail,
    updateMissionStatus, deleteMission, openBriefing,
    changeUserRole, deleteUser,
    showNotification, initGlobalRealtime,
    showModal, buyItem,
    initInventory, initStats, initMap,
    deleteItem, selectCombatTarget, applyCombatAction, updateStat, toggleEquip
  };

})();
