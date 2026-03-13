// js/main.js
// Código principal da aplicação Wren

import { carregarModelo } from './models/index.js';

// ════════════════════════════════════════════════════
// ESTADO GLOBAL
// ════════════════════════════════════════════════════
const G = {
    mode: 'single',
    step: 'identity',
    selectedModel: 'classico', // modelo padrão
    modeloAtual: null, // será preenchido quando carregar
    theme: 'oceano',
    id: { 
        instName: '', 
        instDept: '', 
        presTitle: '', 
        presDate: '', 
        presSub: '',
        logoInst: null, 
        logoProg: null, 
        bi2025: null, 
        bi2026: null 
    },
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

// ════════════════════════════════════════════════════
// TEMAS
// ════════════════════════════════════════════════════
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
    neon: {
        name:'Neon', desc:'Cores vibrantes e elétricas — moderno e ousado',
        preview:['#0F172A','#1E1B4B','#C026D3','#E879F9','#F0ABFC'],
        C:{ bg:'0F172A',bg2:'1E1B4B',txt:'FFFFFF',muted:'A78BFA',a1:'C026D3',a2:'E879F9',a3:'F0ABFC',teal:'2DD4BF',gold:'F59E0B',danger:'EF4444' }
    },
    solar: {
        name:'Solar', desc:'Amarelo e laranja — energia e otimismo',
        preview:['#1C1917','#2D1B0E','#EA580C','#F97316','#FDBA74'],
        C:{ bg:'1C1917',bg2:'2D1B0E',txt:'FFF7ED',muted:'FDBA74',a1:'EA580C',a2:'F97316',a3:'FB923C',teal:'06B6D4',gold:'F59E0B',danger:'EF4444' }
    },
    royal: {
        name:'Royal', desc:'Roxo e dourado — elegância e sofisticação',
        preview:['#0A041A','#1E1035','#7C3AED','#A78BFA','#FCD34D'],
        C:{ bg:'0A041A',bg2:'1E1035',txt:'FFFFFF',muted:'A78BFA',a1:'7C3AED',a2:'A78BFA',a3:'C4B5FD',teal:'2DD4BF',gold:'FCD34D',danger:'EF4444' }
    },
    corporate: {
        name:'Corporate', desc:'Azul corporativo — profissional e confiável',
        preview:['#0F172A','#1E293B','#2563EB','#3B82F6','#94A3B8'],
        C:{ bg:'0F172A',bg2:'1E293B',txt:'FFFFFF',muted:'94A3B8',a1:'2563EB',a2:'3B82F6',a3:'60A5FA',teal:'14B8A6',gold:'F59E0B',danger:'EF4444' }
    },
    nature: {
        name:'Nature', desc:'Verde e terra — sustentabilidade e crescimento',
        preview:['#0A1409','#1A2E1A','#16A34A','#4ADE80','#D9F99D'],
        C:{ bg:'0A1409',bg2:'1A2E1A',txt:'F0FFF4',muted:'86EFAC',a1:'16A34A',a2:'4ADE80',a3:'86EFAC',teal:'14B8A6',gold:'F59E0B',danger:'EF4444' }
    },
    sunset: {
        name:'Sunset', desc:'Pôr do sol — romântico e acolhedor',
        preview:['#1E0B1E','#2D1B2D','#E11D48','#FB7185','#FECDD3'],
        C:{ bg:'1E0B1E',bg2:'2D1B2D',txt:'FFF1F2',muted:'FB7185',a1:'E11D48',a2:'FB7185',a3:'FDA4AF',teal:'06B6D4',gold:'FCD34D',danger:'EF4444' }
    },
    ocean: {
        name:'Ocean Deep', desc:'Azul escuro e turquesa — profundidade e calma',
        preview:['#030712','#0F1F2F','#0891B2','#22D3EE','#A5F3FC'],
        C:{ bg:'030712',bg2:'0F1F2F',txt:'FFFFFF',muted:'7DD3FC',a1:'0891B2',a2:'22D3EE',a3:'A5F3FC',teal:'14B8A6',gold:'F59E0B',danger:'EF4444' }
    },
    midnight: {
        name:'Midnight', desc:'Azul meia-noite — misterioso e elegante',
        preview:['#020617','#0F172A','#312E81','#4F46E5','#818CF8'],
        C:{ bg:'020617',bg2:'0F172A',txt:'FFFFFF',muted:'818CF8',a1:'312E81',a2:'4F46E5',a3:'818CF8',teal:'14B8A6',gold:'F59E0B',danger:'EF4444' }
    },
    rose: {
        name:'Rose Gold', desc:'Rosa e dourado — moderno e sofisticado',
        preview:['#1C0F13','#2D1A21','#BE185D','#EC4899','#F9A8D4'],
        C:{ bg:'1C0F13',bg2:'2D1A21',txt:'FFFFFF',muted:'F9A8D4',a1:'BE185D',a2:'EC4899',a3:'F9A8D4',teal:'14B8A6',gold:'FCD34D',danger:'EF4444' }
    },
    graphite: {
        name:'Graphite', desc:'Cinza escuro — minimalista e profissional',
        preview:['#111111','#1E1E1E','#575757','#9A9A9A','#E1E1E1'],
        C:{ bg:'111111',bg2:'1E1E1E',txt:'FFFFFF',muted:'9A9A9A',a1:'575757',a2:'9A9A9A',a3:'E1E1E1',teal:'14B8A6',gold:'F59E0B',danger:'EF4444' }
    }
};

// ════════════════════════════════════════════════════
// FUNÇÕES DE CARREGAMENTO DE MODELO (LAZY)
// ════════════════════════════════════════════════════

// Selecionar e carregar um modelo
window.selecionarModelo = async function(nomeModelo) {
    try {
        document.body.style.cursor = 'wait';
        
        if (G.modeloAtual && G.selectedModel === nomeModelo) {
            console.log(`✅ Modelo ${nomeModelo} já está carregado`);
            return;
        }
        
        G.modeloAtual = await carregarModelo(nomeModelo);
        G.selectedModel = nomeModelo;
        
        console.log(`✅ Modelo ${nomeModelo} carregado com sucesso!`);
        
    } catch (error) {
        console.error(`❌ Erro ao carregar modelo ${nomeModelo}:`, error);
        toast(`Erro ao carregar modelo ${nomeModelo}`, 'err');
    } finally {
        document.body.style.cursor = 'default';
    }
};

// ════════════════════════════════════════════════════
// FUNÇÕES DE GERAÇÃO PPTX
// ════════════════════════════════════════════════════

window.generatePptx = async function() {
    try {
        if (!G.modeloAtual) {
            await window.selecionarModelo(G.selectedModel);
        }
        
        setProgress(true, 5, 'Iniciando...');
        
        const T = THEMES[G.theme];
        const pres = new PptxGenJS();
        pres.layout = 'LAYOUT_WIDE';
        
        // Capa
        await tick('Capa...');
        G.modeloAtual.gerarSlideCapa(pres, G, T);
        
        // Sumário (se for portfólio)
        if (G.mode !== 'single') {
            await tick('Sumário...');
            G.modeloAtual.gerarSlideSumario(pres, G, T);
        }
        
        // Panorama (se ativo)
        if (G.blocks.panorama?.enabled) {
            await tick('Panorama BI...');
            G.modeloAtual.gerarSlidePanorama(pres, G, T);
        }
        
        // Para cada projeto
        for (let i = 0; i < G.projects.length; i++) {
            const p = G.projects[i];
            
            await tick(`Divisor ${p.name || i+1}...`);
            G.modeloAtual.gerarSlideDivisor(pres, p, G, T, i);
            
            if (G.blocks.objetivo?.enabled) {
                await tick(`Objetivo ${p.name || i+1}...`);
                G.modeloAtual.gerarSlideObjetivo(pres, p, T.C);
            }
            
            if (G.blocks.team?.enabled) {
                await tick(`Equipe ${p.name || i+1}...`);
                G.modeloAtual.gerarSlideEquipe(pres, p, T.C);
            }
            
            if (G.blocks.etapas?.enabled) {
                await tick(`Etapas ${p.name || i+1}...`);
                G.modeloAtual.gerarSlideEtapas(pres, p, T.C);
            }
            
            if (G.blocks.marcos?.enabled) {
                await tick(`Marcos ${p.name || i+1}...`);
                G.modeloAtual.gerarSlideMarcos(pres, p, T.C);
            }
            
            if (G.blocks.indicadores?.enabled) {
                await tick(`Indicadores ${p.name || i+1}...`);
                G.modeloAtual.gerarSlideIndicadores(pres, p, T.C);
            }
            
            if (G.blocks.resultados?.enabled) {
                await tick(`Resultados ${p.name || i+1}...`);
                G.modeloAtual.gerarSlideResultados(pres, p, T.C);
            }
            
            if (G.blocks.antesdepois?.enabled) {
                await tick(`Antes/Depois ${p.name || i+1}...`);
                G.modeloAtual.gerarSlideAntesDepois(pres, p, T.C);
            }
            
            if (G.blocks.evidencias?.enabled) {
                await tick(`Evidências ${p.name || i+1}...`);
                G.modeloAtual.gerarSlideEvidencias(pres, p, T.C);
            }
            
            if (G.blocks.riscos?.enabled) {
                await tick(`Riscos ${p.name || i+1}...`);
                G.modeloAtual.gerarSlideRiscos(pres, p, T.C);
            }
            
            if (G.blocks.licoes?.enabled) {
                await tick(`Lições ${p.name || i+1}...`);
                G.modeloAtual.gerarSlideLicoes(pres, p, T.C);
            }
            
            if (G.blocks.desafios?.enabled) {
                await tick(`Desafios ${p.name || i+1}...`);
                G.modeloAtual.gerarSlideDesafios(pres, p, T.C);
            }
        }
        
        if (G.blocks.encerramento?.enabled) {
            await tick('Encerramento...');
            G.modeloAtual.gerarSlideEncerramento(pres, G, T);
        }
        
        setProgress(true, 97, 'Exportando arquivo...');
        const fname = (G.id.presTitle || 'Wren-Apresentacao').replace(/[^a-zA-Z0-9À-ÿ\s\-_]/g, '').replace(/\s+/g, '-') + '.pptx';
        await pres.writeFile({ fileName: fname });
        setProgress(false, 100, 'Pronto!');
        toast('Apresentação exportada: ' + fname, 'ok');
        
    } catch (error) {
        console.error('Erro ao gerar PPTX:', error);
        toast('Erro ao gerar apresentação: ' + error.message, 'err');
        setProgress(false, 0, '');
    }
};

// ════════════════════════════════════════════════════
// FUNÇÕES AUXILIARES
// ════════════════════════════════════════════════════

function setProgress(show, pct, msg) {
    const w = document.getElementById('progWrap');
    const b = document.getElementById('progBar');
    const m = document.getElementById('progMsg');
    if (w) w.style.display = show ? 'block' : 'none';
    if (b) b.style.width = pct + '%';
    if (m) m.textContent = msg || '';
}

async function tick(msg) {
    console.log(msg);
    await new Promise(r => setTimeout(r, 10));
}

function toast(msg, type = 'info') {
    const w = document.getElementById('toastWrap');
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    w.appendChild(t);
    setTimeout(() => t.remove(), 4000);
}

// ════════════════════════════════════════════════════
// FUNÇÕES DE NAVEGAÇÃO (DO HTML)
// ════════════════════════════════════════════════════

window.goStep = function(step) {
    G.step = step;
    document.querySelectorAll('.step-page').forEach(p => p.classList.remove('active'));
    document.getElementById('step-' + step)?.classList.add('active');
    document.querySelectorAll('.nav-step').forEach(n => n.classList.remove('active'));
    const ns = document.getElementById('ns-' + step);
    if (ns) ns.classList.add('active');
    
    if (step === 'generate') { 
        renderGenSummary(); 
        renderSlideList(); 
    }
    refreshPreview();
};

window.backToSplash = function() {
    document.getElementById('builder').classList.remove('active');
    document.getElementById('splash').classList.add('active');
};

window.startBuilder = function() {
    document.getElementById('splash').classList.remove('active');
    document.getElementById('builder').classList.add('active');
    updateModeUI();
    goStep('identity');
};

window.selectMode = function(mode) {
    G.mode = mode;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
    document.getElementById('modeBtn-' + mode)?.classList.add('selected');
};

function updateModeUI() {
    const labels = { single: '◻ Projeto Único', portfolio: '◫ Portfólio', program: '⊞ Programa' };
    const el = document.getElementById('modeTag');
    if (el) el.textContent = labels[G.mode];
    const tabsWrap = document.getElementById('projTabsWrap');
    if (tabsWrap) tabsWrap.style.display = G.mode === 'single' ? 'none' : 'block';
    const t = document.getElementById('projStepTitle');
    const d = document.getElementById('projStepDesc');
    if (t) {
        if (G.mode === 'single') {
            t.textContent = 'Projeto';
            d.textContent = 'Preencha as informações da sua iniciativa nos blocos abaixo.';
        } else if (G.mode === 'portfolio') {
            t.textContent = 'Portfólio';
            d.textContent = 'Gerencie os projetos do portfólio e preencha as informações de cada um.';
        } else {
            t.textContent = 'Programa';
            d.textContent = 'Projetos do programa estratégico. Cada um com seus blocos de conteúdo.';
        }
    }
}

// ════════════════════════════════════════════════════
// FUNÇÕES DE TEMA
// ════════════════════════════════════════════════════

window.selectTheme = function(id) {
    G.theme = id;
    renderThemeGrid();
    refreshPreview();
    toast(`Tema "${THEMES[id].name}" selecionado`, 'ok');
};

function renderThemeGrid() {
    const el = document.getElementById('themeGrid');
    if (!el) return;
    el.innerHTML = Object.entries(THEMES).map(([id, t]) => `
        <div class="theme-card ${G.theme === id ? 'selected' : ''}" id="tc-${id}" onclick="selectTheme('${id}')">
            <div class="theme-swatch">${t.preview.map(c => `<span style="background:${c}"></span>`).join('')}</div>
            <div class="theme-body">
                <div class="theme-name">${t.name} <span class="theme-sel-badge">✓ Selecionado</span></div>
                <div class="theme-desc">${t.desc}</div>
            </div>
        </div>
    `).join('');
}

// ════════════════════════════════════════════════════
// FUNÇÕES DE BLOCOS
// ════════════════════════════════════════════════════

window.toggleBlock = function(key) {
    const b = G.blocks[key];
    if (!b || b.required) return;
    b.enabled = !b.enabled;
    renderBlockGrid();
    renderPreviewBlocks();
    refreshPreview();
};

function renderBlockGrid() {
    const el = document.getElementById('blockGrid');
    if (!el) return;
    el.innerHTML = Object.entries(G.blocks).map(([key, b]) => `
        <div class="block-card ${b.enabled ? 'on' : ''} ${b.required ? 'required' : ''}"
             id="bc-${key}" onclick="toggleBlock('${key}')">
            <div class="block-icon">${b.icon}</div>
            <div class="block-name">${b.label}</div>
            <div class="block-desc">${b.desc}</div>
            <span class="block-badge ${b.required ? 'req' : 'opt'}">${b.required ? 'obrigatório' : 'opcional'}</span>
            ${!b.required ? `<div class="block-check">${b.enabled ? '✓' : ''}</div>` : ''}
        </div>
    `).join('');
}

// ════════════════════════════════════════════════════
// FUNÇÕES DE PREVIEW
// ════════════════════════════════════════════════════

function refreshPreview() {
    const T = THEMES[G.theme];
    if (!T) return;
    const C = T.C;
    
    const bg = document.getElementById('slideBg');
    if (bg) bg.style.background = `#${C.bg}`;
    
    const acc = document.getElementById('slideAccent');
    if (acc) acc.style.background = `linear-gradient(90deg,#${C.a1},#${C.a2})`;
    
    const ey = document.getElementById('previewEyebrow');
    const tl = document.getElementById('previewTitle');
    const sb = document.getElementById('previewSub');
    if (ey) { 
        ey.style.color = `#${C.muted}`; 
        ey.textContent = G.id.instName || 'Organização'; 
    }
    if (tl) { 
        tl.style.color = `#${C.txt}`; 
        tl.textContent = G.id.presTitle || 'Título da Apresentação'; 
    }
    if (sb) { 
        sb.style.color = `#${C.muted}`; 
        sb.textContent = G.id.presDate || 'Data'; 
    }
    
    const slides = countSlides();
    const cnt = document.getElementById('slideCount');
    if (cnt) cnt.textContent = `${slides} slide${slides !== 1 ? 's' : ''}`;
    
    renderPreviewBlocks();
}

function countSlides() {
    let n = 1;
    if (G.mode !== 'single') n++;
    const B = G.blocks;
    if (B.panorama?.enabled) n++;
    G.projects.forEach(() => {
        n++;
        ['objetivo', 'team', 'etapas', 'marcos', 'indicadores', 'resultados', 
         'antesdepois', 'evidencias', 'riscos', 'licoes', 'desafios'].forEach(k => {
            if (B[k]?.enabled) n++;
        });
    });
    if (B.encerramento?.enabled) n++;
    return n;
}

function renderPreviewBlocks() {
    const el = document.getElementById('previewBlocks');
    if (!el) return;
    const activeBlocks = Object.entries(G.blocks).filter(([, b]) => b.enabled);
    el.innerHTML = activeBlocks.map(([, b]) => `
        <div class="preview-block active">
            <div class="preview-block-dot"></div>
            <span>${b.label}</span>
        </div>
    `).join('') + Object.entries(G.blocks).filter(([, b]) => !b.enabled).map(([, b]) => `
        <div class="preview-block">
            <div class="preview-block-dot"></div>
            <span>${b.label}</span>
        </div>
    `).join('');
    const total = document.getElementById('previewTotal');
    if (total) total.textContent = `${activeBlocks.length} de ${Object.keys(G.blocks).length} blocos ativos`;
}

// ════════════════════════════════════════════════════
// FUNÇÕES DE PROJETOS
// ════════════════════════════════════════════════════

let pidCounter = 0;
const PROJ_COLORS = ['#2563EB', '#7C3AED', '#DB2777', '#D97706', '#059669', '#DC2626', '#0284C7', '#9333EA'];

window.addProject = function() {
    const id = 'p' + (++pidCounter);
    const col = PROJ_COLORS[G.projects.length % PROJ_COLORS.length];
    
    G.projects.push({
        id, color: col,
        name: '', leader: '', status: 'Concluído', periodo_inicio: '', periodo_fim: '',
        objetivo: '',
        team: [{ nome: '', cargo: '' }],
        etapas: [{ titulo: '', descricao: '' }, { titulo: '', descricao: '' }, { titulo: '', descricao: '' }],
        marcos: [{ data: '', entrega: '' }, { data: '', entrega: '' }, { data: '', entrega: '' }],
        indicadores: [{ nome: '', meta: '', realizado: '' }, { nome: '', meta: '', realizado: '' }, { nome: '', meta: '', realizado: '' }],
        resultados: [{ metrica: '', absoluto: '', percentual: '' }, { metrica: '', absoluto: '', percentual: '' }, { metrica: '', absoluto: '', percentual: '' }],
        riscos: [{ texto: '' }], licoes: [{ texto: '' }],
        antesdepois: { antes_titulo: '', antes_desc: '', antes_img: null, depois_titulo: '', depois_desc: '', depois_img: null },
        evidencias: [null, null, null, null],
        desafios: '',
        bi2025: null, bi2026: null,
    });
    
    if (!G.activeProjectId) G.activeProjectId = id;
    renderProjTabs();
    renderAllForms();
    if (G.mode !== 'single') selectProj(id);
};

window.removeProject = function(id) {
    if (G.projects.length <= 1) { toast('Precisa de pelo menos 1 projeto', 'err'); return; }
    G.projects = G.projects.filter(p => p.id !== id);
    if (G.activeProjectId === id) G.activeProjectId = G.projects[0].id;
    renderProjTabs();
    renderAllForms();
    selectProj(G.activeProjectId);
};

window.selectProj = function(id) {
    G.activeProjectId = id;
    renderProjTabs();
    document.querySelectorAll('.proj-form-wrap').forEach(el => {
        el.style.display = el.dataset.pid === id ? '' : 'none';
    });
};

function renderProjTabs() {
    const el = document.getElementById('projTabs');
    if (!el) return;
    el.innerHTML = G.projects.map(p => `
        <button class="proj-tab ${p.id === G.activeProjectId ? 'active' : ''}" onclick="selectProj('${p.id}')">
            <div class="proj-tab-dot" style="background:${p.color}"></div>
            ${p.name || 'Sem nome'}
        </button>
    `).join('');
    const ns = document.getElementById('ns-proj-sub');
    if (ns) ns.textContent = `${G.projects.length} projeto${G.projects.length !== 1 ? 's' : ''}`;
}

// ════════════════════════════════════════════════════
// FUNÇÕES DE UPLOAD
// ════════════════════════════════════════════════════

window.triggerUp = function(id) { 
    document.getElementById(id)?.click(); 
};

window.handleLogo = function(key, input) {
    const file = input.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = e => {
        G.id[key] = e.target.result;
        const prev = document.getElementById('prev-' + key);
        if (prev) {
            prev.src = e.target.result;
            prev.classList.add('show');
        }
        const rm = document.getElementById('rm' + key.charAt(0).toUpperCase() + key.slice(1));
        if (rm) rm.classList.add('show');
        toast(file.name + ' carregado', 'ok');
    };
    r.readAsDataURL(file);
};

window.rmLogo = function(evt, key) {
    evt.stopPropagation();
    G.id[key] = null;
    const prev = document.getElementById('prev-' + key);
    if (prev) {
        prev.src = '';
        prev.classList.remove('show');
    }
};

window.handleGlobal = function(key, input) {
    const file = input.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = e => {
        G.id[key] = e.target.result;
        const prev = document.getElementById('prev-' + key);
        if (prev) {
            prev.src = e.target.result;
            prev.classList.add('show');
        }
        const rm = document.getElementById('rm' + key);
        if (rm) rm.classList.add('show');
    };
    r.readAsDataURL(file);
};

window.rmGlobal = function(evt, key) {
    evt.stopPropagation();
    G.id[key] = null;
    const prev = document.getElementById('prev-' + key);
    if (prev) {
        prev.src = '';
        prev.classList.remove('show');
    }
};

window.handleEvImg = function(pid, idx, input) {
    const p = G.projects.find(p => p.id === pid);
    if (!p) return;
    const file = input.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = e => {
        p.evidencias[idx] = e.target.result;
        const prev = document.getElementById(`prev-ev-${pid}-${idx}`);
        if (prev) {
            prev.src = e.target.result;
            prev.classList.add('show');
        }
    };
    r.readAsDataURL(file);
};

window.rmEvImg = function(evt, pid, idx) {
    evt.stopPropagation();
    const p = G.projects.find(p => p.id === pid);
    if (!p) return;
    p.evidencias[idx] = null;
    const prev = document.getElementById(`prev-ev-${pid}-${idx}`);
    if (prev) {
        prev.src = '';
        prev.classList.remove('show');
    }
};

window.handleBAImg = function(pid, side, input) {
    const p = G.projects.find(p => p.id === pid);
    if (!p) return;
    const file = input.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = e => {
        p.antesdepois[side + '_img'] = e.target.result;
        const prev = document.getElementById(`prev-BA-${side}-${pid}`);
        if (prev) {
            prev.src = e.target.result;
            prev.classList.add('show');
        }
    };
    r.readAsDataURL(file);
};

window.rmBAImg = function(evt, pid, side) {
    evt.stopPropagation();
    const p = G.projects.find(p => p.id === pid);
    if (!p) return;
    p.antesdepois[side + '_img'] = null;
    const prev = document.getElementById(`prev-BA-${side}-${pid}`);
    if (prev) {
        prev.src = '';
        prev.classList.remove('show');
    }
};

// ════════════════════════════════════════════════════
// FUNÇÕES DE FORMULÁRIOS (simplificadas)
// ════════════════════════════════════════════════════

function getProj(id) { 
    return G.projects.find(p => p.id === id); 
}

window.pset = function(id, k, v) { 
    const p = getProj(id); 
    if (p) p[k] = v; 
};

window.psetD = function(id, o, k, v) { 
    const p = getProj(id); 
    if (p && p[o]) p[o][k] = v; 
};

window.psetR = function(pid, f, i, k, v) { 
    const p = getProj(pid); 
    if (p && p[f] && p[f][i]) p[f][i][k] = v; 
};

function esc(s) { 
    return (s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); 
}

function renderAllForms() {
    const container = document.getElementById('projectForms');
    if (!container) return;
    container.innerHTML = '';
    G.projects.forEach(p => {
        const wrap = document.createElement('div');
        wrap.className = 'proj-form-wrap';
        wrap.dataset.pid = p.id;
        wrap.style.display = p.id === G.activeProjectId ? '' : 'none';
        wrap.innerHTML = buildForm(p);
        container.appendChild(wrap);
    });
}

function buildForm(p) {
    const num = G.projects.findIndex(x => x.id === p.id) + 1;
    const canRemove = G.mode !== 'single';
    
    return `
    <div class="proj-header-bar">
        <div style="background:${p.color}; width:30px; height:30px; border-radius:4px; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold">${String(num).padStart(2, '0')}</div>
        <div style="flex:1">
            <div style="font-weight:bold">${p.name || 'Novo Projeto'}</div>
            <div style="font-size:0.7rem; color:var(--muted)">Preencha as informações abaixo</div>
        </div>
        ${canRemove ? `<button class="btn btn-danger btn-xs" onclick="removeProject('${p.id}')">Remover</button>` : ''}
    </div>

    <div class="card">
        <div class="field">
            <label>Nome do Projeto</label>
            <input value="${esc(p.name)}" placeholder="Nome do projeto" oninput="pset('${p.id}','name',this.value);renderProjTabs()">
        </div>
        <div class="field">
            <label>Líder / Responsável</label>
            <input value="${esc(p.leader)}" placeholder="Nome do líder" oninput="pset('${p.id}','leader',this.value)">
        </div>
        <div class="frow c2">
            <div class="field"><label>Início</label><input type="date" value="${p.periodo_inicio}" oninput="pset('${p.id}','periodo_inicio',this.value)"></div>
            <div class="field"><label>Conclusão</label><input type="date" value="${p.periodo_fim}" oninput="pset('${p.id}','periodo_fim',this.value)"></div>
        </div>
        <div class="field">
            <label>Status</label>
            <select oninput="pset('${p.id}','status',this.value)">
                ${['Concluído', 'Em andamento', 'Pausado', 'Cancelado'].map(s => `<option ${p.status === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
        </div>
    </div>

    <div class="card">
        <div class="field">
            <label>Objetivo</label>
            <textarea rows="3" placeholder="Descreva o objetivo do projeto..." oninput="pset('${p.id}','objetivo',this.value)">${esc(p.objetivo)}</textarea>
        </div>
    </div>
    `;
}

// ════════════════════════════════════════════════════
// FUNÇÕES DE GENERATE STEP
// ════════════════════════════════════════════════════

function renderGenSummary() {
    const el = document.getElementById('genSummary');
    if (!el) return;
    const checks = [
        { label: 'Identidade — Nome da instituição', ok: !!G.id.instName, val: G.id.instName },
        { label: 'Identidade — Título da apresentação', ok: !!G.id.presTitle, val: G.id.presTitle },
        { label: 'Tema Visual', ok: true, val: THEMES[G.theme]?.name },
        ...G.projects.map(p => ({ label: `Projeto: ${p.name || '(sem nome)'}`, ok: !!(p.name && p.objetivo), val: p.status }))
    ];
    el.innerHTML = `<div style="font-weight:bold; margin-bottom:1rem">Resumo da Apresentação</div>` +
        checks.map(c => `
        <div class="gen-row">
            <div class="gen-status ${c.ok ? 'ok' : 'pending'}">${c.ok ? '✓' : '!'}</div>
            <span class="gen-label">${c.label}</span>
            <span class="gen-val">${c.ok ? c.val : 'pendente'}</span>
        </div>
    `).join('');
}

function renderSlideList() {
    const el = document.getElementById('slideList');
    if (!el) return;
    const B = G.blocks;
    let n = 0;
    const rows = [];
    const add = (label, main) => { n++; rows.push({ n, label, main }); };
    
    add('Capa', true);
    if (G.mode !== 'single') add('Sumário', true);
    if (B.panorama?.enabled) add('Panorama BI', true);
    
    G.projects.forEach((p, i) => {
        const tag = `Projeto ${String(i + 1).padStart(2, '0')}${p.name ? ' · ' + p.name : ''}`;
        add(`Divisor — ${tag}`, true);
        if (B.objetivo?.enabled) add('Objetivo', false);
        if (B.team?.enabled) add('Equipe', false);
        if (B.etapas?.enabled) add('Etapas', false);
        if (B.marcos?.enabled) add('Marcos / Timeline', false);
        if (B.indicadores?.enabled) add('Indicadores KPI', false);
        if (B.resultados?.enabled) add('Resultados', false);
        if (B.antesdepois?.enabled) add('Antes & Depois', false);
        if (B.evidencias?.enabled) add('Evidências', false);
        if (B.riscos?.enabled) add('Riscos', false);
        if (B.licoes?.enabled) add('Lições Aprendidas', false);
        if (B.desafios?.enabled) add('Desafios Futuros', false);
    });
    
    if (B.encerramento?.enabled) add('Encerramento', true);
    
    el.innerHTML = rows.map(r => `
        <div class="slide-row ${r.main ? 'main' : 'sub'}">
            <span class="slide-row-num">${String(r.n).padStart(2, '0')}</span>
            ${r.label}
        </div>
    `).join('');
}

// ════════════════════════════════════════════════════
// FUNÇÕES DE DRAFT
// ════════════════════════════════════════════════════

window.saveDraft = function() {
    try {
        const snap = {
            mode: G.mode,
            theme: G.theme,
            selectedModel: G.selectedModel,
            id: { ...G.id, logoInst: null, logoProg: null, bi2025: null, bi2026: null },
            projects: G.projects.map(p => ({
                ...p,
                evidencias: [null, null, null, null],
                antesdepois: { ...p.antesdepois, antes_img: null, depois_img: null }
            })),
            blocks: G.blocks,
            ts: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(snap, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'wren-rascunho.json';
        a.click();
        toast('Rascunho salvo (imagens não incluídas)', 'ok');
    } catch (e) {
        toast('Erro ao salvar', 'err');
    }
};

// ════════════════════════════════════════════════════
// INICIALIZAÇÃO
// ════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Wren App iniciado!');
    
    window.addProject();
    renderThemeGrid();
    renderBlockGrid();
    renderPreviewBlocks();
    refreshPreview();
    
    console.log('✅ Modelos serão carregados sob demanda (lazy loading)');
});

// Exportar G para debugging (opcional)
window.G = G;
