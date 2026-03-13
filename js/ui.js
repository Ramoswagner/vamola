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
const STEPS = ['identity','blocks','theme','projects','generate'];

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

  const bg = document.getElementById('slideBg');
  if(bg) bg.style.background = `#${C.bg}`;

  const acc = document.getElementById('slideAccent');
  if(acc) acc.style.background = `linear-gradient(90deg,#${C.a1},#${C.a2})`;

  const ey = document.getElementById('previewEyebrow');
  const tl = document.getElementById('previewTitle');
  const sb = document.getElementById('previewSub');
  if(ey) { ey.style.color = `#${C.muted}`; ey.textContent = G.id.instName || 'Organização'; }
  if(tl) { tl.style.color = `#${C.txt}`; tl.textContent = G.id.presTitle || 'Título da Apresentação'; }
  if(sb) { sb.style.color = `#${C.muted}`; sb.textContent = G.id.presDate || 'Data'; }

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
// PROJETOS
// ════════════════════════════════════════════════════
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
};

// ── SVG helpers privados ──────────────────────────
function _R(x,y,w,h,fill,extra=''){
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
}
function _E(cx,cy,rx,ry,fill,op=1){
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" opacity="${op}"/>`;
}
function _C(cx,cy,r,fill,op=1){
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" opacity="${op}"/>`;
}
// Linha de texto simulada (retângulo arredondado)
function _T(x,y,w,h,fill,op=0.5){
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" opacity="${op}" rx="1.5"/>`;
}
// Bloco de texto simulado — N linhas empilhadas
function _TB(x,y,lineW,fill,n=3,lh=5,gap=9,op=0.5){
  return Array.from({length:n},(_,i)=>_T(x,y+i*gap, i===n-1?lineW*0.62:lineW, lh, fill, op-(i*0.06))).join('');
}
// SVG container
function _SVG(content){
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" width="100%" preserveAspectRatio="xMidYMid meet">${content}</svg>`;
}

// ── 11 thumbnails — um por modelo ────────────────
function svgModelThumb(id, C) {
  const bg=`#${C.bg}`, bg2=`#${C.bg2}`, txt=`#${C.txt}`, muted=`#${C.muted}`;
  const a1=`#${C.a1}`, a2=`#${C.a2}`, a3=`#${C.a3||C.a2}`;
  const teal=`#${C.teal||C.a2}`;

  switch(id) {

    // ── Clássico: split vertical 56 / 44 + linha de acento ──
    case 'classico': return _SVG(`
      ${_R(0,0,320,180,bg)}
      ${_R(179,0,141,180,bg2)}
      ${_R(0,176,180,4,a1)}
      ${_R(0,176,70,4,a2)}
      ${_T(18,42,52,3,a1,0.6)}
      ${_TB(18,52,148,txt,4,6,12,0.75)}
      ${[0,1,2].map(i=>_R(202,54+i*26,44,4,a1,`opacity="${0.3+i*0.15}"`)).join('')}
      ${_R(202,54,8,4,a1,'opacity="0.8"')}
      ${_R(202,80,8,4,a2,'opacity="0.8"')}
      ${_R(202,106,8,4,teal,'opacity="0.8"')}
    `);

    // ── Moderno: bloco superior a1 + divisor diagonal ──
    case 'moderno': return _SVG(`
      ${_R(0,0,320,180,bg)}
      ${_R(0,0,320,94,a1)}
      ${_R(0,86,320,15,bg2)}
      ${_R(0,94,320,86,bg)}
      ${_R(0,0,320,3,a2)}
      ${_T(18,14,200,18,bg,0.9)}
      ${_T(18,40,130,10,bg,0.65)}
      ${_T(18,57,90,6,bg,0.4)}
      ${_TB(18,110,130,txt,2,5,11,0.65)}
      ${[0,1,2].map(i=>_R(282,12+i*22,6,26,bg,`opacity="0.35"`)).join('')}
    `);

    // ── Minimalista: linha única + tipografia leve ──
    case 'minimalista': return _SVG(`
      ${_R(0,0,320,180,bg)}
      ${_R(20,76,280,1,a1)}
      ${_T(20,60,80,4,muted,0.55)}
      ${_T(20,83,220,18,txt,0.88)}
      ${_T(20,107,160,11,txt,0.65)}
      ${_T(20,124,120,7,muted,0.38)}
      ${_T(20,138,80,5,muted,0.25)}
    `);

    // ── CyberGrid: grade + caixa neon + brackets HUD ──
    case 'cybergrid': {
      const gridH = Array.from({length:31},(_,i)=>
        `<line x1="0" y1="${i*6}" x2="320" y2="${i*6}" stroke="${a1}" stroke-width="0.5" opacity="0.1"/>`).join('');
      const gridV = Array.from({length:31},(_,i)=>
        `<line x1="${i*10.67}" y1="0" x2="${i*10.67}" y2="180" stroke="${a1}" stroke-width="0.5" opacity="0.1"/>`).join('');
      const corners = [
        [18,22,1,1],[285,22,-1,1],[18,148,1,-1],[285,148,-1,-1]
      ].map(([x,y,fx,fy])=>
        `<line x1="${x}" y1="${y}" x2="${x+fx*14}" y2="${y}" stroke="${a1}" stroke-width="1.5" opacity="0.65"/>
         <line x1="${x}" y1="${y}" x2="${x}" y2="${y+fy*14}" stroke="${a1}" stroke-width="1.5" opacity="0.65"/>`
      ).join('');
      return _SVG(`
        ${_R(0,0,320,180,bg)}
        ${gridH}${gridV}
        ${_R(18,22,285,130,bg2,'opacity="0.65"')}
        ${_R(18,22,285,2,a1,'opacity="0.7"')}
        ${_R(18,22,2,130,a1,'opacity="0.7"')}
        ${_T(30,32,70,4,a2,0.75)}
        ${_T(30,44,220,14,a1,0.9)}
        ${_T(30,65,170,8,a1,0.55)}
        ${_T(30,80,110,5,muted,0.45)}
        ${corners}
      `);
    }

    // ── Brutal: bloco sólido + strip + acento ──
    case 'brutal': return _SVG(`
      ${_R(0,0,320,180,bg)}
      ${_R(0,0,200,180,a1)}
      ${_R(174,0,44,180,bg2)}
      ${_R(220,104,100,76,a2)}
      ${_T(14,22,160,18,bg,0.9)}
      ${_T(14,48,120,11,bg,0.68)}
      ${_T(14,67,80,6,bg,0.42)}
      ${_T(14,155,60,4,bg,0.3)}
    `);

    // ── Aurora: orbes difusos + névoa + linha de luz ──
    case 'aurora': return _SVG(`
      ${_R(0,0,320,180,bg)}
      ${_E(48,63,90,99,a1,0.13)}
      ${_E(230,108,70,79,a2,0.13)}
      ${_E(144,18,58,58,teal,0.10)}
      ${_R(0,0,208,180,bg,'opacity="0.38"')}
      ${_R(0,0,208,180,a1,'opacity="0.05"')}
      ${_R(0,86,208,1,a2,'opacity="0.55"')}
      ${_T(16,36,180,20,txt,0.82)}
      ${_T(16,62,130,10,txt,0.55)}
      ${_T(16,78,95,6,muted,0.4)}
    `);

    // ── Noir: preto + faixa de cor + texto branco ──
    case 'noir': return _SVG(`
      ${_R(0,0,320,180,'#000000')}
      ${_R(0,68,320,6,a1)}
      ${_R(0,62,320,3,a1,'opacity="0.22"')}
      ${_T(14,12,220,20,'#ffffff',0.88)}
      ${_T(14,38,180,13,'#ffffff',0.68)}
      ${_T(14,80,160,9,'#ffffff',0.42)}
      ${_T(14,95,110,7,'#ffffff',0.3)}
    `);

    // ── Bauhaus: círculo dominante + acento + texto ──
    case 'bauhaus': return _SVG(`
      ${_R(0,0,320,180,bg)}
      ${_C(198,81,115,a1)}
      ${_C(0,0,43,a2,0.28)}
      ${_C(206,88,94,bg,'0.12')}
      ${_T(14,18,140,20,txt,0.88)}
      ${_T(14,46,105,11,txt,0.65)}
      ${_R(14,66,50,2,a1,'opacity="0.7"')}
      ${_T(14,74,82,6,muted,0.38)}
    `);

    // ── Revista: espinha + 2 colunas editoriais ──
    case 'revista': return _SVG(`
      ${_R(0,0,320,180,bg)}
      ${_R(0,0,9,180,a1)}
      ${_R(9,0,1,180,a1,'opacity="0.25"')}
      ${_T(17,16,110,20,txt,0.88)}
      ${_T(17,43,110,13,txt,0.65)}
      ${_T(17,62,110,8,txt,0.5)}
      ${_T(17,76,85,6,muted,0.33)}
      ${_R(138,8,1,164,a1,'opacity="0.2"')}
      ${[0,1,2].map(i=>`
        ${_C(157,54+i*30,6,a2,0.75)}
        ${_T(170,50+i*30,120,6,txt,0.55)}
        ${_R(148,63+i*30,140,1,a1,'opacity="0.18"')}
      `).join('')}
    `);

    // ── Eclipse: halos concêntricos + conteúdo à esquerda ──
    case 'eclipse': {
      const halos = [
        [88,63,a1,0.07],[75,54,a2,0.10],[62,44,a1,0.13],
        [50,36,a2,0.16],[35,25,a1,0.20],[20,14,a1,0.26]
      ].map(([rx,ry,fill,op])=>_E(190,83,rx,ry,fill,op)).join('');
      return _SVG(`
        ${_R(0,0,320,180,bg)}
        ${halos}
        ${_R(0,0,104,180,bg,'opacity="0.52"')}
        ${_T(12,20,82,18,txt,0.82)}
        ${_T(12,44,70,10,txt,0.55)}
        ${_T(12,60,60,7,muted,0.35)}
      `);
    }

    // ── Lumina Prism: glassmorphism + orbes + card ──
    case 'lumina': return _SVG(`
      ${_R(0,0,320,180,bg)}
      ${_E(-32,-18,96,96,a1,0.13)}
      ${_E(352,198,96,96,a2,0.13)}
      ${_R(16,22,288,140,bg2,'fill-opacity="0.55" rx="6"')}
      ${_R(16,22,288,140,'none',`stroke="${a3}" stroke-opacity="0.28" stroke-width="1" rx="6"`)}
      ${_R(16,22,6,140,a1,'opacity="0.65" rx="3"')}
      ${_R(16,22,288,2,'#ffffff','opacity="0.15" rx="6"')}
      ${_T(30,36,200,16,txt,0.88)}
      ${_R(30,58,50,1,a1,'opacity="0.55"')}
      ${_T(30,65,160,8,txt,0.55)}
      ${_T(30,79,120,6,muted,0.38)}
      ${_T(30,91,90,5,muted,0.28)}
    `);

    default: return _SVG(`${_R(0,0,320,180,bg)}${_T(120,80,80,10,a1,0.5)}`);
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
