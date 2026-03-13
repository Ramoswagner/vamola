// js/models/cybergrid.js
// Modelo CyberGrid 2026 — grade densa, orbes duplos com halos, HUD corners + scan line.
// Sobrescreve: gerarCapa, gerarDivisor, _adicionarTag, _adicionarRodape

class ModeloCyberGrid extends ModeloBase {
    constructor() { super('CyberGrid'); }

    // Grade de linhas finas
    _grade(s, pres, C, x0, y0, w, h, cols, rows) {
        const cw = w / cols, rh = h / rows;
        for (let c = 0; c <= cols; c++) {
            s.addShape(pres.shapes.RECTANGLE, { x: x0+c*cw, y: y0, w: 0.01, h: h,
                fill: { color: C.a1 }, line: { width: 0 }, transparency: 88 });
        }
        for (let r = 0; r <= rows; r++) {
            s.addShape(pres.shapes.RECTANGLE, { x: x0, y: y0+r*rh, w: w, h: 0.01,
                fill: { color: C.a1 }, line: { width: 0 }, transparency: 88 });
        }
    }

    // Orbe com halos concêntricos
    _orbe(s, pres, cx, cy, r, color, layers = 4, baseT = 80) {
        for (let i = 0; i < layers; i++) {
            const ri = r * (1 - i / layers);
            const t = baseT + i * Math.round((99 - baseT) / layers);
            s.addShape(pres.shapes.ELLIPSE, { x: cx-ri/2, y: cy-ri/2*0.65, w: ri, h: ri*0.65,
                fill: { color }, line: { width: 0 }, transparency: t });
        }
    }

    // HUD corner (4 cantos)
    _hud(s, pres, C, x, y, flip) {
        const sx = flip ? -1 : 1, sy = flip ? -1 : 1;
        const ax = flip ? x - 0.45 : x, ay = flip ? y - 0.45 : y;
        s.addShape(pres.shapes.RECTANGLE, { x: ax, y: ay, w: 0.45, h: 0.04,
            fill: { color: C.a1 }, line: { width: 0 }, transparency: 30 });
        s.addShape(pres.shapes.RECTANGLE, { x: flip ? x-0.04 : x, y: ay, w: 0.04, h: 0.45,
            fill: { color: C.a1 }, line: { width: 0 }, transparency: 30 });
    }

    gerarCapa(pres, G, C) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });

        // Grade densa
        this._grade(s, pres, C, 0, 0, W, H, 22, 12);

        // Scan line horizontal
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H*0.5, w: W, h: 0.015,
            fill: { color: C.a1 }, line: { width: 0 }, transparency: 60 });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H*0.5-0.025, w: W, h: 0.025,
            fill: { color: C.a1 }, line: { width: 0 }, transparency: 80 });

        // Orbes
        this._orbe(s, pres, W*0.78, H*0.22, 6.0, C.a1, 5, 78);
        this._orbe(s, pres, W*0.12, H*0.75, 4.5, C.a2, 5, 82);

        // Véu escuro sobre grade
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg }, line: { width: 0 }, transparency: 55 });

        // HUD corners
        this._hud(s, pres, C, 0.25, 0.25, false);
        this._hud(s, pres, C, W-0.25, 0.25, true);
        this._hud(s, pres, C, 0.25, H-0.25, false);
        this._hud(s, pres, C, W-0.25, H-0.25, true);

        // Linha de acento vertical esquerda
        s.addShape(pres.shapes.RECTANGLE, { x: 0.55, y: 0, w: 0.04, h: H, fill: { color: C.a1 }, line: { width: 0 }, transparency: 45 });

        // Eyebrow mono
        if (G.id.instDept) s.addText(G.id.instDept.toUpperCase(), { x: 0.85, y: 1.4, w: 9, h: 0.28,
            fontSize: 7, color: C.a2, fontFace:'Courier New', bold: true, charSpacing: 4 });

        // Título
        s.addText(G.id.presTitle || 'Apresentação', { x: 0.85, y: 1.68, w: W-1.4, h: 3.2,
            fontSize: 48, color: C.txt, fontFace:'Calibri', bold: true, lineSpacingMultiple: 0.88 });

        // Linha de acento colorida sob título
        s.addShape(pres.shapes.RECTANGLE, { x: 0.85, y: 4.98, w: 2.0, h: 0.04, fill: { color: C.a1 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 2.88, y: 4.98, w: 0.8, h: 0.04, fill: { color: C.a2 }, line: { width: 0 } });

        if (G.id.presSub) s.addText(G.id.presSub, { x: 0.85, y: 5.12, w: W*0.6, h: 0.5, fontSize: 12, color: C.muted, fontFace:'Calibri Light' });
        if (G.id.instName) s.addText(G.id.instName, { x: 0.85, y: H-0.85, w: 5, h: 0.26, fontSize: 9, color: C.muted, fontFace:'Courier New' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: 0.85, y: H-0.58, w: 5, h: 0.22, fontSize: 8, color: C.a1, fontFace:'Courier New' });

        if (G.mode !== 'single') {
            G.projects.forEach((p, i) => {
                const y = 1.6 + i*0.38;
                s.addText(`> ${p.name||'Projeto'}`, { x: W-4.0, y, w: 3.7, h: 0.28, fontSize: 10, color: C.muted, fontFace:'Courier New' });
            });
        }

        if (G.id.logoInst) s.addImage({ data: G.id.logoInst, x: W-3.0, y: 0.3, w: 1.4, h: 0.7, sizing: { type:'contain', w: 1.4, h: 0.7 } });
        if (G.id.logoProg) s.addImage({ data: G.id.logoProg, x: W-1.5, y: 0.3, w: 1.4, h: 0.7, sizing: { type:'contain', w: 1.4, h: 0.7 } });
        return 1;
    }

    gerarDivisor(pres, projeto, G, C, index) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        this._grade(s, pres, C, 0, 0, W, H, 22, 12);
        this._orbe(s, pres, W*0.75, H*0.5, 7.0, projeto.color||C.a1, 5, 80);
        this._orbe(s, pres, W*0.2,  H*0.3, 4.0, C.a2, 5, 85);
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg }, line: { width: 0 }, transparency: 52 });

        this._hud(s, pres, C, 0.25, 0.25, false);
        this._hud(s, pres, C, W-0.25, H-0.25, true);

        s.addShape(pres.shapes.RECTANGLE, { x: 0.55, y: 0, w: 0.04, h: H, fill: { color: projeto.color||C.a1 }, line: { width: 0 }, transparency: 35 });

        // Scan line posicionada na entrada do texto
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 2.0, w: W, h: 0.02, fill: { color: C.a2 }, line: { width: 0 }, transparency: 65 });

        s.addText(String(index+1).padStart(2,'0'), { x: W*0.45, y: -0.5, w: W*0.55, h: H+0.5,
            fontSize: 220, color: projeto.color||C.a1, fontFace:'Courier New', bold: true, transparency: 91, align:'right' });

        const eyebrow = G.mode === 'single' ? '> PROJETO' : `> PROJETO ${String(index+1).padStart(2,'0')}`;
        s.addText(eyebrow, { x: 0.88, y: 1.8, w: 9, h: 0.3, fontSize: 9, color: C.a2, fontFace:'Courier New', bold: true, charSpacing: 3 });
        s.addText(projeto.name || 'Projeto', { x: 0.88, y: 2.1, w: W*0.8, h: 2.6,
            fontSize: 50, color: C.txt, fontFace:'Calibri', bold: true, lineSpacingMultiple: 0.88 });
        s.addShape(pres.shapes.RECTANGLE, { x: 0.88, y: 4.85, w: 3.5, h: 0.04, fill: { color: projeto.color||C.a1 }, line: { width: 0 } });

        if (projeto.leader) s.addText(projeto.leader, { x: 0.88, y: 5.02, w: 8, h: 0.3, fontSize: 12, color: C.muted, fontFace:'Calibri Light' });
        const dt = [];
        if (projeto.periodo_inicio) dt.push(ModeloBase.parseDate(projeto.periodo_inicio).toLocaleDateString('pt-BR',{month:'short',year:'numeric'}));
        if (projeto.periodo_fim)    dt.push(ModeloBase.parseDate(projeto.periodo_fim).toLocaleDateString('pt-BR',{month:'short',year:'numeric'}));
        if (dt.length) s.addText(dt.join(' >> '), { x: 0.88, y: 5.4, w: 8, h: 0.28, fontSize: 9, color: C.a1, fontFace:'Courier New' });

        const bc = projeto.status === 'Concluído' ? (C.teal||C.a2) : C.gold;
        s.addShape(pres.shapes.RECTANGLE, { x: W-2.2, y: 0.4, w: 1.8, h: 0.38, fill: { color: bc }, line: { width: 0 }, transparency: 78 });
        s.addText(`[${projeto.status}]`, { x: W-2.2, y: 0.42, w: 1.8, h: 0.34, align:'center', fontSize: 8, color: bc, fontFace:'Courier New', bold: true });
        return 1;
    }

    _adicionarTag(s, pres, texto, x, y, C) {
        const w = texto.length * 0.082 + 0.4;
        s.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.24, fill: { color: C.bg2 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.04, fill: { color: C.a1 }, line: { width: 0 } });
        s.addText(`> ${texto}`, { x: x+0.08, y: y+0.04, w: w-0.1, h: 0.17,
            fontSize: 6.5, color: C.a1, fontFace:'Courier New', bold: true, charSpacing: 1 });
    }

    _adicionarRodape(s, pres, G, C, projetoNome) {
        const { W, H } = ModeloBase;
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H-0.4, w: W, h: 0.4, fill: { color: C.bg2 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H-0.4, w: W, h: 0.03, fill: { color: C.a1 }, line: { width: 0 }, transparency: 40 });
        if (G.id.instName) s.addText(`// ${G.id.instName}`, { x: 0.3, y: H-0.32, w: 5, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Courier New' });
        if (projetoNome)   s.addText(projetoNome,   { x: W/2-2, y: H-0.32, w: 4, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Courier New', align:'center' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: W-3.3, y: H-0.32, w: 3, h: 0.22, fontSize: 7, color: C.a1, fontFace:'Courier New', align:'right' });
    }
}
