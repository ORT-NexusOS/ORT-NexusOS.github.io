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
    notepad: { icon: '📝', title: 'BLOCO DE NOTAS', path: 'O.R.T. > TOOLS > NOTEPAD' },
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
    const renders = { gallery, videos, missions, emails, notepad, vault, calendar, terminal, admin };
    return titlebar(appId) + `<div class="app-content" id="content-${appId}">` +
      (renders[appId] ? renders[appId]() : '<div class="empty-state">EM DESENVOLVIMENTO</div>') +
      '</div>';
  }

  /* ── Init Logic ──────────────────────────────────────────── */
  function init(appId) {
    const inits = {
      gallery: initGallery, videos: initVideos, missions: initMissions,
      emails: initEmails, notepad: initNotepad, vault: initVault,
      calendar: initCalendar, terminal: initTerminal, admin: initAdmin
    };
    if (inits[appId]) setTimeout(() => inits[appId](), 50);
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
      <div style="border-bottom:1px solid var(--border);padding:6px 12px;display:grid;grid-template-columns:1fr auto auto;gap:12px;font-family:var(--font-code);font-size:12px;color:var(--green-mid);letter-spacing:1px;text-transform:uppercase;">
        <span>MISSÃO</span><span>STATUS</span><span>AÇÃO</span>
      </div>
      <div id="missions-list"><div class="loading-state">CARREGANDO<span class="loading-dots"></span></div></div>`;
  }

  const MISSION_STATUS = ['ativa', 'completa', 'arquivada'];
  const STATUS_LABELS = { ativa: '[ATIVA]', completa: '[COMPLETA]', arquivada: '[ARQUIVADA]' };
  const STATUS_CLS = { ativa: 'chip-active', completa: 'chip-done', arquivada: 'chip-arch' };

  function initMissions() {
    loadMissions();
    $('btn-add-mission')?.addEventListener('click', () => $('missions-add-form')?.classList.toggle('hidden'));
    $('btn-cancel-mission')?.addEventListener('click', () => $('missions-add-form')?.classList.add('hidden'));
    $('btn-save-mission')?.addEventListener('click', saveMission);
  }

  async function saveMission() {
    const code = $('m-code')?.value?.trim();
    const desc = $('m-desc')?.value?.trim();
    const briefing = $('m-briefing')?.value?.trim();
    if (!code) { alert('Código obrigatório.'); return; }
    const db = Auth.db();
    if (db) await db.from('missions').insert({
      title: code,
      description: desc,
      briefing: briefing,
      status: 'ativa'
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
        </div>
        <span class="chip ${STATUS_CLS[m.status] || ''}">${STATUS_LABELS[m.status] || m.status.toUpperCase()}</span>
        <div style="display:flex;gap:6px;align-items:center;">
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
    if (db) { await db.from('missions').update({ status }).eq('id', id); loadMissions(); }
  }

  async function deleteMission(id) {
    if (!confirm('DESEJA REALMENTE APAGAR ESTA MISSÃO?')) return;
    const db = Auth.db();
    if (db) {
      const { error } = await db.from('missions').delete().eq('id', id);
      if (error) alert('ERRO AO EXCLUIR: ' + error.message);
      loadMissions();
    }
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

    // Filtro Onda 5: Ver o que me mandaram, o que eu mandei, ou o que é global
    if (db && !isAdmin) {
      query = query.or(`recipient.eq.all,recipient_id.eq.${userId},sender_id.eq.${userId}`);
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
    if (!confirm('APAGAR ESTA COMUNICAÇÃO PERMANENTEMENTE?')) return;
    const db = Auth.db();
    if (db) {
      const { error } = await db.from('emails').delete().eq('id', id);
      if (error) alert('ERRO NO PROTOCOLO DE EXCLUSÃO: ' + error.message);
      loadEmails();
    }
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
      if (!subject || !body) { alert('ASSUNTO e MENSAGEM obrigatórios.'); return; }

      const { error } = await db.from('emails').insert({
        sender: Auth.getProfile()?.display_name || 'AGENTE',
        sender_id: Auth.getUser()?.id,
        subject,
        body,
        recipient: recipient_id === 'all' ? 'all' : 'private',
        recipient_id: recipient_id === 'all' ? null : recipient_id,
        attachments,
        unread: true,
        date: ud
      });

      if (!error) {
        overlay.remove();
        loadEmails();
      } else {
        alert('ERRO AO ENVIAR: ' + error.message);
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
        alert('NOTAS SINCRONIZADAS COM O MAINFRAME.');
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
  function admin() {
    if (!Auth.isAdmin()) {
      return '<div class="empty-state"><span class="empty-state-icon">⚠</span>ACESSO RESTRITO — SOMENTE ADMINISTRADORES</div>';
    }
    return `
      <div class="app-toolbar">
        <button class="btn" id="btn-admin-new-user">[ + NOVO AGENTE ]</button>
        <span class="app-toolbar-sep"></span>
        <span style="font-family:var(--font-code);font-size:12px;color:var(--green-mid);">PAINEL DE CONTROLE ADM — O.R.T.</span>
      </div>
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
      <div style="border-bottom:1px solid var(--border);padding:6px 12px;display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:12px;font-family:var(--font-code);font-size:11px;color:var(--green-mid);letter-spacing:1px;text-transform:uppercase;">
        <span>AGENTE</span><span>EMAIL</span><span>CLEARANCE</span><span>AÇÃO</span>
      </div>
      <div id="admin-user-list"><div class="loading-state">CARREGANDO AGENTES<span class="loading-dots"></span></div></div>`;
  }

  async function initAdmin() {
    if (!Auth.isAdmin()) return;
    loadAdminUsers();
    $('btn-admin-new-user')?.addEventListener('click', () => $('admin-new-user-form')?.classList.toggle('hidden'));
    $('btn-cancel-new-user')?.addEventListener('click', () => $('admin-new-user-form')?.classList.add('hidden'));
    $('btn-save-new-user')?.addEventListener('click', createNewUser);
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
    if (!confirm('Excluir este agente?')) return;
    await Auth.adminDeleteUser(userId);
    loadAdminUsers();
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
      if (toast.parentElement) toast.remove();
    }, 8000);
  }

  function initEmailRealtime() {
    const db = Auth.db();
    if (!db) return;

    const userId = Auth.getUser()?.id;

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
          // showNotification é a UI interna do site (toast/alerta)
          showNotification('NOVA COMUNICAÇÃO', `DE: ${email.sender}<br>ASSUNTO: ${email.subject}`, 'new-email');
        }
      })
      .subscribe();
  }

  return {
    render, init,
    openLightbox, openEmail, deleteEmail,
    updateMissionStatus, deleteMission, openBriefing,
    changeUserRole, deleteUser,
    showNotification, initEmailRealtime
  };

})();
