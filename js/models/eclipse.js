// js/models/eclipse.js
// Modelo Eclipse 2026 — 7 halos concêntricos, núcleo brilhante real, painel de vidro fosco.
// Sobrescreve: gerarCapa, gerarDivisor, _adicionarTag, _adicionarRodape

class ModeloEclipse extends ModeloBase {
    constructor() { super('Eclipse'); }

    // Sistema de halos concêntricos
    _eclipse(s, pres, cx, cy, r, colorRing, colorCore, n = 7) {
        // Halos externos (anel = círculo grande - círculo interno)
        for (let i = n; i >= 0; i--) {
            const ri = r * (0.3 + i * 0.1);
            const tr = 72 + i * Math.round(27 / n);
            s.addShape(pres.shapes.ELLIPSE, { x: cx-ri/2, y: cy-ri/2, w: ri, h: ri,
                fill: { color: colorRing }, line: { width: 0 }, transparency: tr });
        }
        // Núcleo central brilhante
        const rCore = r * 0.22;
        s.addShape(pres.shapes.ELLIPSE, { x: cx-rCore/2, y: cy-rCore/2, w: rCore, h: rCore,
            fill: { color: colorCore }, line: { width: 0 } });
        // Reflexo brilhante no núcleo
        const rRef = rCore * 0.45;
        s.addShape(pres.shapes.ELLIPSE, { x: cx-rCore*0.1, y: cy-rCore*0.35, w: rRef, h: rRef*0.6,
            fill: { color: 'FFFFFF' }, line: { width: 0 }, transparency: 60 });
    }

    // Painel vidro fosco (glass card)
    _glassPanel(s, pres, x, y, w, h, C) {
        s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: C.bg2 }, line: { width: 0 }, transparency: 22 });
        // Linha de luz no topo
        s.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.03, fill: { color: 'FFFFFF' }, line: { width: 0 }, transparency: 70 });
        // Reflexo esquerdo
        s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.05, h, fill: { color: 'FFFFFF' }, line: { width: 0 }, transparency: 80 });
    }

    gerarCapa(pres, G, C) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });

        // Eclipse principal — grande, direita
        this._eclipse(s, pres, W*0.75, H*0.48, 8.5, C.a1, C.a2);

        // Eclipse secundário — menor, bottom-left
        this._eclipse(s, pres, W*0.1, H*0.85, 3.5, C.a2, C.teal||C.a2, 4);

        // Painel de vidro fosco para o conteúdo
        this._glassPanel(s, pres, 0, 0, W*0.56, H, C);

        // Eyebrow
        if (G.id.instDept) s.addText(G.id.instDept.toUpperCase(), { x: 0.6, y: 1.35, w: 6, h: 0.28,
            fontSize: 7.5, color: C.muted, fontFace:'Calibri Light', charSpacing: 4 });

        // Título
        s.addText(G.id.presTitle || 'Apresentação', { x: 0.6, y: 1.62, w: W*0.5, h: 3.1,
            fontSize: 46, color: C.txt, fontFace:'Calibri', bold: true, lineSpacingMultiple: 0.88 });

        // Linha de acento
        s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 4.85, w: 1.8, h: 0.05, fill: { color: C.a1 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 2.44, y: 4.85, w: 0.6, h: 0.05, fill: { color: C.a2 }, line: { width: 0 } });

        if (G.id.presSub) s.addText(G.id.presSub, { x: 0.6, y: 5.0, w: W*0.5, h: 0.5, fontSize: 12, color: C.muted, fontFace:'Calibri Light' });
        if (G.id.instName) s.addText(G.id.instName, { x: 0.6, y: H-0.9, w: 5, h: 0.28, fontSize: 10, color: C.txt, fontFace:'Calibri' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: 0.6, y: H-0.62, w: 5, h: 0.22, fontSize: 8.5, color: C.muted, fontFace:'Calibri Light' });

        if (G.mode !== 'single') {
            G.projects.forEach((p, i) => {
                const y = 1.6 + i*0.42;
                s.addShape(pres.shapes.ELLIPSE, { x: W*0.59, y: y+0.05, w: 0.14, h: 0.14, fill: { color: p.color||C.a1 }, line: { width: 0 } });
                s.addText(p.name || 'Projeto', { x: W*0.60+0.08, y, w: 4.3, h: 0.28, fontSize: 11, color: C.txt, fontFace:'Calibri' });
            });
        }

        if (G.id.logoInst) s.addImage({ data: G.id.logoInst, x: 0.6, y: 0.4, w: 1.8, h: 0.85, sizing: { type:'contain', w: 1.8, h: 0.85 } });
        if (G.id.logoProg) s.addImage({ data: G.id.logoProg, x: 2.5, y: 0.4, w: 1.8, h: 0.85, sizing: { type:'contain', w: 1.8, h: 0.85 } });
        return 1;
    }

    gerarDivisor(pres, projeto, G, C, index) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });

        // Eclipse enorme centralizado-direita, cor do projeto
        this._eclipse(s, pres, W*0.65, H*0.5, 10.0, projeto.color||C.a1, C.a2, 7);

        // Eclipse menor esquerda
        this._eclipse(s, pres, W*0.05, H*0.2, 3.0, C.a2, C.teal||C.a2, 4);

        // Painel glass esquerdo
        this._glassPanel(s, pres, 0, 0, W*0.55, H, C);

        // Número ghost
        s.addText(String(index+1).padStart(2,'0'), { x: 0, y: H*0.3, w: W*0.54, h: H*0.6,
            fontSize: 200, color: projeto.color||C.a1, fontFace:'Calibri', bold: true, transparency: 94, align:'right' });

        const eyebrow = G.mode === 'single' ? 'PROJETO' : `PROJETO ${String(index+1).padStart(2,'0')}`;
        s.addText(eyebrow, { x: 0.65, y: 1.8, w: 8, h: 0.28, fontSize: 8, color: C.a2, fontFace:'Calibri', bold: true, charSpacing: 3.5 });
        s.addText(projeto.name || 'Projeto', { x: 0.65, y: 2.1, w: W*0.5, h: 2.6,
            fontSize: 50, color: C.txt, fontFace:'Calibri', bold: true, lineSpacingMultiple: 0.88 });
        s.addShape(pres.shapes.RECTANGLE, { x: 0.65, y: 4.85, w: 3.5, h: 0.05, fill: { color: projeto.color||C.a1 }, line: { width: 0 } });

        if (projeto.leader) s.addText(projeto.leader, { x: 0.65, y: 5.03, w: 7, h: 0.3, fontSize: 12, color: C.muted, fontFace:'Calibri Light' });
        const dt = [];
        if (projeto.periodo_inicio) dt.push(ModeloBase.parseDate(projeto.periodo_inicio).toLocaleDateString('pt-BR',{month:'short',year:'numeric'}));
        if (projeto.periodo_fim)    dt.push(ModeloBase.parseDate(projeto.periodo_fim).toLocaleDateString('pt-BR',{month:'short',year:'numeric'}));
        if (dt.length) s.addText(dt.join(' → '), { x: 0.65, y: 5.41, w: 7, h: 0.28, fontSize: 9, color: projeto.color||C.a2, fontFace:'Calibri', bold: true });

        const bc = projeto.status === 'Concluído' ? (C.teal||C.a2) : C.gold;
        s.addShape(pres.shapes.RECTANGLE, { x: W*0.54-2.1, y: 0.42, w: 1.8, h: 0.4, fill: { color: bc }, line: { width: 0 }, transparency: 78 });
        s.addText(projeto.status, { x: W*0.54-2.1, y: 0.44, w: 1.8, h: 0.36, align:'center', fontSize: 9, color: bc, fontFace:'Calibri', bold: true });
        return 1;
    }

    _adicionarTag(s, pres, texto, x, y, C) {
        const w = texto.length * 0.088 + 0.32;
        // Mini eclipse decorativo ao lado
        s.addShape(pres.shapes.ELLIPSE, { x: x-0.18, y: y+0.03, w: 0.16, h: 0.16, fill: { color: C.a1 }, line: { width: 0 }, transparency: 70 });
        s.addShape(pres.shapes.ELLIPSE, { x: x-0.14, y: y+0.07, w: 0.08, h: 0.08, fill: { color: C.a2 }, line: { width: 0 } });
        s.addText(texto, { x: x+0.02, y, w, h: 0.22, fontSize: 7, color: C.a2, fontFace:'Calibri', bold: true, charSpacing: 2 });
    }

    _adicionarRodape(s, pres, G, C, projetoNome) {
        const { W, H } = ModeloBase;
        this._glassPanel(s, pres, 0, H-0.38, W, 0.38, C);
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H-0.38, w: W, h: 0.03, fill: { color: C.a1 }, line: { width: 0 }, transparency: 45 });
        if (G.id.instName) s.addText(G.id.instName, { x: 0.3, y: H-0.3, w: 5, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light' });
        if (projetoNome)   s.addText(projetoNome,   { x: W/2-2, y: H-0.3, w: 4, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light', align:'center' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: W-3.3, y: H-0.3, w: 3, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light', align:'right' });
    }
}
