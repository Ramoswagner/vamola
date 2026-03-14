// js/pdf.js — Exportação PDF via html2canvas + jsPDF
// Renderiza cada slide como HTML isolado → captura → monta PDF A4 paisagem

// ═══════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════

const PDF_W    = 1280;
const PDF_H    = 720;
const PDF_FONT = '-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif';

// ═══════════════════════════════════════════════════════════
// LIBS SOB DEMANDA
// ═══════════════════════════════════════════════════════════

function _loadScript(src) {
  return new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) return res();
    const s = document.createElement('script');
    s.src = src; s.onload = res;
    s.onerror = () => rej(new Error('Falha ao carregar: ' + src));
    document.head.appendChild(s);
  });
}

async function loadPdfLibs() {
  const jobs = [];
  if (!window.html2canvas)
    jobs.push(_loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'));
  if (!window.jspdf)
    jobs.push(_loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'));
  await Promise.all(jobs);
}

// ═══════════════════════════════════════════════════════════
// HELPERS DE TEMA E MODELO
// ═══════════════════════════════════════════════════════════

function _pdfC() {
  const T = THEMES[G.theme];
  if (!T) return null;
  const C = T.C;
  return {
    bg:   `#${C.bg}`,   bg2: `#${C.bg2}`,
    txt:  `#${C.txt}`,  mu:  `#${C.muted}`,
    a1:   `#${C.a1}`,   a2:  `#${C.a2}`,
    tl:   `#${C.teal || C.a2}`,
  };
}

// Família visual: como o HTML vai se parecer (8 grupos)
function _family(m) {
  if (['moderno','brutal'].includes(m))                      return 'header';   // bloco de cor no topo
  if (['aurora','eclipse','lumina','cybergrid'].includes(m)) return 'glow';     // orbes + escuro
  if (m === 'minimalista')                                   return 'line';     // linha horizontal
  if (m === 'bauhaus')                                       return 'bauhaus';  // círculo dominante
  if (m === 'noir')                                          return 'noir';     // faixa de cor queimada
  if (m === 'aqua')                                          return 'aqua';     // camadas de onda, vidro-água
  if (m === 'mesh')                                          return 'mesh';     // gradient blobs orgânicos
  if (m === 'void')                                          return 'void';     // preto absoluto, 1 acento
  return 'classic';  // classico, revista
}

function safe(v, fb = '') { return v && String(v).trim() ? String(v) : fb; }

// ═══════════════════════════════════════════════════════════
// DECORAÇÃO DE FUNDO (por família)
// ═══════════════════════════════════════════════════════════

function _decor(C, fam, isCover = false) {
  const h = isCover ? '55%' : '38%';
  switch (fam) {
    case 'header':
      return `<div style="position:absolute;inset:0;background:${C.bg}"></div>
              <div style="position:absolute;top:0;left:0;right:0;height:${h};background:linear-gradient(135deg,${C.a1},${C.a2})"></div>`;
    case 'glow':
      return `<div style="position:absolute;inset:0;background:${C.bg}"></div>
              <div style="position:absolute;top:-120px;right:-120px;width:550px;height:550px;border-radius:50%;background:radial-gradient(circle,${C.a1}50 0%,transparent 65%)"></div>
              <div style="position:absolute;bottom:-90px;left:-90px;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,${C.a2}40 0%,transparent 65%)"></div>`;
    case 'line':
      return `<div style="position:absolute;inset:0;background:${C.bg}"></div>
              <div style="position:absolute;left:80px;right:80px;top:49%;height:1px;background:linear-gradient(90deg,transparent,${C.a1},${C.a2},transparent)"></div>`;
    case 'bauhaus':
      return `<div style="position:absolute;inset:0;background:${C.bg}"></div>
              <div style="position:absolute;right:-120px;top:50%;transform:translateY(-50%);width:560px;height:560px;border-radius:50%;background:${C.a1};opacity:.8"></div>
              <div style="position:absolute;right:-60px;top:50%;transform:translateY(-50%);width:420px;height:420px;border-radius:50%;background:${C.bg};opacity:.28"></div>`;
    case 'noir':
      return `<div style="position:absolute;inset:0;background:#050505"></div>
              <div style="position:absolute;left:0;right:0;top:${isCover?'55%':'43%'};height:10px;background:linear-gradient(90deg,${C.a1},${C.a2})"></div>
              <div style="position:absolute;left:0;right:0;top:${isCover?'52%':'40%'};height:20px;background:radial-gradient(ellipse at 50% 100%,${C.a1}55,transparent 80%)"></div>`;
    default: // classic
      return `<div style="position:absolute;inset:0;background:${C.bg}"></div>
              <div style="position:absolute;left:0;top:0;bottom:0;width:6px;background:linear-gradient(180deg,${C.a2},${C.a1})"></div>
              <div style="position:absolute;left:0;bottom:0;right:0;height:4px;background:linear-gradient(90deg,${C.a1},${C.a2},transparent)"></div>`;

    case 'aqua': {
      const yW1 = isCover ? '58%' : '52%';
      const yW2 = isCover ? '66%' : '60%';
      const yW3 = isCover ? '74%' : '68%';
      return `<div style="position:absolute;inset:0;background:${C.bg}"></div>
              <!-- orbe de luz subaquática esquerda -->
              <div style="position:absolute;left:-180px;top:${isCover?'10%':'20%'};width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,${C.a1}38 0%,transparent 65%)"></div>
              <!-- orbe direita -->
              <div style="position:absolute;right:-140px;bottom:-100px;width:440px;height:440px;border-radius:50%;background:radial-gradient(circle,${C.tl}30 0%,transparent 65%)"></div>
              <!-- camadas de onda empilhadas -->
              <div style="position:absolute;left:0;right:0;top:${yW1};height:${isCover?'60px':'55px'};background:${C.a1};opacity:.20;border-radius:50% 50% 0 0 / 8px 8px 0 0"></div>
              <div style="position:absolute;left:0;right:0;top:${yW2};height:${isCover?'55px':'50px'};background:${C.tl};opacity:.17;border-radius:50% 50% 0 0 / 6px 6px 0 0"></div>
              <div style="position:absolute;left:0;right:0;top:${yW3};height:${isCover?'60px':'55px'};background:${C.a2};opacity:.18;border-radius:50% 50% 0 0 / 6px 6px 0 0"></div>
              <!-- cristas de onda (linhas brancas finas) -->
              <div style="position:absolute;left:0;right:0;top:${yW1};height:2px;background:#fff;opacity:.13"></div>
              <div style="position:absolute;left:0;right:0;top:${yW2};height:1.5px;background:#fff;opacity:.10"></div>
              <div style="position:absolute;left:0;right:0;top:${yW3};height:1.5px;background:#fff;opacity:.09"></div>
              <!-- luz refratada: raios verticais finos -->
              <div style="position:absolute;left:18%;top:0;width:5px;height:70%;background:linear-gradient(180deg,transparent,rgba(255,255,255,.07),transparent)"></div>
              <div style="position:absolute;left:38%;top:0;width:4px;height:65%;background:linear-gradient(180deg,transparent,rgba(255,255,255,.06),transparent)"></div>
              <div style="position:absolute;left:62%;top:0;width:5px;height:68%;background:linear-gradient(180deg,transparent,rgba(255,255,255,.06),transparent)"></div>`;
    }

    case 'mesh': {
      return `<div style="position:absolute;inset:0;background:${C.bg}"></div>
              <!-- blobs orgânicos de cor -->
              <div style="position:absolute;left:-15%;top:-20%;width:65%;height:80%;border-radius:50%;background:radial-gradient(circle,${C.a1}52 0%,transparent 65%)"></div>
              <div style="position:absolute;right:-12%;bottom:-15%;width:60%;height:75%;border-radius:50%;background:radial-gradient(circle,${C.a2}48 0%,transparent 65%)"></div>
              <div style="position:absolute;left:35%;top:-5%;width:45%;height:55%;border-radius:50%;background:radial-gradient(circle,${C.tl}40 0%,transparent 65%)"></div>
              <div style="position:absolute;right:10%;top:10%;width:30%;height:38%;border-radius:50%;background:radial-gradient(circle,${C.a1}28 0%,transparent 65%)"></div>
              <!-- véu de legibilidade -->
              <div style="position:absolute;inset:0;background:${C.bg};opacity:.42"></div>`;
    }

    case 'void': {
      const lineY = isCover ? '56%' : '45%';
      return `<div style="position:absolute;inset:0;background:#000"></div>
              <!-- único ponto cirúrgico -->
              <div style="position:absolute;left:76px;top:72px;width:10px;height:10px;border-radius:50%;background:${C.a1}"></div>
              <div style="position:absolute;left:68px;top:64px;width:26px;height:26px;border-radius:50%;background:${C.a1};opacity:.18"></div>
              <!-- linha cirúrgica horizontal -->
              <div style="position:absolute;left:76px;right:80px;top:${lineY};height:1.5px;background:${C.a1};opacity:.90"></div>`;
    }
  }
}

// ═══════════════════════════════════════════════════════════
// COMPONENTES INLINE
// ═══════════════════════════════════════════════════════════

function _eye(label, C, fam) {
  const c = fam === 'header' ? 'rgba(0,0,0,.5)' : C.a2;
  return `<div style="font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${c};margin-bottom:8px;font-family:${PDF_FONT}">${label}</div>`;
}
function _h1(text, C, fam, px = 68) {
  const c = fam === 'header' ? 'rgba(0,0,0,.9)' : C.txt;
  return `<div style="font-size:${px}px;font-weight:800;line-height:1.05;letter-spacing:-2px;color:${c};font-family:${PDF_FONT};margin-bottom:14px">${safe(text,'Título')}</div>`;
}
function _h2(text, C) {
  return `<div style="font-size:40px;font-weight:700;color:${C.txt};font-family:${PDF_FONT};margin-bottom:12px;letter-spacing:-1px">${safe(text)}</div>`;
}
function _sub(text, C, fam, px = 22) {
  const c = fam === 'header' ? 'rgba(0,0,0,.55)' : C.mu;
  return `<div style="font-size:${px}px;color:${c};font-family:${PDF_FONT};line-height:1.45;margin-bottom:8px">${safe(text)}</div>`;
}
function _rule(C) {
  return `<div style="width:56px;height:3px;background:linear-gradient(90deg,${C.a1},${C.a2});border-radius:2px;margin-bottom:20px"></div>`;
}
function _badge(label, type = 'neutral') {
  const t = { ok:['#16a34a22','#16a34a55','#4ade80'], warn:['#ca8a0422','#ca8a0455','#fbbf24'], err:['#dc262622','#dc262655','#f87171'], neutral:['#ffffff11','#ffffff22','#aaaaaa'] }[type] || t.neutral;
  return `<span style="display:inline-block;padding:3px 10px;border-radius:4px;background:${t[0]};border:1px solid ${t[1]};color:${t[2]};font-size:12px;font-family:${PDF_FONT};white-space:nowrap">${label}</span>`;
}
function _card(inner, C, accent = false) {
  const border = accent ? `border-top:3px solid ${C.a2}` : `border:1px solid ${C.a1}1a`;
  return `<div style="background:${C.bg2};${border};border-radius:10px;padding:22px 26px">${inner}</div>`;
}

// Shell de slide — posiciona conteúdo sobre o decor
function _shell(decor, body, C, fam, padTop = '') {
  const pt = padTop || (fam === 'header' ? '240px' : '68px');
  return `<div style="width:${PDF_W}px;height:${PDF_H}px;position:relative;overflow:hidden;font-family:${PDF_FONT}">
    ${decor}
    <div style="position:absolute;inset:0;padding:${pt} 80px 50px 80px;display:flex;flex-direction:column;z-index:10">
      ${body}
    </div>
  </div>`;
}

// ═══════════════════════════════════════════════════════════
// SLIDE RENDERERS
// ═══════════════════════════════════════════════════════════

function _sCapa(C, fam) {
  const id = G.id;
  let decor;
  if (fam === 'classic') {
    decor = `<div style="position:absolute;inset:0;background:${C.bg}"></div>
             <div style="position:absolute;right:0;top:0;width:40%;bottom:0;background:${C.bg2}"></div>
             <div style="position:absolute;left:0;bottom:0;width:60%;height:5px;background:linear-gradient(90deg,${C.a1},${C.a2})"></div>`;
  } else if (fam === 'noir') {
    decor = `<div style="position:absolute;inset:0;background:#050505"></div>
             <div style="position:absolute;left:0;right:0;top:60%;height:10px;background:linear-gradient(90deg,${C.a1},${C.a2})"></div>`;
  } else if (fam === 'aqua') {
    decor = `${_decor(C, fam, true)}
             <!-- painel direito com véu de vidro-água -->
             <div style="position:absolute;right:0;top:0;width:38%;bottom:0;background:${C.bg2};opacity:.55"></div>
             <div style="position:absolute;right:38%;top:0;width:4px;bottom:0;background:linear-gradient(180deg,${C.a1},${C.tl},${C.a2})"></div>`;
  } else if (fam === 'mesh') {
    decor = `${_decor(C, fam, true)}
             <!-- card de leitura semi-transparente -->
             <div style="position:absolute;left:0;top:0;width:60%;bottom:0;background:${C.bg2};opacity:.36"></div>
             <div style="position:absolute;left:0;top:0;width:4px;bottom:0;background:linear-gradient(180deg,${C.a1},${C.a2})"></div>`;
  } else if (fam === 'void') {
    decor = _decor(C, fam, true);
  } else {
    decor = _decor(C, fam, true);
  }

  const tc = (fam === 'header') ? 'rgba(0,0,0,.9)'
           : (fam === 'void')   ? '#ffffff'
           : C.txt;
  const mc = (fam === 'header') ? 'rgba(0,0,0,.5)'
           : (fam === 'void')   ? C.a1
           : C.mu;

  const titlePx = (id.presTitle || '').length > 35 ? 54 : 68;

  // Linha de acento sob título — varia por família
  let accentRule;
  if (fam === 'aqua') {
    accentRule = `<div style="display:flex;gap:0;margin-bottom:22px">
      <div style="width:56px;height:4px;background:${C.a1};border-radius:2px 0 0 2px"></div>
      <div style="width:32px;height:4px;background:${C.tl}"></div>
      <div style="width:18px;height:4px;background:${C.a2};border-radius:0 2px 2px 0"></div>
    </div>`;
  } else if (fam === 'mesh') {
    accentRule = `<div style="display:flex;align-items:center;gap:10px;margin-bottom:22px">
      <div style="width:12px;height:12px;border-radius:50%;background:${C.a1}"></div>
      <div style="flex:1;max-width:120px;height:3px;background:linear-gradient(90deg,${C.a2},transparent);border-radius:2px"></div>
    </div>`;
  } else if (fam === 'void') {
    accentRule = `<div style="width:200px;height:1.5px;background:${C.a1};margin-bottom:22px"></div>`;
  } else {
    accentRule = `<div style="width:64px;height:4px;background:linear-gradient(90deg,${C.a1},${C.a2});border-radius:2px;margin-bottom:22px"></div>`;
  }

  const body = `
    <div style="margin-top:auto;margin-bottom:auto">
      <div style="font-size:12px;letter-spacing:4px;text-transform:uppercase;color:${mc};margin-bottom:22px">${safe(id.instName,'Organização')}</div>
      <div style="font-size:${titlePx}px;font-weight:${fam==='void'?300:800};line-height:1.05;letter-spacing:${fam==='void'?'-1px':'-2px'};color:${tc};margin-bottom:22px;max-width:780px">${safe(id.presTitle,'Título da Apresentação')}</div>
      ${accentRule}
      <div style="font-size:20px;color:${mc};max-width:620px;line-height:1.5">${safe(id.presSubtitle || id.presDate,'')}</div>
    </div>
    <div style="margin-top:auto;display:flex;align-items:center;gap:14px">
      <div style="width:34px;height:34px;border-radius:8px;background:${C.a1};display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;color:${C.bg}">W</div>
      <span style="font-size:14px;color:${mc}">${safe(id.presDate,'')}</span>
    </div>`;

  return `<div style="width:${PDF_W}px;height:${PDF_H}px;position:relative;overflow:hidden;font-family:${PDF_FONT}">
    ${decor}
    <div style="position:absolute;inset:0;padding:70px 80px;display:flex;flex-direction:column;z-index:10">${body}</div>
  </div>`;
}

function _sSumario(C, fam) {
  const projects = G.projects;
  const rows = projects.map((p, i) => {
    const n = String(i + 1).padStart(2, '0');
    return `<div style="display:flex;align-items:center;gap:20px;padding:13px 0;border-bottom:1px solid ${C.a1}18">
      <span style="font-size:26px;font-weight:800;color:${C.a1};min-width:46px;font-family:monospace">${n}</span>
      <div>
        <div style="font-size:19px;font-weight:600;color:${C.txt};margin-bottom:2px">${safe(p.name,`Projeto ${n}`)}</div>
        <div style="font-size:13px;color:${C.mu}">${safe((p.objetivo||'').slice(0,90),'')}</div>
      </div>
    </div>`;
  }).join('');
  const label = G.mode === 'portfolio' ? 'Portfólio' : 'Programa';
  const body  = `${_eye('Sumário',C,fam)}${_h2(`Projetos do ${label}`,C)}${_rule(C)}<div style="flex:1;overflow:hidden">${rows}</div>`;
  return _shell(_decor(C,fam), body, C, fam);
}

function _sDivisor(C, fam, proj, idx) {
  const n    = idx >= 0 ? String(idx + 1).padStart(2, '0') : '—';
  const full = `<div style="position:absolute;inset:0;background:linear-gradient(135deg,${C.a1},${C.a2})"></div>
                <div style="position:absolute;inset:0;background:${C.bg}bb"></div>`;

  // Void: divisor com preto absoluto + 1 acento + peso leve
  if (fam === 'void') {
    const body = `
      <div style="margin-top:auto;margin-bottom:auto">
        <div style="font-size:12px;letter-spacing:5px;text-transform:uppercase;color:${C.a1};margin-bottom:16px">${G.mode==='single'?'PROJETO':`PROJETO ${n}`}</div>
        <div style="font-size:64px;font-weight:300;line-height:1.05;letter-spacing:-1px;color:#fff;margin-bottom:18px">${safe(proj.name,`Projeto ${n}`)}</div>
        <div style="width:180px;height:1.5px;background:${C.a1};margin-bottom:18px"></div>
        <div style="font-size:18px;color:${C.a1};opacity:.75;max-width:700px;line-height:1.5">${safe((proj.objetivo||'').slice(0,130),'')}</div>
      </div>`;
    return _shell(_decor(C, fam, false), body, C, fam, '70px');
  }

  const body = `
    <div style="margin-top:auto;margin-bottom:auto">
      <div style="font-size:110px;font-weight:900;color:${C.a1};opacity:.12;line-height:1;margin-bottom:-34px;font-family:monospace">${n}</div>
      <div style="font-size:60px;font-weight:800;color:${C.txt};letter-spacing:-2px;line-height:1.1;margin-bottom:18px">${safe(proj.name,`Projeto ${n}`)}</div>
      <div style="width:56px;height:3px;background:${C.a2};border-radius:2px;margin-bottom:18px"></div>
      <div style="font-size:20px;color:${C.mu};max-width:700px;line-height:1.5">${safe((proj.objetivo||'').slice(0,130),'')}</div>
    </div>`;
  return _shell(full, body, C, 'divisor', '70px');
}

function _sObjetivo(C, fam, proj) {
  const body = `
    ${_eye('Objetivo',C,fam)}
    ${_h2(safe(proj.name,'Projeto'),C)}${_rule(C)}
    <div style="flex:1;${_cardStyle(C)}overflow:hidden">
      <p style="font-size:21px;color:${C.txt};line-height:1.7;opacity:.85">${safe(proj.objetivo,'Objetivo não definido.')}</p>
    </div>`;
  return _shell(_decor(C,fam), body, C, fam);
}

function _cardStyle(C) {
  return `background:${C.bg2};border:1px solid ${C.a1}1a;border-radius:12px;padding:28px 36px;`;
}

function _sEquipe(C, fam, proj) {
  const team = (proj.team||[]).slice(0,6);
  const n    = Math.max(1, Math.min(team.length, 3));
  const cards = team.map(m =>
    `<div style="background:${C.bg2};border:1px solid ${C.a1}1a;border-radius:10px;padding:20px;text-align:center">
      <div style="width:46px;height:46px;border-radius:50%;background:linear-gradient(135deg,${C.a1},${C.a2});margin:0 auto 10px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:${C.bg}">${(m.nome||'?')[0].toUpperCase()}</div>
      <div style="font-size:15px;font-weight:600;color:${C.txt};margin-bottom:4px">${safe(m.nome,'—')}</div>
      <div style="font-size:12px;color:${C.a1};margin-bottom:6px">${safe(m.cargo,'')}</div>
      <div style="font-size:12px;color:${C.mu};line-height:1.4">${safe(m.resp,'')}</div>
    </div>`).join('') || `<p style="color:${C.mu}">Equipe não cadastrada.</p>`;
  const body = `${_eye('Equipe',C,fam)}${_h2(safe(proj.name,'Projeto'),C)}${_rule(C)}
    <div style="display:grid;grid-template-columns:repeat(${n},1fr);gap:14px;flex:1">${cards}</div>`;
  return _shell(_decor(C,fam), body, C, fam);
}

function _sEtapas(C, fam, proj) {
  const etapas = (proj.etapas||[]).slice(0,9);
  const sc = { 'concluida':'ok','em andamento':'warn','planejada':'neutral','atrasada':'err' };
  const rows = etapas.map((e,i) =>
    `<div style="display:flex;align-items:center;gap:14px;padding:9px 0;border-bottom:1px solid ${C.a1}14">
      <span style="font-size:11px;color:${C.a1};min-width:22px;font-family:monospace;font-weight:700">${String(i+1).padStart(2,'0')}</span>
      <span style="flex:1;font-size:15px;color:${C.txt}">${safe(e.nome,'—')}</span>
      <span style="font-size:12px;color:${C.mu};min-width:110px">${safe(e.inicio,'')}${e.fim?' → '+e.fim:''}</span>
      ${_badge(safe(e.status,'planejada'), sc[(e.status||'').toLowerCase()]||'neutral')}
    </div>`).join('') || `<p style="color:${C.mu}">Etapas não cadastradas.</p>`;
  const body = `${_eye('Etapas',C,fam)}${_h2(safe(proj.name,'Projeto'),C)}${_rule(C)}<div style="flex:1;overflow:hidden">${rows}</div>`;
  return _shell(_decor(C,fam), body, C, fam);
}

function _sMarcos(C, fam, proj) {
  const marcos = (proj.marcos||[]).slice(0,9);
  const sc = { 'concluido':'ok','em andamento':'warn','planejado':'neutral','atrasado':'err' };
  const rows = marcos.map(m =>
    `<div style="display:flex;align-items:center;gap:18px;padding:10px 0;border-bottom:1px solid ${C.a1}14">
      <div style="width:9px;height:9px;border-radius:50%;background:${C.a1};flex-shrink:0"></div>
      <span style="flex:1;font-size:16px;color:${C.txt}">${safe(m.nome,'—')}</span>
      <span style="font-size:12px;color:${C.mu};min-width:100px;text-align:right">${safe(m.data,'')}</span>
      ${_badge(safe(m.status,'planejado'), sc[(m.status||'').toLowerCase()]||'neutral')}
    </div>`).join('') || `<p style="color:${C.mu}">Marcos não cadastrados.</p>`;
  const body = `${_eye('Marcos / Timeline',C,fam)}${_h2(safe(proj.name,'Projeto'),C)}${_rule(C)}<div style="flex:1;overflow:hidden">${rows}</div>`;
  return _shell(_decor(C,fam), body, C, fam);
}

function _sIndicadores(C, fam, proj) {
  const kpis = (proj.indicadores||[]).slice(0,6);
  const n = Math.max(1, Math.min(kpis.length,3));
  const cards = kpis.map(k => {
    const pct = (k.meta && k.real) ? Math.min(100, Math.round(Number(k.real)/Number(k.meta)*100)) : null;
    return `<div style="background:${C.bg2};border:1px solid ${C.a1}1a;border-radius:10px;padding:22px 26px">
      <div style="font-size:11px;color:${C.mu};font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px">${safe(k.nome,'KPI')}</div>
      <div style="display:flex;align-items:baseline;gap:6px;margin-bottom:10px">
        <span style="font-size:46px;font-weight:900;color:${C.a1};line-height:1">${safe(k.real,'—')}</span>
        <span style="font-size:15px;color:${C.mu}">${safe(k.unidade,'')}</span>
      </div>
      <div style="font-size:13px;color:${C.mu};margin-bottom:10px">Meta: <b style="color:${C.txt}">${safe(k.meta,'—')} ${safe(k.unidade,'')}</b></div>
      ${pct!==null?`<div style="height:4px;background:${C.bg};border-radius:2px"><div style="height:4px;width:${pct}%;background:linear-gradient(90deg,${C.a1},${C.a2});border-radius:2px"></div></div>`:''}
    </div>`;
  }).join('') || `<p style="color:${C.mu}">Indicadores não cadastrados.</p>`;
  const body = `${_eye('Indicadores KPI',C,fam)}${_h2(safe(proj.name,'Projeto'),C)}${_rule(C)}
    <div style="display:grid;grid-template-columns:repeat(${n},1fr);gap:14px;flex:1">${cards}</div>`;
  return _shell(_decor(C,fam), body, C, fam);
}

function _sResultados(C, fam, proj) {
  const res = (proj.resultados||[]).slice(0,4);
  const n   = Math.max(1, Math.min(res.length,4));
  const cards = res.map(r => {
    const vc = r.variacao > 0 ? '#4ade80' : r.variacao < 0 ? '#f87171' : C.mu;
    const vs = r.variacao > 0 ? '▲' : r.variacao < 0 ? '▼' : '';
    return `<div style="background:${C.bg2};border:1px solid ${C.a1}1a;border-radius:10px;padding:26px;display:flex;flex-direction:column;gap:8px">
      <div style="font-size:11px;color:${C.mu};font-weight:700;letter-spacing:1.5px;text-transform:uppercase">${safe(r.titulo,'Resultado')}</div>
      <div style="font-size:52px;font-weight:900;color:${C.a1};line-height:1">${safe(r.valor,'—')}</div>
      <div style="font-size:15px;color:${C.mu}">${safe(r.unidade,'')}</div>
      ${r.variacao!=null?`<div style="font-size:15px;color:${vc};font-weight:700">${vs} ${Math.abs(r.variacao)}%</div>`:''}
    </div>`;
  }).join('') || `<p style="color:${C.mu}">Resultados não cadastrados.</p>`;
  const body = `${_eye('Resultados',C,fam)}${_h2(safe(proj.name,'Projeto'),C)}${_rule(C)}
    <div style="display:grid;grid-template-columns:repeat(${n},1fr);gap:14px;flex:1">${cards}</div>`;
  return _shell(_decor(C,fam), body, C, fam);
}

function _sAnteDepois(C, fam, proj) {
  const ad = proj.antesdepois || {};
  const body = `${_eye('Antes & Depois',C,fam)}${_h2(safe(proj.name,'Projeto'),C)}${_rule(C)}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;flex:1">
      <div style="background:${C.bg2};border:1px solid ${C.a1}18;border-radius:10px;padding:28px">
        <div style="font-size:11px;color:${C.mu};font-weight:700;letter-spacing:2.5px;margin-bottom:16px">ANTES</div>
        <p style="font-size:17px;color:${C.txt};line-height:1.65;opacity:.82">${safe(ad.antes_txt,'Situação anterior não descrita.')}</p>
      </div>
      <div style="background:${C.bg2};border:1px solid ${C.a2}44;border-top:3px solid ${C.a2};border-radius:10px;padding:28px">
        <div style="font-size:11px;color:${C.a2};font-weight:700;letter-spacing:2.5px;margin-bottom:16px">DEPOIS</div>
        <p style="font-size:17px;color:${C.txt};line-height:1.65;opacity:.82">${safe(ad.depois_txt,'Situação posterior não descrita.')}</p>
      </div>
    </div>`;
  return _shell(_decor(C,fam), body, C, fam);
}

function _sRiscos(C, fam, proj) {
  const riscos = (proj.riscos||[]).slice(0,7);
  const pc = v => (v>=4?'err':v>=2?'warn':'neutral');
  const rows = riscos.map(r =>
    `<div style="display:flex;align-items:flex-start;gap:14px;padding:11px 0;border-bottom:1px solid ${C.a1}14">
      <div style="flex:1">
        <div style="font-size:15px;color:${C.txt};margin-bottom:3px">${safe(r.descricao,'—')}</div>
        <div style="font-size:12px;color:${C.mu}">${safe(r.mitigacao,'')}</div>
      </div>
      <div style="display:flex;gap:7px;flex-shrink:0">
        ${_badge('P:'+safe(r.probabilidade,'?'), pc(r.probabilidade))}
        ${_badge('I:'+safe(r.impacto,'?'), pc(r.impacto))}
      </div>
    </div>`).join('') || `<p style="color:${C.mu}">Riscos não cadastrados.</p>`;
  const body = `${_eye('Riscos',C,fam)}${_h2(safe(proj.name,'Projeto'),C)}${_rule(C)}<div style="flex:1;overflow:hidden">${rows}</div>`;
  return _shell(_decor(C,fam), body, C, fam);
}

function _sLicoes(C, fam, proj) {
  const licoes = (proj.licoes||[]).slice(0,5);
  const items = licoes.map((l,i) =>
    `<div style="display:flex;gap:16px;padding:13px 0;border-bottom:1px solid ${C.a1}14">
      <span style="font-size:24px;font-weight:900;color:${C.a1};opacity:.35;min-width:34px;font-family:monospace">${i+1}</span>
      <div>
        <div style="font-size:16px;font-weight:600;color:${C.txt};margin-bottom:4px">${safe(l.titulo,'—')}</div>
        <div style="font-size:13px;color:${C.mu};line-height:1.5">${safe(l.descricao,'')}</div>
      </div>
    </div>`).join('') || `<p style="color:${C.mu}">Lições não cadastradas.</p>`;
  const body = `${_eye('Lições Aprendidas',C,fam)}${_h2(safe(proj.name,'Projeto'),C)}${_rule(C)}<div style="flex:1;overflow:hidden">${items}</div>`;
  return _shell(_decor(C,fam), body, C, fam);
}

function _sDesafios(C, fam, proj) {
  const desafios = (proj.desafios||[]).slice(0,5);
  const items = desafios.map(d =>
    `<div style="background:${C.bg2};border-left:3px solid ${C.a1};border-radius:0 8px 8px 0;padding:14px 20px;margin-bottom:11px">
      <div style="font-size:16px;font-weight:600;color:${C.txt};margin-bottom:4px">${safe(d.titulo,'—')}</div>
      <div style="font-size:13px;color:${C.mu};line-height:1.5">${safe(d.descricao,'')}</div>
    </div>`).join('') || `<p style="color:${C.mu}">Desafios não cadastrados.</p>`;
  const body = `${_eye('Desafios Futuros',C,fam)}${_h2(safe(proj.name,'Projeto'),C)}${_rule(C)}<div style="flex:1;overflow:hidden">${items}</div>`;
  return _shell(_decor(C,fam), body, C, fam);
}

function _sEncerramento(C, fam) {
  const id  = G.id;
  const full = `<div style="position:absolute;inset:0;background:linear-gradient(135deg,${C.a1},${C.a2})"></div>
                <div style="position:absolute;inset:0;background:${C.bg}cc"></div>`;
  const body = `
    <div style="margin:auto;text-align:center">
      <div style="width:64px;height:64px;border-radius:14px;background:${C.a1};margin:0 auto 28px;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:900;color:${C.bg}">W</div>
      <div style="font-size:72px;font-weight:800;color:${C.txt};letter-spacing:-2px;margin-bottom:20px">Obrigado</div>
      <div style="width:56px;height:3px;background:linear-gradient(90deg,${C.a1},${C.a2});border-radius:2px;margin:0 auto 22px"></div>
      <div style="font-size:20px;color:${C.mu}">${safe(id.instName,'')}</div>
      <div style="font-size:15px;color:${C.mu};margin-top:8px">${safe(id.presDate,'')}</div>
    </div>`;
  return `<div style="width:${PDF_W}px;height:${PDF_H}px;position:relative;overflow:hidden;font-family:${PDF_FONT}">
    ${full}
    <div style="position:absolute;inset:0;display:flex;z-index:10">${body}</div>
  </div>`;
}

// ═══════════════════════════════════════════════════════════
// DISPATCH
// ═══════════════════════════════════════════════════════════

function _renderSlide(s, C, fam) {
  switch(s.type) {
    case 'capa':         return _sCapa(C, fam);
    case 'sumario':      return _sSumario(C, fam);
    case 'divisor':      return _sDivisor(C, fam, s.proj, s.idx);
    case 'objetivo':     return _sObjetivo(C, fam, s.proj);
    case 'equipe':       return _sEquipe(C, fam, s.proj);
    case 'etapas':       return _sEtapas(C, fam, s.proj);
    case 'marcos':       return _sMarcos(C, fam, s.proj);
    case 'indicadores':  return _sIndicadores(C, fam, s.proj);
    case 'resultados':   return _sResultados(C, fam, s.proj);
    case 'antesdepois':  return _sAnteDepois(C, fam, s.proj);
    case 'riscos':       return _sRiscos(C, fam, s.proj);
    case 'licoes':       return _sLicoes(C, fam, s.proj);
    case 'desafios':     return _sDesafios(C, fam, s.proj);
    case 'encerramento': return _sEncerramento(C, fam);
    case 'panorama':     return _sDivisor(C, fam, { name:'Panorama BI', objetivo:'Visão consolidada dos indicadores estratégicos.' }, -1);
    default:
      return `<div style="width:${PDF_W}px;height:${PDF_H}px;background:${C.bg};display:flex;align-items:center;justify-content:center;color:${C.mu};font-size:20px">${s.type}</div>`;
  }
}

// ═══════════════════════════════════════════════════════════
// BUILD SLIDE LIST (espelha a lógica do PPTX)
// ═══════════════════════════════════════════════════════════

function _buildSlideList() {
  const B = G.blocks;
  const list = [];
  list.push({ type:'capa' });
  if (G.mode !== 'single')   list.push({ type:'sumario' });
  if (B.panorama?.enabled)   list.push({ type:'panorama' });
  G.projects.forEach((proj, idx) => {
    list.push({ type:'divisor', proj, idx });
    if (B.objetivo?.enabled)    list.push({ type:'objetivo',    proj });
    if (B.team?.enabled)        list.push({ type:'equipe',      proj });
    if (B.etapas?.enabled)      list.push({ type:'etapas',      proj });
    if (B.marcos?.enabled)      list.push({ type:'marcos',      proj });
    if (B.indicadores?.enabled) list.push({ type:'indicadores', proj });
    if (B.resultados?.enabled)  list.push({ type:'resultados',  proj });
    if (B.antesdepois?.enabled) list.push({ type:'antesdepois', proj });
    // evidencias: skip (object URLs não renderizam no canvas)
    if (B.riscos?.enabled)      list.push({ type:'riscos',      proj });
    if (B.licoes?.enabled)      list.push({ type:'licoes',      proj });
    if (B.desafios?.enabled)    list.push({ type:'desafios',    proj });
  });
  if (B.encerramento?.enabled) list.push({ type:'encerramento' });
  return list;
}

// ═══════════════════════════════════════════════════════════
// CAPTURA COM html2canvas
// ═══════════════════════════════════════════════════════════

async function _captureSlide(html) {
  const zone = document.getElementById('pdfRenderZone');
  zone.innerHTML = html;
  await new Promise(r => setTimeout(r, 90)); // deixa o browser pintar
  const el = zone.firstElementChild;
  const canvas = await html2canvas(el, {
    width:           PDF_W,
    height:          PDF_H,
    scale:           1.5,          // 1920×1080 efetivo
    useCORS:         true,
    allowTaint:      true,
    backgroundColor: null,
    logging:         false,
    onclone: d => {
      // garante que fontes do sistema são usadas
      d.body.style.fontFamily = PDF_FONT;
    }
  });
  return canvas.toDataURL('image/jpeg', 0.92);
}

// ═══════════════════════════════════════════════════════════
// EXPORTAR PDF — função pública chamada pelo botão
// ═══════════════════════════════════════════════════════════

async function exportPDF() {
  const btn = document.getElementById('btnExportPdf');
  const origTxt = btn ? btn.innerHTML : '';
  const setBtn = (txt, dis) => { if(btn){ btn.innerHTML=txt; btn.disabled=dis; }};

  try {
    setBtn('<span style="opacity:.7">Carregando…</span>', true);
    toast('Carregando bibliotecas PDF…', 'info');
    await loadPdfLibs();

    const C = _pdfC();
    if (!C) { toast('Tema inválido.', 'err'); return; }

    const fam    = _family(G.modelo);
    const slides = _buildSlideList();
    const total  = slides.length;

    const { jsPDF } = window.jspdf;
    // Landscape, unidade pixels, tamanho = slide
    const pdf = new jsPDF({ orientation:'landscape', unit:'px', format:[PDF_W, PDF_H], hotfixes:['px_scaling'] });

    setProgress(true, 0, `Preparando ${total} slides…`);

    for (let i = 0; i < slides.length; i++) {
      const pct = Math.round((i / total) * 100);
      setProgress(true, pct, `Slide ${i+1} de ${total} — ${slides[i].type}`);
      setBtn(`<span style="opacity:.7">${i+1} / ${total}</span>`, true);

      const html     = _renderSlide(slides[i], C, fam);
      const imgData  = await _captureSlide(html);

      if (i > 0) pdf.addPage([PDF_W, PDF_H], 'landscape');
      pdf.addImage(imgData, 'JPEG', 0, 0, PDF_W, PDF_H, undefined, 'FAST');

      await new Promise(r => setTimeout(r, 16)); // respira entre slides
    }

    setProgress(true, 100, 'Salvando…');

    const filename = (G.id.presTitle||'apresentacao')
      .replace(/[^\w\s-]/g,'').replace(/\s+/g,'_').toLowerCase()
      .slice(0, 60) + '.pdf';
    pdf.save(filename);

    document.getElementById('pdfRenderZone').innerHTML = '';
    setProgress(false, 0, '');
    toast(`PDF gerado com sucesso — ${total} slides`, 'ok');

  } catch (err) {
    console.error('[PDF export]', err);
    toast('Erro ao gerar PDF: ' + err.message, 'err');
    setProgress(false, 0, '');
  } finally {
    setBtn(origTxt, false);
  }
}
