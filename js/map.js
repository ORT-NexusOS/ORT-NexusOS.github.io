/* ============================================================
   NEXUS OS — Catálogo Galáctico (Atlas Estelar O.R.T.)
   ============================================================ */

const GALAXY_DB = [
  // SEÇÃO 1: NÚCLEO GALÁCTICO (R ~ 45)
  { id: 'capitolio', name: 'Capitólio', region: 'Núcleo Galáctico', rk: 'nucleo', type: 'ecumenopolis', pos: { r: 40, a: 280 }, desc: 'O coração administrativo e político do Governo Galáctico, um planeta-cidade coberto por senados monumentais, embaixadas e torres judiciais.', cities: 'Eixo da Justiça, Praça do Senado', population: '840 Bilhões', status: 'ESTÁVEL' },
  { id: 'sacrario', name: 'Sacrário', region: 'Núcleo Galáctico', rk: 'nucleo', type: 'ecumenopolis', pos: { r: 45, a: 250 }, desc: 'O centro espiritual e cultural do governo, um ecumenópolis dedicado a preservar a história e a ideologia oficial, coberto por arquivos-catedrais e museus-fortaleza.', cities: 'Altar da Memória, Claustro de Dados', population: '120 Bilhões', status: 'PROTEGIDO' },
  { id: 'cadia', name: 'Cádia Prima', region: 'Núcleo Galáctico', rk: 'nucleo', type: 'fortress', pos: { r: 35, a: 180 }, desc: 'A fortaleza militar central do Núcleo. Um planeta-cidade onde cada estrutura é um bunker e cada torre é uma bateria de armas, abrigando o Alto Comando e as frotas de elite.', cities: 'Bastião do Almirantado, Cidadela Resiliência', population: '2.4 Bilhões (Militares)', status: 'ALERTA MÁXIMO' },
  { id: 'argos', name: 'Argos', region: 'Núcleo Galáctico', rk: 'nucleo', type: 'intel', pos: { r: 50, a: 150 }, desc: 'A sede das agências de inteligência e segurança do governo. Um mundo de arranha-céus espelhados e centros de dados subterrâneos, de onde toda a galáxia é vigiada.', cities: 'O Olho, Panóptico Central', population: '45 Milhões', status: 'CLASSIFICADO' },

  // SEÇÃO 2: CENTRO GALÁCTICO (R ~ 85)
  { id: 'veredas', name: 'Veredas', region: 'Centro Galáctico', rk: 'centro', type: 'market', pos: { r: 85, a: 340 }, desc: 'O maior entreposto comercial da galáxia, um planeta de cidades verticais interligadas por pontes de plasma.', cities: 'Encruzilhada dos Mil Níveis, Porto Sombra', population: '25 Bilhões', status: 'COMERCIAL' },
  { id: 'opulencia', name: 'Opulência', region: 'Centro Galáctico', rk: 'centro', type: 'resort', pos: { r: 80, a: 320 }, desc: 'Um mundo resort para a elite galáctica, com cidades projetadas para o luxo e o entretenimento.', cities: 'Cúpula Dourada, Jardins de Safira', population: '800 Milhões', status: 'TURISMO' },
  { id: 'themis', name: 'Themis', region: 'Centro Galáctico', rk: 'centro', type: 'tech', pos: { r: 90, a: 215 }, desc: 'Sede das cortes corporativas e do sistema financeiro galáctico.', cities: 'Balança de Aço, O Fórum Corporativo', population: '12 Bilhões', status: 'ESTÁVEL' },
  { id: 'genovavii', name: 'Gênova VII', region: 'Centro Galáctico', rk: 'centro', type: 'ocean', pos: { r: 85, a: 190 }, desc: 'Um mundo aquático com cidades-cúpula, o principal centro de biotecnologia, cibernética e aprimoramentos.', cities: 'Batisfera, Recife de Cromo', population: '6.8 Bilhões', status: 'PRODUÇÃO' },
  { id: 'aethel', name: 'Aethel Prime', region: 'Centro Galáctico', rk: 'centro', type: 'residential', pos: { r: 75, a: 230 }, desc: 'Um dos planetas mais populosos, conhecido por suas colmeias residenciais que se estendem até as nuvens.', cities: 'Colmeia Aethel, Distrito de Seda', population: '450 Bilhões', status: 'ATIVO' },
  { id: 'terminus', name: 'Terminus Est', region: 'Centro Galáctico', rk: 'centro', type: 'station', pos: { r: 95, a: 120 }, desc: 'A maior estação de transporte da galáxia. O único planeta com permissão de realizar viagens de diversos tipos até o Núcleo Galáctico.', cities: 'Plataforma Central, Hangar 94', population: '15 Milhões', status: 'TRANSITÓRIO' },
  { id: 'lumeria', name: 'Luméria', region: 'Centro Galáctico', rk: 'centro', type: 'entertainment', pos: { r: 70, a: 160 }, desc: 'Um mundo famoso por sua arte e entretenimento (teatros de holodrama, arenas de gladiadores).', cities: 'Distrito do Néon, Arena de Titãs', population: '320 Bilhões', status: 'ATIVO' },
  { id: 'hedria', name: 'Hédria', region: 'Centro Galáctico', rk: 'centro', type: 'tech', pos: { r: 95, a: 240 }, desc: 'Sede das maiores universidades e centros de pesquisa científica da galáxia.', cities: 'O Campus, Torre de Marfim', population: '2.5 Bilhões', status: 'ESTÁVEL' },
  { id: 'oricalco', name: 'Oricalco', region: 'Centro Galáctico', rk: 'centro', type: 'mining', pos: { r: 85, a: 100 }, desc: 'Um planeta cuja economia gira em torno da extração do raro metal Oricalco, vital para a tecnologia de ponta.', cities: 'Cadinho, Cidade do Veio', population: '1.2 Bilhões', status: 'MINERAÇÃO' },
  { id: 'benedonis', name: 'Benedonis', region: 'Centro Galáctico', rk: 'centro', type: 'temple', pos: { r: 85, a: 130 }, desc: 'Um planeta de vasta importância religiosa para várias espécies, com cidades construídas em torno de locais sagrados.', cities: 'Terra Santa, Mosteiro da Estrela-Guia', population: '18 Bilhões', status: 'SAGRADO' },
  { id: 'astris', name: 'Astris', region: 'Centro Galáctico', rk: 'centro', type: 'shipyard', pos: { r: 80, a: 250 }, desc: 'Um mundo de observatórios gigantes e estaleiros de naves de luxo.', cities: 'Cúpula do Astrônomo, Doca de Prestígio', population: '800 Milhões', status: 'ESTÁVEL' },
  { id: 'sideros', name: 'Sideros', region: 'Centro Galáctico', rk: 'centro', type: 'industrial', pos: { r: 75, a: 140 }, desc: 'Um mundo artificial construído a partir de asteroides fundidos, agora uma metrópole vertical e labiríntica.', cities: 'Cratera Central, Espiral de Ferro', population: '180 Bilhões', status: 'INDUSTRIAL' },
  { id: 'itaca', name: 'Ítaca', region: 'Centro Galáctico', rk: 'centro', type: 'shipyard', pos: { r: 90, a: 260 }, desc: 'Famoso por suas academias de pilotos e estaleiros orbitais, onde as frotas comerciais são construídas.', cities: 'Doca Ulisses, Academia de Navegadores', population: '4.2 Bilhões', status: 'ESTÁVEL' },
  { id: 'damasco', name: 'Damasco', region: 'Centro Galáctico', rk: 'centro', type: 'market', pos: { r: 70, a: 180 }, desc: 'Um planeta-mercado especializado em armas e equipamentos de luxo para a elite.', cities: 'A Bigorna, Salão da Lâmina', population: '12 Bilhões', status: 'COMERCIAL' },
  { id: 'zennlar', name: 'Zennlar', region: 'Centro Galáctico', rk: 'centro', type: 'resort', pos: { r: 75, a: 215 }, desc: 'Conhecido por suas paisagens exóticas e resorts de luxo, um destino de férias popular para os cidadãos mais ricos.', cities: 'Baía do Paraíso, Retiro de Cristal', population: '800 Milhões', status: 'TURISMO' },
  { id: 'pergamo', name: 'Pérgamo Maior', region: 'Centro Galáctico', rk: 'centro', type: 'library', pos: { r: 80, a: 280 }, desc: 'Um mundo-biblioteca, onde o conhecimento de toda a galáxia é armazenado em vastos bancos de dados.', cities: 'O Grande Arquivo, Scriptorium', population: '120 Milhões', status: 'PROTEGIDO' },
  { id: 'elisio', name: 'Elísio', region: 'Centro Galáctico', rk: 'centro', type: 'resort', pos: { r: 95, a: 320 }, desc: 'Um oásis de calma, um planeta de cidades planejadas e parques extensos, lar de diplomatas e aposentados abastados.', cities: 'Vila Serena, Retiro do Embaixador', population: '3 Bilhões', status: 'ESTÁVEL' },
  { id: 'kythera', name: 'Kythera', region: 'Centro Galáctico', rk: 'centro', type: 'gas_giant', pos: { r: 90, a: 300 }, desc: 'Um gigante gasoso com cidades flutuantes, um centro vital para o refino de combustíveis raros.', cities: 'Plataforma Hélio-3, Refinaria de Bóreas', population: '85 Milhões', status: 'PRODUÇÃO' },
  { id: 'shabazz', name: 'Shabazz VII', region: 'Centro Galáctico', rk: 'centro', type: 'desert', pos: { r: 95, a: 20 }, desc: 'Um mundo árido com uma cultura rica, famoso por suas especiarias raras e têxteis exóticos.', cities: 'Mercado de Areia, Oásis do Profeta', population: '14 Bilhões', status: 'ESTÁVEL' },
  { id: 'zoidra', name: 'Zoidra', region: 'Centro Galáctico', rk: 'centro', type: 'industrial', pos: { r: 70, a: 110 }, desc: 'Um berço da inovação em engenharia, onde a metrópole Korningrade sobrevive a uma brutal estação de chuvas canalizando as inundações através de um majestoso sistema de comportas.', cities: 'Korningrade, Cidadela da Comporta', population: '210 Bilhões', status: 'ESSENCIAL' },

  // SEÇÃO 3: COLÔNIAS INTERNAS (R ~ 140)
  { id: 'ferria', name: 'Ferria', region: 'Colônias Internas', rk: 'internas', type: 'forge', pos: { r: 135, a: 80 }, desc: 'O maior mundo-forja da galáxia, produzindo 60% de todo o aço.', cities: 'Colmeia Stakhanov, Forja 01', population: '45 Bilhões', status: 'PRODUÇÃO' },
  { id: 'agria', name: 'Agria', region: 'Colônias Internas', rk: 'internas', type: 'agriculture', pos: { r: 145, a: 50 }, desc: 'Um "celeiro" da galáxia, coberto por campos de cultivo geneticamente modificados.', cities: 'Campo Dourado, Silo 17', population: '8.4 Bilhões', status: 'PRODUÇÃO' },
  { id: 'molbrax', name: 'Mólbrax', region: 'Colônias Internas', rk: 'internas', type: 'mining', pos: { r: 135, a: 210 }, desc: 'Um planeta de mineração de rocha bruta, fundamental para a construção.', cities: 'A Pedreira, Veio Profundo', population: '1.5 Bilhões', status: 'MINERAÇÃO' },
  { id: 'avernus', name: 'Avernus', region: 'Colônias Internas', rk: 'internas', type: 'vulcanic', pos: { r: 145, a: 15 }, desc: 'Um mundo vulcânico que gera energia geotérmica para dezenas de colônias.', cities: 'Caldeira, Geotérmica-9', population: '400 Milhões', status: 'ESTÁVEL' },
  { id: 'golgota', name: 'Gólgota', region: 'Colônias Internas', rk: 'internas', type: 'salvage', pos: { r: 145, a: 180 }, desc: 'O principal centro de reciclagem de naves e tecnologia obsoleta da galáxia.', cities: 'O Desmanche, Mausoléu de Aço', population: '2.8 Bilhões', status: 'INDUSTRIAL' },
  { id: 'montshare', name: 'Mont\'share', region: 'Colônias Internas', rk: 'internas', type: 'standard', pos: { r: 150, a: 345 }, desc: 'Uma colônia "normal", conhecida por sua topografia montanhosa e comunidades isoladas.', cities: 'Pico da Viúva, Vale do Eco', population: '1.2 Bilhões', status: 'ESTÁVEL' },
  { id: 'estigia', name: 'Estígia', region: 'Colônias Internas', rk: 'internas', type: 'toxic', pos: { r: 140, a: 260 }, desc: 'Um mundo industrial focado na produção química, com rios de resíduos tóxicos.', cities: 'Porto Fétido, Refinaria Alquímica', population: '3.4 Bilhões', status: 'POLUÍDO' },
  { id: 'lethe', name: 'Lethe', region: 'Colônias Internas', rk: 'internas', type: 'prison', pos: { r: 135, a: 130 }, desc: 'O maior planeta-prisão das Colônias, onde os condenados trabalham em minas e fábricas poluentes.', cities: 'O Lamento, Bloco Penitenciário 9', population: '150 Milhões', status: 'RIGOR EXTREMO' },
  { id: 'hesperides', name: 'Hespérides', region: 'Colônias Internas', rk: 'internas', type: 'jungle', pos: { r: 155, a: 200 }, desc: 'Um mundo de selvas luxuriantes, focado na pesquisa xenobiológica e colheita de compostos farmacêuticos.', cities: 'Posto Avançado Éden, Laboratório Serpentário', population: '450 Milhões', status: 'PESQUISA' },
  { id: 'volgodo', name: 'Vólgodo', region: 'Colônias Internas', rk: 'internas', type: 'industrial', pos: { r: 165, a: 310 }, desc: 'Uma colônia fria e industrial, onde a população operária trabalha em vastos complexos de manufatura.', cities: 'Tecno-Santuário, Linha de Montagem 21', population: '12 Bilhões', status: 'PRODUÇÃO' },
  { id: 'concordia', name: 'Concordia', region: 'Colônias Internas', rk: 'internas', type: 'standard', pos: { r: 145, a: 335 }, desc: 'Uma colônia padrão com um ecossistema equilibrado, servindo como um centro populacional para os trabalhadores das colônias vizinhas.', cities: 'Boa Vizinhança, Encruzilhada do Trabalhador', population: '22 Bilhões', status: 'ESTÁVEL' },
  { id: 'beladona', name: 'Beladona', region: 'Colônias Internas', rk: 'internas', type: 'garden', pos: { r: 155, a: 10 }, desc: 'Um planeta-jardim onde cada planta é venenosa. Sua indústria é a produção dos mais potentes venenos e antídotos.', cities: 'Cúpula de Vidro, Estufa Letal', population: '80 Milhões', status: 'RISCO BIO' },
  { id: 'xessor', name: 'Xessor Sanctum', region: 'Colônias Internas', rk: 'internas', type: 'monastic', pos: { r: 135, a: 345 }, desc: 'Um mundo monástico que, apesar de tranquilo, é um grande produtor de vinhos e alimentos de luxo.', cities: 'O Vinhedo, Abadia da Colheita', population: '120 Milhões', status: 'PROTEGIDO' },
  { id: 'crisol_int', name: 'Crisol (Internas)', region: 'Colônias Internas', rk: 'internas', type: 'test_site', pos: { r: 150, a: 95 }, desc: 'Um planeta geologicamente instável usado pelas corporações para testar e demonstrar novos armamentos para o mercado consumidor.', cities: 'Campo de Provas, Zona de Impacto', population: '45 Mil (Técnicos)', status: 'INSTÁVEL' },
  { id: 'oficio', name: 'Ofício', region: 'Colônias Internas', rk: 'internas', type: 'tech', pos: { r: 140, a: 60 }, desc: 'Uma colônia de artesãos e engenheiros especializados, focada na produção de componentes de alta tecnologia.', cities: 'A Guilda, Cidadela da Precisão', population: '1.2 Bilhões', status: 'ATIVO' },
  { id: 'acheron', name: 'Acheron', region: 'Colônias Internas', rk: 'internas', type: 'mining', pos: { r: 140, a: 310 }, desc: 'Um mundo sombrio e rochoso, a principal fonte de minérios pesados usados nos reatores das naves.', cities: 'Mina Profunda, Porto de Carvão', population: '800 Milhões', status: 'MINERAÇÃO' },
  { id: 'tithoul_int', name: 'Tithoul (Internas)', region: 'Colônias Internas', rk: 'internas', type: 'swamp', pos: { r: 140, a: 330 }, desc: 'Um mundo pantanoso, cuja principal exportação são gases raros e compostos orgânicos extraídos de sua atmosfera.', cities: 'Plataforma de Gás, Vila do Pântano', population: '120 Milhões', status: 'PRODUÇÃO' },
  { id: 'axion', name: 'Axion', region: 'Colônias Internas', rk: 'internas', type: 'standard', pos: { r: 135, a: 245 }, desc: 'Uma colônia normal e bem estabelecida, servindo como um centro administrativo para um aglomerado de mundos de produção.', cities: 'Marco Zero, Vigília do Governador', population: '18 Bilhões', status: 'ESTÁVEL' },
  { id: 'caliba', name: 'Calibã', region: 'Colônias Internas', rk: 'internas', type: 'hunting', pos: { r: 135, a: 165 }, desc: 'Uma colônia que vive da exportação de peles e amostras de sua megafauna perigosa.', cities: 'Fortaleza dos Caçadores, Aldeia da Presa', population: '300 Milhões', status: 'PERIGOSO' },
  { id: 'drundaia', name: 'Drundaia', region: 'Colônias Internas', rk: 'internas', type: 'hive', pos: { r: 135, a: 120 }, desc: 'Um planeta independente de fachada opulenta, que atrai todas as raças da galáxia. Sociedade dividida em cidades-colmeia verticais.', cities: 'Aurória, Aerthos', population: '160 Bilhões', status: 'SOCIAL_TENSÃO' },

  // SEÇÃO 4: COLÔNIAS EXPANSIONISTAS (R ~ 185)
  { id: 'bastilha', name: 'Bastilha', region: 'Colônias Expansionistas', rk: 'expansionistas', type: 'fortress', pos: { r: 185, a: 40 }, desc: 'O principal ponto de comando da rede de defesa da fronteira. Um mundo-fortaleza com a maior das armas planetárias.', cities: 'Base Vanguarda, O Canhão Estelar', population: '1.2 Bilhões', status: 'MILITAR' },
  { id: 'voragem', name: 'Voragem', region: 'Colônias Expansionistas', rk: 'expansionistas', type: 'test_site', pos: { r: 185, a: 10 }, desc: 'Um mundo de clima extremo usado como base de treinamento para as tropas de choque.', cities: 'Base Quebra-Tempestade, O Olho', population: '800 Mil', status: 'TREINAMENTO' },
  { id: 'augure', name: 'Áugure', region: 'Colônias Expansionistas', rk: 'expansionistas', type: 'intel', pos: { r: 195, a: 320 }, desc: 'Uma base de exploração avançada, focada em enviar missões para o Espaço Desconhecido e analisar dados.', cities: 'Base do Pioneiro, Hangar de Longo Alcance', population: '450 Mil', status: 'ATIVO' },
  { id: 'erebo', name: 'Érebo', region: 'Colônias Expansionistas', rk: 'expansionistas', type: 'intel', pos: { r: 195, a: 20 }, desc: 'A base de escuta da fronteira. Sua arma planetária é, na verdade, um sensor de longo alcance disfarçado.', cities: 'Posto de Escuta Alfa, Base Sombra', population: '12 Mil', status: 'SIGILO' },
  { id: 'porto_traidor', name: 'Portão do Traidor', region: 'Colônias Expansionistas', rk: 'expansionistas', type: 'outpost', pos: { r: 190, a: 345 }, desc: 'Uma base de patrulha e interceptação, responsável por policiar os setores mais anárquicos da fronteira.', cities: 'Base do Executor, Angra do Corsário', population: '300 Mil', status: 'POLICIAMENTO' },
  { id: 'borda_alvorada', name: 'Borda da Alvorada', region: 'Colônias Expansionistas', rk: 'expansionistas', type: 'tech', pos: { r: 195, a: 240 }, desc: 'Uma base de pesquisa e desenvolvimento, onde novas tecnologias de exploração e armas de defesa são testadas.', cities: 'Laboratório da Borda, Forja Experimental', population: '120 Mil', status: 'PESQUISA' },
  { id: 'sitio_keter', name: 'Sítio Keter', region: 'Colônias Expansionistas', rk: 'expansionistas', type: 'anomaly', pos: { r: 175, a: 110 }, desc: 'Uma base construída em torno de uma colossal estrutura alienígena, estudada secretamente pelo governo.', cities: 'Base Monólito, Sítio de Escavação', population: '400 Mil', status: 'QUARENTENA' },
  { id: 'ultimo_porto', name: 'Último Porto', region: 'Colônias Expansionistas', rk: 'expansionistas', type: 'edge', pos: { r: 210, a: 210 }, desc: 'A base de lançamento mais distante. Buracos de minhoca artificiais são abertos aqui para enviar sondas para outras galáxias.', cities: 'Base Ponto Final, O Lançador', population: '12 Mil', status: 'MILITAR' },
  { id: 'crisol_mil', name: 'Crisol (Militar)', region: 'Colônias Expansionistas', rk: 'expansionistas', type: 'test_site', pos: { r: 200, a: 120 }, desc: 'Uma base de testes de armamento pesado, onde as armas da rede de defesa planetária são calibradas.', cities: 'Campo de Provas, Zona de Impacto', population: '150 Mil', status: 'TREINAMENTO' },
  { id: 'quimera', name: 'Quimera', region: 'Colônias Expansionistas', rk: 'expansionistas', type: 'jungle', pos: { r: 185, a: 60 }, desc: 'Uma base de pesquisa biológica avançada, estudando formas de vida de fora da galáxia para contramedidas.', cities: 'Laboratório-X, A Gaiola', population: '50 Mil', status: 'RESTRITO' },
  { id: 'genese', name: 'Gênese', region: 'Colônias Expansionistas', rk: 'expansionistas', type: 'standard', pos: { r: 195, a: 80 }, desc: 'Uma base de suporte vital e terraformação, pesquisando formas de tornar mundos inóspitos habitáveis.', cities: 'Cúpula Botânica, Torre de Água', population: '250 Mil', status: 'COLONIZAÇÃO' },
  { id: 'severance', name: 'Severance', region: 'Colônias Expansionistas', rk: 'expansionistas', type: 'fortress', pos: { r: 185, a: 160 }, desc: 'A principal base de treinamento de fuzileiros navais da fronteira.', cities: 'Muro da Doutrina, Campo de Treinamento', population: '1.4 Milhões', status: 'MILITAR' },
  { id: 'tithoul_mil', name: 'Tithoul (Militar)', region: 'Colônias Expansionistas', rk: 'expansionistas', type: 'shipyard', pos: { r: 180, a: 330 }, desc: 'Uma base naval avançada, oculta na atmosfera densa de um gigante gasoso, servindo como ponto de reparo e reabattecimento.', cities: 'Doca Suspensa, Plataforma de Gás', population: '200 Mil', status: 'MILITAR' },
  { id: 'tlilhdul', name: 'Tlilhdul', region: 'Colônias Expansionistas', rk: 'expansionistas', type: 'anomaly', pos: { r: 195, a: 140 }, desc: 'Um planeta morto em quarentena, outrora um centro de clonagem, destruído quando uma entidade primordial desperto.', cities: 'Plataforma Cérbero, Zona Titã', population: '0 (Civil)', status: 'QUARENTENA' },
  { id: 'tartaro', name: 'Tártaro', region: 'Colônias Expansionistas', rk: 'expansionistas', type: 'prison', pos: { r: 185, a: 220 }, desc: 'Um mundo-prisão de alta gravidade, onde os piores criminosos militares operam a arma de defesa planetária.', cities: 'Penitenciária Hades, Forja Última Chance', population: '5 Milhões', status: 'RIGOR EXTREMO' },
  { id: 'auspex', name: 'Auspex', region: 'Colônias Expansionistas', rk: 'expansionistas', type: 'intel', pos: { r: 200, a: 310 }, desc: 'Sede de uma base de inteligência de sinais (SIGINT), dedicada a monitorar o Espaço Desconhecido.', cities: 'Posto de Escuta Profunda, Cúpula do Silêncio', population: '30 Mil', status: 'SIGILO' },
  { id: 'indomitus', name: 'Indomitus', region: 'Colônias Expansionistas', rk: 'expansionistas', type: 'hunting', pos: { r: 190, a: 10 }, desc: 'Uma reserva de caça militarizada. Um mundo de selva letal, usado como campo de treinamento de sobrevivência.', cities: 'Forte da Presa, Arena Z-9', population: '150 Mil', status: 'PERIGOSO' },
  { id: 'prometeus', name: 'Prometeus', region: 'Colônias Expansionistas', rk: 'expansionistas', type: 'industrial', pos: { r: 205, a: 150 }, desc: 'Uma lua estéril convertida em um gigantesco complexo de refino e depósito de combustível.', cities: 'Refinaria Hélio-Delta, Doca de Reabastecimento', population: '1.2 Milhões', status: 'PRODUÇÃO' },
  { id: 'omnith', name: 'Forja de Omnith', region: 'Colônias Expansionistas', rk: 'expansionistas', type: 'forge', pos: { r: 200, a: 260 }, desc: 'O principal planeta forja da galáxia. Especializado em produzir metais resistentes e blindagens de guerra.', cities: 'Arsenal Primus, A Grande Bigorna', population: '65 Bilhões', status: 'VITAL' },
  { id: 'zendar', name: 'Zendar', region: 'Colônias Expansionistas', rk: 'expansionistas', type: 'intel', pos: { r: 195, a: 50 }, desc: 'O principal nexo de comunicações e criptografia da rede de defesa da fronteira.', cities: 'Nexo Cripto, Torre de Transmissão Primus', population: '4 Milhões', status: 'ESSENCIAL' },

  // SEÇÃO 5: VALE CINZENTO (Especiais - R e A custom)
  { id: 'terra', name: 'Terra', region: 'Vale Cinzento', rk: 'vale', type: 'origin', pos: { r: 105, a: 275 }, desc: 'Mundo natal da humanidade, tragicamente congelado após ser transportado para uma realidade sem sol. Os 7 mil sobreviventes vivem em vastos complexos subterrâneos estilo Metro e Frostpunk, protegidos do vácuo mortal na superfície.', cities: 'Setores Subterrâneos (São Paulo, Tóquio, Londres)', population: '7.000', status: 'AGONIZANTE' },
  { id: 'lamento', name: 'Lamento', region: 'Vale Cinzento', rk: 'vale', type: 'toxic', pos: { r: 145, a: 285 }, desc: 'Epicentro da praga psíquica usada na guerra antiga. O planeta é silencioso, mas relata um "eco" de sofrimento psíquico.', cities: 'Cidades-Fantasma (Desconhecidas)', population: '0', status: 'ZONA MORTA' },
  { id: 'anatema', name: 'Anátema', region: 'Vale Cinzento', rk: 'vale', type: 'void', pos: { r: 165, a: 280 }, desc: 'Um mundo onde a realidade foi permanentemente "rasgada". Uma anomalia dimensional estável vigiada pela ORT Archive.', cities: 'Posto de Observação Proibido', population: '0', status: 'ALERTA DIMENSIONAL' },
  { id: 'vossir', name: 'Vossir Sanctum', region: 'Vale Cinzento', rk: 'vale', type: 'monastic', pos: { r: 185, a: 285 }, desc: 'Antigo mundo santuário da Grande Guerra. Todos que pisam aqui nunca mais voltam os mesmos.', cities: 'Basílica do Silêncio', population: 'Desconhecida', status: 'MÍSTICO' },
  { id: 'nullion', name: 'Nullion', region: 'Vale Cinzento', rk: 'vale', type: 'station', pos: { r: 215, a: 280 }, desc: 'Uma lua sem atmosfera, utilizada como posto militar durante a Grande Guerra. Agora inabitada e esquecida.', cities: 'Base Militar Angros-One', population: '0', status: 'ABANDONADO' },

  // SEÇÃO 6: ANOMALIAS / ESPAÇO DESCONHECIDO (R > 220)
  { id: 'galdrion', name: 'Anomalia Galdrion', region: 'Anomalias', rk: 'anomalias', type: 'anomaly', pos: { r: 250, a: 220 }, desc: 'Um buraco negro repentino que emite radiação eletromagnética direta. Vigilância constante pela O.R.T.', cities: 'Estação de Observação O.R.T.', population: '40 (Tripulação)', status: 'OBSERVAÇÃO' },
  { id: 'ort_qg', name: 'O.R.T. QG Espacial', region: 'Espaço Desconhecido', rk: 'desconhecido', type: 'station', pos: { r: 240, a: 110 }, desc: 'Quartel General avançado da Ordem da Realidade e Tempo no Espaço Desconhecido.', cities: 'Setor de Comando, Hangar de Operações', population: 'Desconhecido', status: 'RESTRITO' },
];
window.GALAXY_DB = GALAXY_DB;

const REGION_COLORS = {
  nucleo: '#ff6600',
  centro: '#00e850',
  internas: '#00ff41',
  expansionistas: '#ffb000',
  vale: '#cc66ff',
  anomalias: '#8400ff',
  desconhecido: '#ffffff',
};
window.REGION_COLORS = REGION_COLORS;

const REGION_ANCHORS = {
  'nucleo': { r: 0, a: 0 },
  'centro': { r: 100, a: 45 },
  'internas': { r: 180, a: 180 },
  'expansionistas': { r: 260, a: 300 },
  'vale': { r: 200, a: 150 },
  'anomalias': { r: 290, a: 0 }
};

// Global Expansion Power (Higher = more distance growth on zoom)
const EXPANSION_POWER = 2.2;

// Map State (Moved to module scope for access by all functions)
let scale = 1;
let translateX = 0;
let translateY = 0;
let trackedPlanetId = null;
let isDragging = false;
let startX, startY;
let activeSearchQuery = '';
let hoveredPlanetId = null;
let activeMissionRoute = null; // { startId, endId, path: [] }

// Global DOM references for transform
let mapContainer = null;
let mapZoomGroup = null;

// ── Planet Visualizer (Generative SVG) ───────────────────────
function getPlanetVisualSVG(planet) {
  const color = REGION_COLORS[planet.rk] || '#00ff41';
  const type = planet.type || 'standard';
  const id = planet.id;

  let layers = '';

  // Patterns based on type
  if (type === 'ecumenopolis') {
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * 160 + 40;
      const y = Math.random() * 160 + 40;
      if (Math.sqrt((x - 120) ** 2 + (y - 120) ** 2) < 78)
        layers += `<rect x="${x}" y="${y}" width="${1 + Math.random() * 2}" height="${1 + Math.random() * 2}" fill="#ffffaa" opacity="${0.3 + Math.random() * 0.5}"/>`;
    }
  } else if (type === 'gas_giant') {
    for (let i = 0; i < 6; i++) {
      const h = 5 + Math.random() * 15;
      const y = 80 + i * 15;
      layers += `<rect x="40" y="${y}" width="160" height="${h}" fill="white" opacity="0.1" rx="5"/>`;
    }
  } else if (type === 'jungle' || type === 'garden') {
    for (let i = 0; i < 15; i++) {
      const r = 5 + Math.random() * 15;
      const x = 50 + Math.random() * 140;
      const y = 50 + Math.random() * 140;
      if (Math.sqrt((x - 120) ** 2 + (y - 120) ** 2) < 70)
        layers += `<circle cx="${x}" cy="${y}" r="${r}" fill="#004400" opacity="0.4"/>`;
    }
  } else if (type === 'desert' || type === 'mining') {
    layers += `<path d="M40 120 Q 80 100 120 120 T 200 120" stroke="rgba(255,255,255,0.1)" fill="none" stroke-width="20"/>`;
    layers += `<path d="M40 140 Q 80 120 120 140 T 200 140" stroke="rgba(0,0,0,0.2)" fill="none" stroke-width="15"/>`;
  } else if (type === 'fortress' || type === 'militar') {
    layers += `<circle cx="120" cy="120" r="82" stroke="${color}" fill="none" stroke-width="0.5" stroke-dasharray="10,5" opacity="0.3"/>`;
    layers += `<path d="M120 40 L 120 200 M 40 120 L 200 120" stroke="${color}" stroke-width="0.5" opacity="0.2"/>`;
  } else if (type === 'origin') {
    layers += `<path d="M80 80 Q 70 120 90 160 T 80 200" fill="#22aa44" opacity="0.2"/>`;
    layers += `<path d="M140 90 Q 170 80 190 110 T 170 170" fill="#22aa44" opacity="0.15"/>`;
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 160 + 40;
      const y = Math.random() * 160 + 40;
      if (Math.sqrt((x - 120) ** 2 + (y - 120) ** 2) < 78)
        layers += `<circle cx="${x}" cy="${y}" r="${Math.random() * 2}" fill="white" opacity="0.4"/>`;
    }
  }

  return `
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" class="planet-svg">
      <defs>
        <radialGradient id="grad_${id}" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="${color}" stop-opacity="1"/>
          <stop offset="100%" stop-color="#000"/>
        </radialGradient>
        <linearGradient id="shine_${id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="white" stop-opacity="0.2"/>
          <stop offset="50%" stop-color="white" stop-opacity="0"/>
        </linearGradient>
        <pattern id="scanlines" width="100%" height="4" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="100%" y2="0" stroke="black" stroke-width="1" opacity="0.1"/>
        </pattern>
      </defs>
      
      <!-- Atmosphere / Glow -->
      <circle cx="120" cy="120" r="95" fill="${color}" opacity="0.15">
        <animate attributeName="opacity" values="0.1;0.2;0.1" dur="4s" repeatCount="indefinite" />
      </circle>

      <!-- Main Sphere -->
      <circle cx="120" cy="120" r="80" fill="url(#grad_${id})"/>
      
      <!-- Internal rotating features -->
      <g class="rotating-layer">
        ${layers}
      </g>

      <!-- Shading & Lighting -->
      <circle cx="120" cy="120" r="80" fill="url(#shine_${id})"/>
      <circle cx="120" cy="120" r="80" fill="url(#scanlines)" opacity="0.5"/>
      
      <!-- Outer Ring Decor -->
      <circle cx="120" cy="120" r="85" stroke="${color}" fill="none" stroke-width="0.5" opacity="0.2"/>
    </svg>
  `;
}

// ── App Base HTML ────────────────────────────────────────────
function map() {
  return `
    <div class="map-container">
      <!-- Sidebar for Regions -->
      <aside class="map-sidebar">
        <div class="sidebar-header" style="justify-content: space-between;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:18px">🪐</span>
            <span>ATLAS ESTELAR</span>
          </div>
          <button id="btn-close-map-sidebar" class="btn-close-sidebar" title="Fechar Atlas">×</button>
        </div>
        
        <div class="region-list" id="map-region-list">
          <div class="region-item" data-rk="nucleo">
            <span class="region-dot" style="background:#ff6600"></span>
            <span>Núcleo Galáctico</span>
          </div>
          <div class="region-item" data-rk="centro">
            <span class="region-dot" style="background:#00e850"></span>
            <span>Centro Galáctico</span>
          </div>
          <div class="region-item" data-rk="internas">
            <span class="region-dot" style="background:#00ff41"></span>
            <span>Colônias Internas</span>
          </div>
          <div class="region-item" data-rk="expansionistas">
            <span class="region-dot" style="background:#ffb000"></span>
            <span>Colônias Expansionistas</span>
          </div>
          <div class="region-item" data-rk="vale">
            <span class="region-dot" style="background:#cc66ff"></span>
            <span>Vale Cinzento</span>
          </div>
          <div class="region-item" data-rk="anomalias">
            <span class="region-dot" style="background:#8400ff"></span>
            <span>Anomalias</span>
          </div>
        </div>

        <div class="map-search">
          <input type="text" id="map-search-input" placeholder="LOCALIZAR PLANETA...">
        </div>
      </aside>

      <!-- Map Viewport -->
      <div class="map-viewport" id="map-viewport">
        <svg id="galaxySvg" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="nebulaFilter" x="-50%" y="-50%" width="200%" height="200%">
              <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" seed="5" result="noise" />
              <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.3  0 0 0 1 0.2  0 0 0 0.4 0" result="coloredNoise" />
              <feGaussianBlur in="coloredNoise" stdDeviation="10" result="blur" />
            </filter>
            <radialGradient id="valeGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#cc66ff" stop-opacity="0.2" />
              <stop offset="100%" stop-color="#cc66ff" stop-opacity="0" />
            </radialGradient>
          </defs>

          <!-- Parallax Layers -->
          <g id="map-parallax-far">
            <rect x="-600" y="-600" width="1800" height="1800" fill="url(#valeGrad)" opacity="0.15" filter="url(#nebulaFilter)" />
          </g>
          <g id="map-parallax-mid"></g>
          <g id="map-parallax-near"></g>
          
          <!-- Zoom/Pan Transform Group -->
          <g id="map-zoom-group">
            <g id="map-bg-elements">
              <!-- Region Rings -->
              <circle cx="300" cy="300" r="50" class="map-ring" />
              <circle cx="300" cy="300" r="100" class="map-ring" />
              <circle cx="300" cy="300" r="160" class="map-ring" />
              <circle cx="300" cy="300" r="220" class="map-ring" />
              <circle cx="300" cy="300" r="280" class="map-ring" opacity="0.1" />

              <!-- Vale Cinzento Silhouette -->
              <path id="vale-silhouette" class="vale-silhouette" 
                    fill="url(#valeGrad)" stroke="#cc66ff" stroke-width="1" stroke-dasharray="4,4" opacity="0.6"
                    d="M 300,70 L 415,102 L 345,222 L 300,210 Z" />

              <!-- Terra Sub-sector (Dotted) -->
              <circle cx="309" cy="196" r="25" fill="none" stroke="#00ff41" stroke-width="1" stroke-dasharray="2,2" opacity="0.4" />
            </g>

            <!-- Dynamic Elements Container -->
            <g id="map-mission-routes" pointer-events="none"></g>
            <g id="map-elements"></g>

            <!-- Selection Ring (Track Feedback) -->
            <g id="selection-ring" pointer-events="none" style="display:none;">
              <circle cx="0" cy="0" r="12" fill="none" stroke="#00aaff" stroke-width="2" opacity="0.8">
                <animate attributeName="r" from="8" to="18" dur="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.8" to="0" dur="1s" repeatCount="indefinite" />
              </circle>
              <circle cx="0" cy="0" r="8" fill="none" stroke="#00aaff" stroke-width="1.5" opacity="0.6" />
            </g>

            <!-- Current Location Marker -->
            <g id="current-location-ring" pointer-events="none" style="display:none;">
              <path d="M0, -12 L6, -2 L0, -5 L-6, -2 Z" fill="#ffb000" style="filter:drop-shadow(0 0 3px #ffb000);">
                <animateTransform attributeName="transform" type="translate" values="0,-3; 0,2; 0,-3" dur="2s" repeatCount="indefinite" />
              </path>
              <circle cx="0" cy="0" r="10" fill="none" stroke="#ffb000" stroke-width="1" stroke-dasharray="3,3" opacity="0.8">
                <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="4s" repeatCount="indefinite" />
              </circle>
            </g>
          </g>
        </svg>

        <div class="map-controls">
          <button id="reset-zoom" title="Resetar Zoom">⌂</button>
          <button id="btn-toggle-atlas" class="btn-toggle-atlas" title="Atlas Estelar">🪐 ATLAS</button>
        </div>
      </div>

      <!-- Detail Viewer Overlay -->
      <div id="planet-viewer" class="planet-viewer hidden">
        <div class="viewer-content scan-effect">
          <div class="close-viewer-wrapper">
            <button class="close-viewer" id="close-viewer">×</button>
          </div>
          <div id="viewer-body"></div>
        </div>
      </div>
    </div>
  `;
}

// ── App Initializer ──────────────────────────────────────────
async function initMap() {
  mapContainer = document.getElementById('map-viewport');
  const searchInput = document.getElementById('map-search-input');
  const elementsLayer = document.getElementById('map-elements');
  mapZoomGroup = document.getElementById('map-zoom-group');
  const viewer = document.getElementById('planet-viewer');
  const toggleAtlasBtn = document.getElementById('btn-toggle-atlas');

  if (!elementsLayer || !mapContainer || !mapZoomGroup) return;

  if (toggleAtlasBtn) {
    toggleAtlasBtn.onclick = () => {
      const sidebar = document.querySelector('.map-sidebar');
      if (sidebar) sidebar.classList.toggle('mobile-visible');
    };
  }

  const closeSidebarBtn = document.getElementById('btn-close-map-sidebar');
  if (closeSidebarBtn) {
    closeSidebarBtn.onclick = () => {
      const sidebar = document.querySelector('.map-sidebar');
      if (sidebar) sidebar.classList.remove('mobile-visible');
    };
  }

  renderGalaxy();

  // Auto-detect Active Mission Trajectory
  try {
    const db = Auth.db();
    const user = Auth.getUser();
    if (db && user) {
      const [assignmentRes, profileRes] = await Promise.all([
        db.from('mission_assignments')
          .select('missions(route, target_planet)')
          .eq('user_id', user.id)
          .eq('status', 'accepted')
          .limit(1)
          .maybeSingle(),
        db.from('profiles').select('current_planet').eq('id', user.id).maybeSingle()
      ]);

      const assignment = assignmentRes.data;
      const profile = profileRes.data;

      // Helper to match planet from key (ID or Name)
      const findPlanet = (key) => key ? GALAXY_DB.find(p =>
        p.id.toLowerCase() === key.toLowerCase() ||
        p.name.toLowerCase() === key.toLowerCase()
      ) : null;

      if (assignment && assignment.missions) {
        const m = assignment.missions;
        const destKey = m.target_planet || m.route;
        const originKey = profile?.current_planet || 'capitolio';

        const startPlanet = findPlanet(originKey);
        const endPlanet = findPlanet(destKey);

        if (startPlanet && endPlanet && startPlanet.id !== endPlanet.id) {
          console.log(`[MAP] Auto-detecting mission trajectory: ${startPlanet.name} -> ${endPlanet.name}`);
          setMissionRoute(startPlanet.id, endPlanet.id);
        } else {
          // Arrived or invalid: Clear any previous route
          console.log("[MAP] User at mission destination or no valid route. Clearing trajectory.");
          setMissionRoute(null, null);
        }
      } else {
        setMissionRoute(null, null);
      }
    }
  } catch (e) {
    console.error("[MAP] ERROR AUTO-DETECTING MISSION:", e);
  }

  // Generate Stardust
  const parallaxMid = document.getElementById('map-parallax-mid');
  if (parallaxMid && parallaxMid.children.length === 0) {
    for (let i = 0; i < 60; i++) {
      const star = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      star.setAttribute('cx', Math.random() * 600);
      star.setAttribute('cy', Math.random() * 600);
      star.setAttribute('r', 0.4 + Math.random() * 1.2);
      star.setAttribute('fill', Math.random() > 0.85 ? '#88ffff' : 'white');
      star.setAttribute('opacity', 0.1 + Math.random() * 0.4);
      parallaxMid.appendChild(star);
    }
  }

  mapContainer.addEventListener('wheel', e => {
    e.preventDefault();
    const zoomSpeed = 0.12;
    const delta = e.deltaY > 0 ? (1 - zoomSpeed) : (1 + zoomSpeed);
    const newScale = scale * delta;

    if (newScale > 0.4 && newScale < 30) {
      // Zoom relative to center if tracking, else mouse
      const rect = mapContainer.getBoundingClientRect();
      const focusX = trackedPlanetId ? (rect.width / 2) : (e.clientX - rect.left);
      const focusY = trackedPlanetId ? (rect.height / 2) : (e.clientY - rect.top);

      translateX = focusX - (focusX - translateX) * delta;
      translateY = focusY - (focusY - translateY) * delta;

      scale = newScale;
      updateTransform();
    }
  }, { passive: false });

  mapContainer.addEventListener('mousedown', e => {
    if (e.target.closest('.map-planet-dot')) return;
    isDragging = true;
    trackedPlanetId = null; // Break tracking on manual pan
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    mapContainer.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    updateTransform();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    if (mapContainer) mapContainer.style.cursor = 'default';
  });

  document.getElementById('reset-zoom')?.addEventListener('click', () => {
    scale = 1;
    translateX = 0;
    translateY = 0;
    trackedPlanetId = null;
    updateTransform();
  });

  // Search Logic
  searchInput?.addEventListener('input', e => {
    activeSearchQuery = e.target.value.toLowerCase();
    updateTransform();
  });

  // Region Highlight
  document.querySelectorAll('.region-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      const rk = item.dataset.rk;
      document.querySelectorAll('.map-planet-dot').forEach((dot, i) => {
        if (GALAXY_DB[i].rk !== rk) dot.style.opacity = '0.2';
      });
    });
    item.addEventListener('mouseleave', () => {
      document.querySelectorAll('.map-planet-dot').forEach(dot => dot.style.opacity = '1');
    });
  });

  document.getElementById('close-viewer')?.addEventListener('click', () => viewer.classList.add('hidden'));

  document.addEventListener('click', e => {
    const btn = e.target.closest('#follow-planet');
    if (btn) {
      trackedPlanetId = btn.dataset.id;

      // Immediate visual feedback
      btn.innerHTML = '✓ SEGUINDO';
      btn.style.background = '#00aaff';
      btn.style.color = '#fff';

      updateTransform();
    }
  });

  updateTransform(); // Ensure initial state (and pre-set routes) are rendered
}

async function updateTransform() {
  if (!mapZoomGroup) return;

  // If tracking a planet, center on it
  if (trackedPlanetId) {
    updateTracking();
  }

  mapZoomGroup.setAttribute('transform', `translate(${translateX}, ${translateY}) scale(${scale})`);

  // Unified Elastic Expansion
  const expansion = Math.pow(scale, EXPANSION_POWER - 1);
  const bgElements = document.getElementById('map-bg-elements');
  if (bgElements) {
    bgElements.setAttribute('transform', `translate(${(1 - expansion) * 300}, ${(1 - expansion) * 300}) scale(${expansion})`);
  }

  // Parallax background movement (Normalized by scale to prevent drift at high zoom)
  const parallaxFar = document.getElementById('map-parallax-far');
  const parallaxMid = document.getElementById('map-parallax-mid');
  if (parallaxFar) parallaxFar.setAttribute('transform', `translate(${(translateX * 0.05) / scale}, ${(translateY * 0.05) / scale})`);
  if (parallaxMid) parallaxMid.setAttribute('transform', `translate(${(translateX * 0.15) / scale}, ${(translateY * 0.15) / scale})`);

  await updateGalaxyPositions(scale);
  if (typeof updateMissionRoutes === 'function') {
    updateMissionRoutes(scale);
  }
}

function updateTracking() {
  if (!mapContainer) return;
  const planet = GALAXY_DB.find(p => p.id === trackedPlanetId);
  if (!planet) {
    trackedPlanetId = null;
    return;
  }

  const expansion = Math.pow(scale, EXPANSION_POWER - 1);
  const rad = (planet.pos.a * Math.PI) / 180;
  const px = 300 + (planet.pos.r * expansion) * Math.cos(rad);
  const py = 300 + (planet.pos.r * expansion) * Math.sin(rad);

  // Center viewport on expanded coords (300, 300 is SVG center)
  const rect = mapContainer.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  translateX = centerX - px * scale;
  translateY = centerY - py * scale;
}

function renderGalaxy() {
  const layer = document.getElementById('map-elements');
  if (!layer) return;
  layer.innerHTML = '';

  GALAXY_DB.forEach(p => {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', 'planet-node');

    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('r', '4');
    dot.setAttribute('fill', REGION_COLORS[p.rk] || '#00ff41');
    dot.setAttribute('class', 'map-planet-dot');
    dot.setAttribute('filter', 'url(#glow)');
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('class', 'map-planet-label');
    // Auto-close sidebar on mobile after clicking a planet
    dot.onclick = () => {
      const sidebar = document.querySelector('.map-sidebar');
      if (sidebar && window.innerWidth <= 800) sidebar.classList.remove('mobile-visible');
      openPlanetViewer(p.id);
    };
    label.textContent = p.name;

    // Hover Events for Labels
    dot.addEventListener('mouseenter', () => {
      hoveredPlanetId = p.id;
      updateTransform();
    });
    dot.addEventListener('mouseleave', () => {
      hoveredPlanetId = null;
      updateTransform();
    });

    group.appendChild(dot);
    group.appendChild(label);
    layer.appendChild(group);
  });

  // Initial position update
  updateGalaxyPositions(1);
}

async function updateGalaxyPositions(scale) {
  const nodes = document.querySelectorAll('.planet-node');
  const ring = document.getElementById('selection-ring');
  const locRing = document.getElementById('current-location-ring');
  if (nodes.length === 0) return;

  const expansion = Math.pow(scale, EXPANSION_POWER - 1);
  const profile = typeof Auth !== 'undefined' ? await Auth.getProfile() : null;
  const currentLoc = profile ? profile.current_planet : null;
  let locFound = false;

  GALAXY_DB.forEach((p, i) => {
    const currentR = p.pos.r * expansion;
    const currentA = p.pos.a;

    const rad = (currentA * Math.PI) / 180;
    const x = 300 + currentR * Math.cos(rad);
    const y = 300 + currentR * Math.sin(rad);

    // Update tracking ring if this is the tracked planet
    if (trackedPlanetId === p.id && ring) {
      ring.style.display = 'block';
      let ringScale = Math.max(0.6, 1 / Math.sqrt(scale));
      ring.setAttribute('transform', `translate(${x}, ${y}) scale(${ringScale})`);
    }

    // Update current location ring if this is the current planet
    if (currentLoc && (p.id.toLowerCase() === currentLoc.toLowerCase() || p.name.toLowerCase() === currentLoc.toLowerCase()) && locRing) {
      locRing.style.display = 'block';
      locFound = true;
      let locScale = Math.max(0.6, 1 / Math.sqrt(scale));
      locRing.setAttribute('transform', `translate(${x}, ${y}) scale(${locScale})`);
    }

    const node = nodes[i];
    const dot = node.querySelector('.map-planet-dot');
    const label = node.querySelector('.map-planet-label');

    // Search Visibilty
    const isSearchMatch = activeSearchQuery && p.name.toLowerCase().includes(activeSearchQuery);
    const isSearchActive = activeSearchQuery.length > 0;

    if (dot) {
      dot.setAttribute('cx', x);
      dot.setAttribute('cy', y);
      const dotSize = Math.max(1.5, 4 / Math.sqrt(scale));
      dot.setAttribute('r', dotSize);

      // Dim dots if search is active and not a match
      dot.style.opacity = (isSearchActive && !isSearchMatch) ? '0.15' : '1';
      dot.style.pointerEvents = (isSearchActive && !isSearchMatch) ? 'none' : 'auto';
    }

    if (label) {
      // Dynamic Readability & Visibility
      const labelScale = Math.max(0.4, 1.2 / Math.sqrt(scale));
      const zoomOpacity = scale < 1.8 ? 0 : (scale - 1.8) * 1.5;

      // Override: Show label always if it's a search match OR hovered
      const isHovered = hoveredPlanetId === p.id;
      const finalOpacity = (isSearchMatch || isHovered) ? 0.9 : Math.min(0.8, zoomOpacity);

      label.style.opacity = finalOpacity;
      label.style.fontSize = `${labelScale * 10}px`;
      label.style.textShadow = '0 0 3px rgba(0,0,0,0.8)';
      label.style.filter = 'drop-shadow(0px 0px 2px rgba(0,255,65,0.5))';

      // Boundary Awareness (Clipping logic)
      // Viewbox is 600 wide. 490+ is near right edge
      const isNearRightEdge = x > 490;
      const labelOffset = 10 / scale;

      if (isNearRightEdge) {
        label.setAttribute('text-anchor', 'end');
        label.setAttribute('x', x - labelOffset);
      } else {
        label.setAttribute('text-anchor', 'start');
        label.setAttribute('x', x + labelOffset);
      }
      label.setAttribute('y', y + (4 / scale));
    }
  });

  if (!trackedPlanetId && ring) {
    ring.style.display = 'none';
  }
  if (!locFound && locRing) {
    locRing.style.display = 'none';
  }
}

async function openPlanetViewer(id) {
  const planet = GALAXY_DB.find(p => p.id === id);
  const viewer = document.getElementById('planet-viewer');
  const body = document.getElementById('viewer-body');
  if (!planet || !viewer || !body) return;

  // Dynamic GIF detect with auto-fallback
  const gifUrl = `assets/planets/${planet.name}.gif`;

  // Conditional Styles for specific planets (e.g. ORT QG) to match retro aesthetic
  // Instead of transform: scale which breaks container bounds, we use strong filters and crisp-edges
  const customImgStyle = planet.id === 'ort_qg' ? 'image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges; image-rendering: pixelated; width: 100%; height: 100%; object-fit: contain; filter: contrast(1.5) sepia(0.5) hue-rotate(85deg) drop-shadow(0 0 5px rgba(0,255,0,0.5));' : '';

  // We use a temporary container to render the image and check for errors
  const visualContent = `
    <div class="planet-visual-container">
      <img src="${gifUrl}" 
           class="planet-gif-visual" 
           style="${customImgStyle}"
           alt="${planet.name}" 
           onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
      <div class="planet-svg-fallback" style="display:none;">
        ${getPlanetVisualSVG(planet)}
      </div>
    </div>
  `;

  body.innerHTML = `
    <div class="planet-detail-view">
      <div class="detail-header">
        <div class="p-visual">${visualContent}</div>
        <div class="p-main-info">
          <div style="display:flex; justify-content:space-between; align-items:center;">
             <h2 style="margin:0">${planet.name}</h2>
             <button id="follow-planet" class="btn-follow ${trackedPlanetId === planet.id ? 'active' : ''}" data-id="${planet.id}" 
                     style="background: ${trackedPlanetId === planet.id ? '#00aaff' : 'rgba(0, 150, 255, 0.2)'}; 
                            border: 1px solid #00aaff; 
                            color: ${trackedPlanetId === planet.id ? '#fff' : '#00aaff'}; 
                            padding: 4px 10px; cursor: pointer; border-radius: 2px; font-size: 11px; font-weight: bold; text-transform: uppercase; transition: 0.2s;">
                ${trackedPlanetId === planet.id ? '✓ SEGUINDO' : '📍 SEGUIR'}
             </button>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:10px;">
             <div class="header-tags" style="display:flex; flex-direction:column; gap:5px;">
               <div class="region-tag" style="border-color:${REGION_COLORS[planet.rk]}; font-size:10px; padding:4px 12px; height:auto; display:inline-block; color:${REGION_COLORS[planet.rk]}; width:fit-content; white-space:nowrap;">
                 ${planet.region}
               </div>
               <div class="status-tag ${planet.status.toLowerCase()}" style="font-size:10px; padding:2px 0; margin:0; opacity:0.8; height:auto; display:block;">
                 ${planet.status}
               </div>
             </div>
             ${window._mapSelectMode ?
      `<button id="set-travel-destination" class="btn" data-id="${planet.id}" 
                        style="font-size:11px; padding:8px 18px; border-color:var(--green); color:var(--green); margin:0;">
                  [ DEFINIR DESTINO ]
                </button>` : ''}
          </div>
        </div>
      </div>
      
      <div class="detail-body">
        <div class="detail-section">
          <h3>&gt; DESCRIÇÃO DO SETOR</h3>
          <p>${planet.desc}</p>
        </div>
        
        <div class="detail-section">
           <h3>&gt; DADOS TÉCNICOS</h3>
           <div class="detail-grid">
              <div class="detail-item">
                <label>POPULAÇÃO</label>
                <span>${planet.population}</span>
              </div>
              <div class="detail-item">
                <label>AFILIAÇÃO</label>
                <span>GOVERNO GALÁCTICO</span>
              </div>
              <div class="detail-item">
                <label>TIPO PLANETÁRIO</label>
                <span>${planet.type.toUpperCase()}</span>
              </div>
              <div class="detail-item">
                <label>CIDADES PRINCIPAIS</label>
                <span style="font-size:11px">${planet.cities}</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  `;

  viewer.classList.remove('hidden');
  if (window.Boot && Boot.playBeep) Boot.playBeep(440, 0.05, 0.1);

  // Add listener for travel destination button
  const destBtn = document.getElementById('set-travel-destination');
  if (destBtn) {
    destBtn.onclick = (e) => {
      e.preventDefault(); e.stopPropagation();
      console.log("[MAP] Definir Destino click handler for:", planet.id);
      if (window.Apps && Apps.setCustomVoyageDestination) {
        Apps.setCustomVoyageDestination(planet.id);
        viewer.classList.add('hidden');
        if (window.Desktop && Desktop.closeApp) Desktop.closeApp('map');
      } else {
        console.error("[MAP] Erro: Apps.setCustomVoyageDestination não existe.");
      }
    };
  }
}

// ── Route Logic ──────────────────────────────────────────────
function calculateGalacticRoute(startId, endId) {
  const start = GALAXY_DB.find(p => p.id === startId || p.name.toLowerCase() === startId.toLowerCase());
  const end = GALAXY_DB.find(p => p.id === endId || p.name.toLowerCase() === endId.toLowerCase());
  if (!start || !end) return [];

  let path = [start];
  let current = start;

  for (let i = 0; i < 20; i++) {
    if (getDist(current, end) < 15) {
      if (current.id !== end.id) path.push(end);
      break;
    }

    const MAX_JUMP = 85;
    let neighbors = GALAXY_DB.filter(p => !path.find(node => node.id === p.id));

    // Select candidates within a natural "jump range"
    let candidates = neighbors.filter(p => getDist(current, p) <= MAX_JUMP);

    // If no neighbors nearby, look further (long-range jump)
    if (candidates.length === 0) candidates = neighbors;

    candidates.sort((a, b) => {
      const dCurrA = getDist(current, a);
      const dCurrB = getDist(current, b);
      const dEndA = getDist(a, end);
      const dEndB = getDist(b, end);

      const penaltyA = (a.rk === 'vale' && end.rk !== 'vale') ? 500 : 0;
      const penaltyB = (b.rk === 'vale' && end.rk !== 'vale') ? 500 : 0;

      // Balanced Heuristic: Minimize total predicted cost
      // Progress towards end (1.0) + Cost of current jump (1.0)
      return (dEndA + dCurrA + penaltyA) - (dEndB + dCurrB + penaltyB);
    });

    if (candidates.length > 0) {
      current = candidates[0];
      path.push(current);
    } else {
      break;
    }
  }
  return path;
}

function getDist(p1, p2) {
  const rad1 = (p1.pos.a * Math.PI) / 180;
  const x1 = p1.pos.r * Math.cos(rad1);
  const y1 = p1.pos.r * Math.sin(rad1);
  const rad2 = (p2.pos.a * Math.PI) / 180;
  const x2 = p2.pos.r * Math.cos(rad2);
  const y2 = p2.pos.r * Math.sin(rad2);
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

/**
 * Geometric check: Does the line segment between p1 and p2 intersect 
 * the 'Vale Cinzento' polygon silhouette?
 */
function pathIntersectsVale(p1, p2) {
  // Polygon vertices in SVG coordinates (from path d="M 300,70 L 415,102 L 345,222 L 300,210 Z")
  const polygon = [
    { x: 300, y: 70 },
    { x: 415, y: 102 },
    { x: 345, y: 222 },
    { x: 300, y: 210 }
  ];

  // Helper: Convert Polar (Planet) to SVG-ish coords (at scale 1)
  const toXY = (p) => {
    const rad = (p.pos.a * Math.PI) / 180;
    return {
      x: 300 + p.pos.r * Math.cos(rad),
      y: 300 + p.pos.r * Math.sin(rad)
    };
  };

  const a = toXY(p1);
  const b = toXY(p2);

  const intersects = (a, b, c, d) => {
    const det = (b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x);
    if (det === 0) return false;
    const lambda = ((d.y - c.y) * (d.x - a.x) + (c.x - d.x) * (d.y - a.y)) / det;
    const gamma = ((a.y - b.y) * (d.x - a.x) + (b.x - a.x) * (d.y - a.y)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  };

  // Check against all 4 edges of the polygon
  for (let i = 0; i < polygon.length; i++) {
    const p3 = polygon[i];
    const p4 = polygon[(i + 1) % polygon.length];
    if (intersects(a, b, p3, p4)) return true;
  }

  // Also check if midpoint is inside (standard point-in-polygon)
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    if (((polygon[i].y > mid.y) !== (polygon[j].y > mid.y)) &&
      (mid.x < (polygon[j].x - polygon[i].x) * (mid.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x)) {
      inside = !inside;
    }
  }
  return inside;
}

// ── Route Logic (A* Implementation) ─────────────────────────
function calculateGalacticRoute(startId, endId, customMaxJump) {
  const start = GALAXY_DB.find(p => p.id === startId || p.name.toLowerCase() === startId.toLowerCase());
  const end = GALAXY_DB.find(p => p.id === endId || p.name.toLowerCase() === endId.toLowerCase());
  if (!start || !end) return [];

  const MAX_JUMP = customMaxJump || 100; // Increased base jump for better connectivity

  // Priority Queue nodes: { planet, cost, heuristic, parent }
  let openSet = [{ planet: start, g: 0, h: getDist(start, end), parent: null }];
  let closedSet = new Set();

  while (openSet.length > 0) {
    openSet.sort((a, b) => (a.g + a.h) - (b.g + b.h));
    const current = openSet.shift();

    if (current.planet.id === end.id) {
      let path = [];
      let temp = current;
      while (temp) {
        path.unshift(temp.planet);
        temp = temp.parent;
      }
      return path;
    }

    closedSet.add(current.planet.id);

    // Neighbors: Planets within MAX_JUMP range
    const neighbors = GALAXY_DB.filter(p => {
      if (closedSet.has(p.id)) return false;
      const d = getDist(current.planet, p);
      if (d > MAX_JUMP) return false;
      return true;
    });

    for (let neighbor of neighbors) {
      let jumpCost = getDist(current.planet, neighbor);

      // Penalty for Vale Cinzento intersection (unless destination is there)
      if (neighbor.id !== end.id && pathIntersectsVale(current.planet, neighbor)) {
        jumpCost += 1000;
      }

      const gScore = current.g + Math.pow(jumpCost, 1.2);
      let existing = openSet.find(n => n.planet.id === neighbor.id);
      if (!existing) {
        openSet.push({ planet: neighbor, g: gScore, h: getDist(neighbor, end), parent: current });
      } else if (gScore < existing.g) {
        existing.g = gScore;
        existing.parent = current;
      }
    }
  }

  // If no path found with MAX_JUMP, try one last time with a massive jump (Emergency Fallback)
  if (!customMaxJump && MAX_JUMP < 500) {
    console.warn(`[MAP] No path found with ${MAX_JUMP}, retrying with 500...`);
    return calculateGalacticRoute(startId, endId, 500);
  }

  return [];
}

function updateMissionRoutes(scale) {
  const layer = document.getElementById('map-mission-routes');
  if (!layer) return;
  layer.innerHTML = '';
  if (!activeMissionRoute || activeMissionRoute.path.length < 2) return;

  const expansion = Math.pow(scale, EXPANSION_POWER - 1);
  let points = [];
  activeMissionRoute.path.forEach(p => {
    const rad = (p.pos.a * Math.PI) / 180;
    const x = 300 + (p.pos.r * expansion) * Math.cos(rad);
    const y = 300 + (p.pos.r * expansion) * Math.sin(rad);
    points.push(`${x},${y}`);
  });

  const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  polyline.setAttribute('points', points.join(' '));
  polyline.setAttribute('fill', 'none');
  polyline.setAttribute('stroke', '#00ff41');
  polyline.setAttribute('stroke-width', 3 / Math.sqrt(scale));
  polyline.setAttribute('stroke-dasharray', '6,6');
  polyline.setAttribute('opacity', '0.5');
  polyline.setAttribute('filter', 'drop-shadow(0 0 5px #00ff41)');

  const anim = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
  anim.setAttribute('attributeName', 'stroke-dashoffset');
  anim.setAttribute('from', '120');
  anim.setAttribute('to', '0');
  anim.setAttribute('dur', '8s');
  anim.setAttribute('repeatCount', 'indefinite');
  polyline.appendChild(anim);
  layer.appendChild(polyline);
}

function setMissionRoute(startKey, endKey) {
  if (!startKey || !endKey) {
    activeMissionRoute = null;
    updateTransform();
    return;
  }

  const findPlanet = (key) => GALAXY_DB.find(p =>
    p.id.toLowerCase() === key.toLowerCase() ||
    p.name.toLowerCase() === key.toLowerCase()
  );

  const start = findPlanet(startKey);
  const end = findPlanet(endKey);

  if (start && end) {
    activeMissionRoute = {
      startId: start.id,
      endId: end.id,
      path: calculateGalacticRoute(start.id, end.id)
    };
  } else {
    if (startKey || endKey) {
      console.warn(`[MAP] Could not resolve route planets: ${startKey} -> ${endKey}`, { start, end });
    }
    activeMissionRoute = null;
  }
  updateTransform();
}

// ── Shared API ────────────────────────────────────────────────
window.MapApp = {
  render: map,
  init: initMap,
  setMissionRoute: setMissionRoute,
  calculateGalacticRoute: calculateGalacticRoute,
  updateMissionRoutes: updateMissionRoutes,
  getDist: getDist
};
