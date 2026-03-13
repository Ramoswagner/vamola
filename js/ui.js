// js/ui.js
// Todas as funções de interface: navegação, render de grids,
// formulários de projeto, uploads, preview e toast.
// Depende de: G (store.js), THEMES (themes.js), PROJ_COLORS (store.js)

// ════════════════════════════════════════════════════
// SPLASH / NAVEGAÇÃO PRINCIPAL
// ════════════════════════════════════════════════════
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
// NAVEGAÇÃO DE STEPS
// ════════════════════════════════════════════════════
const STEPS = ['identity','blocks','modelo','theme','projects','generate'];

function goStep(step) {
  G.step = step;
  document.querySelectorAll('.step-page').forEach(p => p.classList.remove('active'));
  document.getElementById('step-'+step)?.classList.add('active');
  document.querySelectorAll('.nav-step').forEach(n => n.classList.remove('active'));
  const ns = document.getElementById('ns-'+step);
  if(ns) ns.classList.add('active');

  const idx = STEPS.indexOf(step);
  STEPS.forEach((s,i) => {
    const n = document.getElementById('ns-'+s);
    if(!n) return;
    n.classList.toggle('done', i < idx);
  });

  if(step==='generate') { renderGenSummary(); renderSlideList(); }
  if(step==='modelo')   { renderModeloGrid(); }
  refreshPreview();
}

// ════════════════════════════════════════════════════
// BLOCOS
// ════════════════════════════════════════════════════
function renderBlockGrid() {
  const el = document.getElementById('blockGrid');
  if(!el) return;
  el.innerHTML = Object.entries(G.blocks).map(([key,b])=>`
    <div class="block-card ${b.enabled?'on':''} ${b.required?'required':''}"
         id="bc-${key}" onclick="toggleBlock('${key}')">
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
// TEMAS
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
  renderModeloGrid();   // thumbnails usam as cores do tema
  refreshPreview();
  toast(`Tema "${THEMES[id].name}" selecionado`, 'ok');
}

// ════════════════════════════════════════════════════
// PREVIEW AO VIVO
// ════════════════════════════════════════════════════
function refreshPreview() {
  const T = THEMES[G.theme];
  if(!T) return;
  const C = T.C;

  // ── helper: aplica nos dois destinos (col desktop + sheet mobile) ──
  function syncEl(desktopId, sheetId, fn) {
    const d = document.getElementById(desktopId);
    const s = document.getElementById(sheetId);
    if(d) fn(d);
    if(s) fn(s);
  }

  // ── slide mini (capa) ──
  syncEl('slideBg','sheetSlideBg', el => el.style.background = `#${C.bg}`);
  syncEl('slideAccent','sheetAccent', el => el.style.background = `linear-gradient(90deg,#${C.a1},#${C.a2})`);
  syncEl('previewEyebrow','sheetEyebrow', el => { el.style.color=`#${C.muted}`; el.textContent=G.id.instName||'Organização'; });
  syncEl('previewTitle','sheetTitle', el => { el.style.color=`#${C.txt}`; el.textContent=G.id.presTitle||'Título da Apresentação'; });
  syncEl('previewSub','sheetSub', el => { el.style.color=`#${C.muted}`; el.textContent=G.id.presDate||'Data'; });

  const slides = countSlides();
  syncEl('slideCount','sheetSlideCount', el => el.textContent=`${slides} slide${slides!==1?'s':''}`);

  // ── thumbnail do modelo ──
  const svgHtml = typeof svgModelThumb==='function' ? svgModelThumb(G.modelo,C) : '';
  const mName   = MODELOS_META?.[G.modelo]?.name || G.modelo;

  syncEl('previewThumb','sheetThumb', el => el.innerHTML = svgHtml);
  syncEl('previewThumbLabel','sheetThumbLabel', el => el.textContent = mName);

  // FAB: miniatura embutida + ring de atualização
  const fab = document.getElementById('fabThumb');
  if(fab) {
    fab.innerHTML = svgHtml;
    const fabBtn = document.getElementById('previewFab');
    if(fabBtn) {
      fabBtn.classList.remove('updated');
      void fabBtn.offsetWidth; // reflow para reiniciar animação
      fabBtn.classList.add('updated');
    }
  }

  // ── pills modelo / tema ──
  syncEl('previewModeloName','sheetModeloName', el => el.textContent = mName);
  syncEl('previewThemeName','sheetThemeName',  el => el.textContent = T.name || G.theme);

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
  const activeBlocks  = Object.entries(G.blocks).filter(([,b])=>b.enabled);
  const inactiveBlocks= Object.entries(G.blocks).filter(([,b])=>!b.enabled);

  const html =
    activeBlocks.map(([,b])=>`
      <div class="preview-block active">
        <div class="preview-block-dot"></div>
        <span>${b.label}</span>
      </div>`).join('') +
    inactiveBlocks.map(([,b])=>`
      <div class="preview-block">
        <div class="preview-block-dot"></div>
        <span>${b.label}</span>
      </div>`).join('');

  const totalText = `${activeBlocks.length} de ${Object.keys(G.blocks).length} blocos ativos`;

  // desktop col
  const el = document.getElementById('previewBlocks');
  if(el) el.innerHTML = html;
  const total = document.getElementById('previewTotal');
  if(total) total.textContent = totalText;

  // sheet mobile
  const sheetEl = document.getElementById('sheetBlocks');
  if(sheetEl) sheetEl.innerHTML = html;
  const sheetTotal = document.getElementById('sheetTotal');
  if(sheetTotal) sheetTotal.textContent = totalText;
}

// ════════════════════════════════════════════════════
// PREVIEW BOTTOM SHEET (mobile)
// ════════════════════════════════════════════════════
function openPreviewSheet() {
  const sheet   = document.getElementById('previewSheet');
  const overlay = document.getElementById('previewOverlay');
  if(!sheet || !overlay) return;
  sheet.style.display   = 'block';
  overlay.classList.add('open');
  // forçar reflow antes de adicionar .open para animação funcionar
  void sheet.offsetHeight;
  sheet.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePreviewSheet() {
  const sheet   = document.getElementById('previewSheet');
  const overlay = document.getElementById('previewOverlay');
  if(!sheet || !overlay) return;
  sheet.classList.remove('open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  // esconde após a transição terminar
  setTimeout(() => { sheet.style.display = 'none'; }, 360);
}

// ── Swipe down para fechar ────────────────────────
(function initSheetSwipe() {
  let startY = 0, isDragging = false;
  document.addEventListener('touchstart', e => {
    const sheet = document.getElementById('previewSheet');
    if(sheet && sheet.classList.contains('open') && sheet.contains(e.target)) {
      startY = e.touches[0].clientY;
      isDragging = true;
    }
  }, { passive: true });
  document.addEventListener('touchmove', e => {
    if(!isDragging) return;
    const sheet = document.getElementById('previewSheet');
    if(!sheet) return;
    const dy = e.touches[0].clientY - startY;
    if(dy > 0) sheet.style.transform = `translateY(${dy}px)`;
  }, { passive: true });
  document.addEventListener('touchend', e => {
    if(!isDragging) return;
    isDragging = false;
    const sheet = document.getElementById('previewSheet');
    if(!sheet) return;
    const dy = e.changedTouches[0].clientY - startY;
    sheet.style.transform = '';
    if(dy > 80) closePreviewSheet();
  }, { passive: true });
})();
let pidCounter = 0;

function addProject() {
  const id = 'p'+(++pidCounter);
  const col = PROJ_COLORS[(G.projects.length)%PROJ_COLORS.length];
  G.projects.push({
    id, color:col,
    name:'', leader:'', status:'Concluído', periodo_inicio:'', periodo_fim:'',
    objetivo:'',
    team:[{nome:'',cargo:''}],
    etapas:[{titulo:'',descricao:''},{titulo:'',descricao:''},{titulo:'',descricao:''}],
    marcos:[{data:'',entrega:''},{data:'',entrega:''},{data:'',entrega:''}],
    indicadores:[{nome:'',meta:'',realizado:''},{nome:'',meta:'',realizado:''},{nome:'',meta:'',realizado:''}],
    resultados:[{metrica:'',absoluto:'',percentual:''},{metrica:'',absoluto:'',percentual:''},{metrica:'',absoluto:'',percentual:''}],
    riscos:[{texto:''}], licoes:[{texto:''}],
    antesdepois:{antes_titulo:'',antes_desc:'',antes_img:null,depois_titulo:'',depois_desc:'',depois_img:null},
    evidencias:[null,null,null,null],
    desafios:{ continuidade:'', acompanhamento:'', desdobramentos:'' },
    bi2025:null, bi2026:null,
  });
  if(!G.activeProjectId) G.activeProjectId = id;
  renderProjTabs();
  renderAllForms();
  if(G.mode!=='single') selectProj(id);
}

function removeProject(id) {
  if(G.projects.length<=1){ toast('Precisa de pelo menos 1 projeto','err'); return; }
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

// Helpers de acesso/mutação de projetos
function getProj(id){ return G.projects.find(p=>p.id===id); }
function pset(id,k,v){ const p=getProj(id); if(p) p[k]=v; }
function psetD(id,o,k,v){ const p=getProj(id); if(p) p[o][k]=v; }
function psetR(pid,f,i,k,v){ const p=getProj(pid); if(p&&p[f][i]) p[f][i][k]=v; }
function esc(s){ return (s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

function renderAllForms() {
  const container = document.getElementById('projectForms');
  if(!container) return;
  container.innerHTML='';
  G.projects.forEach(p=>{
    const wrap=document.createElement('div');
    wrap.className='proj-form-wrap'; wrap.dataset.pid=p.id;
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
    <div class="frow c1">
      <div class="field"><label>Continuidade — como o projeto segue vivo?</label>
        <textarea rows="3" placeholder="Descreva ações de manutenção, responsáveis pela continuidade..." oninput="psetD('${p.id}','desafios','continuidade',this.value)">${esc(p.desafios.continuidade)}</textarea>
      </div>
      <div class="field"><label>Acompanhamento — como os resultados serão monitorados?</label>
        <textarea rows="3" placeholder="Indicadores a acompanhar, cadência de revisão, fórum de governança..." oninput="psetD('${p.id}','desafios','acompanhamento',this.value)">${esc(p.desafios.acompanhamento)}</textarea>
      </div>
      <div class="field"><label>Desdobramentos — próximos passos estratégicos</label>
        <textarea rows="3" placeholder="Projetos derivados, expansão de escopo, novos públicos ou áreas..." oninput="psetD('${p.id}','desafios','desdobramentos',this.value)">${esc(p.desafios.desdobramentos)}</textarea>
      </div>
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
  return `
  <div class="accord">
    <div class="accord-head ${enabled||!b?'enabled':''} ${startOpen?'open':''}" onclick="toggleAccord(this)">
      <div class="accord-enabled"></div>
      <span class="accord-label">${label}</span>
      ${b?`<span class="accord-badge ${isReq?'req':'opt'}">${isReq?'obrigatório':'opcional'}</span>`:''}
      <span class="accord-arrow">▾</span>
    </div>
    <div class="accord-body ${startOpen?'open':''}">${body}</div>
  </div>`;
}

function toggleAccord(head) {
  head.classList.toggle('open');
  head.nextElementSibling.classList.toggle('open');
}

// ── Construtores de itens repetíveis ──
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
  return `<div class="rep-item"><div class="rep-num">${i+1}</div><div class="rep-fields"><div class="frow c3"><div class="field"><label>KPI</label><input value="${esc(ind.nome)}" placeholder="Ex: NPS" oninput="psetR('${pid}','indicadores',${i},'nome',this.value)"></div><div class="field"><label>Meta</label><input value="${esc(ind.meta)}" placeholder="90%" oninput="psetR('${pid}','indicadores',${i},'meta',this.value)"></div><div class="field"><label>Realizado</label><input value="${esc(ind.realizado)}" placeholder="93%" oninput="psetR('${pid}','indicadores',${i},'realizado',this.value)"></div></div></div><button class="rep-rm" onclick="removeRep('${pid}','indicadores',${i})">✕</button></div>`;
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
  const p=getProj(pid); if(!p) return;
  p[field].push({...template});
  const list=document.getElementById(field+'-'+pid); if(!list) return;
  const i=p[field].length-1;
  const builders={team:repTeam,etapas:repEtapa,marcos:repMarco,indicadores:repIndic,resultados:repResult};
  let html='';
  if(builders[field]) html=builders[field](pid,i);
  else if(field==='riscos') html=repTexto(pid,'riscos',i,'Risco ou ponto de atenção...');
  else if(field==='licoes') html=repTexto(pid,'licoes',i,'Lição aprendida...');
  list.insertAdjacentHTML('beforeend',html);
}

function removeRep(pid,field,idx){
  const p=getProj(pid); if(!p) return;
  if(p[field].length<=1) return;
  p[field].splice(idx,1);
  const list=document.getElementById(field+'-'+pid); if(!list) return;
  const builders={team:repTeam,etapas:repEtapa,marcos:repMarco,indicadores:repIndic,resultados:repResult};
  if(builders[field]) list.innerHTML=p[field].map((_,i)=>builders[field](pid,i)).join('');
  else if(field==='riscos') list.innerHTML=p.riscos.map((_,i)=>repTexto(pid,'riscos',i,'Risco...')).join('');
  else if(field==='licoes') list.innerHTML=p.licoes.map((_,i)=>repTexto(pid,'licoes',i,'Lição...')).join('');
}

// ════════════════════════════════════════════════════
// UPLOADS DE IMAGENS
// ════════════════════════════════════════════════════
function triggerUp(id){ document.getElementById(id)?.click(); }

function handleLogo(key, input) {
  const file=input.files[0]; if(!file) return;
  const r=new FileReader();
  r.onload=e=>{
    G.id[key]=e.target.result;
    const prev=document.getElementById('prev-'+key);
    if(prev){prev.src=e.target.result;prev.classList.add('show');}
    const rm=document.getElementById('rm'+key.charAt(0).toUpperCase()+key.slice(1));
    if(rm) rm.classList.add('show');
    toast(file.name+' carregado','ok');
  };
  r.readAsDataURL(file);
}

function rmLogo(evt,key){
  evt.stopPropagation(); G.id[key]=null;
  const prev=document.getElementById('prev-'+key);
  if(prev){prev.src='';prev.classList.remove('show');}
}

function handleGlobal(key,input){
  const file=input.files[0]; if(!file) return;
  const r=new FileReader();
  r.onload=e=>{
    G.id[key]=e.target.result;
    const prev=document.getElementById('prev-'+key);
    if(prev){prev.src=e.target.result;prev.classList.add('show');}
    const rm=document.getElementById('rm'+key);
    if(rm) rm.classList.add('show');
  };
  r.readAsDataURL(file);
}

function rmGlobal(evt,key){
  evt.stopPropagation(); G.id[key]=null;
  const prev=document.getElementById('prev-'+key);
  if(prev){prev.src='';prev.classList.remove('show');}
}

function handleEvImg(pid,idx,input){
  const p=getProj(pid); if(!p) return;
  const file=input.files[0]; if(!file) return;
  const r=new FileReader();
  r.onload=e=>{
    p.evidencias[idx]=e.target.result;
    const prev=document.getElementById(`prev-ev-${pid}-${idx}`);
    if(prev){prev.src=e.target.result;prev.classList.add('show');}
  };
  r.readAsDataURL(file);
}

function rmEvImg(evt,pid,idx){
  evt.stopPropagation(); const p=getProj(pid); if(!p) return;
  p.evidencias[idx]=null;
  const prev=document.getElementById(`prev-ev-${pid}-${idx}`);
  if(prev){prev.src='';prev.classList.remove('show');}
}

function handleBAImg(pid,side,input){
  const p=getProj(pid); if(!p) return;
  const file=input.files[0]; if(!file) return;
  const r=new FileReader();
  r.onload=e=>{
    p.antesdepois[side+'_img']=e.target.result;
    const prev=document.getElementById(`prev-BA-${side}-${pid}`);
    if(prev){prev.src=e.target.result;prev.classList.add('show');}
  };
  r.readAsDataURL(file);
}

function rmBAImg(evt,pid,side){
  evt.stopPropagation(); const p=getProj(pid); if(!p) return;
  p.antesdepois[side+'_img']=null;
  const prev=document.getElementById(`prev-BA-${side}-${pid}`);
  if(prev){prev.src='';prev.classList.remove('show');}
}

// ════════════════════════════════════════════════════
// STEP GERAR — resumo e lista de slides
// ════════════════════════════════════════════════════
function renderGenSummary() {
  const el=document.getElementById('genSummary'); if(!el) return;
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
      <span class="gen-val">${c.ok?c.val:''}</span>
    </div>
  `).join('');
}

function renderSlideList() {
  const el=document.getElementById('slideList'); if(!el) return;
  const B=G.blocks;
  let n=0; const rows=[];
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
  t.className=`toast ${type}`; t.textContent=msg;
  w.appendChild(t); setTimeout(()=>t.remove(),4000);
}

// ════════════════════════════════════════════════════
// MODELOS — metadata + thumbnails SVG + grid
// ════════════════════════════════════════════════════

const MODELOS_META = {
  classico:    { name:'Clássico',      desc:'Dois painéis, hierarquia clara e atemporal',   tags:['corporativo','formal','elegante'] },
  moderno:     { name:'Moderno',       desc:'Bloco de cor agressivo, geometria em diagonal', tags:['contemporâneo','bold','impacto'] },
  minimalista: { name:'Minimalista',   desc:'Linha única, espaço negativo generoso',         tags:['clean','elegante','respirado'] },
  cybergrid:   { name:'CyberGrid',     desc:'Grade, glow neon e tipografia terminal',        tags:['tech','digital','HUD'] },
  brutal:      { name:'Brutal',        desc:'Blocos brutos, editorial agressivo, fanzine',   tags:['editorial','manifesto','raw'] },
  aurora:      { name:'Aurora',        desc:'Orbes de luz difusa, névoa de cor atmosférica', tags:['conceitual','premium','orgânico'] },
  noir:        { name:'Noir',          desc:'Faixa de cor queimada, contraste extremo',      tags:['cinematográfico','poster','drama'] },
  bauhaus:     { name:'Bauhaus',       desc:'Círculo dominante — geometria como linguagem',  tags:['geométrico','design','ícone'] },
  revista:     { name:'Revista',       desc:'Espinha vertical, duas colunas editoriais',     tags:['editorial','magazine','coluna'] },
  eclipse:     { name:'Eclipse',       desc:'Halos concêntricos, foco no núcleo do portal',  tags:['orbital','dramático','foco'] },
  lumina:      { name:'Lumina Prism',  desc:'Glassmorphism, vidro holográfico e refração',   tags:['glassy','futurista','premium'] },
  aqua:        { name:'Aqua',          desc:'Camadas líquidas, ondas e transparência de água', tags:['água','fluido','profundidade'] },
  mesh:        { name:'Mesh',          desc:'Gradient mesh orgânico, blobs de cor sobrepostos', tags:['orgânico','fluido','2026'] },
  void:        { name:'Void',          desc:'Preto absoluto, 1 acento — tipografia como design', tags:['minimalismo','editorial','silêncio'] },
};

// ── SVG micro-helpers (text lines) ───────────────
function _T(x,y,w,h,fill,op=0.5){
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" opacity="${op}" rx="1.5"/>`;
}
function _TB(x,y,lineW,fill,n=3,lh=5,gap=9,op=0.55){
  return Array.from({length:n},(_,i)=>_T(x,y+i*gap,i===n-1?lineW*.6:lineW,lh,fill,Math.max(op-i*.08,.1))).join('');
}

// ── 11 thumbnails LUMINOSOS ───────────────────────
function svgModelThumb(id, C) {
  const bg  = `#${C.bg}`,  bg2 = `#${C.bg2}`;
  const txt = `#${C.txt}`, mu  = `#${C.muted}`;
  const a1  = `#${C.a1}`,  a2  = `#${C.a2}`;
  const tl  = `#${C.teal||C.a2}`;
  const p   = id.slice(0,4); // namespace prefix para IDs únicos no DOM

  const O = `xmlns="http://www.w3.org/2000/svg"`;
  const open = `<svg ${O} viewBox="0 0 320 180" width="100%" preserveAspectRatio="xMidYMid meet">`;

  switch(id) {

    /* ═══════════════════════════════════════════════
       CLÁSSICO — split luminoso, glow de acento
    ═══════════════════════════════════════════════ */
    case 'classico': return `${open}
      <defs>
        <linearGradient id="${p}lg1" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stop-color="${a1}" stop-opacity=".55"/>
          <stop offset="100%" stop-color="${a2}" stop-opacity="0"/>
        </linearGradient>
        <radialGradient id="${p}rg1" cx="0%" cy="100%" r="80%">
          <stop offset="0%" stop-color="${a1}" stop-opacity=".22"/>
          <stop offset="100%" stop-color="${a1}" stop-opacity="0"/>
        </radialGradient>
        <filter id="${p}gf1"><feGaussianBlur stdDeviation="7"/></filter>
        <filter id="${p}gf2"><feGaussianBlur stdDeviation="3"/></filter>
      </defs>
      <rect width="320" height="180" fill="${bg}"/>
      <rect x="180" width="140" height="180" fill="${bg2}"/>
      <!-- glow atmosférico esquerdo -->
      <ellipse cx="0" cy="180" rx="160" ry="130" fill="${a1}" opacity=".18" filter="url(#${p}gf1)"/>
      <!-- sweep diagonal branca -->
      <rect width="320" height="180" fill="url(#${p}lg1)"/>
      <!-- acento esq: barra de luz -->
      <rect x="0" y="172" width="180" height="4" fill="url(#${p}lg1)"/>
      <rect x="0" y="172" width="70" height="4" fill="${a2}" opacity=".8" filter="url(#${p}gf2)"/>
      <!-- texto esq -->
      ${_T(18,38,55,3,a1,.7)}
      ${_TB(18,49,148,txt,4,5,11,.8)}
      <!-- col direita — blocos com dot de cor -->
      ${[0,1,2].map((i,_,arr)=>{
        const cols=[a1,a2,tl]; const y=48+i*28;
        return `<circle cx="196" cy="${y+2}" r="3.5" fill="${cols[i]}" opacity=".9" filter="url(#${p}gf2)"/>
                ${_T(205,y,88,5,txt,.55)}
                ${_T(205,y+9,66,3,mu,.3)}`;
      }).join('')}
    </svg>`;

    /* ═══════════════════════════════════════════════
       MODERNO — diagonal gradient header + glow orb
    ═══════════════════════════════════════════════ */
    case 'moderno': return `${open}
      <defs>
        <linearGradient id="${p}hg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${a1}"/>
          <stop offset="100%" stop-color="${a2}"/>
        </linearGradient>
        <radialGradient id="${p}orb" cx="70%" cy="30%" r="50%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity=".25"/>
          <stop offset="100%" stop-color="${a1}" stop-opacity="0"/>
        </radialGradient>
        <clipPath id="${p}clip">
          <polygon points="0,0 320,0 320,100 0,88"/>
        </clipPath>
        <filter id="${p}gf"><feGaussianBlur stdDeviation="10"/></filter>
      </defs>
      <rect width="320" height="180" fill="${bg}"/>
      <!-- header diagonal -->
      <rect width="320" height="180" fill="url(#${p}hg)" clip-path="url(#${p}clip)"/>
      <!-- glow orb no header -->
      <ellipse cx="260" cy="35" rx="100" ry="70" fill="url(#${p}orb)"/>
      <!-- shimmer sweep diagonal -->
      <rect x="-40" y="0" width="80" height="180" fill="#ffffff" opacity=".07" transform="skewX(-18)" />
      <!-- título no header -->
      ${_T(18,18,200,17,'#000',0.85)}
      ${_T(18,44,130,9,'#000',0.55)}
      <!-- glow de borda diagonal -->
      <rect width="320" height="3" fill="${a2}" opacity=".6"/>
      <!-- corpo abaixo -->
      ${_TB(18,108,140,txt,2,6,13,.65)}
      <!-- dots de destaque -->
      ${[0,1,2].map(i=>`<rect x="${258+i*16}" y="120" width="10" height="28" fill="${[a1,a2,tl][i]}" opacity=".5" rx="5"/>`).join('')}
    </svg>`;

    /* ═══════════════════════════════════════════════
       MINIMALISTA — linha de luz, espaço, respiração
    ═══════════════════════════════════════════════ */
    case 'minimalista': return `${open}
      <defs>
        <linearGradient id="${p}lg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${a1}" stop-opacity="0"/>
          <stop offset="30%" stop-color="${a2}" stop-opacity=".9"/>
          <stop offset="70%" stop-color="${a1}" stop-opacity=".9"/>
          <stop offset="100%" stop-color="${a1}" stop-opacity="0"/>
        </linearGradient>
        <radialGradient id="${p}rg" cx="50%" cy="50%" r="40%">
          <stop offset="0%" stop-color="${a1}" stop-opacity=".14"/>
          <stop offset="100%" stop-color="${a1}" stop-opacity="0"/>
        </radialGradient>
        <filter id="${p}gf"><feGaussianBlur stdDeviation="4"/></filter>
      </defs>
      <rect width="320" height="180" fill="${bg}"/>
      <!-- glow radial centrado na linha -->
      <ellipse cx="160" cy="82" rx="180" ry="55" fill="url(#${p}rg)"/>
      <!-- linha de luz -->
      <rect x="20" y="82" width="280" height="1.5" fill="url(#${p}lg)"/>
      <rect x="20" y="82" width="280" height="1.5" fill="url(#${p}lg)" filter="url(#${p}gf)" opacity=".8"/>
      <!-- eyebrow -->
      ${_T(20,66,72,3,a1,.6)}
      <!-- título grande -->
      ${_T(20,90,230,16,txt,.9)}
      ${_T(20,113,180,10,txt,.65)}
      ${_T(20,130,130,7,mu,.4)}
      ${_T(20,143,90,5,mu,.25)}
    </svg>`;

    /* ═══════════════════════════════════════════════
       CYBERGRID — grade neon + orbe com glow intenso
    ═══════════════════════════════════════════════ */
    case 'cybergrid': {
      const gH = Array.from({length:31},(_,i)=>
        `<line x1="0" y1="${i*6}" x2="320" y2="${i*6}" stroke="${a1}" stroke-width=".4" opacity=".12"/>`).join('');
      const gV = Array.from({length:32},(_,i)=>
        `<line x1="${i*10.3}" y1="0" x2="${i*10.3}" y2="180" stroke="${tl}" stroke-width=".4" opacity=".1"/>`).join('');
      return `${open}
        <defs>
          <radialGradient id="${p}orb1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${a1}" stop-opacity=".85"/>
            <stop offset="50%" stop-color="${a1}" stop-opacity=".2"/>
            <stop offset="100%" stop-color="${a1}" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="${p}orb2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${tl}" stop-opacity=".6"/>
            <stop offset="100%" stop-color="${tl}" stop-opacity="0"/>
          </radialGradient>
          <filter id="${p}gf1"><feGaussianBlur stdDeviation="18"/></filter>
          <filter id="${p}gf2"><feGaussianBlur stdDeviation="3"/></filter>
        </defs>
        <rect width="320" height="180" fill="${bg}"/>
        ${gH}${gV}
        <!-- glow orb principal -->
        <ellipse cx="252" cy="90" rx="90" ry="80" fill="url(#${p}orb1)" filter="url(#${p}gf1)"/>
        <!-- glow orb secundário -->
        <ellipse cx="60" cy="150" rx="55" ry="45" fill="url(#${p}orb2)" filter="url(#${p}gf1)"/>
        <!-- HUD corners -->
        ${[[18,20,1,1],[290,20,-1,1],[18,154,1,-1],[290,154,-1,-1]].map(([x,y,fx,fy])=>
          `<line x1="${x}" y1="${y}" x2="${x+fx*16}" y2="${y}" stroke="${a1}" stroke-width="1.5" opacity=".8" filter="url(#${p}gf2)"/>
           <line x1="${x}" y1="${y}" x2="${x}" y2="${y+fy*16}" stroke="${a1}" stroke-width="1.5" opacity=".8" filter="url(#${p}gf2)"/>`).join('')}
        <!-- textos neon -->
        ${_T(30,30,72,4,a2,.8)}
        ${_T(30,43,210,13,a1,.9)}
        ${_T(30,64,160,7,tl,.55)}
        ${_T(30,78,100,5,mu,.4)}
      </svg>`;
    }

    /* ═══════════════════════════════════════════════
       BRUTAL — diagonal clipPath + alto contraste
    ═══════════════════════════════════════════════ */
    case 'brutal': return `${open}
      <defs>
        <clipPath id="${p}cp1">
          <polygon points="0,0 210,0 170,180 0,180"/>
        </clipPath>
        <clipPath id="${p}cp2">
          <polygon points="170,0 230,0 190,180 150,180"/>
        </clipPath>
        <linearGradient id="${p}lg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${a1}"/>
          <stop offset="100%" stop-color="${a2}"/>
        </linearGradient>
        <filter id="${p}gf"><feGaussianBlur stdDeviation="8"/></filter>
      </defs>
      <rect width="320" height="180" fill="${bg}"/>
      <!-- bloco diagonal principal -->
      <rect width="320" height="180" fill="url(#${p}lg)" clip-path="url(#${p}cp1)"/>
      <!-- faixa intermediária -->
      <rect width="320" height="180" fill="${a2}" clip-path="url(#${p}cp2)" opacity=".6"/>
      <!-- glow no corte diagonal -->
      <line x1="170" y1="0" x2="130" y2="180" stroke="${a2}" stroke-width="6" opacity=".4" filter="url(#${p}gf)"/>
      <!-- textos no bloco -->
      ${_T(14,22,155,18,bg,.9)}
      ${_T(14,50,115,10,bg,.68)}
      ${_T(14,68,85,6,bg,.42)}
      <!-- acento canto inferior direito -->
      <rect x="240" y="130" width="80" height="50" fill="${a1}" opacity=".15" rx="4"/>
    </svg>`;

    /* ═══════════════════════════════════════════════
       AURORA — orbes atmosféricos com feGaussianBlur
    ═══════════════════════════════════════════════ */
    case 'aurora': return `${open}
      <defs>
        <radialGradient id="${p}o1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${a1}" stop-opacity=".8"/>
          <stop offset="100%" stop-color="${a1}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="${p}o2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${a2}" stop-opacity=".7"/>
          <stop offset="100%" stop-color="${a2}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="${p}o3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${tl}" stop-opacity=".65"/>
          <stop offset="100%" stop-color="${tl}" stop-opacity="0"/>
        </radialGradient>
        <filter id="${p}gf1"><feGaussianBlur stdDeviation="28"/></filter>
        <filter id="${p}gf2"><feGaussianBlur stdDeviation="14"/></filter>
        <linearGradient id="${p}glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${bg}" stop-opacity=".72"/>
          <stop offset="100%" stop-color="${bg}" stop-opacity=".22"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="${bg}"/>
      <!-- orbes atmosféricos -->
      <ellipse cx="60" cy="70" rx="100" ry="90" fill="url(#${p}o1)" filter="url(#${p}gf1)"/>
      <ellipse cx="260" cy="110" rx="90" ry="80" fill="url(#${p}o2)" filter="url(#${p}gf1)"/>
      <ellipse cx="160" cy="-10" rx="70" ry="65" fill="url(#${p}o3)" filter="url(#${p}gf2)"/>
      <!-- glass overlay para área de conteúdo -->
      <rect width="210" height="180" fill="url(#${p}glass)"/>
      <!-- linha de separação luminosa -->
      <line x1="200" y1="0" x2="200" y2="180" stroke="${a1}" stroke-width=".8" opacity=".2"/>
      <!-- conteúdo -->
      ${_T(16,32,80,3,a1,.7)}
      ${_T(16,42,180,18,txt,.85)}
      ${_T(16,68,140,9,txt,.6)}
      ${_T(16,85,105,6,mu,.4)}
    </svg>`;

    /* ═══════════════════════════════════════════════
       NOIR — cinematic, queima de cor, glow dramático
    ═══════════════════════════════════════════════ */
    case 'noir': return `${open}
      <defs>
        <radialGradient id="${p}burn" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="${a1}" stop-opacity=".9"/>
          <stop offset="40%" stop-color="${a1}" stop-opacity=".3"/>
          <stop offset="100%" stop-color="${a1}" stop-opacity="0"/>
        </radialGradient>
        <filter id="${p}gf1"><feGaussianBlur stdDeviation="12"/></filter>
        <filter id="${p}gf2"><feGaussianBlur stdDeviation="3"/></filter>
      </defs>
      <rect width="320" height="180" fill="#050505"/>
      <!-- glow difuso centrado na faixa -->
      <ellipse cx="160" cy="76" rx="260" ry="50" fill="url(#${p}burn)" filter="url(#${p}gf1)"/>
      <!-- faixa de cor queimada -->
      <rect y="72" width="320" height="8" fill="${a1}"/>
      <rect y="72" width="320" height="8" fill="${a2}" opacity=".5" filter="url(#${p}gf2)"/>
      <!-- halos acima e abaixo da faixa -->
      <rect y="68" width="320" height="3" fill="${a1}" opacity=".3"/>
      <rect y="80" width="320" height="2" fill="${a2}" opacity=".2"/>
      <!-- textos brancos -->
      ${_T(14,14,220,18,'#ffffff',.88)}
      ${_T(14,40,175,11,'#ffffff',.65)}
      ${_T(14,90,160,8,'#ffffff',.4)}
      ${_T(14,106,110,6,'#ffffff',.28)}
    </svg>`;

    /* ═══════════════════════════════════════════════
       BAUHAUS — círculo com gradiente + glow externo
    ═══════════════════════════════════════════════ */
    case 'bauhaus': return `${open}
      <defs>
        <radialGradient id="${p}cg" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="${a2}"/>
          <stop offset="50%" stop-color="${a1}"/>
          <stop offset="100%" stop-color="${a1}" stop-opacity=".5"/>
        </radialGradient>
        <radialGradient id="${p}glw" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${a1}" stop-opacity=".6"/>
          <stop offset="100%" stop-color="${a1}" stop-opacity="0"/>
        </radialGradient>
        <filter id="${p}gf1"><feGaussianBlur stdDeviation="16"/></filter>
        <filter id="${p}gf2"><feGaussianBlur stdDeviation="5"/></filter>
      </defs>
      <rect width="320" height="180" fill="${bg}"/>
      <!-- glow externo do círculo -->
      <circle cx="208" cy="88" r="110" fill="url(#${p}glw)" filter="url(#${p}gf1)"/>
      <!-- círculo principal com gradiente -->
      <circle cx="208" cy="88" r="100" fill="url(#${p}cg)"/>
      <!-- inner circle escuro para profundidade -->
      <circle cx="208" cy="88" r="68" fill="${bg}" opacity=".18"/>
      <!-- mini círculo tl -->
      <circle cx="22" cy="158" r="28" fill="${tl}" opacity=".25" filter="url(#${p}gf2)"/>
      <!-- textos -->
      ${_T(14,18,132,18,txt,.88)}
      ${_T(14,45,100,10,txt,.65)}
      <rect x="14" y="64" width="44" height="2" fill="${a1}" opacity=".75"/>
      ${_T(14,72,80,6,mu,.38)}
    </svg>`;

    /* ═══════════════════════════════════════════════
       REVISTA — espinha com gradiente + shimmer
    ═══════════════════════════════════════════════ */
    case 'revista': return `${open}
      <defs>
        <linearGradient id="${p}sp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${a2}"/>
          <stop offset="100%" stop-color="${a1}"/>
        </linearGradient>
        <linearGradient id="${p}sw" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
          <stop offset="50%" stop-color="#ffffff" stop-opacity=".06"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </linearGradient>
        <filter id="${p}gf"><feGaussianBlur stdDeviation="4"/></filter>
      </defs>
      <rect width="320" height="180" fill="${bg}"/>
      <!-- shimmer diagonal -->
      <rect x="-40" width="400" height="180" fill="url(#${p}sw)" transform="skewX(-20)"/>
      <!-- espinha com gradiente + glow -->
      <rect width="9" height="180" fill="url(#${p}sp)"/>
      <rect width="9" height="180" fill="url(#${p}sp)" opacity=".5" filter="url(#${p}gf)"/>
      <!-- divisor de colunas -->
      <line x1="148" y1="10" x2="148" y2="170" stroke="${a1}" stroke-width=".8" opacity=".2"/>
      <!-- col esq -->
      ${_T(17,18,110,18,txt,.88)}
      ${_T(17,44,110,11,txt,.65)}
      ${_T(17,63,110,8,txt,.48)}
      ${_T(17,78,85,5,mu,.3)}
      <!-- col dir — 3 items com dot luminoso -->
      ${[0,1,2].map(i=>{
        const y=44+i*32, c=[a1,a2,tl][i];
        return `<circle cx="162" cy="${y+3}" r="4" fill="${c}" opacity=".9" filter="url(#${p}gf)"/>
                ${_T(172,y,118,6,txt,.55)}
                ${_T(172,y+10,90,4,mu,.3)}`;
      }).join('')}
    </svg>`;

    /* ═══════════════════════════════════════════════
       ECLIPSE — halos com radialGradient + glow core
    ═══════════════════════════════════════════════ */
    case 'eclipse': return `${open}
      <defs>
        <radialGradient id="${p}core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${a2}" stop-opacity=".95"/>
          <stop offset="40%" stop-color="${a1}" stop-opacity=".5"/>
          <stop offset="100%" stop-color="${a1}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="${p}h1" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stop-color="transparent"/>
          <stop offset="80%" stop-color="${a1}" stop-opacity=".35"/>
          <stop offset="100%" stop-color="transparent"/>
        </radialGradient>
        <radialGradient id="${p}h2" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stop-color="transparent"/>
          <stop offset="80%" stop-color="${a2}" stop-opacity=".22"/>
          <stop offset="100%" stop-color="transparent"/>
        </radialGradient>
        <radialGradient id="${p}h3" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stop-color="transparent"/>
          <stop offset="80%" stop-color="${tl}" stop-opacity=".15"/>
          <stop offset="100%" stop-color="transparent"/>
        </radialGradient>
        <filter id="${p}gf1"><feGaussianBlur stdDeviation="10"/></filter>
        <filter id="${p}gf2"><feGaussianBlur stdDeviation="3"/></filter>
      </defs>
      <rect width="320" height="180" fill="${bg}"/>
      <!-- halos concêntricos -->
      <ellipse cx="210" cy="90" rx="130" ry="105" fill="url(#${p}h3)"/>
      <ellipse cx="210" cy="90" rx="100" ry="80" fill="url(#${p}h2)"/>
      <ellipse cx="210" cy="90" rx="72" ry="58" fill="url(#${p}h1)"/>
      <!-- núcleo com glow -->
      <ellipse cx="210" cy="90" rx="40" ry="32" fill="url(#${p}core)"/>
      <ellipse cx="210" cy="90" rx="40" ry="32" fill="${a1}" opacity=".35" filter="url(#${p}gf1)"/>
      <!-- panel esq -->
      <rect width="118" height="180" fill="${bg}" opacity=".55"/>
      ${_T(12,22,82,16,txt,.85)}
      ${_T(12,46,70,9,txt,.58)}
      ${_T(12,63,58,6,mu,.38)}
      <!-- acento linha -->
      <line x1="12" y1="80" x2="90" y2="80" stroke="${a1}" stroke-width="1" opacity=".4" filter="url(#${p}gf2)"/>
    </svg>`;

    /* ═══════════════════════════════════════════════
       LUMINA PRISM — glass card, prism edge, orbes
    ═══════════════════════════════════════════════ */
    case 'lumina': return `${open}
      <defs>
        <linearGradient id="${p}bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${a1}" stop-opacity=".55"/>
          <stop offset="50%" stop-color="${tl}" stop-opacity=".3"/>
          <stop offset="100%" stop-color="${a2}" stop-opacity=".5"/>
        </linearGradient>
        <linearGradient id="${p}prism" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="${a2}"/>
          <stop offset="33%"  stop-color="${tl}"/>
          <stop offset="66%"  stop-color="${a1}"/>
          <stop offset="100%" stop-color="${a2}"/>
        </linearGradient>
        <radialGradient id="${p}o1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${a1}" stop-opacity=".7"/>
          <stop offset="100%" stop-color="${a1}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="${p}o2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${a2}" stop-opacity=".6"/>
          <stop offset="100%" stop-color="${a2}" stop-opacity="0"/>
        </radialGradient>
        <filter id="${p}gf1"><feGaussianBlur stdDeviation="20"/></filter>
        <filter id="${p}gf2"><feGaussianBlur stdDeviation="4"/></filter>
      </defs>
      <rect width="320" height="180" fill="${bg}"/>
      <!-- orbes de fundo -->
      <ellipse cx="-20" cy="-10" rx="110" ry="100" fill="url(#${p}o1)" filter="url(#${p}gf1)"/>
      <ellipse cx="340" cy="190" rx="110" ry="100" fill="url(#${p}o2)" filter="url(#${p}gf1)"/>
      <!-- glass card -->
      <rect x="14" y="18" width="292" height="146" fill="${bg2}" fill-opacity=".55" rx="8"/>
      <rect x="14" y="18" width="292" height="146" fill="url(#${p}bg)" rx="8"/>
      <!-- borda superior branca — efeito vidro -->
      <rect x="14" y="18" width="292" height="2" fill="#ffffff" opacity=".2" rx="1"/>
      <!-- aresta esq com gradiente -->
      <rect x="14" y="18" width="4" height="146" fill="url(#${p}prism)" opacity=".9" rx="2"/>
      <rect x="14" y="18" width="4" height="146" fill="url(#${p}prism)" opacity=".4" rx="2" filter="url(#${p}gf2)"/>
      <!-- borda card -->
      <rect x="14" y="18" width="292" height="146" fill="none" stroke="#ffffff" stroke-opacity=".14" stroke-width="1" rx="8"/>
      <!-- conteúdo -->
      ${_T(28,32,190,14,txt,.9)}
      <rect x="28" y="52" width="48" height="1.5" fill="url(#${p}prism)" opacity=".8"/>
      ${_T(28,60,155,8,txt,.6)}
      ${_T(28,75,118,6,mu,.42)}
      ${_T(28,88,90,5,mu,.3)}
    </svg>`;

    /* ═══════════════════════════════════════════════
       AQUA — camadas de onda, luz refratada, vidro-água
    ═══════════════════════════════════════════════ */
    case 'aqua': return `${open}
      <defs>
        <radialGradient id="${p}o1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${a1}" stop-opacity=".7"/>
          <stop offset="100%" stop-color="${a1}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="${p}o2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${tl}" stop-opacity=".6"/>
          <stop offset="100%" stop-color="${tl}" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="${p}wave" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${a1}" stop-opacity=".18"/>
          <stop offset="100%" stop-color="${a2}" stop-opacity=".42"/>
        </linearGradient>
        <filter id="${p}gf"><feGaussianBlur stdDeviation="18"/></filter>
        <clipPath id="${p}cl"><rect width="320" height="180"/></clipPath>
      </defs>
      <rect width="320" height="180" fill="${bg}"/>
      <!-- orbes de luz subaquática -->
      <ellipse cx="40" cy="50" rx="130" ry="110" fill="url(#${p}o1)" filter="url(#${p}gf)"/>
      <ellipse cx="290" cy="150" rx="120" ry="100" fill="url(#${p}o2)" filter="url(#${p}gf)"/>
      <!-- camadas de onda -->
      <g clip-path="url(#${p}cl)">
        <rect x="-10" y="98" width="340" height="28" fill="${a1}" fill-opacity=".22" rx="4"/>
        <rect x="-10" y="112" width="340" height="24" fill="${tl}" fill-opacity=".18" rx="3"/>
        <rect x="-10" y="128" width="340" height="28" fill="${a2}" fill-opacity=".20" rx="3"/>
        <rect x="-10" y="148" width="340" height="40" fill="${bg2}" fill-opacity=".55"/>
        <!-- cristas de onda (linhas brancas finas) -->
        <rect x="0" y="98" width="320" height="1.5" fill="#ffffff" opacity=".18"/>
        <rect x="0" y="112" width="320" height="1.5" fill="#ffffff" opacity=".14"/>
        <rect x="0" y="128" width="320" height="1.5" fill="#ffffff" opacity=".12"/>
        <!-- luz refratada (raios verticais) -->
        <rect x="55" y="0" width="6" height="100" fill="#ffffff" opacity=".06"/>
        <rect x="120" y="0" width="4" height="95" fill="#ffffff" opacity=".05"/>
        <rect x="190" y="0" width="5" height="98" fill="#ffffff" opacity=".05"/>
        <!-- conteúdo -->
        ${_T(18,28,200,14,txt,.9)}
        <rect x="18" y="50" width="60" height="1.5" fill="${a1}" opacity=".8"/>
        <rect x="82" y="50" width="36" height="1.5" fill="${tl}" opacity=".7"/>
        ${_TB(18,58,160,txt,3,5,9,.45)}
      </g>
    </svg>`;

    /* ═══════════════════════════════════════════════
       MESH — blobs orgânicos, gradient field, editorial
    ═══════════════════════════════════════════════ */
    case 'mesh': return `${open}
      <defs>
        <radialGradient id="${p}b1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${a1}" stop-opacity=".72"/>
          <stop offset="100%" stop-color="${a1}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="${p}b2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${a2}" stop-opacity=".65"/>
          <stop offset="100%" stop-color="${a2}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="${p}b3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${tl}" stop-opacity=".58"/>
          <stop offset="100%" stop-color="${tl}" stop-opacity="0"/>
        </radialGradient>
        <filter id="${p}gf"><feGaussianBlur stdDeviation="22"/></filter>
        <filter id="${p}gf2"><feGaussianBlur stdDeviation="8"/></filter>
        <clipPath id="${p}cl"><rect width="320" height="180"/></clipPath>
      </defs>
      <rect width="320" height="180" fill="${bg}"/>
      <g clip-path="url(#${p}cl)">
        <!-- blobs de cor -->
        <ellipse cx="55" cy="48" rx="155" ry="130" fill="url(#${p}b1)" filter="url(#${p}gf)"/>
        <ellipse cx="275" cy="138" rx="145" ry="120" fill="url(#${p}b2)" filter="url(#${p}gf)"/>
        <ellipse cx="165" cy="20" rx="100" ry="90" fill="url(#${p}b3)" filter="url(#${p}gf)"/>
        <!-- véu de legibilidade -->
        <rect width="320" height="180" fill="${bg}" opacity=".45"/>
        <!-- card de leitura translúcido -->
        <rect x="12" y="18" width="200" height="146" fill="${bg2}" fill-opacity=".48" rx="6"/>
        <rect x="12" y="18" width="200" height="2" fill="#ffffff" opacity=".18" rx="1"/>
        <rect x="12" y="18" width="4" height="146" fill="${a1}" opacity=".55" rx="2"/>
        <!-- blob decorativo no card -->
        <ellipse cx="160" cy="120" rx="80" ry="55" fill="${a2}" fill-opacity=".08" filter="url(#${p}gf2)"/>
        <!-- conteúdo -->
        ${_T(26,32,170,14,txt,.9)}
        <ellipse cx="30" cy="56" rx="7" ry="7" fill="${a1}" opacity=".9"/>
        <ellipse cx="26" cy="52" rx="11" ry="11" fill="${a1}" opacity=".3"/>
        <rect x="44" y="54" width="120" height="1.8" fill="${a2}" opacity=".7"/>
        ${_TB(26,68,155,txt,3,5,9,.45)}
      </g>
    </svg>`;

    /* ═══════════════════════════════════════════════
       VOID — preto absoluto, ponto cirúrgico, tipografia pura
    ═══════════════════════════════════════════════ */
    case 'void': return `${open}
      <defs>
        <radialGradient id="${p}pt" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${a1}" stop-opacity="1"/>
          <stop offset="100%" stop-color="${a1}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="320" height="180" fill="${bg}"/>
      <!-- ponto cirúrgico único -->
      <ellipse cx="22" cy="22" rx="12" ry="12" fill="url(#${p}pt)" opacity=".5"/>
      <ellipse cx="22" cy="22" rx="5" ry="5" fill="${a1}" opacity="1"/>
      <!-- linha horizontal cirúrgica -->
      <rect x="18" y="72" width="230" height="1.5" fill="${a1}" opacity=".9"/>
      <!-- título — peso tipográfico absoluto -->
      <text x="18" y="102" font-size="28" fill="${txt}" font-family="'Calibri Light','Arial',sans-serif" font-weight="300" opacity=".95">Título</text>
      <!-- subtítulo esmaecido -->
      ${_T(18,120,160,7,txt,.28)}
      ${_T(18,133,110,5,txt,.16)}
      <!-- data — acento da cor única -->
      <text x="302" y="170" font-size="8" fill="${a1}" font-family="'Calibri Light','Arial',sans-serif" text-anchor="end" opacity=".85">2026</text>
    </svg>`;

    default: return `${open}<rect width="320" height="180" fill="${bg}"/>
      <ellipse cx="160" cy="90" rx="80" ry="60" fill="${a1}" opacity=".2"/>
    </svg>`;
  }
}

// ── Render do grid de modelos ─────────────────────
function renderModeloGrid() {
  const el = document.getElementById('modeloGrid');
  if (!el) return;
  const T = THEMES[G.theme] || THEMES['oceano'];
  const C = T.C;

  el.innerHTML = Object.entries(MODELOS_META).map(([id, m]) => `
    <div class="modelo-card ${G.modelo === id ? 'selected' : ''}"
         id="mc-${id}" onclick="selectModelo('${id}')">
      <div class="modelo-thumb">${svgModelThumb(id, C)}</div>
      <div class="modelo-info">
        <div class="modelo-name">
          ${m.name}
          <span class="modelo-sel-badge">✓ selecionado</span>
        </div>
        <div class="modelo-desc">${m.desc}</div>
        <div class="modelo-tags">
          ${m.tags.map(t => `<span class="modelo-tag">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

// ════════════════════════════════════════════════════
// RASCUNHO
// ════════════════════════════════════════════════════
function saveDraft(){
  try{
    const snap={
      mode:G.mode, theme:G.theme,
      id:{...G.id,logoInst:null,logoProg:null,bi2025:null,bi2026:null},
      projects:G.projects.map(p=>({...p,evidencias:[null,null,null,null],antesdepois:{...p.antesdepois,antes_img:null,depois_img:null}})),
      blocks:G.blocks, ts:new Date().toISOString()
    };
    const blob=new Blob([JSON.stringify(snap,null,2)],{type:'application/json'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='wren-rascunho.json'; a.click();
    toast('Rascunho salvo (imagens não incluídas)','ok');
  }catch(e){ toast('Erro ao salvar','err'); }
}
