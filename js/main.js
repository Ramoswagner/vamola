// js/main.js

// ════════════════════════════════════════════════════
// DATA
// ════════════════════════════════════════════════════
const G = {
  mode: 'single',
  modelo: 'classico',
  step: 'identity',
  theme: 'oceano',
  id: { instName:'', instDept:'', presTitle:'', presDate:'', presSub:'',
        logoInst:null, logoProg:null, bi2025:null, bi2026:null },
  blocks: {
    capa:       { label:'Capa',              icon:'◻',  required:true,  enabled:true,  desc:'Slide de abertura com título e logos' },
    objetivo:   { label:'Objetivo',          icon:'◎',  required:true,  enabled:true,  desc:'Problema ou oportunidade abordada' },
    team:       { label:'Equipe',            icon:'◫',  required:false, enabled:true,  desc:'Membros e papéis no projeto' },
    etapas:     { label:'Etapas',            icon:'⊶',  required:false, enabled:true,  desc:'Fases de execução do projeto' },
    marcos:     { label:'Marcos / Timeline', icon:'◈',  required:false, enabled:true,  desc:'Datas e entregas relevantes' },
    indicadores:{ label:'Indicadores KPI',   icon:'◉',  required:false, enabled:true,  desc:'Metas e realizações mensuráveis' },
    resultados: { label:'Resultados',        icon:'◆',  required:false, enabled:true,  desc:'Impactos concretos e números' },
    antesdepois:{ label:'Antes & Depois',    icon:'◑',  required:false, enabled:false, desc:'Comparação visual antes/após' },
    evidencias: { label:'Evidências',        icon:'▣',  required:false, enabled:false, desc:'Fotos e registros do projeto' },
    riscos:     { label:'Riscos',            icon:'⚠',  required:false, enabled:false, desc:'Pontos de atenção identificados' },
    licoes:     { label:'Lições Aprendidas', icon:'◈',  required:false, enabled:false, desc:'Aprendizados do ciclo' },
    desafios:   { label:'Desafios Futuros',  icon:'◉',  required:false, enabled:false, desc:'Próximos passos e desdobramentos' },
    panorama:   { label:'Panorama BI',       icon:'◐',  required:false, enabled:false, desc:'Dashboard de contexto (antes/atual)' },
    encerramento:{ label:'Encerramento',     icon:'◻',  required:false, enabled:true,  desc:'Slide final de agradecimento' },
  },
  projects: [],
  activeProjectId: null,
};

const PROJ_COLORS = ['#2563EB','#7C3AED','#DB2777','#D97706','#059669','#DC2626','#0284C7','#9333EA'];

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
      name: 'Cibernético',
      desc: 'Azul elétrico e magenta — energia digital e inovação',
      preview: ['#0a0a0f', '#1a1a2e', '#00f5ff', '#ff00ff', '#a0e7ff'],
      C: { bg: '0a0a0f', bg2: '1a1a2e', txt: 'ffffff', muted: 'a0a7b8', a1: '00f5ff', a2: 'ff00ff', a3: 'a0e7ff', teal: '00d4ff', gold: 'ffb86b', danger: 'ff5555' }
  },
  
  // 02. CROMO DRIFT
  cromo: {
      name: 'Chrome Drift',
      desc: 'Prata metálico e azul gelo — sofisticação futurista',
      preview: ['#0f0f12', '#1e1e2f', '#b0c4de', '#4682b4', '#e0e0e0'],
      C: { bg: '0f0f12', bg2: '1e1e2f', txt: 'f0f4fa', muted: '8899aa', a1: 'b0c4de', a2: '4682b4', a3: 'e0e6f0', teal: '5f9ea0', gold: 'c0c0c0', danger: 'dc143c' }
  },
  
  // 03. PULSO DE PRECISÃO
  pulso: {
      name: 'Pulso de Precisão',
      desc: 'Violeta profundo e ciano — dados e analytics',
      preview: ['#0b0b1f', '#1e1a3a', '#7b2eda', '#22d3ee', '#c084fc'],
      C: { bg: '0b0b1f', bg2: '1e1a3a', txt: 'f1f5f9', muted: '9ca3af', a1: '7b2eda', a2: '22d3ee', a3: 'c084fc', teal: '2dd4bf', gold: 'fbbf24', danger: 'f87171' }
  },
  
  // 04. DARK MODE EXECUTIVO
  darkex: {
      name: 'Dark Executivo',
      desc: 'Preto carbono e dourado — autoridade e impacto',
      preview: ['#0a0a0a', '#1e1e1e', '#fbbf24', '#d4af37', '#a1a1aa'],
      C: { bg: '0a0a0a', bg2: '1e1e1e', txt: 'fafafa', muted: 'a1a1aa', a1: 'fbbf24', a2: 'd4af37', a3: 'fde68a', teal: '34d399', gold: 'fbbf24', danger: 'ef4444' }
  },
  
  // 05. BENTO GRID
  bento: {
      name: 'Bento Grid',
      desc: 'Cinza moderno e azul acizentado — organização modular',
      preview: ['#121212', '#2a2a2a', '#3b82f6', '#60a5fa', '#94a3b8'],
      C: { bg: '121212', bg2: '2a2a2a', txt: 'f8fafc', muted: '94a3b8', a1: '3b82f6', a2: '60a5fa', a3: 'bfdbfe', teal: '2dd4bf', gold: 'f59e0b', danger: 'ef4444' }
  },
  // 06. FLORESTA VIVA
  florestaviva: {
      name: 'Floresta Viva',
      desc: 'Verde musgo e terra — crescimento e regeneração',
      preview: ['#0f2b1a', '#1e4d2b', '#2e7d32', '#81c784', '#a5d6a7'],
      C: { bg: '0f2b1a', bg2: '1e4d2b', txt: 'f1f8e9', muted: '9bbb9d', a1: '2e7d32', a2: '43a047', a3: '81c784', teal: '1b5e20', gold: 'f9a825', danger: 'e53935' }
  },
  
  // 07. TERRA COTA
  terracota: {
      name: 'Terra Cota',
      desc: 'Argila queimada e creme — calor e autenticidade',
      preview: ['#2b1b0e', '#7b4b2a', '#c96f3d', '#e6a57e', '#fae6d8'],
      C: { bg: '2b1b0e', bg2: '7b4b2a', txt: 'fef3e0', muted: 'cbaa8b', a1: 'c96f3d', a2: 'e6a57e', a3: 'fae6d8', teal: 'b85e3a', gold: 'fbbf24', danger: 'ef4444' }
  },
  
  // 08. SHALE GREEN
  shale: {
      name: 'Shale Green',
      desc: 'Verde mineral e areia — estabilidade e resistência',
      preview: ['#1e2b22', '#3a5a3a', '#5f7b5f', '#9bb89b', '#d4dcd4'],
      C: { bg: '1e2b22', bg2: '3a5a3a', txt: 'f0f7f0', muted: 'a3b8a3', a1: '5f7b5f', a2: '9bb89b', a3: 'd4dcd4', teal: '4a6b4a', gold: 'd4af37', danger: 'c45a5a' }
  },
  
  // 09. ÁRTICO
  artico: {
      name: 'Ártico',
      desc: 'Azul glacial e branco neve — pureza e minimalismo',
      preview: ['#0f1a2f', '#1e3a5f', '#7fb7d9', '#c1e1f0', '#ffffff'],
      C: { bg: '0f1a2f', bg2: '1e3a5f', txt: 'ffffff', muted: 'b0c4de', a1: '7fb7d9', a2: 'c1e1f0', a3: 'e0f2fe', teal: '48a9c5', gold: 'e6b800', danger: 'd96b6b' }
  },
  
  // 10. PÔR DO SOL
  porsol: {
      name: 'Pôr do Sol',
      desc: 'Laranja queimado e lavanda — otimismo e criatividade',
      preview: ['#1a0b0b', '#2d1a1a', '#f97316', '#fb923c', '#fecaca'],
      C: { bg: '1a0b0b', bg2: '2d1a1a', txt: 'fff7ed', muted: 'b08070', a1: 'c2410c', a2: 'f97316', a3: 'fb923c', teal: 'ea580c', gold: 'fcd34d', danger: 'ef4444' }
  },
  // 11. BURNISHED LILAC
  lilac: {
      name: 'Lilás Esfumado',
      desc: 'Lavanda suave e cinza pérola — delicadeza e sofisticação',
      preview: ['#1a1625', '#2e263f', '#b8a9c9', '#d9c9e6', '#f0e6fa'],
      C: { bg: '1a1625', bg2: '2e263f', txt: 'faf5ff', muted: 'b7a9c2', a1: 'b8a9c9', a2: 'd9c9e6', a3: 'f0e6fa', teal: 'a58bbf', gold: 'd4af37', danger: 'd96b8b' }
  },
  
  // 12. CARAMEL
  caramel: {
      name: 'Caramelo',
      desc: 'Marrom açucarado e creme — aconchego e indulgência',
      preview: ['#261c0f', '#4a3723', '#a5673f', '#d99b6b', '#f7e3d3'],
      C: { bg: '261c0f', bg2: '4a3723', txt: 'fef7e9', muted: 'b99e82', a1: 'a5673f', a2: 'd99b6b', a3: 'f7e3d3', teal: '8b5a2b', gold: 'd4a373', danger: 'bf4e4e' }
  },
  
  // 13. EVENING BLUE
  evening: {
      name: 'Evening Blue',
      desc: 'Azul noturno profundo — confiança e expansão',
      preview: ['#0f172a', '#1e293b', '#334155', '#486581', '#9ab3d0'],
      C: { bg: '0f172a', bg2: '1e293b', txt: 'f1f5f9', muted: '94a3b8', a1: '334155', a2: '486581', a3: '9ab3d0', teal: '2c5f7a', gold: 'fbbf24', danger: 'f87171' }
  },
  
  // 14. AMARANTH
  amaranth: {
      name: 'Amaranto',
      desc: 'Roxo profundo e magenta — mistério e espiritualidade',
      preview: ['#1a0f1f', '#2d1a30', '#9b4b6b', '#c47495', '#e5b8d0'],
      C: { bg: '1a0f1f', bg2: '2d1a30', txt: 'fef3f7', muted: 'c09ab0', a1: '9b4b6b', a2: 'c47495', a3: 'e5b8d0', teal: 'b25770', gold: 'e6b800', danger: 'd96b8b' }
  },
  
  // 15. MONOCROMÁTICO
  mono: {
      name: 'Monocromático',
      desc: 'Preto, branco e cinza — minimalismo absoluto',
      preview: ['#0a0a0a', '#2a2a2a', '#6b6b6b', '#b0b0b0', '#f5f5f5'],
      C: { bg: '0a0a0a', bg2: '2a2a2a', txt: 'f5f5f5', muted: 'a0a0a0', a1: '6b6b6b', a2: 'b0b0b0', a3: 'e0e0e0', teal: '808080', gold: 'c0c0c0', danger: 'a0a0a0' }
  }
};

// ════════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════════
function init() {
  addProject();
  renderBlockGrid();
  renderThemeGrid();
  renderPreviewBlocks();
  refreshPreview();
  selectModelo('classico');
}

// ════════════════════════════════════════════════════
// SPLASH / MODE
// ════════════════════════════════════════════════════
function selectMode(mode) {
  G.mode = mode;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById('modeBtn-'+mode)?.classList.add('selected');
}

function selectModelo(modelo) {
    G.modelo = modelo;
    // Atualiza botões na splash
    document.querySelectorAll('.modelo-btn').forEach(btn => btn.classList.remove('selected'));
    const btn = document.getElementById('modeloBtn-' + modelo);
    if (btn) btn.classList.add('selected');
    toast(`Modelo "${modelo}" selecionado`, 'info');
}

function startBuilder() {
  document.getElementById('splash').classList.remove('active');
  const builder = document.getElementById('builder');
  builder.classList.add('active');
  updateModeUI();
  goStep('identity');
}

function backToSplash() {
  document.getElementById('builder').classList.remove('active');
  document.getElementById('splash').classList.add('active');
}

function updateModeUI() {
  const labels = { single:'◻ Projeto Único', portfolio:'◫ Portfólio', program:'⊞ Programa' };
  const el = document.getElementById('modeTag');
  if(el) el.textContent = labels[G.mode];
  const tabsWrap = document.getElementById('projTabsWrap');
  const addBtn = document.getElementById('btnAddProj');
  if(tabsWrap) tabsWrap.style.display = G.mode === 'single' ? 'none' : 'block';
  const t = document.getElementById('projStepTitle');
  const d = document.getElementById('projStepDesc');
  if(t) {
    if(G.mode==='single'){t.textContent='Projeto';d.textContent='Preencha as informações da sua iniciativa nos blocos abaixo.';}
    else if(G.mode==='portfolio'){t.textContent='Portfólio';d.textContent='Gerencie os projetos do portfólio e preencha as informações de cada um.';}
    else{t.textContent='Programa';d.textContent='Projetos do programa estratégico. Cada um com seus blocos de conteúdo.';}
  }
}

// ════════════════════════════════════════════════════
// STEP NAVIGATION
// ════════════════════════════════════════════════════
const STEPS = ['identity','blocks','theme','projects','generate'];

function goStep(step) {
  G.step = step;
  document.querySelectorAll('.step-page').forEach(p => p.classList.remove('active'));
  document.getElementById('step-'+step)?.classList.add('active');
  document.querySelectorAll('.nav-step').forEach(n => n.classList.remove('active'));
  const ns = document.getElementById('ns-'+step);
  if(ns) ns.classList.add('active');

  // Mark done
  const idx = STEPS.indexOf(step);
  STEPS.forEach((s,i) => {
    const n = document.getElementById('ns-'+s);
    if(!n) return;
    n.classList.toggle('done', i < idx);
  });

  if(step==='generate') { renderGenSummary(); renderSlideList(); }
  refreshPreview();
}

// ════════════════════════════════════════════════════
// BLOCKS
// ════════════════════════════════════════════════════
function renderBlockGrid() {
  const el = document.getElementById('blockGrid');
  if(!el) return;
  el.innerHTML = Object.entries(G.blocks).map(([key,b])=>`
    <div class="block-card ${b.enabled?'on':''} ${b.required?'required':''}"
         id="bc-${key}" onclick="${b.required?'':''} toggleBlock('${key}')">
      <div class="block-icon">${b.icon}</div>
      <div class="block-name">${b.label}</div>
      <div class="block-desc">${b.desc}</div>
      <span class="block-badge ${b.required?'req':'opt'}">${b.required?'obrigatório':'opcional'}</span>
      ${!b.required?`<div class="block-check">${b.enabled?'✓':''}</div>`:''}
    </div>
  `).join('');
}

function toggleBlock(key) {
  const b = G.blocks[key];
  if(!b || b.required) return;
  b.enabled = !b.enabled;
  renderBlockGrid();
  renderPreviewBlocks();
  refreshPreview();
}

// ════════════════════════════════════════════════════
// THEMES
// ════════════════════════════════════════════════════
function renderThemeGrid() {
  const el = document.getElementById('themeGrid');
  if(!el) return;
  el.innerHTML = Object.entries(THEMES).map(([id,t])=>`
    <div class="theme-card ${G.theme===id?'selected':''}" id="tc-${id}" onclick="selectTheme('${id}')">
      <div class="theme-swatch">${t.preview.map(c=>`<span style="background:${c}"></span>`).join('')}</div>
      <div class="theme-body">
        <div class="theme-name">${t.name} <span class="theme-sel-badge">✓ Selecionado</span></div>
        <div class="theme-desc">${t.desc}</div>
      </div>
    </div>
  `).join('');
}

function selectTheme(id) {
  G.theme = id;
  renderThemeGrid();
  refreshPreview();
  toast(`Tema "${THEMES[id].name}" selecionado`, 'ok');
}

// ════════════════════════════════════════════════════
// PREVIEW
// ════════════════════════════════════════════════════
function refreshPreview() {
  const T = THEMES[G.theme];
  if(!T) return;
  const C = T.C;
  const isLight = C.bg.startsWith('F') || C.bg.startsWith('E');

  // Slide mini bg
  const bg = document.getElementById('slideBg');
  if(bg) bg.style.background = `#${C.bg}`;

  // Accent
  const acc = document.getElementById('slideAccent');
  if(acc) acc.style.background = `linear-gradient(90deg,#${C.a1},#${C.a2})`;

  // Texts
  const ey = document.getElementById('previewEyebrow');
  const tl = document.getElementById('previewTitle');
  const sb = document.getElementById('previewSub');
  if(ey) { ey.style.color = `#${C.muted}`; ey.textContent = G.id.instName || 'Organização'; }
  if(tl) { tl.style.color = `#${C.txt}`; tl.textContent = G.id.presTitle || 'Título da Apresentação'; }
  if(sb) { sb.style.color = `#${C.muted}`; sb.textContent = G.id.presDate || 'Data'; }

  // Slide count
  const slides = countSlides();
  const cnt = document.getElementById('slideCount');
  if(cnt) cnt.textContent = `${slides} slide${slides!==1?'s':''}`;

  renderPreviewBlocks();
}

function countSlides() {
  let n = 1; // capa
  if(G.mode!=='single') n++; // sumario
  const B = G.blocks;
  if(B.panorama?.enabled) n++;
  G.projects.forEach(()=>{
    n++; // divisor
    ['objetivo','team','etapas','marcos','indicadores','resultados','antesdepois','evidencias','riscos','licoes','desafios'].forEach(k=>{
      if(B[k]?.enabled) n++;
    });
  });
  if(B.encerramento?.enabled) n++;
  return n;
}

function renderPreviewBlocks() {
  const el = document.getElementById('previewBlocks');
  if(!el) return;
  const activeBlocks = Object.entries(G.blocks).filter(([,b])=>b.enabled);
  el.innerHTML = activeBlocks.map(([,b])=>`
    <div class="preview-block active">
      <div class="preview-block-dot"></div>
      <span>${b.label}</span>
    </div>
  `).join('') + Object.entries(G.blocks).filter(([,b])=>!b.enabled).map(([,b])=>`
    <div class="preview-block">
      <div class="preview-block-dot"></div>
      <span>${b.label}</span>
    </div>
  `).join('');
  const total = document.getElementById('previewTotal');
  if(total) total.textContent = `${activeBlocks.length} de ${Object.keys(G.blocks).length} blocos ativos`;
}

// ════════════════════════════════════════════════════
// PROJECTS
// ════════════════════════════════════════════════════
let pidCounter = 0;

function addProject() {
  const id = 'p'+(++pidCounter);
  const col = PROJ_COLORS[(G.projects.length)%PROJ_COLORS.length];
  G.projects.push({
    id,color:col,
    name:'',leader:'',status:'Concluído',periodo_inicio:'',periodo_fim:'',
    objetivo:'',
    team:[{nome:'',cargo:''}],
    etapas:[{titulo:'',descricao:''},{titulo:'',descricao:''},{titulo:'',descricao:''}],
    marcos:[{data:'',entrega:''},{data:'',entrega:''},{data:'',entrega:''}],
    indicadores:[{nome:'',meta:'',realizado:''},{nome:'',meta:'',realizado:''},{nome:'',meta:'',realizado:''}],
    resultados:[{metrica:'',absoluto:'',percentual:''},{metrica:'',absoluto:'',percentual:''},{metrica:'',absoluto:'',percentual:''}],
    riscos:[{texto:''}],licoes:[{texto:''}],
    antesdepois:{antes_titulo:'',antes_desc:'',antes_img:null,depois_titulo:'',depois_desc:'',depois_img:null},
    evidencias:[null,null,null,null],
    desafios:'',
    bi2025:null,bi2026:null,
  });
  if(!G.activeProjectId) G.activeProjectId = id;
  renderProjTabs();
  renderAllForms();
  if(G.mode!=='single') selectProj(id);
}

function removeProject(id) {
  if(G.projects.length<=1){toast('Precisa de pelo menos 1 projeto','err');return;}
  G.projects = G.projects.filter(p=>p.id!==id);
  if(G.activeProjectId===id) G.activeProjectId = G.projects[0].id;
  renderProjTabs();
  renderAllForms();
  selectProj(G.activeProjectId);
}

function selectProj(id) {
  G.activeProjectId = id;
  renderProjTabs();
  document.querySelectorAll('.proj-form-wrap').forEach(el=>{
    el.style.display = el.dataset.pid===id ? '' : 'none';
  });
}

function renderProjTabs() {
  const el = document.getElementById('projTabs');
  if(!el) return;
  el.innerHTML = G.projects.map(p=>`
    <button class="proj-tab ${p.id===G.activeProjectId?'active':''}" onclick="selectProj('${p.id}')">
      <div class="proj-tab-dot" style="background:${p.color}"></div>
      ${p.name||'Sem nome'}
    </button>
  `).join('');
  const ns = document.getElementById('ns-proj-sub');
  if(ns) ns.textContent = `${G.projects.length} projeto${G.projects.length!==1?'s':''}`;
}

function getProj(id){ return G.projects.find(p=>p.id===id); }
function pset(id,k,v){ const p=getProj(id);if(p)p[k]=v; }
function psetD(id,o,k,v){ const p=getProj(id);if(p)p[o][k]=v; }
function psetR(pid,f,i,k,v){ const p=getProj(pid);if(p&&p[f][i])p[f][i][k]=v; }
function esc(s){ return (s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

function renderAllForms() {
  const container = document.getElementById('projectForms');
  if(!container) return;
  container.innerHTML='';
  G.projects.forEach(p=>{
    const wrap=document.createElement('div');
    wrap.className='proj-form-wrap';wrap.dataset.pid=p.id;
    wrap.style.display=p.id===G.activeProjectId?'':'none';
    wrap.innerHTML=buildForm(p);
    container.appendChild(wrap);
  });
}

function buildForm(p) {
  const num=G.projects.findIndex(x=>x.id===p.id)+1;
  const B=G.blocks;
  const canRemove=G.mode!=='single';
  return `
  <div class="proj-header-bar">
    <div class="proj-color-circle" style="background:${p.color}">${String(num).padStart(2,'0')}</div>
    <div style="flex:1">
      <div class="proj-header-name" id="projHN-${p.id}">${p.name||'Novo Projeto'}</div>
      <div class="proj-header-sub">Preencha as seções — expanda para editar</div>
    </div>
    ${canRemove?`<button class="btn btn-danger btn-xs" onclick="removeProject('${p.id}')">Remover</button>`:''}
  </div>

  ${accord(p,'ident','Identificação',true,`
    <div class="frow c2">
      <div class="field"><label>Nome do Projeto</label>
        <input value="${esc(p.name)}" placeholder="Ex: Lean no Bloco Cirúrgico" oninput="pset('${p.id}','name',this.value);document.getElementById('projHN-${p.id}').textContent=this.value||'Novo Projeto';renderProjTabs()">
      </div>
      <div class="field"><label>Líder / Responsável</label>
        <input value="${esc(p.leader)}" placeholder="Nome do líder" oninput="pset('${p.id}','leader',this.value)">
      </div>
      <div class="field"><label>Início</label><input type="date" value="${p.periodo_inicio}" oninput="pset('${p.id}','periodo_inicio',this.value)"></div>
      <div class="field"><label>Conclusão</label><input type="date" value="${p.periodo_fim}" oninput="pset('${p.id}','periodo_fim',this.value)"></div>
      <div class="field"><label>Status</label>
        <select oninput="pset('${p.id}','status',this.value)">
          ${['Concluído','Em andamento','Pausado','Cancelado'].map(s=>`<option ${p.status===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
    </div>
  `)}

  ${accord(p,'objetivo','Objetivo',B.objetivo?.enabled,`
    <div class="field"><label>Qual problema ou oportunidade o projeto buscou resolver?</label>
      <textarea rows="4" placeholder="Descreva o contexto, o problema identificado e o que o projeto buscou alcançar..." oninput="pset('${p.id}','objetivo',this.value)">${esc(p.objetivo)}</textarea>
    </div>
  `)}

  ${accord(p,'team','Equipe',B.team?.enabled,`
    <div class="rep-list" id="team-${p.id}">
      ${p.team.map((t,i)=>repTeam(p.id,i)).join('')}
    </div>
    <button class="btn-addrow" onclick="addRep('${p.id}','team',{nome:'',cargo:''})">+ Adicionar membro</button>
  `)}

  ${accord(p,'etapas','Etapas do Projeto',B.etapas?.enabled,`
    <div class="rep-list" id="etapas-${p.id}">
      ${p.etapas.map((e,i)=>repEtapa(p.id,i)).join('')}
    </div>
    <button class="btn-addrow" onclick="addRep('${p.id}','etapas',{titulo:'',descricao:''})">+ Adicionar etapa</button>
  `)}

  ${accord(p,'marcos','Marcos / Timeline',B.marcos?.enabled,`
    <div class="rep-list" id="marcos-${p.id}">
      ${p.marcos.map((m,i)=>repMarco(p.id,i)).join('')}
    </div>
    <button class="btn-addrow" onclick="addRep('${p.id}','marcos',{data:'',entrega:''})">+ Adicionar marco</button>
  `)}

  ${accord(p,'indicadores','Indicadores KPI',B.indicadores?.enabled,`
    <div class="rep-list" id="indicadores-${p.id}">
      ${p.indicadores.map((ind,i)=>repIndic(p.id,i)).join('')}
    </div>
    <button class="btn-addrow" onclick="addRep('${p.id}','indicadores',{nome:'',meta:'',realizado:''})">+ Adicionar indicador</button>
  `)}

  ${accord(p,'resultados','Resultados',B.resultados?.enabled,`
    <div class="rep-list" id="resultados-${p.id}">
      ${p.resultados.map((r,i)=>repResult(p.id,i)).join('')}
    </div>
    <button class="btn-addrow" onclick="addRep('${p.id}','resultados',{metrica:'',absoluto:'',percentual:''})">+ Adicionar resultado</button>
  `)}

  ${accord(p,'antesdepois','Antes & Depois',B.antesdepois?.enabled,`
    <div class="ba-grid">
      <div class="ba-panel">
        <div class="ba-head bef">← Antes</div>
        <div class="ba-body">
          <div class="field"><label>Título</label><input value="${esc(p.antesdepois.antes_titulo)}" placeholder="Situação anterior" oninput="psetD('${p.id}','antesdepois','antes_titulo',this.value)"></div>
          <div class="field"><label>Descrição</label><textarea rows="2" oninput="psetD('${p.id}','antesdepois','antes_desc',this.value)">${esc(p.antesdepois.antes_desc)}</textarea></div>
          <div class="img-slot" onclick="triggerUp('uBA-antes-${p.id}')">
            <input type="file" id="uBA-antes-${p.id}" accept="image/*" onchange="handleBAImg('${p.id}','antes',this)">
            <img class="prev" id="prev-BA-antes-${p.id}">
            <div class="img-slot-icon">🖼</div><div class="img-slot-label">Foto Antes</div>
            <button class="img-rm" id="rmBA-antes-${p.id}" onclick="rmBAImg(event,'${p.id}','antes')">✕</button>
          </div>
        </div>
      </div>
      <div class="ba-panel">
        <div class="ba-head aft">→ Depois</div>
        <div class="ba-body">
          <div class="field"><label>Título</label><input value="${esc(p.antesdepois.depois_titulo)}" placeholder="Situação atual" oninput="psetD('${p.id}','antesdepois','depois_titulo',this.value)"></div>
          <div class="field"><label>Descrição</label><textarea rows="2" oninput="psetD('${p.id}','antesdepois','depois_desc',this.value)">${esc(p.antesdepois.depois_desc)}</textarea></div>
          <div class="img-slot" onclick="triggerUp('uBA-depois-${p.id}')">
            <input type="file" id="uBA-depois-${p.id}" accept="image/*" onchange="handleBAImg('${p.id}','depois',this)">
            <img class="prev" id="prev-BA-depois-${p.id}">
            <div class="img-slot-icon">🖼</div><div class="img-slot-label">Foto Depois</div>
            <button class="img-rm" id="rmBA-depois-${p.id}" onclick="rmBAImg(event,'${p.id}','depois')">✕</button>
          </div>
        </div>
      </div>
    </div>
  `)}

  ${accord(p,'evidencias','Evidências',B.evidencias?.enabled,`
    <div class="img-grid g4">
      ${[0,1,2,3].map(i=>`
        <div class="img-slot" onclick="triggerUp('uEv-${p.id}-${i}')">
          <input type="file" id="uEv-${p.id}-${i}" accept="image/*" onchange="handleEvImg('${p.id}',${i},this)">
          <img class="prev" id="prev-ev-${p.id}-${i}">
          <div class="img-slot-icon">🖼</div><div class="img-slot-label">Ev. ${i+1}</div>
          <button class="img-rm" id="rmEv-${p.id}-${i}" onclick="rmEvImg(event,'${p.id}',${i})">✕</button>
        </div>
      `).join('')}
    </div>
  `)}

  ${accord(p,'riscos','Riscos & Atenção',B.riscos?.enabled,`
    <div class="rep-list" id="riscos-${p.id}">
      ${p.riscos.map((r,i)=>repTexto(p.id,'riscos',i,'Risco ou ponto de atenção identificado...')).join('')}
    </div>
    <button class="btn-addrow" onclick="addRep('${p.id}','riscos',{texto:''})">+ Adicionar risco</button>
  `)}

  ${accord(p,'licoes','Lições Aprendidas',B.licoes?.enabled,`
    <div class="rep-list" id="licoes-${p.id}">
      ${p.licoes.map((l,i)=>repTexto(p.id,'licoes',i,'Lição aprendida durante a execução...')).join('')}
    </div>
    <button class="btn-addrow" onclick="addRep('${p.id}','licoes',{texto:''})">+ Adicionar lição</button>
  `)}

  ${accord(p,'desafios','Desafios Futuros',B.desafios?.enabled,`
    <div class="field"><label>Continuidade, acompanhamento e desdobramentos estratégicos</label>
      <textarea rows="4" oninput="pset('${p.id}','desafios',this.value)">${esc(p.desafios)}</textarea>
    </div>
  `)}

  ${accord(p,'panorama','Panorama BI',B.panorama?.enabled,`
    <div class="img-grid g2" style="margin-bottom:.75rem">
      <div class="img-slot" onclick="triggerUp('uBI25-${p.id}')">
        <input type="file" id="uBI25-${p.id}" accept="image/*" onchange="handleGlobal('bi2025',this)">
        <img class="prev" id="prev-bi2025">
        <div class="img-slot-icon">📊</div><div class="img-slot-label">BI Ano Anterior</div>
        <button class="img-rm" id="rmbi2025" onclick="rmGlobal(event,'bi2025')">✕</button>
      </div>
      <div class="img-slot" onclick="triggerUp('uBI26-${p.id}')">
        <input type="file" id="uBI26-${p.id}" accept="image/*" onchange="handleGlobal('bi2026',this)">
        <img class="prev" id="prev-bi2026">
        <div class="img-slot-icon">📈</div><div class="img-slot-label">BI Atual</div>
        <button class="img-rm" id="rmbi2026" onclick="rmGlobal(event,'bi2026')">✕</button>
      </div>
    </div>
    <div style="font-size:.68rem;color:var(--muted)">Esses prints aparecerão no slide de Panorama, antes dos projetos.</div>
  `)}
  `;
}

function accord(p, key, label, startOpen, body) {
  const b = G.blocks[key];
  const enabled = b ? b.enabled : true;
  const isReq = b?.required;
  const open = startOpen;
  return `
  <div class="accord">
    <div class="accord-head ${enabled||!b?'enabled':''} ${open?'open':''}" onclick="toggleAccord(this)">
      <div class="accord-enabled"></div>
      <span class="accord-label">${label}</span>
      ${b?`<span class="accord-badge ${isReq?'req':'opt'}">${isReq?'obrigatório':'opcional'}</span>`:''}
      <span class="accord-arrow">▾</span>
    </div>
    <div class="accord-body ${open?'open':''}">${body}</div>
  </div>`;
}

function toggleAccord(head) {
  head.classList.toggle('open');
  head.nextElementSibling.classList.toggle('open');
}

// Rep item builders
function repTeam(pid,i){
  const t=getProj(pid).team[i]||{nome:'',cargo:''};
  return `<div class="rep-item"><div class="rep-num">${i+1}</div><div class="rep-fields"><div class="frow c2"><div class="field"><label>Nome</label><input value="${esc(t.nome)}" placeholder="Nome completo" oninput="psetR('${pid}','team',${i},'nome',this.value)"></div><div class="field"><label>Cargo</label><input value="${esc(t.cargo)}" placeholder="Ex: Gestora" oninput="psetR('${pid}','team',${i},'cargo',this.value)"></div></div></div><button class="rep-rm" onclick="removeRep('${pid}','team',${i})">✕</button></div>`;
}
function repEtapa(pid,i){
  const e=getProj(pid).etapas[i]||{titulo:'',descricao:''};
  return `<div class="rep-item"><div class="rep-num">${i+1}</div><div class="rep-fields"><div class="frow c2"><div class="field"><label>Título</label><input value="${esc(e.titulo)}" placeholder="Ex: Diagnóstico" oninput="psetR('${pid}','etapas',${i},'titulo',this.value)"></div><div class="field"><label>Descrição</label><input value="${esc(e.descricao)}" placeholder="O que aconteceu..." oninput="psetR('${pid}','etapas',${i},'descricao',this.value)"></div></div></div><button class="rep-rm" onclick="removeRep('${pid}','etapas',${i})">✕</button></div>`;
}
function repMarco(pid,i){
  const m=getProj(pid).marcos[i]||{data:'',entrega:''};
  return `<div class="rep-item"><div class="rep-num">${i+1}</div><div class="rep-fields"><div class="frow c2"><div class="field"><label>Data</label><input type="date" value="${m.data}" oninput="psetR('${pid}','marcos',${i},'data',this.value)"></div><div class="field"><label>Milestone</label><input value="${esc(m.entrega)}" placeholder="Ex: Sistema homologado" oninput="psetR('${pid}','marcos',${i},'entrega',this.value)"></div></div></div><button class="rep-rm" onclick="removeRep('${pid}','marcos',${i})">✕</button></div>`;
}
function repIndic(pid,i){
  const ind=getProj(pid).indicadores[i]||{nome:'',meta:'',realizado:''};
  return `<div class="rep-item"><div class="rep-num">${i+1}</div><div class="rep-fields"><div class="frow c3"><div class="field"><label>KPI</label><input value="${esc(ind.nome)}" placeholder="Ex: NPS" oninput="psetR('${pid}','indicadores',${i},'nome',this.value)"></div><div class="field"><label>Meta</label><input value="${esc(ind.meta)}" placeholder="90%" oninput="psetR('${pid}','indicadores',${i},'meta',this.value)"></div><div class="field"><label>Realizado</label><input value="${esc(ind.realizado)}" placeholder="93%" oninput="psetR('${pid}','indicadores',${i},'realizado',this.value)"></div></div></div><button class="rep-rm" onclick="removeRep('${pid}','resultados',${i})">✕</button></div>`;
}
function repResult(pid,i){
  const r=getProj(pid).resultados[i]||{metrica:'',absoluto:'',percentual:''};
  return `<div class="rep-item"><div class="rep-num">${i+1}</div><div class="rep-fields"><div class="frow c3"><div class="field"><label>Métrica</label><input value="${esc(r.metrica)}" placeholder="Ex: Novos leitos" oninput="psetR('${pid}','resultados',${i},'metrica',this.value)"></div><div class="field"><label>Absoluto</label><input value="${esc(r.absoluto)}" placeholder="Ex: 20" oninput="psetR('${pid}','resultados',${i},'absoluto',this.value)"></div><div class="field"><label>%</label><input value="${esc(r.percentual)}" placeholder="+56%" oninput="psetR('${pid}','resultados',${i},'percentual',this.value)"></div></div></div><button class="rep-rm" onclick="removeRep('${pid}','resultados',${i})">✕</button></div>`;
}
function repTexto(pid,field,i,ph){
  const item=getProj(pid)[field][i]||{texto:''};
  return `<div class="rep-item"><div class="rep-num">${i+1}</div><div class="rep-fields"><div class="field"><textarea rows="2" placeholder="${ph}" oninput="psetR('${pid}','${field}',${i},'texto',this.value)">${esc(item.texto)}</textarea></div></div><button class="rep-rm" onclick="removeRep('${pid}','${field}',${i})">✕</button></div>`;
}

function addRep(pid, field, template) {
  const p=getProj(pid);if(!p)return;
  p[field].push({...template});
  const list=document.getElementById(field+'-'+pid);if(!list)return;
  const i=p[field].length-1;
  const builders={team:repTeam,etapas:repEtapa,marcos:repMarco,indicadores:repIndic,resultados:repResult};
  let html='';
  if(builders[field]) html=builders[field](pid,i);
  else if(field==='riscos') html=repTexto(pid,'riscos',i,'Risco ou ponto de atenção...');
  else if(field==='licoes') html=repTexto(pid,'licoes',i,'Lição aprendida...');
  list.insertAdjacentHTML('beforeend',html);
}

function removeRep(pid,field,idx){
  const p=getProj(pid);if(!p)return;
  if(p[field].length<=1)return;
  p[field].splice(idx,1);
  const list=document.getElementById(field+'-'+pid);if(!list)return;
  const builders={team:repTeam,etapas:repEtapa,marcos:repMarco,indicadores:repIndic,resultados:repResult};
  if(builders[field]) list.innerHTML=p[field].map((_,i)=>builders[field](pid,i)).join('');
  else if(field==='riscos') list.innerHTML=p.riscos.map((_,i)=>repTexto(pid,'riscos',i,'Risco...')).join('');
  else if(field==='licoes') list.innerHTML=p.licoes.map((_,i)=>repTexto(pid,'licoes',i,'Lição...')).join('');
}

// ════════════════════════════════════════════════════
// UPLOADS
// ════════════════════════════════════════════════════
function triggerUp(id){ document.getElementById(id)?.click(); }

function handleLogo(key, input) {
  const file=input.files[0];if(!file)return;
  const r=new FileReader();
  r.onload=e=>{
    G.id[key]=e.target.result;
    const prev=document.getElementById('prev-'+key);
    if(prev){prev.src=e.target.result;prev.classList.add('show');}
    const rm=document.getElementById('rm'+key.charAt(0).toUpperCase()+key.slice(1));
    if(rm)rm.classList.add('show');
    toast(file.name+' carregado','ok');
  };
  r.readAsDataURL(file);
}

function rmLogo(evt,key){
  evt.stopPropagation();G.id[key]=null;
  const prev=document.getElementById('prev-'+key);if(prev){prev.src='';prev.classList.remove('show');}
}

function handleGlobal(key,input){
  const file=input.files[0];if(!file)return;
  const r=new FileReader();
  r.onload=e=>{
    G.id[key]=e.target.result;
    const prev=document.getElementById('prev-'+key);
    if(prev){prev.src=e.target.result;prev.classList.add('show');}
    const rm=document.getElementById('rm'+key);
    if(rm)rm.classList.add('show');
  };
  r.readAsDataURL(file);
}

function rmGlobal(evt,key){
  evt.stopPropagation();G.id[key]=null;
  const prev=document.getElementById('prev-'+key);if(prev){prev.src='';prev.classList.remove('show');}
}

function handleEvImg(pid,idx,input){
  const p=getProj(pid);if(!p)return;
  const file=input.files[0];if(!file)return;
  const r=new FileReader();
  r.onload=e=>{
    p.evidencias[idx]=e.target.result;
    const prev=document.getElementById(`prev-ev-${pid}-${idx}`);
    if(prev){prev.src=e.target.result;prev.classList.add('show');}
  };
  r.readAsDataURL(file);
}

function rmEvImg(evt,pid,idx){
  evt.stopPropagation();const p=getProj(pid);if(!p)return;
  p.evidencias[idx]=null;
  const prev=document.getElementById(`prev-ev-${pid}-${idx}`);
  if(prev){prev.src='';prev.classList.remove('show');}
}

function handleBAImg(pid,side,input){
  const p=getProj(pid);if(!p)return;
  const file=input.files[0];if(!file)return;
  const r=new FileReader();
  r.onload=e=>{
    p.antesdepois[side+'_img']=e.target.result;
    const prev=document.getElementById(`prev-BA-${side}-${pid}`);
    if(prev){prev.src=e.target.result;prev.classList.add('show');}
  };
  r.readAsDataURL(file);
}

function rmBAImg(evt,pid,side){
  evt.stopPropagation();const p=getProj(pid);if(!p)return;
  p.antesdepois[side+'_img']=null;
  const prev=document.getElementById(`prev-BA-${side}-${pid}`);
  if(prev){prev.src='';prev.classList.remove('show');}
}

// ════════════════════════════════════════════════════
// GENERATE STEP
// ════════════════════════════════════════════════════
function renderGenSummary() {
  const el=document.getElementById('genSummary');if(!el)return;
  const checks=[
    {label:'Identidade — Nome da instituição',ok:!!G.id.instName,val:G.id.instName},
    {label:'Identidade — Título da apresentação',ok:!!G.id.presTitle,val:G.id.presTitle},
    {label:'Tema Visual',ok:true,val:THEMES[G.theme]?.name},
    ...G.projects.map(p=>({label:`Projeto: ${p.name||'(sem nome)'}`,ok:!!(p.name&&p.objetivo),val:p.status}))
  ];
  el.innerHTML=`<div style="font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;margin-bottom:1rem">Resumo da Apresentação</div>`+
    checks.map(c=>`
    <div class="gen-row">
      <div class="gen-status ${c.ok?'ok':'pending'}">${c.ok?'✓':'!'}</div>
      <span class="gen-label">${c.label}</span>
      <span class="gen-val">${c.ok?c.val:c.ok===false?'pendente':''}</span>
    </div>
  `).join('');
}

function renderSlideList() {
  const el=document.getElementById('slideList');if(!el)return;
  const B=G.blocks;
  let n=0;const rows=[];
  const add=(label,main)=>{ n++; rows.push({n,label,main}); };
  add('Capa',true);
  if(G.mode!=='single') add('Sumário',true);
  if(B.panorama?.enabled) add('Panorama BI',true);
  G.projects.forEach((p,i)=>{
    const tag=`Projeto ${String(i+1).padStart(2,'0')}${p.name?' · '+p.name:''}`;
    add(`Divisor — ${tag}`,true);
    if(B.objetivo?.enabled) add('Objetivo',false);
    if(B.team?.enabled) add('Equipe',false);
    if(B.etapas?.enabled) add('Etapas',false);
    if(B.marcos?.enabled) add('Marcos / Timeline',false);
    if(B.indicadores?.enabled) add('Indicadores KPI',false);
    if(B.resultados?.enabled) add('Resultados',false);
    if(B.antesdepois?.enabled) add('Antes & Depois',false);
    if(B.evidencias?.enabled) add('Evidências',false);
    if(B.riscos?.enabled) add('Riscos',false);
    if(B.licoes?.enabled) add('Lições Aprendidas',false);
    if(B.desafios?.enabled) add('Desafios Futuros',false);
  });
  if(B.encerramento?.enabled) add('Encerramento',true);
  el.innerHTML=rows.map(r=>`
    <div class="slide-row ${r.main?'main':'sub'}">
      <span class="slide-row-num">${String(r.n).padStart(2,'0')}</span>
      ${r.label}
    </div>
  `).join('');
}

function setProgress(show,pct,msg){
  const w=document.getElementById('progWrap');
  const b=document.getElementById('progBar');
  const m=document.getElementById('progMsg');
  if(w) w.style.display=show?'block':'none';
  if(b) b.style.width=pct+'%';
  if(m) m.textContent=msg||'';
}

// ════════════════════════════════════════════════════
// TOAST
// ════════════════════════════════════════════════════
function toast(msg,type='info'){
  const w=document.getElementById('toastWrap');
  const t=document.createElement('div');
  t.className=`toast ${type}`;t.textContent=msg;
  w.appendChild(t);setTimeout(()=>t.remove(),4000);
}

// ════════════════════════════════════════════════════
// DRAFT
// ════════════════════════════════════════════════════
function saveDraft(){
  try{
    const snap={mode:G.mode,theme:G.theme,
      id:{...G.id,logoInst:null,logoProg:null,bi2025:null,bi2026:null},
      projects:G.projects.map(p=>({...p,evidencias:[null,null,null,null],antesdepois:{...p.antesdepois,antes_img:null,depois_img:null}})),
      blocks:G.blocks,ts:new Date().toISOString()};
    const blob=new Blob([JSON.stringify(snap,null,2)],{type:'application/json'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='wren-rascunho.json';a.click();
    toast('Rascunho salvo (imagens não incluídas)','ok');
  }catch(e){toast('Erro ao salvar','err');}
}

// ════════════════════════════════════════════════════
// PPTX GENERATOR
// ════════════════════════════════════════════════════
async function generatePptx() {
  const T=THEMES[G.theme];const C=T.C;
  setProgress(true,5,'Iniciando...');

  const pres=new PptxGenJS();
  pres.layout='LAYOUT_WIDE';
  const W=13.33,H=7.5;
  const total=countSlides();
  let done=0;
  const tick=async(msg)=>{ done++; setProgress(true,Math.round(done/total*90)+5,msg); await new Promise(r=>requestAnimationFrame(r)); };

  // HELPER FUNS
  const base=()=>{
    const s=pres.addSlide();
    s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:W,h:H,fill:{color:C.bg}});
    return s;
  };
  const footer=(s,projName)=>{
    s.addShape(pres.shapes.RECTANGLE,{x:0,y:H-.35,w:W,h:.35,fill:{color:C.bg2},line:{width:0}});
    if(G.id.instName) s.addText(G.id.instName,{x:.3,y:H-.28,w:5,h:.22,fontSize:7,color:C.muted,fontFace:'Calibri Light',margin:0});
    if(projName) s.addText(projName,{x:W/2-2,y:H-.28,w:4,h:.22,fontSize:7,color:C.muted,fontFace:'Calibri Light',align:'center',margin:0});
    if(G.id.presDate) s.addText(G.id.presDate,{x:W-3.3,y:H-.28,w:3,h:.22,fontSize:7,color:C.muted,fontFace:'Calibri Light',align:'right',margin:0});
  };
  const tag=(s,text,x,y)=>{
    s.addShape(pres.shapes.RECTANGLE,{x,y,w:text.length*.09+.3,h:.22,fill:{color:C.a1}});
    s.addText(text,{x:x+.08,y:y+.02,w:text.length*.09+.2,h:.18,fontSize:6.5,color:'FFFFFF',fontFace:'Calibri',bold:true,charSpacing:1.5,margin:0});
  };

  // CAPA
  await tick('Capa...');
  {
    const s=base();
    // diagonal accent block
    s.addShape(pres.shapes.RECTANGLE,{x:W*.55,y:0,w:W*.45,h:H,fill:{color:C.bg2},line:{width:0}});
    s.addShape(pres.shapes.RECTANGLE,{x:0,y:H-1.2,w:W*.55,h:.04,fill:{color:C.a1},line:{width:0}});
    s.addShape(pres.shapes.RECTANGLE,{x:0,y:H-1.2,w:2.5,h:.04,fill:{color:C.a2},line:{width:0}});
    // eyebrow
    if(G.id.instDept) s.addText(G.id.instDept.toUpperCase(),{x:.55,y:1.6,w:6,h:.28,fontSize:8,color:C.muted,fontFace:'Calibri Light',charSpacing:2.5,margin:0});
    // title
    s.addText(G.id.presTitle||'Apresentação',{x:.55,y:2.0,w:6.5,h:2.5,fontSize:44,color:C.txt,fontFace:'Calibri',bold:true,lineSpacingMultiple:.9,margin:0});
    // subtitle
    if(G.id.presSub) s.addText(G.id.presSub,{x:.55,y:4.6,w:6.5,h:.6,fontSize:14,color:C.muted,fontFace:'Calibri Light',margin:0});
    // meta
    if(G.id.instName) s.addText(G.id.instName,{x:.55,y:H-1.0,w:5,h:.28,fontSize:10,color:C.txt,fontFace:'Calibri',bold:false,margin:0});
    if(G.id.presDate) s.addText(G.id.presDate,{x:.55,y:H-.7,w:5,h:.22,fontSize:9,color:C.muted,fontFace:'Calibri Light',margin:0});
    // portfolio list
    if(G.mode!=='single') {
      G.projects.forEach((p,i)=>{
        const y=2.2+i*.38;
        s.addShape(pres.shapes.RECTANGLE,{x:W*.57,y:y,w:.05,h:.25,fill:{color:p.color||C.a1},line:{width:0}});
        s.addText(p.name||'Projeto',{x:W*.58,y:y,w:4.8,h:.28,fontSize:12,color:C.txt,fontFace:'Calibri',bold:false,margin:0});
      });
    }
    // logos
    if(G.id.logoInst) s.addImage({data:G.id.logoInst,x:W*.57,y:.5,w:2,h:1,sizing:{type:'contain',w:2,h:1}});
    if(G.id.logoProg) s.addImage({data:G.id.logoProg,x:W*.81,y:.5,w:2,h:1,sizing:{type:'contain',w:2,h:1}});
  }

  // SUMARIO
  if(G.mode!=='single'){
    await tick('Sumário...');
    const s=base();
    tag(s,'SUMÁRIO',.55,.35);
    s.addText('Projetos nesta apresentação',{x:.55,y:.55,w:8,h:.55,fontSize:22,color:C.txt,fontFace:'Calibri',bold:true,margin:0});
    G.projects.forEach((p,i)=>{
      const x=.55+(i%2)*6.1,y=1.5+Math.floor(i/2)*.95;
      s.addShape(pres.shapes.RECTANGLE,{x,y,w:5.9,h:.82,fill:{color:C.bg2},line:{color:C.bg2,width:.5}});
      s.addShape(pres.shapes.RECTANGLE,{x,y,w:.04,h:.82,fill:{color:p.color||C.a1},line:{width:0}});
      s.addText(String(i+1).padStart(2,'0'),{x:x+.15,y:y+.12,w:.55,h:.55,fontSize:26,color:p.color||C.a1,fontFace:'Calibri',bold:true,margin:0});
      s.addText(p.name||'Projeto',{x:x+.85,y:y+.12,w:4.85,h:.3,fontSize:12,color:C.txt,fontFace:'Calibri',bold:true,margin:0});
      if(p.leader) s.addText(p.leader,{x:x+.85,y:y+.5,w:4.85,h:.22,fontSize:9,color:C.muted,fontFace:'Calibri Light',margin:0});
    });
    footer(s,'');
  }

  // PANORAMA
  if(G.blocks.panorama?.enabled){
    await tick('Panorama BI...');
    const s=base();
    tag(s,'PANORAMA',.55,.35);
    s.addText('Contexto de Dados',{x:.55,y:.55,w:8,h:.55,fontSize:22,color:C.txt,fontFace:'Calibri',bold:true,margin:0});
    const sides=[{key:'bi2025',label:'ANO ANTERIOR'},{key:'bi2026',label:'ANO ATUAL'}];
    sides.forEach((sd,i)=>{
      const x=.55+i*6.3;
      if(G.id[sd.key]) s.addImage({data:G.id[sd.key],x,y:1.4,w:6,h:5.55,sizing:{type:'contain',w:6,h:5.55}});
      else {
        s.addShape(pres.shapes.RECTANGLE,{x,y:1.4,w:6,h:5.55,fill:{color:C.bg2},line:{color:C.bg2,width:.5}});
        s.addText(`[ ${sd.label} ]`,{x,y:3.9,w:6,h:.4,align:'center',fontSize:12,color:C.muted,fontFace:'Calibri Light',margin:0});
      }
    });
    footer(s,'');
  }

  // PER PROJECT
  for(let pi=0;pi<G.projects.length;pi++){
    const p=G.projects[pi];
    const B=G.blocks;

    // DIVISOR
    await tick(`Divisor ${p.name||pi+1}...`);
    {
      const s=base();
      s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:W,h:H,fill:{color:C.bg2}});
      s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:.08,h:H,fill:{color:p.color||C.a1},line:{width:0}});
      s.addShape(pres.shapes.RECTANGLE,{x:0,y:H-1.5,w:W,h:.04,fill:{color:p.color||C.a1},line:{width:0}});
      s.addShape(pres.shapes.RECTANGLE,{x:0,y:H-1.5,w:2,h:.04,fill:{color:C.bg},line:{width:0}});
      s.addText(`${String(pi+1).padStart(2,'0')}`,{x:1.2,y:1.2,w:4,h:3,fontSize:140,color:C.bg3||C.bg,fontFace:'Calibri',bold:true,margin:0,transparency:95});
      s.addText(G.mode==='single'?'PROJETO':`PROJETO ${String(pi+1).padStart(2,'0')}`,{x:1.2,y:2.0,w:9,h:.28,fontSize:9,color:C.muted,fontFace:'Calibri Light',charSpacing:3,margin:0});
      s.addText(p.name||'Projeto',{x:1.2,y:2.3,w:9,h:2.2,fontSize:46,color:C.txt,fontFace:'Calibri',bold:true,lineSpacingMultiple:.9,margin:0});
      if(p.leader) s.addText(p.leader,{x:1.2,y:5.0,w:8,h:.32,fontSize:14,color:C.muted,fontFace:'Calibri Light',margin:0});
      const dt=[];
      if(p.periodo_inicio) dt.push(new Date(p.periodo_inicio).toLocaleDateString('pt-BR',{month:'short',year:'numeric'}));
      if(p.periodo_fim) dt.push(new Date(p.periodo_fim).toLocaleDateString('pt-BR',{month:'short',year:'numeric'}));
      if(dt.length) s.addText(dt.join(' → '),{x:1.2,y:5.4,w:8,h:.3,fontSize:10,color:p.color||C.a2,fontFace:'Calibri',bold:true,margin:0});
      s.addShape(pres.shapes.RECTANGLE,{x:W-1.8,y:.5,w:1.35,h:.35,fill:{color:p.status==='Concluído'?C.teal||C.a2:C.gold,transparency:85}});
      s.addText(p.status,{x:W-1.8,y:.52,w:1.35,h:.3,align:'center',fontSize:8,color:p.status==='Concluído'?C.teal||C.a2:C.gold,fontFace:'Calibri',bold:true,margin:0});
    }

    // OBJETIVO
    if(B.objetivo?.enabled){
      await tick(`Objetivo ${p.name||pi+1}...`);
      const s=base();
      s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:.06,h:H,fill:{color:p.color||C.a1},line:{width:0}});
      tag(s,'OBJETIVO',.35,.3);
      s.addText('Problema & Oportunidade',{x:.35,y:.52,w:9.3,h:.55,fontSize:22,color:C.txt,fontFace:'Calibri',bold:true,margin:0});
      if(p.objetivo){
        s.addShape(pres.shapes.RECTANGLE,{x:.35,y:1.35,w:9.3,h:4.9,fill:{color:C.bg2},line:{width:0}});
        s.addShape(pres.shapes.RECTANGLE,{x:.35,y:1.35,w:.04,h:4.9,fill:{color:p.color||C.a1},line:{width:0}});
        s.addText(p.objetivo,{x:.6,y:1.55,w:8.9,h:4.5,fontSize:14,color:C.txt,fontFace:'Calibri Light',lineSpacingMultiple:1.5,margin:0});
      }
      footer(s,p.name);
    }

    // EQUIPE
    if(B.team?.enabled){
      await tick(`Equipe ${p.name||pi+1}...`);
      const s=base();
      s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:.06,h:H,fill:{color:p.color||C.a1},line:{width:0}});
      tag(s,'EQUIPE',.35,.3);
      s.addText('Quem realizou',{x:.35,y:.52,w:9.3,h:.55,fontSize:22,color:C.txt,fontFace:'Calibri',bold:true,margin:0});
      const team=p.team.filter(t=>t.nome);
      team.forEach((t,i)=>{
        const cols=Math.min(team.length,4);
        const bw=(9.3/cols)-.15;
        const x=.35+i*(bw+.15);
        if(i>=4)return;
        s.addShape(pres.shapes.RECTANGLE,{x,y:1.35,w:bw,h:3.9,fill:{color:C.bg2},line:{width:0}});
        s.addShape(pres.shapes.RECTANGLE,{x,y:1.35,w:bw,h:.04,fill:{color:p.color||C.a1},line:{width:0}});
        s.addShape(pres.shapes.RECTANGLE,{x:x+bw/2-.35,y:1.6,w:.7,h:.7,fill:{color:p.color||C.a1,transparency:80}});
        s.addText(t.nome.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase(),{x:x+bw/2-.35,y:1.62,w:.7,h:.65,align:'center',fontSize:16,color:p.color||C.a1,fontFace:'Calibri',bold:true,margin:0});
        s.addText(t.nome,{x:x+.1,y:2.5,w:bw-.2,h:.6,align:'center',fontSize:11,color:C.txt,fontFace:'Calibri',bold:true,lineSpacingMultiple:1,margin:0});
        s.addText(t.cargo,{x:x+.1,y:3.2,w:bw-.2,h:.7,align:'center',fontSize:9,color:C.muted,fontFace:'Calibri Light',lineSpacingMultiple:1.3,margin:0});
      });
      footer(s,p.name);
    }

    // ETAPAS
    if(B.etapas?.enabled){
      await tick(`Etapas ${p.name||pi+1}...`);
      const s=base();
      s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:.06,h:H,fill:{color:p.color||C.a1},line:{width:0}});
      tag(s,'ETAPAS',.35,.3);
      s.addText('Jornada de Execução',{x:.35,y:.52,w:9.3,h:.55,fontSize:22,color:C.txt,fontFace:'Calibri',bold:true,margin:0});
      const etapas=p.etapas.filter(e=>e.titulo);
      const n=Math.min(etapas.length,6);
      const bw=9.3/n-.12;
      etapas.slice(0,n).forEach((e,i)=>{
        const x=.35+i*(bw+.12);
        s.addShape(pres.shapes.RECTANGLE,{x,y:1.35,w:bw,h:4.9,fill:{color:C.bg2},line:{width:0}});
        s.addShape(pres.shapes.RECTANGLE,{x,y:1.35,w:bw,h:.04,fill:{color:p.color||C.a1,transparency:i*15},line:{width:0}});
        s.addText(String(i+1).padStart(2,'0'),{x:x+.12,y:1.5,w:1,h:.55,fontSize:26,color:p.color||C.a1,fontFace:'Calibri',bold:true,margin:0,transparency:40});
        s.addText(e.titulo,{x:x+.12,y:2.15,w:bw-.24,h:.55,fontSize:12,color:C.txt,fontFace:'Calibri',bold:true,lineSpacingMultiple:1.1,margin:0});
        if(e.descricao) s.addText(e.descricao,{x:x+.12,y:2.82,w:bw-.24,h:3.2,fontSize:9,color:C.muted,fontFace:'Calibri Light',lineSpacingMultiple:1.35,margin:0});
      });
      footer(s,p.name);
    }

    // MARCOS
    if(B.marcos?.enabled){
      await tick(`Marcos ${p.name||pi+1}...`);
      const s=base();
      s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:.06,h:H,fill:{color:p.color||C.a1},line:{width:0}});
      tag(s,'MARCOS',.35,.3);
      s.addText('Timeline do Projeto',{x:.35,y:.52,w:9.3,h:.55,fontSize:22,color:C.txt,fontFace:'Calibri',bold:true,margin:0});
      const marcos=p.marcos.filter(m=>m.entrega);
      // timeline line
      s.addShape(pres.shapes.RECTANGLE,{x:.55,y:3.3,w:9.0,h:.03,fill:{color:C.a1,transparency:60},line:{width:0}});
      const n2=Math.min(marcos.length,6);
      marcos.slice(0,n2).forEach((m,i)=>{
        const x=.55+i*(9.0/(n2>1?n2-1:1));
        const above=i%2===0;
        s.addShape(pres.shapes.RECTANGLE,{x:x-.05,y:3.22,w:.1,h:.2,fill:{color:p.color||C.a1},line:{width:0}});
        s.addShape(pres.shapes.RECTANGLE,{x:x-.015,y:above?1.9:3.45,w:.03,h:above?1.32:1.32,fill:{color:C.a1,transparency:75},line:{width:0}});
        if(m.data) s.addText(new Date(m.data).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}),{x:x-1,y:above?1.62:4.85,w:2,h:.25,align:'center',fontSize:8,color:p.color||C.a2,fontFace:'Calibri',bold:true,margin:0});
        s.addText(m.entrega,{x:x-1.5,y:above?1.0:4.95,w:3,h:.52,align:'center',fontSize:9.5,color:C.txt,fontFace:'Calibri Light',lineSpacingMultiple:1.2,margin:0});
      });
      footer(s,p.name);
    }

    // INDICADORES
    if(B.indicadores?.enabled){
      await tick(`KPIs ${p.name||pi+1}...`);
      const s=base();
      s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:.06,h:H,fill:{color:p.color||C.a1},line:{width:0}});
      tag(s,'INDICADORES',.35,.3);
      s.addText('KPIs do Projeto',{x:.35,y:.52,w:9.3,h:.55,fontSize:22,color:C.txt,fontFace:'Calibri',bold:true,margin:0});
      const inds=p.indicadores.filter(i=>i.nome);
      const n3=Math.min(inds.length,4);
      const bw2=9.3/n3-.15;
      inds.slice(0,n3).forEach((ind,i)=>{
        const x=.35+i*(bw2+.15);
        s.addShape(pres.shapes.RECTANGLE,{x,y:1.35,w:bw2,h:4.9,fill:{color:C.bg2},line:{width:0}});
        s.addShape(pres.shapes.RECTANGLE,{x,y:1.35,w:bw2,h:.04,fill:{color:p.color||C.a1},line:{width:0}});
        s.addText(ind.realizado||'–',{x:x+.15,y:1.55,w:bw2-.3,h:1.2,fontSize:46,color:C.txt,fontFace:'Calibri',bold:true,lineSpacingMultiple:.85,margin:0});
        s.addShape(pres.shapes.RECTANGLE,{x:x+.15,y:2.85,w:bw2-.3,h:.04,fill:{color:C.a1,transparency:70},line:{width:0}});
        if(ind.meta) s.addText(`Meta: ${ind.meta}`,{x:x+.15,y:2.95,w:bw2-.3,h:.28,fontSize:9,color:C.muted,fontFace:'Calibri Light',margin:0});
        s.addText(ind.nome,{x:x+.15,y:3.3,w:bw2-.3,h:2.7,fontSize:10.5,color:C.txt,fontFace:'Calibri Light',lineSpacingMultiple:1.3,margin:0});
      });
      footer(s,p.name);
    }

    // RESULTADOS
    if(B.resultados?.enabled){
      await tick(`Resultados ${p.name||pi+1}...`);
      const s=base();
      s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:.06,h:H,fill:{color:p.color||C.a1},line:{width:0}});
      tag(s,'RESULTADOS',.35,.3);
      s.addText('Impacto Realizado',{x:.35,y:.52,w:9.3,h:.55,fontSize:22,color:C.txt,fontFace:'Calibri',bold:true,margin:0});
      const res=p.resultados.filter(r=>r.metrica);
      const n4=Math.min(res.length,4);
      const bw3=9.3/n4-.15;
      res.slice(0,n4).forEach((r,i)=>{
        const x=.35+i*(bw3+.15);
        s.addShape(pres.shapes.RECTANGLE,{x,y:1.35,w:bw3,h:4.9,fill:{color:C.bg2},line:{width:0}});
        s.addShape(pres.shapes.RECTANGLE,{x,y:1.35,w:bw3,h:.04,fill:{color:p.color||C.a1},line:{width:0}});
        s.addText(r.absoluto||'–',{x:x+.15,y:1.55,w:bw3-.3,h:1.1,fontSize:40,color:C.txt,fontFace:'Calibri',bold:true,lineSpacingMultiple:.85,margin:0});
        if(r.percentual) s.addText(r.percentual,{x:x+.15,y:2.72,w:bw3-.3,h:.32,fontSize:14,color:p.color||C.a2,fontFace:'Calibri',bold:true,margin:0});
        s.addText(r.metrica,{x:x+.15,y:3.15,w:bw3-.3,h:2.95,fontSize:9.5,color:C.muted,fontFace:'Calibri Light',lineSpacingMultiple:1.35,margin:0});
      });
      footer(s,p.name);
    }

    // ANTES DEPOIS
    if(B.antesdepois?.enabled){
      await tick(`Antes/Depois ${p.name||pi+1}...`);
      const s=base();
      const ba=p.antesdepois;
      s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:.06,h:H,fill:{color:C.a2},line:{width:0}});
      tag(s,'ANTES & DEPOIS',.35,.3);
      s.addText('Evidências de Mudança',{x:.35,y:.52,w:9.3,h:.55,fontSize:22,color:C.txt,fontFace:'Calibri',bold:true,margin:0});
      [[{key:'antes',lbl:'← ANTES',col:C.danger},{key:'depois',lbl:'→ DEPOIS',col:C.teal||C.a2}]].flat().forEach((sd,i)=>{
        const x=.35+i*4.85;
        s.addShape(pres.shapes.RECTANGLE,{x,y:1.35,w:4.6,h:5.55,fill:{color:C.bg2},line:{width:0}});
        s.addShape(pres.shapes.RECTANGLE,{x,y:1.35,w:4.6,h:.28,fill:{color:sd.col,transparency:80},line:{width:0}});
        s.addText(sd.lbl,{x:x+.15,y:1.37,w:4.3,h:.23,fontSize:9,color:sd.col,fontFace:'Calibri',bold:true,charSpacing:1.2,margin:0});
        const img=ba[sd.key+'_img'];
        if(img) s.addImage({data:img,x:x+.1,y:1.68,w:4.4,h:2.0,sizing:{type:'cover',w:4.4,h:2.0}});
        else {
          s.addShape(pres.shapes.RECTANGLE,{x:x+.1,y:1.68,w:4.4,h:2.0,fill:{color:C.bg,transparency:30},line:{width:0}});
          s.addText('[ Inserir foto ]',{x:x+.1,y:2.6,w:4.4,h:.3,align:'center',fontSize:9,color:C.muted,fontFace:'Calibri Light',margin:0});
        }
        const tit=ba[sd.key+'_titulo'];const desc=ba[sd.key+'_desc'];
        if(tit) s.addText(tit,{x:x+.15,y:3.82,w:4.3,h:.3,fontSize:11,color:sd.col,fontFace:'Calibri',bold:true,margin:0});
        if(desc) s.addText(desc,{x:x+.15,y:4.2,w:4.3,h:2.5,fontSize:9,color:C.muted,fontFace:'Calibri Light',lineSpacingMultiple:1.3,margin:0});
      });
      footer(s,p.name);
    }

    // EVIDÊNCIAS
    if(B.evidencias?.enabled){
      await tick(`Evidências ${p.name||pi+1}...`);
      const s=base();
      s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:.06,h:H,fill:{color:p.color||C.a1},line:{width:0}});
      tag(s,'EVIDÊNCIAS',.35,.3);
      s.addText('Registros do Projeto',{x:.35,y:.52,w:9.3,h:.55,fontSize:22,color:C.txt,fontFace:'Calibri',bold:true,margin:0});
      const imgs=p.evidencias.filter(Boolean);
      if(!imgs.length){
        s.addShape(pres.shapes.RECTANGLE,{x:.35,y:1.35,w:9.3,h:5.55,fill:{color:C.bg2},line:{width:0}});
        s.addText('[ Evidências a inserir ]',{x:.35,y:3.9,w:9.3,h:.4,align:'center',fontSize:12,color:C.muted,fontFace:'Calibri Light',margin:0});
      } else {
        const n5=imgs.length;
        if(n5===1) s.addImage({data:imgs[0],x:.35,y:1.35,w:9.3,h:5.55,sizing:{type:'cover',w:9.3,h:5.55}});
        else if(n5===2) imgs.forEach((img,i)=>s.addImage({data:img,x:.35+i*4.85,y:1.35,w:4.6,h:5.55,sizing:{type:'cover',w:4.6,h:5.55}}));
        else imgs.slice(0,4).forEach((img,i)=>s.addImage({data:img,x:.35+(i%2)*4.85,y:1.35+(Math.floor(i/2)*2.85),w:4.6,h:2.7,sizing:{type:'cover',w:4.6,h:2.7}}));
      }
      footer(s,p.name);
    }

    // RISCOS
    if(B.riscos?.enabled){
      await tick(`Riscos ${p.name||pi+1}...`);
      const s=base();
      s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:.06,h:H,fill:{color:C.danger},line:{width:0}});
      tag(s,'RISCOS & ATENÇÃO',.35,.3);
      s.addText('Pontos de Atenção',{x:.35,y:.52,w:9.3,h:.55,fontSize:22,color:C.txt,fontFace:'Calibri',bold:true,margin:0});
      const riscos=p.riscos.filter(r=>r.texto);
      riscos.forEach((r,i)=>{
        if(i>=5)return;
        const y=1.4+i*.98;
        s.addShape(pres.shapes.RECTANGLE,{x:.35,y,w:9.3,h:.85,fill:{color:C.bg2},line:{width:0}});
        s.addShape(pres.shapes.RECTANGLE,{x:.35,y,w:.04,h:.85,fill:{color:C.danger},line:{width:0}});
        s.addText(String(i+1),{x:.52,y:y+.22,w:.3,h:.3,fontSize:12,color:C.danger,fontFace:'Calibri',bold:true,margin:0});
        s.addText(r.texto,{x:.95,y:y+.1,w:8.5,h:.68,fontSize:11,color:C.txt,fontFace:'Calibri Light',lineSpacingMultiple:1.3,margin:0});
      });
      footer(s,p.name);
    }

    // LIÇÕES
    if(B.licoes?.enabled){
      await tick(`Lições ${p.name||pi+1}...`);
      const s=base();
      s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:.06,h:H,fill:{color:C.teal||C.a2},line:{width:0}});
      tag(s,'LIÇÕES APRENDIDAS',.35,.3);
      s.addText('O que aprendemos',{x:.35,y:.52,w:9.3,h:.55,fontSize:22,color:C.txt,fontFace:'Calibri',bold:true,margin:0});
      const licoes=p.licoes.filter(l=>l.texto);
      licoes.forEach((l,i)=>{
        if(i>=5)return;
        const y=1.4+i*.98;
        s.addShape(pres.shapes.RECTANGLE,{x:.35,y,w:9.3,h:.85,fill:{color:C.bg2},line:{width:0}});
        s.addShape(pres.shapes.RECTANGLE,{x:.35,y,w:.04,h:.85,fill:{color:C.teal||C.a2},line:{width:0}});
        s.addText(String(i+1),{x:.52,y:y+.22,w:.3,h:.3,fontSize:12,color:C.teal||C.a2,fontFace:'Calibri',bold:true,margin:0});
        s.addText(l.texto,{x:.95,y:y+.1,w:8.5,h:.68,fontSize:11,color:C.txt,fontFace:'Calibri Light',lineSpacingMultiple:1.3,margin:0});
      });
      footer(s,p.name);
    }

    // DESAFIOS
    if(B.desafios?.enabled){
      await tick(`Desafios ${p.name||pi+1}...`);
      const s=base();
      s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:.06,h:H,fill:{color:C.a3||C.a2},line:{width:0}});
      tag(s,'DESAFIOS FUTUROS',.35,.3);
      s.addText('Próximos Passos',{x:.35,y:.52,w:9.3,h:.55,fontSize:22,color:C.txt,fontFace:'Calibri',bold:true,margin:0});
      const areas=[{label:'Continuidade',icon:'↻'},{label:'Acompanhamento',icon:'◉'},{label:'Desdobramentos',icon:'→'}];
      areas.forEach((a,i)=>{
        const x=.35+i*3.2;
        s.addShape(pres.shapes.RECTANGLE,{x,y:1.35,w:3.05,h:5.55,fill:{color:C.bg2},line:{width:0}});
        s.addShape(pres.shapes.RECTANGLE,{x,y:1.35,w:3.05,h:.04,fill:{color:C.a3||C.a2},line:{width:0}});
        s.addText(a.icon,{x:x+.2,y:1.55,w:.5,h:.45,fontSize:18,color:C.a3||C.a2,margin:0});
        s.addText(a.label,{x:x+.2,y:2.12,w:2.65,h:.28,fontSize:10,color:C.a3||C.a2,fontFace:'Calibri',bold:true,margin:0});
        s.addText(p.desafios||'[ A preencher ]',{x:x+.2,y:2.52,w:2.65,h:4.2,fontSize:9,color:C.muted,fontFace:'Calibri Light',lineSpacingMultiple:1.45,margin:0});
      });
      footer(s,p.name);
    }
  } // end for projects

  // ENCERRAMENTO
  if(G.blocks.encerramento?.enabled){
    await tick('Encerramento...');
    const s=pres.addSlide();
    s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:W,h:H,fill:{color:C.bg}});
    s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:W,h:.04,fill:{color:C.a1},line:{width:0}});
    s.addShape(pres.shapes.RECTANGLE,{x:0,y:H-.04,w:W,h:.04,fill:{color:C.a2},line:{width:0}});
    if(G.id.presTitle) s.addText(G.id.presTitle,{x:1,y:.65,w:W-2,h:.32,align:'center',fontSize:10,color:C.muted,fontFace:'Calibri Light',charSpacing:2.5,margin:0});
    s.addText('Obrigado.',{x:1,y:1.1,w:W-2,h:2.5,align:'center',fontSize:80,color:C.txt,fontFace:'Calibri',bold:true,margin:0});
    if(G.id.instName) s.addText(G.id.instName,{x:1,y:3.8,w:W-2,h:.35,align:'center',fontSize:14,color:C.muted,fontFace:'Calibri Light',margin:0});
    if(G.id.presDate) s.addText(G.id.presDate,{x:1,y:4.2,w:W-2,h:.28,align:'center',fontSize:10,color:C.muted,fontFace:'Calibri Light',margin:0});
    if(G.id.logoInst) s.addImage({data:G.id.logoInst,x:W/2-1.75,y:H-1.3,w:1.5,h:.75,sizing:{type:'contain',w:1.5,h:.75}});
    if(G.id.logoProg) s.addImage({data:G.id.logoProg,x:W/2+.25,y:H-1.3,w:1.5,h:.75,sizing:{type:'contain',w:1.5,h:.75}});
  }

  setProgress(true,97,'Exportando arquivo...');
  const fname=(G.id.presTitle||'Wren-Apresentacao').replace(/[^a-zA-Z0-9À-ÿ\s\-_]/g,'').replace(/\s+/g,'-')+'.pptx';
  await pres.writeFile({fileName:fname});
  setProgress(false,100,'Pronto!');
  toast('Apresentação exportada: '+fname,'ok');
}

// ════════════════════════════════════════════════════
// START
// ════════════════════════════════════════════════════
init();

// ═══════════════════════════════════════════════════
// PARTICLE NETWORK — canvas background
// ═══════════════════════════════════════════════════
(function(){
  const canvas = document.getElementById('particleCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles=[], mouse={x:-9999,y:-9999};
  const N=90, MAX_DIST=140, MOUSE_DIST=180;

  function resize(){
    W=canvas.width=window.innerWidth;
    H=canvas.height=window.innerHeight;
  }
  resize();
  window.addEventListener('resize',resize);
  window.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;});

  for(let i=0;i<N;i++){
    particles.push({
      x:Math.random()*window.innerWidth,
      y:Math.random()*window.innerHeight,
      vx:(Math.random()-.5)*.4,
      vy:(Math.random()-.5)*.4,
      r:Math.random()*1.8+.6,
      alpha:Math.random()*.5+.2,
    });
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    // Draw connections
    for(let i=0;i<particles.length;i++){
      const a=particles[i];
      // Mouse repulsion
      const mdx=a.x-mouse.x, mdy=a.y-mouse.y;
      const md=Math.sqrt(mdx*mdx+mdy*mdy);
      if(md<MOUSE_DIST){
        const force=(MOUSE_DIST-md)/MOUSE_DIST*0.6;
        a.vx+=mdx/md*force*0.08;
        a.vy+=mdy/md*force*0.08;
      }
      for(let j=i+1;j<particles.length;j++){
        const b=particles[j];
        const dx=a.x-b.x, dy=a.y-b.y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<MAX_DIST){
          const opacity=(1-d/MAX_DIST)*0.35;
          ctx.beginPath();
          ctx.strokeStyle=`rgba(232,160,32,${opacity})`;
          ctx.lineWidth=.6;
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }
    // Draw dots
    particles.forEach(p=>{
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(232,160,32,${p.alpha})`;
      ctx.fill();
      // Update
      p.x+=p.vx; p.y+=p.vy;
      p.vx*=.99; p.vy*=.99;
      // Drift
      p.vx+=(Math.random()-.5)*.02;
      p.vy+=(Math.random()-.5)*.02;
      // Clamp speed
      const spd=Math.sqrt(p.vx*p.vx+p.vy*p.vy);
      if(spd>1.2){p.vx=p.vx/spd*1.2;p.vy=p.vy/spd*1.2;}
      // Wrap
      if(p.x<-20)p.x=W+20; if(p.x>W+20)p.x=-20;
      if(p.y<-20)p.y=H+20; if(p.y>H+20)p.y=-20;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();
