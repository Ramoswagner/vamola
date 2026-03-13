// main.js
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
};

// ════════════════════════════════════════════════════
// FUNÇÕES DE CARREGAMENTO DE MODELO (LAZY)
// ════════════════════════════════════════════════════

// Selecionar e carregar um modelo
window.selecionarModelo = async function(nomeModelo) {
    try {
        // Mostrar loading
        document.body.style.cursor = 'wait';
        
        // Se já tem um modelo carregado e é o mesmo, não recarrega
        if (G.modeloAtual && G.selectedModel === nomeModelo) {
            console.log(`✅ Modelo ${nomeModelo} já está carregado`);
            return;
        }
        
        // CARREGA O MODELO (lazy loading) ⭐
        G.modeloAtual = await carregarModelo(nomeModelo);
        G.selectedModel = nomeModelo;
        
        console.log(`✅ Modelo ${nomeModelo} carregado com sucesso!`);
        
        // Atualizar UI se necessário
        atualizarUIModelo(nomeModelo);
        
    } catch (error) {
        console.error(`❌ Erro ao carregar modelo ${nomeModelo}:`, error);
        toast(`Erro ao carregar modelo ${nomeModelo}`, 'err');
    } finally {
        // Esconder loading
        document.body.style.cursor = 'default';
    }
};

// Atualizar interface quando modelo mudar
function atualizarUIModelo(nomeModelo) {
    // Destacar o modelo selecionado na UI
    document.querySelectorAll('.modelo-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.modelo === nomeModelo) {
            card.classList.add('selected');
        }
    });
    
    // Atualizar preview
    refreshPreview();
}

// ════════════════════════════════════════════════════
// FUNÇÕES DE GERAÇÃO PPTX (USANDO O MODELO CARREGADO)
// ════════════════════════════════════════════════════

window.generatePptx = async function() {
    try {
        // Se não tem modelo carregado, carrega o padrão
        if (!G.modeloAtual) {
            await window.selecionarModelo(G.selectedModel);
        }
        
        setProgress(true, 5, 'Iniciando...');
        
        // PEGA O TEMA SELECIONADO
        const T = THEMES[G.theme];
        
        // CRIA APRESENTAÇÃO
        const pres = new PptxGenJS();
        pres.layout = 'LAYOUT_WIDE';
        const W = 13.33, H = 7.5;
        
        // USA O MODELO CARREGADO para gerar slides! ⭐
        
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
            
            // Divisor do projeto
            await tick(`Divisor ${p.name || i+1}...`);
            G.modeloAtual.gerarSlideDivisor(pres, p, G, T, i);
            
            // Objetivo
            if (G.blocks.objetivo?.enabled) {
                await tick(`Objetivo ${p.name || i+1}...`);
                G.modeloAtual.gerarSlideObjetivo(pres, p, T.C);
            }
            
            // Equipe
            if (G.blocks.team?.enabled) {
                await tick(`Equipe ${p.name || i+1}...`);
                G.modeloAtual.gerarSlideEquipe(pres, p, T.C);
            }
            
            // Etapas
            if (G.blocks.etapas?.enabled) {
                await tick(`Etapas ${p.name || i+1}...`);
                G.modeloAtual.gerarSlideEtapas(pres, p, T.C);
            }
            
            // Marcos
            if (G.blocks.marcos?.enabled) {
                await tick(`Marcos ${p.name || i+1}...`);
                G.modeloAtual.gerarSlideMarcos(pres, p, T.C);
            }
            
            // Indicadores
            if (G.blocks.indicadores?.enabled) {
                await tick(`Indicadores ${p.name || i+1}...`);
                G.modeloAtual.gerarSlideIndicadores(pres, p, T.C);
            }
            
            // Resultados
            if (G.blocks.resultados?.enabled) {
                await tick(`Resultados ${p.name || i+1}...`);
                G.modeloAtual.gerarSlideResultados(pres, p, T.C);
            }
            
            // Antes & Depois
            if (G.blocks.antesdepois?.enabled) {
                await tick(`Antes/Depois ${p.name || i+1}...`);
                G.modeloAtual.gerarSlideAntesDepois(pres, p, T.C);
            }
            
            // Evidências
            if (G.blocks.evidencias?.enabled) {
                await tick(`Evidências ${p.name || i+1}...`);
                G.modeloAtual.gerarSlideEvidencias(pres, p, T.C);
            }
            
            // Riscos
            if (G.blocks.riscos?.enabled) {
                await tick(`Riscos ${p.name || i+1}...`);
                G.modeloAtual.gerarSlideRiscos(pres, p, T.C);
            }
            
            // Lições
            if (G.blocks.licoes?.enabled) {
                await tick(`Lições ${p.name || i+1}...`);
                G.modeloAtual.gerarSlideLicoes(pres, p, T.C);
            }
            
            // Desafios
            if (G.blocks.desafios?.enabled) {
                await tick(`Desafios ${p.name || i+1}...`);
                G.modeloAtual.gerarSlideDesafios(pres, p, T.C);
            }
        }
        
        // Encerramento
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

// Helper para progresso
function setProgress(show, pct, msg) {
    const w = document.getElementById('progWrap');
    const b = document.getElementById('progBar');
    const m = document.getElementById('progMsg');
    if (w) w.style.display = show ? 'block' : 'none';
    if (b) b.style.width = pct + '%';
    if (m) m.textContent = msg || '';
}

// Helper para ticks de progresso
async function tick(msg) {
    // Implementar lógica de progresso se necessário
    console.log(msg);
    await new Promise(r => setTimeout(r, 10));
}

// ════════════════════════════════════════════════════
// FUNÇÕES DE NAVEGAÇÃO
// ════════════════════════════════════════════════════

window.goStep = function(step) {
    G.step = step;
    document.querySelectorAll('.step-page').forEach(p => p.classList.remove('active'));
    document.getElementById('step-' + step)?.classList.add('active');
    document.querySelectorAll('.nav-step').forEach(n => n.classList.remove('active'));
    const ns = document.getElementById('ns-' + step);
    if (ns) ns.classList.add('active');
    
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

// ════════════════════════════════════════════════════
// FUNÇÕES DE MODO (single/portfolio/program)
// ════════════════════════════════════════════════════

window.selectMode = function(mode) {
    G.mode = mode;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
    document.getElementById('modeBtn-' + mode)?.classList.add('selected');
};

function updateModeUI() {
    const labels = { single: '◻ Projeto Único', portfolio: '◫ Portfólio', program: '⊞ Programa' };
    const el = document.getElementById('modeTag');
    if (el) el.textContent = labels[G.mode];
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
             id="bc-${key}" onclick="${b.required ? '' : ''} toggleBlock('${key}')">
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
    
    // Slide mini bg
    const bg = document.getElementById('slideBg');
    if (bg) bg.style.background = `#${C.bg}`;
    
    // Accent
    const acc = document.getElementById('slideAccent');
    if (acc) acc.style.background = `linear-gradient(90deg,#${C.a1},#${C.a2})`;
    
    // Texts
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
    
    // Slide count
    const slides = countSlides();
    const cnt = document.getElementById('slideCount');
    if (cnt) cnt.textContent = `${slides} slide${slides !== 1 ? 's' : ''}`;
    
    renderPreviewBlocks();
}

function countSlides() {
    let n = 1; // capa
    if (G.mode !== 'single') n++; // sumario
    const B = G.blocks;
    if (B.panorama?.enabled) n++;
    G.projects.forEach(() => {
        n++; // divisor
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

window.addProject = function() {
    const id = 'p' + (++pidCounter);
    const PROJ_COLORS = ['#2563EB', '#7C3AED', '#DB2777', '#D97706', '#059669', '#DC2626', '#0284C7', '#9333EA'];
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

// ════════════════════════════════════════════════════
// FUNÇÕES DE TOAST
// ════════════════════════════════════════════════════

function toast(msg, type = 'info') {
    const w = document.getElementById('toastWrap');
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    w.appendChild(t);
    setTimeout(() => t.remove(), 4000);
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
    
    // Inicializar com um projeto padrão
    window.addProject();
    
    // Renderizar grids
    renderBlockGrid();
    renderThemeGrid();
    renderPreviewBlocks();
    refreshPreview();
    
    // NÃO carrega modelo ainda! Só quando precisar
    console.log('✅ Modelos serão carregados sob demanda (lazy loading)');
});

// Exportar G globalmente para acesso no console (opcional)
window.G = G;
