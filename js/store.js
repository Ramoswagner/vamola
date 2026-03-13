// js/store.js
// Estado global da aplicação e constantes de dados.
// Todos os outros módulos (ui.js, main.js, ModeloBase.js) leem e escrevem em G.

// Paleta de cores rotativa para identificar projetos visualmente
const PROJ_COLORS = [
  '#2563EB', '#7C3AED', '#DB2777', '#D97706',
  '#059669', '#DC2626', '#0284C7', '#9333EA'
];

// Estado principal — fonte única da verdade da aplicação
const G = {

  // ── Configuração da sessão ──
  mode:   'single',    // 'single' | 'portfolio' | 'program'
  modelo: 'classico',  // 'classico' | 'moderno' | 'minimalista'
  step:   'identity',  // step ativo no builder
  theme:  'oceano',    // chave do tema em THEMES

  // ── Identidade da apresentação ──
  id: {
    instName:  '',
    instDept:  '',
    presTitle: '',
    presDate:  '',
    presSub:   '',
    logoInst:  null,   // base64 da imagem
    logoProg:  null,   // base64 da imagem
    bi2025:    null,   // base64 do print BI ano anterior
    bi2026:    null,   // base64 do print BI atual
  },

  // ── Blocos de conteúdo disponíveis ──
  blocks: {
    capa:        { label:'Capa',              icon:'◻', required:true,  enabled:true,  desc:'Slide de abertura com título e logos' },
    objetivo:    { label:'Objetivo',          icon:'◎', required:true,  enabled:true,  desc:'Problema ou oportunidade abordada' },
    team:        { label:'Equipe',            icon:'◫', required:false, enabled:true,  desc:'Membros e papéis no projeto' },
    etapas:      { label:'Etapas',            icon:'⊶', required:false, enabled:true,  desc:'Fases de execução do projeto' },
    marcos:      { label:'Marcos / Timeline', icon:'◈', required:false, enabled:true,  desc:'Datas e entregas relevantes' },
    indicadores: { label:'Indicadores KPI',   icon:'◉', required:false, enabled:true,  desc:'Metas e realizações mensuráveis' },
    resultados:  { label:'Resultados',        icon:'◆', required:false, enabled:true,  desc:'Impactos concretos e números' },
    antesdepois: { label:'Antes & Depois',    icon:'◑', required:false, enabled:false, desc:'Comparação visual antes/após' },
    evidencias:  { label:'Evidências',        icon:'▣', required:false, enabled:false, desc:'Fotos e registros do projeto' },
    riscos:      { label:'Riscos',            icon:'⚠', required:false, enabled:false, desc:'Pontos de atenção identificados' },
    licoes:      { label:'Lições Aprendidas', icon:'◈', required:false, enabled:false, desc:'Aprendizados do ciclo' },
    desafios:    { label:'Desafios Futuros',  icon:'◉', required:false, enabled:false, desc:'Próximos passos e desdobramentos' },
    panorama:    { label:'Panorama BI',       icon:'◐', required:false, enabled:false, desc:'Dashboard de contexto (antes/atual)' },
    encerramento:{ label:'Encerramento',      icon:'◻', required:false, enabled:true,  desc:'Slide final de agradecimento' },
  },

  // ── Projetos ──
  projects: [],
  activeProjectId: null,
};
