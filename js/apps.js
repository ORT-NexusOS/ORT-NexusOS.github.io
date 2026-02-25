/* ============================================================
   NEXUS OS — Application Modules
   ============================================================ */

const Apps = (() => {

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
    combat: { icon: '⚔️', title: 'SINCRO COMBATE', path: 'O.R.T. > ADMIN > COMBAT MASTER' },
    admin: { icon: '⚙', title: 'PAINEL ADM', path: 'O.R.T. > ADMIN > CONTROL' },
  };

  let activeRoomId = '00000000-0000-0000-0000-000000000001';
  let activeRoomName = 'CANAL OMEGA';
  let presenceInterval = null;
  let _inventoryItems = []; // Novo cache local para evitar erros de escape em atributos HTML

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
      const renders = { gallery, videos, missions, emails, chat, shop, map: mapRender, notepad, vault, calendar, terminal, combat, admin, stats: statsPage, inventory: inventoryPage };
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
      calendar: initCalendar, terminal: initTerminal, combat: initCombat, admin: initAdmin,
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
      </div>`;
  }

  function initGallery() {
    loadGallery();
    $('btn-upload-art')?.addEventListener('click', () => {
      const modal = $('upload-modal');
      if (modal) {
        document.body.appendChild(modal);
        modal.classList.remove('hidden');
      }
    });
    $('btn-cancel-upload')?.addEventListener('click', () => {
      $('upload-modal')?.classList.add('hidden');
    });
    $('btn-cloudinary-upload')?.addEventListener('click', openCloudinaryWidget);

    // Handlers para Edição
    $('btn-cancel-edit-art')?.addEventListener('click', () => {
      $('modal-edit-artwork')?.classList.add('hidden');
    });
    $('btn-save-edit-art')?.addEventListener('click', saveEditArtwork);
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
    const user = Auth.getUser();
    const isAdmin = Auth.isAdmin();

    grid.innerHTML = data.map(a => {
      const isOwner = user && a.uploaded_by === user.id;
      const canManage = isOwner || isAdmin;

      return `
        <div class="gallery-card" onclick="Apps.openLightbox('${a.cloudinary_url}','${Utils.esc(a.title)} — ${Utils.esc(a.author)}')">
          <div class="gallery-card-crt"></div>
          ${canManage ? `
          <div class="gallery-card-actions">
            <button class="btn-action-sm" onclick="event.stopPropagation(); Apps.editArtwork('${a.id}', '${Utils.esc(a.title)}', '${Utils.esc(a.author)}')">[ EDITAR ]</button>
            <button class="btn-action-sm btn-action-danger" onclick="event.stopPropagation(); Apps.deleteArtwork('${a.id}')">[ APAGAR ]</button>
          </div>` : ''}
          <div class="gallery-card-img-wrap">
            <img src="${a.cloudinary_url}" alt="${a.title}" loading="lazy">
          </div>
          <div class="gallery-card-info">
            <span class="gallery-card-title">${a.title}</span>
            <span class="gallery-card-author">${a.author}</span>
          </div>
        </div>`;
    }).join('');
  }

  function editArtwork(id, title, author) {
    const modal = $('modal-edit-artwork');
    if (!modal) return;
    document.body.appendChild(modal); // Garante que seja o último filho do body (topo da pilha)
    $('edit-art-id').value = id;
    $('edit-art-title').value = title;
    $('edit-art-author').value = author;
    modal.classList.remove('hidden');
  }

  async function saveEditArtwork() {
    const id = $('edit-art-id').value;
    const title = $('edit-art-title').value;
    const author = $('edit-art-author').value;
    if (!title || !author) return;

    const db = Auth.db();
    const { error } = await db.from('artworks').update({ title, author }).eq('id', id);

    if (!error) {
      showNotification('REGISTRO ATUALIZADO', `A obra "${title}" foi modificada no banco de dados.`, 'success');
      $('modal-edit-artwork').classList.add('hidden');
      loadGallery();
    }
  }

  async function deleteArtwork(id) {
    showModal({
      title: 'APAGAR OBRA',
      body: 'ESTA AÇÃO É IRREVERSÍVEL. DESEJA EXCLUIR ESTA OBRA DO ARQUIVO?',
      type: 'confirm',
      onConfirm: async () => {
        const db = Auth.db();
        const { error } = await db.from('artworks').delete().eq('id', id);

        if (!error) {
          showNotification('ARQUIVO REMOVIDO', 'A obra foi deletada com sucesso.', 'success');
          loadGallery();
        } else {
          console.group('FALHA NA EXCLUSÃO - NEXUS SYS');
          console.error('Erro retornado:', error.message);
          console.error('Código do erro:', error.code);
          console.error('Dica: Verifique se você é o DONO da obra ou se o RLS permite DELETE para ADMIN.');
          console.groupEnd();

          showNotification('ACESSO NEGADO', `Erro: ${error.message} (Verifique console)`, 'error');
        }
      }
    });
  }

  function openLightbox(src, caption) {
    const lb = $('lightbox');
    if (!lb) return;

    // Forçar para o topo do DOM
    document.body.appendChild(lb);

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
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-bottom:12px;">
            <div class="login-field">
              <label class="login-label">&gt; RECOMPENSA (CR$)</label>
              <input type="number" id="m-reward" value="0">
            </div>
            <div class="login-field">
              <label class="login-label">&gt; RECOMPENSA ITEM (LOOT)</label>
              <select id="m-loot-reward" style="width:100%; border-color:var(--amber); color:var(--amber);">
                 <option value="">-- NENHUM --</option>
              </select>
            </div>
            <div class="login-field">
              <label class="login-label">&gt; DESIGNAR AGENTES</label>
              <div id="m-assign-container" style="display:flex; flex-wrap:wrap; gap:8px; background:rgba(0,40,0,0.3); padding:8px; border:1px solid var(--border-dim); height:34px; overflow-y:auto;">
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
        loadLootRewards();
      }
    });

    $('btn-cancel-mission')?.addEventListener('click', () => $('missions-add-form')?.classList.add('hidden'));
    $('btn-save-mission')?.addEventListener('click', saveMission);
  }

  async function loadLootRewards() {
    const sel = $('m-loot-reward');
    if (!sel) return;
    const db = Auth.db();
    if (!db) return;
    const { data } = await db.from('store_items').select('id, name').eq('is_loot', true).order('name');
    sel.innerHTML = `<option value="">-- NENHUM --</option>` + (data || []).map(i => `<option value="${i.id}">${i.name}</option>`).join('');
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
    const lootId = $('m-loot-reward')?.value || null;
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
      loot_item_id: lootId,
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
    const data = db ? (await db.from('missions').select('*, store_items(name)').order('created_at', { ascending: false })).data || [] : DEMO;
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
        <div style="color:var(--amber); font-family:var(--font-code); display:flex; flex-direction:column; align-items:flex-end; gap:4px;">
           <span>CR$ ${m.reward || 0}</span>
           ${m.store_items ? `<span style="font-size:9px; color:var(--green-dim); border:1px solid var(--green-dim); padding:1px 4px;">+ ${m.store_items.name.toUpperCase()}</span>` : ''}
        </div>
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
      if (m && (m.reward > 0 || m.loot_item_id)) {
        let ids = [];
        if (m.assigned_to === 'all') {
          const { data: allUsers } = await Auth.adminListUsers();
          ids = (allUsers || []).map(u => u.id);
        } else {
          ids = m.assigned_to.split(',').map(i => i.trim());
        }

        for (const userId of ids) {
          // 1. Distribuir Créditos
          if (m.reward > 0) {
            const { data: p } = await db.from('profiles').select('credits').eq('id', userId).single();
            if (p) await db.from('profiles').update({ credits: p.credits + m.reward }).eq('id', userId);
          }
          // 2. Distribuir Item de Loot
          if (m.loot_item_id) {
            await db.from('inventory').insert({
              user_id: userId,
              item_id: m.loot_item_id,
              is_equipped: false
            });
          }
        }

        const rewardMsg = m.loot_item_id ? `CR$ ${m.reward} E ITENS DE RECOMPENSA` : `CR$ ${m.reward}`;
        const targetMsg = m.assigned_to === 'all' ? 'TODOS OS AGENTES' : 'OS DESIGNADOS';
        showNotification('MISSÃO CONCLUÍDA', `RECOMPENSA (${rewardMsg}) DISTRIBUÍDA PARA ${targetMsg}.`, 'success');
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
      const { data } = await db.from('missions').select('*, store_items(name)').eq('id', id).single();
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
                ${mission.store_items ? `
                <div style="margin-top:20px; padding:15px; border:1px dashed var(--amber); background:rgba(255,183,0,0.05);">
                   <div class="login-label" style="color:var(--amber); margin-bottom:5px;">RECOMPENSA LOGÍSTICA ADICIONAL</div>
                   <div style="font-family:var(--font-code); color:var(--green); font-size:16px;">> ${mission.store_items.name.toUpperCase()}</div>
                </div>` : ''}
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

  /* ── Inscrição em Tempo Real para E-mails ── */
  function subscribeEmails() {
    const db = Auth.db();
    if (!db) return;

    const userId = Auth.getUser()?.id;
    const profile = Auth.getProfile();
    const isAdmin = profile?.role === 'admin';

    db.channel('public:emails')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'emails' }, payload => {
        const email = payload.new;
        if (email.sender_id === userId) return; // evitar eco

        const isAll = email.recipient === 'all' || email.recipient_id === 'all' || !email.recipient_id;
        const isForMe = email.recipient_id === userId;

        if (isAll || isForMe || isAdmin) {
          showNotification('NOVA COMUNICAÇÃO', `DE: ${email.sender}<br>ASSUNTO: ${email.subject}`, 'new-email');
          Desktop.updateBadge('emails', 1, true);
          if (document.getElementById('email-list')) loadEmails();
        }
      })
      .subscribe();
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
    overlay.className = 'app-overlay modal-overlay-active';
    overlay.id = 'compose-overlay';
    // z-index handled by CSS class modal-overlay-active

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
      <div style="display:grid; grid-template-columns: 220px 1fr; height:100%; gap:0; background:rgba(0,10,0,0.2);">
        <div style="border-right:1px solid var(--border-dim); display:flex; flex-direction:column; background:rgba(0,40,0,0.1);">
          <div class="app-toolbar" style="padding:10px; border-bottom:1px solid var(--border-dim);">
            <button class="btn" style="width:100%; font-size:11px;" id="btn-new-note">[ + NOVA NOTA ]</button>
          </div>
          <div id="note-list" style="flex:1; overflow-y:auto; padding:5px; display:flex; flex-direction:column; gap:5px;">
             <div class="loading-state">BUSCANDO NOTAS<span class="loading-dots"></span></div>
          </div>
        </div>
        <div style="display:flex; flex-direction:column; height:100%;">
          <div class="app-toolbar" style="padding:10px; border-bottom:1px solid var(--border-dim); display:flex; gap:10px; align-items:center;">
             <input type="text" id="note-title" placeholder="Título da nota..." style="flex:1; background:transparent; border:none; color:var(--green); font-family:var(--font-code); font-size:14px; outline:none; font-weight:bold;">
             <button class="btn" id="btn-save-note" style="font-size:11px;">[ 💾 SALVAR ]</button>
             <button class="btn btn-danger" id="btn-delete-note" style="font-size:11px;">[ APAGAR ]</button>
          </div>
          <textarea id="notepad-area" class="notepad-area" style="flex:1; resize:none; background:transparent; border:none; padding:15px; font-family:var(--font-code); font-size:15px; color:var(--green-mid); line-height:1.7; outline:none;" placeholder="Comece a digitar sua nota classificada..."></textarea>
        </div>
      </div>`;
  }

  let _selectedNoteId = null;

  async function initNotepad() {
    loadNotes();
    $('btn-new-note')?.addEventListener('click', () => {
      _selectedNoteId = null;
      $('note-title').value = 'NOVA NOTA';
      $('notepad-area').value = '';
      $('note-title').focus();
    });
    $('btn-save-note')?.addEventListener('click', saveNote);
    $('btn-delete-note')?.addEventListener('click', deleteNote);
  }

  async function loadNotes() {
    const list = $('note-list');
    if (!list) return;
    const db = Auth.db();
    if (!db) {
      list.innerHTML = '<div class="empty-state">MODO DEMO</div>';
      return;
    }

    const { data } = await db.from('notes').select('*').eq('user_id', Auth.getUser()?.id).order('updated_at', { ascending: false });
    list.innerHTML = '';

    if (data && data.length > 0) {
      data.forEach(note => {
        const item = document.createElement('div');
        item.style.cssText = `padding:10px; border:1px solid var(--border-dim); cursor:pointer; font-size:12px; color:var(--green-mid); background:rgba(0,255,65,0.02); transition:all 0.2s; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;`;
        item.textContent = note.title || 'Sem título';
        item.onclick = () => openNote(note);
        if (_selectedNoteId === note.id) item.style.borderColor = 'var(--green)';
        list.appendChild(item);
      });
    } else {
      list.innerHTML = '<div class="empty-state">SEM NOTAS</div>';
    }
  }

  function openNote(note) {
    _selectedNoteId = note.id;
    $('note-title').value = note.title || '';
    $('notepad-area').value = note.content || '';
    loadNotes(); // Refresh to show selection
  }

  async function saveNote() {
    const title = $('note-title').value.trim();
    const content = $('notepad-area').value;
    if (!title) { showNotification('ERRO', 'Título obrigatório.', 'error'); return; }

    const db = Auth.db();
    if (!db) return;

    const payload = {
      user_id: Auth.getUser()?.id,
      title,
      content,
      updated_at: new Date()
    };

    let error;
    if (_selectedNoteId) {
      const res = await db.from('notes').update(payload).eq('id', _selectedNoteId);
      error = res.error;
    } else {
      const res = await db.from('notes').insert(payload).select();
      error = res.error;
      if (res.data?.[0]) _selectedNoteId = res.data[0].id;
    }

    if (!error) {
      showNotification('SINCRO OK', 'Nota salva no mainframe.', 'success');
      loadNotes();
    } else {
      showModal({ title: 'FALHA DE SINCRO', body: error.message, type: 'alert' });
    }
  }

  async function deleteNote() {
    if (!_selectedNoteId) return;
    showModal({
      title: 'CONFIRMAR EXCLUSÃO',
      body: 'Deseja apagar esta nota permanentemente?',
      type: 'confirm',
      onConfirm: async () => {
        const db = Auth.db();
        await db.from('notes').delete().eq('id', _selectedNoteId);
        _selectedNoteId = null;
        $('note-title').value = '';
        $('notepad-area').value = '';
        loadNotes();
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
          <div class="login-field"><label class="login-label">&gt; PIN DE ACESSO (4 DÍGITOS)</label><input type="password" id="v-pin" maxlength="4" placeholder="••••" style="letter-spacing:8px;font-size:20px;text-align:center;"></div>
        </div>
        <div style="display:flex;gap:10px;">
          <button class="btn" id="btn-save-vault">[ ARMAZENAR ]</button>
          <button class="btn btn-danger" id="btn-cancel-vault">[ CANCELAR ]</button>
        </div>
      </div>
      <div id="vault-list"><div class="loading-state">DECRIPTOGRAFANDO<span class="loading-dots"></span></div></div>`;
  }

  const DEMO_VAULT = [
    { id: 'v1', title: 'ARQUIVO OMEGA — VERDADEIRA NATUREZA DO TEMPO', content: '[DADO CLASSIFICADO]\n\nO tempo não é linear. A O.R.T. existe para manter a ilusão de que é.\n\n— Diretor Fundador', created_at: '3575-11-23', is_unlocked: false, pin_hash: null },
  ];

  async function hashPin(pin) {
    const enc = new TextEncoder();
    const hash = await crypto.subtle.digest('SHA-256', enc.encode(pin));
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function initVault() {
    loadVault();
    $('btn-add-vault')?.addEventListener('click', () => $('vault-add-form')?.classList.toggle('hidden'));
    $('btn-cancel-vault')?.addEventListener('click', () => $('vault-add-form')?.classList.add('hidden'));
    $('btn-save-vault')?.addEventListener('click', saveVaultItem);
  }

  async function saveVaultItem() {
    const title = $('v-title')?.value?.trim();
    const content = $('v-body')?.value?.trim();
    const pin = $('v-pin')?.value?.trim();
    if (!title) { showNotification('ERRO', 'Título obrigatório.', 'alert'); return; }
    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      showNotification('ERRO DE ACESSO', 'O PIN deve ter exatamente 4 dígitos numéricos.', 'alert');
      return;
    }
    const pin_hash = await hashPin(pin);
    const db = Auth.db();
    if (db) {
      const profile = await Auth.getProfile();
      const { error } = await db.from('vault_items').insert({ title, content, pin_hash, is_unlocked: false, created_by: profile?.id });
      if (error) { showNotification('FALHA', 'Erro ao salvar: ' + error.message, 'alert'); return; }
    }
    $('vault-add-form')?.classList.add('hidden');
    if ($('v-title')) $('v-title').value = '';
    if ($('v-body')) $('v-body').value = '';
    if ($('v-pin')) $('v-pin').value = '';
    showNotification('ARQUIVO CRIADO', `"${title}" armazenado com criptografia ativa.`, 'success');
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
    list.innerHTML = data.map(v => {
      const isAdmin = Auth.isAdmin();
      const deleteBtn = isAdmin ? `<button class="btn btn-danger vault-delete-btn" onclick="event.stopPropagation(); Apps.deleteVaultItem('${v.id}')" style="margin-top:10px;font-size:11px;padding:4px 10px;">[ APAGAR ARQUIVO ]</button>` : '';

      if (v.is_unlocked) {
        return `
          <div class="vault-card vault-unlocked" id="vault-card-${v.id}">
            <div class="vault-card-header">
              <span class="vault-unlocked-icon">🔓</span>
              <span class="vault-item-title">${v.title}</span>
              <span class="vault-item-meta">${(v.created_at || '').slice(0, 10)}</span>
            </div>
            <pre class="vault-content">${v.content || ''}</pre>
            ${deleteBtn}
          </div>`;
      } else {
        return `
          <div class="vault-card vault-locked" id="vault-card-${v.id}">
            <div class="vault-card-header">
              <span class="vault-item-title vault-title-locked">??? ${v.title}</span>
              <span class="vault-item-meta">${(v.created_at || '').slice(0, 10)}</span>
            </div>
            <div class="vault-chains-overlay" onclick="Apps.openPadlock('${v.id}', '${v.pin_hash}')">
              <svg class="vault-chain-svg" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
                <!-- Corrente diagonal \ -->
                <line x1="0" y1="0" x2="200" y2="120" stroke="var(--green-dark)" stroke-width="6" stroke-linecap="round"/>
                <line x1="15" y1="0" x2="200" y2="105" stroke="var(--border-dim)" stroke-width="3" stroke-dasharray="10,8"/>
                <!-- Corrente diagonal / -->
                <line x1="200" y1="0" x2="0" y2="120" stroke="var(--green-dark)" stroke-width="6" stroke-linecap="round"/>
                <line x1="185" y1="0" x2="0" y2="105" stroke="var(--border-dim)" stroke-width="3" stroke-dasharray="10,8"/>
                <!-- Cadeado central -->
                <g transform="translate(100,60)" class="vault-padlock-icon" id="padlock-icon-${v.id}">
                  <!-- Arco do cadeado -->
                  <path d="M-14,-18 A14,14 0 0,1 14,-18 L14,0 L-14,0 Z" fill="none" stroke="#00ff41" stroke-width="4" stroke-linecap="round"/>
                  <!-- Corpo do cadeado -->
                  <rect x="-18" y="0" width="36" height="28" rx="4" fill="rgba(0,30,0,0.9)" stroke="#00ff41" stroke-width="2.5"/>
                  <!-- Buraco da fechadura -->
                  <circle cx="0" cy="12" r="5" fill="none" stroke="#00ff41" stroke-width="2"/>
                  <line x1="0" y1="17" x2="0" y2="24" stroke="#00ff41" stroke-width="2" stroke-linecap="round"/>
                </g>
              </svg>
              <div class="vault-padlock-hint">[ CLIQUE PARA INSERIR CÓDIGO DE ACESSO ]</div>
            </div>
            ${deleteBtn}
          </div>`;
      }
    }).join('');
  }

  async function deleteVaultItem(id) {
    showModal({
      title: 'DESTRUIÇÃO PERMANENTE',
      body: 'Confirma a eliminação deste arquivo classificado? Esta operação é irreversível.',
      type: 'confirm',
      onConfirm: async () => {
        const db = Auth.db();
        if (!db) { showNotification('ERRO', 'Sem conexão com o banco de dados.', 'alert'); return; }
        const { error, data } = await db.from('vault_items').delete().eq('id', id).select();
        if (error) {
          console.error('[VAULT DELETE] Erro:', error);
          showNotification('FALHA AO APAGAR', 'Erro: ' + error.message + ' (verifique as políticas RLS no Supabase)', 'alert');
        } else {
          showNotification('ARQUIVO DESTRUÍDO', 'Dado eliminado do Mainframe.', 'success');
          loadVault();
        }
      }
    });
  }

  // ── Minigame do Cadeado ──────────────────────────────────
  let _padlockTarget = null;
  let _padlockHash = null;
  let _padlockDigits = ['_', '_', '_', '_'];
  let _padlockCursor = 0;

  function openPadlock(itemId, pinHash) {
    _padlockTarget = itemId;
    _padlockHash = pinHash;
    _padlockDigits = ['_', '_', '_', '_'];
    _padlockCursor = 0;

    const overlay = document.createElement('div');
    overlay.id = 'padlock-modal-overlay';
    overlay.className = 'padlock-modal-overlay';
    overlay.innerHTML = `
      <div class="padlock-modal" id="padlock-modal">
        <div class="padlock-modal-header">&gt; CÓDIGO DE ACESSO CRIPTOGRÁFICO</div>
        <svg id="padlock-svg" viewBox="0 0 120 140" class="padlock-main-svg" ondblclick="Apps.submitPadlock()">
          <!-- Arco -->
          <path d="M30,55 A30,35 0 0,1 90,55 L90,68 L30,68 Z" fill="none" stroke="#00ff41" stroke-width="5" stroke-linecap="round" id="padlock-arc"/>
          <!-- Corpo -->
          <rect x="18" y="68" width="84" height="62" rx="6" fill="rgba(0,20,0,0.95)" stroke="#00ff41" stroke-width="3" id="padlock-body"/>
          <!-- Buraco da fechadura -->
          <circle cx="60" cy="95" r="10" fill="none" stroke="#00ff41" stroke-width="2.5"/>
          <line x1="60" y1="105" x2="60" y2="120" stroke="#00ff41" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        <div class="padlock-digits-row">
          <div class="padlock-digit" id="pd-0">_</div>
          <div class="padlock-digit" id="pd-1">_</div>
          <div class="padlock-digit" id="pd-2">_</div>
          <div class="padlock-digit" id="pd-3">_</div>
        </div>
        <!-- Input oculto para teclado virtual no mobile -->
        <input type="tel" id="padlock-hidden-input" inputmode="numeric" pattern="[0-9]*"
          style="position:absolute;opacity:0;width:1px;height:1px;pointer-events:none;"
          maxlength="1" autocomplete="off">
        <div class="padlock-hint">INSIRA O CÓDIGO DE 4 DÍGITOS</div>
        <div class="padlock-numpad">
          <button class="padlock-key" onclick="Apps._padlockType('1')">1</button>
          <button class="padlock-key" onclick="Apps._padlockType('2')">2</button>
          <button class="padlock-key" onclick="Apps._padlockType('3')">3</button>
          <button class="padlock-key" onclick="Apps._padlockType('4')">4</button>
          <button class="padlock-key" onclick="Apps._padlockType('5')">5</button>
          <button class="padlock-key" onclick="Apps._padlockType('6')">6</button>
          <button class="padlock-key" onclick="Apps._padlockType('7')">7</button>
          <button class="padlock-key" onclick="Apps._padlockType('8')">8</button>
          <button class="padlock-key" onclick="Apps._padlockType('9')">9</button>
          <button class="padlock-key padlock-key-back" onclick="Apps._padlockBackspace()">⌫</button>
          <button class="padlock-key" onclick="Apps._padlockType('0')">0</button>
          <button class="padlock-key padlock-key-ok" onclick="Apps.submitPadlock()">OK</button>
        </div>
        <div class="padlock-actions">
          <button class="btn btn-danger" onclick="Apps.closePadlock()">[ CANCELAR ]</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    // Escuta teclado (desktop)
    overlay._keyHandler = (e) => {
      if (e.key >= '0' && e.key <= '9') Apps._padlockType(e.key);
      else if (e.key === 'Backspace') Apps._padlockBackspace();
      else if (e.key === 'Enter') Apps.submitPadlock();
      else if (e.key === 'Escape') Apps.closePadlock();
    };
    document.addEventListener('keydown', overlay._keyHandler);

    // Suporte ao teclado virtual mobile via input oculto
    setTimeout(() => {
      const hiddenInput = document.getElementById('padlock-hidden-input');
      if (hiddenInput) {
        hiddenInput.focus();
        hiddenInput.addEventListener('input', (e) => {
          const val = e.target.value.replace(/\D/g, '');
          if (val) {
            Apps._padlockType(val[val.length - 1]);
          } else {
            Apps._padlockBackspace();
          }
          e.target.value = '';
        });
      }
    }, 100);
  }

  function _padlockType(digit) {
    if (_padlockCursor >= 4) return;
    _padlockDigits[_padlockCursor] = digit;
    const el = $(`pd-${_padlockCursor}`);
    if (el) { el.textContent = '•'; el.classList.add('padlock-digit-filled'); }
    _padlockCursor++;
    if (_padlockCursor < 4) {
      const next = $(`pd-${_padlockCursor}`);
      if (next) next.classList.add('padlock-digit-active');
    }
    const prev = $(`pd-${_padlockCursor - 1}`);
    if (prev) prev.classList.remove('padlock-digit-active');
  }

  function _padlockBackspace() {
    if (_padlockCursor <= 0) return;
    _padlockCursor--;
    _padlockDigits[_padlockCursor] = '_';
    const el = $(`pd-${_padlockCursor}`);
    if (el) { el.textContent = '_'; el.classList.remove('padlock-digit-filled', 'padlock-digit-active'); el.classList.add('padlock-digit-active'); }
  }

  async function submitPadlock() {
    const code = _padlockDigits.join('');
    if (code.includes('_') || code.length !== 4) {
      _padlockShake();
      return;
    }
    const enteredHash = await hashPin(code);
    if (enteredHash !== _padlockHash) {
      _padlockShake();
      // Reset digits
      _padlockDigits = ['_', '_', '_', '_'];
      _padlockCursor = 0;
      for (let i = 0; i < 4; i++) {
        const el = $(`pd-${i}`);
        if (el) { el.textContent = '_'; el.className = 'padlock-digit' + (i === 0 ? ' padlock-digit-active' : ''); }
      }
      return;
    }
    // SUCESSO — animar abertura
    const svg = $('padlock-svg');
    const arc = $('padlock-arc');
    const body = $('padlock-body');
    if (arc) arc.setAttribute('stroke', '#00ff00');
    if (body) body.setAttribute('stroke', '#00ff00');
    if (svg) svg.classList.add('padlock-open-anim');

    // Salvar o target antes de fechar
    const targetId = _padlockTarget;

    // Atualizar banco após animação e recarregar cofre
    setTimeout(async () => {
      const db = Auth.db();
      if (db) {
        const { error, data } = await db
          .from('vault_items')
          .update({ is_unlocked: true })
          .eq('id', targetId)
          .select();
        if (error) {
          console.error('[VAULT UNLOCK] Erro ao desbloquear:', error);
          closePadlock();
          showNotification(
            'FALHA AO DESBLOQUEAR',
            'Erro: ' + error.message + ' — Execute o script supabase-vault-fix.sql no seu Supabase.',
            'alert'
          );
          await loadVault();
          return;
        }
      }
      closePadlock();
      await loadVault();
      showNotification('COFRE ABERTO', 'Arquivo desbloqueado com sucesso.', 'success');
    }, 900);
  }

  function _padlockShake() {
    const svg = $('padlock-svg');
    if (!svg) return;
    svg.classList.add('padlock-shake');
    const body = $('padlock-body');
    if (body) body.setAttribute('stroke', '#ff3300');
    setTimeout(() => {
      svg.classList.remove('padlock-shake');
      if (body) body.setAttribute('stroke', '#00ff41');
    }, 600);
    Boot?.playSound?.('error');
  }

  function closePadlock() {
    const overlay = $('padlock-modal-overlay');
    if (overlay) {
      if (overlay._keyHandler) document.removeEventListener('keydown', overlay._keyHandler);
      overlay.remove();
    }
    _padlockTarget = null;
    _padlockHash = null;
  }

  function subscribeVaultUnlocks() {
    const db = Auth.db();
    if (!db) return;
    db.channel('public:vault_items')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'vault_items' }, payload => {
        if (payload.new?.is_unlocked && !payload.old?.is_unlocked) {
          showNotification('COFRE ABERTO', `Arquivo "${payload.new.title}" foi desbloqueado.`, 'success');
          loadVault();
        }
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'vault_items' }, () => loadVault())
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'vault_items' }, () => loadVault())
      .subscribe();
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
      { t: 'resp', v: '  whoami     — Identidade do agente (Real-time)' },
      { t: 'resp', v: '  status     — Estado do sistema e hardware' },
      { t: 'resp', v: '  scan       — Varredura profunda de ameaças' },
      { t: 'resp', v: '  date       — Data in-universe e era atual' },
      { t: 'resp', v: '  lore       — Arquivo de lore da O.R.T.' },
      { t: 'resp', v: '  decrypt    — Tentar quebrar criptografia OMEGA' },
      { t: 'resp', v: '  hack       — Tentativa de acesso não autorizado' },
      { t: 'resp', v: '  sysinfo    — Informações detalhadas do hardware' },
      { t: 'resp', v: '  netscan    — Listar dispositivos na rede local' },
      { t: 'resp', v: '  probe      — Enviar sonda para o setor atual' },
      { t: 'resp', v: '  trace      — Rastrear origem de sinal fantasma' },
      { t: 'resp', v: '  archives   — Acessar registros históricos' },
      { t: 'resp', v: '  clear      — Limpar buffer do terminal' },
      { t: 'resp', v: '  logout     — Encerrar sessão atual' },
    ],
    whoami: async () => {
      // Correção: Buscando do banco para ser em tempo real
      const db = Auth.db();
      let p = Auth.getProfile();
      if (db) {
        const { data } = await db.from('profiles').select('*').eq('id', Auth.getUser()?.id).single();
        if (data) p = data;
      }
      return [
        { t: 'sys', v: '[RETRIEVING AGENT DATA...]' },
        { t: 'resp', v: `AGENTE: ${p?.display_name || p?.username || 'DESCONHECIDO'}` },
        { t: 'resp', v: `CLEARANCE: ${(p?.role || 'N/A').toUpperCase()}` },
        { t: 'resp', v: `CRÉDITOS: CR$ ${p?.credits?.toLocaleString('pt-BR') || 0}` },
        { t: 'sys', v: '--- ATRIBUTOS ---' },
        { t: 'resp', v: `  FOR: ${p?.str || 10} | DES: ${p?.dex || 10} | CON: ${p?.con || 10}` },
        { t: 'resp', v: `  INT: ${p?.int || 10} | SAB: ${p?.wis || 10} | ESP: ${p?.spi || 10}` },
        { t: 'sys', v: '-----------------' },
        { t: 'resp', v: `ID: ${p?.id || 'N/A'}` },
        { t: 'resp', v: 'ORGANIZAÇÃO: O.R.T. — Ordem da Realidade e Tempo' },
      ];
    },
    hack: () => [
      { t: 'err', v: '[ERRO] Tentativa de invasão detectada pela I.A. Chronos.' },
      { t: 'err', v: 'Acesso negado. Seu IP foi marcado para exclusão temporal.' },
    ],
    sysinfo: () => [
      { t: 'sys', v: 'NEXUS OS v7.3.1 (LTS)' },
      { t: 'resp', v: 'Uptime: 1542h 12m' },
      { t: 'resp', v: 'Memory: 128.4 ZB / 1024 ZB' },
      { t: 'resp', v: 'CPU: Quantum Core x64 (98% Efficiency)' },
    ],
    netscan: () => [
      { t: 'sys', v: '[SCANNING LOCAL NETWORK...]' },
      { t: 'resp', v: '  192.168.0.1  — CHRONOS AI (GATEWAY) [ENCRYPTED]' },
      { t: 'resp', v: '  192.168.0.45 — AGENT_TERMINAL (YOU)' },
      { t: 'resp', v: '  192.168.0.12 — NEXUS_SERVER_01 [STABLE]' },
      { t: 'err', v: '  ???.???.?.?? — UNKNOWN_ENTITY [SIGNAL_JAMMED]' },
    ],
    probe: async () => {
      const o = $('terminal-output');
      addTermLine(o, '[PROBE] Lançando sonda de reconhecimento...', 'sys');
      await new Promise(r => setTimeout(r, 1000));
      addTermLine(o, '[PROBE] Sonda entrou no hiperespaço...', 'sys');
      await new Promise(r => setTimeout(r, 1500));
      return [
        { t: 'resp', v: 'STATUS: Sonda destruída por interferência anômala.' },
        { t: 'err', v: 'LOG: Radiação Gamma fora da escala detectada.' }
      ];
    },
    trace: () => [
      { t: 'sys', v: '[TRACING SIGNAL...]' },
      { t: 'resp', v: 'Origem: Setor Desconhecido (Cinturão de Órion)' },
      { t: 'resp', v: 'Intensidade: 4.5 dB (Decaindo)' },
      { t: 'resp', v: 'Assinatura: Não humana.' },
    ],
    archives: () => [
      { t: 'sys', v: '[ARCHIVES] ACESSANDO ARQUIVO MORTO...' },
      { t: 'resp', v: '3532: Primeiro salto temporal bem sucedido.' },
      { t: 'resp', v: '3545: A Grande Crise das Linhas de Tempo.' },
      { t: 'resp', v: '3575: Fundação da O.R.T. sob o Tratado de Gênesis.' },
    ],
    status: () => [
      { t: 'sys', v: '[NEXUS OS] STATUS DO SISTEMA v7.3.1:' },
      { t: 'resp', v: '  KERNEL........... ONLINE' },
      { t: 'resp', v: '  SINCRO O.R.T...... ATIVA' },
      { t: 'resp', v: '  SUPABASE DB....... ' + (Auth.db() ? 'CONECTADO' : 'MODO DEMO') },
      { t: 'resp', v: '  CLOUDINARY........ ' + (NEXUS_CONFIG.cloudinary.cloudName !== 'YOUR_CLOUDINARY_CLOUD_NAME' ? 'CONFIGURADO' : 'NÃO CONFIGURADO') },
      { t: 'resp', v: '  CRT DISPLAY....... EMULAÇÃO ATIVA' },
      { t: 'resp', v: '  AMEAÇAS........... 0 DETECTADAS (SCAN RECOMENDADO)' },
    ],
    scan: async () => {
      const output = $('terminal-output');
      addTermLine(output, '[SCAN] Iniciando varredura de frequências anômalas...', 'sys');
      await new Promise(r => setTimeout(r, 800));
      addTermLine(output, '[SCAN] Acessando Satélites de Vigilância Chronos...', 'sys');
      await new Promise(r => setTimeout(r, 1200));
      addTermLine(output, '[SCAN] Analisando integridade do Setor OMEGA-7...', 'sys');
      await new Promise(r => setTimeout(r, 1000));

      return [
        { t: 'resp', v: '  Núcleo Central..... ESTÁVEL' },
        { t: 'resp', v: '  Malha Temporal..... 99.8% INTEGRAL' },
        { t: 'resp', v: '  Assinaturas Externas... DETECTADAS' },
        { t: 'err', v: '  [ALERTA] Inconsistência de dados detectada em: VALE CINZENTO.' },
        { t: 'sys', v: '  Varredura concluída. Log arquivado sob protocolo S-32.' },
      ];
    },
    date: () => {
      const d = typeof UNIVERSE_DATE !== 'undefined' ? UNIVERSE_DATE : { format: () => '??/??/????' };
      return [
        { t: 'resp', v: `DATA IN-UNIVERSE: ${d.format()}` },
        { t: 'resp', v: `ERA: ${d.era || 'Eras da Consolidação'}` },
        { t: 'resp', v: `DATA REAL: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString()}` },
      ];
    },
    lore: () => [
      { t: 'sys', v: '[ARQUIVO O.R.T.] — HISTÓRIA OCULTA:' },
      { t: 'resp', v: '"A Ordem protege a linha lógica que chamamos de realidade."' },
      { t: 'resp', v: '"Sem nós, o tempo seria uma sucessão de caos absoluto."' },
      { t: 'resp', v: '"O sacrifício dos Agentes é o preço da estabilidade espacial."' },
      { t: 'err', v: '[CLASSIFICADO] Acesso adicional requer nível OMEGA-5.' },
    ],
    decrypt: (args) => {
      const key = args.split(' ')[1];
      if (!key) return [{ t: 'err', v: 'ERRO: Sintaxe incorreta. Use: decrypt [CHAVE]' }];
      if (key === 'nexus123' || key === 'omega') {
        return [
          { t: 'sys', v: '[DECRYPT] Chave válida!' },
          { t: 'resp', v: '  DESBLOQUEANDO DADOS... 100%' },
          { t: 'resp', v: '  MENSAGEM: "O Vazio está voltando. Estejam prontos."' }
        ];
      }
      return [
        { t: 'sys', v: `[DECRYPT] Tentando chave: ${key}...` },
        { t: 'err', v: '  FALHA NA DESCRIPTOGRAFIA: Chave inválida.' }
      ];
    },
    logout: () => { Auth.logout(); return []; },
    clear: () => 'CLEAR',
  };

  function initTerminal() {
    const input = $('terminal-input');
    const output = $('terminal-output');
    if (!input || !output) return;
    input.focus();
    input.addEventListener('keydown', async e => {
      if (e.key !== 'Enter') return;
      const cmdStr = input.value.trim();
      const cmd = cmdStr.toLowerCase();
      input.value = '';
      if (!cmdStr) return;

      Boot.playBeep(660, 0.03, 0.06);
      addTermLine(output, `ORT@NEXUS:~$ ${cmdStr}`, 'cmd');

      const parts = cmd.split(' ');
      const handler = TERMINAL_COMMANDS[parts[0]];

      if (handler) {
        const result = await handler(cmdStr);
        if (result === 'CLEAR') { output.innerHTML = ''; return; }
        if (Array.isArray(result)) result.forEach(r => addTermLine(output, r.v, r.t));
      } else {
        addTermLine(output, `Comando não encontrado: '${parts[0]}'. Digite 'help'.`, 'err');
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
        <button class="btn" onclick="Apps.showNotification('SISTEMA O.R.T.', 'CANAL DE COMUNICAÇÃO OPERALCIONAL.', 'new-email')">[ TESTAR ALERTA ]</button>
      </div>
      <div id="admin-tab-content" style="padding:15px; height:calc(100% - 40px); overflow-y:auto;">
         ${_adminTab === 'agents' ? renderAdminAgents() : ''}
         ${_adminTab === 'items' ? renderAdminItems() : ''}
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
          <div class="login-field" id="it-weapon-tier-field"><label class="login-label">PORTE DA ARMA</label>
            <select id="it-weapon-tier">
               <option value="Arma de Pequeno Porte">Pequeno Porte (Pistolas/SMGs)</option>
               <option value="Arma de Médio Porte">Médio Porte (Rifles/Escopetas)</option>
               <option value="Arma de Grande Porte">Grande Porte (Metralhadoras/Canhões)</option>
               <option value="Arma Branca">Arma Branca (Lâminas/Bastões)</option>
            </select>
          </div>
          <div class="login-field"><label class="login-label">TIPO TÉCNICO (DESCRIÇÃO)</label><input type="text" id="it-technical-type" placeholder="Ex: Rifle de Plasma HK"></div>
          <div class="login-field"><label class="login-label">DADO DE DANO/EFEITO</label><input type="text" id="it-dice" placeholder="Ex: 1d8 + 4"></div>
          <div class="login-field" style="grid-column: span 2;"><label class="login-label">DESCRIÇÃO</label><input type="text" id="it-desc"></div>
          <div class="login-field" id="it-content-field" style="grid-column: span 2; display:none;"><label class="login-label">CONTEÚDO (PARA DOCUMENTOS)</label><textarea id="it-content" rows="3" style="width:100%; background:rgba(0,0,0,0.3); color:var(--green); border:1px solid var(--border-dim); font-family:var(--font-code);"></textarea></div>
          <div style="grid-column: span 2; display:flex; gap:20px;">
            <label style="color:var(--green-mid); font-size:12px;"><input type="checkbox" id="it-for-sale" checked> DISPONÍVEL PARA VENDA NA LOJA</label>
            <label style="color:var(--green-mid); font-size:12px;"><input type="checkbox" id="it-loot"> DISPONÍVEL COMO LOOT DE MISSÃO</label>
          </div>
        </div>
        <button class="btn" id="btn-save-item" style="margin-top:10px;">[ FABRICAR ITEM ]</button>
      </div>
      <div class="login-label">> ITENS NO BANCO DE DADOS</div>
      <div id="admin-items-list" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(150px, 1fr)); gap:10px; margin-top:10px;"></div>`;
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
      $('it-cat')?.addEventListener('change', e => {
        const cat = e.target.value;
        if ($('it-content-field')) $('it-content-field').style.display = cat === 'document' ? 'block' : 'none';
        if ($('it-weapon-tier-field')) $('it-weapon-tier-field').style.display = cat === 'weapon' ? 'block' : 'none';
      });
      $('btn-save-item')?.addEventListener('click', createItem);
    }
  }

  /* ══════════════════════════════════════════════════════════
     SINCRO COMBATE (MESTRE DE JOGO)
  ══════════════════════════════════════════════════════════ */
  function combat() {
    if (!Auth.isAdmin()) return '<div class="empty-state">ACESSO RESTRITO AO MESTRE</div>';
    return `
      <div class="combat-app-layout" style="display:grid; grid-template-columns:300px 1fr; height:100%; overflow:hidden;">
         <!-- Seletor de Alvos -->
         <aside style="border-right:1px solid var(--border-dim); padding:15px; display:flex; flex-direction:column; gap:10px; background:rgba(0,0,0,0.2);">
            <div class="login-label">> AGENTES CONECTADOS</div>
            <div id="combat-agent-selector" style="flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:5px; scrollbar-width:thin;">
               <div class="loading-state">...</div>
            </div>
         </aside>

         <!-- Editor de Ficha -->
         <main id="combat-editor-main" style="padding:20px; overflow-y:auto; scrollbar-width:thin;">
            <div class="empty-state">SELECIONE UM AGENTE PARA SINCRONIZAR A FICHA</div>
         </main>
      </div>`;
  }

  function initCombat() {
    loadCombatAgents();
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
    const name = $('it-name')?.value;
    const desc = $('it-desc')?.value;
    const cat = $('it-cat')?.value;
    const rare = $('it-rare')?.value;
    const price = parseInt($('it-price')?.value) || 0;
    const isLoot = $('it-loot')?.checked;
    const isForSale = $('it-for-sale')?.checked;
    const content = $('it-content')?.value;
    const tier = $('it-weapon-tier')?.value;
    const techType = $('it-technical-type')?.value;

    // Se for arma, o item_type principal deve ser o Porte para o sistema de slots
    const itemType = cat === 'weapon' ? tier : techType;
    const damageDice = $('it-dice')?.value;

    if (!name) {
      showNotification('ERRO DE DADOS', 'O NOME DO ITEM É OBRIGATÓRIO.', 'alert');
      return;
    }

    const db = Auth.db();
    if (!db) {
      showNotification('ERRO DE CONEXÃO', 'DATABASE INDISPONÍVEL.', 'alert');
      return;
    }

    const { error } = await db.from('store_items').insert({
      name,
      description: desc,
      category: cat,
      rarity: rare,
      price,
      is_loot: isLoot,
      is_for_sale: isForSale,
      content,
      item_type: itemType,
      damage_dice: damageDice
    });

    if (!error) {
      showNotification('FABRICAÇÃO CONCLUÍDA', `ITEM ${name} REGISTRADO NO BANCO.`, 'success');
      loadAdminItems();

      // Limpar formulário
      $('it-name').value = '';
      $('it-desc').value = '';
      $('it-price').value = '0';
      $('it-technical-type').value = '';
      $('it-dice').value = '';
      if ($('it-content')) $('it-content').value = '';
      if ($('it-for-sale')) $('it-for-sale').checked = true;
      if ($('it-loot')) $('it-loot').checked = false;
    } else {
      showModal({ title: 'FALHA NA FÁBRICA', body: 'ERRO AO INSERIR NO BANCO: ' + error.message, type: 'alert' });
    }
  }

  async function loadAdminItems() {
    const list = $('admin-items-list');
    if (!list) return;
    const db = Auth.db();
    const { data } = await db.from('store_items').select('*').order('created_at', { ascending: false });

    list.innerHTML = data?.map(item => `
      <div style="background:rgba(0,30,0,0.4); border:1px solid var(--border-dim); padding:10px; font-size:11px; display:flex; flex-direction:column; gap:4px;">
         <div style="color:var(--green); font-weight:bold;">${item.name}</div>
         <div style="color:var(--amber);">CR$ ${item.price} - ${item.category}</div>
         <div style="font-size:9px; color:var(--green-mid);">${item.is_for_sale ? '<span style="color:var(--green);">[ LOJA: ON ]</span>' : '<span style="color:var(--red-alert);">[ LOJA: OFF ]</span>'} | ${item.is_loot ? '<span style="color:var(--amber);">[ LOOT: ON ]</span>' : '[ LOOT: OFF ]'}</div>
         ${item.damage_dice ? `<div style="color:var(--red-alert); font-size:9px;">DANO: ${item.damage_dice}</div>` : ''}
         <button class="btn btn-action-danger" style="font-size:9px; margin-top:5px;" onclick="Apps.deleteItem('${item.id}')">[ APAGAR ]</button>
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

  async function selectCombatTarget(id, name) {
    _selectedCombatId = id;
    loadCombatAgents(); // Refresh selection

    const main = $('combat-editor-main');
    if (!main) return;

    const db = Auth.db();
    const { data: u } = await db.from('profiles').select('*').eq('id', id).single();
    if (!u) return;

    main.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:25px;">
         <!-- Header da Ficha -->
         <header style="border-bottom:2px solid var(--green); padding-bottom:10px; display:flex; justify-content:space-between; align-items:flex-end;">
            <div>
               <div class="login-label" style="font-size:10px; opacity:0.7;">IDENTIDADE DO AGENTE</div>
               <div style="font-size:24px; color:var(--green); font-family:var(--font-code);">${Utils.esc(u.display_name || u.username)}</div>
            </div>
            <div style="text-align:right;">
               <div class="login-label" style="font-size:10px; opacity:0.7;">CLEARANCE / EMAIL</div>
               <div style="font-size:12px; color:var(--green-mid);">${u.role.toUpperCase()} | ${u.email}</div>
            </div>
         </header>

         <div style="display:grid; grid-template-columns:1fr 1fr; gap:30px;">
            <!-- Lado Esquerdo: Identidade e Vitais -->
            <div style="display:flex; flex-direction:column; gap:20px;">
               <section style="background:rgba(0,40,0,0.2); border:1px solid var(--border-dim); padding:15px;">
                  <div class="login-label" style="margin-bottom:10px;">> DADOS BIOGRÁFICOS</div>
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                     <div class="login-field"><label class="login-label">NÍVEL</label><input type="number" id="combat-edit-level" value="${u.level || 1}"></div>
                     <div class="login-field"><label class="login-label">CRÉDITOS (CR$)</label><input type="number" id="combat-edit-credits" value="${u.credits || 0}"></div>
                     <div class="login-field"><label class="login-label">RAÇA</label><input type="text" id="combat-edit-race" value="${u.race || 'Humano'}"></div>
                     <div class="login-field"><label class="login-label">FUNÇÃO / CLASSE</label><input type="text" id="combat-edit-class" value="${u.function_class || 'Recruta'}"></div>
                  </div>
                  <button class="btn" style="margin-top:10px; width:100%;" onclick="Apps.saveCombatBio()">[ SINCRONIZAR BIOGRAFIA ]</button>
               </section>

               <section style="background:rgba(40,0,0,0.2); border:1px solid var(--red-alert); padding:15px;">
                  <div class="login-label" style="color:var(--red-alert); margin-bottom:10px;">> STATUS VITAIS (HP / SP)</div>
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                     <div>
                        <div class="stat-label">SAÚDE (HP)</div>
                        <div style="display:flex; gap:5px; margin-top:5px;">
                           <input type="number" id="combat-hp-curr" value="${u.hp_current}" style="width:50px;">
                           <span style="align-self:center;">/</span>
                           <input type="number" id="combat-hp-max" value="${u.hp_max}" style="width:50px;">
                        </div>
                     </div>
                     <div>
                        <div class="stat-label">ESPÍRITO (SP)</div>
                        <div style="display:flex; gap:5px; margin-top:5px;">
                           <input type="number" id="combat-sp-curr" value="${u.sp_current}" style="width:50px;">
                           <span style="align-self:center;">/</span>
                           <input type="number" id="combat-sp-max" value="${u.sp_max}" style="width:50px;">
                        </div>
                     </div>
                  </div>
                  <div style="display:flex; gap:10px; margin-top:15px;">
                     <input type="number" id="combat-vital-mod" value="1" style="width:60px;">
                     <button class="btn btn-danger" style="flex:1;" onclick="Apps.modVital('hp', -1)">[ DANO ]</button>
                     <button class="btn" style="flex:1;" onclick="Apps.modVital('hp', 1)">[ CURA ]</button>
                  </div>
                  <button class="btn" style="margin-top:10px; width:100%;" onclick="Apps.saveCombatVitals()">[ SINCRONIZAR VITAIS ]</button>
               </section>
            </div>

            <!-- Lado Direito: Mental e Atributos -->
            <div style="display:flex; flex-direction:column; gap:20px;">
               <section style="background:rgba(80,0,150,0.1); border:1px solid #a000ff; padding:15px;">
                  <div class="login-label" style="color:#a000ff; margin-bottom:10px;">> ESTADO MENTAL</div>
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                     <div>
                        <div class="stat-label">SANIDADE (-1 a 5)</div>
                        <div style="display:flex; gap:5px; margin-top:5px;">
                           <button class="btn btn-danger" style="padding:2px 8px;" onclick="Apps.modSanity(-1)">-</button>
                           <input type="number" id="combat-san-curr" value="${u.sanity_current}" min="-1" max="5" style="width:50px; text-align:center;">
                           <button class="btn" style="padding:2px 8px;" onclick="Apps.modSanity(1)">+</button>
                           <span style="align-self:center; opacity:0.5; margin:0 5px;">/</span>
                           <input type="number" id="combat-san-max" value="${u.sanity_max || 5}" style="width:40px; opacity:0.7;">
                        </div>
                     </div>
                     <div>
                        <div class="stat-label">EXPOSIÇÃO (0-100%)</div>
                        <div style="display:flex; gap:5px; margin-top:5px;">
                           <input type="range" id="combat-exp-range" value="${u.mental_exposure}" min="0" max="100" style="flex:1;" oninput="$('combat-exp').value = this.value">
                           <input type="number" id="combat-exp" value="${u.mental_exposure}" min="0" max="100" style="width:55px;" oninput="$('combat-exp-range').value = this.value">
                        </div>
                     </div>
                  </div>
                  <button class="btn" style="margin-top:10px; width:100%;" onclick="Apps.saveCombatMental()">[ SINCRONIZAR MENTE ]</button>
               </section>

               <section style="background:rgba(0,20,0,0.2); border:1px solid var(--green); padding:15px;">
                  <div class="login-label" style="margin-bottom:10px;">> ATRIBUTOS TÉCNICOS</div>
                  <div id="combat-attr-grid" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px;">
                     ${['str', 'dex', 'con', 'int', 'wis', 'spi'].map(a => `
                        <div style="display:flex; flex-direction:column; gap:2px;">
                           <span class="stat-label">${a.toUpperCase()}</span>
                           <input type="number" id="combat-attr-${a}" value="${u[a] || 0}" style="width:100%;">
                        </div>
                     `).join('')}
                  </div>
                  <div class="login-field" style="margin-top:10px;">
                     <label class="login-label">REDUÇÃO DE DANO (RD)</label>
                     <input type="number" id="combat-rd" value="${u.rd || 0}" readonly style="opacity:0.7; border-style:dashed;">
                  </div>
                  <button class="btn" style="margin-top:10px; width:100%;" onclick="Apps.saveCombatAttrs()">[ SINCRONIZAR ATRIBUTOS ]</button>
               </section>

               <!-- NOVO: EQUIPAMENTO DO AGENTE -->
               <section style="background:rgba(0,30,30,0.2); border:1px solid var(--border-dim); padding:15px;">
                  <div class="login-label" style="margin-bottom:10px; color:var(--green-mid);">> EQUIPAMENTO EM USO</div>
                  <div id="combat-equipped-list" style="font-family:var(--font-code); font-size:12px; display:flex; flex-direction:column; gap:6px;">
                     <div class="loading-state">...</div>
                  </div>
               </section>

               <section style="background:rgba(20,20,0,0.1); border:1px solid var(--amber); padding:15px;">
                  <div class="login-label" style="color:var(--amber); margin-bottom:10px;">> ENTREGAR EQUIPAMENTO (LOOT DIRECT)</div>
                  <div style="display:flex; gap:10px;">
                     <select id="combat-loot-select" style="flex:1;"></select>
                     <button class="btn" onclick="Apps.giveLoot()" style="color:var(--amber); border-color:var(--amber);">[ ENTREGAR ]</button>
                  </div>
               </section>
            </div>
         </div>
      </div>`;

    loadCombatAgents(); // Refresh selection
    loadLootSelect();

    // Carregar itens equipados do alvo
    const equipList = $('combat-equipped-list');
    if (equipList && db) {
      const { data: equipped } = await db.from('inventory')
        .select('*, store_items(*)').eq('user_id', id).eq('is_equipped', true);

      if (equipped?.length) {
        equipList.innerHTML = equipped.map(eq => `
             <div style="padding:4px; border-left:2px solid var(--green-mid); background:rgba(0,255,65,0.03);">
                <span style="color:var(--amber); font-size:10px;">[${(eq.store_items.item_type || eq.store_items.category).toUpperCase()}]</span>
                <span style="color:var(--green);">${eq.store_items.name}</span>
                ${eq.store_items.damage_dice ? `<span style="color:var(--green-dim); font-size:10px; margin-left:5px;">(${eq.store_items.damage_dice})</span>` : ''}
             </div>
          `).join('');
      } else {
        equipList.innerHTML = '<div style="opacity:0.5;">SEM EQUIPAMENTO ATIVO.</div>';
      }
    }
  }

  async function saveCombatBio() {
    if (!_selectedCombatId) return;
    const updates = {
      level: parseInt($('combat-edit-level').value) || 1,
      credits: parseInt($('combat-edit-credits').value) || 0,
      race: $('combat-edit-race').value,
      function_class: $('combat-edit-class').value
    };
    const db = Auth.db();
    await db.from('profiles').update(updates).eq('id', _selectedCombatId);
    showNotification('SINCRO BIOGRAFIA', 'DADOS BIOGRÁFICOS SINCRONIZADOS.', 'success');
  }

  async function modVital(stat, direction) {
    const amount = parseInt($('combat-vital-mod').value) || 0;
    const finalMod = amount * direction;
    const input = $(`combat-${stat}-curr`);
    if (input) {
      input.value = parseInt(input.value) + finalMod;
      await saveCombatVitals();
    }
  }

  async function saveCombatVitals() {
    if (!_selectedCombatId) return;
    const updates = {
      hp_current: parseInt($('combat-hp-curr').value),
      hp_max: parseInt($('combat-hp-max').value),
      sp_current: parseInt($('combat-sp-curr').value),
      sp_max: parseInt($('combat-sp-max').value)
    };
    const db = Auth.db();
    await db.from('profiles').update(updates).eq('id', _selectedCombatId);
    showNotification('SINCRO VITAIS', 'STATUS DE SAÚDE E ESPÍRITO ATUALIZADOS.', 'success');
  }

  async function saveCombatMental() {
    if (!_selectedCombatId) return;
    const sanCurr = Math.max(-1, Math.min(5, parseInt($('combat-san-curr').value)));
    const expVal = Math.max(0, Math.min(100, parseInt($('combat-exp').value)));

    // Feedback imediato no input (clamp visual)
    $('combat-san-curr').value = sanCurr;
    $('combat-exp').value = expVal;

    const updates = {
      sanity_current: sanCurr,
      sanity_max: parseInt($('combat-san-max').value) || 5,
      mental_exposure: expVal
    };
    const db = Auth.db();
    await db.from('profiles').update(updates).eq('id', _selectedCombatId);
    showNotification('SINCRO MENTAL', 'ESTADO DA PSIQUÊ SINCRONIZADO.', 'success');
  }

  function modSanity(dir) {
    const input = $('combat-san-curr');
    if (!input) return;
    let val = (parseInt(input.value) || 0) + dir;
    input.value = Math.max(-1, Math.min(5, val));
    saveCombatMental();
  }

  async function saveCombatAttrs() {
    if (!_selectedCombatId) return;
    const updates = { rd: parseInt($('combat-rd').value) };
    ['str', 'dex', 'con', 'int', 'wis', 'spi'].forEach(a => {
      updates[a] = parseInt($(`combat-attr-${a}`).value) || 0;
    });
    const db = Auth.db();
    await db.from('profiles').update(updates).eq('id', _selectedCombatId);
    showNotification('SINCRO ATRIBUTOS', 'ATRIBUTOS TÉCNICOS ATUALIZADOS.', 'success');
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
    // Suporte para tipos de raridade (common, uncommon, rare, legendary)
    toast.className = `notification-toast ${type}`;
    toast.innerHTML = `
            <div class="notification-header">> ${title || 'NOVO ALERTA SISTEMA'}</div>
            <div class="notification-body">${body}</div>
        `;

    toast.onclick = () => {
      toast.remove();
      if (type === 'new-email') openApp('emails');
      if (type === 'new-item' || ['common', 'uncommon', 'rare', 'legendary'].includes(type)) openApp('shop');
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
    const overlay = document.createElement('div');
    overlay.className = 'app-overlay modal-overlay-active';
    // z-index is handled by CSS class now

    const isConfirm = options.type === 'confirm';

    overlay.innerHTML = `
      <div class="modal-box scan-effect" style="width:min(450px, 90vw);">
        <div class="modal-header">
          > ${options.title || 'SISTEMA O.R.T.'}
        </div>
        <div class="modal-body">
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
     CHAT OMEGA (SISTEMA DE SALAS & PRESENÇA)
  ══════════════════════════════════════════════════════════ */
  function scrollToBottom() {
    const container = document.getElementById('chat-messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  function chat() {
    return `
      <div class="chat-layout">
        <!-- Coluna Esquerda: Salas e DMs -->
        <aside class="chat-sidebar">
          <header class="chat-sidebar-header">
             <button class="btn" onclick="Apps.switchRoom('00000000-0000-0000-0000-000000000001', 'CANAL OMEGA')" style="width:100%; font-size:11px; margin-bottom:8px; border-color:var(--green-mid); background:rgba(0,255,65,0.05);">[ CANAL OMEGA ]</button>
             <div style="display:grid; grid-template-columns:1fr 1fr; gap:5px;">
               <button class="btn" onclick="Apps.openNewDM()" style="width:100%; font-size:10px; padding:6px 2px;">[ + DM ]</button>
               <button class="btn" onclick="Apps.openNewGroup()" style="width:100%; font-size:10px; padding:6px 2px;">[ + GRUPO ]</button>
             </div>
          </header>
          <div id="chat-rooms-list" class="chat-rooms-list">
             <div class="loading-state">...</div>
          </div>
        </aside>
        <div id="chat-sidebar-backdrop" onclick="Apps.toggleChatSidebar()" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:999; backdrop-filter:blur(2px);"></div>

        <!-- Coluna Central: Mensagens -->
        <main class="chat-main">
          <div style="background:rgba(0,255,65,0.05); border-bottom:1px solid var(--border-dim); padding:8px 12px; display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:10px;">
              <button id="btn-mobile-chat" class="btn" onclick="Apps.toggleChatSidebar()" style="display:none; padding:4px 8px; font-size:10px;">[ MENU ]</button>
              <span id="chat-active-room-name" style="font-family:var(--font-code); font-size:11px; color:var(--green-mid); letter-spacing:1px;">${activeRoomName}</span>
            </div>
            <div id="chat-admin-actions"></div>
          </div>
          <div id="chat-messages-container" style="flex:1; overflow-y:auto; padding:15px; display:flex; flex-direction:column; gap:10px; scrollbar-width:thin;">
            <div class="loading-state">SINCRONIZANDO<span class="loading-dots"></span></div>
          </div>
          <div class="app-toolbar" style="border-top:1px solid var(--border-dim); padding:10px; display:flex; gap:10px; align-items:center;">
            <input type="text" id="chat-input" autocomplete="off" placeholder="Mensagem segura..." 
              style="flex:1; background:rgba(0,40,0,0.4); border:1px solid var(--border-dim); color:var(--green); padding:10px; font-family:var(--font-code); outline:none;">
            <button class="btn" id="btn-chat-send" style="padding:10px 20px;">[ ENVIAR ]</button>
          </div>
        </main>

        <!-- Coluna Direita: Online -->
        <aside class="chat-online-panel">
          <header class="chat-online-header">ONLINE</header>
          <div id="chat-online-list" class="chat-online-list">
             <div class="loading-state">...</div>
          </div>
        </aside>
      </div>`;
  }

  function initChat() {
    loadChatRooms();
    loadChatMessages(activeRoomId);
    loadOnlineUsers();
    startPresenceHeartbeat();

    const input = $('chat-input');
    const sendBtn = $('btn-chat-send');

    const sendMessage = async () => {
      const text = input.value.trim();
      if (!text) return;
      input.value = '';

      const user = Auth.getUser();
      const tempId = 'temp-' + Date.now();

      // Optimistic append
      appendChatMessage({
        id: tempId,
        sender_id: user.id,
        text: text,
        created_at: new Date().toISOString(),
        profiles: Auth.getProfile(),
        status: 'sending'
      });

      const db = Auth.db();
      if (db) {
        const { data, error } = await db.from('chat_messages').insert({
          sender_id: user.id,
          room_id: activeRoomId,
          text: text
        }).select().single();

        if (!error && data) {
          // Update status to sent and replace ID
          const msgEl = document.querySelector(`[data-msg-id="${tempId}"]`);
          if (msgEl) {
            msgEl.setAttribute('data-msg-id', data.id);
            const statusEl = msgEl.querySelector('.msg-status');
            if (statusEl) {
              statusEl.textContent = '✓';
              statusEl.className = 'msg-status sent';
            }
          }
        }
      }
    };

    input?.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
    sendBtn?.addEventListener('click', sendMessage);

    // Subscribe to presence if not already
    subscribePresence();
  }

  async function loadChatRooms() {
    const list = $('chat-rooms-list');
    if (!list) return;
    const db = Auth.db();
    if (!db) return;

    const { data: rooms } = await db.from('chat_rooms')
      .select(`*, chat_room_members!inner(user_id)`)
      .or(`type.eq.general, user_id.eq.${Auth.getUser()?.id}`)
      .order('type', { ascending: false });

    // Filtragem manual pq o 'or' com join no Supabase pode ser chato
    const userRooms = rooms || [];

    list.innerHTML = userRooms.map(r => {
      const icon = r.type === 'general' ? '📡' : (r.type === 'dm' ? '👤' : '👥');
      return `
        <div class="chat-room-item ${r.id === activeRoomId ? 'active' : ''}" onclick="Apps.switchRoom('${r.id}', '${r.name}')">
          <span class="room-icon">${icon}</span>
          <span>${r.name}</span>
        </div>`;
    }).join('');
  }

  async function switchRoom(id, name) {
    activeRoomId = id;
    activeRoomName = name;

    // Update UI
    const nameEl = $('chat-active-room-name');
    if (nameEl) nameEl.textContent = name;

    loadChatRooms(); // Update active state
    loadChatMessages(id);

    // Close sidebar on mobile after selection
    if (window.innerWidth <= 800) {
      document.querySelector('.chat-sidebar')?.classList.remove('mobile-active');
      const backdrop = $('chat-sidebar-backdrop');
      if (backdrop) backdrop.style.display = 'none';
    }

    // Admin features for General Room
    const adminActions = $('chat-admin-actions');
    if (adminActions) {
      if (id === '00000000-0000-0000-0000-000000000001' && Auth.getProfile()?.role === 'admin') {
        adminActions.innerHTML = `<button class="btn btn-danger" onclick="Apps.clearGeneralChat()" style="font-size:9px; padding:4px 8px;">[ LIMPAR CANAL ]</button>`;
      } else {
        adminActions.innerHTML = '';
      }
    }
  }

  async function loadChatMessages(roomId) {
    const container = $('chat-messages-container');
    if (!container) return;
    const db = Auth.db();
    if (!db) {
      container.innerHTML = '<div class="empty-state">DADOS INDISPONÍVEIS.</div>';
      return;
    }

    const { data } = await db.from('chat_messages')
      .select('*, profiles(display_name, username, role)')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(50);

    container.innerHTML = '';
    if (data) data.forEach(msg => appendChatMessage(msg));

    // Garantir rolagem após render
    setTimeout(scrollToBottom, 100);
  }

  function appendChatMessage(msg) {
    const container = $('chat-messages-container');
    if (!container) return;

    if (container.querySelector('.loading-state')) container.innerHTML = '';

    // Verificações para evitar duplicatas (se vier do realtime e ja estiver la)
    if (msg.id && container.querySelector(`[data-msg-id="${msg.id}"]`)) return;

    const isMe = msg.sender_id === Auth.getUser()?.id;
    const senderName = isMe ? 'VOCÊ' : (msg.profiles?.display_name || msg.profiles?.username || 'AGENTE');

    const msgEl = document.createElement('div');
    msgEl.setAttribute('data-msg-id', msg.id || '');
    msgEl.style.cssText = `max-width:85%; padding:10px 14px; border:1px solid var(--border-dim); font-family:var(--font-code); margin-bottom:6px; position:relative;
      ${isMe ? 'align-self:flex-end; background:rgba(0,255,65,0.08); border-color:var(--green); border-right:4px solid var(--green);' : 'align-self:flex-start; background:rgba(255,183,0,0.05); border-left:4px solid var(--amber);'}`;

    const timestamp = msg.created_at ? new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'AGORA';

    const statusIcon = msg.status === 'sending' ? '⋯' : (msg.status === 'sent' || msg.id ? '✓' : '');
    const statusClass = msg.status || (msg.id ? 'sent' : '');

    msgEl.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; gap:20px;">
        <span style="font-size:10px; color:${isMe ? 'var(--green)' : 'var(--amber)'}; font-weight:bold; letter-spacing:1px;">
          ${senderName} ${msg.profiles?.role ? `[${msg.profiles.role.toUpperCase()}]` : ''}
        </span>
        <div style="display:flex; align-items:center;">
          <span style="font-size:9px; color:var(--green-dark);">${timestamp}</span>
          ${isMe ? `<span class="msg-status ${statusClass}">${statusIcon}</span>` : ''}
        </div>
      </div>
      <div style="color:var(--green); font-size:14px; word-break:break-word; line-height:1.4;">${Utils.esc(msg.text)}</div>
    `;

    container.appendChild(msgEl);
    scrollToBottom();
  }

  function subscribeChat() {
    const db = Auth.db();
    if (!db) return;

    db.channel('chat_updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, async payload => {
        const msg = payload.new;

        // Se for do room ativo, adiciona
        if (msg.room_id === activeRoomId) {
          const { data } = await db.from('profiles').select('display_name, username, role').eq('id', msg.sender_id).single();
          appendChatMessage({ ...msg, profiles: data });
        }

        // Notificação se não for eu
        const userId = Auth.getUser()?.id;
        if (msg.sender_id !== userId) {
          showNotification('MENSAGEM RECEBIDA', 'Nova transmissão detectada no Chat Omega.', 'new-message');
          Desktop.updateBadge('chat', 1, true);
        }
      })
      .subscribe();
  }

  function toggleChatSidebar() {
    const sidebar = document.querySelector('.chat-sidebar');
    const backdrop = $('chat-sidebar-backdrop');
    if (sidebar) {
      const active = sidebar.classList.toggle('mobile-active');
      if (backdrop) backdrop.style.display = active ? 'block' : 'none';
    }
  }

  /* ── Presença Omega ─────────────────────────────────────── */
  function startPresenceHeartbeat() {
    if (presenceInterval) clearInterval(presenceInterval);
    pingPresence();
    presenceInterval = setInterval(pingPresence, 30000);
  }

  async function pingPresence() {
    const user = Auth.getUser();
    if (!user) return;
    const db = Auth.db();
    if (!db) return;

    const profile = await Auth.getProfile();
    const name = profile?.display_name || profile?.username || user.email;

    await db.from('presence').upsert({
      user_id: user.id,
      display_name: name,
      last_seen: new Date().toISOString()
    });
  }

  async function loadOnlineUsers() {
    const list = $('chat-online-list');
    if (!list) return;
    const db = Auth.db();
    if (!db) return;

    // Online = visto nos últimos 2 minutos
    const twoMinAgo = new Date(Date.now() - 120000).toISOString();
    const { data } = await db.from('presence')
      .select('*')
      .gt('last_seen', twoMinAgo)
      .order('display_name');

    list.innerHTML = (data || []).map(u => `
        <div class="online-user-item">
          <span class="chat-online-dot pulse"></span>
          <span title="${Utils.esc(u.display_name)}">${Utils.esc(u.display_name)}</span>
        </div>
      `).join('');
  }

  function subscribePresence() {
    const db = Auth.db();
    if (!db) return;
    db.channel('presence_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'presence' }, () => {
        loadOnlineUsers();
      })
      .subscribe();
  }

  /* ── Criação de RM/Grupos ────────────────────────────────── */
  async function openNewDM() {
    const db = Auth.db();
    const { data: users } = await db.from('profiles').select('id, display_name, username').order('display_name');
    const myId = Auth.getUser()?.id;

    const options = (users || [])
      .filter(u => u.id !== myId)
      .map(u => `<button class="btn" onclick="Apps.createDM('${u.id}', '${u.display_name}')" style="width:100%; margin-bottom:5px;">[ CONECTAR ] ${u.display_name}</button>`)
      .join('');

    showModal({
      title: 'INICIAR TRANSMISSÃO PRIVADA',
      body: `<div style="max-height:300px; overflow-y:auto;">${options || 'NENHUM OUTRO AGENTE ONLINE.'}</div>`,
      confirmText: 'VOLTAR'
    });
  }

  async function createDM(targetUserId, targetName) {
    const db = Auth.db();
    const myId = Auth.getUser()?.id;

    // Check if DM already exists
    const { data: existing } = await db.from('chat_rooms')
      .select('id, name')
      .eq('type', 'dm')
      .contains('id', db.from('chat_room_members').select('room_id').eq('user_id', myId)) // Simplificação conceitual

    // Na verdade, vamos apenas criar um novo ou buscar o existente via lógica de membros
    // Para simplificar no RPG: cria um novo private room com nome dos dois
    const roomName = `DM: ${targetName}`;
    const { data: newRoom } = await db.from('chat_rooms').insert({ name: roomName, type: 'dm' }).select().single();

    if (newRoom) {
      await db.from('chat_room_members').insert([
        { room_id: newRoom.id, user_id: myId },
        { room_id: newRoom.id, user_id: targetUserId }
      ]);
      switchRoom(newRoom.id, newRoom.name);
      $('app-overlay')?.remove(); // Fecha o modal
    }
  }

  async function openNewGroup() {
    const db = Auth.db();
    const { data: users } = await db.from('profiles').select('id, display_name, username').order('display_name');
    const myId = Auth.getUser()?.id;

    const userList = (users || [])
      .filter(u => u.id !== myId)
      .map(u => `
        <label style="display:flex; align-items:center; gap:10px; padding:8px; border-bottom:1px solid var(--border-dim); cursor:pointer;">
          <input type="checkbox" class="group-member-check" value="${u.id}">
          <span style="font-family:var(--font-code); color:var(--green);">${u.display_name}</span>
        </label>
      `).join('');

    showModal({
      title: 'FORMAR GRUPO DE OPERAÇÕES',
      body: `
        <div style="margin-bottom:15px;">
           <label style="font-size:10px; color:var(--green-dark);">NOME DO GRUPO</label>
           <input type="text" id="new-group-name" class="input-field" placeholder="Ex: ESQUADRÃO OMEGA">
        </div>
        <div style="max-height:200px; overflow-y:auto; border:1px solid var(--border-dim); padding:5px;">
           ${userList}
        </div>
      `,
      confirmText: 'CRIAR GRUPO',
      type: 'confirm',
      cancelText: 'VOLTAR',
      onConfirm: async () => {
        const name = $('new-group-name').value.trim() || 'NOVO GRUPO';
        const checks = document.querySelectorAll('.group-member-check:checked');
        const members = Array.from(checks).map(c => c.value);
        members.push(myId);

        if (members.length < 2) return;

        const { data: room } = await db.from('chat_rooms').insert({ name, type: 'group' }).select().single();
        if (room) {
          const membersToInsert = members.map(uid => ({ room_id: room.id, user_id: uid }));
          await db.from('chat_room_members').insert(membersToInsert);
          switchRoom(room.id, room.name);
        }
      }
    });
  }

  async function clearGeneralChat() {
    showModal({
      title: 'LIMPEZA DE REGISTROS',
      body: 'DESEJA APAGAR TODAS AS MENSAGENS DO CANAL GERAL? ESTA AÇÃO É IRREVERSÍVEL.',
      type: 'confirm',
      onConfirm: async () => {
        const db = Auth.db();
        await db.from('chat_messages').delete().eq('room_id', '00000000-0000-0000-0000-000000000001');
        loadChatMessages('00000000-0000-0000-0000-000000000001');
        showNotification('LIMPEZA CONCLUÍDA', 'Todos os logs do Canal Omega foram expurgados.', 'success');
      }
    });
  }

  function subscribeEmails() {
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

  /* ══════════════════════════════════════════════════════════
     LOJA O.R.T. (ARMORY)
  ══════════════════════════════════════════════════════════ */
  function shop() {
    return `
      <div style="display:grid; grid-template-rows:auto auto 1fr; height:100%; gap:0;">
        <div class="app-toolbar" style="display:flex; justify-content:space-between; align-items:center;">
          <div style="font-family:var(--font-code); color:var(--amber);">
            MEUS CRÉDITOS: <span id="shop-user-credits" style="color:var(--green);">CR$ ---</span>
          </div>
          <button class="btn" id="btn-shop-refresh">[ ATUALIZAR ESTOQUE ]</button>
        </div>
        <div class="shop-filter-bar" style="padding:10px 20px; background:rgba(0,40,0,0.3); border-bottom:1px solid var(--border-dim); display:flex; flex-wrap:wrap; gap:12px; align-items:center;">
           <div class="login-field shop-search-wrapper" style="flex:1; margin:0;">
              <input type="text" id="shop-search" placeholder="PROCURAR ITEM..." style="padding:6px 10px; font-size:12px; width:100%; box-sizing:border-box;">
           </div>
           <div id="shop-categories" style="display:flex; gap:6px; flex-wrap:wrap;">
              <button class="btn-filter active" data-cat="all">TUDO</button>
              <button class="btn-filter" data-cat="consumable">CONSUMÍVEIS</button>
              <button class="btn-filter" data-cat="armor">ARMADURAS</button>
              <button class="btn-filter" data-cat="Arma Branca">BRANCAS</button>
              <button class="btn-filter" data-cat="Arma de Pequeno Porte">PEQUENAS</button>
              <button class="btn-filter" data-cat="Arma de Médio Porte">MÉDIAS</button>
              <button class="btn-filter" data-cat="Arma de Grande Porte">GRANDES</button>
           </div>
        </div>
        <div id="shop-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:16px; padding:20px; overflow-y:auto;">
          <div class="loading-state">CONECTANDO AO ARMAZÉM<span class="loading-dots"></span></div>
        </div>
      </div>`;
  }

  let shopItemsCache = [];
  let currentShopFilter = 'all';

  function initShop() {
    loadShopItems();
    updateUserCreditsDisplay();
    $('btn-shop-refresh')?.addEventListener('click', loadShopItems);

    // Listeners para Busca e Filtros
    $('shop-search')?.addEventListener('input', renderShopItems);

    document.querySelectorAll('.btn-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentShopFilter = btn.dataset.cat;
        renderShopItems();
      });
    });
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

    const { data } = await db.from('store_items').select('*').eq('is_for_sale', true).order('price', { ascending: true });
    shopItemsCache = data || [];
    renderShopItems();
  }

  function renderShopItems() {
    const grid = $('shop-grid');
    if (!grid) return;

    const searchTerm = ($('shop-search')?.value || '').toLowerCase();

    let filtered = shopItemsCache.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
        (item.description && item.description.toLowerCase().includes(searchTerm));

      let matchesCat = true;
      if (currentShopFilter !== 'all') {
        // Se for "consumable" ou "armor", checa categoria
        if (currentShopFilter === 'consumable' || currentShopFilter === 'armor') {
          matchesCat = item.category === currentShopFilter;
        } else {
          // Se for tipo de arma (Porte), checa o item_type
          matchesCat = item.item_type === currentShopFilter;
        }
      }

      return matchesSearch && matchesCat;
    });

    if (!filtered.length) {
      grid.innerHTML = '<div class="empty-state">NENHUM ITEM ENCONTRADO COM ESTES CRITÉRIOS.</div>';
      return;
    }

    grid.innerHTML = filtered.map(item => `
      <div class="shop-card scan-effect" onclick="Apps.showItemDetails(${JSON.stringify(item).replace(/"/g, '&quot;')})">
        <div class="shop-card-icon">
          ${item.category === 'weapon' ? '🔫' : (item.category === 'armor' ? '🛡️' : '📦')}
        </div>
        <div class="shop-card-title">${item.name}</div>
        <div class="shop-card-desc">${item.description || ''}</div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:5px; gap:10px;">
          <span style="color:var(--amber); font-family:var(--font-code); font-size:14px;">CR$ ${item.price.toLocaleString('pt-BR')}</span>
          <button class="btn" style="font-size:10px; padding:6px 12px; flex-shrink:0;" onclick="event.stopPropagation(); Apps.buyItem('${item.id}', ${item.price})">[ COMPRAR ]</button>
        </div>
      </div>
    `).join('');
  }

  function showItemDetails(item) {
    const m = $('modal-item-details');
    if (!m) return;

    // Mover para o final do body para garantir sobreposição total (stacking context)
    document.body.appendChild(m);

    m.style.zIndex = '1000000';

    const rarity = item.rarity || 'common';

    $('item-detail-icon').textContent = item.category === 'weapon' ? '🔫' : (item.category === 'armor' ? '🛡️' : '📦');
    $('item-detail-name').textContent = item.name;
    $('item-detail-name').className = rarity; // Cor do nome por raridade

    $('item-detail-type').textContent = item.item_type || item.category.toUpperCase();

    // Badge de Raridade
    const rarityBadge = $('item-detail-rarity');
    if (rarityBadge) {
      rarityBadge.textContent = rarity.toUpperCase();
      rarityBadge.className = `rarity-badge ${rarity}`;
    }

    const dmgCont = $('item-detail-damage-cont');
    if (item.damage_dice) {
      dmgCont.style.display = 'block';
      $('item-detail-damage').textContent = item.damage_dice;
    } else {
      dmgCont.style.display = 'none';
    }

    // Descrição e Lore
    let descriptionText = item.description || 'Nenhuma especificação técnica disponível.';
    if (item.content) {
      descriptionText += `<br><br><div style="color:var(--green-mid); font-style:italic; border-top:1px solid var(--border-dim); padding-top:10px;">> DADOS ADICIONAIS:<br>${item.content}</div>`;
    }

    $('item-detail-desc').innerHTML = descriptionText;
    $('item-detail-price').textContent = `PREÇO: CR$ ${item.price.toLocaleString('pt-BR')}`;

    const buyBtn = $('btn-buy-from-detail');
    buyBtn.onclick = () => {
      m.classList.add('hidden');
      m.classList.remove('modal-overlay-active');
      m.style.zIndex = '';
      buyItem(item.id, item.price);
    };

    m.classList.add('modal-overlay-active');
    m.classList.remove('hidden');
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
        // 1. Atualizar Créditos
        const { error: credError } = await db.from('profiles').update({ credits: newCredits }).eq('id', user.id);
        if (credError) {
          showModal({ title: 'FALHA NO MAINFRAME', body: 'ERRO AO PROCESSAR CRÉDITOS: ' + credError.message, type: 'alert' });
          return;
        }

        // 2. Inserir no Inventário
        const { error: invError } = await db.from('inventory').insert({
          user_id: user.id,
          item_id: id,
          is_equipped: false
        });

        if (!invError) {
          showNotification('TRANSAÇÃO CONCLUÍDA', 'EQUIPAMENTO ENVIADO PARA O SEU INVENTÁRIO.', 'success');
          updateUserCreditsDisplay();
          // Se o inventário estiver aberto, recarregar
          if ($('inventory-grid')) loadInventory();
        } else {
          showModal({ title: 'ERRO LOGÍSTICO', body: 'ITEM PAGO, MAS FALHA AO REGISTRAR NO INVENTÁRIO: ' + invError.message, type: 'alert' });
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
    subscribeEmails();
    subscribeChat();
    subscribeStoreItems();
    subscribeVaultUnlocks();
  }

  function subscribeStoreItems() {
    const db = Auth.db();
    if (!db) return;

    db.channel('public:store_items')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'store_items' }, payload => {
        const item = payload.new;
        const rarity = item.rarity || 'common';

        // Notifica todos os agentes sobre o novo item com cor de raridade
        showNotification('NOVO ITEM NO ARMAZÉM', `${item.name} foi adicionado ao estoque.`, rarity);
        Boot.playBeep(880, 0.05, 0.15);

        // Exibe o pop-up de detalhes automaticamente
        showItemDetails(item);

        // Atualiza a loja se estiver aberta
        if (document.getElementById('shop-grid')) loadShopItems();
      })
      .subscribe();
  }

  /* ══════════════════════════════════════════════════════════
     FICHA DO AGENTE (STATS)
  ══════════════════════════════════════════════════════════ */
  function statsPage() {
    return `
      <div class="stats-page-container" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); height:100%; overflow-y:auto; background:rgba(0,20,0,0.3); scrollbar-width: thin;">
        <div style="border-right:1px solid var(--border-dim); border-bottom:1px solid var(--border-dim); padding:20px; display:flex; flex-direction:column; gap:20px; align-items:center;">
          
          <!-- MUGSHOT SYSTEM -->
          <div class="mugshot-container" onclick="Apps.openMugshotUpload()">
             <img id="stats-mugshot-img" class="mugshot-img" alt="Mugshot">
             <div id="stats-mugshot-placeholder" class="mugshot-placeholder">?</div>
             <div class="mugshot-upload-overlay">[ ALTERAR ARTE ]</div>
          </div>

          <div class="body-status-visual scan-effect" style="position:relative; overflow:hidden; border:1px solid var(--border-dim); background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; padding:10px; height:200px; width:200px;">
             <svg viewBox="0 0 100 100" style="width:100%; height:100%; aspect-ratio: 1/1; filter: drop-shadow(0 0 10px var(--green-glow));">
                <defs>
                   <clipPath id="brain-clip">
                      <path d="M50,10 Q85,10 90,45 Q90,85 50,90 Q10,85 10,45 Q15,10 50,10 Z" />
                   </clipPath>
                    <radialGradient id="mist-gradient" cx="50%" cy="50%" r="70%">
                       <stop offset="0%" stop-color="#9d00ff" stop-opacity="0.95" />
                       <stop offset="60%" stop-color="#7a00cc" stop-opacity="0.5" />
                       <stop offset="100%" stop-color="#4b0082" stop-opacity="0" />
                    </radialGradient>
                    <filter id="mist-noise-filter">
                       <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="3" result="noise" />
                       <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
                    </filter>
                </defs>
                <g>
                   <path d="M50,10 Q85,10 90,45 Q90,85 50,90 Q10,85 10,45 Q15,10 50,10 Z" 
                         fill="rgba(0,255,65,0.05)" stroke="rgba(0,255,65,0.2)" stroke-width="1.5" />
                   
                   <!-- Enchimento Líquido (Top-to-Bottom conforme solicitado) -->
                   <rect id="sanity-brain-fill" x="0" y="0" width="100" height="0" fill="var(--green)" opacity="0.5" clip-path="url(#brain-clip)" style="transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);" />
                   
                   <rect id="exposure-mist-rect" x="0" y="0" width="100" height="100" fill="url(#mist-gradient)" clip-path="url(#brain-clip)" style="transition: opacity 1s ease, filter 1.5s ease; pointer-events: none; opacity: 0;" />

                   <path id="brain-contour" d="M50,10 Q85,10 90,45 Q90,85 50,90 Q10,85 10,45 Q15,10 50,10 Z" 
                         fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round">
                      <animate id="brain-pulse-anim" attributeName="stroke-width" values="2;4;2" dur="1.2s" repeatCount="indefinite" />
                   </path>
                   
                   <g stroke="var(--green-dark)" stroke-width="1" fill="none" opacity="0.5">
                      <path d="M50,10 L50,90" stroke-width="1.5" /> 
                      <path d="M25,25 Q35,40 25,60" />
                      <path d="M75,25 Q65,40 75,60" />
                      <path d="M30,75 Q40,70 50,75" />
                      <path d="M70,75 Q60,70 50,75" />
                   </g>
                </g>
             </svg>
          </div>
          <div id="stats-personal-info" style="font-family:var(--font-code); font-size:12px; line-height:1.6; width:100%;">
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

            <!-- NOVO: EQUIPAMENTO ATIVO -->
            <section style="border-top:1px solid var(--border-dim); padding-top:20px;">
               <div class="login-label" style="font-size:12px; margin-bottom:15px;">&gt; EQUIPAMENTO ATIVO (SLOTS)</div>
               <div id="stats-equipped-list" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:10px;">
                  <div class="loading-state">...</div>
               </div>
            </section>
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

    // Atualizar Mugshot / Avatar
    const mugImg = $('stats-mugshot-img');
    const mugPlace = $('stats-mugshot-placeholder');
    if (mugImg && mugPlace) {
      if (profile.avatar_url) {
        mugImg.src = profile.avatar_url;
        mugImg.style.display = 'block';
        mugPlace.style.display = 'none';
      } else {
        mugImg.style.display = 'none';
        mugPlace.style.display = 'block';
      }
    }

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
      // Inversão: Preenchimento de cima para baixo (Top-to-Bottom)
      const h = (100 * pct) / 100;
      brainFill.setAttribute('y', '0');
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
      // Escala 0-100% mapeada para opacidade 0.0 a 1.0
      const opacity = exposure / 100;
      mist.style.opacity = opacity;

      // Filtros dinâmicos: Desfoque + Ruído Fractal
      if (exposure > 10) {
        const blurLevel = Math.max(0, (exposure - 10) / 15);
        // Aplicar o filtro de ruído via SVG e desfoque via CSS
        mist.style.filter = `url(#mist-noise-filter) blur(${blurLevel}px)`;
      } else {
        mist.style.filter = 'none';
      }
    }

    // LISTAR EQUIPADOS (NOVO)
    const equippedCont = $('stats-equipped-list');
    const db = Auth.db();
    if (equippedCont && db) {
      const user = Auth.getUser();
      const { data: equipped } = await db.from('inventory')
        .select('*, store_items(*)').eq('user_id', user.id).eq('is_equipped', true);

      if (equipped?.length) {
        equippedCont.innerHTML = equipped.map(eq => `
             <div class="stat-box" style="text-align:left; border-color:var(--green-mid); background:rgba(0,255,65,0.02);">
                <div class="stat-label" style="font-size:9px; color:var(--green-dim);">${(eq.store_items.item_type || eq.store_items.category).toUpperCase()}</div>
                <div style="font-family:var(--font-code); font-size:13px; color:var(--green); overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">
                   ${eq.store_items.name}
                </div>
                ${eq.store_items.damage_dice ? `<div style="font-size:10px; color:var(--amber); margin-top:2px;">${eq.store_items.damage_dice}</div>` : ''}
             </div>
          `).join('');
      } else {
        equippedCont.innerHTML = '<div style="font-family:var(--font-code); font-size:12px; color:var(--green-dark);">NENHUM EQUIPAMENTO EM USO.</div>';
      }
    }
  }

  function openMugshotUpload() {
    if (!NEXUS_CONFIG.cloudinary.cloudName || NEXUS_CONFIG.cloudinary.cloudName.includes('YOUR_')) {
      showNotification('BLOQUEIO TÉCNICO', 'Cloudinary não configurado corretamente no js/config.js.', 'error');
      return;
    }

    if (typeof cloudinary === 'undefined') {
      showNotification('SISTEMA OFFLINE', 'Widget de upload não detectado.', 'error');
      return;
    }

    const widget = cloudinary.createUploadWidget({
      cloudName: NEXUS_CONFIG.cloudinary.cloudName,
      uploadPreset: NEXUS_CONFIG.cloudinary.uploadPreset,
      sources: ['local', 'url', 'camera'],
      multiple: false,
      cropping: true,
      croppingAspectRatio: 1,
      resourceType: 'image',
      showCompleted: false // Fecha ao invés de mostrar botão Done bloqueado
    }, async (err, result) => {
      if (err) {
        console.error('[CLOUDINARY] Erro no widget:', err);
        showNotification('FALHA DE UPLOAD', 'Erro na conexão com Cloudinary.', 'error');
        return;
      }

      if (result.event === 'success') {
        const url = result.info.secure_url;
        const db = Auth.db();
        if (db) {
          try {
            const { error } = await db.from('profiles').update({ avatar_url: url }).eq('id', Auth.getUser()?.id);
            if (!error) {
              showNotification('MUGSHOT ATUALIZADO', 'Nova foto registrada no Mainframe.', 'success');
              refreshStats(true);
            } else {
              throw error;
            }
          } catch (dbErr) {
            console.error('[DATABASE] Erro ao salvar avatar:', dbErr);
            showNotification('ERRO DE SINCRONIA', 'Upload OK, mas falha ao salvar no banco.', 'alert');
          }
        }
        widget.close();
      }
    });
    widget.open();
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

    _inventoryItems = items; // Cache local robusto

    const profile = await Auth.getProfile();
    const maxCapacity = (profile?.str || 1) * 2;
    if ($('inv-capacity')) $('inv-capacity').textContent = `${items.length} / ${maxCapacity} UNIDADES`;

    if (!items?.length) {
      grid.innerHTML = '<div class="empty-state">INVENTÁRIO VAZIO.</div>';
      return;
    }

    const categories = {
      weapon_large: { title: 'ARMAS DE GRANDE PORTE', items: [] },
      weapon_medium: { title: 'ARMAS DE MÉDIO PORTE', items: [] },
      weapon_small: { title: 'ARMAS DE PEQUENO PORTE', items: [] },
      weapon_melee: { title: 'ARMAS BRANCAS', items: [] },
      armor: { title: 'PROTEÇÃO & TRAJES', items: [] },
      consumable: { title: 'MANUTENÇÃO & SUPORTE', items: [] },
      other: { title: 'DADOS & UTILITÁRIOS', items: [] }
    };

    items.forEach((inv, index) => {
      const item = inv.store_items;
      const cat = item.category;
      const type = (item.item_type || '').toLowerCase();
      inv._idx = index;

      if (cat === 'weapon') {
        if (type.includes('grande')) categories.weapon_large.items.push(inv);
        else if (type.includes('médio') || type.includes('medio')) categories.weapon_medium.items.push(inv);
        else if (type.includes('pequeno')) categories.weapon_small.items.push(inv);
        else if (type.includes('branca') || type.includes('faca') || type.includes('espada') || type.includes('bastão')) categories.weapon_melee.items.push(inv);
        else categories.weapon_small.items.push(inv); // Default for unknown weapons
      } else if (categories[cat]) {
        categories[cat].items.push(inv);
      } else {
        categories['other'].items.push(inv);
      }
    });

    grid.style.display = 'block';
    grid.innerHTML = Object.entries(categories).map(([key, cat]) => {
      if (cat.items.length === 0) return '';
      return `
        <div class="inventory-section">
          <div class="inventory-section-title">> ${cat.title} <span>(${cat.items.length})</span></div>
          <div class="inventory-grid">
            ${cat.items.map(inv => {
        const item = inv.store_items;
        return `
                <div class="inventory-card ${inv.is_equipped ? 'equipped' : ''} scan-effect" 
                     onclick="Apps.handleItemClick(event, ${inv._idx})">
                  <div class="inventory-card-header">
                    <div class="chip chip-sm ${item.rarity || 'common'}">${(item.rarity || 'COMUM').toUpperCase()}</div>
                    ${inv.is_equipped ? '<span class="equip-indicator">[ EQUIPADO ]</span>' : ''}
                  </div>
                  <div style="font-family:var(--font-logo); font-size:13px; color:var(--green); margin-bottom:5px;">${item.name}</div>
                  <div style="font-family:var(--font-code); font-size:11px; color:var(--green-mid); height:30px; overflow:hidden;">${item.description || ''}</div>
                  <div style="border-top:1px dashed var(--border-dim); margin-top:8px; padding-top:8px; display:flex; justify-content:space-between; align-items:center;">
                     <span style="font-size:10px; color:var(--green-dark);">${(item.item_type || item.category).toUpperCase()}</span>
                     <span style="font-size:10px; color:var(--amber);">${item.damage_dice || ''}</span>
                  </div>
                </div>
              `;
      }).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  function parseDice(notation) {
    if (!notation) return 0;
    const match = notation.match(/^(\d+)d(\d+)(?:\s*([+-])\s*(\d+))?$/i);
    if (!match) return 0;

    const qty = parseInt(match[1]);
    const sides = parseInt(match[2]);
    const op = match[3];
    const mod = parseInt(match[4] || 0);

    let total = 0;
    for (let i = 0; i < qty; i++) {
      total += Math.floor(Math.random() * sides) + 1;
    }

    if (op === '+') total += mod;
    if (op === '-') total -= mod;

    return Math.max(1, total);
  }

  async function useItem(inventoryId, localIndex) {
    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;

    const inv = _inventoryItems[localIndex];
    if (!inv) return;
    const item = inv.store_items;

    // 1. Calcular Recuperação
    const dice = item.damage_dice || '1d4';
    const amount = parseDice(dice);
    const type = item.technical_meta?.recovery_type || 'hp'; // hp ou sp

    // 2. Animação de Uso
    const overlay = $('item-usage-overlay');
    const display = $('recovery-value-display');
    if (overlay && display) {
      document.body.appendChild(overlay); // Garantir topo do stacking context
      overlay.style.zIndex = '10000000';
      display.innerHTML = `<div class="recovery-value">+${amount} ${type.toUpperCase()}</div>`;
      overlay.classList.add('active');
      Boot.playBeep(880, 0.1, 0.2); // Som de cura

      setTimeout(() => {
        overlay.classList.remove('active');
        display.innerHTML = '';
      }, 2000);
    }

    // 3. Atualizar Banco (Vitais)
    const { data: profile } = await db.from('profiles').select('*').eq('id', user.id).single();
    if (profile) {
      const field = type === 'hp' ? 'hp_current' : 'sp_current';
      const maxField = type === 'hp' ? 'hp_max' : 'sp_max';
      const newVal = Math.min(profile[maxField], (profile[field] || 0) + amount);

      await db.from('profiles').update({ [field]: newVal }).eq('id', user.id);
      refreshStats();
    }

    // 4. Consumir Item (Remover do Inventário)
    await db.from('inventory').delete().eq('id', inventoryId);
    loadInventory();
    showNotification('ITEM CONSUMIDO', `${item.name.toUpperCase()} UTILIZADO COM SUCESSO.`, 'success');
  }

  async function toggleEquip(inventoryId, currentlyEquipped, itemCategory, itemType) {
    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;

    if (!currentlyEquipped) {
      // Regra de Slots: 1 Armadura, 1 Arma Grande, 1 Arma Pequena
      let slotType = null;
      if (itemCategory === 'armor') slotType = 'armor';
      else if (itemCategory === 'weapon') {
        const type = (itemType || '').toLowerCase();
        if (type.includes('grande')) slotType = 'weapon_large';
        else slotType = 'weapon_small'; // Pequeno, Médio, Branca
      }

      if (slotType) {
        // Desequipar o que já estiver no slot (comparando pela categoria/subtipo no banco)
        const { data: equippedItems } = await db.from('inventory')
          .select('*, store_items(*)')
          .eq('user_id', user.id)
          .eq('is_equipped', true);

        for (const eq of equippedItems) {
          const eqCat = eq.store_items.category;
          const eqType = eq.store_items.item_type;

          let eqSlot = null;
          if (eqCat === 'armor') eqSlot = 'armor';
          else if (eqCat === 'weapon') {
            const type = (eqType || '').toLowerCase();
            if (type.includes('grande')) eqSlot = 'weapon_large';
            else eqSlot = 'weapon_small';
          }

          if (eqSlot === slotType) {
            await db.from('inventory').update({ is_equipped: false }).eq('id', eq.id);
          }
        }
      }
    }

    const { error } = await db.from('inventory').update({ is_equipped: !currentlyEquipped }).eq('id', inventoryId);
    if (!error) {
      // Recalcular RD se for armadura
      if (itemCategory === 'armor') {
        const { data: allEquipped } = await db.from('inventory')
          .select('*, store_items(*)').eq('user_id', user.id).eq('is_equipped', true);

        let totalRD = 0;
        allEquipped.forEach(e => {
          if (e.store_items.category === 'armor') {
            // Extrair RD do content ou metadata (exemplo: "RD 2")
            const rdMatch = e.store_items.content?.match(/RD\s*(\d+)/i) ||
              e.store_items.description?.match(/RD\s*(\d+)/i);
            if (rdMatch) totalRD += parseInt(rdMatch[1]);
          }
        });
        await db.from('profiles').update({ rd: totalRD }).eq('id', user.id);
      }

      loadInventory();
      refreshStats();
    }
  }

  function handleItemClick(e, localIndex) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const menu = $('nexus-context-menu');
    if (!menu) return;

    // Mover para o final do body para garantir que fique acima de qualquer app-overlay dinâmica
    document.body.appendChild(menu);

    const inv = _inventoryItems[localIndex];
    if (!inv) return;

    console.log('[APPS] Menu solicitado para item:', inv.store_items.name);

    const item = inv.store_items;
    const invId = inv.id;
    const isEquipped = inv.is_equipped;

    let options = '';

    const closeSelf = "document.getElementById('nexus-context-menu').style.display='none';";

    if (item.category === 'weapon' || item.category === 'armor') {
      options += `<div class="context-menu-item" onclick="${closeSelf} Apps.toggleEquip('${invId}', ${isEquipped}, '${item.category}', '${item.item_type || ''}')">
                    ${isEquipped ? '[ DESEQUIPAR ]' : '[ EQUIPAR ]'}
                  </div>`;
    } else if (item.category === 'consumable') {
      options += `<div class="context-menu-item" onclick="${closeSelf} Apps.useItem('${invId}', ${localIndex})">[ USAR ]</div>`;
    } else if (item.category === 'document') {
      options += `<div class="context-menu-item" onclick="${closeSelf} Apps.openLightbox('${item.name.replace(/'/g, "\\'")}', '${(item.content || '').replace(/'/g, "\\'")}')">[ LER ]</div>`;
    }

    options += `<div class="context-menu-sep"></div>`;
    options += `<div class="context-menu-item" style="color:var(--red-alert)" onclick="${closeSelf} Apps.dropItem('${invId}')">[ DESCARTAR ]</div>`;

    menu.innerHTML = options;
    menu.style.display = 'flex';
    menu.style.left = (e.clientX || 0) + 'px';
    menu.style.top = (e.clientY || 0) + 'px';
    menu.style.zIndex = '10000000'; // Prioridade máxima absoluta

    // Fechar ao clicar fora ou ao escolher uma opção
    const closeMenu = (ev) => {
      if (!menu.contains(ev.target)) {
        menu.style.display = 'none';
        document.removeEventListener('mousedown', closeMenu);
      }
    };

    // Pequeno delay para não fechar no próprio clique de abertura
    setTimeout(() => {
      document.addEventListener('mousedown', closeMenu);
    }, 50);
  }

  async function dropItem(invId) {
    showModal({
      title: 'CONFIRMAR DESCARTE',
      body: 'ESTE ITEM SERÁ REMOVIDO PERMANENTEMENTE DO SEU INVENTÁRIO. PROSSEGUIR?',
      type: 'confirm',
      onConfirm: async () => {
        const db = Auth.db();
        if (db) {
          await db.from('inventory').delete().eq('id', invId);
          loadInventory();
          showNotification('ITEM DESCARTADO', 'REGISTRO REMOVIDO DO INVENTÁRIO.', 'success');
        }
      }
    });
  }


  return {
    render, init,
    openLightbox, editArtwork, deleteArtwork, openEmail, deleteEmail,
    updateMissionStatus, deleteMission, openBriefing,
    changeUserRole, deleteUser,
    showNotification, initGlobalRealtime,
    showModal, buyItem, showItemDetails,
    initInventory, initStats, initMap, openMugshotUpload,
    deleteItem, selectCombatTarget, toggleEquip, handleItemClick, useItem, dropItem,
    saveCombatBio, saveCombatVitals, saveCombatMental, saveCombatAttrs, modVital, modSanity, giveLoot,
    deleteVaultItem, openPadlock, closePadlock, submitPadlock, _padlockType, _padlockBackspace,
    openNewDM, openNewGroup, createDM, switchRoom, clearGeneralChat, toggleChatSidebar
  };

})();
