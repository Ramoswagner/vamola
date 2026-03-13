// js/themes.js
// Todas as paletas de cores disponíveis para a apresentação.
// Cada tema expõe: name, desc, preview (5 hex para UI) e C (cores usadas no PPTX).

const THEMES = {
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

  // 01. CIBERNEON
  neon: {
    name:'Cibernético', desc:'Azul elétrico e magenta — energia digital e inovação',
    preview:['#0a0a0f','#1a1a2e','#00f5ff','#ff00ff','#a0e7ff'],
    C:{ bg:'0a0a0f',bg2:'1a1a2e',txt:'ffffff',muted:'a0a7b8',a1:'00f5ff',a2:'ff00ff',a3:'a0e7ff',teal:'00d4ff',gold:'ffb86b',danger:'ff5555' }
  },

  // 02. CROMO DRIFT
  cromo: {
    name:'Chrome Drift', desc:'Prata metálico e azul gelo — sofisticação futurista',
    preview:['#0f0f12','#1e1e2f','#b0c4de','#4682b4','#e0e0e0'],
    C:{ bg:'0f0f12',bg2:'1e1e2f',txt:'f0f4fa',muted:'8899aa',a1:'b0c4de',a2:'4682b4',a3:'e0e6f0',teal:'5f9ea0',gold:'c0c0c0',danger:'dc143c' }
  },

  // 03. PULSO DE PRECISÃO
  pulso: {
    name:'Pulso de Precisão', desc:'Violeta profundo e ciano — dados e analytics',
    preview:['#0b0b1f','#1e1a3a','#7b2eda','#22d3ee','#c084fc'],
    C:{ bg:'0b0b1f',bg2:'1e1a3a',txt:'f1f5f9',muted:'9ca3af',a1:'7b2eda',a2:'22d3ee',a3:'c084fc',teal:'2dd4bf',gold:'fbbf24',danger:'f87171' }
  },

  // 04. DARK MODE EXECUTIVO
  darkex: {
    name:'Dark Executivo', desc:'Preto carbono e dourado — autoridade e impacto',
    preview:['#0a0a0a','#1e1e1e','#fbbf24','#d4af37','#a1a1aa'],
    C:{ bg:'0a0a0a',bg2:'1e1e1e',txt:'fafafa',muted:'a1a1aa',a1:'fbbf24',a2:'d4af37',a3:'fde68a',teal:'34d399',gold:'fbbf24',danger:'ef4444' }
  },

  // 05. BENTO GRID
  bento: {
    name:'Bento Grid', desc:'Cinza moderno e azul acizentado — organização modular',
    preview:['#121212','#2a2a2a','#3b82f6','#60a5fa','#94a3b8'],
    C:{ bg:'121212',bg2:'2a2a2a',txt:'f8fafc',muted:'94a3b8',a1:'3b82f6',a2:'60a5fa',a3:'bfdbfe',teal:'2dd4bf',gold:'f59e0b',danger:'ef4444' }
  },

  // 06. FLORESTA VIVA
  florestaviva: {
    name:'Floresta Viva', desc:'Verde musgo e terra — crescimento e regeneração',
    preview:['#0f2b1a','#1e4d2b','#2e7d32','#81c784','#a5d6a7'],
    C:{ bg:'0f2b1a',bg2:'1e4d2b',txt:'f1f8e9',muted:'9bbb9d',a1:'2e7d32',a2:'43a047',a3:'81c784',teal:'1b5e20',gold:'f9a825',danger:'e53935' }
  },

  // 07. TERRA COTA
  terracota: {
    name:'Terra Cota', desc:'Argila queimada e creme — calor e autenticidade',
    preview:['#2b1b0e','#7b4b2a','#c96f3d','#e6a57e','#fae6d8'],
    C:{ bg:'2b1b0e',bg2:'7b4b2a',txt:'fef3e0',muted:'cbaa8b',a1:'c96f3d',a2:'e6a57e',a3:'fae6d8',teal:'b85e3a',gold:'fbbf24',danger:'ef4444' }
  },

  // 08. SHALE GREEN
  shale: {
    name:'Shale Green', desc:'Verde mineral e areia — estabilidade e resistência',
    preview:['#1e2b22','#3a5a3a','#5f7b5f','#9bb89b','#d4dcd4'],
    C:{ bg:'1e2b22',bg2:'3a5a3a',txt:'f0f7f0',muted:'a3b8a3',a1:'5f7b5f',a2:'9bb89b',a3:'d4dcd4',teal:'4a6b4a',gold:'d4af37',danger:'c45a5a' }
  },

  // 09. ÁRTICO
  artico: {
    name:'Ártico', desc:'Azul glacial e branco neve — pureza e minimalismo',
    preview:['#0f1a2f','#1e3a5f','#7fb7d9','#c1e1f0','#ffffff'],
    C:{ bg:'0f1a2f',bg2:'1e3a5f',txt:'ffffff',muted:'b0c4de',a1:'7fb7d9',a2:'c1e1f0',a3:'e0f2fe',teal:'48a9c5',gold:'e6b800',danger:'d96b6b' }
  },

  // 10. PÔR DO SOL
  porsol: {
    name:'Pôr do Sol', desc:'Laranja queimado e lavanda — otimismo e criatividade',
    preview:['#1a0b0b','#2d1a1a','#f97316','#fb923c','#fecaca'],
    C:{ bg:'1a0b0b',bg2:'2d1a1a',txt:'fff7ed',muted:'b08070',a1:'c2410c',a2:'f97316',a3:'fb923c',teal:'ea580c',gold:'fcd34d',danger:'ef4444' }
  },

  // 11. LILÁS ESFUMADO
  lilac: {
    name:'Lilás Esfumado', desc:'Lavanda suave e cinza pérola — delicadeza e sofisticação',
    preview:['#1a1625','#2e263f','#b8a9c9','#d9c9e6','#f0e6fa'],
    C:{ bg:'1a1625',bg2:'2e263f',txt:'faf5ff',muted:'b7a9c2',a1:'b8a9c9',a2:'d9c9e6',a3:'f0e6fa',teal:'a58bbf',gold:'d4af37',danger:'d96b8b' }
  },

  // 12. CARAMELO
  caramel: {
    name:'Caramelo', desc:'Marrom açucarado e creme — aconchego e indulgência',
    preview:['#261c0f','#4a3723','#a5673f','#d99b6b','#f7e3d3'],
    C:{ bg:'261c0f',bg2:'4a3723',txt:'fef7e9',muted:'b99e82',a1:'a5673f',a2:'d99b6b',a3:'f7e3d3',teal:'8b5a2b',gold:'d4a373',danger:'bf4e4e' }
  },

  // 13. EVENING BLUE
  evening: {
    name:'Evening Blue', desc:'Azul noturno profundo — confiança e expansão',
    preview:['#0f172a','#1e293b','#334155','#486581','#9ab3d0'],
    C:{ bg:'0f172a',bg2:'1e293b',txt:'f1f5f9',muted:'94a3b8',a1:'334155',a2:'486581',a3:'9ab3d0',teal:'2c5f7a',gold:'fbbf24',danger:'f87171' }
  },

  // 14. AMARANTO
  amaranth: {
    name:'Amaranto', desc:'Roxo profundo e magenta — mistério e espiritualidade',
    preview:['#1a0f1f','#2d1a30','#9b4b6b','#c47495','#e5b8d0'],
    C:{ bg:'1a0f1f',bg2:'2d1a30',txt:'fef3f7',muted:'c09ab0',a1:'9b4b6b',a2:'c47495',a3:'e5b8d0',teal:'b25770',gold:'e6b800',danger:'d96b8b' }
  },

  // 15. MONOCROMÁTICO
  mono: {
    name:'Monocromático', desc:'Preto, branco e cinza — minimalismo absoluto',
    preview:['#0a0a0a','#2a2a2a','#6b6b6b','#b0b0b0','#f5f5f5'],
    C:{ bg:'0a0a0a',bg2:'2a2a2a',txt:'f5f5f5',muted:'a0a0a0',a1:'6b6b6b',a2:'b0b0b0',a3:'e0e0e0',teal:'808080',gold:'c0c0c0',danger:'a0a0a0' }
  }
};
