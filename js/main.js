// js/main.js
// Orquestração central — inicialização, seleção de modo/modelo e geração do PPTX.
// Depende de: store.js, themes.js, ui.js, models/index.js

// ════════════════════════════════════════════════════
// INICIALIZAÇÃO
// ════════════════════════════════════════════════════
function init() {
  addProject();
  renderBlockGrid();
  renderThemeGrid();
  renderModeloGrid();
  renderPreviewBlocks();
  refreshPreview();
  selectModelo('classico');
}

// ════════════════════════════════════════════════════
// SELEÇÃO DE MODO E MODELO (splash)
// ════════════════════════════════════════════════════
function selectMode(mode) {
  G.mode = mode;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById('modeBtn-' + mode)?.classList.add('selected');
}

function selectModelo(modelo) {
  G.modelo = modelo;
  renderModeloGrid();   // atualiza cards do step 03
  refreshPreview();     // atualiza thumb + pill na preview col
  const nome = MODELOS_META?.[modelo]?.name || modelo;
  toast(`Modelo "${nome}" selecionado`, 'info');
}

// ════════════════════════════════════════════════════
// GERADOR DE PPTX
// ════════════════════════════════════════════════════
async function generatePptx() {
  const T = THEMES[G.theme];
  if (!T) return toast('Tema não encontrado', 'err');
  const C = T.C;

  const modelo = modelos[G.modelo];
  if (!modelo) return toast('Modelo não encontrado', 'err');

  setProgress(true, 5, 'Iniciando...');

  const pres = new PptxGenJS();
  pres.layout = 'LAYOUT_WIDE';

  const total = countSlides();
  let done = 0;
  const tick = async (msg) => {
    done++;
    setProgress(true, Math.round(done / total * 90) + 5, msg);
    await new Promise(r => requestAnimationFrame(r));
  };

  // Capa
  await tick('Capa...');
  modelo.gerarCapa(pres, G, C);

  // Sumário (portfólio / programa)
  if (G.mode !== 'single') {
    await tick('Sumário...');
    modelo.gerarSumario(pres, G, C);
  }

  // Panorama BI
  if (G.blocks.panorama?.enabled) {
    await tick('Panorama BI...');
    modelo.gerarPanorama(pres, G, C);
  }

  // Slides por projeto
  for (let pi = 0; pi < G.projects.length; pi++) {
    const p = G.projects[pi];
    const B = G.blocks;

    await tick(`Divisor ${p.name || pi + 1}...`);
    modelo.gerarDivisor(pres, p, G, C, pi);

    if (B.objetivo?.enabled)    { await tick(`Objetivo ${p.name || pi+1}...`);    modelo.gerarObjetivo(pres, p, G, C); }
    if (B.team?.enabled)        { await tick(`Equipe ${p.name || pi+1}...`);       modelo.gerarEquipe(pres, p, G, C); }
    if (B.etapas?.enabled)      { await tick(`Etapas ${p.name || pi+1}...`);       modelo.gerarEtapas(pres, p, G, C); }
    if (B.marcos?.enabled)      { await tick(`Marcos ${p.name || pi+1}...`);       modelo.gerarMarcos(pres, p, G, C); }
    if (B.indicadores?.enabled) { await tick(`Indicadores ${p.name || pi+1}...`);  modelo.gerarIndicadores(pres, p, G, C); }
    if (B.resultados?.enabled)  { await tick(`Resultados ${p.name || pi+1}...`);   modelo.gerarResultados(pres, p, G, C); }
    if (B.antesdepois?.enabled) { await tick(`Antes/Depois ${p.name || pi+1}...`); modelo.gerarAntesDepois(pres, p, G, C); }
    if (B.evidencias?.enabled)  { await tick(`Evidências ${p.name || pi+1}...`);   modelo.gerarEvidencias(pres, p, G, C); }
    if (B.riscos?.enabled)      { await tick(`Riscos ${p.name || pi+1}...`);       modelo.gerarRiscos(pres, p, G, C); }
    if (B.licoes?.enabled)      { await tick(`Lições ${p.name || pi+1}...`);       modelo.gerarLicoes(pres, p, G, C); }
    if (B.desafios?.enabled)    { await tick(`Desafios ${p.name || pi+1}...`);     modelo.gerarDesafios(pres, p, G, C); }
  }

  // Encerramento
  if (G.blocks.encerramento?.enabled) {
    await tick('Encerramento...');
    modelo.gerarEncerramento(pres, G, C);
  }

  setProgress(true, 97, 'Exportando arquivo...');
  const fname = (G.id.presTitle || 'Wren-Apresentacao')
    .replace(/[^a-zA-Z0-9À-ÿ\s\-_]/g, '')
    .replace(/\s+/g, '-') + '.pptx';
  await pres.writeFile({ fileName: fname });
  setProgress(false, 100, 'Pronto!');
  toast('Apresentação exportada: ' + fname, 'ok');
}

// ════════════════════════════════════════════════════
// START
// ════════════════════════════════════════════════════
init();

// ════════════════════════════════════════════════════
// PARTICLE NETWORK — canvas background
// ════════════════════════════════════════════════════
(function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: -9999, y: -9999 };
  const N = 90, MAX_DIST = 140, MOUSE_DIST = 180;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  for (let i = 0; i < N; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - .5) * .4,
      vy: (Math.random() - .5) * .4,
      r:  Math.random() * 1.8 + .6,
      alpha: Math.random() * .5 + .2,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];

      // Repulsão do mouse
      const mdx = a.x - mouse.x, mdy = a.y - mouse.y;
      const md  = Math.sqrt(mdx * mdx + mdy * mdy);
      if (md < MOUSE_DIST) {
        const force = (MOUSE_DIST - md) / MOUSE_DIST * 0.6;
        a.vx += mdx / md * force * 0.08;
        a.vy += mdy / md * force * 0.08;
      }

      // Conexões entre partículas próximas
      for (let j = i + 1; j < particles.length; j++) {
        const b  = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(232,160,32,${(1 - d / MAX_DIST) * 0.35})`;
          ctx.lineWidth   = .6;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232,160,32,${p.alpha})`;
      ctx.fill();

      p.x += p.vx; p.y += p.vy;
      p.vx *= .99; p.vy *= .99;
      p.vx += (Math.random() - .5) * .02;
      p.vy += (Math.random() - .5) * .02;

      const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (spd > 1.2) { p.vx = p.vx / spd * 1.2; p.vy = p.vy / spd * 1.2; }

      if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;
    });

    requestAnimationFrame(draw);
  }
  draw();
})();
