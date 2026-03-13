// js/themes.js
// Todas as paletas de cores disponíveis para a apresentação.
// Cada tema expõe: name, desc, preview (5 hex para UI) e C (cores usadas no PPTX).

const THEMES = {

  // ════════════════════════════════════════════════════
  // TEMAS ORIGINAIS
  // ════════════════════════════════════════════════════

  oceano: {
    name:'Oceano', desc:'Azul profundo e cyan — autoridade e clareza',
    preview:['#05080F','#0D1B2F','#0EA5E9','#38BDF8','#A5F3FC'],
    C:{ bg:'0B1628',bg2:'0F1F38',txt:'F4F6FA',muted:'8BA5C8',a1:'1D4ED8',a2:'0EA5E9',a3:'38BDF8',teal:'06B6D4',gold:'F59E0B',danger:'EF4444' }
  },
  aurora: {
    name:'Aurora', desc:'Violeta e rosa — criatividade e impacto',
    preview:['#0A0514','#180833','#7C3AED','#A855F7','#F0ABFC'],
    C:{ bg:'0A0514',bg2:'130829',txt:'F4E6FF',muted:'9B7BB8',a1:'6D28D9',a2:'A855F7',a3:'E879F9',teal:'C026D3',gold:'F59E0B',danger:'EF4444' }
  },
  minimal: {
    name:'Minimal', desc:'Cinza neutro — elegância e sofisticação',
    preview:['#F8F9FA','#FFFFFF','#1C1C1E','#374151','#6B7280'],
    C:{ bg:'F8F9FA',bg2:'FFFFFF',txt:'111827',muted:'6B7280',a1:'1C1C1E',a2:'374151',a3:'4B5563',teal:'374151',gold:'D97706',danger:'DC2626' }
  },
  floresta: {
    name:'Floresta', desc:'Verde escuro e dourado — crescimento e valor',
    preview:['#0A1409','#0F2214','#16A34A','#22C55E','#F59E0B'],
    C:{ bg:'081208',bg2:'0D1B0E',txt:'F0FFF4',muted:'7EA88A',a1:'15803D',a2:'22C55E',a3:'4ADE80',teal:'10B981',gold:'F59E0B',danger:'EF4444' }
  },
  terra: {
    name:'Terra', desc:'Terracota e laranja — calor e solidez',
    preview:['#140A05','#2A1205','#C2410C','#F97316','#FDBA74'],
    C:{ bg:'140A05',bg2:'2A1205',txt:'FFF7ED',muted:'B08070',a1:'B45309',a2:'F97316',a3:'FB923C',teal:'EA580C',gold:'FCD34D',danger:'EF4444' }
  },
  neon: {
    name:'Cibernético', desc:'Azul elétrico e magenta — energia digital e inovação',
    preview:['#0a0a0f','#1a1a2e','#00f5ff','#ff00ff','#a0e7ff'],
    C:{ bg:'0a0a0f',bg2:'1a1a2e',txt:'ffffff',muted:'a0a7b8',a1:'00f5ff',a2:'ff00ff',a3:'a0e7ff',teal:'00d4ff',gold:'ffb86b',danger:'ff5555' }
  },
  cromo: {
    name:'Chrome Drift', desc:'Prata metálico e azul gelo — sofisticação futurista',
    preview:['#0f0f12','#1e1e2f','#b0c4de','#4682b4','#e0e0e0'],
    C:{ bg:'0f0f12',bg2:'1e1e2f',txt:'f0f4fa',muted:'8899aa',a1:'b0c4de',a2:'4682b4',a3:'e0e6f0',teal:'5f9ea0',gold:'c0c0c0',danger:'dc143c' }
  },
  pulso: {
    name:'Pulso de Precisão', desc:'Violeta profundo e ciano — dados e analytics',
    preview:['#0b0b1f','#1e1a3a','#7b2eda','#22d3ee','#c084fc'],
    C:{ bg:'0b0b1f',bg2:'1e1a3a',txt:'f1f5f9',muted:'9ca3af',a1:'7b2eda',a2:'22d3ee',a3:'c084fc',teal:'2dd4bf',gold:'fbbf24',danger:'f87171' }
  },
  darkex: {
    name:'Dark Executivo', desc:'Preto carbono e dourado — autoridade e impacto',
    preview:['#0a0a0a','#1e1e1e','#fbbf24','#d4af37','#a1a1aa'],
    C:{ bg:'0a0a0a',bg2:'1e1e1e',txt:'fafafa',muted:'a1a1aa',a1:'fbbf24',a2:'d4af37',a3:'fde68a',teal:'34d399',gold:'fbbf24',danger:'ef4444' }
  },
  bento: {
    name:'Bento Grid', desc:'Cinza moderno e azul acizentado — organização modular',
    preview:['#121212','#2a2a2a','#3b82f6','#60a5fa','#94a3b8'],
    C:{ bg:'121212',bg2:'2a2a2a',txt:'f8fafc',muted:'94a3b8',a1:'3b82f6',a2:'60a5fa',a3:'bfdbfe',teal:'2dd4bf',gold:'f59e0b',danger:'ef4444' }
  },
  florestaviva: {
    name:'Floresta Viva', desc:'Verde musgo e terra — crescimento e regeneração',
    preview:['#0f2b1a','#1e4d2b','#2e7d32','#81c784','#a5d6a7'],
    C:{ bg:'0f2b1a',bg2:'1e4d2b',txt:'f1f8e9',muted:'9bbb9d',a1:'2e7d32',a2:'43a047',a3:'81c784',teal:'1b5e20',gold:'f9a825',danger:'e53935' }
  },
  terracota: {
    name:'Terra Cota', desc:'Argila queimada e creme — calor e autenticidade',
    preview:['#2b1b0e','#7b4b2a','#c96f3d','#e6a57e','#fae6d8'],
    C:{ bg:'2b1b0e',bg2:'7b4b2a',txt:'fef3e0',muted:'cbaa8b',a1:'c96f3d',a2:'e6a57e',a3:'fae6d8',teal:'b85e3a',gold:'fbbf24',danger:'ef4444' }
  },
  shale: {
    name:'Shale Green', desc:'Verde mineral e areia — estabilidade e resistência',
    preview:['#1e2b22','#3a5a3a','#5f7b5f','#9bb89b','#d4dcd4'],
    C:{ bg:'1e2b22',bg2:'3a5a3a',txt:'f0f7f0',muted:'a3b8a3',a1:'5f7b5f',a2:'9bb89b',a3:'d4dcd4',teal:'4a6b4a',gold:'d4af37',danger:'c45a5a' }
  },
  artico: {
    name:'Ártico', desc:'Azul glacial e branco neve — pureza e minimalismo',
    preview:['#0f1a2f','#1e3a5f','#7fb7d9','#c1e1f0','#ffffff'],
    C:{ bg:'0f1a2f',bg2:'1e3a5f',txt:'ffffff',muted:'b0c4de',a1:'7fb7d9',a2:'c1e1f0',a3:'e0f2fe',teal:'48a9c5',gold:'e6b800',danger:'d96b6b' }
  },
  porsol: {
    name:'Pôr do Sol', desc:'Laranja queimado e lavanda — otimismo e criatividade',
    preview:['#1a0b0b','#2d1a1a','#f97316','#fb923c','#fecaca'],
    C:{ bg:'1a0b0b',bg2:'2d1a1a',txt:'fff7ed',muted:'b08070',a1:'c2410c',a2:'f97316',a3:'fb923c',teal:'ea580c',gold:'fcd34d',danger:'ef4444' }
  },
  lilac: {
    name:'Lilás Esfumado', desc:'Lavanda suave e cinza pérola — delicadeza e sofisticação',
    preview:['#1a1625','#2e263f','#b8a9c9','#d9c9e6','#f0e6fa'],
    C:{ bg:'1a1625',bg2:'2e263f',txt:'faf5ff',muted:'b7a9c2',a1:'b8a9c9',a2:'d9c9e6',a3:'f0e6fa',teal:'a58bbf',gold:'d4af37',danger:'d96b8b' }
  },
  caramel: {
    name:'Caramelo', desc:'Marrom açucarado e creme — aconchego e indulgência',
    preview:['#261c0f','#4a3723','#a5673f','#d99b6b','#f7e3d3'],
    C:{ bg:'261c0f',bg2:'4a3723',txt:'fef7e9',muted:'b99e82',a1:'a5673f',a2:'d99b6b',a3:'f7e3d3',teal:'8b5a2b',gold:'d4a373',danger:'bf4e4e' }
  },
  evening: {
    name:'Evening Blue', desc:'Azul noturno profundo — confiança e expansão',
    preview:['#0f172a','#1e293b','#334155','#486581','#9ab3d0'],
    C:{ bg:'0f172a',bg2:'1e293b',txt:'f1f5f9',muted:'94a3b8',a1:'334155',a2:'486581',a3:'9ab3d0',teal:'2c5f7a',gold:'fbbf24',danger:'f87171' }
  },
  amaranth: {
    name:'Amaranto', desc:'Roxo profundo e magenta — mistério e espiritualidade',
    preview:['#1a0f1f','#2d1a30','#9b4b6b','#c47495','#e5b8d0'],
    C:{ bg:'1a0f1f',bg2:'2d1a30',txt:'fef3f7',muted:'c09ab0',a1:'9b4b6b',a2:'c47495',a3:'e5b8d0',teal:'b25770',gold:'e6b800',danger:'d96b8b' }
  },
  mono: {
    name:'Monocromático', desc:'Preto, branco e cinza — minimalismo absoluto',
    preview:['#0a0a0a','#2a2a2a','#6b6b6b','#b0b0b0','#f5f5f5'],
    C:{ bg:'0a0a0a',bg2:'2a2a2a',txt:'f5f5f5',muted:'a0a0a0',a1:'6b6b6b',a2:'b0b0b0',a3:'e0e0e0',teal:'808080',gold:'c0c0c0',danger:'a0a0a0' }
  },

  // ════════════════════════════════════════════════════
  // TEMAS CYBERGRID
  // Otimizados para grade, glow, Courier New e HUD
  // ════════════════════════════════════════════════════

  // CG-01: Terminal verde — hacker clássico
  matrix: {
    name:'Matrix', desc:'Verde terminal sobre preto absoluto — hacker clássico',
    preview:['#010f01','#021a02','#00ff41','#00cc33','#80ffb0'],
    C:{ bg:'010f01',bg2:'021a02',txt:'ccffcc',muted:'2d6e2d',a1:'00ff41',a2:'00cc33',a3:'80ffb0',teal:'00e676',gold:'ffe600',danger:'ff1744' }
  },

  // CG-02: Plasma — rede neural, data center profundo
  plasma: {
    name:'Plasma', desc:'Azul elétrico intenso — rede neural e fluxo de dados',
    preview:['#000814','#001233','#0077ff','#00b4ff','#66d9ff'],
    C:{ bg:'000814',bg2:'001233',txt:'e0f4ff',muted:'3a6ea8',a1:'0077ff',a2:'00b4ff',a3:'66d9ff',teal:'00e5ff',gold:'ffd600',danger:'ff1744' }
  },

  // CG-03: Cobre Tec — industrial vintage oxidado
  cobretec: {
    name:'Cobre Tec', desc:'Cobre e ferrugem sobre preto — industrial tech vintage',
    preview:['#0d0804','#1a1008','#b45309','#d97706','#fcd34d'],
    C:{ bg:'0d0804',bg2:'1a1008',txt:'fef3c7',muted:'92614a',a1:'b45309',a2:'d97706',a3:'fcd34d',teal:'ea580c',gold:'f59e0b',danger:'ef4444' }
  },

  // ════════════════════════════════════════════════════
  // TEMAS BRUTAL
  // Alto contraste, cores puras, inversão de cor, blocos sólidos
  // ════════════════════════════════════════════════════

  // BR-01: Manifesto — vermelho urgência
  manifesto: {
    name:'Manifesto', desc:'Vermelho puro sobre preto — urgência e impacto máximo',
    preview:['#0a0000','#1a0000','#e60000','#ff3333','#ffffff'],
    C:{ bg:'0a0000',bg2:'1a0000',txt:'ffffff',muted:'cc6666',a1:'e60000',a2:'ff3333',a3:'ff9999',teal:'ff4400',gold:'ffcc00',danger:'ff0000' }
  },

  // BR-02: Construção — amarelo e preto, sinalização de obra
  construcao: {
    name:'Construção', desc:'Amarelo e preto — sinalização e força bruta',
    preview:['#0a0a00','#1a1a00','#f5c400','#ffe135','#ffffff'],
    C:{ bg:'0a0a00',bg2:'1a1a00',txt:'ffffff',muted:'a09900',a1:'f5c400',a2:'ffe135',a3:'fff176',teal:'fbc02d',gold:'f5c400',danger:'ff3d00' }
  },

  // BR-03: Bruto Cru — brutalismo invertido, branco com tinta preta
  crubrut: {
    name:'Bruto Cru', desc:'Preto sobre branco — impressão gráfica e fanzine premium',
    preview:['#f5f5f0','#e8e8e0','#111111','#444444','#000000'],
    C:{ bg:'f5f5f0',bg2:'e8e8e0',txt:'0a0a0a',muted:'888880',a1:'111111',a2:'333333',a3:'666666',teal:'222222',gold:'c8a000',danger:'cc0000' }
  },

  // ════════════════════════════════════════════════════
  // TEMAS AURORA
  // Gradientes em camadas, orbes de luz, atmosférico
  // ════════════════════════════════════════════════════

  // AU-01: Nebulosa — cosmos, profundidade infinita
  nebulosa: {
    name:'Nebulosa', desc:'Roxo cósmico e rosa nebular — profundidade infinita',
    preview:['#06010f','#110425','#6b21a8','#db2777','#f0abfc'],
    C:{ bg:'06010f',bg2:'110425',txt:'fdf4ff',muted:'9d5fbd',a1:'7e22ce',a2:'db2777',a3:'f0abfc',teal:'a855f7',gold:'fbbf24',danger:'f43f5e' }
  },

  // AU-02: Boreal — aurora boreal, verde e turquesa
  boreal: {
    name:'Boreal', desc:'Verde e turquesa etéreos — aurora boreal viva',
    preview:['#010d0d','#012020','#00897b','#26c6da','#b2ebf2'],
    C:{ bg:'010d0d',bg2:'012020',txt:'e0f7f7',muted:'4a8f8f',a1:'00897b',a2:'26c6da',a3:'80deea',teal:'00bcd4',gold:'ffd54f',danger:'ef5350' }
  },

  // AU-03: Rosé Dourado — pôr do sol premium, luxuoso
  rosedouro: {
    name:'Rosé Dourado', desc:'Rosa e ouro — pôr do sol luxuoso e etéreo',
    preview:['#0f0508','#200c12','#c2185b','#f06292','#ffd700'],
    C:{ bg:'0f0508',bg2:'200c12',txt:'fff0f5',muted:'b07080',a1:'c2185b',a2:'f06292',a3:'f8bbd0',teal:'e91e8c',gold:'ffd700',danger:'d32f2f' }
  },

  // ════════════════════════════════════════════════════
  // TEMAS 2026 / 2027
  // Dinamismo, disrupção, tecnologia, água, vidro
  // ════════════════════════════════════════════════════

  // 26-01: Aqua Funda — transparência líquida, profundidade oceânica
  aquafunda: {
    name:'Aqua Funda',
    desc:'Azul oceânico e ciano cristalino — transparência líquida e profundidade',
    preview:['#00121c','#002538','#00b4d8','#90e0ef','#caf0f8'],
    C:{ bg:'00121c',bg2:'002538',txt:'e0f8ff',muted:'4a8fa8',a1:'00b4d8',a2:'90e0ef',a3:'caf0f8',teal:'0096c7',gold:'f4d35e',danger:'e63946' }
  },

  // 26-02: Cristal Polar — vidro fosco, gelo, reflexo frio
  cristalpolar: {
    name:'Cristal Polar',
    desc:'Gelo translúcido e prata glacial — vidro fosco e reflexos frios',
    preview:['#060e1a','#0d1b2e','#48cae4','#ade8f4','#e8f4f8'],
    C:{ bg:'060e1a',bg2:'0d1b2e',txt:'f0f8ff',muted:'6a9ab8',a1:'48cae4',a2:'ade8f4',a3:'e8f4f8',teal:'00b4d8',gold:'ffd166',danger:'ef476f' }
  },

  // 26-03: Plasma Quente — gradient mesh orgânico, disrupção neon
  plasmaquente: {
    name:'Plasma Quente',
    desc:'Magenta e violeta elétrico — gradient mesh orgânico e disrupção total',
    preview:['#0a0010','#14002a','#ff006e','#8338ec','#ffbe0b'],
    C:{ bg:'0a0010',bg2:'14002a',txt:'fff0ff',muted:'8050a0',a1:'ff006e',a2:'8338ec',a3:'ff85c2',teal:'3a86ff',gold:'ffbe0b',danger:'ff006e' }
  },

  // 26-04: Obsidiana — vulcânico, negro denso + dourado queimado
  obsidiana: {
    name:'Obsidiana',
    desc:'Preto vulcânico e ouro queimado — peso e impacto sem concessões',
    preview:['#050404','#100c08','#c9a84c','#e8c97a','#f5e1a4'],
    C:{ bg:'050404',bg2:'100c08',txt:'f5ebe0',muted:'7a6a5a',a1:'c9a84c',a2:'e8c97a',a3:'f5e1a4',teal:'b5835a',gold:'c9a84c',danger:'c0392b' }
  },

  // 26-05: Argila Digital — terracota muted, tech warmth 2026
  argiladigital: {
    name:'Argila Digital',
    desc:'Terracota muted e bege tech — o warm tone digital de 2026',
    preview:['#1a1210','#2a1e1a','#d4785a','#e8a898','#f5d5cc'],
    C:{ bg:'1a1210',bg2:'2a1e1a',txt:'f5ede8',muted:'9a7d72',a1:'d4785a',a2:'e8a898',a3:'f5d5cc',teal:'6b9e8e',gold:'d4a96a',danger:'c0392b' }
  },

  // 26-06: Cromo Prisma — prata + arco-íris de borda, iridescente
  cromoprisma: {
    name:'Cromo Prisma',
    desc:'Prata metálico e borda iridescente — sofisticação futurista e prisma de luz',
    preview:['#0c0d10','#1a1c22','#a8b8d0','#c8d8f0','#b090e0'],
    C:{ bg:'0c0d10',bg2:'1a1c22',txt:'f0f2f8',muted:'7080a0',a1:'a8b8d0',a2:'c8d8f0',a3:'e8eef8',teal:'b090e0',gold:'d0b880',danger:'e05070' }
  },

  // 26-07: Void — preto absoluto, 1 acento cirúrgico, minimalismo extremo
  void: {
    name:'Void',
    desc:'Preto absoluto e magenta cirúrgico — onde o vazio é a mensagem',
    preview:['#000000','#0a0a0a','#e879f9','#f0abfc','#fae8ff'],
    C:{ bg:'000000',bg2:'0a0a0a',txt:'ffffff',muted:'555555',a1:'e879f9',a2:'f0abfc',a3:'fae8ff',teal:'e879f9',gold:'fbbf24',danger:'ef4444' }
  },

  // 26-08: Biolum — bioluminescência, fundo abisal + luz viva de criaturas
  biolum: {
    name:'Biolum',
    desc:'Verde e ciano bioluminescente sobre abismo — luz viva no escuro total',
    preview:['#000d0f','#001518','#00f5a0','#00d4e0','#80ffe8'],
    C:{ bg:'000d0f',bg2:'001518',txt:'e0fff5',muted:'2a7a60',a1:'00f5a0',a2:'00d4e0',a3:'80ffe8',teal:'00c9b8',gold:'ffe066',danger:'ff4560' }
  },
};
