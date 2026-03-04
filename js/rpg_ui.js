// ══════════════════════════════════════════════════════════
// ORT - AGENT RPG SHEET UI CONTROLLER
// ══════════════════════════════════════════════════════════

window.ORT_SKILLS_CATALOG = [
  "Acrobacia", "Adestramento", "Artes", "Atletismo", "Atualidades", "Ciência",
  "Crime", "Diplomacia", "Enganação", "Fortitude", "Furtividade", "Iniciativa",
  "Intimidação", "Intuição", "Investigação", "Luta", "Medicina", "Ocultismo",
  "Percepção", "Pilotagem", "Pontaria", "Profissão", "Reflexos", "Religião",
  "Sobrevivência", "Tática", "Tecnologia", "Vontade"
];

let currentUserProfile = null;

window.rpgSheetHTML = function () {
  return `
    <div class="app-body" style="padding:0; overflow:hidden; display:flex; flex-direction:column; background:var(--bg); height:100%;">
      <div class="rpg-nav">
        <button class="rpg-tab-btn active" data-tab="rpg-tab-stats" onclick="switchRpgTab('rpg-tab-stats')">[ STATUS & ATRIBUTOS ]</button>
        <button class="rpg-tab-btn" data-tab="rpg-tab-skills" onclick="switchRpgTab('rpg-tab-skills')">[ CONHECIMENTOS ]</button>
        <button class="rpg-tab-btn" data-tab="rpg-tab-catalog" onclick="switchRpgTab('rpg-tab-catalog')">[ CATÁLOGO DE HABILIDADES ]</button>
        <button class="rpg-tab-btn" data-tab="rpg-tab-rituals" onclick="switchRpgTab('rpg-tab-rituals')">[ ARSENAL ARCANO ]</button>
      </div>
      
      <div class="rpg-content scrollable">
        
        <!-- TAB 1: STATS -->
        <div id="rpg-tab-stats" class="rpg-tab-pane active">
          <div class="rpg-stats-grid">
            <!-- Left Col: Vitals -->
            <div class="rpg-vitals-panel box-panel">
              <div class="agent-identity">
                AGENTE <span id="rpg-name" class="glow" style="color:var(--amber);">...</span>
              </div>
              <div class="agent-role" style="color:var(--green-dark); margin-bottom:15px; font-family:var(--font-code);">
                CLASS: <span id="rpg-role">...</span> | RACE: <span id="rpg-race">...</span>
              </div>

              <div class="level-box">
                <div style="font-size:12px; color:var(--green-mid);">NÍVEL ATUAL</div>
                <div id="rpg-level" style="font-size:36px; color:var(--green); text-shadow:0 0 10px var(--green);">1</div>
              </div>

              <div class="xp-bar-container" style="margin-top:10px;">
                <div style="display:flex; justify-content:space-between; font-size:14px; font-weight:bold; color:var(--green-light);">
                  <span>XP TOTAL: <span id="rpg-xp-total">0</span></span>
                  <span>PRÓX. NÍVEL: <span id="rpg-xp-next">300</span></span>
                </div>
                <div class="xp-track" style="width:100%; height:8px; background:var(--green-dim); margin-top:4px;">
                  <div id="rpg-xp-fill" style="height:100%; width:0%; background:var(--amber); transition:width 0.3s;"></div>
                </div>
              </div>

              <hr style="border-color:var(--border-dim); margin:15px 0;">

              <div class="vital-meters">
                <div class="meter-row">
                  <span style="color:var(--red-alert);">HP (Vida)</span>
                  <span id="rpg-hp-val">16/16</span>
                </div>
                <div class="meter-row">
                  <span style="color:var(--blue);">SP (Espírito)</span>
                  <span id="rpg-sp-val">11/11</span>
                </div>
                <div class="meter-row">
                  <span style="color:var(--amber);">Sanidade</span>
                  <span id="rpg-san-val">5/5</span>
                </div>
                <div class="meter-row">
                  <span style="color:var(--green-mid);">Defesa Fisica</span>
                  <span id="rpg-def-val">4</span>
                </div>
              </div>
            </div>

            <!-- Right Col: Attributes -->
            <div class="rpg-attrs-panel box-panel">
              <div class="panel-title">> PAINEL DE ATRIBUTOS (<span id="rpg-attr-pts" style="color:var(--amber);">0</span> PTS)</div>
              <div class="attr-list" id="rpg-attr-list">
                <!-- JS builds this -->
              </div>
              <button class="btn" id="btn-save-attributes" onclick="saveAttributes()" style="width:100%; margin-top:15px; display:none; background:var(--green); color:black;">[ SALVAR DNA ]</button>
            </div>
          </div>
        </div>

        <!-- TAB 2: SKILLS -->
        <div id="rpg-tab-skills" class="rpg-tab-pane">
          <div class="box-panel">
            <div class="panel-title">> PERÍCIAS TREINADAS</div>
            <p style="font-size:12px; color:var(--green-dark); margin-bottom:15px;" id="rpg-skills-desc">Baseado no Limite [SABEDORIA + 3] + Bônus de Elite.</p>
            <div id="rpg-skills-list" style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <!-- JS builds this list -->
            </div>
          </div>
        </div>

        <!-- TAB 3: ABILITIES -->
        <div id="rpg-tab-catalog" class="rpg-tab-pane">
           <div class="box-panel">
             <div style="display:flex; justify-content:space-between; align-items:center;">
                <div class="panel-title">> SISTEMA DE OVERRIDE TÁTICO</div>
                <div style="font-family:var(--font-code); color:var(--blue);">PONTOS DE HABILIDADE: <span id="rpg-ab-pts" style="font-size:18px; color:var(--amber);">0</span></div>
             </div>
             
             <div class="ability-tiers-container" style="margin-top:15px;">
                <h3 style="color:var(--green); border-bottom:1px solid var(--border-dim); padding-bottom:5px;">• NÍVEL INICIANTE</h3>
                <div id="catalog-tier-1" class="catalog-grid"></div>

                <h3 style="color:var(--amber); border-bottom:1px solid var(--border-dim); padding-bottom:5px; margin-top:20px;">• NÍVEL EXPERIENTE</h3>
                <div id="catalog-tier-2" class="catalog-grid"></div>

                <h3 style="color:var(--red-alert); border-bottom:1px solid var(--border-dim); padding-bottom:5px; margin-top:20px;">• NÍVEL MESTRE</h3>
                <div id="catalog-tier-3" class="catalog-grid"></div>
             </div>
           </div>
        </div>
        </div>

        <!-- TAB 4: RITUALS & TAROT -->
        <div id="rpg-tab-rituals" class="rpg-tab-pane">
          <div class="rpg-rituals-layout">
            
            <!-- Affinity Selection -->
            <div id="ritual-affinity-selection" class="box-panel hidden" style="text-align:center; padding:40px;">
              <div class="panel-title" style="font-size:24px; margin-bottom:20px;">ESCOLHA SUA AFINIDADE RITUALÍSTICA</div>
              <p style="color:var(--green-mid); margin-bottom:30px;">Esta escolha definirá quais rituais você poderá dominar. Escolha com sabedoria, Agente.</p>
              <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:20px;">
                <div class="affinity-card" onclick="setRitualAffinity('Sangue')">
                  <div style="font-size:40px;">🩸</div>
                  <div style="color:var(--red-alert); font-weight:bold; margin-top:10px;">SANGUE</div>
                  <p style="font-size:11px; margin-top:10px;">Dano brutal, sacrifício e cura vital.</p>
                </div>
                <div class="affinity-card" onclick="setRitualAffinity('Conhecimento')">
                  <div style="font-size:40px;">👁️</div>
                  <div style="color:var(--blue); font-weight:bold; margin-top:10px;">CONHECIMENTO</div>
                  <p style="font-size:11px; margin-top:10px;">Percepção, mente e controle da realidade.</p>
                </div>
                <div class="affinity-card" onclick="setRitualAffinity('Energia')">
                  <div style="font-size:40px;">⚡</div>
                  <div style="color:var(--amber); font-weight:bold; margin-top:10px;">ENERGIA</div>
                  <p style="font-size:11px; margin-top:10px;">Caos, eletricidade e manipulação temporal.</p>
                </div>
              </div>
            </div>

            <div id="ritual-main-ui" class="hidden">
              <div class="ritual-loadout-controls">
                 <div>
                   <span style="color:var(--green-mid); font-size:12px;">REFRESHES RESTANTES: </span>
                   <span id="refresh-count-display" style="color:var(--amber); font-weight:bold;">3</span>
                 </div>
                 <div style="display:flex; gap:10px; align-items:center;">
                   <div id="lock-status-banner" style="display:none; background:var(--green); color:black; padding:4px 12px; font-weight:bold; border-radius:4px; font-size:11px; animation: glow-green 2s infinite;">[ ✔ LOADOUT PRONTO PARA MISSÃO ]</div>
                   <div id="loadout-action-buttons" style="display:flex; gap:10px;">
                     <button class="btn" id="btn-refresh-loadout" onclick="handleRefreshLoadout()" style="font-size:11px;">[ 🗘 RESORT ]</button>
                     <button class="btn hidden" id="btn-lock-loadout" onclick="lockLoadout()" style="font-size:11px; background:var(--green); color:black; border-color:var(--green-light);">[ 🔒 TRANCAR LOADOUT ]</button>
                   </div>
                 </div>
              </div>

              <div class="ritual-deck-container box-panel">
                <div class="panel-title">> LOADOUT ARCANO ATIVO</div>
                <div class="ritual-slots">
                  <div class="ritual-slot-wrapper">
                    <div class="ritual-slot empty" id="ritual-slot-0" onclick="unequipRitual(0)">
                      <div class="slot-label">SLOT 1</div>
                      <div class="slot-content">VAZIO</div>
                    </div>
                    <button class="btn-lock" id="btn-lock-0" onclick="handleToggleLock(0)" title="Trancar Ritual">
                      <span class="lock-icon" id="lock-icon-0">🔓</span>
                    </button>
                  </div>
                  
                  <div class="ritual-slot-wrapper">
                    <div class="ritual-slot empty" id="ritual-slot-1" onclick="unequipRitual(1)">
                      <div class="slot-label">SLOT 2</div>
                      <div class="slot-content">VAZIO</div>
                    </div>
                    <button class="btn-lock" id="btn-lock-1" onclick="handleToggleLock(1)" title="Trancar Ritual">
                      <span class="lock-icon" id="lock-icon-1">🔓</span>
                    </button>
                  </div>

                  <div class="ritual-slot-wrapper">
                    <div class="ritual-slot empty" id="ritual-slot-2" onclick="unequipRitual(2)">
                      <div class="slot-label">SLOT 3</div>
                      <div class="slot-content">VAZIO</div>
                    </div>
                    <button class="btn-lock" id="btn-lock-2" onclick="handleToggleLock(2)" title="Trancar Ritual">
                      <span class="lock-icon" id="lock-icon-2">🔓</span>
                    </button>
                  </div>

                  <!-- Tarot Slot -->
                  <div class="ritual-slot-wrapper">
                    <div class="tarot-slot" id="tarot-card-display" onclick="rollTarot()">
                      <span>CLIQUE PARA GIRAR</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="ritual-catalog-container">
                <div class="box-panel" style="margin-bottom:15px;">
                   <div style="display:flex; justify-content:space-between; align-items:center;">
                      <div>
                        <div class="panel-title" style="margin-bottom:4px;">RITUAIS DISPONÍVEIS: <span id="current-affinity-display" style="color:var(--green);">...</span></div>
                        <div style="font-size:12px; color:var(--green-dark);">NÍVEL RITUALÍSTICO: <span id="ritual-level-display" style="color:var(--amber);">INICIANTE</span></div>
                      </div>
                      <button class="btn" id="btn-upgrade-ritual" onclick="upgradeRitualLevel()" style="background:var(--amber); color:black; font-size:11px;">[ EVOLUIR RITMO (-2 ATTR) ]</button>
                   </div>
                </div>

                <div id="ritual-list" class="ritual-grid"></div>
              </div>
            </div>
          </div>
        </div>

      </div> <!-- end rpg-content -->
    </div>
  `;
};

// Initialize the sheet when opening
window.initRpgSheet = async function () {
  if (typeof Apps !== 'undefined' && Apps.showNotification) Apps.showNotification('SISTEMA', 'BAIXANDO ARQUIVOS VITAIS DO AGENTE...', 'info');

  switchRpgTab('rpg-tab-stats');

  try {
    const user = typeof Auth !== 'undefined' ? Auth.getUser() : null;
    if (!user) {
      console.error("[RPG] No auth user found!");
      return;
    }

    const db = Auth.db();
    let profile = await Auth.getProfile(); // try cached first

    // Always try to fetch fresh from DB, fallback to cache if error
    const { data, error } = await db.from('profiles').select('*').eq('id', user.id).single();
    if (error) {
      console.error("[RPG] Could not fetch fresh profile, using cached:", error);
    } else if (data) {
      profile = data;
    }

    if (!profile) {
      console.error("[RPG] No profile loaded!");
      return;
    }

    currentUserProfile = profile;

    // Default initializations if DB lacks it
    if (!profile.attributes) profile.attributes = { FOR: 1, DES: 1, CON: 1, INT: 1, SAB: 1, ESP: 1 };
    if (!profile.trained_skills) profile.trained_skills = [];
    if (!profile.unlocked_abilities) profile.unlocked_abilities = [];

    tempAttrAllocation = {};
    tempAttrPoints = 0;

    renderRpgVitals(profile);
    renderRpgAttributes(profile);
    renderRpgSkillsList(profile);
    renderRpgAbilityCatalog(profile);

  } catch (e) {
    console.error("Error loading RPG sheet", e);
  }
}

window.switchRpgTab = function (tabId) {
  document.querySelectorAll('.rpg-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.rpg-tab-pane').forEach(pane => pane.classList.remove('active'));

  const btn = document.querySelector(`.rpg-tab-btn[data-tab="${tabId}"]`);
  const pane = document.getElementById(tabId);
  if (btn) btn.classList.add('active');
  if (pane) pane.classList.add('active');

  if (tabId === 'rpg-tab-catalog') renderRpgAbilityCatalog(currentUserProfile);
  if (tabId === 'rpg-tab-rituals') renderRitualsTab(currentUserProfile);
}

function renderRpgVitals(p) {
  const el = (id) => document.getElementById(id);
  if (!el('rpg-name')) return; // Check if DOM exists

  el('rpg-name').textContent = p.display_name || p.username;
  el('rpg-role').textContent = (p.role_class || 'Agente do Oculto').toUpperCase();
  el('rpg-level').textContent = p.level || 1;

  // Race UI Handling
  const raceContainer = el('rpg-race');
  if (raceContainer) {
    if (p.attributes && p.attributes.race_applied) {
      // Already locked in
      raceContainer.innerHTML = `<span style="color:var(--green);">${(p.race || 'HUMANO').toUpperCase()}</span>`;
    } else {
      // Needs Selection
      let raceOps = "";
      Object.keys(window.ORT_RACES).forEach(r => {
        raceOps += `<option value="${r}">${r.toUpperCase()}</option>`;
      });
      raceContainer.innerHTML = `
              <select id="race-selector" style="background:var(--bg-dark); color:var(--amber); border:1px solid var(--amber); font-family:var(--font-code); cursor:pointer;">
                  <option value="" disabled selected>SELECIONE A RAÇA</option>
                  ${raceOps}
              </select>
              <button onclick="confirmRaceSelection()" class="btn" style="padding:2px 8px; font-size:10px; margin-left:5px; border-color:var(--amber); color:var(--amber);">CONFIRMAR</button>
          `;
    }
  }

  // XP Bar
  const xpTotalElem = el('rpg-xp-total');
  const xpNextElem = el('rpg-xp-next');
  const xpFill = el('rpg-xp-fill');

  const curLevelData = RPG.getLevelData(p.level || 1);
  xpTotalElem.textContent = p.xp || 0;
  xpNextElem.textContent = curLevelData.nextXP === 0 ? 'MAX' : curLevelData.nextXP;

  if (curLevelData.nextXP === 0) {
    xpFill.style.width = '100%';
  } else {
    const prevLevelData = RPG.getLevelData((p.level || 1) - 1);
    const xpFloor = prevLevelData.xpTotal;
    const currentProgress = (p.xp || 0) - xpFloor;
    const requiredForNext = curLevelData.nextXP - xpFloor;
    const pct = Math.min((currentProgress / requiredForNext) * 100, 100);
    xpFill.style.width = `${pct}%`;
  }

  let needsFix = false;
  let updateData = {};

  // If the user hasn't selected their race yet, disable auto-fix.
  // We ONLY apply the racial bonuses once they confirm their selection.
  if (p.attributes && p.attributes.race_applied && needsFix === false) {
    // Already fixed
  } else if (!p.attributes || !p.attributes.race_applied) {
    // Do not auto-apply Humano. Wait for user selection via UI.
  }

  // 2. Vital Meters (Calc done AFTER potential racial bonuses)
  let maxHp = RPG.calcMaxHP(p.attributes.CON, p.level || 1, p);
  let maxSp = RPG.calcMaxSP(p.attributes.ESP, p.level || 1, p);
  let def = RPG.calcDefense(p.attributes.CON, p.attributes.DES, p);

  if (p.hp_current > maxHp) {
    p.hp_current = maxHp;
    updateData.hp_current = maxHp;
    needsFix = true;
  }
  if (p.sp_current > maxSp) {
    p.sp_current = maxSp;
    updateData.sp_current = maxSp;
    needsFix = true;
  }

  if (needsFix) {
    Auth.db().from('profiles').update(updateData).eq('id', p.id).then(() => {
      console.log("[RPG] Auto-corrected bugged HP/SP capacity, applied Racial Bonuses, and Starting Ability Point.");
    });
  }

  el('rpg-hp-val').textContent = `${p.hp_current || maxHp}/${maxHp}`;
  el('rpg-sp-val').textContent = `${p.sp_current || maxSp}/${maxSp}`;
  el('rpg-san-val').textContent = `${p.sanity || 5}/5`;
  el('rpg-def-val').textContent = def;
}

window.confirmRaceSelection = async function () {
  const sel = document.getElementById('race-selector');
  if (!sel || !sel.value) {
    if (typeof Apps !== 'undefined' && Apps.showNotification)
      Apps.showNotification('REQUISITO', "Por favor, selecione uma raça primeiro.", 'warning');
    return;
  }

  const selectedRace = sel.value;
  const p = currentUserProfile;
  if (!p) return;

  const raceD = window.ORT_RACES[selectedRace];
  if (!raceD) return;

  // 1. Calculate new attributes based on race bonuses
  const attrs = p.attributes || { FOR: 1, DES: 1, CON: 1, INT: 1, SAB: 1, ESP: 1 };
  if (raceD.bonuses) {
    for (let k in raceD.bonuses) {
      attrs[k] = (attrs[k] || 1) + raceD.bonuses[k];
    }
  }
  if (raceD.fixed) {
    for (let k in raceD.fixed) {
      attrs[k] = raceD.fixed[k];
    }
  }
  attrs.race_applied = true;

  // 2. Grant 1 Starting Ability Point
  const newAbilityPts = (p.ability_points || 0) + 1;

  // 3. Calc max HP/SP based on new stats to fully heal
  const maxHp = RPG.calcMaxHP(attrs.CON, p.level || 1);
  const maxSp = RPG.calcMaxSP(attrs.ESP, p.level || 1);

  // 4. Update Profile object locally
  p.race = selectedRace;
  p.attributes = attrs;
  p.ability_points = newAbilityPts;
  p.hp_current = maxHp;
  p.sp_current = maxSp;

  try {
    if (typeof Apps !== 'undefined' && Apps.showNotification)
      Apps.showNotification('BIOMETRIA', "Aplicando DNA e Biologia O.R.T...", 'info');
    const db = Auth.db();
    await db.from('profiles').update({
      race: selectedRace,
      attributes: attrs,
      ability_points: newAbilityPts,
      hp_current: maxHp,
      sp_current: maxSp
    }).eq('id', p.id);

    if (typeof Apps !== 'undefined' && Apps.showNotification)
      Apps.showNotification('BIOMETRIA', `Raça confirmada: ${selectedRace.toUpperCase()}`, 'success');
    if (typeof Apps !== 'undefined' && Apps.showNotification) Apps.showNotification('PROGRESSO', "+1 Ponto de Habilidade Concedido!", 'success');

    // Re-render everything
    renderRpgVitals(p);
    renderRpgAttributes(); // Needs to update because caps changed
    renderRpgAbilityCatalog(p); // Points changed
  } catch (e) {
    console.error(e);
    showNotification("Erro ao salvar Raça.", "var(--cancel-red)");
  }
}

// ============== ATTRIBUTES LOGIC ==============
let tempAttrAllocation = {};
let tempAttrPoints = 0;

function renderRpgAttributes() {
  const p = currentUserProfile;
  const listEl = document.getElementById('rpg-attr-list');
  if (!listEl) return;
  listEl.innerHTML = '';

  if (Object.keys(tempAttrAllocation).length === 0) {
    tempAttrAllocation = { ...p.attributes };
    tempAttrPoints = p.attribute_points || 0;
  }

  document.getElementById('rpg-attr-pts').textContent = tempAttrPoints;

  const attrNames = { FOR: "FORÇA (FOR)", DES: "AGILIDADE (DES)", CON: "CONSTITUIÇÃO (CON)", INT: "INTELIGÊNCIA (INT)", SAB: "SABEDORIA (SAB)", ESP: "ESPÍRITO (ESP)" };

  const userRace = p.race || 'Humano';
  const raceData = window.ORT_RACES[userRace] || window.ORT_RACES['Humano'];

  Object.keys(attrNames).forEach(attrKey => {
    // Determine cap for this attribute based on race
    const cap = (raceData.caps && (raceData.caps[attrKey] !== undefined ? raceData.caps[attrKey] : raceData.caps["*"])) || 10;

    // Check if attribute is completely locked (e.g., Espírito for Androide)
    const isFixed = raceData.fixed && raceData.fixed[attrKey] !== undefined;

    const r = document.createElement('div');
    r.className = 'attr-row';
    r.innerHTML = `
      <div class="attr-label" title="${attrNames[attrKey]}">${attrKey}</div>
      <div class="attr-val" id="val-${attrKey}" style="${isFixed ? 'color: var(--cancel-red);' : tempAttrAllocation[attrKey] >= cap ? 'color: var(--amber);' : ''}">${tempAttrAllocation[attrKey]}</div>
      <div class="attr-controls">
        <button onclick="changeAttr('${attrKey}', -1)" ${isFixed || tempAttrAllocation[attrKey] <= p.attributes[attrKey] ? 'disabled' : ''}>-</button>
        <button onclick="changeAttr('${attrKey}', 1)" ${isFixed || tempAttrPoints === 0 || tempAttrAllocation[attrKey] >= cap ? 'disabled' : ''}>+</button>
      </div>
    `;
    listEl.appendChild(r);
  });

  const saveBtn = document.getElementById('btn-save-attributes');
  if (tempAttrPoints < (p.attribute_points || 0)) {
    saveBtn.style.display = 'block';
  } else {
    saveBtn.style.display = 'none';
  }
}

window.changeAttr = function (attrKey, delta) {
  if (!currentUserProfile) return;
  const baseVal = currentUserProfile.attributes[attrKey];

  const userRace = currentUserProfile.race || 'Humano';
  const raceData = window.ORT_RACES[userRace] || window.ORT_RACES['Humano'];
  const cap = (raceData.caps && (raceData.caps[attrKey] !== undefined ? raceData.caps[attrKey] : raceData.caps["*"])) || 10;
  const isFixed = raceData.fixed && raceData.fixed[attrKey] !== undefined;

  if (isFixed) return; // Cannot change fixed attributes

  if (delta === -1 && tempAttrAllocation[attrKey] > baseVal) {
    tempAttrAllocation[attrKey]--;
    tempAttrPoints++;
  } else if (delta === 1 && tempAttrPoints > 0 && tempAttrAllocation[attrKey] < cap) {
    tempAttrAllocation[attrKey]++;
    tempAttrPoints--;
  }

  renderRpgAttributes();
};

window.saveAttributes = async function () {
  const db = Auth.db();
  const user = Auth.getUser();

  const oldCon = currentUserProfile.attributes.CON;
  const oldEsp = currentUserProfile.attributes.ESP;
  const newCon = tempAttrAllocation.CON;
  const newEsp = tempAttrAllocation.ESP;

  const hpGain = newCon - oldCon;
  const spGain = newEsp - oldEsp;

  currentUserProfile.attributes = { ...tempAttrAllocation };
  currentUserProfile.attribute_points = tempAttrPoints;
  currentUserProfile.hp_current += hpGain;
  currentUserProfile.sp_current += spGain;

  const btn = document.getElementById('btn-save-attributes');
  if (btn) btn.textContent = "[ SALVANDO... ]";

  await db.from('profiles').update({
    attributes: currentUserProfile.attributes,
    attribute_points: currentUserProfile.attribute_points,
    hp_current: currentUserProfile.hp_current,
    sp_current: currentUserProfile.sp_current
  }).eq('id', user.id);

  if (btn) btn.textContent = "[ SALVAR DNA ]";
  renderRpgVitals(currentUserProfile);
  renderRpgSkillsList(currentUserProfile);
  if (typeof Apps !== 'undefined' && Apps.showNotification) Apps.showNotification("ATRIBUTOS ATUALIZADOS", "var(--green)");
};


// ============== SKILLS LOGIC ==============
function renderRpgSkillsList(p) {
  const container = document.getElementById('rpg-skills-list');
  if (!container) return;
  container.innerHTML = '';

  const maxSkills = window.RPG.calcBaseSkillSlots(p.attributes.SAB);
  const trained = p.trained_skills || [];

  const lockedLevel = p.attributes.skills_locked_level || 0;
  const currentLevel = p.level || 1;
  const isLocked = lockedLevel >= currentLevel;

  const desc = document.getElementById('rpg-skills-desc');
  if (desc) {
    desc.textContent = `SABEDORIA ${p.attributes.SAB} + Bônus = Permite treinar até ${maxSkills} Conhecimentos.`;
    if (isLocked) desc.innerHTML += " <br><span style='color:var(--amber); font-size:10px;'>[ 🔒 ESCOLHAS TRAVADAS NESTE NÍVEL ]</span>";
  }

  window.ORT_SKILLS_CATALOG.forEach(skillName => {
    const isTrained = trained.includes(skillName);
    const div = document.createElement('div');
    div.className = 'skill-item';
    if (isLocked) div.style.cursor = 'not-allowed';

    div.innerHTML = `
      <span style="${isLocked && !isTrained ? 'opacity:0.5' : ''}">${skillName}</span>
      ${isTrained ? '<span class="check">✔</span>' : ''}
    `;

    div.onclick = async () => {
      if (isLocked) {
        if (typeof Apps !== 'undefined' && Apps.showNotification) Apps.showNotification('CONHECIMENTOS TRAVADOS (UPAR PARA MUDAR)', 'var(--amber)');
        return;
      }

      let newTrained = [...trained];
      if (isTrained) {
        newTrained = newTrained.filter(s => s !== skillName);
      } else {
        if (trained.length >= maxSkills) {
          if (typeof Apps !== 'undefined' && Apps.showNotification) Apps.showNotification('LIMITE DE TREINAMENTO ATINGIDO', 'var(--red-alert)');
          return;
        }
        newTrained.push(skillName);
      }

      currentUserProfile.trained_skills = newTrained;
      renderRpgSkillsList(currentUserProfile);
      // Removed instant DB save to allow confirming choices
    };

    container.appendChild(div);
  });

  if (!isLocked) {
    const btnBox = document.createElement('div');
    btnBox.style.marginTop = '15px';
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = '[ SALVAR CONHECIMENTOS ]';
    btn.style.width = '100%';
    btn.style.borderColor = 'var(--green)';
    btn.style.color = 'var(--green)';
    btn.onclick = async () => {
      p.attributes.skills_locked_level = currentLevel;
      const db = Auth.db();
      btn.textContent = '[ SALVANDO... ]';
      await db.from('profiles').update({
        trained_skills: p.trained_skills,
        attributes: p.attributes
      }).eq('id', Auth.getUser().id);
      renderRpgSkillsList(p);
      if (typeof Apps !== 'undefined' && Apps.showNotification) Apps.showNotification('CONHECIMENTOS SALVOS E TRAVADOS!', 'var(--green)');
    };
    btnBox.appendChild(btn);
    container.appendChild(btnBox);
  }
}


// ============== ABILITY CATALOG ==============

function renderRpgAbilityCatalog(p) {
  const ptsEl = document.getElementById('rpg-ab-pts');
  if (!ptsEl) return;
  ptsEl.textContent = p.ability_points;

  const t1 = document.getElementById('catalog-tier-1'); if (t1) t1.innerHTML = '';
  const t2 = document.getElementById('catalog-tier-2'); if (t2) t2.innerHTML = '';
  const t3 = document.getElementById('catalog-tier-3'); if (t3) t3.innerHTML = '';

  window.ORT_ABILITIES_CATALOG.forEach(ab => {
    const isUnlocked = (p.unlocked_abilities || []).includes(ab.id);
    let html = `
      <div class="catalog-item ${isUnlocked ? 'unlocked' : ''}">
        <div>
          <div class="cat-title">${ab.name}</div>
          <div class="cat-type">[ ${ab.type} ]</div>
          <div class="cat-desc">${ab.desc}</div>
    `;
    if (ab.req) {
      let reqNames = [];
      let reqs = Array.isArray(ab.req) ? ab.req : [ab.req];
      reqs.forEach(r => {
        if (typeof r === 'string' && r.includes(':')) {
          const parts = r.split(':');
          reqNames.push(`${parts[0]} ${parts[1]}`);
        } else {
          const reqAb = window.ORT_ABILITIES_CATALOG.find(a => a.id === r);
          if (reqAb) reqNames.push(reqAb.name);
          else reqNames.push(r);
        }
      });
      html += `<div style="font-size:13px; color:var(--amber); margin-bottom:10px;">Req: ${reqNames.join(' + ')}</div>`;
    }

    html += `</div><div class="cat-action">`;
    if (isUnlocked) {
      html += `<button class="btn-owned">[ ATIVA ]</button>`;
    } else {
      html += `<button class="btn-buy" onclick="buyAbility('${ab.id}')">[ DESBLOQUEAR ]</button>`;
    }
    html += `</div></div>`;

    if (ab.tier === 1 && t1) t1.innerHTML += html;
    else if (ab.tier === 2 && t2) t2.innerHTML += html;
    else if (t3) t3.innerHTML += html;
  });
}

window.buyAbility = async function (abId) {
  const p = currentUserProfile;
  if (!p) return;

  if (p.ability_points <= 0) {
    if (typeof Apps !== 'undefined' && Apps.showNotification) Apps.showNotification('PONTOS DE HABILIDADE INSUFICIENTES', 'var(--red-alert)');
    return;
  }

  const abilityData = window.ORT_ABILITIES_CATALOG.find(a => a.id === abId);
  if (abilityData && abilityData.req) {
    let reqs = Array.isArray(abilityData.req) ? abilityData.req : [abilityData.req];
    for (let r of reqs) {
      if (typeof r === 'string' && r.includes(':')) {
        const parts = r.split(':');
        const attrKey = parts[0];
        const attrVal = parseInt(parts[1]);
        const pAttrs = p.attributes || {};
        if (!pAttrs[attrKey] || pAttrs[attrKey] < attrVal) {
          if (typeof Apps !== 'undefined' && Apps.showNotification) Apps.showNotification(`REQUISITO MÍNIMO: ${attrKey} ${attrVal}`, 'var(--amber)');
          return;
        }
      } else {
        if (!(p.unlocked_abilities || []).includes(r)) {
          const reqAb = window.ORT_ABILITIES_CATALOG.find(a => a.id === r);
          const rName = reqAb ? reqAb.name : r;
          if (typeof Apps !== 'undefined' && Apps.showNotification) Apps.showNotification(`REQUISITO FALTANTE: Habilidade '${rName}'`, 'var(--amber)');
          return;
        }
      }
    }
  }

  p.unlocked_abilities.push(abId);
  p.ability_points--;
  renderRpgAbilityCatalog(p);

  const db = Auth.db();
  const user = Auth.getUser();
  await db.from('profiles').update({
    unlocked_abilities: p.unlocked_abilities,
    ability_points: p.ability_points
  }).eq('id', user.id);

  if (typeof Apps !== 'undefined' && Apps.showNotification) Apps.showNotification('ESTADO DO AGENTE', `HABILIDADE ${abilityData.name} DESBLOQUEADA`, 'success');
}

/* =========================================================================
   RITUALS & TAROT LOGIC
   ========================================================================= */

window.renderRitualsTab = async function (p) {
  if (!p) return;

  // If no affinity chosen, show selection
  if (!p.ritual_affinity) {
    document.getElementById('ritual-affinity-selection').classList.remove('hidden');
    document.getElementById('ritual-main-ui').classList.add('hidden');
    return;
  }

  // Initialize selection if empty
  if (!p.ritual_selection || p.ritual_selection.length === 0) {
    p.ritual_selection = RPG.rollLoadout(p.ritual_affinity, p.ritual_level || 1);
    p.ritual_refresh_count = 0;
    p.ritual_lock_index = -1;
    p.ritual_lock_used = false;
    p.equipped_rituals = [null, null, null];

    const db = Auth.db();
    await db.from('profiles').update({
      ritual_selection: p.ritual_selection,
      ritual_refresh_count: 0,
      ritual_lock_index: -1,
      ritual_lock_used: false,
      equipped_rituals: p.equipped_rituals
    }).eq('id', p.id);
  }

  // Ensure equipped_rituals is always a 3-slot array
  if (!p.equipped_rituals || !Array.isArray(p.equipped_rituals) || p.equipped_rituals.length < 3) {
    const current = Array.isArray(p.equipped_rituals) ? p.equipped_rituals : [];
    p.equipped_rituals = [
      current[0] || null,
      current[1] || null,
      current[2] || null
    ];
  }

  document.getElementById('ritual-affinity-selection').classList.add('hidden');
  document.getElementById('ritual-main-ui').classList.remove('hidden');

  const affDisplay = document.getElementById('current-affinity-display');
  if (affDisplay) {
    affDisplay.textContent = p.ritual_affinity.toUpperCase();
    let affColor = 'var(--green-mid)';
    if (p.ritual_affinity === 'Sangue') affColor = '#ff2200';
    if (p.ritual_affinity === 'Conhecimento') affColor = '#ffb000';
    if (p.ritual_affinity === 'Energia') affColor = '#a000ff';
    if (p.ritual_affinity === 'Morte') affColor = '#333333';
    affDisplay.style.color = affColor;
    affDisplay.style.textShadow = `0 0 10px ${affColor}`;
  }

  const levels = ["NÃO INICIADO", "INICIANTE", "EXPERIENTE", "MESTRE"];
  document.getElementById('ritual-level-display').textContent = levels[p.ritual_level || 1] || levels[1];

  // Refresh display
  const refreshBtn = document.getElementById('btn-refresh-loadout');
  const refreshDisplay = document.getElementById('refresh-count-display');
  if (refreshDisplay) refreshDisplay.textContent = 3 - (p.ritual_refresh_count || 0);

  if (refreshBtn) {
    if ((p.ritual_refresh_count || 0) >= 3) {
      refreshBtn.disabled = true;
      refreshBtn.style.opacity = "0.5";
      refreshBtn.textContent = "[ LIMITE ATINGIDO ]";
    } else {
      refreshBtn.disabled = false;
      refreshBtn.style.opacity = "1";
      refreshBtn.textContent = "[ 🗘 RESORT ]";
    }
  }

  // Handle Loadout Lock Button Visibility
  const lockLoadoutBtn = document.getElementById('btn-lock-loadout');
  if (lockLoadoutBtn) {
    const isEquipped = p.equipped_rituals && p.equipped_rituals.filter(r => r !== null).length === 3;
    const isTarotRolled = !!(p.active_tarot && p.active_tarot.name);
    const isAlreadyLocked = p.is_loadout_locked;

    if (isEquipped && isTarotRolled && !isAlreadyLocked) {
      lockLoadoutBtn.classList.remove('hidden');
    } else {
      lockLoadoutBtn.classList.add('hidden');
    }

    if (isAlreadyLocked) {
      if (refreshBtn) {
        refreshBtn.disabled = true;
        refreshBtn.style.opacity = "0.5";
        refreshBtn.textContent = "[ LOADOUT TRANCADO ]";
      }
      const banner = document.getElementById('lock-status-banner');
      const actionBtns = document.getElementById('loadout-action-buttons');
      if (banner) banner.style.display = 'block';
      if (actionBtns) actionBtns.style.display = 'none';

      const upgradeBtn = document.getElementById('btn-upgrade-ritual');
      if (upgradeBtn) {
        upgradeBtn.disabled = true;
        upgradeBtn.style.opacity = "0.5";
      }
    }
  }

  renderEquippedRituals(p);
  renderRitualSelectionList(p);
}

window.setRitualAffinity = async function (affinity) {
  const p = currentUserProfile;
  if (!p) return;

  // CRITICAL: Affinity is immutable once chosen
  if (p.ritual_affinity) {
    if (typeof Apps !== 'undefined' && Apps.showNotification)
      Apps.showNotification('AFINIDADE', 'Afinidade já estabelecida e imutável.', 'warning');
    return;
  }

  // Roll initial selection
  const initialSelection = RPG.rollLoadout(affinity, 1);

  p.ritual_affinity = affinity;
  p.ritual_level = 1;
  p.equipped_rituals = [];
  p.ritual_selection = initialSelection;
  p.ritual_refresh_count = 0;
  p.ritual_lock_index = -1;
  p.ritual_lock_used = false;

  renderRitualsTab(p);

  const db = Auth.db();
  const user = Auth.getUser();
  await db.from('profiles').update({
    ritual_affinity: affinity,
    ritual_level: 1,
    equipped_rituals: [],
    ritual_selection: initialSelection,
    ritual_refresh_count: 0,
    ritual_lock_index: -1,
    ritual_lock_used: false
  }).eq('id', user.id);

  if (typeof Apps !== 'undefined' && Apps.showNotification) Apps.showNotification(`AFINIDADE COM ${affinity.toUpperCase()} ESTABELECIDA`, 'var(--green)');
}

window.lockLoadout = async function () {
  const p = currentUserProfile;
  if (!p) return;

  const isEquipped = p.equipped_rituals && p.equipped_rituals.filter(r => r !== null).length === 3;
  const isTarotRolled = !!(p.active_tarot && p.active_tarot.name);

  if (!isEquipped || !isTarotRolled) {
    if (typeof Apps !== 'undefined' && Apps.showNotification)
      Apps.showNotification('SISTEMA', 'EQUIPE TODOS OS RITUAIS E GIRE O TAROT ANTES DE TRANCAR.', 'warning');
    return;
  }

  if (typeof Apps !== 'undefined' && Apps.showModal) {
    Apps.showModal({
      title: 'TRANCAR LOADOUT',
      body: 'AO TRANCAR O LOADOUT, VOCÊ NÃO PODERÁ MAIS ALTERAR SEUS RITUAIS OU TAROT ATÉ QUE O MESTRE DESTRANQUE PARA A PRÓXIMA MISSÃO. CONFIRMAR?',
      type: 'confirm',
      onConfirm: async () => {
        try {
          const db = Auth.db();
          const { error } = await db.from('profiles').update({ is_loadout_locked: true }).eq('id', p.id);

          if (error) throw error;

          p.is_loadout_locked = true;
          renderRitualsTab(p);

          if (typeof Apps !== 'undefined' && Apps.showNotification)
            Apps.showNotification('LOADOUT TRANCADO', 'SEU ARSENAL ESTÁ SINCRONIZADO E PRONTO PARA A MISSÃO.', 'success');
        } catch (err) {
          console.error("Erro ao trancar loadout:", err);
          if (typeof Apps !== 'undefined' && Apps.showNotification)
            Apps.showNotification('ERRO NO SISTEMA', 'Falha ao comunicar com o servidor. Tente novamente.', 'error');
        }
      }
    });
  } else {
    // Fallback if Apps.showModal is not available (shouldn't happen)
    if (typeof Apps !== 'undefined' && Apps.showNotification)
      Apps.showNotification('SISTEMA', 'Confirmar tranca de loadout? (Erro de Modal)', 'warning');
  }
}

window.renderEquippedRituals = function (p) {
  const equippedIds = p.equipped_rituals || [];
  const selection = p.ritual_selection || [];

  for (let i = 0; i < 3; i++) {
    const slotEl = document.getElementById(`ritual-slot-${i}`);
    const lockBtn = document.getElementById(`btn-lock-${i}`);
    const lockIcon = document.getElementById(`lock-icon-${i}`);
    const ritualId = equippedIds[i];

    // Handle Slot content
    if (ritualId) {
      const rit = selection.find(r => r.id === ritualId);
      if (rit) {
        slotEl.classList.remove('empty');
        if (p.is_loadout_locked) slotEl.classList.add('locked');
        else slotEl.classList.remove('locked');

        slotEl.innerHTML = `
          <div class="slot-label">SLOT ${i + 1}</div>
          <div class="slot-content" style="color:var(--green); font-weight:bold; font-size:14px; line-height:1.2;">${rit.name}</div>
          <div style="font-size:11px; color:var(--blue); margin-top:4px; font-weight:bold;">${rit.cost}</div>
          <div style="font-size:10px; color:rgba(0,255,65,0.85); margin-top:6px; font-style:italic; line-height:1.2;">${rit.desc}</div>
          ${p.is_loadout_locked ? '<div style="font-size:8px; color:var(--red); margin-top:4px; font-weight:bold;">[ TRANCADO ]</div>' : ''}
        `;
        if (p.is_loadout_locked) {
          slotEl.onclick = null;
          slotEl.style.cursor = "default";
          slotEl.style.borderColor = "var(--red-alert)";
        } else {
          slotEl.onclick = () => unequipRitual(i);
          slotEl.style.cursor = "pointer";
          slotEl.style.borderColor = "";
        }
      } else {
        resetSlot(slotEl, i);
        if (p.is_loadout_locked) slotEl.classList.add('locked');
        else slotEl.classList.remove('locked');
      }
    } else {
      resetSlot(slotEl, i);
      if (p.is_loadout_locked) slotEl.classList.add('locked');
      else slotEl.classList.remove('locked');
    }

    // Handle Lock UI
    if (lockBtn && lockIcon) {
      lockBtn.classList.remove('locked', 'used');
      lockBtn.style.opacity = "1";
      lockBtn.style.pointerEvents = "auto";
      lockBtn.style.filter = "none";

      if (p.ritual_lock_index === i) {
        lockBtn.classList.add('locked');
        lockIcon.textContent = "🔒";
        lockBtn.style.pointerEvents = "none"; // Trancado e irreversível
      } else {
        lockIcon.textContent = "🔓";
        // Se já houver um cadeado em outro slot, este escurece e fica inútil
        if (p.ritual_lock_index !== -1) {
          lockBtn.style.opacity = "0.2";
          lockBtn.style.pointerEvents = "none";
          lockBtn.style.filter = "grayscale(1)";
        }
      }

      if (p.ritual_lock_used || p.is_loadout_locked) {
        lockBtn.classList.add('used');
        lockBtn.style.opacity = "0.2";
        lockBtn.style.pointerEvents = "none";
      }
    }
  }

  // Tarot Slot logic: Only available if 3 rituals are equipped
  const tarotDisplay = document.getElementById('tarot-card-display');
  const activeTarot = p.active_tarot;
  const allRitualsEquipped = (p.equipped_rituals || []).filter(r => r !== null).length === 3;

  if (activeTarot) {
    tarotDisplay.onclick = () => viewTarotDetails();
    tarotDisplay.innerHTML = `
      <div class="tarot-card-tiny ${activeTarot.is_inverted ? 'inverted' : ''}" style="overflow:hidden; position:relative; width:100%; height:100%;">
        <img src="${activeTarot.image}" alt="${activeTarot.name}" style="width:100%; height:100%; object-fit:cover; transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); ${activeTarot.is_inverted ? 'transform: rotate(180deg);' : ''}">
        <div style="position:absolute; bottom:0; left:0; right:0; background:rgba(0,0,0,0.85); font-size:9px; color:${activeTarot.is_inverted ? 'var(--red-alert)' : 'var(--green)'}; padding:5px; font-weight:bold; letter-spacing:0.5px; border-top:1px solid var(--border-dim);">
          ${activeTarot.name}
        </div>
      </div>
    `;
    tarotDisplay.style.opacity = "1";
    tarotDisplay.style.pointerEvents = "auto";
  } else if (allRitualsEquipped) {
    tarotDisplay.onclick = () => rollTarot();
    tarotDisplay.innerHTML = `<span>CLIQUE PARA GIRAR</span>`;
    tarotDisplay.style.opacity = "1";
    tarotDisplay.style.pointerEvents = "auto";
    tarotDisplay.style.borderColor = "var(--green)";
  } else {
    tarotDisplay.onclick = null;
    tarotDisplay.innerHTML = `<span style="font-size:8px; color:var(--red-alert);">BLOQUEADO<br>EQUIPE 3 RITUAIS</span>`;
    tarotDisplay.style.opacity = "0.5";
    tarotDisplay.style.pointerEvents = "none";
    tarotDisplay.style.borderColor = "var(--border-dim)";
  }

  function resetSlot(el, idx) {
    el.classList.add('empty');
    el.innerHTML = `<div class="slot-label">SLOT ${idx + 1}</div><div class="slot-content">VAZIO</div>`;
  }
}

window.renderRitualSelectionList = function (p) {
  const ritualList = document.getElementById('ritual-list');
  if (!ritualList) return;
  ritualList.innerHTML = '';

  const selection = p.ritual_selection || [];
  const equippedIds = p.equipped_rituals || [];

  selection.forEach(rit => {
    const isEquipped = equippedIds.includes(rit.id);
    const card = document.createElement('div');
    card.className = `ritual-item ${isEquipped ? 'equipped' : ''}`;
    card.innerHTML = `
      <div class="rit-header">
        <span class="rit-name">${rit.name}</span>
        <span class="rit-cost">${rit.cost}</span>
      </div>
      <div class="rit-desc">${rit.desc}</div>
      <div class="cat-action">
        <button class="btn" onclick="${isEquipped ? `unequipRitualById('${rit.id}')` : `equipRitual('${rit.id}')`}" ${p.is_loadout_locked ? 'disabled' : ''}>
          [ ${isEquipped ? 'DESEQUIPAR' : 'EQUIPAR'} ]
        </button>
      </div>
    `;
    ritualList.appendChild(card);
  });
}

window.handleToggleLock = async function (idx) {
  const p = currentUserProfile;
  if (!p || p.ritual_lock_used) return;

  if (p.is_loadout_locked) {
    if (typeof Apps !== 'undefined' && Apps.showNotification)
      Apps.showNotification('LOADOUT TRANCADO', 'Não é possível alterar cadeados agora.', 'warning');
    return;
  }

  // Se já houver um cadeado em QUALQUER slot, não permite trocar ou abrir
  if (p.ritual_lock_index !== -1) {
    if (typeof showNotification === 'function')
      showNotification('CADEADO JÁ ESTABELECIDO EM OUTRO SLOT', 'var(--amber)');
    return;
  }

  // Trava o slot permanentemente
  p.ritual_lock_index = idx;

  renderEquippedRituals(p);
  Boot.playBeep(880, 0.05, 0.1);

  // Salva no banco imediatamente para garantir persistência
  const db = Auth.db();
  await db.from('profiles').update({ ritual_lock_index: idx }).eq('id', p.id);

  if (typeof showNotification === 'function')
    showNotification('SLOT TRANACADO E SINCRONIZADO', 'Este ritual permanecerá no próximo Resort.', 'var(--green)');
}

window.handleRefreshLoadout = async function () {
  const p = currentUserProfile;
  if (!p) return;

  if (p.is_loadout_locked) {
    if (typeof Apps !== 'undefined' && Apps.showNotification)
      Apps.showNotification('LOADOUT TRANCADO', 'O destino está selado para esta missão.', 'warning');
    return;
  }

  if ((p.ritual_refresh_count || 0) >= 3) {
    showNotification('LIMITE DE RESORT ATINGIDO', 'Você só pode resortear rituais 3 vezes por missão.', 'var(--amber)');
    return;
  }

  // Determine current ritual level from profile
  const ritualLevel = p.ritual_level || 1;

  // Call core logic
  const newSelection = RPG.refreshLoadout(p.ritual_selection, p.ritual_lock_index, p.ritual_affinity, ritualLevel);

  p.ritual_selection = newSelection;
  p.ritual_refresh_count = (p.ritual_refresh_count || 0) + 1;

  // If a lock was active and used, consume it
  if (p.ritual_lock_index !== -1) {
    p.ritual_lock_used = true;
  }

  // Unequip non-locked rituals to avoid inconsistencies, keeping slots fixed
  const equipped = p.equipped_rituals || [null, null, null];
  p.equipped_rituals = equipped.map((id, idx) => (idx === p.ritual_lock_index ? id : null));

  renderRitualsTab(p);

  const db = Auth.db();
  await db.from('profiles').update({
    ritual_selection: p.ritual_selection,
    ritual_refresh_count: p.ritual_refresh_count,
    ritual_lock_used: p.ritual_lock_used,
    equipped_rituals: p.equipped_rituals
  }).eq('id', p.id);

  if (typeof Apps !== 'undefined' && Apps.showNotification) Apps.showNotification('MATRIX RE-SINCRONIZADA', 'Novos rituais disponíveis no loadout.', 'success');
  Boot.playBeep(220, 0.2, 0.5);
}

window.renderRitualCatalog = function (p) {
  const ritualList = document.getElementById('ritual-list');
  if (!ritualList) return;
  ritualList.innerHTML = '';

  const ritualData = window.ORT_RITUALS[p.ritual_affinity];
  if (!ritualData) return;

  const playerRitualLvl = p.ritual_level || 1;
  const equippedIds = p.equipped_rituals || [];

  // Flatten and filter by level
  for (let lvl = 1; lvl <= playerRitualLvl; lvl++) {
    const rituals = ritualData[lvl] || [];
    rituals.forEach(rit => {
      const isEquipped = equippedIds.includes(rit.id);
      const card = document.createElement('div');
      card.className = `ritual-item ${isEquipped ? 'equipped' : ''}`;
      card.innerHTML = `
        <div class="rit-header">
          <span class="rit-name">${rit.name}</span>
          <span class="rit-cost">${rit.cost} SP / NIVEL ${lvl}</span>
        </div>
        <div class="rit-desc">${rit.desc}</div>
        <div class="cat-action">
          <button class="btn" onclick="${isEquipped ? `unequipRitualById('${rit.id}')` : `equipRitual('${rit.id}')`}" ${p.is_loadout_locked ? 'disabled' : ''}>
            [ ${isEquipped ? 'DESEQUIPAR' : 'EQUIPAR'} ]
          </button>
        </div>
      `;
      ritualList.appendChild(card);
    });
  }
}

window.equipRitual = async function (ritId) {
  const p = currentUserProfile;
  if (!p) return;

  if (p.is_loadout_locked) {
    if (typeof Apps !== 'undefined' && Apps.showNotification)
      Apps.showNotification('LOADOUT TRANCADO', 'Não é possível equipar novos rituais.', 'warning');
    return;
  }

  // Ensure it's a 3-slot array
  if (!p.equipped_rituals || !Array.isArray(p.equipped_rituals)) {
    p.equipped_rituals = [null, null, null];
  } else while (p.equipped_rituals.length < 3) p.equipped_rituals.push(null);

  if (p.equipped_rituals.includes(ritId)) {
    if (typeof Apps !== 'undefined' && Apps.showNotification) Apps.showNotification('RITUAL JÁ EQUIPADO', 'var(--amber)');
    return;
  }

  // Find first empty slot
  const emptyIdx = p.equipped_rituals.indexOf(null);
  if (emptyIdx === -1) {
    if (typeof Apps !== 'undefined' && Apps.showNotification) Apps.showNotification('SLOTS DE RITUAIS CHEIOS (MÁX 3)', 'var(--amber)');
    return;
  }

  p.equipped_rituals[emptyIdx] = ritId;
  renderEquippedRituals(p);
  renderRitualSelectionList(p);

  const db = Auth.db();
  const user = Auth.getUser();
  await db.from('profiles').update({ equipped_rituals: p.equipped_rituals }).eq('id', user.id);
}

window.unequipRitual = async function (slotIdx) {
  const p = currentUserProfile;
  if (!p) return;

  if (p.is_loadout_locked) {
    if (typeof Apps !== 'undefined' && Apps.showNotification)
      Apps.showNotification('LOADOUT TRANCADO', 'Não é possível desequipar rituais.', 'warning');
    return;
  }

  // Block removing locked ritual
  if (p.ritual_lock_index === slotIdx) {
    if (typeof showNotification === 'function')
      showNotification('RITUAL TRANCADO NÃO PODE SER REMOVIDO', 'var(--amber)');
    return;
  }

  if (p.equipped_rituals && p.equipped_rituals[slotIdx]) {
    p.equipped_rituals[slotIdx] = null; // Set to null instead of splicing
    renderEquippedRituals(p);
    renderRitualSelectionList(p);

    const db = Auth.db();
    const user = Auth.getUser();
    await db.from('profiles').update({ equipped_rituals: p.equipped_rituals }).eq('id', user.id);
  }
}

window.unequipRitualById = function (ritId) {
  const p = currentUserProfile;
  if (!p) return;
  const idx = p.equipped_rituals.indexOf(ritId);
  if (idx !== -1) unequipRitual(idx);
}

window.rollTarot = async function () {
  const p = currentUserProfile;
  if (!p) return;

  if (p.is_loadout_locked) {
    if (typeof Apps !== 'undefined' && Apps.showNotification)
      Apps.showNotification('LOADOUT TRANCADO', 'O Tarô já foi consultado e selado.', 'warning');
    return;
  }

  if (p.active_tarot) {
    if (typeof Apps !== 'undefined' && Apps.showNotification)
      Apps.showNotification('TARÔ JÁ DEFINIDO', 'O destino desta missão já foi selado.', 'warning');
    return;
  }

  const allRitualsEquipped = (p.equipped_rituals || []).filter(r => r !== null).length === 3;
  if (!allRitualsEquipped) {
    if (typeof Apps !== 'undefined' && Apps.showNotification)
      Apps.showNotification('ACESSO NEGADO', 'Você precisa equipar 3 rituais antes de consultar o Tarô.', 'error');
    return;
  }

  // D20 Animation
  const tarotDisplay = document.getElementById('tarot-card-display');
  tarotDisplay.innerHTML = `<div class="d20-rolling">🎲</div><div style="font-size:10px; color:var(--amber); margin-top:10px;">ROLANDO D20...</div>`;
  Boot.playBeep(1200, 0.05, 0.5);

  setTimeout(async () => {
    const totalCards = window.ORT_TAROT.length;
    const cardIndex = Math.floor(Math.random() * totalCards);
    const cardData = window.ORT_TAROT[cardIndex];
    const isInverted = Math.random() < 0.5;

    p.active_tarot = {
      index: cardIndex,
      name: cardData.card + (isInverted ? " (INVERTIDA)" : ""),
      image: cardData.image,
      desc: isInverted ? cardData.desc_inv || "Versão sombria da carta." : cardData.desc,
      roll: cardIndex + 1,
      effect: cardData.effect,
      is_inverted: isInverted
    };

    renderEquippedRituals(p);

    if (typeof Apps !== 'undefined' && Apps.showNotification) {
      const type = isInverted ? 'error' : (cardData.effect === 'buff' ? 'success' : 'error');
      const title = isInverted ? 'NOVO DESTINO REVELADO (INVERTIDO)' : 'NOVO DESTINO REVELADO';

      Apps.showNotification(title, `CARTA: ${p.active_tarot.name}`, type, cardData.image);
      setTimeout(() => {
        Apps.showNotification('EFEITO DO TARÔ', p.active_tarot.desc, 'info', cardData.image);
      }, 2000);
    }

    const db = Auth.db();
    const user = Auth.getUser();
    await db.from('profiles').update({ active_tarot: p.active_tarot }).eq('id', user.id);

    Boot.playBeep(880, 0.1, 0.2);
    setTimeout(() => Boot.playBeep(1100, 0.1, 0.3), 150);
  }, 2500);
}

window.viewTarotDetails = function () {
  const p = currentUserProfile;
  if (!p || !p.active_tarot) return;

  const card = p.active_tarot;
  const isInverted = card.is_inverted;
  const effectColor = isInverted ? 'var(--red-alert)' : (card.effect === 'buff' ? 'var(--green)' : 'var(--red-alert)');
  const effectType = isInverted ? 'DESTINO INVERTIDO / SOMBRA' : (card.effect === 'buff' ? 'VANTAGEM / BÔNUS' : 'DESVANTAGEM / PENALIDADE');

  const info = `
        <div style="text-align:center;">
            <div style="width:120px; height:180px; margin: 0 auto 15px; border:1px solid ${effectColor}; overflow:hidden; position:relative;">
                <img src="${card.image}" style="width:100%; height:100%; object-fit:cover; ${isInverted ? 'transform: rotate(180deg);' : ''}">
            </div>
            <div style="color:${effectColor}; font-weight:bold; font-size:18px; margin-bottom:5px; text-transform:uppercase;">${card.name}</div>
            <div style="color:var(--blue); font-size:11px; margin-bottom:15px; border-bottom:1px solid var(--border-dim); padding-bottom:5px; letter-spacing:1px;">
                TIPO: ${effectType} ${isInverted ? '(INVERSÃO)' : `(D22: ${card.roll})`}
            </div>
            <div style="color:var(--green-mid); font-size:14px; line-height:1.6; padding:0 20px; font-style: italic;">
                "${card.desc}"
            </div>
        </div>`;

  if (typeof Apps !== 'undefined' && Apps.showNotification) {
    Apps.showNotification(`DETALHES DO DESTINO`, info, card.effect === 'buff' ? 'success' : 'error');
  }
}

window.upgradeRitualLevel = async function () {
  const p = currentUserProfile;
  if (!p) return;

  if (p.is_loadout_locked) {
    if (typeof Apps !== 'undefined' && Apps.showNotification)
      Apps.showNotification('LOADOUT TRANCADO', 'Não é possível evoluir enquanto o loadout está selado.', 'warning');
    return;
  }

  const nextLevel = (p.ritual_level || 1) + 1;
  if (nextLevel > 3) {
    if (typeof Apps !== 'undefined' && Apps.showNotification) Apps.showNotification('LIMITE ALCANÇADO', 'NÍVEL MÁXIMO DE RITMO ALCANÇADO', 'warning');
    return;
  }

  // Check character level requirements
  const reqLevel = nextLevel === 2 ? 10 : 16;
  if (p.level < reqLevel) {
    if (typeof Apps !== 'undefined' && Apps.showNotification) Apps.showNotification(`EXIGE NÍVEL DE PERSONAGEM ${reqLevel} `, 'var(--amber)');
    return;
  }

  // Check attribute points (must have 2)
  if (p.attribute_points < 2) {
    if (typeof Apps !== 'undefined' && Apps.showNotification) Apps.showNotification('PONTOS DE ATRIBUTO INSUFICIENTES (PRECISA DE 2)', 'var(--red-alert)');
    return;
  }

  p.ritual_level = nextLevel;
  p.attribute_points -= 2;

  renderRitualsTab(p);
  renderRpgAttributes(); // Refresh attr panel

  const db = Auth.db();
  const user = Auth.getUser();
  await db.from('profiles').update({
    ritual_level: p.ritual_level,
    attribute_points: p.attribute_points
  }).eq('id', user.id);

  if (typeof Apps !== 'undefined' && Apps.showNotification) Apps.showNotification('RITMO ELEVADO COM SUCESSO', 'var(--green)');
}
