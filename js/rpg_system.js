// ══════════════════════════════════════════════════════════
// ORT - CORE RPG SYSTEM (XP, Attributes, Abilities, Races)
// ══════════════════════════════════════════════════════════

window.ORT_RACES = {
    'Humano': {
        bonuses: { INT: 2, ESP: 2 },
        caps: { "*": 10 }
    },
    'Ciborgue': {
        bonuses: { FOR: 3, DES: 2, SAB: -1 },
        caps: { FOR: 13, DES: 13, "*": 10 }
    },
    'Androide': {
        bonuses: { INT: 3, FOR: 2 },
        fixed: { ESP: 0 },
        caps: { INT: 14, SAB: 14, "*": 10 }
    },
    'Autômato': {
        bonuses: { FOR: 3, CON: 2, DES: -1 },
        caps: { CON: 11, "*": 10 }
    },
    'Vaxiriano': {
        bonuses: { CON: 3, ESP: 1 },
        caps: { CON: 12, "*": 10 }
    },
    'Humanoc': {
        bonuses: { INT: 2, SAB: 2 },
        caps: { "*": 13 }
    },
    'Nenans': {
        bonuses: { CON: 3, FOR: 2, INT: -1 },
        caps: { FOR: 13, CON: 13, "*": 10 }
    },
    'Sparalis': {
        bonuses: { ESP: 4 },
        caps: { CON: 8, ESP: 15, "*": 10 }
    },
    'Tanots': {
        bonuses: { ESP: 2, SAB: 2 },
        caps: { ESP: 12, "*": 10 }
    }
};

window.ORT_RITUALS = {
    "Sangue": {
        1: [
            { id: "s1_01", name: "Lâmina Hemocinética", desc: "+3 de dano no próximo ataque com a arma.", cost: "2 HP + 2 ESP" },
            { id: "s1_02", name: "Projétil de Hemossita", desc: "Causa 8 de dano de perfuração. Alcance: 15m.", cost: "2 HP + 2 ESP" },
            { id: "s1_03", name: "Marca do Drenar Vital", desc: "Causa 2 de dano no início do turno do alvo. Duração: 3 turnos.", cost: "2 HP + 2 ESP" },
            { id: "s1_04", name: "Estímulo Adrenal Sanguíneo", desc: "+2 em testes de Força e Vigor por 2 turnos.", cost: "2 HP + 2 ESP" },
            { id: "s1_05", name: "Olhar Amedrontador", desc: "Alvo faz teste de Vontade ou não pode se aproximar por 1 turno.", cost: "2 HP + 2 ESP" },
            { id: "s1_06", name: "Hemotoxina Ácida", desc: "3 dano imediato + 2 dano no próximo turno. Alcance: 5m.", cost: "2 HP + 2 ESP" },
            { id: "s1_07", name: "Carapaça de Hemo-Quitina", desc: "Escudo que anula um ataque (até 15 de dano).", cost: "2 HP + 2 ESP" },
            { id: "s1_08", name: "Névoa de Angústia", desc: "Área (3x3m) dá penalidade em Percepção e Vontade.", cost: "2 HP + 2 ESP" },
            { id: "s1_09", name: "Reação de Espinhos Hemáticos", desc: "Ao ser atingido (Melee), causa 5 de dano ao atacante.", cost: "2 HP + 2 ESP" },
            { id: "s1_10", name: "Hemo-autômato", desc: "Cria pequena criatura de sangue que executa ordem simples.", cost: "2 HP + 2 ESP" }
        ],
        2: [
            { id: "s2_01", name: "Sifão de Vitalidade", desc: "Causa 15 de dano ESP e cura 10 HP do usuário.", cost: "5 HP + 5 ESP" },
            { id: "s2_02", name: "Exoesqueleto de Coágulo", desc: "Concede +4 de Armadura por 3 turnos.", cost: "5 HP + 5 ESP" },
            { id: "s2_03", name: "Controle Hemocinético", desc: "Força alvo a realizar movimento ou ataque simples (Teste Vontade).", cost: "5 HP + 5 ESP" },
            { id: "s2_04", name: "Forjar Arma de Hemo-Aço", desc: "Cria arma corpo-a-corpo que causa +5 de dano.", cost: "5 HP + 5 ESP" },
            { id: "s2_05", name: "Precipitação Hemorrágica", desc: "12 de dano ácido em área (4x4m). Alcance: 20m.", cost: "5 HP + 5 ESP" },
            { id: "s2_06", name: "Absorção Hemática", desc: "Restaura 30 Pontos de Vida (Requer sangue fresco).", cost: "Consumir Sangue" },
            { id: "s2_07", name: "Simulacro de Coágulo", desc: "Cria duplicata (1 HP) para enganar inimigos.", cost: "5 HP + 5 ESP" },
            { id: "s2_08", name: "Maldição da Auto-Fobia", desc: "Alvo recebe penalidade em atributos físicos por 3 turnos.", cost: "5 HP + 5 ESP" },
            { id: "s2_09", name: "Mimetismo de Predador", desc: "Dano letal desarmado + Bônus em Percepção.", cost: "5 HP + 5 ESP" }
        ],
        3: [
            { id: "s3_01", name: "Filactério Hemático", desc: "Ao morrer, regenera no filactério.", cost: "50 HP Máximo" },
            { id: "s3_02", name: "Detonação Vital", desc: "Causa 100 de dano a um alvo (Requer sangue do alvo).", cost: "30 HP" },
            { id: "s3_03", name: "Invocar Aspecto", desc: "Invoca entidade massiva por 3 turnos.", cost: "30 ESP/Turno" },
            { id: "s3_04", name: "Entropia Vital", desc: "Causa 20 de dano a todos (inclusive aliados) em 15m por 3 turnos.", cost: "40 HP" },
            { id: "s3_05", name: "Apoteose Sanguínea", desc: "Transforma-se em avatar monstrosos com bônus físicos massivos.", cost: "25 HP" },
            { id: "s3_06", name: "Cisão Anímica", desc: "Causa 50 de dano direto ao Espírito. Alcance: Melee.", cost: "20 HP" }
        ]
    },
    "Conhecimento": {
        1: [
            { id: "c1_01", name: "Varredura Psiónica", desc: "Detecta auras ritualísticas em 20m por 3 turnos.", cost: "3 ESP" },
            { id: "c1_02", name: "Barreira de Densidade", desc: "Cria barreira (15 HP) em até 5m.", cost: "3 ESP" },
            { id: "c1_03", name: "Aceleração de Massa", desc: "Causa 6 de dano de impacto. Alcance: 15m.", cost: "3 ESP" },
            { id: "c1_04", name: "Bio-aceleração Celular", desc: "Cura 8 Pontos de Vida. Alcance: Toque.", cost: "3 ESP" },
            { id: "c1_05", name: "Ancoragem Gravitacional", desc: "Alvo imobilizado por 2 turnos (Teste FOR).", cost: "3 ESP" },
            { id: "c1_06", name: "Endurecimento Dérmico", desc: "Concede +2 de Armadura por 3 turnos.", cost: "3 ESP" },
            { id: "c1_07", name: "Luz da Verdade", desc: "Ilumina 10m e revela assinaturas anômalas.", cost: "3 ESP" },
            { id: "c1_08", name: "Vetor de Força Cinética", desc: "Empurra alvo 2m para trás. Alcance: 10m.", cost: "3 ESP" },
            { id: "c1_09", name: "Redução de Atrito", desc: "Área de 3x3m se torna terreno difícil.", cost: "3 ESP" },
            { id: "c1_10", name: "Plataforma de Força", desc: "Permite realizar um 'pulo duplo' como Reação.", cost: "3 ESP" }
        ],
        2: [
            { id: "c2_01", name: "Interface Psiónica", desc: "Interage com tecnologia simples à distância.", cost: "7 ESP" },
            { id: "c2_02", name: "Erupção Geológica", desc: "15 dano de perfuração em área (3x3m).", cost: "7 ESP" },
            { id: "c2_03", name: "Escudo de Deflexão", desc: "Absorve 30 de dano por 3 turnos.", cost: "7 ESP" },
            { id: "c2_04", name: "Sutura Biocinética", desc: "Restaura 25 Pontos de Vida. Alcance: Toque.", cost: "7 ESP" },
            { id: "c2_05", name: "Distorção Luminosa", desc: "Fica invisível. Quebra se atacar.", cost: "7 ESP" },
            { id: "c2_06", name: "Descarga Iônica", desc: "Causa 20 de dano elétrico. Alcance: 20m.", cost: "7 ESP" },
            { id: "c2_07", name: "Varredura Multiespectral", desc: "Visão térmica, de energia ou através de paredes.", cost: "7 ESP" },
            { id: "c2_08", name: "Foco Sensorial", desc: "Bônus em Percepção/Pontaria para um aliado.", cost: "7 ESP" },
            { id: "c2_09", name: "Firewall Psiónico", desc: "Resistência contra efeitos mentais. Reação.", cost: "7 ESP" }
        ],
        3: [
            { id: "c3_01", name: "Poço Gravitacional", desc: "50 dano esmagamento e puxa alvos em área (5x5m).", cost: "50 ESP" },
            { id: "c3_02", name: "Isolamento de Bolso", desc: "Imune a todo dano e efeitos por 1 turno. Reação.", cost: "45 ESP" },
            { id: "c3_03", name: "Cascata Axiomática", desc: "40 dano ESP e Atordoa o alvo por 1 turno.", cost: "48 ESP" },
            { id: "c3_04", name: "Controle de Voo", desc: "Concede habilidade de voo (Manutenção: Ação Movimento).", cost: "35 ESP" },
            { id: "c3_05", name: "Sincronia Transdimensional", desc: "Causa 35 de dano que ignora armadura.", cost: "42 ESP" },
            { id: "c3_06", name: "Constructo Autômato", desc: "Cria um golem que obedece ordens por 5 turnos.", cost: "65 ESP" }
        ]
    },
    "Energia": {
        1: [
            { id: "e1_01", name: "Rajada Entrópica", desc: "Causa 10 de dano de energia. Alcance: 20m.", cost: "2 ESP + 1 Cor." },
            { id: "e1_02", name: "Escudo de Contenção", desc: "Escudo que absorve 15 de dano por 1 turno.", cost: "2 ESP + 1 Cor." },
            { id: "e1_03", name: "Surto Adrenal", desc: "Concede 1 Ação de Movimento extra imediatamente.", cost: "7 ESP + 2 Cor." },
            { id: "e1_04", name: "Pulso de Estática", desc: "Dano 5 energia a todos em 3m (inclusive aliados).", cost: "10 ESP + 2 Cor." },
            { id: "e1_05", name: "Lâmina de Plasma", desc: "+4 dano de energia nos ataques com arma.", cost: "8 ESP + 1 Cor./Turno" },
            { id: "e1_06", name: "Distorção de Fase", desc: "Teleporta o usuário por 10m. Ação Movimento.", cost: "9 ESP + 2 Cor." },
            { id: "e1_07", name: "Singularidade Zumbidora", desc: "Causa 4 dano ao inimigo mais próximo por 3 turnos.", cost: "12 ESP + 2 Cor." },
            { id: "e1_08", name: "Arco Voltaico", desc: "8 dano alvo primário, 4 alvo secundário. Alcance 15m.", cost: "11 ESP + 2 Cor." },
            { id: "e1_09", name: "Imbuir Carga Cinética", desc: "Objeto arremessado explode (12 dano em área).", cost: "10 ESP + 2 Cor." },
            { id: "e1_10", name: "Aterramento Corporal", desc: "Resistência a dano de energia por 1 turno. Reação.", cost: "2 ESP + 1 Cor." }
        ],
        2: [
            { id: "e2_01", name: "Canhão Canalizado", desc: "Causa 25 de dano em linha (Manutenção necessária).", cost: "20 ESP + 3 Cor." },
            { id: "e2_02", name: "Detonação Plásmica", desc: "Causa 30 de dano de energia em área (5x5m).", cost: "28 ESP + 4 Cor." },
            { id: "e2_03", name: "Propulsão por Fissão", desc: "Concede voo por 1 turno (Manutenção Ação Movimento).", cost: "18 ESP + 2 Cor./Turno" },
            { id: "e2_04", name: "Ruptura Espiritual", desc: "Força alvo a testar Vontade para usar rituais.", cost: "30 ESP + 5 Cor." },
            { id: "e2_05", name: "Tempestade Entrópica", desc: "10 dano em quem terminar o turno na área (raio 4m).", cost: "5 ESP + 3 Cor." },
            { id: "e2_06", name: "Estado de Saturação", desc: "Rituais de Energia causam +5 dano, +1 Corrupção gerada.", cost: "5 ESP + 3 Cor." },
            { id: "e2_07", name: "Implosão Cinética", desc: "Inimigos em área (5m) são puxados para o centro.", cost: "5 ESP + 3 Cor." },
            { id: "e2_08", name: "Matriz de Força Sólida", desc: "Cria objeto de energia sólida (100 HP).", cost: "5 ESP + 3 Cor." }
        ],
        3: [
            { id: "e3_01", name: "Feixe de Aniquilação", desc: "Disparo massivo: 70 de dano de energia. Alcance: 100m.", cost: "60 ESP + 10 Cor." },
            { id: "e3_02", name: "Fissura da Dimensão", desc: "Cria zona (5x5m) que causa 25 dano/turno por 3 turnos.", cost: "55 ESP + 8 Cor." },
            { id: "e3_03", name: "Estase Temporal", desc: "Congela o tempo em área (5m) por 1 turno.", cost: "70 ESP + 12 Cor." },
            { id: "e3_04", name: "Toque da Dissolução", desc: "Causa 80 de dano que ignora armadura. Toque.", cost: "50 ESP + 8 Cor." },
            { id: "e3_05", name: "Apoteose Caótica", desc: "Transforma-se em avatar de energia por 3 turnos.", cost: "40 ESP + 10 Cor." },
            { id: "e3_06", name: "Baluarte de Contenção", desc: "Esfera impenetrável (raio 3m) por 2 turnos.", cost: "60 ESP + 10 Cor." }
        ]
    }
};

window.ORT_TAROT = [
    { card: "0 - O Louco", effect: "buff", image: "https://www.sacred-texts.com/tarot/pkt/img/ar00.jpg", desc: "Ignorância abençoada. Imunidade a Dano de Espírito, mas zera a sua Defesa.", desc_inv: "Loucura Absoluta. Você ganha +10 em Ocultismo, mas sua Sanidade máxima cai para 1." },
    { card: "I - O Mago", effect: "buff", image: "https://www.sacred-texts.com/tarot/pkt/img/ar01.jpg", desc: "Conexão total. O custo de todo SP gasto cai pela metade.", desc_inv: "Charlatão. Seus rituais têm chance de falhar (D20 < 5), mas custam 0 SP." },
    { card: "II - A Sacerdotisa", effect: "buff", image: "https://www.sacred-texts.com/tarot/pkt/img/ar02.jpg", desc: "Intuição afiada. Ganha +4 em testes de Investigação.", desc_inv: "Segredos Corruptos. Você descobre fraquezas, ganhando +5 de Dano, mas perde 2 de Defesa." },
    { card: "III - A Imperatriz", effect: "buff", image: "https://www.sacred-texts.com/tarot/pkt/img/ar03.jpg", desc: "Mãe da vida. Ganha 20 HP temporários no início da missão.", desc_inv: "Infertilidade Arcana. Você não pode recuperar HP por rituais, mas ganha +2 em Fortitude." },
    { card: "IV - O Imperador", effect: "buff", image: "https://www.sacred-texts.com/tarot/pkt/img/ar04.jpg", desc: "Domínio e armadura. Seus testes de Vontade nunca falham.", desc_inv: "Tirania. Você causa +10 de dano em alvos com menos HP que você, mas sofre -5 em Diplomacia." },
    { card: "V - O Hierofante", effect: "buff", image: "https://www.sacred-texts.com/tarot/pkt/img/ar05.jpg", desc: "Saber oculto. Bônus em rituais do nível Mestre da Ordem.", desc_inv: "Dogma Quebrado. Rituais de outras afinidades custam o normal (sem penalidade de afinidade)." },
    { card: "VI - Os Enamorados", effect: "buff", image: "https://www.sacred-texts.com/tarot/pkt/img/ar06.jpg", desc: "Vínculo vital. Quando um aliado adjacente sofre dano, você cura 5 HP.", desc_inv: "Ciúme Sobrenatural. Você ganha +5 de dano se estiver sozinho em um raio de 9m." },
    { card: "VII - A Carruagem", effect: "buff", image: "https://www.sacred-texts.com/tarot/pkt/img/ar07.jpg", desc: "Implacável. Movimento Tático dobrado. Ação de Corrida livre.", desc_inv: "Derrapagem. Você se move +3m, mas sofre -5 em testes de Reflexos." },
    { card: "VIII - A Força", effect: "buff", image: "https://www.sacred-texts.com/tarot/pkt/img/ar08.jpg", desc: "Frenesi. Seu Dano Físico recebe bônus de +5 sempre.", desc_inv: "Fraqueza Dominada. Você ignora resistências físicas dos inimigos, mas seu dano base cai em 2." },
    { card: "IX - O Eremita", effect: "buff", image: "https://www.sacred-texts.com/tarot/pkt/img/ar09.jpg", desc: "Isolamento. Inimigos ignoram você se houver aliados mais perto.", desc_inv: "Exílio Forçado. Você ganha +10 em Furtividade, mas não pode ser alvo de curas aliadas." },
    { card: "X - A Roda", effect: "buff", image: "https://www.sacred-texts.com/tarot/pkt/img/ar10.jpg", desc: "Acerto crítico automático garantido no próximo tiro/ataque.", desc_inv: "Má Sorte. Seu próximo acerto natural 20 conta como uma falha crítica." },
    { card: "XI - A Justiça", effect: "debuff", image: "https://www.sacred-texts.com/tarot/pkt/img/ar11.jpg", desc: "Olho por olho. Ao curar aliados, você sofre 5 de Dano.", desc_inv: "Injustiça. Você transfere metade do dano sofrido para o aliado mais próximo." },
    { card: "XII - O Enforcado", effect: "debuff", image: "https://www.sacred-texts.com/tarot/pkt/img/ar12.jpg", desc: "Sacrifício doloroso. Não há Ação de Movimento.", desc_inv: "Libertação. Você ganha uma Ação Extra por turno, mas perde 5 de Sanidade no processo." },
    { card: "XIII - A Morte", effect: "debuff", image: "https://www.sacred-texts.com/tarot/pkt/img/ar13.jpg", desc: "Decadência. Seu HP máximo choca-se e cai pela metade.", desc_inv: "Renascimento. Seus rituais de dano curam você em 20% do valor causado." },
    { card: "XIV - A Temperança", effect: "debuff", image: "https://www.sacred-texts.com/tarot/pkt/img/ar14.jpg", desc: "Fluxo restrito. Você só pode realizar 1 Ação Padrão, sempre.", desc_inv: "Desequilíbrio. Suas curas dobram de valor, mas seus ataques sofrem -5 de bônus." },
    { card: "XV - O Diabo", effect: "debuff", image: "https://www.sacred-texts.com/tarot/pkt/img/ar15.jpg", desc: "Ambição corruptora. Dobra o dano mas você perde 2 rituais armados.", desc_inv: "Tentação. Inimigos ficam fascinados (D20 vs Vontade), mas você sofre dano dobrado." },
    { card: "XVI - A Torre", effect: "debuff", image: "https://www.sacred-texts.com/tarot/pkt/img/ar16.jpg", desc: "Destruição súbita. Seus Escudos somem, Vida máxima -10.", desc_inv: "Escombros Ocultos. Você ganha +5 de Defesa contra projéteis (cobertura total)." },
    { card: "XVII - A Estrela", effect: "buff", image: "https://www.sacred-texts.com/tarot/pkt/img/ar17.jpg", desc: "Renovação. Cura 5 HP no fim de cada turno seu.", desc_inv: "Esperança Perdida. Você não recupera SP no descanso, mas ganha +3 em todos os testes de Perícia." },
    { card: "XVIII - A Lua", effect: "debuff", image: "https://www.sacred-texts.com/tarot/pkt/img/ar18.jpg", desc: "Ilusões do abismo. Perde Sanidade a cada 2 turnos exposto no escuro.", desc_inv: "Claridade Noturna. Você ganha Visão no Escuro total e +5 em Percepção." },
    { card: "XIX - O Sol", effect: "buff", image: "https://www.sacred-texts.com/tarot/pkt/img/ar19.jpg", desc: "Imunidade a Cegueira e Trevas. Auras sombrias não lhe afetam.", desc_inv: "Eclipsado. Sua visão e alcance de rituais são reduzidos à metade." },
    { card: "XX - O Julgamento", effect: "buff", image: "https://www.sacred-texts.com/tarot/pkt/img/ar20.jpg", desc: "Redenção. Uma vez por missão, se chegar a 0 HP, você recupera 50% da vida.", desc_inv: "Veredito Sombrio. Seus pecados pesam: cura recebida é reduzida em 50%." },
    { card: "XXI - O Mundo", effect: "buff", image: "https://www.sacred-texts.com/tarot/pkt/img/ar21.jpg", desc: "Plenitude. Ganha +2 em Todos os Atributos e +5 em todas as Perícias.", desc_inv: "Mundo Hostil. O ambiente lhe rejeita: -2 em testes de resistência física." }
];

window.ORT_XP_TABLE = [
    { level: 1, xpTotal: 0, nextXP: 300 },
    { level: 2, xpTotal: 300, nextXP: 600 },
    { level: 3, xpTotal: 900, nextXP: 1100 },
    { level: 4, xpTotal: 2000, nextXP: 2000 },
    { level: 5, xpTotal: 4000, nextXP: 3000 },
    { level: 6, xpTotal: 7000, nextXP: 4000 },
    { level: 7, xpTotal: 11000, nextXP: 5000 },
    { level: 8, xpTotal: 16000, nextXP: 6000 },
    { level: 9, xpTotal: 22000, nextXP: 8000 },
    { level: 10, xpTotal: 30000, nextXP: 10000 },
    { level: 11, xpTotal: 40000, nextXP: 12000 },
    { level: 12, xpTotal: 52000, nextXP: 14000 },
    { level: 13, xpTotal: 66000, nextXP: 16000 },
    { level: 14, xpTotal: 82000, nextXP: 18000 },
    { level: 15, xpTotal: 100000, nextXP: 20000 },
    { level: 16, xpTotal: 120000, nextXP: 22000 },
    { level: 17, xpTotal: 142000, nextXP: 24000 },
    { level: 18, xpTotal: 166000, nextXP: 26000 },
    { level: 19, xpTotal: 192000, nextXP: 28000 },
    { level: 20, xpTotal: 220000, nextXP: 0 }
];

window.ORT_MAX_LEVEL = 20;

// Exportable functions
window.RPG = {
    // Returns the correct level based on total XP
    calculateLevel: function (currentXP) {
        let currentLevel = 1;
        for (let i = 0; i < ORT_XP_TABLE.length; i++) {
            if (currentXP >= ORT_XP_TABLE[i].xpTotal) {
                currentLevel = ORT_XP_TABLE[i].level;
            } else {
                break;
            }
        }
        return Math.min(currentLevel, ORT_MAX_LEVEL);
    },

    // Get the XP limits for a target Level
    getLevelData: function (lvl) {
        return ORT_XP_TABLE.find(l => l.level === lvl) || ORT_XP_TABLE[0];
    },

    // Derived Stats Formulas
    calcMaxHP: function (CON, LEVEL = 1, profile = null) {
        let val = 15 + CON + ((LEVEL - 1) * 3);
        if (profile && profile.active_tarot) {
            const card = profile.active_tarot.name;
            const isInv = profile.active_tarot.is_inverted;

            if (card.includes("III - A Imperatriz")) {
                if (!isInv) val += 20;
            }
            if (card.includes("XIII - A Morte")) {
                if (!isInv) val = Math.floor(val / 2);
                else val += 15; // Renascimento (Invertida)
            }
            if (card.includes("XVI - A Torre")) {
                if (!isInv) val -= 10;
            }
            if (card.includes("XXI - O Mundo")) {
                val += isInv ? -5 : 10; // Mundo (Invertida/Normal)
            }
        }
        return val;
    },
    calcMaxSP: function (ESP, LEVEL = 1, profile = null) {
        let val = 10 + ESP + ((LEVEL - 1) * 3);
        if (profile && profile.active_tarot) {
            const card = profile.active_tarot.name;
            // Add SP specific cards if any
        }
        return val;
    },
    calcDefense: function (CON, DES, profile = null) {
        let val = CON + DES + 2;
        if (profile && profile.active_tarot) {
            const card = profile.active_tarot.name;
            const isInv = profile.active_tarot.is_inverted;
            if (card.includes("0 - O Louco") && !isInv) val = 0;
            if (card.includes("XVI - A Torre") && isInv) val += 5; // Escombros (Invertida)
            if (card.includes("XXI - O Mundo")) val += isInv ? -2 : 2;
        }
        return val;
    },
    calcBaseSkillSlots: function (SAB) { return SAB + 3; },

    // Level Up Check Logic
    checkLevelUp: async function (userId, currentXP, oldLevel) {
        const newLevel = this.calculateLevel(currentXP);
        if (newLevel <= oldLevel) return false;

        // Got a level up! Calculate diff
        const levelsGained = newLevel - oldLevel;

        console.log(`[RPG] Level Up! ${oldLevel} -> ${newLevel}`);

        // Each level yields: +3 HP, +3 SP, +3 Attr PTS, +1 Ability PT
        // However, the rulebook says max HP is 15 + CON. We don't just add flat points,
        // the max pool scales linearly with levels (Optional rule: base + level*3 vs flat update).
        // Based on the book: "Beneficiary: +3 Max HP, +3 Max SP, +3 Attributes, +1 Ability"
        // Wait, if HP is strictly 15+CON, these flat +3s are cumulative overrides. 
        // We will distribute the Attribute Points and let the UI recalculate.

        try {
            const db = Auth.db();
            const { data: p } = await db.from('profiles').select('hp_current, sp_current, attribute_points, ability_points').eq('id', userId).single();

            const newAttrPoints = p.attribute_points + (3 * levelsGained);
            const newAbilPoints = p.ability_points + (1 * levelsGained);

            // We heal them slightly on level up or just increase the current by the threshold (+3)
            const newHp = p.hp_current + (3 * levelsGained);
            const newSp = p.sp_current + (3 * levelsGained);

            await db.from('profiles').update({
                level: newLevel,
                attribute_points: newAttrPoints,
                ability_points: newAbilPoints,
                hp_current: newHp,
                sp_current: newSp
            }).eq('id', userId);

            if (typeof Apps !== 'undefined' && Apps.showNotification) Apps.showNotification('EVOLUÇÃO', `NÍVEL DO AGENTE AUMENTOU PARA ${newLevel}!`, 'success');
            return true;
        } catch (e) {
            console.error("[RPG] Level Up Error", e);
            return false;
        }
    },

    // Global Admin/Mission function to grant XP
    giveXP: async function (userId, amount) {
        const db = Auth.db();
        const { data: p } = await db.from('profiles').select('xp, level').eq('id', userId).single();
        if (!p) return;

        let newXp = p.xp + amount;

        await db.from('profiles').update({ xp: newXp }).eq('id', userId);
        showNotification(`+${amount} XP ADQUIRIDO`, 'var(--amber)');

        // Check for level up post-grant
        await this.checkLevelUp(userId, newXp, p.level);
    },

    // Roll 3 random rituals based on affinity and level
    rollLoadout: function (affinity, ritualLevel) {
        if (!ORT_RITUALS[affinity]) return [];

        let pool = [];
        // Combine all rituals up to the current ritualLevel
        for (let i = 1; i <= ritualLevel; i++) {
            if (ORT_RITUALS[affinity][i]) {
                pool = pool.concat(ORT_RITUALS[affinity][i]);
            }
        }

        // Shuffle and pick 3
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
    },

    // Refresh loadout with lock logic
    refreshLoadout: function (currentSelection, lockIndex, affinity, ritualLevel) {
        let newSelection = this.rollLoadout(affinity, ritualLevel);

        if (lockIndex >= 0 && lockIndex < currentSelection.length) {
            // Keep the locked one at its index
            const lockedRitual = currentSelection[lockIndex];
            if (lockedRitual) {
                // Ensure the locked one is not duplicated in the new selection
                newSelection = newSelection.filter(r => r.id !== lockedRitual.id);
                // Try to keep it at the same index
                newSelection.splice(lockIndex, 0, lockedRitual);
                newSelection = newSelection.slice(0, 3);
            }
        }

        return newSelection;
    }
};

window.ORT_ABILITIES_CATALOG = [
    // Iniciante - Combate
    { id: 'arm_trein', name: 'Treinamento em Armadura', type: 'Passivo', desc: 'Usa armaduras pesadas sem penalidade de movimento.', req: 'CON:4', tier: 1 },
    { id: 'saque_rap', name: 'Saque Rápido', type: 'Ativo', desc: 'Saca armas com 1 Ação de Movimento.', req: 'DES:3', tier: 1 },
    { id: 'aparar', name: 'Aparar', type: 'Reação', desc: 'Apara ataques corpo-a-corpo rolando contra o atacante.', req: 'DES:4', tier: 1 },
    { id: 'supress', name: 'Ataque Supressivo', type: 'Ação Padrão', desc: 'Gasta munição dupla automática para suprimir o alvo.', req: 'FOR:4', tier: 1 },
    { id: 'atir_precis', name: 'Atirador Preciso', type: 'Passivo', desc: 'Tiros ignoram cobertura parcial.', req: 'DES:3', tier: 1 },
    { id: 'briga_rua', name: 'Briga de Rua', type: 'Passivo', desc: 'Ataque desarmado causa dano não-letal no Espírito.', req: 'FOR:3', tier: 1 },
    { id: 'laminas', name: 'Mestre de Lâminas', type: 'Passivo', desc: 'Armas corpo-a-corpo ignoram 3 de armadura.', req: 'FOR:4', tier: 1 },

    // Iniciante - Tec / Analise
    { id: 'tec_campo', name: 'Técnico de Campo', type: 'Ação Padrão', desc: 'Restaura itens quebrados para 1 HP.', req: 'INT:3', tier: 1 },
    { id: 'hack_rap', name: 'Hack Rápido', type: 'Ação Movimento', desc: 'Hackeia de forma rápida.', req: 'INT:4', tier: 1 },
    { id: 'per_inter', name: 'Perito em Interrogatório', type: 'Passivo', desc: 'Pode rerrolar 1 falha em testes de Persuasão/Intimidação.', req: 'ESP:3', tier: 1 },
    { id: 'sent_perigo', name: 'Sentido de Perigo', type: 'Passivo', desc: 'Instintos afiados. Mestre alerta emboscadas.', req: 'SAB:3', tier: 1 },

    // Iniciante - Geral
    { id: 'vit_robusta', name: 'Vitalidade Robusta', type: 'Passivo', desc: '+5 HP Máximo.', req: 'CON:3', tier: 1 },
    { id: 'foco_mental', name: 'Foco Mental', type: 'Passivo', desc: '+5 SP Máximo.', req: 'ESP:4', tier: 1 },
    { id: 'mes_campo', name: 'Mestre de Campo', type: 'Passivo', desc: 'Ganha 1 Ação de Mov extra no 1º turno.', req: 'SAB:4', tier: 1 },
    { id: 'mov_silenc', name: 'Movimento Silencioso', type: 'Passivo', desc: 'Mover-se não faz barulho ao focar-se.', req: 'DES:4', tier: 1 },
    { id: 'pri_socorros', name: 'Primeiros Socorros Táticos', type: 'Ação Padrão', desc: 'Estabiliza aliado a até 5m.', req: 'INT:3', tier: 1 },

    // Experiente
    { id: 'ripost', name: 'Ripostar', type: 'Reação', desc: 'Ataque grátis após aparar.', req: ['aparar', 'DES:6'], tier: 2 },
    { id: 'romp_blind', name: 'Rompe-Blindagem', type: 'Passivo', desc: '1º ataque ignora 5 de armadura.', req: ['laminas', 'FOR:6'], tier: 2 },
    { id: 'rec_rapida', name: 'Recarga Rápida', type: 'Passivo', desc: 'Recarrega com 1 ação de movimento.', req: ['atir_precis', 'DES:5'], tier: 2 },
    { id: 'golp_incap', name: 'Golpe Incapacitante', type: 'Ataque', desc: 'Força alvo a largar arma invés de dano.', req: ['briga_rua', 'FOR:5'], tier: 2 },
    { id: 'atir_elite', name: 'Atirador de Elite', type: 'Ação Padrão', desc: 'Próximo ataque ingora 10 de armadura.', req: ['supress', 'DES:6'], tier: 2 },
    { id: 'sob_sist', name: 'Sobrecarregar Sistema', type: 'Ação Padrão', desc: 'Desativa alvo robótico por 1 turno.', req: ['hack_rap', 'INT:6'], tier: 2 },
    { id: 'eng_comb', name: 'Engenheiro de Combate', type: 'Ação Padrão', desc: 'Cura drone/armas em combate 10+TEC.', req: ['tec_campo', 'INT:5'], tier: 2 },
    { id: 'leit_frio', name: 'Leitor Frio', type: 'Passivo', desc: 'Sabe se alvo não-anômalo está mentindo.', req: ['per_inter', 'ESP:5'], tier: 2 },
    { id: 'burl_proto', name: 'Burlar Protocolo', type: 'Especial', desc: '1 vez por missão garante sucesso em Tec.', req: ['sent_perigo', 'SAB:6'], tier: 2 },
    { id: 'triag_comb', name: 'Triagem de Combate', type: 'Passivo', desc: 'Aliado ganha 1 mov extra ao ser curado.', req: ['pri_socorros', 'INT:5'], tier: 2 },
    { id: 'vont_ferro', name: 'Vontade de Ferro', type: 'Reação', desc: 'Passa em teste de Sanidade automático.', req: ['foco_mental', 'ESP:6'], tier: 2 },
    { id: 'lid_esquad', name: 'Liderança de Esquadrão', type: 'Ação Padrão', desc: 'Inita aliado a fazer 1 ação de mov extra.', req: ['mes_campo', 'SAB:5'], tier: 2 },
    { id: 'res_anom', name: 'Resistência Anômala', type: 'Passivo', desc: 'Armadura Absoluta +3 contra dano Mental.', req: ['arm_trein', 'CON:6'], tier: 2 },
    { id: 'camuf_amb', name: 'Camuflagem Ambiental', type: 'Ação Padrão', desc: 'Fica invisível em cobertura.', req: ['mov_silenc', 'DES:6'], tier: 2 },
    { id: 'resi_comb', name: 'Resiliência de Combate', type: 'Passivo', desc: 'Curas fornecem +3 HP.', req: ['vit_robusta', 'CON:5'], tier: 2 },

    // Mestre
    { id: 'executar', name: 'Executar', type: 'Ataque', desc: 'Causa dano duplo em alvo com <25% de vida.', req: ['ripost', 'DES:8'], tier: 3 },
    { id: 'pos_inque', name: 'Postura Inquebrantável', type: 'Ação Completa', desc: 'Imune a dano cinético até próx turno.', req: ['res_anom', 'CON:9'], tier: 3 },
    { id: 'furia_bat', name: 'Fúria de Batalha', type: 'Ação Padrão', desc: 'Realiza MÚLTIPLAS ações, ataques tomam adv.', req: ['golp_incap', 'FOR:8'], tier: 3 },
    { id: 'mestre_arm', name: 'Mestre de Armas', type: 'Passivo', desc: 'Ignora 3 armadura em qualquer categoria.', req: ['romp_blind', 'FOR:9'], tier: 3 },
    { id: 'fant_sist', name: 'Fantasma no Sistema', type: 'Ação Completa', desc: 'Controla ambiente eletrônico 3 turnos.', req: ['sob_sist', 'INT:8'], tier: 3 },
    { id: 'prev_tatica', name: 'Previsão Tática', type: 'Reação', desc: 'Puxa aliado para agir primeiro na Iniciativa.', req: ['lid_esquad', 'SAB:8'], tier: 3 },
    { id: 'ult_susp', name: 'Último Suspiro', type: 'Passivo', desc: 'Mantem 1 HP no primeiro dano letal.', req: ['resi_comb', 'CON:8'], tier: 3 },
    { id: 'mente_inque', name: 'Mente Inquebrantável', type: 'Passivo', desc: 'Imunidade total passiva a Alta Ameaça.', req: ['vont_ferro', 'ESP:9'], tier: 3 },
    { id: 'ins_heroi', name: 'Inspirar Heroísmo', type: 'Ação Completa', desc: 'Limpa status, dá +10 HP Temp para todos.', req: ['triag_comb', 'SAB:9'], tier: 3 }
];
