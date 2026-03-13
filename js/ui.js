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
