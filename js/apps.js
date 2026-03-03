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
    shipApp: { icon: '🚀', title: 'MINHA NAVE', path: 'O.R.T. > SEC > SHIP' },
    hangarApp: { icon: '🛠️', title: 'GARAGEM O.R.T. (HANGAR)', path: 'O.R.T. > SEC > HANGAR' },
    travelApp: { icon: '🛰️', title: 'MINHA VIAGEM', path: 'O.R.T. > OPS > TRAVEL' },
    nexusBank: { icon: '🏦', title: 'NEXUS BANK', path: 'O.R.T. > FINANCE > BANK' },
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
      const renders = { gallery, videos, missions, emails, chat, shop, map: mapRender, notepad, vault, calendar, terminal, combat, admin, stats: statsPage, inventory: inventoryPage, shipApp, hangarApp, travelApp, nexusBank };
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
      stats: initStats, inventory: initInventory, shipApp: initShipApp, hangarApp: initHangarApp, travelApp: initTravelApp, nexusBank: initNexusBank
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
      showModal({ title: 'SISTEMA', body: 'Cloudinary widget não carregado. Verifique a conexão.' });
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
  function initShipApp() { loadShipData(); }

  async function openCargoTransfer() {
    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;

    // Load inventory and ship cargo
    const { data: inv } = await db.from('inventory').select('*, store_items(*)').eq('user_id', user.id);
    const { data: ships } = await db.from('ships').select('*').eq('owner_id', user.id);
    const ship = ships?.[0];
    if (!ship) return;

    let overlay = $('cargo-transfer-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'app-overlay modal-overlay-active';
      overlay.id = 'cargo-transfer-overlay';
      document.body.appendChild(overlay);
    }

    const renderItemCard = (i, isShip, index) => `
      <div class="transfer-card" data-id="${isShip ? index : i.id}" data-type="${isShip ? 'cargo' : 'inv'}" onclick="Apps.toggleTransferSelect(this)">
        <div class="card-sel-indicator"></div>
        <div class="card-icon">${i.store_items?.icon || i.icon || '📦'}</div>
        <div class="card-info">
          <div class="card-name">${(i.store_items?.name || i.name || 'ITEM').toUpperCase()}</div>
          <div class="card-qty">QTD: ${i.qty || 1}</div>
        </div>
      </div>
    `;

    overlay.innerHTML = `
      <div class="modal-box ship-transfer-modal" style="width:850px; max-width:95vw;">
        <div class="modal-header">> SISTEMA DE TRANSFERÊNCIA DE CARGA — ${ship.name.toUpperCase()}</div>
        <div class="modal-body" style="display:grid; grid-template-columns:1fr 1fr; gap:20px; height:450px;">
          <div class="transfer-column">
            <div class="column-header">
              <h4 class="stat-label">MEU INVENTÁRIO</h4>
              <button class="btn btn-mini" onclick="Apps.selectAllTransfer('inv')">[ TODOS ]</button>
            </div>
            <div id="transfer-inv-grid" class="transfer-grid">
               ${(inv || []).map(i => renderItemCard(i, false)).join('') || '<div class="empty-state">INVENTÁRIO VAZIO</div>'}
            </div>
            <div class="column-footer">
              <button class="btn btn-batch" onclick="Apps.batchTransfer('toShip', '${ship.id}')">[ TRANSFERIR PARA NAVE >> ]</button>
            </div>
          </div>
          <div class="transfer-column">
            <div class="column-header">
              <h4 class="stat-label">CARGO DA NAVE</h4>
              <button class="btn btn-mini" onclick="Apps.selectAllTransfer('cargo')">[ TODOS ]</button>
            </div>
            <div id="transfer-ship-grid" class="transfer-grid">
               ${(ship.cargo || []).map((i, idx) => renderItemCard(i, true, idx)).join('') || '<div class="empty-state">CARGO VAZIO</div>'}
            </div>
            <div class="column-footer">
              <button class="btn btn-batch" onclick="Apps.batchTransfer('toAgent', '${ship.id}')">[ << TRANSFERIR PARA AGENTE ]</button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn" onclick="$('cargo-transfer-overlay').remove(); Apps.loadShipData();">[ CONCLUIR PROTOCOLO ]</button>
        </div>
      </div>
      <style>
        .ship-transfer-modal { background: rgba(0,20,0,0.95); border: 2px solid var(--green); }
        .transfer-column { display:flex; flex-direction:column; gap:10px; height:100\%; overflow: hidden; }
        .column-header { display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-dim); padding-bottom:10px; flex-shrink: 0; }
        .transfer-grid { 
          flex:1; 
          overflow-y:auto; 
          display:grid; 
          grid-template-columns: 1fr 1fr; 
          grid-auto-rows: min-content;
          gap:10px; 
          padding:10px; 
          background:rgba(0,0,0,0.3); 
          border:1px solid var(--border-dim); 
        }
        .transfer-card { 
          position:relative; background:rgba(0,255,65,0.03); border:1px solid var(--border-dim); padding:10px; cursor:pointer; 
          display:flex; flex-direction:column; align-items:center; text-align:center; transition:all 0.2s ease;
          min-height: 100px;
        }
        .transfer-card:hover { border-color:var(--green); background:rgba(0,255,65,0.08); }
        .transfer-card.selected { border-color:var(--amber); background:rgba(215,153,33,0.15); box-shadow:inset 0 0 10px rgba(215,153,33,0.2); }
        .card-sel-indicator { position:absolute; top:5px; right:5px; width:10px; height:10px; border:1px solid var(--border-dim); border-radius:2px; }
        .transfer-card.selected .card-sel-indicator { background:var(--amber); border-color:var(--amber); box-shadow:0 0 5px var(--amber); }
        .card-icon { font-size:24px; margin-bottom:5px; }
        .card-name { font-family:var(--font-code); font-size:11px; color:var(--green); line-height:1.2; height:2.4em; overflow:hidden; }
        .card-qty { font-size:9px; color:var(--green-dark); margin-top:5px; }
        .btn-mini { font-size:9px; padding:2px 6px; }
        .btn-batch { width:100%; border-color:var(--green-mid); color:var(--green-mid); font-size:11px; }
        .column-footer { padding-top:10px; flex-shrink: 0; }
      </style>
    `;
  }

  function toggleTransferSelect(el) {
    el.classList.toggle('selected');
    Boot.playBeep(880, 0.02, 0.05);
  }

  function selectAllTransfer(type) {
    const selector = type === 'inv' ? '#transfer-inv-grid .transfer-card' : '#transfer-ship-grid .transfer-card';
    const cards = document.querySelectorAll(selector);
    const allSelected = Array.from(cards).every(c => c.classList.contains('selected'));
    cards.forEach(c => c.classList.toggle('selected', !allSelected));
    Boot.playBeep(660, 0.04, 0.08);
  }

  async function batchTransfer(direction, shipId) {
    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;

    const selector = direction === 'toShip' ? '#transfer-inv-grid .transfer-card.selected' : '#transfer-ship-grid .transfer-card.selected';
    const selected = Array.from(document.querySelectorAll(selector));

    if (selected.length === 0) {
      showNotification('SISTEMA', 'NENHUM ITEM SELECIONADO.', 'alert');
      return;
    }

    const ids = selected.map(c => c.dataset.id);

    if (direction === 'toShip') {
      const { data: items } = await db.from('inventory').select('*, store_items(name, icon)').in('id', ids);
      const { data: ship } = await db.from('ships').select('cargo').eq('id', shipId).single();

      const newCargo = [...(ship.cargo || [])];
      for (const invItem of items) {
        newCargo.push({
          name: invItem.store_items.name,
          item_id: invItem.item_id,
          icon: invItem.store_items.icon || '📦'
        });
      }

      await db.from('ships').update({ cargo: newCargo }).eq('id', shipId);
      await db.from('inventory').delete().in('id', ids);
      showNotification('TRANSFERÊNCIA', `${items.length} ITENS MOVIDOS PARA A NAVE.`, 'success');
      loadShipData(); // Refresh background UI
    } else {
      const { data: ship } = await db.from('ships').select('cargo').eq('id', shipId).single();
      const cargo = [...(ship.cargo || [])];

      // We sort indexes descending to avoid splicing issues
      const sortedIdxs = ids.map(id => parseInt(id)).sort((a, b) => b - a);
      const toAgent = [];

      for (const idx of sortedIdxs) {
        const item = cargo.splice(idx, 1)[0];
        toAgent.push({ user_id: user.id, item_id: item.item_id });
      }

      await db.from('ships').update({ cargo }).eq('id', shipId);
      await db.from('inventory').insert(toAgent);
      showNotification('TRANSFERÊNCIA', `${toAgent.length} ITENS MOVIDOS PARA O AGENTE.`, 'success');
      loadShipData(); // Refresh background UI
    }

    openCargoTransfer(); // Refresh same view
  }

  async function prepShipTravel(mode) {
    const db = Auth.db();
    const { data: ships } = await db.from('ships').select('*').eq('owner_id', Auth.getUser().id);
    const ship = ships?.[0];
    if (!ship) return;

    if (ship.fuel < 20) {
      showModal({ title: 'COMBUSTÍVEL BAIXO', body: 'REABASTEÇA NA LOJA PARA INICIAR A VIAGEM.', type: 'alert' });
      return;
    }

    if (mode === 'mission') {
      // Logic to pick from accepted missions
      const { data: missions } = await db.from('mission_assignments')
        .select('*, missions(*)')
        .eq('user_id', Auth.getUser().id)
        .eq('status', 'accepted');

      if (!missions?.length) {
        showModal({ title: 'SISTEMA', body: 'NENHUMA MISSÃO ATIVA PARA VINCULAR VIAGEM.', type: 'alert' });
        return;
      }
      // Generate code and start Voyage
      const mission = missions[0].missions;
      const ticket = 'SHIP-' + ship.license_plate + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

      const parts = mission.route.split(' -> ');
      let path = [];
      if (window.MapApp) path = MapApp.calculateGalacticRoute(parts[0], parts[1]).map(p => p.id);

      await db.from('travel_registrations').insert({
        mission_id: mission.id,
        user_id: Auth.getUser().id,
        ship_id: ship.id,
        ticket_code: ticket,
        status: 'waiting',
        type: 'private',
        current_planet: parts[0],
        target_planet: parts[1],
        path: path
      });

      Desktop.openApp('travelApp');
      setTimeout(() => {
        if ($('travel-id-input')) $('travel-id-input').value = ticket;
        joinTravelLobby();
      }, 500);

    } else {
      window._mapSelectMode = true;
      Desktop.openApp('map');
      showNotification('SISTEMA DE NAVEGAÇÃO', 'SELECIONE O PLANETA DE DESTINO NO MAPA.', 'info');
    }
  }

  async function setCustomVoyageDestination(planetId) {
    window._mapSelectMode = false;
    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;
    const { data: ships } = await db.from('ships').select('*').eq('owner_id', user.id);
    const ship = ships?.[0];
    if (!ship) return;

    // Detect current planet: Profile is the source of truth for agent location
    const { data: profile } = await db.from('profiles').select('current_planet').eq('id', user.id).single();
    let currentPlanet = profile?.current_planet || ship.current_location || 'capitolio';

    if (currentPlanet === 'capitolio' && !profile?.current_planet) {
      // Fallback only if profile is empty
      const { data: lastTravel } = await db.from('travel_registrations')
        .select('target_planet')
        .eq('user_id', user.id)
        .eq('status', 'finished')
        .order('created_at', { ascending: false })
        .limit(1);
      if (lastTravel?.[0]?.target_planet) currentPlanet = lastTravel[0].target_planet;
    }

    const target = GALAXY_DB.find(p => p.id === planetId || p.name === planetId);
    if (!target) return;

    const ticket = 'SHIP-' + ship.license_plate + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    let path = [];
    if (window.MapApp && MapApp.calculateGalacticRoute) {
      const route = MapApp.calculateGalacticRoute(currentPlanet, target.id);
      if (route && route.length > 0) path = route.map(p => p.id);
    }

    // Debug log to trace path creation
    console.log("[TRAVEL] Calculated path for ticket:", path);

    // Fallback log
    if (!path || path.length === 0) console.warn("[TRAVEL] Could not find route from Capitolio to", target.id);
    await db.from('travel_registrations').insert({
      user_id: user.id,
      ship_id: ship.id,
      ticket_code: ticket,
      status: 'waiting',
      type: 'private',
      current_planet: currentPlanet,
      target_planet: target.id,
      path: path
    });

    Desktop.openApp('travelApp');
    setTimeout(() => {
      if ($('travel-id-input')) $('travel-id-input').value = ticket;
      joinTravelLobby();
    }, 500);
  }

  async function joinTravelLobby() {
    const input = $('travel-id-input');
    const id = input?.value?.trim();
    if (!id) return;

    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;

    // Handle Commercial Flights (COM-)
    if (id.startsWith('COM-')) {
      const baseCode = id.split('-').slice(0, 2).join('-');
      const { data: comFlight } = await db.from('commercial_flights').select('*').eq('ticket_code', baseCode).maybeSingle();
      if (!comFlight) return showNotification('ERRO', 'Voo comercial não encontrado ou código inválido.', 'error');

      const { data: existingReg } = await db.from('travel_registrations').select('id').eq('ticket_code', id).eq('user_id', user.id).maybeSingle();

      if (!existingReg) {
        const profile = Auth.getProfile();
        await db.from('travel_registrations').insert({
          user_id: user.id,
          ship_id: profile?.active_ship_id || null, // passengers might not have a ship rigged
          ticket_code: id,
          status: 'ready',
          type: 'commercial',
          current_planet: comFlight.origin,
          target_planet: comFlight.destination,
          path: []
        });
      } else {
        await db.from('travel_registrations').update({ status: 'ready' }).eq('id', existingReg.id);
      }
    } else {
      // Normal private or mission flights logic
      await db.from('travel_registrations').update({ status: 'ready' }).eq('ticket_code', id);
    }

    // Detect voyage type and get mission_id to group lobby
    const { data: reg } = await db.from('travel_registrations').select('type, mission_id').eq('ticket_code', id).eq('user_id', user.id).maybeSingle();

    $('travel-lobby').classList.add('hidden');
    $('active-lobby-view').classList.remove('hidden');

    // Subscribe using mission_id if available, otherwise just use the ticket_code (for private flights)
    const lobbyId = reg?.type === 'commercial' ? id.split('-').slice(0, 2).join('-') : (reg?.mission_id ? `mission_${reg.mission_id}` : id);
    subscribeTravelLobby(lobbyId, reg?.type === 'commercial' ? null : reg?.mission_id, reg?.type);

    $('btn-start-travel').onclick = () => startVoyage(id, reg?.type === 'commercial' ? null : reg?.mission_id);
    const overlay = $('travel-animation-overlay');
    if (overlay && reg) {
      overlay.style.zIndex = reg.type === 'private' ? '6500' : '10001';
    }
  }

  async function startVoyage(ticketCode, missionId, isAutoLeap = false) {
    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;

    const overlay = $('travel-animation-overlay');
    if (!overlay) return;

    window._isVoyageActive = true;
    const closeBtn = document.querySelector('#overlay-travelApp .btn-close-window');
    if (closeBtn) closeBtn.style.display = 'none';

    overlay.classList.remove('hidden');

    // Get the travel registration regardless of who created it
    const { data: registration, error: regError } = await db.from('travel_registrations')
      .select('*, ships(*)')
      .eq('ticket_code', ticketCode)
      .maybeSingle();

    if (regError || !registration) {
      showModal({ title: 'SISTEMA DE NAVEGAÇÃO', body: 'ERRO AO SINCRONIZAR COORDENADAS DE VIAGEM. REGISTRO NÃO ENCONTRADO.', type: 'alert' });
      overlay.classList.add('hidden');
      return;
    }

    // UPDATE STATUS TO ACTIVE (This triggers auto-transport for others via Realtime)
    // For missions, anyone in the lobby can start the voyage once everyone is ready
    if (registration.status === 'waiting' || registration.status === 'ready') {
      if (registration.type === 'commercial') {
        const baseCode = ticketCode.split('-').slice(0, 2).join('-');
        await db.from('commercial_flights').update({ status: 'active' }).eq('ticket_code', baseCode);
        await db.from('travel_registrations').update({ status: 'active' }).like('ticket_code', `${baseCode}-%`);
        const lobbyChannelName = 'public:travel_registrations:' + baseCode;
        const channel = db.channel(lobbyChannelName);
        channel.send({ type: 'broadcast', event: 'jump_start', payload: { ticket: ticketCode, mission: null } });
      } else if (missionId) {
        // Activate ALL tickets associated with this mission
        await db.from('travel_registrations').update({ status: 'active' }).eq('mission_id', missionId);
        // Force broadcast leap for mission peers
        const lobbyChannelName = 'public:travel_registrations:mission_' + missionId;
        const channel = db.channel(lobbyChannelName);
        channel.send({ type: 'broadcast', event: 'jump_start', payload: { ticket: ticketCode, mission: missionId } });
      } else if (registration.user_id === user.id) {
        // Private travel, only the owner can start
        await db.from('travel_registrations').update({ status: 'active' }).eq('ticket_code', ticketCode);
        const lobbyChannelName = 'public:travel_registrations:' + ticketCode;
        const channel = db.channel(lobbyChannelName);
        channel.send({ type: 'broadcast', event: 'jump_start', payload: { ticket: ticketCode, mission: null } });
      }
    }

    const isPrivate = registration.type === 'private';
    const isPilot = registration.user_id === user.id;
    const ship = registration.ships;

    // Hide controls if not the pilot
    if (!isPilot) {
      if ($('btn-abort-voyage')) $('btn-abort-voyage').style.display = 'none';
      if ($('btn-next-jump')) $('btn-next-jump').style.display = 'none';
      if ($('btn-roll-scanners')) $('btn-roll-scanners').style.display = 'none';
      if ($('btn-travel-refuel')) $('btn-travel-refuel').style.display = 'none';
      if ($('btn-finish-voyage')) $('btn-finish-voyage').style.display = 'none';
    }

    const log = $('travel-event-log');
    const markerGroup = $('travel-ship-marker-group');
    const vizContainer = $('travel-viz-container');
    const pathLayer = $('travel-path-layer');
    const bgLayer = $('travel-bg-layer');
    const hudPlanet = $('hud-planet-name');
    const hudSpeed = $('hud-speed');
    const hudFuelText = $('hud-fuel');
    const hudFuelBar = $('hud-fuel-bar');
    const hudIntegText = $('hud-integrity');
    const hudIntegBar = $('hud-integrity-bar');
    const hudCrewList = $('hud-crew-list');

    // Fetch Crew for HUD
    let crewNames = [];
    if (isPrivate && ship) {
      const { data: passengers } = await db.from('ship_passengers').select('*, profiles(display_name, username)').eq('ship_id', ship.id);
      if (passengers) {
        crewNames = passengers.map(p => (p.npc_name || p.profiles?.display_name || p.profiles?.username || 'AGENTE').toUpperCase());
      }
    }
    // Add Pilot to names
    const pilotName = (Auth.getProfile()?.display_name || Auth.getProfile()?.username || 'PILOTO').toUpperCase();
    if (hudCrewList) {
      hudCrewList.innerHTML = `TRI: [ ${pilotName}${crewNames.length ? ' | ' + crewNames.join(' | ') : ''} ]`;
    }
    const nextJumpBtn = $('btn-next-jump');
    const rollScanBtn = $('btn-roll-scanners');
    const refuelBtn = $('btn-travel-refuel');
    const abortBtn = $('btn-abort-voyage');
    const finishBtn = $('btn-finish-voyage');

    let pathIds = registration.path || [];
    const galaxy = window.GALAXY_DB || (typeof GALAXY_DB !== 'undefined' ? GALAXY_DB : []);

    if (!galaxy || galaxy.length === 0) {
      console.error("[TRAVEL] CRITICAL: GALAXY_DB NOT FOUND!");
      if (log) log.innerHTML = `<span style="color:var(--red-alert)">> ERRO CRÍTICO: BANCO DE DADOS GALÁCTICO NÃO ENCONTRADO.<br>> REINICIANDO TERMINAL...</span>`;
      setTimeout(() => overlay.classList.add('hidden'), 3000);
      return;
    }

    // Try to recalculate if empty
    if (!pathIds.length && registration.current_planet && registration.target_planet) {
      if (window.MapApp && MapApp.calculateGalacticRoute) {
        const fallback = MapApp.calculateGalacticRoute(registration.current_planet, registration.target_planet);
        if (fallback && fallback.length) pathIds = fallback.map(p => p.id);
      }
      if (!pathIds.length) pathIds = [registration.current_planet, registration.target_planet];
    }

    const pathPlanets = pathIds.map(id => galaxy.find(p => p.id === id || p.name.toLowerCase() === id.toString().toLowerCase())).filter(p => p);
    if (!pathPlanets.length) {
      if (log) log.innerHTML = `<span style="color:var(--red-alert)">> ERRO: ROTA INVÁLIDA OU PLANETAS NÃO ENCONTRADOS.</span>`;
      setTimeout(() => overlay.classList.add('hidden'), 5000);
      return;
    }

    // Render BG and Path
    const REGION_COLORS = { core: '#00ccff', mid: '#00ff41', rim: '#ffaa00', vale: '#ff0055', unknown: '#888' };
    if (bgLayer) {
      bgLayer.innerHTML = galaxy.map(p => {
        const rad = (p.pos.a * Math.PI) / 180;
        return `<circle cx="${300 + p.pos.r * Math.cos(rad)}" cy="${300 + p.pos.r * Math.sin(rad)}" r="2" fill="${REGION_COLORS[p.rk] || REGION_COLORS.unknown}" opacity="0.3" />`;
      }).join('');
    }
    if (pathLayer && pathPlanets.length >= 2) {
      const points = pathPlanets.map(p => {
        const rad = (p.pos.a * Math.PI) / 180;
        return `${300 + p.pos.r * Math.cos(rad)},${300 + p.pos.r * Math.sin(rad)}`;
      }).join(' ');
      pathLayer.innerHTML = `<polyline points="${points}" fill="none" stroke="var(--green)" stroke-width="2" stroke-dasharray="5,5" opacity="0.6" style="filter:drop-shadow(0 0 5px var(--green));" />`;
    }

    if (log) log.innerHTML = `> PROTOCOLO DE SALTO INICIADO<br>> DESTINO: ${registration.target_planet.toUpperCase()}`;

    const updateCam = (planet, lookAtPlanet, instant, mode = 'both') => {
      const rad = (planet.pos.a * Math.PI) / 180;
      const x = 300 + planet.pos.r * Math.cos(rad);
      const y = 300 + planet.pos.r * Math.sin(rad);
      const cameraG = $('travel-camera-g');
      if (markerGroup) {
        if (instant) {
          markerGroup.style.transition = 'none';
          if (cameraG) cameraG.style.transition = 'none';
        } else {
          markerGroup.style.transition = `transform ${mode === 'rotate' ? '1.2s' : '3.8s'} cubic-bezier(0.4, 0, 0.2, 1)`;
          if (cameraG) cameraG.style.transition = `transform ${mode === 'rotate' ? '1.5s' : '5.5s'} cubic-bezier(0.22, 1, 0.36, 1)`;
        }
        let angleStr = "";
        if (lookAtPlanet) {
          const tRad = (lookAtPlanet.pos.a * Math.PI) / 180;
          const tX = 300 + lookAtPlanet.pos.r * Math.cos(tRad);
          const tY = 300 + lookAtPlanet.pos.r * Math.sin(tRad);
          angleStr = ` rotate(${Math.atan2(tY - y, tX - x) * 180 / Math.PI + 90}deg)`;
        }
        if (mode === 'rotate') {
          const m = markerGroup.style.transform.match(/translate\(([^)]+)\)/);
          markerGroup.style.transform = `${m ? m[0] : `translate(${x}px, ${y}px)`}${angleStr}`;
        } else if (mode === 'move') {
          const m = markerGroup.style.transform.match(/rotate\(([^)]+)\)/);
          markerGroup.style.transform = `translate(${x}px, ${y}px) ${m ? m[0] : ""}`;
        } else {
          markerGroup.style.transform = `translate(${x}px, ${y}px)${angleStr}`;
        }
        if (cameraG && (mode === 'move' || mode === 'both' || instant)) {
          cameraG.style.transform = `translate(300px, 300px) scale(2.5) translate(${-x}px, ${-y}px)`;
        }
      }
      if (hudPlanet) hudPlanet.textContent = planet.name.toUpperCase();
    };

    // Initial HUD State
    let currentFuel = isPrivate ? (ship?.fuel || 100) : 100;
    let currentInteg = isPrivate ? (ship?.integrity || 100) : 100;

    const refreshHUD = () => {
      if (hudFuelText) hudFuelText.textContent = Math.max(0, currentFuel).toFixed(0) + '%';
      if (hudFuelBar) hudFuelBar.style.width = Math.max(0, currentFuel) + '%';
      if (hudIntegText) hudIntegText.textContent = Math.max(0, currentInteg).toFixed(0) + '%';
      if (hudIntegBar) hudIntegBar.style.width = Math.max(0, currentInteg) + '%';
    };

    // Expose stats to window for real-time sync with handleRefuel
    window._activeVoyageStats = {
      get fuel() { return currentFuel; },
      set fuel(v) { currentFuel = v; refreshHUD(); },
      get integrity() { return currentInteg; },
      set integrity(v) { currentInteg = v; refreshHUD(); },
      refreshHUD: refreshHUD
    };

    refreshHUD();

    function subscribeShipData() {
      const db = Auth.db();
      const user = Auth.getUser();
      if (!db || !user) return;

      db.channel('public:ships')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'ships', filter: `owner_id=eq.${user.id}` }, () => {
          if (!window._isVoyageActive && typeof loadShipData === 'function') loadShipData();
        })
        .subscribe();

      db.channel('public:ship_passengers')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'ship_passengers' }, () => {
          if (!window._isVoyageActive && typeof loadShipData === 'function') loadShipData();
        })
        .subscribe();
    }
    window._subscribeShipData = subscribeShipData; // Internal helper for initShipApp

    const rollChannel = db.channel(`travel_roll_${ticketCode}`);
    if (isPrivate) {
      rollChannel.on('broadcast', { event: 'dice_roll' }, async payload => {
        const p = payload.payload;
        await showDiceAnimation(p.roll, p.sec, p.total, p.isSuccess);
      }).subscribe();
    }

    updateCam(pathPlanets[0], pathPlanets[1] || null, true, 'both');
    await new Promise(r => setTimeout(r, 800));

    let jumpsSinceScan = 0;
    let abortedPlanet = null;

    for (let i = 1; i < pathPlanets.length; i++) {
      const p = pathPlanets[i];
      const next = pathPlanets[i + 1] || null;
      let pausePhase = null;

      if (log) log.innerHTML += `<br>> CALCULANDO VETOR DE SALTO PARA ${p.name.toUpperCase()}...`;
      updateCam(pathPlanets[i - 1], p, false, 'rotate');
      await new Promise(r => setTimeout(r, 1400));

      if (isPrivate) {
        if (log) log.innerHTML += `<br><span style="color:var(--amber)">> AGUARDANDO COMANDO...</span>`;
        if ($('travel-finish-container')) $('travel-finish-container').classList.remove('hidden');
        if (refuelBtn) refuelBtn.style.display = 'block';
        if (abortBtn) abortBtn.style.display = 'block';

        if (jumpsSinceScan >= 2) {
          if (nextJumpBtn) nextJumpBtn.style.display = 'none';
          if (rollScanBtn) rollScanBtn.style.display = 'block';
          if (log) log.innerHTML += `<br><span style="color:var(--red-alert)">> ANOMALIA DETECTADA NO RADAR. VARREDURA (d20) NECESSÁRIA.</span>`;
          if (log) log.scrollTop = log.scrollHeight;
        } else {
          if (nextJumpBtn) nextJumpBtn.style.display = 'block';
          if (rollScanBtn) rollScanBtn.style.display = 'none';
        }

        pausePhase = await new Promise(resolve => {
          if (isAutoLeap) {
            // For auto-travelers (passengers or mission agents), they just follow the pilot's flow
            // Optionally wait for the pilot to advance if we wanted strict sync, but simulating the route is usually fine.
            setTimeout(() => resolve('clear'), 800); // Small delay to sync visually
            return;
          }

          if (nextJumpBtn) {
            nextJumpBtn.onclick = () => {
              nextJumpBtn.style.display = 'none';
              if (refuelBtn) refuelBtn.style.display = 'none';
              if (abortBtn) abortBtn.style.display = 'none';
              jumpsSinceScan++;
              resolve('clear');
            };
          }
          if (abortBtn) {
            abortBtn.onclick = () => {
              showModal({
                title: 'ABORTAR VIAGEM',
                body: 'DESEJA CANCELAR A ROTA E POUSAR IMEDIATAMENTE NO PLANETA ATUAL?',
                type: 'confirm',
                onConfirm: () => {
                  nextJumpBtn.style.display = 'none';
                  if (refuelBtn) refuelBtn.style.display = 'none';
                  abortBtn.style.display = 'none';
                  resolve('abort');
                }
              });
            };
          }
          if (rollScanBtn) {
            rollScanBtn.onclick = async () => {
              rollScanBtn.disabled = true;
              rollScanBtn.textContent = 'ESCANEANDO...';

              const roll = Math.floor(Math.random() * 20) + 1;
              const sec = ship?.stats?.security || 1;
              const total = roll + sec;
              const isSuccess = total >= 10;

              // Send broadcast
              rollChannel.send({
                type: 'broadcast',
                event: 'dice_roll',
                payload: { roll, sec, total, isSuccess }
              });

              const bLog = `<br><span style="color:var(--green)">> SCANNERS: d20 [ ${roll} ] + SEG [ ${sec} ] = ${total}</span>`;
              if (log) { log.innerHTML += bLog; log.scrollTop = log.scrollHeight; }

              // Wait for animation locally
              await showDiceAnimation(roll, sec, total, isSuccess);

              if (!isSuccess) {
                if (log) { log.innerHTML += `<br><span style="color:var(--red-alert); font-weight:bold;">> AMEAÇA CONFIRMADA! ROTA BLOQUEADA. AGUARDE LIBERAÇÃO DA O.R.T.</span>`; log.scrollTop = log.scrollHeight; }
                rollScanBtn.style.display = 'none';
                if (abortBtn) abortBtn.style.display = 'none';
                await db.from('travel_registrations').update({ is_paused: true, current_event: `HOSTIL (Rolagem Total: ${total})` }).eq('ticket_code', ticketCode);
                resolve('paused');
              } else {
                if (log) { log.innerHTML += `<br><span style="color:var(--green)">> SETOR LIMPO. ROTA LIBERADA.</span>`; log.scrollTop = log.scrollHeight; }
                rollScanBtn.style.display = 'none';
                if (refuelBtn) refuelBtn.style.display = 'none';
                if (abortBtn) abortBtn.style.display = 'none';
                jumpsSinceScan = 0;
                rollScanBtn.disabled = false;
                rollScanBtn.textContent = '[ RODAR SCANNERS ]';
                resolve('clear');
              }
            };
          }
          if (refuelBtn) refuelBtn.onclick = () => Apps.openRefuelMenu();
        });

        if (pausePhase === 'paused') {
          await new Promise(res => {
            const pausedSub = db.channel(`travel_pause_${ticketCode}`)
              .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'travel_registrations', filter: `ticket_code=eq.${ticketCode}` }, payload => {
                if (payload.new && payload.new.is_paused === false) {
                  if (log) { log.innerHTML += `<br><span style="color:var(--green)">> VIA LIBERADA PELA ADMINISTRAÇÃO O.R.T. RETOMANDO...</span>`; log.scrollTop = log.scrollHeight; }
                  jumpsSinceScan = 0;
                  if (rollScanBtn) {
                    rollScanBtn.disabled = false;
                    rollScanBtn.textContent = '[ RODAR SCANNERS ]';
                  }
                  if (refuelBtn) refuelBtn.style.display = 'none';
                  if (abortBtn) abortBtn.style.display = 'none';
                  pausedSub.unsubscribe();
                  res();
                }
              }).subscribe();
          });
        }
      }

      if (log) log.innerHTML += `<br>> SALTANDO...`;
      if (hudSpeed) hudSpeed.textContent = (Math.random() * 5 + 10).toFixed(1);
      updateCam(p, next, false, 'move');

      // Consume Fuel (Integrity only via events or long jumps if desired, but user asked to only consume fuel here)
      currentFuel -= isPrivate ? (Math.random() * 3 + 1) : 0;
      refreshHUD();

      // Update DB every jump for private ships
      if (isPrivate && ship) {
        // Use Math.round to avoid 400 error on INTEGER columns with float values
        await db.from('ships').update({
          fuel: Math.round(Math.max(0, currentFuel)),
          integrity: Math.round(Math.max(0, currentInteg))
        }).eq('id', ship.id);
      }

      await new Promise(r => setTimeout(r, 4200));

      if (!isPrivate && i % 3 === 0 && i < pathPlanets.length - 1) {
        if (log) log.innerHTML += `<br><span style="color:var(--amber)">> POUSO TÉCNICO: REABASTECIMENTO</span>`;
        currentFuel = 100;
        await new Promise(r => setTimeout(r, 3000));
        refreshHUD();
      }

      if (pausePhase === 'abort') {
        abortedPlanet = p;
        break;
      }
    }

    const finalArrival = abortedPlanet ? abortedPlanet.name : registration.target_planet;

    if (log) {
      log.innerHTML += `<br><br><span style="color:var(--amber)" class="blink">> INICIANDO PROTOCOLO DE ATERRISAGEM...</span>`;
      log.scrollTop = log.scrollHeight;
    }
    if (hudSpeed) hudSpeed.textContent = "0.0";

    // Fake landing delay (2.5s)
    await new Promise(r => setTimeout(r, 2500));

    // Database Sync Protocol
    if (log) {
      log.innerHTML += `<br><span style="color:var(--green-dim)">> SINCRONIZANDO MANIFESTO COM O SERVIDOR...</span>`;
      log.scrollTop = log.scrollHeight;
    }

    // Sync Ship location as well
    if (ship?.id) {
      await db.from('ships').update({ current_planet: finalArrival }).eq('id', ship.id);
    }

    if (registration.type === 'commercial') {
      const baseCode = ticketCode.split('-').slice(0, 2).join('-');
      if (isPilot) await db.from('commercial_flights').update({ status: 'finished' }).eq('ticket_code', baseCode);
      await db.from('travel_registrations').delete().like('ticket_code', `${baseCode}-%`).eq('user_id', user.id);
    } else if (registration.mission_id) {
      await db.from('travel_registrations').delete().eq('mission_id', registration.mission_id).eq('user_id', user.id);
    } else {
      await db.from('travel_registrations').delete().eq('ticket_code', ticketCode).eq('user_id', user.id);
    }

    // Sincronizar localização de todos os passageiros ao pousar
    const allCrewToUpdate = [user.id];
    if (ship?.id) {
      const { data: currentCrew } = await db.from('ship_passengers').select('user_id').eq('ship_id', ship.id);
      if (currentCrew) {
        currentCrew.forEach(p => { if (p.user_id) allCrewToUpdate.push(p.user_id); });
      }
    }

    // Atualização em lote (Supabase)
    await Promise.all(allCrewToUpdate.map(uid =>
      db.from('profiles').update({ current_planet: finalArrival }).eq('id', uid)
    ));

    if (Auth.getProfile) await Auth.getProfile(true);

    // Fake finalizing delay to feel like a real dock
    await new Promise(r => setTimeout(r, 1000));

    if (log) {
      log.innerHTML += `<br><span style="color:var(--green); font-size:14px; text-shadow:0 0 5px var(--green);">> VIAGEM CONCLUÍDA. NAVE POUSADA EM ${finalArrival.toUpperCase()}.</span>`;
      log.scrollTop = log.scrollHeight;
    }

    showNotification('POUSO FINALIZADO', `Bem-vindo a ${finalArrival}.`, 'success');
    if ($('travel-finish-container')) {
      $('travel-finish-container').classList.remove('hidden');
      if (refuelBtn) refuelBtn.style.display = 'none';
      if (abortBtn) abortBtn.style.display = 'none';
      if (finishBtn) finishBtn.style.display = 'block';
    }

    if (finishBtn) {
      finishBtn.onclick = () => {
        window._isVoyageActive = false;
        overlay.classList.add('hidden');
        Desktop.closeApp('travelApp');
      };
    }
  }

  async function triggerTravelEvent(reg) {
    return { stop: false, msg: 'PROTOCOLO PADRÃO.' };
  }

  function initTravelApp() { }
  async function saveVideo() {
    const title = $('vid-title')?.value?.trim();
    const url = $('vid-url')?.value?.trim();
    const date = $('vid-date')?.value?.trim();
    const desc = $('vid-desc')?.value?.trim();
    if (!title || !url) {
      showModal({ title: 'CAMPOS OBRIGATÓRIOS', body: 'TÍTULO e URL são necessários para registrar o vídeo.' });
      return;
    }
    const ytId = getYouTubeId(url);
    if (!ytId) {
      showModal({ title: 'URL INVÁLIDA', body: 'A URL do YouTube informada não é válida. Use o formato: youtube.com/watch?v=ID' });
      return;
    }

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
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:10px; margin-bottom:12px;">
            <div class="login-field">
              <label class="login-label">&gt; CÓDIGO (EX: M-001)</label>
              <input type="text" id="m-code" placeholder="M-XXX">
            </div>
            <div class="login-field">
              <label class="login-label">&gt; CLASSIFICAÇÃO</label>
              <select id="m-class" style="width:100%; color:var(--green);">
                 <option value="E">E - ROTINA</option>
                 <option value="D">D - INVESTIGAÇÃO</option>
                 <option value="C">C - RISCO MODERADO</option>
                 <option value="B">B - ANOMALIA</option>
                 <option value="A">A - AMEAÇA ALTA</option>
                 <option value="S">S - EXTINÇÃO</option>
              </select>
            </div>
            <div class="login-field">
              <label class="login-label">&gt; RECOMPENSA (CR$)</label>
              <input type="number" id="m-reward" value="300" readonly style="background:rgba(0,100,0,0.1); border-color:var(--green-dim); color:var(--amber); font-weight:bold;">
            </div>
            <div class="login-field">
              <label class="login-label">&gt; RECOMPENSA LOOT</label>
              <select id="m-loot-reward" style="width:100%; border-color:var(--amber); color:var(--amber);">
                 <option value="">-- NENHUM --</option>
              </select>
            </div>
          </div>
          <div id="reward-calc-info" style="font-size:10px; color:var(--green-dim); margin-top:-10px; margin-bottom:10px; font-family:var(--font-code); padding:4px 8px; border:1px dashed rgba(0,255,65,0.1);">
            MATEMÁTICA: BASE + (DISTÂNCIA × 2 CR) + BÔNUS REGIONAL
          </div>
          <div class="login-field">
            <label class="login-label">&gt; DESIGNAR AGENTES</label>
            <div id="m-assign-container" style="display:flex; flex-wrap:wrap; gap:8px; background:rgba(0,40,0,0.3); padding:8px; border:1px solid var(--border-dim); height:120px; overflow-y:auto;">
                <div class="loading-state" style="font-size:10px;">ESCANER DE AGENTES<span class="loading-dots"></span></div>
            </div>
          </div>
          <div class="login-field"><label class="login-label">&gt; DESCRIÇÃO CURTA</label><input type="text" id="m-desc" placeholder="Resumo da missão..."></div>
          <div class="login-field"><label class="login-label">&gt; BRIEFING DETALHADO (LORE/INSTRUÇÕES)</label>
            <textarea id="m-briefing" rows="4" style="background:rgba(0,59,0,0.2);border:1px solid var(--border-dim);padding:8px;color:var(--green-mid);font-family:var(--font-code);font-size:14px;width:100%;outline:none;" placeholder="Instruções completas para os agentes..."></textarea>
          </div>
          <div class="login-field">
            <label class="login-label">&gt; PLANETA DE DESTINO DA MISSÃO</label>
            <div style="display:grid; grid-template-columns:1fr; gap:10px; align-items:center;">
              <select id="m-route-dest" style="background:rgba(0,59,0,0.2); border:1px solid var(--border-dim); color:var(--green); font-family:var(--font-code); padding:8px;"><option value="">-- SELECIONE O DESTINO --</option></select>
            </div>
            <div style="font-size:10px; color:var(--green-dim); margin-top:4px;">A ORIGEM SERÁ O PLANETA ATUAL DO AGENTE NO MOMENTO DA ACEITAÇÃO.</div>
          </div>
          <div class="login-field">
            <label class="login-label">&gt; MEIO DE TRANSPORTE</label>
            <select id="m-transport" style="background:rgba(0,59,0,0.2); border:1px solid var(--border-dim); color:var(--amber); font-family:var(--font-code); padding:8px; width:100%;">
              <option value="Nenhum">NENHUM (POR CONTA DO AGENTE)</option>
              <option value="Agência">AGÊNCIA DE VIAGENS (ORT)</option>
              <option value="Nave ORT">NAVE FORNECIDA PELA ORT</option>
              <option value="Nave Agente">NAVE DE AGENTE (PARTICULAR)</option>
              <option value="Nave Comprada">NAVE COMPRADA (SISTEMA)</option>
            </select>
          </div>
        </div>
        <div style="display:flex;gap:10px;">
          <button class="btn" id="btn-save-mission">[ REGISTRAR ]</button>
          <button class="btn btn-danger" id="btn-cancel-mission">[ CANCELAR ]</button>
        </div>
      </div>
      <style>
        .mission-tabs { display:flex; gap:12px; margin-bottom:20px; border-bottom:1px solid var(--border-dim); padding-bottom:12px; }
        .m-tab { 
          flex:1; padding:8px; font-family:var(--font-code); font-size:11px; cursor:pointer;
          background:transparent; border:1px solid var(--border-dim); color:var(--green-mid);
          transition: all 0.2s ease; text-transform:uppercase; letter-spacing:1px;
        }
        .m-tab:hover { border-color:var(--green); color:var(--green); box-shadow:0 0 10px rgba(0,255,65,0.2); }
        .m-tab.active[data-tab="active"] { background:var(--green); color:#000; border-color:var(--green); box-shadow:0 0 15px var(--green); font-weight:bold; }
        .m-tab.active[data-tab="pending"] { background:var(--amber); color:#000; border-color:var(--amber); box-shadow:0 0 15px var(--amber); font-weight:bold; }
        .m-tab.active[data-tab="rejected"] { background:var(--red-alert); color:#000; border-color:var(--red-alert); box-shadow:0 0 15px var(--red-alert); font-weight:bold; }
        
        .m-tab[data-tab="pending"] { border-color:rgba(215,153,33,0.4); color:rgba(215,153,33,0.7); }
        .m-tab[data-tab="rejected"] { border-color:rgba(255,34,0,0.4); color:rgba(255,34,0,0.7); }
      </style>
      <div class="mission-tabs" id="missions-tabs">
        <button class="m-tab active" data-tab="active" onclick="Apps.filterMissions('active')">[ ATIVAS ]</button>
        <button class="m-tab" data-tab="pending" onclick="Apps.filterMissions('pending')">[ PENDENTES ]</button>
        <button class="m-tab" data-tab="rejected" onclick="Apps.filterMissions('rejected')">[ RECUSADAS ]</button>
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
        await renderMissionAgentSelector();
        loadLootRewards();
        populateRouteSelectors();

        // Add listeners for dynamic reward update
        $('m-class')?.addEventListener('change', calculateMissionReward);
        $('m-route-dest')?.addEventListener('change', calculateMissionReward);
        // Delegate for checkboxes since they are dynamic
        $('m-assign-container')?.addEventListener('change', (e) => {
          if (e.target.name === 'm-assign-check') calculateMissionReward();
        });
      }
    });

    $('btn-cancel-mission')?.addEventListener('click', () => $('missions-add-form')?.classList.add('hidden'));
    $('btn-save-mission')?.addEventListener('click', saveMission);
  }

  async function calculateMissionReward() {
    const classVal = $('m-class')?.value;
    const destPlanetName = $('m-route-dest')?.value;
    const firstAgentCheck = document.querySelector('input[name="m-assign-check"]:checked');
    const display = $('m-reward');
    const info = $('reward-calc-info');

    if (!classVal || !destPlanetName || !firstAgentCheck) {
      if (display) display.value = 300;
      if (info) info.innerHTML = 'MATEMÁTICA: AGUARDANDO DADOS (SELECIONE AGENTE + DESTINO)';
      return;
    }

    const bases = { 'E': 300, 'D': 800, 'C': 1500, 'B': 3500, 'A': 8000, 'S': 20000 };
    let base = bases[classVal] || 0;
    let distanceCharge = 0;
    let hazardBonus = 0;

    const galaxy = typeof GALAXY_DB !== 'undefined' ? GALAXY_DB : [];
    const targetPlanet = galaxy.find(p => p.name === destPlanetName);

    // Fetch designated agent's planet
    const db = Auth.db();
    if (!db) return;
    const { data: profile } = await db.from('profiles').select('current_planet').eq('id', firstAgentCheck.value).single();
    const originPlanetName = profile?.current_planet || 'Sítio Keter';
    const originPlanet = galaxy.find(p => p.name === originPlanetName);

    if (targetPlanet && originPlanet && typeof MapApp !== 'undefined' && MapApp.getDist) {
      const dist = MapApp.getDist(originPlanet, targetPlanet);
      distanceCharge = Math.floor(dist * 2);
    }

    if (targetPlanet && targetPlanet.rk === 'vale') {
      hazardBonus = 1000;
    }

    const total = base + distanceCharge + hazardBonus;
    if (display) display.value = total;
    if (info) {
      info.innerHTML = `ANÁLISE: CLASSE ${classVal} (${base}) + ROTA ${distanceCharge} ${hazardBonus ? '+ RISCO VALE ' + hazardBonus : ''} = TOTAL ${total.toLocaleString()} CR`;
    }
  }

  async function loadLootRewards() {
    const sel = $('m-loot-reward');
    if (!sel) return;
    const db = Auth.db();
    if (!db) return;
    const { data } = await db.from('store_items').select('id, name').eq('is_loot', true).order('name');
    sel.innerHTML = `<option value="">-- NENHUM --</option>` + (data || []).map(i => `<option value="${i.id}">${i.name}</option>`).join('');
  }

  function populateRouteSelectors() {
    const dest = $('m-route-dest');
    if (!dest) return;
    const names = (typeof GALAXY_DB !== 'undefined' ? GALAXY_DB : []).map(p => p.name).sort();
    const options = `<option value="">-- SELECIONE O DESTINO --</option>` + names.map(n => `<option value="${n}">${n}</option>`).join('');
    dest.innerHTML = options;
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
    if (db) {
      const dest = $('m-route-dest');
      const targetPlanet = dest?.value || '';
      const routeValue = targetPlanet;
      const transport = $('m-transport')?.value || 'Nenhum';
      const mClass = $('m-class')?.value || 'E';

      const { data: mission, error: e1 } = await db.from('missions').insert({
        title: code.toUpperCase() + (desc ? ' — ' + desc.toUpperCase() : ''),
        description: briefing,
        status: 'ativa',
        classification: mClass,
        reward: parseInt(reward),
        loot_item_id: lootId || null,
        assigned_to: assign,
        route: routeValue,
        target_planet: targetPlanet,
        transport_mode: transport
      }).select().single();

      if (e1) {
        showModal({ title: 'ERRO CRÍTICO', body: 'FALHA AO REGISTRAR MISSÃO: ' + e1.message, type: 'alert' });
        return;
      }

      if (mission) {
        // Initialize assignments as 'pending'
        const usersToAssign = assign === 'all' ? (await Auth.adminListUsers()).data : Array.from(checks).map(c => ({ id: c.value }));
        const assignments = (usersToAssign || []).map(u => ({
          mission_id: mission.id,
          user_id: u.id,
          status: 'pending'
        }));
        await db.from('mission_assignments').insert(assignments);

        // Pre-generate SHARED ticket if it's "Agência" transport
        if (transport === 'Agência') {
          const ticket = 'ID-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
          await db.from('missions').update({ shared_ticket_code: ticket }).eq('id', mission.id);
        }
      }
    }
    $('missions-add-form')?.classList.add('hidden');
    loadMissions();
  }

  let currentMissionTab = 'active';

  function filterMissions(tab) {
    currentMissionTab = tab;
    document.querySelectorAll('#missions-tabs .m-tab').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tab);
    });
    loadMissions();
  }

  async function loadMissions() {
    const list = $('missions-list');
    if (!list) return;
    const db = Auth.db();
    const user = Auth.getUser();

    list.innerHTML = `<div class="loading-state">SINCRONIZANDO DADOS<span class="loading-dots"></span></div>`;

    let data = [];
    if (db && user) {
      const { data: assignments } = await db.from('mission_assignments')
        .select('*, missions(*, store_items(name))')
        .eq('user_id', user.id);

      const { data: tickets } = await db.from('travel_registrations')
        .select('mission_id, ticket_code')
        .eq('user_id', user.id);

      const ticketMap = {};
      (tickets || []).forEach(t => ticketMap[t.mission_id] = t.ticket_code);

      const missionMap = (assignments || []).map(a => ({
        ...a.missions,
        assignment_status: a.status,
        assignment_id: a.id,
        ticket_code: ticketMap[a.missions.id] || null
      }));

      if (currentMissionTab === 'active') {
        data = missionMap.filter(m => m.assignment_status === 'accepted' || m.assignment_status === 'active');
      } else if (currentMissionTab === 'pending') {
        data = missionMap.filter(m => m.assignment_status === 'pending');
      } else {
        data = missionMap.filter(m => m.assignment_status === 'rejected');
      }
    } else {
      data = [
        { id: 'd1', title: 'M-001 — OPERAÇÃO NEXUS PRIME', description: 'Investigar anomalia temporal no setor 7.', status: 'ativa', route: 'Zoidra -> Drundaia', assignment_status: 'accepted' },
      ];
    }

    if (!data.length) {
      list.innerHTML = `<div class="empty-state"><span class="empty-state-icon">📋</span>SEM MISSÕES NESTE SETOR</div>`;
      return;
    }

    list.innerHTML = data.map(m => {
      const isRejected = (m.assignment_status === 'rejected' || currentMissionTab === 'rejected');
      const statusColor = m.assignment_status === 'accepted' ? 'var(--green)' : m.assignment_status === 'rejected' ? 'var(--red-alert)' : 'var(--amber)';

      const ticketRow = m.ticket_code ? `
        <div class="ticket-copy" onclick="event.stopPropagation(); Apps.copyToClipboard('${m.ticket_code}', 'ID DE VIAGEM')" style="margin-top:5px; padding:4px 8px; border:1px dashed var(--amber); background:rgba(255,176,0,0.05); cursor:pointer; font-size:10px; color:var(--amber); text-align:center; letter-spacing:1px;">
          TICKET: ${m.ticket_code} <span style="font-size:9px; opacity:0.6;">[ CLIQUE PARA COPIAR ]</span>
        </div>` : '';

      return `
      <div class="mission-row" style="${isRejected ? 'background:rgba(255,34,0,0.08); border-color:rgba(255,34,0,0.3);' : ''}">
        <div style="flex:1;">
          <div style="cursor:pointer;" onclick="Apps.openBriefing('${m.id}')">
            <div class="mission-title">${m.title} <span style="font-size:10px;color:var(--green-dark);">[CLIQUE PARA BRIEFING]</span></div>
            <div class="mission-desc" style="${isRejected ? 'color:rgba(255,255,255,0.6);' : ''}">${m.description || ''}</div>
            <div style="font-size:10px; color:var(--green-mid);">
              STATUS: <span style="color:${statusColor}; font-weight:bold;">${(m.assignment_status || 'DESIGNADA').toUpperCase()}</span>
            </div>
          </div>
        </div>
        <div style="display:flex; flex-direction:column; gap:4px; align-items:flex-end;">
          <div style="color:var(--amber); font-family:var(--font-code); display:flex; flex-direction:column; align-items:flex-end; gap:4px;">
             <span>CR$ ${m.reward || 0}</span>
             ${m.store_items ? `<span style="font-size:9px; color:var(--green-dim); border:1px solid var(--green-dim); padding:1px 4px;">+ ${m.store_items.name.toUpperCase()}</span>` : ''}
          </div>
          ${ticketRow}
        </div>
        <div style="display:flex; flex-direction:column; gap:4px; align-items:center;">
          ${Auth.isAdmin() ?
          `<button class="btn" onclick="Apps.editMission('${m.id}')" style="font-size:9px; padding:2px 6px; border-color:var(--amber); color:var(--amber); background:rgba(215,153,33,0.1);">[ EDITAR ]</button>` :
          `<span class="chip ${STATUS_CLS[m.status] || ''}">${STATUS_LABELS[m.status] || m.status.toUpperCase()}</span>`}
          ${m.route ? `<button class="btn" onclick="Apps.viewMissionRoute('${m.route.replace(/'/g, "\\'")}')" style="font-size:9px; padding:2px 6px; border-color:var(--green-mid); color:var(--green-mid);">[ MAPA ]</button>` : ''}
        </div>
        <div style="display:flex; gap:6px; align-items:center;">
          ${Auth.isAdmin() && db ? `
          <select onchange="Apps.updateMissionStatus('${m.id}', this.value)" style="background:transparent;border:1px solid var(--border-dim);color:var(--green-mid);font-family:var(--font-code);font-size:12px;padding:3px;cursor:pointer;">
            ${MISSION_STATUS.map(s => `<option value="${s}" ${m.status === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
          <button class="btn btn-danger" onclick="Apps.deleteMission('${m.id}')" style="font-size:10px;padding:3px 6px;">[ EXCLUIR ]</button>
          ` : ''}
        </div>
      </div>`;
    }).join('');
  }

  async function updateMissionStatus(id, status) {
    const db = Auth.db();
    if (!db) return;

    if (status === 'completa') {
      const { data: m } = await db.from('missions').select('*').eq('id', id).single();
      if (m && (m.reward > 0 || m.loot_item_id)) {
        // FIXED: Only reward agents who ACCEPTED the mission
        const { data: acceptedAssignments } = await db.from('mission_assignments')
          .select('user_id')
          .eq('mission_id', id)
          .eq('status', 'accepted');

        const ids = (acceptedAssignments || []).map(a => a.user_id);

        for (const userId of ids) {
          if (m.reward > 0) {
            let finalReward = m.reward;
            let loanDeduction = 0;

            // 1. Check for active loan (Agiota's Cut)
            const { data: activeLoan } = await db.from('bank_loans')
              .select('id, remaining_amount')
              .eq('user_id', userId)
              .eq('status', 'active')
              .order('created_at', { ascending: false })
              .limit(1)
              .single();

            if (activeLoan && activeLoan.remaining_amount > 0) {
              // Intercept 20% of the reward
              loanDeduction = Math.floor(m.reward * 0.20);
              if (loanDeduction > activeLoan.remaining_amount) {
                loanDeduction = activeLoan.remaining_amount; // don't overcharge
              }

              finalReward = m.reward - loanDeduction;

              const newDebt = activeLoan.remaining_amount - loanDeduction;
              const newStatus = newDebt <= 0 ? 'paid' : 'active';

              // Pay down loan
              await db.from('bank_loans').update({
                remaining_amount: newDebt,
                status: newStatus
              }).eq('id', activeLoan.id);

              // Record loan payment transaction
              await db.from('bank_transactions').insert({
                user_id: userId,
                type: 'mission_discount',
                amount: loanDeduction,
                description: `DEDUÇÃO DE MISSÃO (AGIOTA) REF: ${m.title.substring(0, 10)}...`
              });
            }

            // 2. Pay remaining credits
            const { data: p } = await db.from('profiles').select('credits').eq('id', userId).single();
            if (p) {
              await db.from('profiles').update({ credits: p.credits + finalReward }).eq('id', userId);

              // Record mission reward transaction
              await db.from('bank_transactions').insert({
                user_id: userId,
                type: 'transfer_in',
                amount: finalReward,
                description: `PAGAMENTO DE MISSÃO: ${m.title.substring(0, 20)}...`
              });
            }
          }

          if (m.loot_item_id) {
            await db.from('inventory').insert({ user_id: userId, item_id: m.loot_item_id, is_equipped: false });
          }
        }

        const rewardMsg = m.loot_item_id ? `CR$ ${m.reward} E ITENS` : `CR$ ${m.reward}`;
        showNotification('MISSÃO CONCLUÍDA', `RECOMPENSA (${rewardMsg}) DISTRIBUÍDA PARA AGENTES. (DEDUÇÕES APLICADAS SE HOUVER DÍVIDA).`, 'success');
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

  async function editMission(id) {
    const db = Auth.db();
    if (!db) return;

    const { data: m, error } = await db.from('missions').select('*').eq('id', id).single();
    if (error || !m) {
      showModal({ title: 'ERRO', body: 'MISSÃO NÃO ENCONTRADA.', type: 'alert' });
      return;
    }

    // Reuse Nova Missão modal structure but for editing
    $('missions-add-form')?.classList.remove('hidden');
    const header = document.querySelector('#missions-add-form .modal-header');
    if (header) header.textContent = '> EDITAR MISSÃO DE CAMPO';

    const btnSave = $('btn-save-mission');
    if (btnSave) {
      btnSave.textContent = '[ SALVAR ALTERAÇÕES ]';
      // Change listener to saveMissionEdit
      const newBtn = btnSave.cloneNode(true);
      btnSave.parentNode.replaceChild(newBtn, btnSave);
      newBtn.addEventListener('click', () => saveMissionEdit(id));
    }

    // Populate fields
    if ($('m-code')) $('m-code').value = m.title.split(' — ')[0];
    if ($('m-desc')) $('m-desc').value = m.title.split(' — ')[1] || '';
    if ($('m-briefing')) $('m-briefing').value = m.description || '';
    if ($('m-class')) $('m-class').value = m.classification || 'E';
    if ($('m-reward')) $('m-reward').value = m.reward || 0;

    await loadLootRewards();
    if ($('m-loot-reward')) $('m-loot-reward').value = m.loot_item_id || '';

    populateRouteSelectors();
    setTimeout(() => {
      if (m.route && m.route.includes(' -> ')) {
        const parts = m.route.split(' -> ');
        if ($('m-route-origin')) $('m-route-origin').value = parts[0];
        if ($('m-route-dest')) $('m-route-dest').value = parts[1];
      }
      if ($('m-transport')) $('m-transport').value = m.transport_mode || 'Nenhum';
    }, 100);

    // Agents assignment (pre-check those already assigned)
    await renderMissionAgentSelector();
    const { data: assignments } = await db.from('mission_assignments').select('user_id').eq('mission_id', id);
    if (assignments) {
      const assignedIds = assignments.map(a => a.user_id);
      document.querySelectorAll('input[name="m-assign-check"]').forEach(cb => {
        if (assignedIds.includes(cb.value)) cb.checked = true;
      });
    }

    // Trigger calculation info display
    setTimeout(() => calculateMissionReward(), 300);
  }

  async function saveMissionEdit(id) {
    const db = Auth.db();
    if (!db) return;

    const code = $('m-code')?.value?.trim();
    const desc = $('m-desc')?.value?.trim();
    const briefing = $('m-briefing')?.value?.trim();
    const reward = parseInt($('m-reward')?.value) || 0;
    const lootId = $('m-loot-reward')?.value || null;
    const transport = $('m-transport')?.value || 'Nenhum';
    const origin = $('m-route-origin')?.value;
    const dest = $('m-route-dest')?.value;
    const routeValue = (origin && dest) ? `${origin} -> ${dest}` : '';

    const checks = document.querySelectorAll('input[name="m-assign-check"]:checked');
    const assignList = Array.from(checks).map(c => c.value);

    const mClass = $('m-class')?.value || 'E';

    const { error: e1 } = await db.from('missions').update({
      title: code.toUpperCase() + (desc ? ' — ' + desc.toUpperCase() : ''),
      description: briefing,
      classification: mClass,
      reward: reward,
      loot_item_id: lootId,
      route: routeValue || dest,
      target_planet: dest,
      transport_mode: transport
    }).eq('id', id);

    if (e1) {
      showModal({ title: 'ERRO', body: 'FALHA AO SALVAR: ' + e1.message, type: 'alert' });
      return;
    }

    // Update assignments: remove old ones not in current list, add new ones
    const { data: currentAssignments } = await db.from('mission_assignments').select('user_id').eq('mission_id', id);
    const existingIds = (currentAssignments || []).map(a => a.user_id);

    // Delete removed
    const toRemove = existingIds.filter(id => !assignList.includes(id));
    if (toRemove.length > 0) {
      await db.from('mission_assignments').delete().eq('mission_id', id).in('user_id', toRemove);
    }

    // Add new
    const toAdd = assignList.filter(id => !existingIds.includes(id)).map(userId => ({
      mission_id: id,
      user_id: userId,
      status: 'pending'
    }));
    if (toAdd.length > 0) {
      await db.from('mission_assignments').insert(toAdd);
    }

    $('missions-add-form')?.classList.add('hidden');
    loadMissions();
    showNotification('SISTEMA', 'MISSÃO ATUALIZADA COM SUCESSO.', 'success');
  }

  async function viewMissionRoute(routeStr) {
    if (!routeStr) return;

    const db = Auth.db();
    const user = Auth.getUser();
    let origin = Auth.getProfile()?.current_planet || '';
    let dest = routeStr;

    // Fetch fresh location if missing from profile cache
    if (!origin && db && user) {
      const { data: p } = await db.from('profiles').select('current_planet').eq('id', user.id).single();
      if (p?.current_planet) origin = p.current_planet;
    }

    // Legacy format: "Origin -> Destination"
    if (routeStr.includes('->')) {
      const parts = routeStr.split('->').map(p => p.trim());
      origin = parts[0];
      dest = parts[1];
    }

    if (!dest) return;

    if (window.MapApp && MapApp.setMissionRoute) {
      MapApp.setMissionRoute(origin || dest, dest);
      Desktop.openApp('map');
    }
  }

  async function openBriefing(id) {
    const db = Auth.db();
    const user = Auth.getUser();
    let mission = null;
    let assignment = null;

    if (db && user) {
      const { data } = await db.from('missions').select('*, store_items(name)').eq('id', id).single();
      mission = data;
      const { data: assignData } = await db.from('mission_assignments').select('*').eq('mission_id', id).eq('user_id', user.id).single();
      assignment = assignData;
    }

    if (!mission) return;

    // 4. Buscar ID de Viagem se houver (Agência)
    let travelId = null;
    const isMissionActive = assignment?.status === 'active' || assignment?.status === 'accepted';
    if (isMissionActive && mission.transport_mode === 'Agência') {
      const { data: reg } = await db.from('travel_registrations')
        .select('ticket_code')
        .eq('mission_id', id)
        .eq('user_id', user.id)
        .maybeSingle();
      if (reg) travelId = reg.ticket_code;
    }

    let actionButtons = '';
    if (assignment && assignment.status === 'pending') {
      actionButtons = `
        <div style="display:flex; gap:10px; margin-top:20px;">
          <button class="btn" onclick="Apps.respondToMission('${id}', 'accepted')" style="background:var(--green); color:#000;">[ ACEITAR MISSÃO ]</button>
          <button class="btn btn-danger" onclick="Apps.respondToMission('${id}', 'rejected')">[ RECUSAR MISSÃO ]</button>
        </div>`;
    } else if (Auth.isAdmin() && assignment && assignment.status === 'rejected') {
      actionButtons = `
        <div style="display:flex; gap:10px; margin-top:20px;">
          <button class="btn" onclick="Apps.respondToMission('${id}', 'pending')" style="border-color:var(--amber); color:var(--amber);">[ REENVIAR SOLICITAÇÃO ]</button>
        </div>`;
    }

    showModal({
      title: mission.title,
      body: `
        <div style="font-family:var(--font-code); color:var(--green-mid); line-height:1.6;">
          <div style="margin-bottom:15px; border-left:3px solid var(--green); padding-left:10px;">
            <label style="font-size:10px; opacity:0.6;">OBJETIVO PRINCIPAL</label>
            <div style="font-size:16px; color:var(--green);">${mission.description || 'SEM DESCRIÇÃO'}</div>
          </div>
          <div style="background:rgba(0,255,0,0.05); padding:15px; border:1px solid var(--border-dim);">
            <label style="font-size:10px; opacity:0.6;">BRIEFING DETALHADO</label>
            <p style="white-space:pre-wrap;">${mission.briefing || 'NENHUMA INSTRUÇÃO ADICIONAL DISPONÍVEL.'}</p>
          </div>
          <div style="margin-top:15px; display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div style="border:1px solid var(--border-dim); padding:8px;">
              <label style="font-size:10px; opacity:0.6;">RECOMPENSA</label>
              <div style="color:var(--amber);">CR$ ${mission.reward} ${mission.store_items ? '+ ' + mission.store_items.name : ''}</div>
            </div>
            <div style="border:1px solid var(--border-dim); padding:8px;">
              <label style="font-size:10px; opacity:0.6;">ROTA PREVISTA</label>
              <div style="color:var(--green-mid);">${mission.route || 'N/A'}</div>
            </div>
          </div>
          ${travelId ? `
          <div style="margin-top:10px; border:1px solid var(--amber); padding:10px; background:rgba(255,176,0,0.05); text-align:center; cursor:pointer;" onclick="Apps.copyToClipboard('${travelId}', 'ID DE VIAGEM')">
            <label style="font-size:10px; color:var(--amber); opacity:0.8;">PASSAGEM EMITIDA (ID DE VIAGEM)</label>
            <div style="font-family:var(--font-logo); font-size:14px; color:var(--amber); letter-spacing:2px; margin-top:5px;">${travelId}</div>
            <div style="font-size:10px; color:var(--amber); margin-top:5px; opacity:0.6;">CLIQUE PARA COPIAR · USE NO APP "MINHA VIAGEM"</div>
          </div>` : ''}
          ${actionButtons}
        </div>
      `,
      type: 'alert'
    });
  }

  async function respondToMission(missionId, status) {
    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;

    await db.from('mission_assignments').update({ status }).eq('mission_id', missionId).eq('user_id', user.id);

    // Close modal properly
    const m = document.querySelector('.app-overlay.modal-overlay-active');
    if (m) m.remove();

    loadMissions();

    if (status === 'accepted') {
      showNotification('MISSÃO ACEITA', 'A MISSÃO FOI ADICIONADA AO SEU PAINEL ATIVO.', 'success');

      try {
        const { data: mission } = await db.from('missions').select('*').eq('id', missionId).single();
        if (mission?.transport_mode === 'Agência') {
          // Check if user is already at the destination, but still generate ticket so they can sync up with lobby
          await generateTravelTicket(missionId, user.id);
        }
      } catch (e) {
        console.error("Error generating ticket on accept:", e);
      }
    } else if (status === 'rejected') {
      showNotification('MISSÃO RECUSADA', 'A MISSÃO FOI MOVIDA PARA O ARQUIVO DE RECUSADAS.', 'warning');
    } else if (status === 'pending') {
      showNotification('PROTOCOLO REINICIADO', 'A SOLICITAÇÃO FOI REENVIADA AO AGENTE.', 'info');
    }
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
    if (!db) {
      showModal({ title: 'ACESSO NEGADO', body: 'MODO DEMO: Conectividade com o servidor de e-mail indisponível.' });
      return;
    }

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
      if (typeof cloudinary === 'undefined') {
        showModal({ title: 'SISTEMA', body: 'O módulo Cloudinary não foi detectado. Verifique sua conexão com o Mainframe.' });
        return;
      }

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
      if (!subject || !body) {
        showModal({ title: 'CAMPOS REQUERIDOS', body: 'ASSUNTO e MENSAGEM são obrigatórios para a transmissão.' });
        return;
      }

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
    const data = db ? (await db.from('timeline_events').select('*').order('created_at', { ascending: false })).data || [] : DEMO_EVENTS;
    if (!data.length) {
      list.innerHTML = `<div class="empty-state"><span class="empty-state-icon">📅</span>NENHUM EVENTO REGISTRADO</div>`;
      return;
    }
    list.innerHTML = data.map(e => `
      <div class="timeline-item">
        <div class="timeline-date">${e.universe_date || '??'}</div>
        <div class="timeline-content">
          <div class="tl-title">${e.title}</div>
        </div>
      </div>`).join('');
  }

  /* ══════════════════════════════════════════════════════════
     SHIPS ("MINHA NAVE")
  ══════════════════════════════════════════════════════════ */
  function shipApp() {
    return `
      <div class="app-toolbar" style="display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; align-items:center;">
          <span style="font-family:var(--font-code);font-size:13px;color:var(--green-mid);">SISTEMA DE NAVEGAÇÃO</span>
        </div>
        <div class="ship-tabs" style="display:flex; gap:10px;">
          <button class="btn btn-tab active" id="tab-own-ship" onclick="Apps.switchShipTab('own')">[ MINHA NAVE ]</button>
          <button class="btn btn-tab" id="tab-local-ships" onclick="Apps.switchShipTab('local')">[ NAVES LOCAIS ]</button>
        </div>
        <button class="btn" id="btn-refresh-ship" onclick="Apps.loadShipData()">[ ATUALIZAR ]</button>
      </div>

      <div id="ship-main-container" class="full">
        <div id="ship-content" class="full" style="padding:20px; display:grid; grid-template-columns:1fr 300px; gap:20px;">
          <div id="ship-main-panel" class="panel" style="padding:20px;">
             <div id="ship-status-view">
                <h2 id="ship-name" class="glow">CARREGANDO NAVE...</h2>
                <div id="ship-plate" style="font-family:var(--font-code); color:var(--amber); margin-bottom:20px;">ID: ???</div>
                
                <div id="ship-details-area">
                  <div class="stats-grid">
                    <div class="stat-box"><div class="stat-label">SEGURANÇA</div><div id="ship-stat-sec" class="stat-value">0</div></div>
                    <div class="stat-box"><div class="stat-label">ARMAMENTO</div><div id="ship-stat-arm" class="stat-value">0</div></div>
                    <div class="stat-box"><div class="stat-label">SISTEMAS</div><div id="ship-stat-sys" class="stat-value">0</div></div>
                  </div>

                  <div style="margin-top:20px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                      <span class="stat-label">INTEGRIDADE</span>
                      <span id="ship-integrity-text" class="stat-value" style="font-size:14px; color:var(--red-alert);">100/100</span>
                    </div>
                    <div class="rpg-bar-container"><div id="ship-integrity-bar" class="rpg-bar-fill hp-fill" style="width:100%"></div></div>
                  </div>

                  <div style="margin-top:20px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                      <span class="stat-label">COMBUSTÍVEL</span>
                      <span id="ship-fuel-text" class="stat-value" style="font-size:14px;">0/100</span>
                    </div>
                    <div class="rpg-bar-container"><div id="ship-fuel-bar" class="rpg-bar-fill sp-fill" style="width:0%"></div></div>
                  </div>

                  <div id="ship-travel-btns" style="margin-top:30px; display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                    <button class="btn" onclick="Apps.prepShipTravel('mission')">[ VIAGEM POR MISSÃO ]</button>
                    <button class="btn" onclick="Apps.prepShipTravel('normal')">[ VIAGEM NORMAL ]</button>
                  </div>
                </div>

                <!-- Painel para Lista de Naves Locais (Hidden by Default) -->
                <div id="ship-local-list-area" class="hidden">
                   <p class="text-dim" style="margin-bottom:15px;">NAVES DETECTADAS NESTE PLANETA:</p>
                   <div id="local-ships-results" style="display:grid; gap:10px;"></div>
                </div>
             </div>
          </div>
        <aside id="ship-side-panel" class="panel" style="padding:15px; display:flex; flex-direction:column; gap:15px;">
            <div id="ship-passenger-section">
               <h3 class="stat-label" style="text-align:center; border-bottom:1px solid var(--border-dim); padding-bottom:10px; margin-bottom:10px;">MANIFESTO DE BORDO</h3>
               <div id="ship-passenger-list" style="height:150px; overflow-y:auto; font-size:12px;">
                 <div class="empty-state">NENHUM PASSAGEIRO</div>
               </div>
               <div id="ship-occupancy-bar" style="margin-top:5px; font-size:10px; color:var(--text-dim); text-align:right;">OCUPAÇÃO: 1/4</div>
               <button class="btn" id="btn-board-ship" onclick="Apps.boardShip()" style="width:100\%; margin-top:5px; font-size:11px; display:none;">[ EMBARCAR ]</button>
            </div>
            
            <div id="ship-cargo-section">
               <h3 class="stat-label" style="text-align:center; border-bottom:1px solid var(--border-dim); padding-bottom:5px; margin-bottom:10px;">INVENTÁRIO DA NAVE</h3>
               <div id="ship-cargo-list" style="height:180px; overflow-y:auto; font-size:12px;">
                 <div class="empty-state">CARGO VAZIO</div>
               </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:8px;">
              <button class="btn" onclick="Apps.openRefuelMenu()" style="width:100\%; font-size:11px; border-color:var(--amber); color:var(--amber);">[ REABASTECER NAVE ]</button>
              <button class="btn" onclick="Apps.openCargoTransfer()" style="width:100\%; font-size:11px;">[ TRANSFERIR ITENS ]</button>
            </div>
        </aside>
      </div>
    </div>`; // end ship-main-container + shipApp template
  }

  /* ══════════════════════════════════════════════════════════
     TRAVEL ("MINHA VIAGEM")
  ══════════════════════════════════════════════════════════ */
  function travelApp() {
    return `
      <div id="travel-lobby" class="full flex" style="flex-direction:column; padding:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid var(--border-dim); padding-bottom:10px;">
           <h2 class="glow" style="margin:0;">CENTRAL DE VIAGENS</h2>
           <div class="tabs" style="display:flex; gap:10px;">
             <button class="btn active" id="tab-travel-lobby" onclick="Apps.switchTravelTab('lobby')">[ LOBBY / ID ]</button>
             <button class="btn" id="tab-travel-board" onclick="Apps.switchTravelTab('board')">[ PARTIDAS ]</button>
             <button class="btn" id="tab-travel-mine" onclick="Apps.switchTravelTab('mine')">[ MINHAS PASSAGENS ]</button>
           </div>
        </div>
        
        <!-- View: LOBBY / ID MANUAL -->
        <div id="travel-view-lobby" class="travel-view panel flex center" style="flex-direction:column; padding:30px; height:300px; margin:auto; width:400px; max-width:100%;">
          <div class="login-field">
            <label class="login-label">&gt; INSERIR ID DE VIAGEM / SESSÃO</label>
            <input type="text" id="travel-id-input" placeholder="ID-XXXX-XXXX" style="text-align:center; font-size:20px; letter-spacing:3px;">
          </div>
          <button class="btn" onclick="Apps.joinTravelLobby()" style="width:100%; margin-top:20px; height:50px; font-size:20px;">[ ACESSAR LOBBY ]</button>
        </div>

        <!-- View: PARTIDAS (QUADRO) -->
        <div id="travel-view-board" class="travel-view hidden" style="flex:1; display:flex; flex-direction:column; overflow:hidden;">
           <div id="travel-board-list" style="flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:10px;"></div>
        </div>

        <!-- View: MINHAS PASSAGENS & COMPRAR -->
        <div id="travel-view-mine" class="travel-view hidden" style="flex:1; display:flex; flex-direction:column; overflow:hidden;">
           <div style="margin-bottom:15px; display:flex; justify-content:space-between; align-items:flex-end;">
              <span class="stat-label">SUAS PASSAGENS EMITIDAS</span>
              <button class="btn" onclick="Apps.openBuyTicketModal()" style="border-color:var(--green); color:var(--green);">[ + EMITIR NOVAS PASSAGENS ]</button>
           </div>
           <div id="travel-mine-list" style="flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:10px;"></div>
        </div>
      </div>
      <div id="active-lobby-view" class="hidden panel full flex center" style="flex-direction:column; padding:40px; text-align:center;">
          <h3 class="stat-label">LOBBY DE EMBARQUE</h3>
          <div id="lobby-agents-list" style="margin:20px 0; display:flex; flex-direction:column; gap:10px; width:400px;"></div>
          <div id="lobby-status-msg" class="text-dim" style="font-size:14px; margin-bottom:20px;">AGUARDANDO TODOS OS AGENTES...</div>
          <button id="btn-start-travel" class="btn hidden" style="width:400px; height:60px; font-size:24px; border-color:var(--amber); color:var(--amber);">[ INICIAR VIAGEM ]</button>
      </div>
      <div id="travel-animation-overlay" class="hidden" style="position:fixed; inset:0; background:#000; z-index:10001; display:flex; flex-direction:column; align-items:center; justify-content:center; overflow:hidden;">
        <!-- HUD de Viagem Cinematic -->
        <div id="travel-hud" style="width:100%; height:100%; position:relative; overflow:hidden; background:#000;">
            <div id="travel-viz-container" style="position:absolute; inset:0; transition: transform 2s ease-in-out;">
             <svg id="travel-viz-svg" viewBox="0 0 600 600" style="width:100%; height:100%;">
                <g id="travel-camera-g" style="transition: transform 5s cubic-bezier(0.22, 1, 0.36, 1);">
                  <g id="travel-bg-layer"></g>
                  <g id="travel-path-layer"></g>
                  <g id="travel-ship-marker-group" style="transition: all 1s linear;">
                    <!-- Ship Icon Silhouette (SVG) -->
                    <path id="travel-ship-icon" d="M0,-10 L8,10 L0,5 L-8,10 Z" fill="var(--green)" style="filter:drop-shadow(0 0 8px var(--green));" />
                    <circle r="12" fill="none" stroke="var(--green)" stroke-width="0.5" opacity="0.3">
                      <animate attributeName="r" from="8" to="16" dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.3" to="0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  </g>
                </g>
             </svg>
            </div>

           <!-- HUD Overlays -->
           <div class="hud-frame" style="position:absolute; inset:20px; border:1px solid rgba(0,255,65,0.2); pointer-events:none; display:flex; flex-direction:column; justify-content:space-between; padding:20px;">
              <div style="display:flex; justify-content:space-between; font-family:var(--font-code); width:100%;">
                <div style="color:var(--green); font-size:12px; letter-spacing:2px; flex:1;">[ SISTEMA DE NAVEGAÇÃO O.R.T. ]<br><span id="hud-planet-name">ESCANEANDO...</span></div>
                <div style="flex:1; display:flex; flex-direction:column; align-items:flex-end;">
                  <div style="color:var(--amber); font-size:12px;">VELOCIDADE: <span id="hud-speed">0</span> LY/S</div>
                  <div style="width:200px; margin-top:5px;">
                    <div style="display:flex; justify-content:space-between; font-size:9px; color:var(--red-alert);"><span>INTEGRIDADE</span><span id="hud-integrity">100%</span></div>
                    <div class="rpg-bar-container" style="height:6px; margin:2px 0;"><div id="hud-integrity-bar" class="rpg-bar-fill hp-fill" style="width:100%"></div></div>
                    <div style="display:flex; justify-content:space-between; font-size:9px; color:var(--green);"><span>COMBUSTÍVEL</span><span id="hud-fuel">100%</span></div>
                    <div class="rpg-bar-container" style="height:6px; margin:2px 0;"><div id="hud-fuel-bar" class="rpg-bar-fill sp-fill" style="width:100%"></div></div>
                  </div>
                  <!-- Novo: Lista de Tripulação no HUD -->
                  <div id="hud-crew-list" style="margin-top:10px; width:200px; font-family:var(--font-code); font-size:9px; color:var(--green-mid); text-align:right;">
                    TRI: [ AGENTE ]
                  </div>
                </div>
              </div>

              <div style="display:flex; justify-content:space-between; align-items:flex-end;">
                 <div style="display:flex; flex-direction:column; gap:10px;">
                   <!-- Quick Access Buttons -->
                   <div style="display:flex; gap:10px; pointer-events:all;">
                     <button class="btn" onclick="Desktop.openApp('stats')" style="font-size:10px; padding:3px 8px; border-color:var(--green-mid); color:var(--green-mid);">[ STATUS ]</button>
                     <button class="btn" onclick="Desktop.openApp('inventory')" style="font-size:10px; padding:3px 8px; border-color:var(--green-mid); color:var(--green-mid);">[ INVENTÁRIO ]</button>
                     ${Auth.isAdmin() ? `<button class="btn" onclick="Desktop.openApp('combat')" style="font-size:10px; padding:3px 8px; border-color:var(--red-alert); color:var(--red-alert);">[ SINCRO COMBATE ]</button>` : ''}
                   </div>
                   <div id="travel-event-log" style="width:400px; height:100px; padding:10px; background:rgba(0,40,0,0.4); border-left:2px solid var(--green); font-size:11px; color:var(--green-mid); overflow-y:auto; line-height:1.4;">
                      > INICIANDO SEQUÊNCIA DE SALTO...
                   </div>
                 </div>
                   <div id="travel-finish-container" class="hidden" style="display:flex; gap:10px;">
                     <button class="btn btn-action-danger" id="btn-abort-voyage" style="width:180px; height:50px; font-size:12px; pointer-events:all; display:none;">[ ABORTAR ROTA ]</button>
                     <button class="btn" id="btn-next-jump" style="width:180px; height:50px; font-size:12px; border-color:var(--amber); color:var(--amber); pointer-events:all; display:none;">[ INICIAR SALTO ]</button>
                     <button class="btn" id="btn-roll-scanners" style="width:180px; height:50px; font-size:12px; border-color:var(--red-alert); color:var(--red-alert); background:rgba(255,0,0,0.1); pointer-events:all; display:none;">[ RODAR SCANNERS ]</button>
                     <button class="btn" id="btn-travel-refuel" style="width:180px; height:50px; font-size:12px; border-color:var(--green); color:var(--green); pointer-events:all; display:none;">[ REABASTECER ]</button>
                     <button class="btn" id="btn-finish-voyage" style="width:180px; height:50px; font-size:12px; border-color:var(--green); color:var(--green); pointer-events:all; display:none;">[ POUSAR NAVE ]</button>
                   </div>
              </div>
           </div>
           
           <!-- Scanline Effect -->
           <div class="scan-effect" style="position:absolute; inset:0; pointer-events:none; opacity:0.1; background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06)); background-size: 100% 2px, 3px 100%;"></div>
        </div>
      </div>`;
  }

  /* ── Ship & Travel Shared Logic ── */
  function switchShipTab(tab) {
    const ownBtn = $('tab-own-ship');
    const localBtn = $('tab-local-ships');
    const ownArea = $('ship-details-area');
    const localArea = $('ship-local-list-area');

    if (!ownBtn || !localBtn) return;

    ownBtn.classList.remove('active');
    localBtn.classList.remove('active');
    if (ownArea) ownArea.classList.add('hidden');
    if (localArea) localArea.classList.add('hidden');

    if (tab === 'own') {
      ownBtn.classList.add('active');
      if (ownArea) ownArea.classList.remove('hidden');
      const travelBtns = $('ship-travel-btns');
      if (travelBtns) travelBtns.style.display = '';
      loadShipData(false);
    } else {
      localBtn.classList.add('active');
      if (localArea) localArea.classList.remove('hidden');
      loadLocalShips();
    }
  }

  async function loadLocalShips() {
    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;

    const profile = Auth.getProfile();
    const currentPlanet = profile?.current_planet;
    if (!currentPlanet) return; // Evita crash se o perfil ainda não carregou

    const listArea = $('local-ships-results');
    const nameEl = $('ship-name');
    const plateEl = $('ship-plate');

    if (nameEl) nameEl.textContent = 'SCANNER ATIVO...';
    if (plateEl) plateEl.textContent = `SETOR: ${currentPlanet.toUpperCase()}`;
    if (listArea) listArea.innerHTML = `<div class="empty-state">ESCANEANDO...</div>`;

    const { data: localShips } = await db.from('ships').select('*').eq('current_planet', currentPlanet);

    if (!localShips || !localShips.length) {
      if (listArea) listArea.innerHTML = `<div class="empty-state">NENHUMA NAVE DETECTADA NESTE SETOR.</div>`;
      return;
    }

    const others = localShips.filter(s => s.owner_id !== user.id);

    if (!others.length) {
      if (nameEl) nameEl.innerHTML = '<span class="text-dim">NENHUMA NAVE ENCONTRADA</span>';
      if (listArea) listArea.innerHTML = `<div class="empty-state">NENHUMA NAVE DE TERCEIROS NESTE PLANETA</div>`;
      return;
    }

    if (nameEl) nameEl.textContent = 'NAVES LOCAIS DETECTADAS';

    if (listArea) {
      listArea.innerHTML = others.map(s => `
        <div class="panel-box" style="padding:15px; display:flex; justify-content:space-between; align-items:center; border-left:3px solid var(--green);">
          <div>
            <div style="color:var(--green); font-weight:bold; font-size:14px;">${s.name.toUpperCase()}</div>
            <div style="font-size:9px; color:var(--text-dim);">LICENÇA: ${s.license_plate || '???'}</div>
          </div>
          <button class="btn btn-mini" onclick="Apps.viewLocalShip('${s.id}')">[ MONITORAR ]</button>
        </div>
      `).join('');
    }
  }

  async function viewLocalShip(shipId) {
    const db = Auth.db();
    if (!db) return;

    const { data: ship } = await db.from('ships').select('*').eq('id', shipId).single();
    if (!ship) return;

    // Mostrar área de detalhes com dados da nave de terceiro
    const ownArea = $('ship-details-area');
    const localArea = $('ship-local-list-area');
    if (ownArea) ownArea.classList.remove('hidden');
    if (localArea) localArea.classList.add('hidden');

    if ($('ship-name')) $('ship-name').textContent = ship.name.toUpperCase();
    if ($('ship-plate')) $('ship-plate').textContent = `LICENÇA: ${ship.license_plate || '???'} | LOC: ${ship.current_planet.toUpperCase()}`;

    // Esconder botões de viagem (apenas o dono viaja)
    const travelBtns = $('ship-travel-btns');
    if (travelBtns) travelBtns.style.display = 'none';

    // Mostrar stats e manifesto da nave de terceiro
    const stats = ship.stats || { security: '-', armaments: '-', system: '-' };
    if ($('ship-stat-sec')) $('ship-stat-sec').textContent = stats.security;
    if ($('ship-stat-arm')) $('ship-stat-arm').textContent = stats.armaments;
    if ($('ship-stat-sys')) $('ship-stat-sys').textContent = stats.system;

    const fuel = ship.fuel || 0;
    if ($('ship-fuel-text')) $('ship-fuel-text').textContent = `${fuel}/100`;
    if ($('ship-fuel-bar')) $('ship-fuel-bar').style.width = `${fuel}%`;

    const integrity = ship.integrity !== undefined ? ship.integrity : 100;
    if ($('ship-integrity-text')) $('ship-integrity-text').textContent = `${integrity}/100`;
    if ($('ship-integrity-bar')) $('ship-integrity-bar').style.width = `${integrity}%`;

    loadShipPassengers(ship.id, ship.owner_id, ship.passenger_capacity || 4, ship.current_planet);
  }

  async function loadShipData(searchLocal = false) {
    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;

    if ($('ship-name')) $('ship-name').textContent = 'BUSCANDO NAVE...';

    // Fetch fresh profile to circumvent cache staleness
    const { data: profile } = await db.from('profiles').select('active_ship_id, current_planet').eq('id', user.id).single();

    // Carregar Nave Ativa (Garagem)
    const activeShipId = profile?.active_ship_id;
    let ship = null;

    if (activeShipId) {
      const { data: activeShipData } = await db.from('ships').select('*').eq('id', activeShipId).single();
      ship = activeShipData;
    }

    const nameEl = $('ship-name');
    const plateEl = $('ship-plate');
    const travelBtns = $('ship-travel-btns');

    if (!nameEl || !plateEl) return;

    if (!ship) {
      nameEl.innerHTML = '<span class="text-dim">NENHUMA NAVE ATIVA</span>';
      plateEl.textContent = 'VISITE A GARAGEM O.R.T. PARA ATIVAR UMA NAVE';
      if ($('ship-stat-sec')) $('ship-stat-sec').textContent = '-';
      if ($('ship-stat-arm')) $('ship-stat-arm').textContent = '-';
      if ($('ship-stat-sys')) $('ship-stat-sys').textContent = '-';
      if ($('ship-fuel-text')) $('ship-fuel-text').textContent = '0/100';
      if ($('ship-fuel-bar')) $('ship-fuel-bar').style.width = '0%';
      if ($('ship-integrity-text')) $('ship-integrity-text').textContent = '0/100';
      if ($('ship-integrity-bar')) $('ship-integrity-bar').style.width = '0%';
      if (travelBtns) travelBtns.style.display = 'none';
      if ($('ship-passenger-list')) $('ship-passenger-list').innerHTML = '<div class="text-dim item-box" style="margin-top:20px; text-align:center;">SEM NAVE ATIVA</div>';
      return;
    }

    nameEl.textContent = ship.name?.toUpperCase() || 'SEM NOME';
    const loc = (ship.current_planet || profile?.current_planet || '???').toUpperCase();
    plateEl.innerHTML = `<div style="display:flex; flex-direction:column; gap:4px; font-size:12px; margin-top:5px;">
      <span style="color:var(--text-dim);">LICENÇA: <span style="color:var(--green);">${ship.license_plate || '???'}</span></span>
      <span style="color:var(--text-dim);">LOCAL: <span style="color:var(--green);">${loc}</span></span>
    </div>`;

    // Ensure own-ship detail area is visible
    if (travelBtns) travelBtns.style.display = '';

    // Stats
    const stats = ship.stats || { security: 1, armaments: 1, system: 1 };
    if ($('ship-stat-sec')) $('ship-stat-sec').textContent = stats.security;
    if ($('ship-stat-arm')) $('ship-stat-arm').textContent = stats.armaments;
    if ($('ship-stat-sys')) $('ship-stat-sys').textContent = stats.system;

    // Fuel
    const fuel = ship.fuel || 0;
    if ($('ship-fuel-text')) $('ship-fuel-text').textContent = `${fuel}/100`;
    if ($('ship-fuel-bar')) $('ship-fuel-bar').style.width = `${fuel}%`;

    // Integrity
    const integrity = ship.integrity !== undefined ? ship.integrity : 100;
    if ($('ship-integrity-text')) $('ship-integrity-text').textContent = `${integrity}/100`;
    if ($('ship-integrity-bar')) $('ship-integrity-bar').style.width = `${integrity}%`;

    // Cargo & Passengers
    loadShipCargo(ship.cargo || []);
    loadShipPassengers(ship.id, ship.owner_id, ship.passenger_capacity || 4, ship.current_planet);
  }

  async function loadShipPassengers(shipId, ownerId, capacity, shipLocation) {
    const db = Auth.db();
    const user = Auth.getUser();
    const list = $('ship-passenger-list');
    const bar = $('ship-occupancy-bar');
    const btnBoard = $('btn-board-ship');
    if (!db || !user || !list) return;

    // Fetch passengers with profile data
    const { data: passengers } = await db.from('ship_passengers')
      .select('*, profiles(display_name, username, current_planet)')
      .eq('ship_id', shipId);

    const crew = passengers || [];
    const isOwner = ownerId === user.id;
    const isPassenger = crew.some(p => p.user_id === user.id);

    // Render List
    if (!crew.length) {
      list.innerHTML = `<div class="empty-state">NENHUM PASSAGEIRO</div>`;
    } else {
      list.innerHTML = crew.map(p => {
        const name = (p.npc_name || p.profiles?.display_name || p.profiles?.username || 'ANÔNIMO').toUpperCase();
        const canKick = isOwner || p.user_id === user.id;
        const actionLabel = p.user_id === user.id ? 'SAIR' : 'EXPULSAR';
        return `
          <div class="passenger-item" style="padding:8px; border-bottom:1px solid var(--border-dim); display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="color:var(--green); font-size:10px;">◈</span>
              <span>${name}</span>
            </div>
            ${canKick ? `<button class="btn btn-mini" style="border-color:var(--red-alert); color:var(--red-alert);" onclick="Apps.unboardShip('${p.id}')">[ ${actionLabel} ]</button>` : ''}
          </div>
        `;
      }).join('');
    }

    // Occupancy
    const occupied = crew.length;
    if (bar) bar.textContent = `OCUPAÇÃO: ${occupied}/${capacity}`;

    // Board Button Visibility & Location Restriction
    if (btnBoard) {
      const userProfile = Auth.getProfile();
      const sameLocation = userProfile?.current_planet === shipLocation;

      if (!isOwner && !isPassenger && occupied < capacity && sameLocation) {
        btnBoard.style.display = 'block';
      } else {
        btnBoard.style.display = 'none';
      }
    }
  }

  async function boardShip(shipId) {
    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;

    let ship = null;
    if (shipId) {
      // Called directly with a shipId (from viewLocalShip flow)
      const { data } = await db.from('ships').select('*').eq('id', shipId).single();
      ship = data;
    } else {
      // Fallback: search by name displayed in the HUD
      const shipNameEl = $('ship-name');
      if (!shipNameEl || !shipNameEl.textContent) return;
      const { data: targetShips } = await db.from('ships').select('*').ilike('name', shipNameEl.textContent.trim());
      ship = targetShips?.[0];
    }

    if (!ship) {
      showNotification('SISTEMA', 'NAVE NÃO ENCONTRADA.', 'error');
      return;
    }

    // RESTRIÇÃO DE LOCALIZAÇÃO (RPG)
    const profile = Auth.getProfile();
    const myPlanet = profile?.current_planet;
    const shipPlanet = ship.current_planet;
    if (!myPlanet || !shipPlanet || myPlanet !== shipPlanet) {
      showNotification('SISTEMA DE EMBARQUE', 'A NAVE NÃO ESTÁ NESTE PLANETA. ACESSO NEGADO.', 'error');
      return;
    }

    const { error } = await db.from('ship_passengers').insert({
      ship_id: ship.id,
      user_id: user.id
    });

    if (error) {
      showNotification('ERRO NO EMBARQUE', 'VOCÊ JÁ ESTÁ EM UMA NAVE OU ELA ESTÁ CHEIA.', 'error');
    } else {
      showNotification('BEM-VINDO A BORDO', `VOCÊ EMBARCOU NA NAVE ${ship.name?.toUpperCase()}.`, 'success');
      loadShipData();
    }
  }

  async function unboardShip(passengerId) {
    const db = Auth.db();
    if (!db) return;

    const { error } = await db.from('ship_passengers').delete().eq('id', passengerId);
    if (!error) {
      showNotification('DESEMBARQUE', 'VOCÊ OU O TRIPULANTE SAIU DA NAVE.', 'success');
      loadShipData();
    }
  }

  function loadShipCargo(items) {
    const list = $('ship-cargo-list');
    if (!list) return;
    if (!items.length) {
      list.innerHTML = `<div class="empty-state">CARGO VAZIO</div>`;
      return;
    }
    list.innerHTML = items.map(i => `
      <div class="ship-cargo-item" style="padding:8px; border-bottom:1px solid var(--border-dim); display:flex; justify-content:space-between;">
        <span>${i.name.toUpperCase()}</span>
        <span class="text-dim">x${i.qty || 1}</span>
      </div>
    `).join('');
  }

  async function openRefuelMenu() {
    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;

    const { data: profile } = await db.from('profiles').select('credits').eq('id', user.id).single();
    const { data: ships } = await db.from('ships').select('*').eq('owner_id', user.id);
    const ship = ships?.[0];
    if (!ship) return;

    const { data: inventory } = await db.from('inventory').select('*, store_items(*)').eq('user_id', user.id);
    const fuelItems = inventory?.filter(inv => inv.store_items?.category === 'fuel') || [];

    const fuelPricePerUnit = 5; // CR$ por 1% de combustível
    const needed = 100 - (ship.fuel || 0);
    const maxCreditsBuy = Math.floor((profile?.credits || 0) / fuelPricePerUnit);
    const buyAmount = Math.min(needed, maxCreditsBuy);

    let html = `
      <div style="padding:10px;">
        <p style="color:var(--green-mid); font-size:12px; margin-bottom:15px;">ESTAÇÃO DE REABASTECIMENTO O.R.T.</p>
        
        <div class="panel-box" style="border-color:var(--amber);">
          <h4 style="color:var(--amber); margin-bottom:10px;">1. REABASTECER COM CRÉDITOS</h4>
          <p style="font-size:13px; margin-bottom:10px;">PREÇO: ${fuelPricePerUnit} CR$ / 1%</p>
          <div style="display:flex; gap:10px; align-items:center;">
             <input type="number" id="refuel-credits-amount" value="${buyAmount}" min="1" max="${needed}" style="width:80px;">
             <button class="btn" onclick="Apps.handleRefuel('credits')">[ COMPRAR ${buyAmount * fuelPricePerUnit} CR$ ]</button>
          </div>
          <p style="font-size:11px; color:var(--green-dim); margin-top:5px;">SEU SALDO: ${profile?.credits?.toLocaleString()} CR$</p>
        </div>

        <div class="panel-box" style="border-color:var(--green);">
          <h4 style="color:var(--green); margin-bottom:10px;">2. USAR GALÕES DO INVENTÁRIO</h4>
          <div id="fuel-items-list">
            ${fuelItems.length ? fuelItems.map(inv => `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:8px; border-bottom:1px solid var(--border-dim);">
                <span>${inv.store_items.name.toUpperCase()} (${inv.remaining_uses || inv.store_items.technical_meta?.initial_uses || 1} USOS)</span>
                <button class="btn" onclick="Apps.handleRefuel('item', '${inv.id}')" style="font-size:11px; padding:2px 8px;">[ USAR ]</button>
              </div>
            `).join('') : '<div class="text-dim" style="font-size:12px;">NENHUM ITEM DE COMBUSTÍVEL ENCONTRADO.</div>'}
          </div>
        </div>
      </div>
    `;

    showModal({
      title: 'MENU DE REABASTECIMENTO',
      body: html,
      noConfirm: true
    });

    // Sync input price
    const input = $('refuel-credits-amount');
    if (input) {
      input.oninput = () => {
        const amt = parseInt(input.value) || 0;
        const btn = input.nextElementSibling;
        if (btn) btn.textContent = `[ COMPRAR ${amt * fuelPricePerUnit} CR$ ]`;
      };
    }
  }

  async function handleRefuel(type, targetId) {
    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;

    const { data: ships } = await db.from('ships').select('*').eq('owner_id', user.id);
    const ship = ships?.[0];
    if (!ship) return;

    const currentFuel = ship.fuel || 0;
    if (currentFuel >= 100) {
      showNotification('TANQUE CHEIO', 'A NAVE JÁ ESTÁ TOTALMENTE ABASTECIDA.', 'warning');
      return;
    }

    if (type === 'credits') {
      const fuelPricePerUnit = 5;
      const amount = parseInt($('refuel-credits-amount')?.value) || 0;
      const totalCost = amount * fuelPricePerUnit;

      const { data: profile } = await db.from('profiles').select('credits').eq('id', user.id).single();
      if (!profile || profile.credits < totalCost) {
        showNotification('CRÉDITOS INSUFICIENTES', 'VOCÊ NÃO TEM SALDO PARA ESTA OPERAÇÃO.', 'error');
        return;
      }

      const newFuel = Math.min(100, currentFuel + amount);
      const newCredits = profile.credits - totalCost;

      await db.from('profiles').update({ credits: newCredits }).eq('id', user.id);
      await db.from('ships').update({ fuel: newFuel }).eq('id', ship.id);

      // Sync with active voyage if exists
      if (window._activeVoyageStats) {
        window._activeVoyageStats.fuel = newFuel;
      }

      showNotification('REABASTECIDO', `NAVE ABASTECIDA COM SUCESSO. (+${newFuel - currentFuel}%)`, 'success');
    } else if (type === 'item') {
      const { data: inv } = await db.from('inventory').select('*, store_items(*)').eq('id', targetId).single();
      if (!inv) return;

      const recovery = inv.store_items.technical_meta?.recovery_amount || 25; // Default 25% for inventory fuel
      const newFuel = Math.min(100, currentFuel + recovery);

      // Consumir uso do item
      const initialUses = inv.store_items.technical_meta?.initial_uses || 1;
      const currentUses = inv.remaining_uses !== undefined ? inv.remaining_uses : initialUses;
      const nextUses = currentUses - 1;

      if (nextUses > 0) {
        await db.from('inventory').update({ remaining_uses: nextUses }).eq('id', targetId);
      } else {
        await db.from('inventory').delete().eq('id', targetId);
      }

      await db.from('ships').update({ fuel: newFuel }).eq('id', ship.id);

      // Sync with active voyage if exists
      if (window._activeVoyageStats) {
        window._activeVoyageStats.fuel = newFuel;
      }

      showNotification('CARGA UTILIZADA', `NAVE REESTABELECIDA EM ${recovery}%.`, 'success');
    }

    // Refresh UI
    loadShipData();
    updateUserCreditsDisplay();
    closeModal();
    if (type === 'item') loadInventory();
  }

  async function prepShipTravel(type) {
    if (type === 'mission') {
      const db = Auth.db();
      const user = Auth.getUser();
      const { data: assignments } = await db.from('mission_assignments').select('*, missions(*)').eq('user_id', user.id).eq('status', 'accepted');
      if (!assignments?.length) {
        showNotification('NAVEGAÇÃO', 'NENHUMA MISSÃO ATIVA ENCONTRADA.', 'warning');
        return;
      }

      const assignment = assignments[0];
      const missionData = assignment.missions;
      let targetPlanet = missionData?.target_planet;

      // Fallback: extract from route if target_planet is missing
      if (!targetPlanet && missionData?.route) {
        const parts = missionData.route.split(' -> ');
        targetPlanet = parts.length > 1 ? parts[parts.length - 1].trim() : parts[0].trim();
      }

      if (!targetPlanet) {
        showNotification('NAVEGAÇÃO', 'DESTINO DA MISSÃO NÃO DEFINIDO.', 'error');
        return;
      }

      setCustomVoyageDestination(targetPlanet);
    } else {
      // Viagem Normal -> Abrir Mapa em modo de seleção
      window._mapSelectMode = true;
      Desktop.openApp('map');
      showNotification('NAVEGAÇÃO', 'SELECIONE O PLANETA DE DESTINO NO MAPA.', 'info');
    }
  }

  function initShipApp() {
    loadShipData();
    if (window._subscribeShipData) window._subscribeShipData();
  }

  async function generateTravelTicket(missionId, userId) {
    const db = Auth.db();
    if (!db) return;

    // Get agent's CURRENT LOCATION from their profile
    const { data: profile } = await db.from('profiles').select('current_planet').eq('id', userId).single();
    let currentPlanet = profile?.current_planet || 'Capitolio';

    const { data: m } = await db.from('missions').select('*').eq('id', missionId).single();
    let targetPlanet = m?.target_planet || '';

    let path = [];
    if (currentPlanet && targetPlanet && window.MapApp && MapApp.calculateGalacticRoute) {
      path = MapApp.calculateGalacticRoute(currentPlanet, targetPlanet).map(p => p.id);
    }

    // Generate UNIQUE ticket for this specific agent's travel registration
    const ticket = 'ID-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

    const { error } = await db.from('travel_registrations').insert({
      mission_id: missionId,
      user_id: userId,
      ticket_code: ticket,
      status: 'waiting',
      type: 'agency',
      current_planet: currentPlanet,
      target_planet: targetPlanet,
      path: path
    });

    if (!error) {
      showNotification('PASSAGEM EMITIDA', `ID DE VIAGEM: ${ticket}<br>USE NO APP MINHA VIAGEM.`, 'success');
    } else {
      console.error("Failed to generate travel ticket:", error);
    }
  }

  let _lobbySubscription = null;
  function subscribeTravelLobby(lobbyId, missionId, travelType) {
    const db = Auth.db();
    if (!db) return;

    if (_lobbySubscription) _lobbySubscription.unsubscribe();

    const list = $('lobby-agents-list');
    const msg = $('lobby-status-msg');
    const startBtn = $('btn-start-travel');

    const updateUI = async () => {
      let members = [];
      let assignedCount = 1; // Default to 1 for private non-mission travels

      if (travelType === 'commercial') {
        const { data } = await db.from('travel_registrations')
          .select('*, profiles(display_name, username)')
          .like('ticket_code', `${lobbyId}-%`);
        members = data || [];

        const { data: comFlight } = await db.from('commercial_flights')
          .select('total_tickets')
          .eq('ticket_code', lobbyId)
          .maybeSingle();
        assignedCount = comFlight?.total_tickets || 1;
      } else if (missionId) {
        const { data } = await db.from('travel_registrations')
          .select('*, profiles(display_name, username)')
          .eq('mission_id', missionId);
        members = data || [];

        const { data: assignments } = await db.from('mission_assignments')
          .select('user_id')
          .eq('mission_id', missionId)
          .in('status', ['accepted', 'active']);
        assignedCount = assignments?.length || 1;
      } else {
        const { data } = await db.from('travel_registrations')
          .select('*, profiles(display_name, username)')
          .eq('ticket_code', lobbyId);
        members = data || [];
      }

      // People are joined only if they opened the lobby with their ticket (status active/ready/waiting, but 'ready' means they clicked Join)
      const readyMembers = members.filter(m => m.status === 'ready' || m.status === 'active');
      const joinedCount = readyMembers.length;

      if (list) {
        // Show only the members that have successfully 'joined' the lobby
        list.innerHTML = readyMembers.map(m => `
           <div class="agent-row" style="display:flex; justify-content:space-between; padding:8px; background:rgba(0,255,65,0.1); border-left:3px solid var(--green);">
             <span>${(m.profiles?.display_name || m.profiles?.username || 'AGENTE').toUpperCase()}</span>
             <span style="color:var(--green); font-size:10px;">[ PRONTO ]</span>
           </div>
         `).join('');
      }

      const allJoined = joinedCount >= assignedCount;

      if (startBtn) {
        startBtn.classList.toggle('hidden', !allJoined);
        startBtn.style.display = ''; // Clear inline block from previous attempts
      }

      if (msg) {
        if (allJoined) {
          msg.innerHTML = '<span style="color:var(--green);">PROTOCOLO DE EMBARQUE CONCLUÍDO.</span>';
        } else {
          msg.innerHTML = `<span style="color:var(--amber);">AGUARDANDO TRIPULAÇÃO DESIGNADA (${joinedCount}/${assignedCount})</span>`;
        }
      }
    };

    const filterString = travelType === 'commercial' ? null : (missionId ? `mission_id=eq.${missionId}` : `ticket_code=eq.${lobbyId}`);

    _lobbySubscription = db.channel('public:travel_registrations:' + lobbyId)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'travel_registrations', ...(filterString ? { filter: filterString } : {}) }, () => {
        updateUI();
      })
      .on('broadcast', { event: 'jump_start' }, (payload) => {
        // Received hyperspace signal from another crew member!
        if ($('travel-id-input')) $('travel-id-input').value = payload.payload.ticket;
        startVoyage(payload.payload.ticket, payload.payload.mission, true);
      })
      .subscribe();

    updateUI();
  }

  function initTravelApp() { }

  /* ══════════════════════════════════════════════════════════
     DICE ROLL ANIMATION
  ══════════════════════════════════════════════════════════ */
  function showDiceAnimation(roll, sec, total, isSuccess) {
    return new Promise(resolve => {
      // Prevent overlapping animations
      if ($('dice-anim-overlay')) $('dice-anim-overlay').remove();

      const overlay = document.createElement('div');
      overlay.id = 'dice-anim-overlay';
      overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,10,0,0.95);
        z-index: 10000000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--green);
        font-family: var(--font-logo);
        text-align: center;
      `;

      const title = document.createElement('div');
      title.textContent = 'VARREDURA DE SETOR';
      title.style.fontSize = '24px';
      title.style.marginBottom = '30px';
      title.className = 'glow blink';

      const diceBox = document.createElement('div');
      diceBox.style.cssText = `
        width: 120px;
        height: 120px;
        border: 2px solid var(--green);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 48px;
        margin-bottom: 20px;
        box-shadow: 0 0 20px var(--green-glow);
      `;

      const modifierBox = document.createElement('div');
      modifierBox.style.fontSize = '14px';
      modifierBox.style.marginTop = '10px';
      modifierBox.style.opacity = '0';
      modifierBox.style.transition = 'opacity 0.5s ease';
      modifierBox.innerHTML = `MODIFICADOR DE SEGURANÇA: <span style="color:var(--amber)">+${sec}</span>`;

      const resultBox = document.createElement('div');
      resultBox.style.fontSize = '24px';
      resultBox.style.marginTop = '20px';
      resultBox.style.opacity = '0';
      resultBox.style.transition = 'opacity 0.5s ease';

      overlay.appendChild(title);
      overlay.appendChild(diceBox);
      overlay.appendChild(modifierBox);
      overlay.appendChild(resultBox);

      document.body.appendChild(overlay);

      Boot.playBeep(440, 0.1, 0.1);

      let frames = 0;
      const maxFrames = 30; // 30 frames of rolling
      const interval = setInterval(() => {
        diceBox.textContent = Math.floor(Math.random() * 20) + 1;
        Boot.playBeep(800 + Math.random() * 400, 0.02, 0.05);
        frames++;
        if (frames >= maxFrames) {
          clearInterval(interval);
          finishRoll();
        }
      }, 50);

      function finishRoll() {
        diceBox.textContent = roll;
        diceBox.style.color = roll === 1 ? 'var(--red-alert)' : roll === 20 ? 'var(--amber)' : 'var(--green)';
        diceBox.classList.add('pulse');

        Boot.playBeep(1200, 0.2, 0.2);

        setTimeout(() => {
          modifierBox.style.opacity = '1';
          Boot.playBeep(880, 0.1, 0.1);

          setTimeout(() => {
            resultBox.textContent = `TOTAL: ${total}`;
            if (isSuccess) {
              resultBox.innerHTML += `<br><span style="color:var(--green); font-size:36px; display:block; margin-top:10px;" class="glow">SUCESSO</span>`;
              Boot.playBeep(1500, 0.5, 0.1);
            } else {
              resultBox.innerHTML += `<br><span style="color:var(--red-alert); font-size:36px; display:block; margin-top:10px;" class="glow">FALHA</span>`;
              Boot.playBeep(200, 0.8, 0.5);
            }
            resultBox.style.opacity = '1';

            setTimeout(() => {
              overlay.style.opacity = '0';
              overlay.style.transition = 'opacity 1s ease';
              setTimeout(() => { overlay.remove(); resolve(); }, 1000);
            }, 3500);
          }, 1000);
        }, 1000);
      }
    });
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
      <div style="display:grid; grid-template-rows:auto 1fr; height:100%; gap:0;">
        <div class="app-toolbar" style="display:flex; gap:10px; border-bottom:1px solid var(--border-dim); padding-bottom:15px;">
          <button class="btn ${_adminTab === 'agents' ? 'active' : ''}" onclick="Apps.switchAdminTab('agents')">[ AGENTES ]</button>
          <button class="btn ${_adminTab === 'items' ? 'active' : ''}" onclick="Apps.switchAdminTab('items')">[ ITENS ]</button>
          <button class="btn ${_adminTab === 'missions' ? 'active' : ''}" onclick="Apps.switchAdminTab('missions')">[ MISSÕES ]</button>
          <button class="btn ${_adminTab === 'travel' ? 'active' : ''}" onclick="Apps.switchAdminTab('travel')">[ VIAGENS ]</button>
        </div>
        <div id="admin-tab-content" style="padding:20px; overflow-y:auto;">
          <div class="loading-state">SINCRONIZANDO MAINFRAME...</div>
        </div>
      </div>`;
  }

  function switchAdminTab(tab) {
    _adminTab = tab;
    loadAdminTab();
  }

  function loadAdminTab() {
    document.querySelectorAll('#overlay-admin .app-toolbar .btn').forEach(b => {
      b.classList.toggle('active', b.onclick.toString().includes(`'${_adminTab}'`));
    });
    renderAdminTabContent();
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
               <option value="ship">NAVE</option>
               <option value="fuel">COMBUSTÍVEL</option>
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
    $('adm-tab-missions')?.addEventListener('click', () => { _adminTab = 'missions'; renderAdminTabContent(); });
    $('adm-tab-combat')?.addEventListener('click', () => { _adminTab = 'combat'; renderAdminTabContent(); });

    renderAdminTabContent();
  }

  function renderAdminTravel() {
    return `
      <div class="login-label" style="margin-bottom:15px;">> CENTRAL DE REGISTROS DE VIAGEM</div>
      <div style="border-bottom:1px solid var(--border);padding:6px 12px;display:grid;grid-template-columns:1fr 1fr 1fr 1fr auto;gap:12px;font-family:var(--font-code);font-size:11px;color:var(--green-mid);letter-spacing:1px;text-transform:uppercase;">
        <span>TICKET</span><span>AGENTE</span><span>ROTA</span><span>STATUS</span><span>AÇÃO</span>
      </div>
      <div id="admin-travel-list"><div class="loading-state">ESCANEANDO TRAJETÓRIAS<span class="loading-dots"></span></div></div>`;
  }

  async function loadAdminTravels() {
    const list = $('admin-travel-list');
    if (!list) return;
    const db = Auth.db();
    if (!db) return;

    const { data, error } = await db.from('travel_registrations')
      .select('*, profiles(display_name, username)')
      .order('created_at', { ascending: false });

    if (error) {
      list.innerHTML = `<div class="empty-state">ERRO AO CARREGAR: ${error.message}</div>`;
      return;
    }

    if (!data?.length) {
      list.innerHTML = `<div class="empty-state">NENHUMA VIAGEM ATIVA NO MOMENTO</div>`;
      return;
    }

    list.innerHTML = data.map(t => {
      const agent = t.profiles?.display_name || t.profiles?.username || 'Desconhecido';
      const isPaused = t.is_paused;
      const routeExtra = isPaused ? `<br><span style="color:var(--red-alert); font-size:9px;">BLOQUEIO: ${t.current_event || 'ANOMALIA'}</span>` : '';
      const badgeText = isPaused ? 'PAUSADA' : t.status.toUpperCase();
      const badgeClass = isPaused ? 'status-waiting' : t.status;

      let actionHtml;
      if (isPaused) {
        actionHtml = `<div style="display:flex; gap:5px;">
           <button class="btn" onclick="Apps.resumeAdminTravel('${t.ticket_code}')" style="font-size:10px;padding:3px 6px; border-color:var(--green); color:var(--green);">[ LIBERAR ]</button>
           <button class="btn btn-action-danger" onclick="Apps.deleteAdminTravel('${t.ticket_code}')" style="font-size:10px;padding:3px 6px;">[ X ]</button>
        </div>`;
      } else {
        actionHtml = `<button class="btn btn-action-danger" onclick="Apps.deleteAdminTravel('${t.ticket_code}')" style="font-size:11px;padding:3px 8px;">[ CANCELAR ]</button>`;
      }

      return `
        <div class="admin-user-row" style="grid-template-columns:1fr 1fr 1fr 1fr auto; align-items:center;">
          <span style="color:var(--amber);">${t.ticket_code}</span>
          <span>${agent}</span>
          <span style="font-size:10px; line-height:1.2;">${t.current_planet} -> ${t.target_planet}${routeExtra}</span>
          <span class="role-badge ${badgeClass}">${badgeText}</span>
          ${actionHtml}
        </div>`;
    }).join('');
  }

  async function resumeAdminTravel(ticketCode) {
    const db = Auth.db();
    const { error } = await db.from('travel_registrations').update({ is_paused: false, current_event: null }).eq('ticket_code', ticketCode);
    if (!error) {
      showNotification('ROTA LIBERADA', `A rota para ${ticketCode} foi liberada.`, 'success');
      loadAdminTravels();
    } else {
      showNotification('ERRO AO LIBERAR ROTA', error.message, 'error');
    }
  }

  async function deleteAdminTravel(ticketCode) {
    showModal({
      title: 'CANCELAR VIAGEM',
      body: `DESEJA REALMENTE CANCELAR E EXCLUIR O REGISTRO DA VIAGEM ${ticketCode}?`,
      type: 'confirm',
      onConfirm: async () => {
        const db = Auth.db();
        const { error } = await db.from('travel_registrations').delete().eq('ticket_code', ticketCode);
        if (!error) {
          showNotification('VIAGEM CANCELADA', `O registro ${ticketCode} foi removido com sucesso.`, 'success');
          loadAdminTravels();
        } else {
          showNotification('ERRO', error.message, 'error');
        }
      }
    });
  }

  function renderAdminMissions() {
    return `
      <div class="login-label" style="margin-bottom:15px;">> CENTRAL DE COMANDO DE MISSÕES (GLOBAL)</div>
      <div style="border-bottom:1px solid var(--border);padding:6px 12px;display:grid;grid-template-columns:1fr 1fr 1fr 1fr auto;gap:12px;font-family:var(--font-code);font-size:11px;color:var(--green-mid);letter-spacing:1px;text-transform:uppercase;">
        <span>CÓDIGO / TÍTULO</span><span>DESIGNADOS</span><span>DESTINO</span><span>RECOMPENSA</span><span>AÇÃO</span>
      </div>
      <div id="admin-missions-list"><div class="loading-state">ESCANER DE CONTRATOS ATIVOS<span class="loading-dots"></span></div></div>`;
  }

  async function loadAdminMissions() {
    const list = $('admin-missions-list');
    if (!list) return;
    const db = Auth.db();
    if (!db) return;

    const { data: missions, error } = await db.from('missions')
      .select('*, mission_assignments(profiles(display_name, username))')
      .order('created_at', { ascending: false });

    if (error) {
      list.innerHTML = `<div class="empty-state">ERRO AO CARREGAR: ${error.message}</div>`;
      return;
    }

    if (!missions?.length) {
      list.innerHTML = `<div class="empty-state">NENHUMA MISSÃO REGISTRADA NO SISTEMA</div>`;
      return;
    }

    list.innerHTML = missions.map(m => {
      const designados = m.mission_assignments?.map(a => a.profiles?.display_name || a.profiles?.username || 'Desconhecido').join(', ') || 'Sem Atribuição';

      return `
        <div class="admin-user-row" style="grid-template-columns:1fr 1fr 1fr 1fr auto; align-items:center;">
          <span style="color:var(--green); font-weight:bold;">${m.title}</span>
          <span style="font-size:10px;">${designados}</span>
          <span style="font-size:10px;">${m.target_planet || 'N/A'}</span>
          <span style="color:var(--amber);">${m.reward?.toLocaleString() || 0} CR</span>
          <button class="btn btn-action-danger" onclick="Apps.deleteAdminMission('${m.id}')" style="font-size:11px;padding:3px 8px;">[ EXCLUIR ]</button>
        </div>`;
    }).join('');
  }

  async function deleteAdminMission(id) {
    showModal({
      title: 'CONFIRMAR EXCLUSÃO GLOBAL',
      body: 'ESTA AÇÃO IRÁ APAGAR A MISSÃO PARA TODOS OS AGENTES DESIGNADOS. CONTINUAR?',
      type: 'confirm',
      onConfirm: async () => {
        const db = Auth.db();
        if (!db) return;

        // Manual cleanup of assignments just in case cascade is not set
        await db.from('mission_assignments').delete().eq('mission_id', id);

        const { error } = await db.from('missions').delete().eq('id', id);
        if (!error) {
          showNotification('MISSÃO APAGADA', 'A missão foi removida do banco de dados global.', 'success');
          loadAdminMissions();
        } else {
          showNotification('ERRO AO APAGAR', error.message, 'error');
        }
      }
    });
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
    } else if (_adminTab === 'travel') {
      content.innerHTML = renderAdminTravel();
      loadAdminTravels();
    } else if (_adminTab === 'missions') {
      content.innerHTML = renderAdminMissions();
      loadAdminMissions();
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

    // Build planet options from GALAXY_DB if available
    const planetOpts = (typeof GALAXY_DB !== 'undefined' ? GALAXY_DB : []).map(p => p.name).sort();
    const planetSelHtml = `<select onchange="Apps.changeAgentLocation('USERID', this.value)" style="background:var(--bg-panel);border:1px solid var(--amber);color:var(--amber);font-family:var(--font-code);font-size:10px;padding:3px;cursor:pointer;" title="Localização Atual">OPTS</select>`;

    list.innerHTML = data.map(u => {
      const planet = u.current_planet || '—';
      const opts = planetOpts.map(p => `<option value="${p}" ${p === planet ? 'selected' : ''}>${p}</option>`).join('');
      const planetSel = planetSelHtml.replace('USERID', u.id).replace('OPTS', opts);
      return `<div class="admin-user-row" style="grid-template-columns:1fr 1fr auto auto auto;">
        <span>${u.display_name || u.username || 'N/A'}</span>
        <span style="font-family:var(--font-code);font-size:11px;color:var(--green-mid);">${u.email || ''}</span>
        <span class="role-badge ${u.role}">${(u.role || '?').toUpperCase()}</span>
        <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-start;">
          <div style="font-size:9px;color:var(--amber);letter-spacing:1px;">LOCALIZAÇÃO:</div>
          ${planetSel}
        </div>
        <div style="display:flex;gap:6px;">
          <select onchange="Apps.changeUserRole('${u.id}', this.value)" style="background:transparent;border:1px solid var(--border-dim);color:var(--green-mid);font-family:var(--font-code);font-size:11px;padding:3px;cursor:pointer;">
            ${['admin', 'agent', 'restricted'].map(r => `<option value="${r}" ${u.role === r ? 'selected' : ''}>${r}</option>`).join('')}
          </select>
          <button class="btn btn-danger" onclick="Apps.deleteUser('${u.id}')" style="font-size:11px;padding:3px 8px;">[ DEL ]</button>
        </div>
      </div>`;
    }).join('');
  }

  async function changeUserRole(userId, role) {
    await Auth.adminUpdateUser(userId, { role });
    loadAdminUsers();
  }

  async function changeAgentLocation(userId, planet) {
    const db = Auth.db();
    if (!db) return;
    const { error } = await db.from('profiles').update({ current_planet: planet }).eq('id', userId);
    if (!error) {
      showNotification('LOCALIZAÇÃO ATUALIZADA', `AGENTE MOVIDO PARA: ${planet.toUpperCase()}`, 'success');
    } else {
      showNotification('ERRO', 'FALHA AO ATUALIZAR LOCALIZAÇÃO: ' + error.message, 'error');
    }
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
    showModal({
      type: 'confirm',
      title: 'CONFIRMAÇÃO',
      body: 'APAGAR ESTE ITEM PERMANENTEMENTE DO BANCO DE DADOS?',
      onConfirm: async () => {
        const db = Auth.db();
        await db.from('store_items').delete().eq('id', id);
        loadAdminItems();
      }
    });
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
      if (type === 'new-email') Desktop.openApp('emails');
      if (type === 'new-item' || ['common', 'uncommon', 'rare', 'legendary'].includes(type)) Desktop.openApp('shop');
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

    const isConfirm = options.type === 'confirm';
    const content = options.body || options.content || '';

    overlay.innerHTML = `
      <div class="modal-box scan-effect" style="width:min(450px, 90vw); position:relative;">
        <div class="modal-header" style="display:flex; justify-content:space-between; align-items:center;">
          <span>> ${options.title || 'SISTEMA O.R.T.'}</span>
          <button class="modal-close-btn" style="background:none; border:none; color:var(--green-mid); cursor:pointer; font-family:var(--font-code); font-size:16px; padding:0 5px;">[ X ]</button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
        <div class="modal-footer" style="display:${options.noConfirm ? 'none' : 'flex'}; justify-content:flex-end; gap:12px; padding:12px;">
          ${isConfirm ? `<button class="btn btn-danger" id="modal-cancel">[ ${options.cancelText || 'CANCELAR'} ]</button>` : ''}
          <button class="btn" id="modal-confirm" style="background:var(--green); color:var(--bg);">[ ${options.confirmText || 'OK'} ]</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    Boot.playBeep(440, 0.05, 0.1);

    const closeModalSelf = () => {
      overlay.remove();
    };

    overlay.onclick = (e) => {
      if (e.target === overlay) closeModalSelf();
    };

    const xBtn = overlay.querySelector('.modal-close-btn');
    if (xBtn) xBtn.onclick = closeModalSelf;

    const confirmBtn = overlay.querySelector('#modal-confirm');
    if (confirmBtn) {
      confirmBtn.onclick = () => {
        if (options.onConfirm) options.onConfirm();
        closeModalSelf();
      };
    }

    if (isConfirm && overlay.querySelector('#modal-cancel')) {
      overlay.querySelector('#modal-cancel').onclick = () => {
        if (options.onCancel) options.onCancel();
        closeModalSelf();
      };
    }
  }

  function closeModal() {
    const overlays = Array.from(document.querySelectorAll('.app-overlay'));
    if (overlays.length > 0) {
      const latest = overlays[overlays.length - 1];
      latest.remove();
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
    const myId = Auth.getUser()?.id;

    // Simplificamos: pegamos todas as salas onde o usuário é membro.
    // O RLS já cuida de filtrar 'general' ou salas onde o user_id existe em chat_room_members.
    const { data: rooms } = await db.from('chat_rooms')
      .select('*, chat_room_members!inner(user_id)')
      .order('type', { ascending: false });

    const userRooms = rooms || [];

    list.innerHTML = userRooms.map(r => {
      const icon = r.icon || (r.type === 'general' ? '📡' : (r.type === 'dm' ? '👤' : '👥'));
      const isActive = r.id === activeRoomId;
      const isAdmin = Auth.isAdmin();
      const isOwner = r.created_by === myId || isAdmin;

      return `
        <div class="chat-room-item ${isActive ? 'active' : ''}" onclick="Apps.switchRoom('${r.id}', '${r.name}')">
          <span class="room-icon">${icon}</span>
          <span class="room-name" style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${Utils.esc(r.name)}</span>
          ${(r.type !== 'general' && isOwner) ? `<button class="delete-btn" onclick="event.stopPropagation(); Apps.deleteRoom('${r.id}')" title="Deletar Sala">×</button>` : ''}
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

    // Close sidebar on mobile after selection
    if (window.innerWidth <= 800) {
      document.querySelector('.chat-sidebar')?.classList.remove('mobile-active');
      const backdrop = $('chat-sidebar-backdrop');
      if (backdrop) backdrop.style.display = 'none';
    }

    // Admin features and Ownership actions
    const adminActions = $('chat-admin-actions');
    if (adminActions) {
      adminActions.innerHTML = '';
      const db = Auth.db();

      // Busca dados da sala para checar ownership
      const { data: roomInfo } = await db.from('chat_rooms').select('created_by, type').eq('id', id).single();
      const isOwner = roomInfo?.created_by === Auth.getUser()?.id;
      const isAdmin = Auth.isAdmin();

      // Caso 1: Canal Omega (Geral) -> Só ADM limpa
      if (id === '00000000-0000-0000-0000-000000000001') {
        if (isAdmin) {
          adminActions.innerHTML = `<button class="btn btn-danger btn-chat-action" onclick="Apps.clearChat('${id}')">[ LIMPAR CANAL ]</button>`;
        }
      }
      // Caso 2: Outras salas -> Dono ou Admin limpam
      else if (isOwner || isAdmin) {
        adminActions.innerHTML = `
          <button class="btn btn-danger btn-chat-action" onclick="Apps.clearChat('${id}')">[ LIMPAR CHAT ]</button>
          <button class="btn btn-danger btn-chat-action" onclick="Apps.deleteRoom('${id}')">[ DELETAR SALA ]</button>
        `;
      }
    }
    loadChatMessages(id);
  }

  async function clearChat(roomId) {
    showModal({
      type: 'confirm',
      title: 'CONFIRMAÇÃO',
      body: 'DESEJA LIMPAR TODAS AS MENSAGENS DESTE CANAL?',
      onConfirm: async () => {
        const db = Auth.db();
        const { error } = await db.from('chat_messages').delete().eq('room_id', roomId);

        if (error) {
          showModal({ title: 'ERRO', body: 'Falha ao limpar chat: ' + error.message });
        } else {
          loadChatMessages(roomId);
        }
      }
    });
  }

  async function deleteRoom(roomId) {
    showModal({
      type: 'confirm',
      title: 'ERRO CRÍTICO',
      body: 'DESEJA EXCLUIR PERMANENTEMENTE ESTA SALA E TODAS AS MENSAGENS?',
      onConfirm: async () => {
        const db = Auth.db();
        const { error } = await db.from('chat_rooms').delete().eq('id', roomId);

        if (error) {
          showModal({ title: 'ERRO', body: 'Falha ao excluir sala: ' + error.message });
        } else {
          activeRoomId = '00000000-0000-0000-0000-000000000001';
          switchRoom(activeRoomId, 'Canal Omega');
        }
      }
    });
  }

  const GROUP_ICONS = ['🛡️', '⚡', '🌌', '📜', '⚖️', '🗝️', '🎭', '🔮', '🧬', '🛸', '🛰️', '🧱', '⛩️', '🗡️', '🧿', '♟️'];
  let _selectedGroupIcon = '👥';

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
    msgEl.style.cssText = `max-width: 85%; padding: 10px 14px; border: 1px solid var(--border-dim); font-family: var(--font-code); margin-bottom: 6px; position: relative;
      ${isMe ? 'align-self:flex-end; background:rgba(0,255,65,0.08); border-color:var(--green); border-right:4px solid var(--green);' : 'align-self:flex-start; background:rgba(255,183,0,0.05); border-left:4px solid var(--amber);'} `;

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
      <div style="color:var(--green); font-size:14px; word-break:break-word; line-height:1.4;">${Utils.esc(msg.text)}</div>`;

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

  /* ── Criação de DM/Grupos ────────────────────────────────── */
  // Estado do press-and-hold por usuário (key = userId)
  const _dmHoldState = {};

  async function openNewDM() {
    const db = Auth.db();
    if (!db) return;
    const { data: users } = await db.from('profiles').select('id, display_name, username').order('display_name');
    const myId = Auth.getUser()?.id;

    const agents = (users || []).filter(u => u.id !== myId);

    const bodyHTML = agents.length === 0
      ? '<div style="color:var(--green-mid); font-family:var(--font-code); padding:12px;">NENHUM OUTRO AGENTE DISPONÍVEL.</div>'
      : agents.map(u => {
        const name = u.display_name || u.username || 'AGENTE';
        return `
          <div style="display:flex; align-items:center; justify-content:space-between; padding:8px 4px; border-bottom:1px solid var(--border-dim); gap:12px;">
            <span style="font-family:var(--font-code); font-size:13px; color:var(--green); flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${Utils.esc(name)}</span>
            <button class="btn dm-connect-btn" data-uid="${u.id}" data-name="${Utils.esc(name)}" 
                    style="position:relative; overflow:hidden; min-width:130px; padding:8px 14px; font-size:11px; letter-spacing:1px; flex-shrink:0; user-select:none;">
              [CONECTAR]
              <div class="dm-hold-bar-container" style="position:absolute; bottom:0; left:0; height:3px; width:100%; display:flex; gap:2px; padding:0 2px; box-sizing:border-box;"></div>
            </button>
          </div>`;
      }).join('');

    showModal({
      title: 'INICIAR TRANSMISSÃO PRIVADA',
      body: `<div style="max-height:360px; overflow-y:auto; padding:4px 0;">${bodyHTML}</div>`,
      confirmText: 'VOLTAR'
    });

    // Adicionar os event listeners APÓS o modal estar no DOM
    setTimeout(() => _attachDMHoldListeners(), 50);
  }

  function _attachDMHoldListeners() {
    document.querySelectorAll('.dm-connect-btn').forEach(btn => {
      const uid = btn.dataset.uid;
      const name = btn.dataset.name;

      // Inicializa o estado deste agente se não existir
      if (!_dmHoldState[uid]) _dmHoldState[uid] = { progress: 0, animId: null, lastTs: null };

      const state = _dmHoldState[uid];

      // Renderiza as barras com o progresso salvo
      _dmRenderBars(btn, state.progress);

      const startHold = (e) => {
        if (state.isHolding) return;
        state.isHolding = true;

        // Cancela qualquer retração em andamento e começa fresco
        _dmStopAnimate(state);
        btn.classList.add('no-transition');
        state.lastTs = performance.now();
        _dmAnimate(btn, uid, name, state);

        // Handler global para soltar o mouse/touch fora do botão
        const globalEnd = (ev) => {
          if (!state.isHolding) return;
          state.isHolding = false;
          window.removeEventListener('mouseup', globalEnd);
          window.removeEventListener('touchend', globalEnd);

          _dmStopAnimate(state);
          if (state.progress < 1) _dmRetract(btn, state);
        };

        window.addEventListener('mouseup', globalEnd);
        window.addEventListener('touchend', globalEnd);
      };

      btn.addEventListener('mousedown', startHold);
      btn.addEventListener('touchstart', startHold, { passive: false });
    });
  }

  const DM_HOLD_DURATION = 2000; // ms para completar
  const BAR_COUNT = 12;

  function _dmRenderBars(row, progress) {
    if (!row) return;
    const container = row.querySelector('.dm-hold-bar-container');
    if (!container) return;

    // Proteção contra valores estranhos (NaN, strings, etc)
    const progNum = parseFloat(progress) || 0;
    const filled = Math.max(0, Math.min(BAR_COUNT, Math.round(progNum * BAR_COUNT)));

    // Limpa conteúdo anterior limpamente para evitar vazamentos/anomalias
    if (container.children.length !== BAR_COUNT) {
      container.innerHTML = Array.from({ length: BAR_COUNT }, (_, i) => {
        return `<div style="flex: 1; height: 100%; transition:background 0.05s; border-radius:1px;"></div>`;
      }).join('');
    }

    const bars = container.querySelectorAll('div');
    bars.forEach((bar, i) => {
      const on = i < filled;
      bar.style.background = on ? 'var(--green)' : 'rgba(0,255,65,0.12)';
      bar.style.boxShadow = on ? '0 0 4px var(--green-glow)' : 'none';
    });
  }

  function _dmAnimate(row, uid, name, state) {
    const tick = (ts) => {
      const dt = ts - (state.lastTs || ts);
      state.lastTs = ts;
      state.progress = Math.min(1, state.progress + dt / DM_HOLD_DURATION);

      _dmRenderBars(row, state.progress);

      // Tremor dinâmico: expoente baixo para começar forte desde o início
      const shakeIntensity = Math.pow(state.progress, 0.5) * 32;
      const dx = (Math.random() - 0.5) * shakeIntensity;
      const dy = (Math.random() - 0.5) * shakeIntensity * 0.6;
      row.style.transform = `translate(${dx}px, ${dy}px)`;

      // Som sincronizado: tick a cada segmento preenchido
      const currentFilled = Math.round(state.progress * BAR_COUNT);
      if (currentFilled !== (state._lastFilled || 0)) {
        state._lastFilled = currentFilled;
        const freq = 200 + currentFilled * 80;
        Boot.playBeep(freq, 0.04, 0.06);
      }

      if (state.progress >= 1) {
        // COMPLETO!
        row.style.transform = '';
        row.classList.remove('no-transition');
        _dmStopAnimate(state);
        state.progress = 0;
        state._lastFilled = 0;
        Boot.playBeep(880, 0.08, 0.3);
        setTimeout(() => Boot.playBeep(1100, 0.06, 0.2), 200);

        // Se tiver ação customizada (ex: grupo), usa ela; senão usa createDM
        if (typeof row._groupAction === 'function') {
          row._groupAction();
        } else {
          // Garante fechar APENAS modais de diálogo, não a janela do app
          document.querySelectorAll('.modal-overlay-active').forEach(el => el.remove());
          createDM(uid, name);
        }
        return;
      }

      state.animId = requestAnimationFrame(tick);
    };
    state.animId = requestAnimationFrame(tick);
  }


  function _dmStopAnimate(state) {
    if (state.animId) {
      cancelAnimationFrame(state.animId);
      state.animId = null;
    }
  }

  function _dmRetract(row, state) {
    const RETRACT_DURATION = 800; // Um pouco mais lento para ver o tremor diminuir
    let startProgress = state.progress;
    let startTs = null;

    const retractTick = (ts) => {
      if (!startTs) startTs = ts;
      const elapsed = ts - startTs;
      const ratio = Math.min(1, elapsed / RETRACT_DURATION);
      state.progress = startProgress * (1 - ratio);

      _dmRenderBars(row, state.progress);

      // Tremor diminuindo conforme a barra retrai
      const shakeIntensity = Math.pow(state.progress, 0.5) * 20;
      if (state.progress > 0.05) {
        const dx = (Math.random() - 0.5) * shakeIntensity;
        const dy = (Math.random() - 0.5) * shakeIntensity * 0.5;
        row.style.transform = `translate(${dx}px, ${dy}px)`;
      } else {
        row.style.transform = '';
      }

      if (ratio < 1) {
        state.animId = requestAnimationFrame(retractTick);
      } else {
        state.progress = 0;
        state._lastFilled = 0;
        state.animId = null;
        _dmRenderBars(row, 0);
        row.style.transform = '';
        row.classList.remove('no-transition');
      }
    };
    state.animId = requestAnimationFrame(retractTick);
  }


  async function createDM(targetUserId, targetName) {
    const db = Auth.db();
    if (!db) return;
    const myId = Auth.getUser()?.id;
    if (!myId) return;

    // Fechar o modal aberto antes de prosseguir (limpeza seletiva de modais)
    document.querySelectorAll('.modal-overlay-active').forEach(el => el.remove());

    // Verificar se já existe um DM entre os dois usuários
    const { data: myRooms } = await db.from('chat_room_members')
      .select('room_id')
      .eq('user_id', myId);

    const myRoomIds = (myRooms || []).map(r => r.room_id);

    let existingRoomId = null;
    if (myRoomIds.length > 0) {
      const { data: shared } = await db.from('chat_room_members')
        .select('room_id')
        .eq('user_id', targetUserId)
        .in('room_id', myRoomIds);

      if (shared && shared.length > 0) {
        // Verificar se é do tipo 'dm'
        const { data: dmRoom } = await db.from('chat_rooms')
          .select('id, name')
          .eq('type', 'dm')
          .in('id', shared.map(r => r.room_id))
          .maybeSingle();
        if (dmRoom) existingRoomId = dmRoom.id;
      }
    }

    if (existingRoomId) {
      // DM já existe, apenas navegar para ele
      const { data: room } = await db.from('chat_rooms').select('id, name').eq('id', existingRoomId).single();
      if (room) switchRoom(room.id, room.name);
      return;
    }

    // Criar novo DM via RPC (bypassa RLS)
    const roomName = `DM: ${targetName}`;
    const { data: newRoomId, error } = await db.rpc('create_chat_room', {
      p_name: roomName,
      p_type: 'dm'
    });

    if (error) {
      showModal({ title: 'ERRO', body: 'Falha ao criar a transmissão privada: ' + error.message });
      return;
    }

    if (newRoomId) {
      await db.from('chat_room_members').insert([
        { room_id: newRoomId, user_id: myId },
        { room_id: newRoomId, user_id: targetUserId }
      ]);
      switchRoom(newRoomId, roomName);
    }
  }

  async function openNewGroup() {
    const db = Auth.db();
    if (!db) return;
    const { data: users } = await db.from('profiles').select('id, display_name, username').order('display_name');
    const myId = Auth.getUser()?.id;

    const userList = (users || [])
      .filter(u => u.id !== myId)
      .map(u => {
        const name = u.display_name || u.username || 'AGENTE';
        return `
        <label style="display:flex; align-items:center; gap:10px; padding:8px; border-bottom:1px solid var(--border-dim); cursor:pointer;">
          <input type="checkbox" class="group-member-check" value="${u.id}">
          <span style="font-family:var(--font-code); color:var(--green);">${Utils.esc(name)}</span>
        </label>
      `;
      }).join('');

    // Botão de criação com press-and-hold embutido no body
    const holdBtnHTML = `
      <button id="group-create-hold-btn" class="btn" style="
        position:relative; overflow:hidden; width:100%; margin-top:16px;
        padding:14px 16px; font-family:var(--font-code); font-size:12px;
        letter-spacing:2px; background:rgba(0,60,0,0.4);
        border-color:var(--green-mid); color:var(--green);
        user-select:none; cursor:pointer;
      ">
        SEGURAR PARA CRIAR O GRUPO
        <div class="dm-hold-bar-container" style="
          position:absolute; bottom:0; left:0; height:4px; width:100%;
          display:flex; gap:2px; padding:0 2px; box-sizing:border-box;
          pointer-events:none;
        "></div>
      </button>`;

    const iconHtml = GROUP_ICONS.map(icon => `
      <div class="icon-opt ${icon === _selectedGroupIcon ? 'selected' : ''}" onclick="Apps._selectGroupIcon(this, '${icon}')">${icon}</div>
    `).join('');

    showModal({
      title: 'FORMAR GRUPO DE OPERAÇÕES',
      body: `
        <div style="margin-bottom:15px;">
           <label style="font-size:10px; color:var(--green-dark);">NOME DO GRUPO</label>
           <input type="text" id="new-group-name" class="input-field" placeholder="Ex: ESQUADRÃO OMEGA">
        </div>
        <div style="margin-bottom:10px; font-size:11px; color:var(--green-dark);">ÍCONE REPRESENTATIVO:</div>
        <div class="icon-selector">${iconHtml}</div>
        <div style="max-height:200px; overflow-y:auto; border:1px solid var(--border-dim); padding:5px;">
           ${userList || '<div style="padding:12px; color:var(--green-mid); font-family:var(--font-code);">NENHUM OUTRO AGENTE.</div>'}
        </div>
        ${holdBtnHTML}
      `,
      // Sem botão de confirmar — apenas VOLTAR
      type: 'confirm',
      cancelText: 'VOLTAR',
      confirmText: '', // Oculto via CSS abaixo
    });

    // Esconder o botão "OK" vazio do footer padrão
    setTimeout(() => {
      const confirmBtn = document.getElementById('modal-confirm');
      if (confirmBtn) confirmBtn.style.display = 'none';

      // Inicializar o press-and-hold no botão do grupo
      const holdBtn = document.getElementById('group-create-hold-btn');
      if (!holdBtn) return;

      const stateKey = '__group';
      if (!_dmHoldState[stateKey]) _dmHoldState[stateKey] = { progress: 0, animId: null, lastTs: null };
      const state = _dmHoldState[stateKey];
      state.progress = 0; // Reseta ao abrir o modal
      state._lastFilled = 0;
      _dmRenderBars(holdBtn, 0);

      const startHold = (e) => {
        if (state.isHolding) return;
        state.isHolding = true;

        // Cancela qualquer retração em andamento e começa fresco
        _dmStopAnimate(state);
        holdBtn.classList.add('no-transition');
        state.lastTs = performance.now();
        _dmAnimate(holdBtn, stateKey, '__group_action', state);

        const globalEnd = (ev) => {
          if (!state.isHolding) return;
          state.isHolding = false;
          window.removeEventListener('mouseup', globalEnd);
          window.removeEventListener('touchend', globalEnd);

          _dmStopAnimate(state);
          if (state.progress < 1) _dmRetract(holdBtn, state);
        };

        window.addEventListener('mouseup', globalEnd);
        window.addEventListener('touchend', globalEnd);
      };

      // Override da ação de conclusão para este botão específico
      holdBtn._groupAction = async () => {
        const nameInput = document.getElementById('new-group-name');
        const name = (nameInput ? nameInput.value.trim() : '') || 'NOVO GRUPO';
        const checks = document.querySelectorAll('.group-member-check:checked');
        const members = Array.from(checks).map(c => c.value);
        members.push(myId);

        if (members.length < 2) {
          document.querySelectorAll('.modal-overlay-active').forEach(el => el.remove());
          showModal({ title: 'AVISO', body: 'Selecione ao menos um membro para o grupo.' });
          return;
        }

        document.querySelectorAll('.modal-overlay-active').forEach(el => el.remove());
        const { data: newRoomId, error } = await db.rpc('create_chat_room', {
          p_name: name,
          p_type: 'group',
          p_icon: _selectedGroupIcon
        });

        if (error) {
          showModal({ title: 'ERRO', body: 'Falha ao criar o grupo: ' + error.message });
          return;
        }
        if (newRoomId) {
          const membersToInsert = members.map(uid => ({ room_id: newRoomId, user_id: uid }));
          await db.from('chat_room_members').insert(membersToInsert);
          switchRoom(newRoomId, name);
        }
      };

      holdBtn.addEventListener('mousedown', startHold);
      holdBtn.addEventListener('touchstart', startHold, { passive: false });
    }, 50);
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
          showNotification('NOVA COMUNICAÇÃO', `DE: ${email.sender}<br>ASSUNTO: ${email.subject}`, 'new-message');
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
      <div style="display:grid; grid-template-rows:auto 1fr; height:100%; gap:0;">
        <div class="app-toolbar" style="display:flex; justify-content:space-between; align-items:center;">
          <div style="font-family:var(--font-code); color:var(--green-mid); font-size:12px;">CATÁLOGO DE PRODUTOS O.R.T.</div>
          <div id="shop-user-credits" style="font-family:var(--font-code); color:var(--amber); font-weight:bold; font-size:14px; text-shadow:0 0 5px rgba(215,153,33,0.5);">CR$ 0</div>
        </div>
        <div class="shop-filter-bar" style="padding:10px 20px; background:rgba(0,40,0,0.3); border-bottom:1px solid var(--border-dim); display:flex; flex-wrap:wrap; gap:12px; align-items:center;">
           <div class="login-field shop-search-wrapper" style="flex:1; margin:0;">
              <input type="text" id="shop-search" placeholder="PROCURAR ITEM..." style="padding:6px 10px; font-size:12px; width:100%; box-sizing:border-box;">
           </div>
           <div id="shop-categories" style="display:flex; gap:6px; flex-wrap:wrap;">
              <button class="btn-filter active" data-cat="all">TUDO</button>
              <button class="btn-filter" data-cat="ship">NAVES</button>
              <button class="btn-filter" data-cat="fuel">COMBUSTÍVEL</button>
              <button class="btn-filter" data-cat="weapon">ARMAS</button>
              <div style="display:flex; gap:4px; border-left:1px solid var(--border-dim); padding-left:10px; margin-left:4px;">
                <button class="btn-filter" data-cat="weapon_melee" style="font-size:9px; padding:4px 8px;">BRANCAS</button>
                <button class="btn-filter" data-cat="weapon_small" style="font-size:9px; padding:4px 8px;">PEQUENAS</button>
                <button class="btn-filter" data-cat="weapon_medium" style="font-size:9px; padding:4px 8px;">MÉDIAS</button>
                <button class="btn-filter" data-cat="weapon_large" style="font-size:9px; padding:4px 8px;">GRANDES</button>
              </div>
              <button class="btn-filter" data-cat="armor">ARMADURAS</button>
              <button class="btn-filter" data-cat="consumable">CONSUMÍVEIS</button>
           </div>
        </div>
        <div id="shop-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:16px; padding:20px; overflow-y:auto;">
          <div class="loading-state">CONECTANDO AO ARMAZÉM<span class="loading-dots"></span></div>
        </div>
      </div>`;
  }

  let shopItemsCache = [];
  let currentShopFilter = 'all';

  function filterShop(cat) {
    currentShopFilter = cat;
    document.querySelectorAll('.app-toolbar .btn').forEach(b => {
      b.classList.toggle('active', b.onclick.toString().includes(`'${cat}'`));
    });
    renderShopItems();
  }

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
        if (currentShopFilter.startsWith('weapon_')) {
          const weaponSub = currentShopFilter.split('_')[1]; // melee, small, medium, large
          const map = {
            'melee': ['branca', 'faca', 'espada', 'bastão'],
            'small': ['pequeno', 'pistola'],
            'medium': ['médio', 'medio', 'fuzil', 'submetralhadora'],
            'large': ['grande', 'canhão', 'rifle de precisão']
          };
          const keywords = map[weaponSub] || [];
          matchesCat = item.category === 'weapon' && keywords.some(k => (item.item_type || '').toLowerCase().includes(k));
        } else {
          matchesCat = item.category === currentShopFilter;
        }
      }

      return matchesSearch && matchesCat;
    });

    if (!filtered.length) {
      grid.innerHTML = '<div class="empty-state">NENHUM ITEM ENCONTRADO COM ESTES CRITÉRIOS.</div>';
      return;
    }

    grid.innerHTML = filtered.map(i => {
      const isShip = i.category === 'ship';
      const isFuel = i.category === 'fuel';

      return `
      <div class="shop-card ${i.rarity || 'common'}-glow" onclick="Apps.showItemDetails(${JSON.stringify(i).replace(/"/g, '&quot;')})">
        <div class="shop-item-icon">${i.icon || '📦'}</div>
        <div class="shop-item-info">
          <div class="shop-item-name">${i.name}</div>
          <div class="shop-item-price">CR$ ${i.price}</div>
          ${isShip ? `<div style="font-size:9px; color:var(--amber); margin-top:4px;">[ NAVE DE CLASSE ${i.rarity?.toUpperCase() || 'BÁSICA'} ]</div>` : ''}
          ${isFuel ? `<div style="font-size:9px; color:var(--green); margin-top:4px;">[ CARGA DE COMBUSTÍVEL ]</div>` : ''}
        </div>
      </div>`;
    }).join('');
  }

  function showItemDetails(item) {
    const m = $('modal-item-details');
    if (!m) return;

    // Mover para o final do body para garantir sobreposição total (stacking context)
    document.body.appendChild(m);

    m.style.zIndex = '1000000';

    const rarity = item.rarity || 'common';

    if (item.category === 'ship') {
      let imgName = 'standard.gif';
      const sName = item.name.toLowerCase();
      if (sName.includes('cargueiro') || sName.includes('carga')) imgName = 'cargo.gif';
      else if (sName.includes('caça') || sName.includes('interceptor')) imgName = 'fighter.gif';
      else if (sName.includes('exploradora') || sName.includes('scout')) imgName = 'scout.gif';
      else if (sName.includes('pesquisa') || sName.includes('bio') || sName.includes('laboratório')) imgName = 'science.gif';

      $('item-detail-icon').innerHTML = `<img src="img/ships/${imgName}" class="crt-ship" style="max-width:100%; max-height:140px; object-fit:contain; margin-top:5px;" />`;
      $('item-detail-icon').style.padding = '0';
      $('item-detail-icon').style.background = 'transparent';
    } else {
      $('item-detail-icon').textContent = item.category === 'weapon' ? '🔫' : (item.category === 'armor' ? '🛡️' : '📦');
      $('item-detail-icon').style.padding = '10px';
      $('item-detail-icon').style.background = 'rgba(0,255,65,0.05)';
    }
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

    showModal({
      title: 'CONFIRMAR AQUISIÇÃO',
      body: `DESEJA REALMENTE ADQUIRIR ESTE EQUIPAMENTO POR CR$ ${price}?`,
      type: 'confirm',
      onConfirm: async () => {
        const db = Auth.db();
        const user = Auth.getUser();
        if (!db || !user) return;

        const { data: profile } = await db.from('profiles').select('credits, current_planet').eq('id', user.id).single();

        if (!profile || profile.credits < price) {
          showModal({ title: 'CRÉDITOS INSUFICIENTES', body: 'VOCÊ NÃO POSSUI CRÉDITOS SUFICIENTES PARA ESTA AQUISIÇÃO.', type: 'alert' });
          return;
        }

        const item = shopItemsCache.find(i => i.id === id);
        if (item && item.category === 'ship') {
          // Check Hangar Capacity
          const { data: pData } = await db.from('profiles').select('unlocked_hangar_slots').eq('id', user.id).single();
          const { data: ownShips } = await db.from('ships').select('id').eq('owner_id', user.id);
          const slots = pData?.unlocked_hangar_slots || 1;
          const currentCount = ownShips ? ownShips.length : 0;

          if (currentCount >= slots) {
            showModal({ title: 'HANGAR LOTADO', body: 'VOCÊ NÃO POSSUI ESPAÇO DISPONÍVEL NO HANGAR PARA MAIS UMA NAVE.', type: 'alert' });
            return;
          }

          // Ship Purchase Logic (Direct to ships table)
          const plate = 'NX-' + Math.random().toString(36).substring(2, 7).toUpperCase();
          const { error: shipErr } = await db.from('ships').insert({
            owner_id: user.id,
            name: item.name,
            class: item.rarity || 'common',
            license_plate: plate,
            stats: item.technical_meta?.stats || { security: 1, armaments: 1, system: 1 },
            fuel: 100,
            current_planet: profile?.current_planet || 'omega'
          });
          if (shipErr) {
            showModal({ title: 'ERRO NO REGISTRO', body: 'FALHA AO REGISTRAR NAVE: ' + shipErr.message, type: 'alert' });
            return;
          }
        } else {
          // Normal Item or Fuel Item (Gallons) -> Add to inventory
          await db.from('inventory').insert({ user_id: user.id, item_id: id });
        }

        await db.from('profiles').update({ credits: profile.credits - price }).eq('id', user.id);
        showNotification('AQUISIÇÃO CONCLUÍDA', `ITEM REGISTRADO COM SUCESSO.`, 'success');
        updateUserCreditsDisplay();
        if (window.Desktop && Desktop.updateHeader) Desktop.updateHeader();
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
    subscribeLocationUpdates();
    subscribeTravelAutoTransport();
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

  function subscribeLocationUpdates() {
    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;

    console.log("[REALTIME] Subscribing to location updates for user:", user.id);

    db.channel('location-updates')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${user.id}`
      }, payload => {
        console.log("[REALTIME] Profile update detected:", payload.new.current_planet);
        if (payload.new.current_planet) {
          renderAgentLocationCard(payload.new.current_planet);
        }
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'mission_assignments',
        filter: `user_id=eq.${user.id}`
      }, payload => {
        console.log("[REALTIME] Mission assignment change detected:", payload.eventType);
        renderAgentLocationCard();
      })
      .subscribe((status) => {
        console.log("[REALTIME] Location updates subscription status:", status);
      });
  }

  function subscribeTravelAutoTransport() {
    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;

    db.channel('public:travel_auto_transport')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'travel_registrations',
        filter: `user_id=eq.${user.id}`
      }, payload => {
        // If status changes to 'active', trigger HUD automatically for everyone on this ticket
        if (payload.new.status === 'active' && (payload.old.status === 'waiting' || payload.old.status === 'ready') && payload.new.user_id === user.id) {
          console.log("[TRAVEL] Auto-transporting to HUD:", payload.new.ticket_code);
          Desktop.openApp('travelApp');
          setTimeout(() => {
            if ($('travel-id-input')) $('travel-id-input').value = payload.new.ticket_code;
            Apps.startVoyage(payload.new.ticket_code, payload.new.mission_id);
          }, 500);
        }
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
                     ${item.category === 'fuel' ? `
                       <span style="font-size:10px; color:var(--amber);">USOS: ${inv.remaining_uses || item.technical_meta?.initial_uses || 1}/${item.technical_meta?.initial_uses || 1}</span>
                     ` : `
                       <span style="font-size:10px; color:var(--amber);">${item.damage_dice || ''}</span>
                     `}
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

    // 4. Consumir Item (Lógica de múltiplos usos para combustível)
    if (item.category === 'fuel') {
      const initialUses = item.technical_meta?.initial_uses || 1;
      const currentUses = inv.remaining_uses !== undefined ? inv.remaining_uses : initialUses;
      const nextUses = currentUses - 1;

      if (nextUses > 0) {
        await db.from('inventory').update({ remaining_uses: nextUses }).eq('id', inventoryId);
        showNotification('CARGA UTILIZADA', `${item.name.toUpperCase()} REESTABELECIDO. USOS RESTANTES: ${nextUses}`, 'success');
      } else {
        await db.from('inventory').delete().eq('id', inventoryId);
        showNotification('COMBUSTÍVEL ESGOTADO', `${item.name.toUpperCase()} FOI TOTALMENTE CONSUMIDO.`, 'warning');
      }
    } else {
      await db.from('inventory').delete().eq('id', inventoryId);
      showNotification('ITEM CONSUMIDO', `${item.name.toUpperCase()} UTILIZADO COM SUCESSO.`, 'success');
    }

    loadInventory();
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

    options += `<div class="context-menu-item" style="color:var(--amber)" onclick="${closeSelf} Apps.sellItem('${invId}', ${localIndex})">[ VENDER ]</div>`;
    options += `<div class="context-menu-item" style="color:var(--green)" onclick="${closeSelf} Apps.openAgentTransferMenu('${invId}', ${localIndex})">[ TRANSFERIR ]</div>`;
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

  async function sellItem(invId, localIndex) {
    const inv = _inventoryItems[localIndex];
    if (!inv) return;
    const item = inv.store_items;
    const sellPrice = Math.floor((item.price || 0) * 0.85);

    showModal({
      title: 'CONFIRMAR VENDA',
      body: `DESEJA VENDER "${item.name.toUpperCase()}" POR CR$ ${sellPrice}? (RETORNO DE 85%)`,
      type: 'confirm',
      onConfirm: async () => {
        const db = Auth.db();
        const user = Auth.getUser();
        if (!db || !user) return;

        // 1. Adicionar Créditos
        const { data: profile } = await db.from('profiles').select('credits').eq('id', user.id).single();
        if (profile) {
          const newCredits = (profile.credits || 0) + sellPrice;
          await db.from('profiles').update({ credits: newCredits }).eq('id', user.id);
        }

        // 2. Remover do Inventário
        await db.from('inventory').delete().eq('id', invId);

        loadInventory();
        if (typeof updateUserCreditsDisplay === 'function') updateUserCreditsDisplay();
        if (typeof refreshStats === 'function') refreshStats();

        showNotification('ITEM VENDIDO', `CONTRATO ENCERRADO. VOCÊ RECEBEU CR$ ${sellPrice}.`, 'success');
      }
    });
  }


  function _selectGroupIcon(el, icon) {
    document.querySelectorAll('.icon-opt').forEach(opt => opt.classList.remove('selected'));
    el.classList.add('selected');
    _selectedGroupIcon = icon;
    Boot.playBeep(1200, 0.02, 0.05);
  }

  function copyToClipboard(text, label = "CONTEÚDO") {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      showNotification('SISTEMA', `${label} COPIADO PARA O CLIPBOARD.`, 'success');
      Boot.playBeep(2000, 0.05, 0.05);
    }).catch(err => {
      console.error('Falha ao copiar:', err);
      showNotification('ERRO', 'FALHA AO ACESSAR O CLIPBOARD.', 'error');
    });
  }

  async function renderAgentLocationCard(planetOverride = null) {
    let container = document.getElementById('agent-location-card');
    if (!container) {
      const desktop = document.getElementById('welcome-screen') || document.getElementById('desktop-bg') || document.body;
      container = document.createElement('div');
      container.id = 'agent-location-card';
      container.style.cssText = `
        position: fixed; bottom: 80px; right: 20px; z-index: 100;
        width: 240px; background: rgba(0,10,0,0.85);
        border: 1px solid rgba(0,255,65,0.3); backdrop-filter: blur(4px);
        font-family: var(--font-code); padding: 12px; pointer-events: all;
        box-shadow: 0 0 20px rgba(0,255,65,0.1);
        transition: opacity 0.4s ease; opacity: 0;
      `;
      desktop.appendChild(container);
      setTimeout(() => container.style.opacity = '1', 50);
    }

    const db = Auth.db();
    const user = Auth.getUser();
    let planet = planetOverride || Auth.getProfile()?.current_planet || null;

    if (db && user && !planet) {
      const { data: p } = await db.from('profiles').select('current_planet').eq('id', user.id).single();
      if (p?.current_planet) planet = p.current_planet;
    }

    if (!planet) {
      container.style.display = 'none';
      return;
    }

    const SCALE_FACTOR = 240 / 250;
    const polarToXY = (pd) => {
      if (!pd.pos) return { x: 300, y: 300 };
      const rad = (pd.pos.a * Math.PI) / 180;
      const x = 300 + pd.pos.r * SCALE_FACTOR * Math.cos(rad);
      const y = 300 + pd.pos.r * SCALE_FACTOR * Math.sin(rad);
      return { x, y };
    };

    let planetPos = { x: 300, y: 300 };
    let dotsHtml = '';
    let trajectoryHtml = '';

    if (typeof GALAXY_DB !== 'undefined') {
      dotsHtml = GALAXY_DB.map(pd => {
        const { x, y } = polarToXY(pd);
        const isCurrent = pd.name.toLowerCase() === planet.toLowerCase();
        if (isCurrent) planetPos = { x, y };
        const dotColor = isCurrent ? 'var(--green)' : (REGION_COLORS?.[pd.rk] || 'rgba(0,255,100,0.2)');
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${isCurrent ? 3.5 : 1.5}" fill="${dotColor}" opacity="${isCurrent ? 1 : 0.4}"/>`;
      }).join('');

      // Trajectory from Active Mission
      try {
        const { data: assignments } = await db.from('mission_assignments')
          .select('missions(route, target_planet)')
          .eq('user_id', user.id)
          .eq('status', 'accepted')
          .limit(1);

        if (assignments && assignments.length > 0) {
          const m = assignments[0].missions;
          const destName = m.target_planet || m.route;
          if (destName && destName.toLowerCase() !== planet.toLowerCase()) {
            if (window.MapApp && MapApp.calculateGalacticRoute) {
              const path = MapApp.calculateGalacticRoute(planet, destName);
              if (path && path.length >= 2) {
                const points = path.map(p => {
                  const { x, y } = polarToXY(p);
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                }).join(' ');
                trajectoryHtml = `
                  <polyline points="${points}" fill="none" stroke="var(--green)" stroke-width="2" stroke-dasharray="8,8" opacity="0.5">
                    <animate attributeName="stroke-dashoffset" from="160" to="0" dur="8s" repeatCount="indefinite"/>
                  </polyline>
                `;
              }
            }
          }
        }
      } catch (e) { /* ignore widget background errors */ }
    }

    container.innerHTML = `
      <div class="agent-location-header" onclick="document.getElementById('agent-location-card').classList.toggle('mobile-expanded')">
        <div style="font-size:9px; color:var(--green-dim); letter-spacing:2px; margin-bottom:6px;">◈ LOCALIZAÇÃO ATUAL</div>
        <div style="font-size:13px; color:var(--green); font-weight:bold; letter-spacing:1px; margin-bottom:4px; display:flex; justify-content:space-between; align-items:center;">
          <span>${planet.toUpperCase()}</span>
          <span class="location-toggle-icon">▼</span>
        </div>
      </div>
      <div class="agent-location-body">
        <svg viewBox="0 0 600 600" style="width:100%; height:100px; background:rgba(0,5,0,0.4); border:1px solid rgba(0,255,65,0.1);">
          ${dotsHtml}
          ${trajectoryHtml}
          <g style="filter:drop-shadow(0 0 5px var(--green));">
            <circle cx="${planetPos.x.toFixed(1)}" cy="${planetPos.y.toFixed(1)}" r="8" fill="none" stroke="var(--green)" stroke-width="2">
              <animate attributeName="r" from="4" to="16" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" from="1" to="0" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="${planetPos.x.toFixed(1)}" cy="${planetPos.y.toFixed(1)}" r="4" fill="var(--green)"/>
          </g>
        </svg>
        <div style="font-size:9px; color:var(--green-dim); margin-top:4px; text-align:center; opacity:0.6;">COORDENADAS SINCRONIZADAS</div>
      </div>
    `;
  }

  async function openAgentTransferMenu(invId, localIndex) {
    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;

    const inv = _inventoryItems[localIndex];
    if (!inv) return;
    const itemName = inv.store_items?.name?.toUpperCase() || 'ITEM';

    // Fetch all profiles except current user
    const { data: agents, error } = await db.from('profiles').select('id, display_name, username').neq('id', user.id).order('display_name');

    if (error || !agents) {
      showNotification('SISTEMA', 'ERRO AO BUSCAR AGENTES.', 'error');
      return;
    }

    let agentsHtml = agents.map(agent => `
      <div class="panel-box" style="margin-bottom:10px; padding:10px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="color:var(--green); font-weight:bold;">${(agent.display_name || agent.username || 'AGENTE ANONIMO').toUpperCase()}</div>
          <div style="font-size:9px; color:var(--text-dim); font-family:var(--font-code);">${agent.id.substring(0, 8)}...</div>
        </div>
        <button class="btn btn-mini" onclick="Apps.transferItemToAgent('${invId}', '${agent.id}', '${agent.display_name || agent.username}')">[ TRANSFERIR ]</button>
      </div>
    `).join('');

    showModal({
      title: 'CENTRAL DE TRANSFERÊNCIA',
      body: `
        <div style="padding:10px;">
          <p style="font-size:12px; margin-bottom:15px; border-bottom:1px solid var(--border-dim); padding-bottom:10px;">
            TRANSFERIR: <span style="color:var(--amber); font-weight:bold;">${itemName}</span>
          </p>
          <div style="max-height:300px; overflow-y:auto; padding-right:5px;">
            ${agentsHtml || '<div class="empty-state">NENHUM AGENTE DISPONÍVEL</div>'}
          </div>
        </div>
      `,
      type: 'alert'
    });
  }

  async function transferItemToAgent(invId, targetAgentId, targetName) {
    const db = Auth.db();
    if (!db) return;

    showModal({
      title: 'CONFIRMAR TRANSFERÊNCIA',
      body: `VOCÊ ESTÁ PRESTES A TRANSFERIR ESTE ITEM PARA <span style="color:var(--green)">${targetName.toUpperCase()}</span>. ESTA AÇÃO NÃO PODE SER DESFEITA. CONFIRMAR?`,
      type: 'confirm',
      onConfirm: async () => {
        try {
          // Update item ownership and unequip
          const { error } = await db.from('inventory')
            .update({
              user_id: targetAgentId,
              is_equipped: false
            })
            .eq('id', invId);

          if (error) throw error;

          showNotification('TRANSFERÊNCIA CONCLUÍDA', `ITEM ENVIADO PARA ${targetName.toUpperCase()} COM SUCESSO.`, 'success');

          // Close transfer selection modal if open (it uses showModal type 'alert')
          const modal = document.querySelector('.modal-overlay-active');
          if (modal) modal.remove();

          loadInventory();
        } catch (e) {
          showNotification('ERRO NO SISTEMA', 'FALHA NA TRANSFERÊNCIA: ' + e.message, 'error');
        }
      }
    });
  }

  /* ══════════════════════════════════════════════════════════
     HANGAR APP (GARAGEM DE NAVES)
  ══════════════════════════════════════════════════════════ */
  function hangarApp() {
    return `
      <div class="full" style="padding:20px; display:flex; flex-direction:column; gap:20px; background:var(--bg);">
        <div style="text-align:center;">
          <h2 class="glow" style="margin-bottom:5px;">GARAGEM O.R.T. [ HANGAR ]</h2>
          <p class="text-dim" style="font-size:12px;">GERENCIE SUA FROTA E DETERMINE A NAVE ATIVA DESTA SESSÃO.</p>
        </div>
        
        <!-- Hangar Grid -->
        <div id="hangar-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:20px; flex:1;">
           <div class="loading-state" style="grid-column:1/-1;">Sincronizando docas...<span class="loading-dots"></span></div>
        </div>
      </div>
    `;
  }

  function initHangarApp() {
    loadHangarData();
  }

  async function loadHangarData() {
    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;

    // 1. Get profile data for slots and active ship
    const { data: profile } = await db.from('profiles').select('unlocked_hangar_slots, active_ship_id, credits').eq('id', user.id).single();
    if (!profile) return;

    const slotsUnlocked = profile.unlocked_hangar_slots || 1;
    const activeShipId = profile.active_ship_id;
    const credits = profile.credits || 0;

    // 2. Get user's ships
    const { data: ships } = await db.from('ships').select('*').eq('owner_id', user.id).order('created_at');

    // 3. Get store prices for selling calculations
    const { data: storeShips } = await db.from('store_items').select('name, price').eq('category', 'ship');
    const shipPriceMap = {};
    if (storeShips) storeShips.forEach(s => shipPriceMap[s.name] = s.price);

    const hangarGrid = $('hangar-grid');
    if (!hangarGrid) return;

    // Preços dos slots fixos para RPG
    const slotCosts = { 2: 25000, 3: 75000, 4: 200000 };
    const TOTAL_SLOTS = 4;

    let html = '';

    for (let i = 1; i <= TOTAL_SLOTS; i++) {
      const isUnlocked = i <= slotsUnlocked;
      const ship = ships && ships[i - 1] ? ships[i - 1] : null;

      html += `<div class="panel-box scan-effect" style="display:flex; flex-direction:column; height:420px; transition:all 0.3s; position:relative; overflow:hidden;">`;

      html += `<div style="position:absolute; top:10px; left:10px; font-family:var(--font-logo); font-size:24px; color:rgba(0,255,65,0.2); pointer-events:none;">Doca 0${i}</div>`;

      if (!isUnlocked) {
        // Locked Slot View
        const cost = slotCosts[i];
        const canAfford = credits >= cost;
        html += `
          <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:15px; background:rgba(255,0,0,0.02); text-align:center; padding:20px;">
            <div style="font-size:40px; color:var(--red-alert);">🔒</div>
            <div style="color:var(--red-alert); font-family:var(--font-code); font-size:14px;">ESPAÇO BLOQUEADO</div>
            <div class="text-dim" style="font-size:11px; margin-bottom:10px;">EXPANDA SUA GARAGEM PARA ARMAZENAR MAIS NAVES.</div>
            <button class="btn" style="width:100%; border-color:${canAfford ? 'var(--amber)' : 'var(--border-dim)'}; color:${canAfford ? 'var(--amber)' : 'var(--text-dim)'};" 
                    onclick="Apps.buyHangarSlot(${i}, ${cost})" ${!canAfford ? 'disabled' : ''}>
              [ COMPRAR DESBLOQUEIO  —  CR$ ${cost.toLocaleString('pt-BR')} ]
            </button>
          </div>
        `;
      } else if (!ship) {
        // Unlocked but Empty
        html += `
          <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:15px; text-align:center; padding:20px;">
            <div style="font-size:40px; color:rgba(0,255,65,0.2); filter:blur(2px);">🚀</div>
            <div class="text-dim" style="font-family:var(--font-code); font-size:14px; letter-spacing:2px;">[ ESPAÇO VÁZIO ]</div>
            <div style="font-size:10px; color:var(--green-dark);">VISITE A LOJA O.R.T. PARA ADQUIRIR UMA NAVE</div>
          </div>
        `;
      } else {
        // Ship Occupying Slot
        const isActive = ship.id === activeShipId;
        const statusColor = isActive ? 'var(--green)' : 'var(--text-dim)';

        // Define Image based on Name/Type heuristically
        let imgName = 'standard.gif';
        const sName = ship.name.toLowerCase();
        if (sName.includes('cargueiro') || sName.includes('carga')) imgName = 'cargo.gif';
        else if (sName.includes('caça') || sName.includes('interceptor')) imgName = 'fighter.gif';
        else if (sName.includes('exploradora') || sName.includes('scout')) imgName = 'scout.gif';
        else if (sName.includes('pesquisa') || sName.includes('bio') || sName.includes('laboratório')) imgName = 'science.gif';

        const maxPrice = shipPriceMap[ship.name] || 5000;
        const integrity = ship.integrity !== undefined ? ship.integrity : 100;
        const sellValue = Math.floor(maxPrice * 0.9 * (integrity / 100));

        html += `
          <div style="flex:1; display:flex; flex-direction:column; background:linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,25,0,0.4));">
            ${isActive ? '<div style="background:var(--green); color:var(--bg); text-align:center; font-size:10px; font-weight:bold; padding:2px;">NAVE ATIVA DA SESSÃO</div>' : ''}
            
            <div style="flex:1; display:flex; justify-content:center; align-items:center; position:relative;">
              <div style="position:absolute; inset:0; background:radial-gradient(circle at center, rgba(0,255,65,0.1), transparent 70%);"></div>
              <img src="img/ships/${imgName}" alt="Nave" class="crt-ship" style="max-width:90%; max-height:220px; object-fit:contain; z-index:1; ${isActive ? '' : 'filter:grayscale(60%) opacity(0.5); grayscale(50%);'}">
            </div>

            <div style="padding:15px; border-top:1px solid var(--border-dim); background:rgba(0,0,0,0.6); z-index:2;">
              <h3 style="font-size:14px; color:${statusColor}; text-transform:uppercase; margin-bottom:4px; text-shadow:0 0 5px ${statusColor};">
                ${ship.name}
              </h3>
              <div style="display:flex; justify-content:space-between; font-size:10px; font-family:var(--font-code); color:var(--green-mid); margin-bottom:10px;">
                <span>ID: ${ship.license_plate || '???'}</span>
                <span>${ship.integrity !== undefined ? ship.integrity : 100}% INT</span>
              </div>
              
              <div style="display:flex; gap:5px; margin-bottom:5px;">
                ${isActive
            ? `<button class="btn" style="flex:1; border-color:var(--amber); color:var(--amber);" onclick="Apps.deactivateHangarShip()">[ DESATIVAR ]</button>`
            : `<button class="btn" style="flex:1; border-color:var(--green); color:var(--green);" onclick="Apps.activateHangarShip('${ship.id}')">[ ATIVAR ]</button>`
          }
              </div>
              <button class="btn" style="width:100%; border-color:var(--red-alert); color:var(--red-alert); font-size:10px;" onclick="Apps.sellHangarShip('${ship.id}', \`${ship.name.replace(/'/g, "\\'").replace(/"/g, '&quot;')}\`, ${sellValue})">
                [ VENDER: CR$ ${sellValue.toLocaleString('pt-BR')} ]
              </button>
            </div>
          </div>
        `;
      }

      html += `</div>`; // end card
    }

    hangarGrid.innerHTML = html;
  }

  async function buyHangarSlot(slotIndex, cost) {
    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;

    showModal({
      title: 'ORDEM DE COMPRA: HANGAR O.R.T.',
      body: `SOLICITAR EXPANSÃO DA DOCA 0${slotIndex} POR <span style="color:var(--amber);">CR$ ${cost.toLocaleString('pt-BR')}</span>?<br><br>ESTA AÇÃO É IRREVERSÍVEL.`,
      type: 'confirm',
      onConfirm: async () => {
        try {
          const { data: profile } = await db.from('profiles').select('credits').eq('id', user.id).single();
          if (profile.credits < cost) {
            showNotification('NEGADO', 'CRÉDITOS INSUFICIENTES.', 'error');
            return;
          }

          // Transação (deduzir custo e liberar slot)
          const { error: updErr } = await db.from('profiles').update({
            credits: profile.credits - cost,
            unlocked_hangar_slots: slotIndex
          }).eq('id', user.id);

          if (updErr) throw updErr;

          showNotification('ACESSO LIBERADO', `DOCA 0${slotIndex} OPERACIONAL.`, 'success');
          loadHangarData(); // Refresh UI
          Desktop.updateHeader(await Auth.getProfile(true)); // update credits in UI if needed
        } catch (e) {
          showNotification('ERRO', 'FALHA NA TRANSAÇÃO: ' + e.message, 'error');
        }
      }
    });
  }

  async function activateHangarShip(shipId) {
    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;

    try {
      // 1. Verificar se a nave pertence ao usuário
      const { data: ship } = await db.from('ships').select('*').eq('id', shipId).single();
      if (!ship || ship.owner_id !== user.id) {
        showNotification('NEGADO', 'NAVE NÃO AUTORIZADA PARA ESTE AGENTE.', 'error');
        return;
      }

      // 2. Atualizar profile agent active_ship_id
      const { error } = await db.from('profiles').update({ active_ship_id: shipId }).eq('id', user.id);
      if (error) throw error;

      showNotification('SISTEMA ROTEADO', `NAVE ${ship.name.toUpperCase()} DEFINIDA COMO PRINCIPAL.`, 'success');

      // Update local profile cache
      await Auth.getProfile(true);

      loadHangarData(); // refresh hangar
      if (document.getElementById('ship-details-area')) loadShipData(); // refresh shipApp Se estiver aberto

    } catch (e) {
      showNotification('ERRO DE SISTEMA', e.message, 'error');
    }
  }

  async function deactivateHangarShip() {
    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;

    try {
      const { error } = await db.from('profiles').update({ active_ship_id: null }).eq('id', user.id);
      if (error) throw error;
      showNotification('NAVE DESATIVADA', 'SUA NAVE ATUAL FOI RECOLHIDA.', 'success');

      await Auth.getProfile(true);
      loadHangarData();
      if (document.getElementById('ship-details-area')) loadShipData();
    } catch (e) {
      showNotification('ERRO', 'FALHA AO DESATIVAR NAVE: ' + e.message, 'error');
    }
  }

  function sellHangarShip(shipId, shipName, sellValue) {
    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;

    showModal({
      title: 'VENDA DE NAVE',
      body: `TEM CERTEZA QUE DESEJA VENDER A NAVE <br><b style="color:var(--green);">${shipName}</b><br>POR <span style="color:var(--amber);">CR$ ${sellValue.toLocaleString('pt-BR')}</span>?<br><br>ATENÇÃO: ESTA AÇÃO É IRREVERSÍVEL E A NAVE SERÁ DESMONTADA.`,
      type: 'confirm',
      onConfirm: async () => {
        try {
          const { data: profile } = await db.from('profiles').select('active_ship_id, credits').eq('id', user.id).single();

          if (profile.active_ship_id === shipId) {
            await db.from('profiles').update({ active_ship_id: null }).eq('id', user.id);
          }

          const { error: delErr } = await db.from('ships').delete().eq('id', shipId);
          if (delErr) throw delErr;

          const newCredits = (profile.credits || 0) + sellValue;
          const { error: updErr } = await db.from('profiles').update({ credits: newCredits }).eq('id', user.id);
          if (updErr) throw updErr;

          showNotification('VENDA CONCLUÍDA', `CRÉDITOS RECEBIDOS: CR$ ${sellValue.toLocaleString('pt-BR')}.`, 'success');

          Desktop.updateHeader(await Auth.getProfile(true));
          loadHangarData();
          if (document.getElementById('ship-details-area')) loadShipData();
        } catch (e) {
          showNotification('ERRO', 'FALHA NA VENDA: ' + e.message, 'error');
        }
      }
    });
  }

  /* ══════════════════════════════════════════════════════════
     COMMERCIAL FLIGHTS LOGIC
  ══════════════════════════════════════════════════════════ */

  function switchTravelTab(tab) {
    ['lobby', 'board', 'mine'].forEach(t => {
      const btn = $('tab-travel-' + t);
      const view = $('travel-view-' + t);
      if (btn) btn.classList.toggle('active', t === tab);
      if (view) {
        if (t === tab) view.classList.remove('hidden');
        else view.classList.add('hidden');
      }
    });

    if (tab === 'board') loadCommercialBoard();
    if (tab === 'mine') loadMyCommercialTickets();
  }

  async function loadCommercialBoard() {
    const db = Auth.db();
    if (!db) return;
    const list = $('travel-board-list');
    if (!list) return;

    list.innerHTML = `<div class="empty-state">ATUALIZANDO ROTAS...</div>`;
    const { data: flights } = await db.from('commercial_flights')
      .select('*, profiles:buyer_id(display_name, username)')
      .in('status', ['scheduled', 'active'])
      .order('created_at', { ascending: false });

    if (!flights || !flights.length) {
      list.innerHTML = `<div class="empty-state">NENHUM VOO COMERCIAL AGENDADO NO MOMENTO.</div>`;
      return;
    }

    list.innerHTML = flights.map(f => {
      const isBoarding = f.status === 'scheduled';
      const color = isBoarding ? 'var(--amber)' : 'var(--green)';
      const statusText = isBoarding ? 'EMBARQUE' : 'EM TRÂNSITO';
      const buyer = (f.profiles?.display_name || f.profiles?.username || 'AGENTE DESCONHECIDO').toUpperCase();
      return `
        <div style="background:rgba(0,0,0,0.4); border:1px solid var(--border-dim); padding:15px; display:flex; justify-content:space-between; align-items:center;">
          <div>
             <div style="color:var(--green-mid); font-family:var(--font-code); font-size:12px;">VOO: <span style="color:white;">${f.ticket_code}</span></div>
             <div style="font-size:16px; margin:5px 0;">${(f.origin || 'DESCONHECIDO').toUpperCase()} <span style="color:var(--amber);">🡒</span> ${f.destination.toUpperCase()}</div>
             <div style="color:var(--green-dark); font-size:10px;">OPERADOR: ${buyer}</div>
          </div>
          <div style="text-align:right;">
             <div class="blink" style="color:${color}; font-size:14px; margin-bottom:10px;">[ ${statusText} ]</div>
             <div style="color:var(--green-mid); font-size:10px;">CAPACIDADE: ${f.total_tickets}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  async function loadMyCommercialTickets() {
    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;
    const list = $('travel-mine-list');
    if (!list) return;

    list.innerHTML = `<div class="empty-state">CARREGANDO SUAS PASSAGENS...</div>`;
    const { data: flights } = await db.from('commercial_flights')
      .select('*')
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false });

    if (!flights || !flights.length) {
      list.innerHTML = `<div class="empty-state">VOCÊ NÃO POSSUI PASSAGENS EMITIDAS.</div>`;
      return;
    }

    list.innerHTML = flights.map(f => {
      const isBoarding = f.status === 'scheduled';
      const bg = isBoarding ? 'rgba(0,255,65,0.05)' : 'rgba(0,0,0,0.3)';

      let ticketsHtml = '';
      for (let i = 1; i <= f.total_tickets; i++) {
        const specificCode = `${f.ticket_code}-${i}`;
        ticketsHtml += `
            <div style="background:#000; padding:5px 10px; margin-top:5px; font-family:var(--font-code); font-size:16px; color:white; display:flex; justify-content:space-between; align-items:center; cursor:pointer; border:1px solid var(--border-dim);" onclick="navigator.clipboard.writeText('${specificCode}'); Apps.showNotification('CÓDIGO COPIADO', '${specificCode}', 'success');">
               <span>PASSAGEM ${i}:</span>
               <span style="color:var(--green);">${specificCode}</span>
            </div>
         `;
      }

      return `
        <div style="background:${bg}; border:1px solid var(--border-dim); padding:15px; margin-bottom:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid rgba(0,255,65,0.2); padding-bottom:5px;">
             <span style="color:var(--amber); font-size:16px;">VOO: ${f.origin.toUpperCase()} 🡒 ${f.destination.toUpperCase()}</span>
             <div>
                <span style="color:${isBoarding ? 'var(--amber)' : 'var(--green-mid)'}; font-size:12px; margin-right: 10px;">[ ${f.status.toUpperCase()} ]</span>
                ${isBoarding ? `<button class="btn btn-sm" style="color:var(--amber); border-color:var(--amber); font-size:10px; padding:2px 5px;" onclick="Apps.deleteCommercialFlight('${f.id}')">[ CANCELAR ]</button>` : ''}
             </div>
          </div>
          <div style="color:var(--green-mid); font-size:10px; margin-bottom:5px;">CÓDIGOS DE EMBARQUE (COPIE E ENVIE 1 POR AGENTE):</div>
          ${ticketsHtml}
        </div>
      `;
    }).join('');
  }

  function openBuyTicketModal() {
    const profile = Auth.getProfile();
    const currentPlanet = profile?.current_planet || 'capitolio';
    const galaxy = window.GALAXY_DB || [];
    const _planets = galaxy.filter(p => true);
    let options = _planets.map(p => `<option value="${p.id}">${p.name.toUpperCase()}</option>`).join('');

    const modalHTML = `
      <div id="modal-buy-ticket" class="app-overlay hidden">
        <div class="modal-box scan-effect" style="width:min(400px, 90vw);">
          <div class="modal-header">> EMISSÃO DE PASSAGENS AÉREAS</div>
          <div class="modal-body" style="display:flex; flex-direction:column; gap:15px;">
            <div class="form-group">
              <label>PONTO DE ORIGEM</label>
              <input type="text" class="input-field" value="${currentPlanet.toUpperCase()}" readonly style="opacity:0.7">
            </div>
            <div class="form-group">
              <label>DESTINO DESEJADO</label>
              <select id="buy-ticket-dest" class="input-field">
                 ${options}
              </select>
            </div>
            <div class="form-group">
              <label>QUANTIDADE DE PASSAGEIROS INCLUINDO VOCÊ (1 a 10)</label>
              <input type="number" id="buy-ticket-qtd" class="input-field" value="1" min="1" max="10">
            </div>
            <div style="font-size:11px; color:var(--green-dark); text-align:justify;">
              O LOBBY EXIGIRÁ QUE <span id="lbl-qtd" style="color:var(--amber)">1</span> AGENTES (COM ESTE MESMO CÓDIGO) ESTEJAM PRESENTES PARA INICIAR A VIAGEM.
            </div>
            <div style="margin-top:10px; padding:10px; background:rgba(0,0,0,0.5); border:1px solid var(--border-dim); display:flex; justify-content:space-between; align-items:center;">
              <span style="color:var(--green-mid); font-size:12px;">CUSTO TOTAL (CR$ 1.000 / PASSAGEM):</span>
              <span id="lbl-cost" style="color:var(--amber); font-size:18px; font-weight:bold;">CR$ 1.000</span>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn" onclick="document.getElementById('modal-buy-ticket').remove()">[ CANCELAR ]</button>
            <button class="btn" onclick="Apps.buyCommercialTickets()" style="background:var(--green); color:var(--bg);">[ EMITIR PASSAGENS ]</button>
          </div>
        </div>
      </div>
    `;
    const div = document.createElement('div');
    div.innerHTML = modalHTML;
    document.body.appendChild(div.firstElementChild);

    // Update label dynamically
    const qtdInput = document.getElementById('buy-ticket-qtd');
    const lblQtd = document.getElementById('lbl-qtd');
    const lblCost = document.getElementById('lbl-cost');
    if (qtdInput && lblQtd && lblCost) {
      qtdInput.addEventListener('input', (e) => {
        const q = parseInt(e.target.value || '1', 10);
        lblQtd.textContent = q;
        lblCost.textContent = `CR$ ${(q * 1000).toLocaleString('pt-BR')}`;
      });
    }

    document.getElementById('modal-buy-ticket').classList.remove('hidden');
  }

  async function buyCommercialTickets() {
    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;

    const dest = document.getElementById('buy-ticket-dest').value;
    const qtd = parseInt(document.getElementById('buy-ticket-qtd').value || '1', 10);
    const profile = Auth.getProfile();
    const origin = profile?.current_planet || 'capitolio';

    if (qtd < 1 || qtd > 10) return showModal({ title: 'ERRO', body: 'QUANTIDADE INVÁLIDA DE PASSAGENS.', type: 'alert' });

    const totalCost = qtd * 1000;
    const { data: userProfile } = await db.from('profiles').select('credits').eq('id', user.id).single();
    if (!userProfile || userProfile.credits < totalCost) {
      return showModal({ title: 'SALDO INSUFICIENTE', body: `VOCÊ PRECISA DE CR$ ${totalCost.toLocaleString('pt-BR')} PARA ESSA OPERAÇÃO.`, type: 'alert' });
    }

    // Generate COM-XXXX code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codeStr = 'COM-';
    for (let i = 0; i < 4; i++) codeStr += chars.charAt(Math.floor(Math.random() * chars.length));

    const { error } = await db.from('commercial_flights').insert({
      ticket_code: codeStr,
      buyer_id: user.id,
      origin: origin,
      destination: dest,
      total_tickets: qtd,
      ticket_price: 1000,
      status: 'scheduled'
    });

    if (error) {
      console.error(error);
      return showNotification('ERRO AO EMITIR', 'FALHA NA EMISSÃO DA PASSAGEM.', 'error');
    }

    // Deduct credits
    const newCredits = userProfile.credits - totalCost;
    await db.from('profiles').update({ credits: newCredits }).eq('id', user.id);

    // Update Header
    const updatedProfile = await Auth.getProfile(true);
    Desktop.updateHeader(updatedProfile);

    document.getElementById('modal-buy-ticket').remove();
    showNotification('PASSAGEM EMITIDA', `O CÓDIGO DA VIAGEM É: ${codeStr}`, 'success');
    switchTravelTab('mine'); // switch back to the 'mine' tab to see it
  }

  async function deleteCommercialFlight(flightId) {
    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;

    const { data: flight } = await db.from('commercial_flights').select('total_tickets, ticket_price, buyer_id').eq('id', flightId).single();
    if (!flight || flight.buyer_id !== user.id) {
      return showNotification('ERRO', 'VOO NÃO ENCONTRADO.', 'error');
    }

    showModal({
      title: 'CANCELAR VOO',
      body: `TEM CERTEZA QUE DESEJA CANCELAR ESTE VOO? OS AGENTES COM OS CÓDIGOS NÃO PODERÃO EMBARCAR.<br><br><b>REEMBOLSO NO VALOR DE: CR$ ${(flight.total_tickets * (flight.ticket_price || 1000)).toLocaleString('pt-BR')}</b>`,
      type: 'confirm',
      onConfirm: async () => {
        const { error } = await db.from('commercial_flights').delete().eq('id', flightId);
        if (error) {
          showNotification('ERRO', 'FALHA AO CANCELAR O VOO.', 'error');
        } else {
          // Refund credits
          const refundAmount = flight.total_tickets * (flight.ticket_price || 1000);
          const { data: profile } = await db.from('profiles').select('credits').eq('id', user.id).single();
          if (profile) {
            await db.from('profiles').update({ credits: profile.credits + refundAmount }).eq('id', user.id);
            Desktop.updateHeader(await Auth.getProfile(true));
          }

          showNotification('VOO CANCELADO', `O VOO FOI REMOVIDO E CR$ ${refundAmount.toLocaleString('pt-BR')} FORAM REEMBOLSADOS.`, 'success');
          loadMyCommercialTickets(); // Refresh the list
        }
      }
    });
  }

  // ==========================================
  // NEXUS BANK (App Bancário)
  // ==========================================
  function nexusBank() {
    return `
      <div id="bank-container" style="display:flex; flex-direction:column; height:100%; color:var(--green-mid); background:var(--bg-dark);">
        <!-- TABS NAV -->
        <div class="app-toolbar" style="border-bottom:1px solid var(--border-dim); padding-bottom:5px; margin-bottom:10px; display:flex; gap:10px; overflow-x:auto;">
          <button class="btn m-tab active" data-tab="resumo" onclick="Apps.switchBankTab('resumo')">[ RESUMO ]</button>
          <button class="btn m-tab" data-tab="transfer" onclick="Apps.switchBankTab('transfer')">[ TRANSFERÊNCIAS ]</button>
          <button class="btn m-tab" data-tab="vaults" onclick="Apps.switchBankTab('vaults')">[ COFRES ]</button>
          <button class="btn m-tab" data-tab="loans" onclick="Apps.switchBankTab('loans')">[ EMPRÉSTIMOS ]</button>
        </div>

        <!-- CONTENT AREA -->
        <div id="bank-content" style="flex:1; overflow-y:auto; padding-right:5px;">
           <div class="loading-state">INICIANDO CONEXÃO SEGURA...<span class="loading-dots"></span></div>
        </div>
      </div>
    `;
  }

  function initNexusBank() {
    switchBankTab('resumo');
  }

  function switchBankTab(tabName) {
    document.querySelectorAll('#bank-container .m-tab').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tabName);
    });

    const content = $('bank-content');
    if (!content) return;

    if (tabName === 'resumo') {
      content.innerHTML = `
        <div style="padding:15px; border:1px solid var(--border-light); background:rgba(0,0,0,0.5);">
           <h3 style="margin:0 0 10px 0; color:var(--green);">SALDO ATUAL</h3>
           <div id="bank-balance-display" style="font-size:24px; font-family:var(--font-logo); color:var(--amber);">CR$ --</div>
        </div>
        <div style="margin-top:20px;">
           <h4 style="margin-bottom:10px; color:var(--green-dim); font-size:12px;">ÚLTIMAS MOVIMENTAÇÕES</h4>
           <div id="bank-statement-list" style="display:flex; flex-direction:column; gap:5px;">
              <div style="font-size:11px; opacity:0.5;">Carregando extrato...</div>
           </div>
        </div>
      `;
      loadBankStatement();
    } else if (tabName === 'transfer') {
      content.innerHTML = `
        <div style="padding:15px; border:1px solid var(--border-light); background:rgba(0,0,0,0.5);">
           <h3 style="margin:0 0 15px 0; color:var(--green);">NOVA TRANSFERÊNCIA (P2P)</h3>
           <label style="display:block; margin-bottom:5px; font-size:11px; color:var(--green-mid);">DESTINATÁRIO:</label>
           <select id="bank-transfer-recipient" class="input-nexus" style="width:100%; margin-bottom:15px;">
              <option value="">Aguarde... Carregando Agentes</option>
           </select>

           <label style="display:block; margin-bottom:5px; font-size:11px; color:var(--green-mid);">VALOR (CR$):</label>
           <input type="number" id="bank-transfer-amount" class="input-nexus" placeholder="Ex: 500" min="1" style="width:100%; margin-bottom:20px;">
           
           <button class="btn" style="width:100%; padding:10px; font-size:14px; background:var(--green); color:#000;" onclick="Apps.executeBankTransfer(event)">[ CONFIRMAR TRANSFERÊNCIA ]</button>
        </div>
      `;
      loadBankTransferRecipients();
    } else if (tabName === 'vaults') {
      content.innerHTML = `
        <div style="padding:15px; border:1px solid var(--border-light); background:rgba(0,0,0,0.5); margin-bottom:15px;">
           <h3 style="margin:0 0 10px 0; color:var(--green);">CRIAR NOVO COFRE</h3>
           <div style="display:flex; gap:10px; margin-bottom:10px;">
              <input type="text" id="bank-vault-name" class="input-nexus" placeholder="Nome (Ex: Nave Nova)" style="flex:2;">
              <input type="number" id="bank-vault-goal" class="input-nexus" placeholder="Meta CR$ (Opcional)" min="0" style="flex:1;">
           </div>
           <button class="btn" style="width:100%; border-color:var(--green); color:var(--green);" onclick="Apps.createBankVault()">[ + ABRIR COFRE ]</button>
        </div>
        <div id="bank-vault-list" style="display:flex; flex-direction:column; gap:10px;">
           <div class="loading-state">LENDO REDE DE COFRES...</div>
        </div>
      `;
      loadBankVaults();
    } else if (tabName === 'loans') {
      content.innerHTML = `
        <div style="padding:15px; border:1px solid var(--border-light); background:rgba(0,0,0,0.5); margin-bottom:15px;">
           <h3 style="margin:0 0 10px 0; color:var(--red-alert);">EMPRÉSTIMOS (AGIOTA)</h3>
           <p style="font-size:11px; color:var(--text-dim); margin-bottom:15px;">
              Atenção: Todo empréstimo possui uma taxa fixa de 30% de juros sobre o valor solicitado. 
              Ao possuir uma dívida ativa, **20% de todas as suas recompensas de missões** serão retidas automaticamente para abater o saldo devedor.
           </p>
           <div style="display:flex; gap:10px; margin-bottom:10px;">
              <input type="number" id="bank-loan-amount" class="input-nexus" placeholder="Valor Desejado (CR$)" min="1" style="flex:1;">
           </div>
           <button class="btn" style="width:100%; border-color:var(--red-alert); color:var(--red-alert);" onclick="Apps.requestBankLoan()">[ SOLICITAR EMPRÉSTIMO ]</button>
        </div>
        <div id="bank-loan-list" style="display:flex; flex-direction:column; gap:10px;">
           <div class="loading-state">VERIFICANDO DÍVIDAS ATIVAS...</div>
        </div>
      `;
      loadBankLoans();
    }
  }

  async function loadBankStatement() {
    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;

    // Load Balance
    const { data: profile } = await db.from('profiles').select('credits').eq('id', user.id).single();
    if (profile && $('bank-balance-display')) {
      $('bank-balance-display').textContent = `CR$ ${profile.credits.toLocaleString('pt-BR')}`;
    }

    // Load Transactions
    const list = $('bank-statement-list');
    if (!list) return;

    const { data: txs, error } = await db.from('bank_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      list.innerHTML = `<div style="color:var(--red-alert); font-size:11px;">ERRO AO BUSCAR EXTRATO</div>`;
      return;
    }

    if (!txs || txs.length === 0) {
      list.innerHTML = `<div style="font-size:11px; opacity:0.5;">NENHUMA MOVIMENTAÇÃO RECENTE.</div>`;
      return;
    }

    list.innerHTML = txs.map(tx => {
      // Determine color and sign based on transaction type
      const isPositive = ['transfer_in', 'loan_received', 'vault_withdraw'].includes(tx.type);
      const color = isPositive ? 'var(--green)' : 'var(--red-alert)';
      const sign = isPositive ? '+' : '-';
      const date = new Date(tx.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

      // Build text desc
      let descStr = tx.description || tx.type.toUpperCase();

      return `
        <div style="background:var(--bg-lighter); padding:8px 10px; border-left:3px solid ${color}; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; flex-direction:column; gap:4px;">
             <span style="font-size:12px; color:var(--text-bright);">${descStr}</span>
             <span style="font-size:10px; color:var(--text-dim);">${date}</span>
          </div>
          <div style="font-size:14px; font-weight:bold; color:${color};">
            ${sign} CR$ ${tx.amount.toLocaleString('pt-BR')}
          </div>
        </div>
      `;
    }).join('');
  }

  async function loadBankTransferRecipients() {
    const db = Auth.db();
    const user = Auth.getUser();
    const select = $('bank-transfer-recipient');
    if (!db || !user || !select) return;

    const { data: profiles } = await db.from('profiles').select('id, display_name, username').neq('id', user.id).order('display_name', { ascending: true });

    if (profiles && profiles.length > 0) {
      select.innerHTML = '<option value="">-- SELECIONE O AGENTE --</option>' + profiles.map(p =>
        `<option value="${p.id}">${p.display_name || p.username || 'AGENTE DESCONHECIDO'}</option>`
      ).join('');
    } else {
      select.innerHTML = '<option value="">NENHUM AGENTE ENCONTRADO</option>';
    }
  }

  async function executeBankTransfer(e) {
    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;

    const recipientId = $('bank-transfer-recipient')?.value;
    const amountVal = $('bank-transfer-amount')?.value;
    const amount = parseInt(amountVal, 10);

    if (!recipientId) return showNotification('ERRO', 'SELECIONE UM DESTINATÁRIO.', 'error');
    if (!amount || isNaN(amount) || amount <= 0) return showNotification('ERRO', 'INSIRA UM VALOR VÁLIDO.', 'error');

    // Fetch current user
    const { data: sender } = await db.from('profiles').select('credits, display_name, username').eq('id', user.id).single();
    if (!sender) return showNotification('ERRO', 'FALHA AO LER SEU PERFIL.', 'error');

    if (sender.credits < amount) {
      return showNotification('SALDO INSUFICIENTE', 'VOCÊ NÃO POSSUI CR$ SUFICIENTES PARA ESTA LIGAÇÃO.', 'error');
    }

    // Process Transfer
    const ev = e || window.event;
    const btn = ev ? ev.target : document.activeElement;

    let oldText = '[ CONFIRMAR TRANSFERÊNCIA ]';
    if (btn && btn.tagName === 'BUTTON') {
      oldText = btn.textContent;
      btn.textContent = '[ PROCESSANDO... ]';
      btn.disabled = true;
    }

    try {
      // 1. Fetch recipient
      const { data: recipient } = await db.from('profiles').select('credits').eq('id', recipientId).single();
      if (!recipient) throw new Error('Destinatário não encontrado.');

      // 2. Deduct from sender
      await db.from('profiles').update({ credits: sender.credits - amount }).eq('id', user.id);

      // 3. Add to recipient
      await db.from('profiles').update({ credits: recipient.credits + amount }).eq('id', recipientId);

      // 4. Create Sender Transaction
      await db.from('bank_transactions').insert({
        user_id: user.id,
        type: 'transfer_out',
        amount: amount,
        description: 'TRANSFERÊNCIA ENVIADA',
        related_user_id: recipientId
      });

      // 5. Create Recipient Transaction
      await db.from('bank_transactions').insert({
        user_id: recipientId,
        type: 'transfer_in',
        amount: amount,
        description: `TRANSFERÊNCIA RECEBIDA de: ${sender.display_name || sender.username || 'AGENTE'}`,
        related_user_id: user.id
      });

      showNotification('TRANSFERÊNCIA CONCLUÍDA', `CR$ ${amount.toLocaleString('pt-BR')} ENVIADOS COM SUCESSO.`, 'success');
      $('bank-transfer-amount').value = '';

      // Refresh Header & Switch back to summary
      Desktop.updateHeader(await Auth.getProfile(true));
      switchBankTab('resumo');

    } catch (err) {
      console.error(err);
      showNotification('ERRO', 'FALHA NA TRANSAÇÃO: ' + err.message, 'error');
    } finally {
      if (btn && btn.tagName === 'BUTTON') {
        btn.textContent = oldText;
        btn.disabled = false;
      }
    }
  }

  async function loadBankVaults() {
    const db = Auth.db();
    const user = Auth.getUser();
    const list = $('bank-vault-list');
    if (!db || !user || !list) return;

    const { data: vaults, error } = await db.from('bank_vaults').select('*').eq('user_id', user.id).order('created_at', { ascending: true });

    if (error) {
      list.innerHTML = `<div style="color:var(--red-alert); font-size:11px;">ERRO AO BUSCAR COFRES</div>`;
      return;
    }

    if (!vaults || vaults.length === 0) {
      list.innerHTML = `<div style="font-size:11px; opacity:0.5; padding:10px; border:1px dashed var(--border-dim); text-align:center;">NENHUM COFRE ATIVO.</div>`;
      return;
    }

    list.innerHTML = vaults.map(v => {
      const hasGoal = v.goal_amount > 0;
      const pct = hasGoal ? Math.min(100, (v.balance / v.goal_amount) * 100).toFixed(1) : 0;

      let progressHtml = '';
      if (hasGoal) {
        progressHtml = `
           <div style="width:100%; height:8px; background:var(--bg-darker); margin:10px 0; border:1px solid var(--border-dim);">
             <div style="height:100%; width:${pct}%; background:var(--amber); transition:width 0.3s;"></div>
           </div>
           <div style="font-size:10px; color:var(--text-dim); display:flex; justify-content:space-between;">
              <span>PROGRESSO: ${pct}%</span>
              <span>META: CR$ ${v.goal_amount.toLocaleString('pt-BR')}</span>
           </div>
         `;
      }

      return `
         <div style="padding:15px; background:var(--bg-lighter); border-left:3px solid var(--amber); margin-bottom:10px;">
           <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <h4 style="margin:0; color:var(--text-bright); font-size:14px; text-transform:uppercase;">${v.name}</h4>
              <div style="display:flex; align-items:center; gap:10px;">
                 <span style="color:var(--amber); font-weight:bold; font-size:16px;">CR$ ${v.balance.toLocaleString('pt-BR')}</span>
                 <button class="btn" style="padding:2px 6px; font-size:12px; color:var(--red-alert); border-color:var(--red-alert); opacity:0.7;" title="Excluir Cofre" onclick="Apps.deleteBankVault('${v.id}')">🗑️</button>
              </div>
           </div>
           ${progressHtml}
           <div style="display:flex; gap:10px; margin-top:15px;">
              <button class="btn" style="flex:1; padding:6px; font-size:11px; background:var(--bg-darker); border-color:var(--green);" onclick="Apps.handleVaultTransaction('${v.id}', 'deposit')">[ DEPOSITAR ]</button>
              <button class="btn" style="flex:1; padding:6px; font-size:11px; background:var(--bg-darker); border-color:var(--red-alert);" onclick="Apps.handleVaultTransaction('${v.id}', 'withdraw')">[ RESGATAR ]</button>
           </div>
         </div>
       `;
    }).join('');
  }

  async function createBankVault() {
    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;

    const name = $('bank-vault-name')?.value?.trim();
    const goalVal = $('bank-vault-goal')?.value;
    const goal = parseInt(goalVal, 10) || 0;

    if (!name) return showNotification('ERRO', 'DÊ UM NOME AO COFRE.', 'error');

    try {
      const { error } = await db.from('bank_vaults').insert({
        user_id: user.id,
        name: name,
        goal_amount: goal,
        balance: 0
      });

      if (error) throw error;

      showNotification('COFRE CRIADO', `O COFRE "${name.toUpperCase()}" FOI ESTABELECIDO.`, 'success');
      $('bank-vault-name').value = '';
      if ($('bank-vault-goal')) $('bank-vault-goal').value = '';
      loadBankVaults();
    } catch (e) {
      console.error(e);
      showNotification('ERRO', 'FALHA AO CRIAR COFRE.', 'error');
    }
  }

  function handleVaultTransaction(vaultId, actionType) {
    const typeLabel = actionType === 'deposit' ? 'DEPOSITAR' : 'RESGATAR';
    showModal({
      title: `${typeLabel} CR$`,
      body: `
        <div style="margin-bottom:15px;">INFORME O VALOR (CR$) PARA TRANSFERIR:</div>
        <input type="number" id="vault-tx-amount" class="input-nexus" placeholder="Ex: 100" min="1" style="width:100%;">
      `,
      type: 'confirm',
      onConfirm: async () => {
        const amount = parseInt($('vault-tx-amount')?.value, 10);
        if (!amount || isNaN(amount) || amount <= 0) return showNotification('ERRO', 'VALOR INVÁLIDO.', 'error');

        const db = Auth.db();
        const user = Auth.getUser();

        const pUser = db.from('profiles').select('credits').eq('id', user.id).single();
        const pVault = db.from('bank_vaults').select('balance, name').eq('id', vaultId).single();

        const [resUser, resVault] = await Promise.all([pUser, pVault]);
        if (!resUser.data || !resVault.data) return showNotification('ERRO', 'FALHA AO LER DADOS.', 'error');

        const profile = resUser.data;
        const vault = resVault.data;

        let newProfileCredits = profile.credits;
        let newVaultBalance = vault.balance;

        if (actionType === 'deposit') {
          if (profile.credits < amount) return showNotification('ERRO', 'VOCÊ NÃO TEM CR$ SUFICIENTES NA CARTEIRA.', 'error');
          newProfileCredits -= amount;
          newVaultBalance += amount;
        } else {
          if (vault.balance < amount) return showNotification('ERRO', 'O COFRE NÃO TEM ESSE VALOR PARA RESGATE.', 'error');
          newProfileCredits += amount;
          newVaultBalance -= amount;
        }

        try {
          await db.from('profiles').update({ credits: newProfileCredits }).eq('id', user.id);
          await db.from('bank_vaults').update({ balance: newVaultBalance }).eq('id', vaultId);

          await db.from('bank_transactions').insert({
            user_id: user.id,
            type: actionType === 'deposit' ? 'vault_deposit' : 'vault_withdraw',
            amount: amount,
            description: actionType === 'deposit' ? `DEPÓSITO NO COFRE: ${vault.name}` : `RESGATE DO COFRE: ${vault.name}`
          });

          showNotification('SUCESSO', `TRANSAÇÃO DO COFRE CONCLUÍDA.`, 'success');
          Desktop.updateHeader(await Auth.getProfile(true));
          loadBankVaults();
        } catch (e) {
          console.error(e);
          showNotification('ERRO', 'FALHA NA TRANSAÇÃO.', 'error');
        }
      }
    });
  }

  function deleteBankVault(vaultId) {
    showModal({
      title: 'EXCLUIR COFRE',
      body: 'TEM CERTEZA QUE DESEJA EXCLUIR ESTE COFRE?<br><br>SE HOUVER SALDO, ELE SERÁ DEVOLVIDO À SUA CONTA PRINCIPAL (CR$). ESSA AÇÃO NÃO PODE SER DESFEITA.',
      type: 'confirm',
      onConfirm: async () => {
        const db = Auth.db();
        const user = Auth.getUser();
        if (!db || !user) return;

        const pUser = db.from('profiles').select('credits').eq('id', user.id).single();
        const pVault = db.from('bank_vaults').select('balance, name').eq('id', vaultId).single();

        const [resUser, resVault] = await Promise.all([pUser, pVault]);
        if (!resUser.data || !resVault.data) return showNotification('ERRO', 'FALHA AO LER DADOS DO COFRE.', 'error');

        const profile = resUser.data;
        const vault = resVault.data;

        try {
          // Se houver dinheiro, devolve pra conta e gera extrato
          if (vault.balance > 0) {
            const newProfileCredits = profile.credits + vault.balance;
            await db.from('profiles').update({ credits: newProfileCredits }).eq('id', user.id);

            await db.from('bank_transactions').insert({
              user_id: user.id,
              type: 'vault_withdraw',
              amount: vault.balance,
              description: `RESGATE (ENCERRAMENTO DE COFRE): ${vault.name}`
            });
          }

          // Deleta o cofre
          const { error } = await db.from('bank_vaults').delete().eq('id', vaultId);
          if (error) throw error;

          showNotification('SUCESSO', `COFRE EXCLUÍDO COM SUCESSO.`, 'success');
          Desktop.updateHeader(await Auth.getProfile(true));
          loadBankVaults();
        } catch (e) {
          console.error(e);
          showNotification('ERRO', 'FALHA AO DELETAR COFRE.', 'error');
        }
      }
    });
  }

  async function loadBankLoans() {
    const db = Auth.db();
    const user = Auth.getUser();
    const list = $('bank-loan-list');
    if (!db || !user || !list) return;

    const { data: loans, error } = await db.from('bank_loans')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      list.innerHTML = `<div style="color:var(--red-alert); font-size:11px;">ERRO AO BUSCAR EMPRÉSTIMOS.</div>`;
      return;
    }

    if (!loans || loans.length === 0) {
      list.innerHTML = `<div style="font-size:11px; opacity:0.5; padding:10px; border:1px dashed var(--border-dim); text-align:center;">NENHUMA DÍVIDA ATIVA. SUA ALMA ESTÁ LIMPA.</div>`;
      return;
    }

    list.innerHTML = loans.map(loan => {
      const pctPaid = Math.min(100, ((loan.total_debt - loan.remaining_amount) / loan.total_debt) * 100).toFixed(1);

      return `
         <div style="padding:15px; background:var(--bg-lighter); border-left:3px solid var(--red-alert); margin-bottom:10px;">
           <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div style="display:flex; flex-direction:column;">
                  <h4 style="margin:0; color:var(--text-bright); font-size:14px; text-transform:uppercase;">DÍVIDA ATIVA</h4>
                  <span style="font-size:10px; color:var(--text-dim);">PEGOU: CR$ ${loan.borrowed_amount.toLocaleString('pt-BR')} (JUROS INCLUSOS)</span>
              </div>
              <span style="color:var(--red-alert); font-weight:bold; font-size:16px;">CR$ ${loan.remaining_amount.toLocaleString('pt-BR')} FALTA</span>
           </div>
           
           <div style="width:100%; height:8px; background:var(--bg-darker); margin:10px 0; border:1px solid var(--border-dim);">
             <div style="height:100%; width:${pctPaid}%; background:var(--red-alert); transition:width 0.3s;"></div>
           </div>
           <div style="font-size:10px; color:var(--text-dim); display:flex; justify-content:space-between;">
              <span>PAGO: ${pctPaid}%</span>
              <span>DÍVIDA TOTAL: CR$ ${loan.total_debt.toLocaleString('pt-BR')}</span>
           </div>

           <div style="display:flex; gap:10px; margin-top:15px;">
              <button class="btn" style="flex:1; padding:6px; font-size:11px; background:var(--bg-darker); border-color:var(--green);" onclick="Apps.payBankLoan('${loan.id}')">[ QUITAR / ABATER DÍVIDA ]</button>
           </div>
         </div>
       `;
    }).join('');
  }

  async function requestBankLoan() {
    const db = Auth.db();
    const user = Auth.getUser();
    if (!db || !user) return;

    const amountVal = $('bank-loan-amount')?.value;
    const amount = parseInt(amountVal, 10);

    if (!amount || isNaN(amount) || amount <= 0) return showNotification('ERRO', 'INSIRA UM VALOR VÁLIDO.', 'error');

    // Juros fixo de 30% (O Agiota)
    const fixedInterestRate = 0.30;
    const totalDebt = Math.ceil(amount + (amount * fixedInterestRate));

    showModal({
      title: 'SOLICITAR EMPRÉSTIMO (AGIOTA)',
      body: `
        <div style="margin-bottom:15px; font-size:12px; line-height:1.5;">
          VOCÊ ESTÁ SOLICITANDO: <strong style="color:var(--green);">CR$ ${amount.toLocaleString('pt-BR')}</strong><br>
          SUA DÍVIDA TOTAL COM 30% DE JUROS SERÁ: <strong style="color:var(--red-alert);">CR$ ${totalDebt.toLocaleString('pt-BR')}</strong><br><br>
          <span style="color:var(--text-dim);">TERMOS: 20% do valor recebido em qualquer missão concluída será sugado automaticamente para pagar esta dívida até a quitação total. Você também pode pagar o valor antecipado no painel.</span>
        </div>
        <div style="font-weight:bold; color:var(--amber);">DESEJA REALMENTE ASSINAR O CONTRATO?</div>
      `,
      type: 'confirm',
      onConfirm: async () => {
        try {
          const { data: profile } = await db.from('profiles').select('credits').eq('id', user.id).single();
          if (!profile) throw new Error('Cidadão não encontrado no sistema principal.');

          // Cria o empréstimo
          const { error: loanError } = await db.from('bank_loans').insert({
            user_id: user.id,
            borrowed_amount: amount,
            total_debt: totalDebt,
            remaining_amount: totalDebt,
            status: 'active'
          });
          if (loanError) throw loanError;

          // Transfere o dinheiro base (sem os juros) pro bolso dele
          await db.from('profiles').update({ credits: profile.credits + amount }).eq('id', user.id);

          // Gera extrato no bank_transactions
          await db.from('bank_transactions').insert({
            user_id: user.id,
            type: 'loan_received',
            amount: amount,
            description: `EMPRÉSTIMO APROVADO (AGIOTA DE DÍVIDA TOTAL: CR$ ${totalDebt.toLocaleString('pt-BR')})`
          });

          showNotification('CONTRATO ASSINADO', `O CR$ ${amount.toLocaleString('pt-BR')} FOI DEPOSITADO NA SUA CONTA.`, 'success');
          $('bank-loan-amount').value = '';
          Desktop.updateHeader(await Auth.getProfile(true));
          loadBankLoans();
        } catch (e) {
          console.error(e);
          showNotification('ERRO', 'O CREDOR RECUSOU SUA PROPOSTA.', 'error');
        }
      }
    });
  }

  function payBankLoan(loanId) {
    showModal({
      title: 'PAGAR DÍVIDA',
      body: `
        <div style="margin-bottom:15px;">INFORME QUANTO VOCÊ DESEJA ABATER DA DÍVIDA COM SEUS CR$ ATUAIS:</div>
        <input type="number" id="loan-pay-amount" class="input-nexus" placeholder="CR$ para pagar..." min="1" style="width:100%;">
      `,
      type: 'confirm',
      onConfirm: async () => {
        const amount = parseInt($('loan-pay-amount')?.value, 10);
        if (!amount || isNaN(amount) || amount <= 0) return showNotification('ERRO', 'VALOR INVÁLIDO.', 'error');

        const db = Auth.db();
        const user = Auth.getUser();

        const pUser = db.from('profiles').select('credits').eq('id', user.id).single();
        const pLoan = db.from('bank_loans').select('remaining_amount').eq('id', loanId).single();

        const [resUser, resLoan] = await Promise.all([pUser, pLoan]);
        if (!resUser.data || !resLoan.data) return showNotification('ERRO', 'FALHA AO LER REGISTROS.', 'error');

        const profile = resUser.data;
        const loan = resLoan.data;

        if (profile.credits < amount) return showNotification('ERRO', 'VOCÊ NÃO TEM ESSE VALOR PARA PAGAR.', 'error');

        // Não deixa pagar mais do que a dívida
        const actualAmountToPay = Math.min(amount, loan.remaining_amount);

        try {
          const newDebt = loan.remaining_amount - actualAmountToPay;
          const newStatus = newDebt <= 0 ? 'paid' : 'active';

          // Deduz do usuário
          await db.from('profiles').update({ credits: profile.credits - actualAmountToPay }).eq('id', user.id);

          // Atualiza Loan
          await db.from('bank_loans').update({
            remaining_amount: newDebt,
            status: newStatus
          }).eq('id', loanId);

          // Gera transação de pagamento
          await db.from('bank_transactions').insert({
            user_id: user.id,
            type: 'loan_payment',
            amount: actualAmountToPay,
            description: `PAGAMENTO PARCIAL DE EMPRÉSTIMO` + (newStatus === 'paid' ? ' (QUITADO)' : '')
          });

          if (newStatus === 'paid') {
            showNotification('DÍVIDA QUITADA!', 'VOCÊ NÃO DEVE MAIS NADA.', 'success');
          } else {
            showNotification('PAGAMENTO ACEITO', `CR$ ${actualAmountToPay.toLocaleString('pt-BR')} ABATIDOS DA SUA DÍVIDA.`, 'success');
          }

          Desktop.updateHeader(await Auth.getProfile(true));
          loadBankLoans();
        } catch (e) {
          console.error(e);
          showNotification('ERRO', 'FALHA AO PROCESSAR PAGAMENTO.', 'error');
        }
      }
    });
  }

  return {
    render, init,
    openLightbox, editArtwork, deleteArtwork, openEmail, deleteEmail,
    updateMissionStatus, deleteMission, openBriefing, viewMissionRoute,
    respondToMission, filterMissions, editMission, saveMissionEdit,
    changeUserRole, deleteUser, changeAgentLocation,
    showNotification, initGlobalRealtime,
    showModal, buyItem, showItemDetails, filterShop,
    initInventory, initStats, initMap, openMugshotUpload,
    deleteItem, selectCombatTarget, toggleEquip, handleItemClick, useItem, dropItem, sellItem,
    openCargoTransfer,
    toggleTransferSelect,
    selectAllTransfer,
    batchTransfer,
    prepShipTravel, joinTravelLobby, loadShipData, openRefuelMenu, handleRefuel, setCustomVoyageDestination,
    switchShipTab, loadLocalShips, viewLocalShip, boardShip, unboardShip,
    switchTravelTab, loadCommercialBoard, loadMyCommercialTickets, openBuyTicketModal, buyCommercialTickets, deleteCommercialFlight,
    saveCombatBio, saveCombatVitals, saveCombatMental, saveCombatAttrs, modVital, modSanity, giveLoot,
    deleteVaultItem, openPadlock, closePadlock, submitPadlock, _padlockType, _padlockBackspace,
    openAgentTransferMenu, transferItemToAgent,
    openNewDM, openNewGroup, createDM, switchRoom, clearGeneralChat, toggleChatSidebar,
    clearChat, deleteRoom, _selectGroupIcon,
    switchAdminTab, loadAdminItems, loadCombatAgents, deleteAdminTravel, resumeAdminTravel,
    deleteAdminMission, loadAdminMissions,
    copyToClipboard, renderAgentLocationCard,
    hangarApp, initHangarApp, buyHangarSlot, activateHangarShip,
    deactivateHangarShip, sellHangarShip,
    nexusBank, initNexusBank, switchBankTab, executeBankTransfer, loadBankTransferRecipients,
    loadBankVaults, createBankVault, handleVaultTransaction, deleteBankVault,
    loadBankLoans, requestBankLoan, payBankLoan
  };

})();
window.Apps = Apps;
