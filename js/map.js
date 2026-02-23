/* ============================================================
   NEXUS OS — Mapa Galáctico (Atlas Estelar O.R.T.)
   ============================================================ */

// ── Database de Planetas ─────────────────────────────────────
const GALAXY_DB = [
    // NÚCLEO GALÁCTICO (ring=1, r=72)
    { id: 'capitolio', name: 'Capitólio', region: 'Núcleo Galáctico', rk: 'nucleo', angle: 270, ring: 1, desc: 'O coração administrativo e político do Governo Galáctico, um planeta-cidade coberto por senados monumentais, embaixadas e torres judiciais.', cities: 'Eixo da Justiça, Praça do Senado' },
    { id: 'sacrario', name: 'Sacrário', region: 'Núcleo Galáctico', rk: 'nucleo', angle: 10, ring: 1, desc: 'O centro espiritual e cultural do governo, um ecumenópolis dedicado a preservar a história e a ideologia oficial, coberto por arquivos-catedrais e museus-fortaleza.', cities: 'Altar da Memória, Claustro de Dados' },
    { id: 'cadia', name: 'Cádia Prima', region: 'Núcleo Galáctico', rk: 'nucleo', angle: 175, ring: 1, desc: 'A fortaleza militar central do Núcleo. Um planeta-cidade onde cada estrutura é um bunker e cada torre é uma bateria de armas, abrigando o Alto Comando e as frotas de elite.', cities: 'Bastião do Almirantado, Cidadela Resiliência' },
    { id: 'argos', name: 'Argos', region: 'Núcleo Galáctico', rk: 'nucleo', angle: 105, ring: 1, desc: 'A sede das agências de inteligência e segurança do governo. Um mundo de arranha-céus espelhados e centros de dados subterrâneos, de onde toda a galáxia é vigiada.', cities: 'O Olho, Panóptico Central' },

    // CENTRO GALÁCTICO (ring=2, r=158)
    { id: 'veredas', name: 'Veredas', region: 'Centro Galáctico', rk: 'centro', angle: 330, ring: 2, desc: 'O maior entreposto comercial da galáxia, um planeta de cidades verticais interligadas por pontes de plasma.', cities: 'Encruzilhada dos Mil Níveis, Porto Sombra' },
    { id: 'opulencia', name: 'Opulência', region: 'Centro Galáctico', rk: 'centro', angle: 143, ring: 2, desc: 'Um mundo resort para a elite galáctica, com cidades projetadas para o luxo e o entretenimento.', cities: 'Cúpula Dourada, Jardins de Safira' },
    { id: 'themis', name: 'Themis', region: 'Centro Galáctico', rk: 'centro', angle: 200, ring: 2, desc: 'Sede das cortes corporativas e do sistema financeiro galáctico.', cities: 'Balança de Aço, O Fórum Corporativo' },
    { id: 'genovavii', name: 'Gênova VII', region: 'Centro Galáctico', rk: 'centro', angle: 290, ring: 2, desc: 'Um mundo aquático com cidades-cúpula, o principal centro de biotecnologia, cibernética e aprimoramentos.', cities: 'Batisfera, Recife de Cromo' },
    { id: 'aethel', name: 'Aethel Prime', region: 'Centro Galáctico', rk: 'centro', angle: 248, ring: 2, desc: 'Um dos planetas mais populosos, conhecido por suas colmeias residenciais que se estendem até as nuvens.', cities: 'Colmeia Aethel, Distrito de Seda' },
    { id: 'terminus', name: 'Terminus Est', region: 'Centro Galáctico', rk: 'centro', angle: 312, ring: 2, desc: 'A maior estação de transporte da galáxia. O único planeta com permissão de realizar viagens de diversos tipos até o Núcleo Galáctico.', cities: 'Plataforma Central, Hangar 94' },
    { id: 'lumeria', name: 'Luméria', region: 'Centro Galáctico', rk: 'centro', angle: 274, ring: 2, desc: 'Um mundo famoso por sua arte e entretenimento — teatros de holodrama, arenas de gladiadores.', cities: 'Distrito do Néon, Arena de Titãs' },
    { id: 'hedria', name: 'Hédria', region: 'Centro Galáctico', rk: 'centro', angle: 253, ring: 2, desc: 'Sede das maiores universidades e centros de pesquisa científica da galáxia.', cities: 'O Campus, Torre de Marfim' },
    { id: 'oricalco', name: 'Oricalco', region: 'Centro Galáctico', rk: 'centro', angle: 341, ring: 2, desc: 'Um planeta cuja economia gira em torno da extração do raro metal Oricalco, vital para a tecnologia de ponta.', cities: 'Cadinho, Cidade do Veio' },
    { id: 'benedonis', name: 'Benedonis', region: 'Centro Galáctico', rk: 'centro', angle: 305, ring: 2, desc: 'Um planeta de vasta importância religiosa para várias espécies, com cidades construídas em torno de locais sagrados.', cities: 'Terra Santa, Mosteiro da Estrela-Guia' },
    { id: 'astris', name: 'Astris', region: 'Centro Galáctico', rk: 'centro', angle: 218, ring: 2, desc: 'Um mundo de observatórios gigantes e estaleiros de naves de luxo.', cities: 'Cúpula do Astrônomo, Doca de Prestígio' },
    { id: 'sideros', name: 'Sideros', region: 'Centro Galáctico', rk: 'centro', angle: 297, ring: 2, desc: 'Um mundo artificial construído a partir de asteroides fundidos, agora uma metrópole vertical e labiríntica.', cities: 'Cratera Central, Espiral de Ferro' },
    { id: 'itaca', name: 'Ítaca', region: 'Centro Galáctico', rk: 'centro', angle: 193, ring: 2, desc: 'Famoso por suas academias de pilotos e estaleiros orbitais, onde as frotas comerciais são construídas.', cities: 'Doca Ulisses, Academia de Navegadores' },
    { id: 'damasco', name: 'Damasco', region: 'Centro Galáctico', rk: 'centro', angle: 281, ring: 2, desc: 'Um planeta-mercado especializado em armas e equipamentos de luxo para a elite.', cities: 'A Bigorna, Salão da Lâmina' },
    { id: 'zennlar', name: 'Zennlar', region: 'Centro Galáctico', rk: 'centro', angle: 262, ring: 2, desc: 'Conhecido por suas paisagens exóticas e resorts de luxo, destino de férias popular para os cidadãos mais ricos.', cities: 'Baía do Paraíso, Retiro de Cristal' },
    { id: 'pergamo', name: 'Pérgamo Maior', region: 'Centro Galáctico', rk: 'centro', angle: 168, ring: 2, desc: 'Um mundo-biblioteca, onde o conhecimento de toda a galáxia é armazenado em vastos bancos de dados.', cities: 'O Grande Arquivo, Scriptorium' },
    { id: 'elisio', name: 'Elísio', region: 'Centro Galáctico', rk: 'centro', angle: 154, ring: 2, desc: 'Um oásis de calma, planeta de cidades planejadas e parques extensos, lar de diplomatas e aposentados abastados.', cities: 'Vila Serena, Retiro do Embaixador' },
    { id: 'kythera', name: 'Kythera', region: 'Centro Galáctico', rk: 'centro', angle: 136, ring: 2, desc: 'Um gigante gasoso com cidades flutuantes, um centro vital para o refino de combustíveis raros.', cities: 'Plataforma Hélio-3, Refinaria de Bóreas' },
    { id: 'shabazz', name: 'Shabazz VII', region: 'Centro Galáctico', rk: 'centro', angle: 121, ring: 2, desc: 'Um mundo árido com uma cultura rica, famoso por suas especiarias raras e têxteis exóticos.', cities: 'Mercado de Areia, Oásis do Profeta' },
    { id: 'zoidra', name: 'Zoidra', region: 'Centro Galáctico', rk: 'centro', angle: 352, ring: 2, desc: 'Berço da inovação em engenharia. A metrópole Korningrade sobrevive a brutais inundações sazonais e é um dos maiores entrepostos do Governo Galáctico.', cities: 'Korningrade, Cidadela da Comporta' },

    // COLÔNIAS INTERNAS (ring=3, r=254)
    { id: 'ferria', name: 'Ferria', region: 'Colônias Internas', rk: 'internas', angle: 18, ring: 3, desc: 'O maior mundo-forja da galáxia, produzindo 60% de todo o aço.', cities: 'Colmeia Stakhanov, Forja 01' },
    { id: 'agria', name: 'Agria', region: 'Colônias Internas', rk: 'internas', angle: 40, ring: 3, desc: 'Um "celeiro" da galáxia, coberto por campos de cultivo geneticamente modificados.', cities: 'Campo Dourado, Silo 17' },
    { id: 'molbrax', name: 'Mólbrax', region: 'Colônias Internas', rk: 'internas', angle: 233, ring: 3, desc: 'Um planeta de mineração de rocha bruta, fundamental para a construção.', cities: 'A Pedreira, Veio Profundo' },
    { id: 'avernus', name: 'Avernus', region: 'Colônias Internas', rk: 'internas', angle: 28, ring: 3, desc: 'Um mundo vulcânico que gera energia geotérmica para dezenas de colônias.', cities: 'Caldeira, Geotérmica-9' },
    { id: 'golgota', name: 'Gólgota', region: 'Colônias Internas', rk: 'internas', angle: 284, ring: 3, desc: 'O principal centro de reciclagem de naves e tecnologia obsoleta da galáxia.', cities: 'O Desmanche, Mausoléu de Aço' },
    { id: 'montshare', name: "Mont'share", region: 'Colônias Internas', rk: 'internas', angle: 115, ring: 3, desc: 'Uma colônia "normal", conhecida por sua topografia montanhosa e comunidades isoladas.', cities: 'Pico da Viúva, Vale do Eco' },
    { id: 'estigia', name: 'Estígia', region: 'Colônias Internas', rk: 'internas', angle: 200, ring: 3, desc: 'Um mundo industrial focado na produção química, com rios de resíduos tóxicos.', cities: 'Porto Fétido, Refinaria Alquímica' },
    { id: 'lethe', name: 'Lethe', region: 'Colônias Internas', rk: 'internas', angle: 252, ring: 3, desc: 'O maior planeta-prisão das Colônias, onde os condenados trabalham em minas e fábricas poluentes.', cities: 'O Lamento, Bloco Penitenciário 9' },
    { id: 'hesperides', name: 'Hespérides', region: 'Colônias Internas', rk: 'internas', angle: 243, ring: 3, desc: 'Um mundo de selvas luxuriantes, focado na pesquisa xenobiológica e colheita de compostos farmacêuticos.', cities: 'Posto Avançado Éden, Laboratório Serpentário' },
    { id: 'volgodo', name: 'Vólgodo', region: 'Colônias Internas', rk: 'internas', angle: 173, ring: 3, desc: 'Uma colônia fria e industrial, onde a população operária trabalha em vastos complexos de manufatura.', cities: 'Tecno-Santuário, Linha de Montagem 21' },
    { id: 'concordia', name: 'Concordia', region: 'Colônias Internas', rk: 'internas', angle: 104, ring: 3, desc: 'Uma colônia padrão com ecossistema equilibrado, servindo como centro populacional para os trabalhadores das colônias vizinhas.', cities: 'Boa Vizinhança, Encruzilhada do Trabalhador' },
    { id: 'beladona', name: 'Beladona', region: 'Colônias Internas', rk: 'internas', angle: 7, ring: 3, desc: 'Um planeta-jardim onde cada planta é venenosa. Sua indústria é a produção dos mais potentes venenos e antídotos.', cities: 'Cúpula de Vidro, Estufa Letal' },
    { id: 'xessarsanctum', name: 'Xessar Sanctum', region: 'Colônias Internas', rk: 'internas', angle: 118, ring: 3, desc: 'Um mundo monástico que, apesar de tranquilo, é um grande produtor de vinhos e alimentos de luxo.', cities: 'O Vinhedo, Abadia da Colheita' },
    { id: 'crisol_int', name: 'Crisol', region: 'Colônias Internas', rk: 'internas', angle: 356, ring: 3, desc: 'Um planeta geologicamente instável usado pelas corporações para testar e demonstrar novos armamentos para o mercado consumidor.', cities: 'Campo de Provas, Zona de Impacto' },
    { id: 'oficio', name: 'Ofício', region: 'Colônias Internas', rk: 'internas', angle: 52, ring: 3, desc: 'Uma colônia de artesãos e engenheiros especializados, focada na produção de componentes de alta tecnologia.', cities: 'A Guilda, Cidadela da Precisão' },
    { id: 'acheron', name: 'Acheron', region: 'Colônias Internas', rk: 'internas', angle: 187, ring: 3, desc: 'Um mundo sombrio e rochoso, a principal fonte de minérios pesados usados nos reatores das naves.', cities: 'Mina Profunda, Porto de Carvão' },
    { id: 'tithoul_int', name: 'Tithoul', region: 'Colônias Internas', rk: 'internas', angle: 210, ring: 3, desc: 'Um mundo pantanoso, cuja principal exportação são gases raros e compostos orgânicos extraídos de sua atmosfera.', cities: 'Plataforma de Gás, Vila do Pântano' },
    { id: 'axion', name: 'Axion', region: 'Colônias Internas', rk: 'internas', angle: 141, ring: 3, desc: 'Uma colônia normal e bem estabelecida, servindo como um centro administrativo para um aglomerado de mundos de produção.', cities: 'Marco Zero, Vigília do Governador' },
    { id: 'caliba', name: 'Calibã', region: 'Colônias Internas', rk: 'internas', angle: 266, ring: 3, desc: 'Uma colônia que vive da exportação de peles e amostras de sua megafauna perigosa.', cities: 'Fortaleza dos Caçadores, Aldeia da Presa' },
    { id: 'drundaia', name: 'Drundaia', region: 'Colônias Internas', rk: 'internas', angle: 4, ring: 3, desc: 'Um planeta independente de fachada opulenta que atrai todas as raças. Sociedade dividida em cidades-colmeia verticais, com elite rica na superfície e submundo nos níveis inferiores.', cities: 'Aurória, Aerthos' },

    // COLÔNIAS EXPANSIONISTAS (ring=4, r=350)
    { id: 'bastilha', name: 'Bastilha', region: 'Colônias Expansionistas', rk: 'expansionistas', angle: 58, ring: 4, desc: 'O principal ponto de comando da rede de defesa da fronteira. Um mundo-fortaleza com a maior das armas planetárias.', cities: 'Base Vanguarda, O Canhão Estelar' },
    { id: 'voragem', name: 'Voragem', region: 'Colônias Expansionistas', rk: 'expansionistas', angle: 27, ring: 4, desc: 'Um mundo de clima extremo usado como base de treinamento para as tropas de choque.', cities: 'Base Quebra-Tempestade, O Olho' },
    { id: 'augure', name: 'Áugure', region: 'Colônias Expansionistas', rk: 'expansionistas', angle: 130, ring: 4, desc: 'Uma base de exploração avançada, focada em enviar missões para o Espaço Desconhecido e analisar dados.', cities: 'Base do Pioneiro, Hangar de Longo Alcance' },
    { id: 'erebo', name: 'Érebo', region: 'Colônias Expansionistas', rk: 'expansionistas', angle: 64, ring: 4, desc: 'A base de escuta da fronteira. Sua arma planetária é, na verdade, um sensor de longo alcance disfarçado.', cities: 'Posto de Escuta Alfa, Base Sombra' },
    { id: 'portao', name: 'Portão do Traidor', region: 'Colônias Expansionistas', rk: 'expansionistas', angle: 192, ring: 4, desc: 'Uma base de patrulha e interceptação, responsável por policiar os setores mais anárquicos da fronteira.', cities: 'Base do Executor, Angra do Corsário' },
    { id: 'borda', name: 'Borda da Alvorada', region: 'Colônias Expansionistas', rk: 'expansionistas', angle: 305, ring: 4, desc: 'Uma base de pesquisa e desenvolvimento, onde novas tecnologias de exploração e armas de defesa são testadas.', cities: 'Laboratório da Borda, Forja Experimental' },
    { id: 'sitio_keter', name: 'Sítio Keter', region: 'Colônias Expansionistas', rk: 'expansionistas', angle: 348, ring: 4, desc: 'Uma base construída em torno de uma colossal estrutura alienígena, estudada secretamente pelo governo.', cities: 'Base Monólito, Sítio de Escavação' },
    { id: 'ultimo_porto', name: 'Último Porto', region: 'Colônias Expansionistas', rk: 'expansionistas', angle: 284, ring: 4, desc: 'A base de lançamento mais distante. Buracos de minhoca artificiais são abertos aqui para enviar sondas para outras galáxias.', cities: 'Base Ponto Final, O Lançador' },
    { id: 'crisol_mil', name: 'Crisol (Militar)', region: 'Colônias Expansionistas', rk: 'expansionistas', angle: 38, ring: 4, desc: 'Uma base de testes de armamento pesado, onde as armas da rede de defesa planetária são calibradas.', cities: 'Campo de Provas, Zona de Impacto' },
    { id: 'quimera', name: 'Quimera', region: 'Colônias Expansionistas', rk: 'expansionistas', angle: 48, ring: 4, desc: 'Uma base de pesquisa biológica avançada, estudando formas de vida de fora da galáxia para contramedidas.', cities: 'Laboratório-X, A Gaiola' },
    { id: 'genese', name: 'Gênese', region: 'Colônias Expansionistas', rk: 'expansionistas', angle: 75, ring: 4, desc: 'Uma base de suporte vital e terraformação, pesquisando formas de tornar mundos inóspitos habitáveis.', cities: 'Cúpula Botânica, Torre de Água' },
    { id: 'severance', name: 'Severance', region: 'Colônias Expansionistas', rk: 'expansionistas', angle: 156, ring: 4, desc: 'A principal base de treinamento de fuzileiros navais da fronteira.', cities: 'Muro da Doutrina, Campo de Treinamento' },
    { id: 'tithoul_mil', name: 'Tithoul (Naval)', region: 'Colônias Expansionistas', rk: 'expansionistas', angle: 224, ring: 4, desc: 'Uma base naval avançada, oculta na atmosfera densa de um gigante gasoso, servindo como ponto de reparo e reabastecimento.', cities: 'Doca Suspensa, Plataforma de Gás' },
    { id: 'tlilhdul', name: 'Tlilhdul', region: 'Colônias Expansionistas', rk: 'expansionistas', angle: 168, ring: 4, desc: 'Um planeta morto em quarentena. Uma entidade primordial de 450 metros despertou e destruiu o antigo centro de clonagem. O Governo monitora a criatura de sua órbita.', cities: 'Plataforma Cérbero, Zona de Observação Titã' },
    { id: 'tartaro', name: 'Tártaro', region: 'Colônias Expansionistas', rk: 'expansionistas', angle: 142, ring: 4, desc: 'Um mundo-prisão de alta gravidade, onde os piores criminosos militares operam a arma de defesa planetária.', cities: 'Bloco Penitenciário Hades, Forja da Última Chance' },
    { id: 'auspex', name: 'Auspex', region: 'Colônias Expansionistas', rk: 'expansionistas', angle: 203, ring: 4, desc: 'Sede de uma base de inteligência de sinais (SIGINT), dedicada a monitorar o Espaço Desconhecido.', cities: 'Posto de Escuta Profunda, Cúpula do Silêncio' },
    { id: 'indomitus', name: 'Indomitus', region: 'Colônias Expansionistas', rk: 'expansionistas', angle: 117, ring: 4, desc: 'Uma reserva de caça militarizada. Um mundo de selva letal, usado como o campo de treinamento de sobrevivência final.', cities: 'Forte da Presa, Arena de Caça Z-9' },
    { id: 'prometeus', name: 'Prometeus', region: 'Colônias Expansionistas', rk: 'expansionistas', angle: 337, ring: 4, desc: 'Uma lua estéril convertida em um gigantesco complexo de refino e depósito de combustível.', cities: 'Refinaria Hélio-Delta, Doca de Reabastecimento' },
    { id: 'forja', name: 'Forja de Omnith', region: 'Colônias Expansionistas', rk: 'expansionistas', angle: 238, ring: 4, desc: 'O principal planeta forja da galáxia. Especializado em produzir os metais mais resistentes, blindagens de naves de guerra e as colossais defesas planetárias.', cities: 'Arsenal Primus, A Grande Bigorna' },
    { id: 'zendar', name: 'Zendar', region: 'Colônias Expansionistas', rk: 'expansionistas', angle: 101, ring: 4, desc: 'O principal nexo de comunicações e criptografia da rede de defesa da fronteira, coordenando a frota e os dados de vigilância.', cities: 'Nexo Cripto, Torre de Transmissão Primus' },

    // VALE CINZENTO (posicionados na parte inferior, ângulos 95°–165°, r~290)
    { id: 'terra', name: 'Terra', region: 'Vale Cinzento', rk: 'vale', angle: 140, ring: 3.2, desc: 'O mundo natal da humanidade, em uma rara "bolsa" de baixa atividade anômala dentro da Zona Morta. Sua sobrevivência é um mistério e sua posição, um segredo precário.', cities: 'São Paulo, Tóquio' },
    { id: 'lamento', name: 'Lamento', region: 'Vale Cinzento', rk: 'vale', angle: 158, ring: 3.2, desc: 'Acredita-se ser o epicentro da praga psíquica usada na guerra antiga. Silencioso, mas sondas relatam um "eco" de sofrimento psíquico que enlouquece quem se aproxima.', cities: 'Ruínas de cidades-fantasma' },
    { id: 'anatema', name: 'Anátema', region: 'Vale Cinzento', rk: 'vale', angle: 120, ring: 3.2, desc: 'Um mundo onde a realidade foi permanentemente "rasgada". Uma anomalia dimensional estável paira em sua superfície, vigiada pela ORT Archive em órbita segura.', cities: 'Posto de Observação Proibido (órbita)' },
    { id: 'vossir', name: 'Vossir Sanctum', region: 'Vale Cinzento', rk: 'vale', angle: 178, ring: 3.2, desc: 'Um antigo mundo santuário da Grande Guerra, usado para adorar Deuses agora esquecidos. Todos que pisam aqui nunca voltam exatamente os mesmos.', cities: 'Basílica do Silêncio' },
];

// ── Cores por Região ─────────────────────────────────────────
const REGION_COLORS = {
    nucleo: { color: '#ff6600', stroke: '#ff6600', glow: 'rgba(255,102,0,0.6)' },
    centro: { color: '#00e850', stroke: '#00e850', glow: 'rgba(0,232,80,0.5)' },
    internas: { color: '#00ff41', stroke: '#00ff41', glow: 'rgba(0,255,65,0.4)' },
    expansionistas: { color: '#ffb000', stroke: '#ffb000', glow: 'rgba(255,176,0,0.5)' },
    vale: { color: '#cc66ff', stroke: '#cc66ff', glow: 'rgba(204,102,255,0.6)' },
};

// ── Raio dos Anéis ───────────────────────────────────────────
const RING_RADII = { 1: 72, 2: 158, 3: 254, 4: 350, 3.2: 295 };

// ── Função: Posição XY de um planeta ─────────────────────────
function planetXY(cx, cy, ring, angleDeg) {
    const r = RING_RADII[ring] || 200;
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// ── Função: Gerar estrelas de fundo ─────────────────────────
function makeStars(count) {
    const rng = (min, max) => min + Math.random() * (max - min);
    let stars = '';
    for (let i = 0; i < count; i++) {
        const x = rng(0, 900), y = rng(0, 820);
        const r = rng(0.3, 1.5);
        const op = rng(0.15, 0.6);
        stars += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="white" opacity="${op.toFixed(2)}"/>`;
    }
    return stars;
}

// ── Função de Renderização HTML do App ───────────────────────
function map() {
    return `
    <div class="map-container">
      <div class="map-svg-wrap" id="map-svg-wrap">
        <svg id="galaxy-svg" viewBox="0 0 900 820" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#0b1a0b"/>
              <stop offset="100%" stop-color="#010601"/>
            </radialGradient>
            <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#ff660044"/>
              <stop offset="70%" stop-color="#ff220011"/>
              <stop offset="100%" stop-color="transparent"/>
            </radialGradient>
            <filter id="blur2"><feGaussianBlur stdDeviation="2.5"/></filter>
            <filter id="blur4"><feGaussianBlur stdDeviation="5"/></filter>
          </defs>

          <!-- Background -->
          <rect width="900" height="820" fill="url(#bgGrad)"/>

          <!-- Stars -->
          <g opacity="0.9">${makeStars(220)}</g>

          <!-- Núcleo glow -->
          <circle cx="440" cy="380" r="100" fill="url(#coreGlow)"/>
          <circle cx="440" cy="380" r="55" fill="#0a1a05" filter="url(#blur4)"/>

          <!-- Rings -->
          <circle cx="440" cy="380" r="72"  fill="none" stroke="#ff6600" stroke-width="1.2" opacity="0.55"/>
          <circle cx="440" cy="380" r="158" fill="none" stroke="#00e850" stroke-width="1"   opacity="0.45"/>
          <circle cx="440" cy="380" r="254" fill="none" stroke="#00ff41" stroke-width="1"   opacity="0.35" stroke-dasharray="5,7"/>
          <circle cx="440" cy="380" r="350" fill="none" stroke="#ffb000" stroke-width="1"   opacity="0.30" stroke-dasharray="4,9"/>

          <!-- Vale Cinzento boundary -->
          <path d="M 330,560 Q 330,770 440,790 Q 550,770 550,560" fill="rgba(120,50,200,0.06)" stroke="#cc66ff" stroke-width="1.2" stroke-dasharray="6,5" opacity="0.55"/>

          <!-- Region labels (right side) -->
          <g font-family="Share Tech Mono" text-anchor="end">
            <text x="886" y="220" font-size="11" fill="#ff6600" opacity="0.8">■ NÚCLEO GALÁCTICO</text>
            <text x="886" y="237" font-size="11" fill="#00e850" opacity="0.8">■ CENTRO GALÁCTICO</text>
            <text x="886" y="254" font-size="11" fill="#00ff41" opacity="0.8">■ COLÔNIAS INTERNAS</text>
            <text x="886" y="271" font-size="11" fill="#ffb000" opacity="0.8">■ COL. EXPANSIONISTAS</text>
            <text x="886" y="288" font-size="11" fill="#cc66ff" opacity="0.8">■ VALE CINZENTO</text>
          </g>

          <!-- Corner labels -->
          <g font-family="Share Tech Mono" font-size="12" fill="#223022" opacity="0.7">
            <text x="8"   y="22">ESPAÇO</text>
            <text x="8"   y="37">DESCONHECIDO</text>
            <text x="892" y="22" text-anchor="end">ESPAÇO</text>
            <text x="892" y="37" text-anchor="end">DESCONHECIDO</text>
            <text x="8"   y="808">ESPAÇO</text>
            <text x="8"   y="793">DESCONHECIDO</text>
            <text x="892" y="808" text-anchor="end">ESPAÇO</text>
            <text x="892" y="793" text-anchor="end">DESCONHECIDO</text>
          </g>

          <!-- Vale Cinzento label -->
          <text x="440" y="758" font-family="Share Tech Mono" font-size="14" fill="#cc66ff" text-anchor="middle" opacity="0.7" letter-spacing="3">VALE CINZENTO</text>

          <!-- Planets layer (populated by initMap) -->
          <g id="map-planets"></g>
        </svg>
      </div>

      <div class="map-detail-panel" id="map-detail-panel">
        <div class="map-detail-placeholder" id="map-placeholder">
          <div style="font-size:38px;margin-bottom:10px;opacity:0.6">🌌</div>
          <div style="font-family:var(--font-logo);font-size:11px;color:var(--green-mid);letter-spacing:3px">ATLAS ESTELAR</div>
          <div style="font-family:var(--font-code);font-size:10px;color:var(--green-dark);margin-top:8px;letter-spacing:2px">O.R.T. — INTEL</div>
          <div style="font-family:var(--font-code);font-size:11px;color:var(--green-dark);margin-top:20px">Selecione um planeta<br>para ver os dados</div>
        </div>
        <div class="map-planet-info hidden" id="map-planet-info"></div>

        <div class="map-legend">
          ${Object.entries(REGION_COLORS).map(([k, v]) => {
        const label = { nucleo: 'Núcleo Galáctico', centro: 'Centro Galáctico', internas: 'Colônias Internas', expansionistas: 'Col. Expansionistas', vale: 'Vale Cinzento' }[k];
        return `<div class="map-legend-item"><div class="map-legend-dot" style="background:${v.color};box-shadow:0 0 4px ${v.color}"></div>${label}</div>`;
    }).join('')}
        </div>
      </div>
    </div>
  `;
}

// ── Inicialização do Mapa ────────────────────────────────────
function initMap() {
    const svg = document.getElementById('map-planets');
    if (!svg) return;

    const CX = 440, CY = 380;
    let selectedId = null;

    // Renderiza todos os planetas
    GALAXY_DB.forEach(p => {
        const { x, y } = planetXY(CX, CY, p.ring, p.angle);
        const rc = REGION_COLORS[p.rk] || REGION_COLORS.internas;
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.classList.add('map-planet-dot');
        g.dataset.id = p.id;
        g.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)})`);

        // Outer glow
        const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        glow.setAttribute('r', p.ring === 1 ? '6' : '4');
        glow.setAttribute('fill', rc.color);
        glow.setAttribute('opacity', '0.18');
        glow.classList.add('planet-glow-ring');

        // Dot
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('r', p.ring === 1 ? '3.5' : '2.5');
        dot.setAttribute('fill', rc.color);
        dot.setAttribute('opacity', '0.92');
        dot.setAttribute('stroke', 'rgba(255,255,255,0.3)');
        dot.setAttribute('stroke-width', '0.5');
        dot.classList.add('planet-dot-inner');

        // Label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.classList.add('map-planet-label');
        text.textContent = p.name;
        text.setAttribute('fill', 'rgba(160,215,160,0.75)');
        text.setAttribute('font-size', '8.5');
        text.setAttribute('font-family', 'Share Tech Mono, monospace');
        // Position label to avoid overlap
        const lx = x > CX ? 5 : -(p.name.length * 4.5 + 5);
        text.setAttribute('x', lx.toFixed(1));
        text.setAttribute('y', '3.5');
        text.style.pointerEvents = 'none';

        g.appendChild(glow);
        g.appendChild(dot);
        g.appendChild(text);
        svg.appendChild(g);

        // Click handler
        g.addEventListener('click', () => {
            // Deselect previous
            if (selectedId) {
                const prev = document.querySelector(`[data-id="${selectedId}"] .planet-dot-inner`);
                const prevText = document.querySelector(`[data-id="${selectedId}"] text`);
                if (prev) { prev.setAttribute('opacity', '0.92'); prev.setAttribute('r', p.ring === 1 ? '3.5' : '2.5'); }
                if (prevText) prevText.setAttribute('fill', 'rgba(160,215,160,0.75)');
            }
            selectedId = p.id;
            // Highlight selected
            dot.setAttribute('opacity', '1');
            dot.setAttribute('r', p.ring === 1 ? '5' : '4');
            text.setAttribute('fill', '#ffb000');
            showPlanetInfo(p, rc.color);
        });

        // Hover
        g.addEventListener('mouseenter', () => {
            if (selectedId !== p.id) {
                dot.setAttribute('opacity', '1');
                glow.setAttribute('opacity', '0.45');
            }
        });
        g.addEventListener('mouseleave', () => {
            if (selectedId !== p.id) {
                dot.setAttribute('opacity', '0.92');
                glow.setAttribute('opacity', '0.18');
            }
        });
    });

    function showPlanetInfo(p, color) {
        const placeholder = document.getElementById('map-placeholder');
        const info = document.getElementById('map-planet-info');
        if (!placeholder || !info) return;
        placeholder.classList.add('hidden');
        info.classList.remove('hidden');

        const ringLabel = { 1: 'Anel I', 2: 'Anel II', 3: 'Anel III', 4: 'Anel IV', 3.2: 'Vale' }[p.ring] || '';
        info.innerHTML = `
      <div class="planet-name">${p.name}</div>
      <div class="planet-region-badge" style="color:${color};border-color:${color}">${p.region}</div>
      <div style="font-family:var(--font-code);font-size:10px;color:var(--green-dark);letter-spacing:2px">${ringLabel} · ${p.angle}°</div>
      <div class="planet-desc">${p.desc}</div>
      <div>
        <div class="planet-cities-header">&gt; Cidades Principais</div>
        <div class="planet-cities">${p.cities}</div>
      </div>
    `;
    }
}
