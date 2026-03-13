// js/models/classico.js
// Modelo Clássico 2026 — split editorial dramático, barra de luz tripla, orbes de fundo.
// Sobrescreve: gerarCapa, gerarDivisor, _adicionarTag, _adicionarRodape

class ModeloClassico extends ModeloBase {
    constructor() { super('Clássico'); }

    _orbe(s, pres, cx, cy, r, color, tr = 90) {
        s.addShape(pres.shapes.ELLIPSE, { x: cx - r/2, y: cy - r/2*0.65, w: r, h: r*0.65,
            fill: { color }, line: { width: 0 }, transparency: tr });
    }

    _lightBar(s, pres, C, x = 0) {
        const { H } = ModeloBase;
        s.addShape(pres.shapes.RECTANGLE, { x, y: 0, w: 0.10, h: H, fill: { color: C.a1 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: x+0.10, y: 0, w: 0.04, h: H, fill: { color: C.a2 }, line: { width: 0 }, transparency: 55 });
        s.addShape(pres.shapes.RECTANGLE, { x: x+0.14, y: 0, w: 0.02, h: H, fill: { color: C.a3||C.a2 }, line: { width: 0 }, transparency: 80 });
    }

    gerarCapa(pres, G, C) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        s.addShape(pres.shapes.RECTANGLE, { x: W*0.52, y: 0, w: W*0.48, h: H, fill: { color: C.bg2 }, line: { width: 0 } });

        this._orbe(s, pres, 0, H*0.7, 5.5, C.a1, 90);
        this._orbe(s, pres, W*0.55, H*0.2, 4.5, C.a2, 92);

        // Shimmer sweep
        for (let i = 0; i < 5; i++) {
            s.addShape(pres.shapes.RECTANGLE, { x: W*0.3 + i*0.12, y: 0, w: 0.05, h: H,
                fill: { color: C.a2 }, line: { width: 0 }, transparency: 94 - i });
        }

        this._lightBar(s, pres, C);

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H-0.05, w: W*0.52, h: 0.05, fill: { color: C.a1 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H-0.05, w: W*0.22, h: 0.05, fill: { color: C.a2 }, line: { width: 0 } });

        if (G.id.instDept) s.addText(G.id.instDept.toUpperCase(), { x: 0.55, y: 1.4, w: 6, h: 0.28, fontSize: 7.5, color: C.muted, fontFace: 'Calibri Light', charSpacing: 3 });

        s.addText(G.id.presTitle || 'Apresentação', { x: 0.55, y: 1.7, w: W*0.5, h: 3.0,
            fontSize: 46, color: C.txt, fontFace: 'Calibri', bold: true, lineSpacingMultiple: 0.88 });

        s.addShape(pres.shapes.RECTANGLE, { x: 0.55, y: 4.85, w: 1.6, h: 0.04, fill: { color: C.a1 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 2.18, y: 4.85, w: 0.6, h: 0.04, fill: { color: C.a2 }, line: { width: 0 } });

        if (G.id.presSub) s.addText(G.id.presSub, { x: 0.55, y: 5.0, w: W*0.5, h: 0.5, fontSize: 12, color: C.muted, fontFace: 'Calibri Light' });
        if (G.id.instName) s.addText(G.id.instName, { x: 0.55, y: H-0.9, w: 5, h: 0.28, fontSize: 10, color: C.txt, fontFace: 'Calibri' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: 0.55, y: H-0.6, w: 5, h: 0.22, fontSize: 8.5, color: C.muted, fontFace: 'Calibri Light' });

        if (G.mode !== 'single') {
            G.projects.forEach((p, i) => {
                const y = 1.8 + i*0.42;
                s.addShape(pres.shapes.RECTANGLE, { x: W*0.54, y, w: 0.06, h: 0.26, fill: { color: p.color||C.a1 }, line: { width: 0 } });
                s.addText(p.name || 'Projeto', { x: W*0.55, y, w: 4.6, h: 0.28, fontSize: 11, color: C.txt, fontFace: 'Calibri' });
            });
        }

        if (G.id.logoInst) s.addImage({ data: G.id.logoInst, x: W*0.54, y: 0.55, w: 2, h: 0.9, sizing: { type:'contain', w: 2, h: 0.9 } });
        if (G.id.logoProg) s.addImage({ data: G.id.logoProg, x: W*0.78, y: 0.55, w: 2, h: 0.9, sizing: { type:'contain', w: 2, h: 0.9 } });
        return 1;
    }

    gerarDivisor(pres, projeto, G, C, index) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg2 } });
        this._orbe(s, pres, W*0.85, H*0.5, 6.5, projeto.color||C.a1, 91);
        this._orbe(s, pres, W*0.15, H*0.85, 4.0, C.a2, 93);
        this._lightBar(s, pres, { a1: projeto.color||C.a1, a2: C.a2, a3: C.a3 });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H-1.8, w: W, h: 0.04, fill: { color: projeto.color||C.a1 }, line: { width: 0 }, transparency: 55 });
        s.addText(String(index+1).padStart(2,'0'), { x: W*0.4, y: -0.8, w: W*0.6, h: H+0.8,
            fontSize: 220, color: projeto.color||C.a1, fontFace:'Calibri', bold: true, transparency: 93, align:'right' });

        const eyebrow = G.mode === 'single' ? 'PROJETO' : `PROJETO ${String(index+1).padStart(2,'0')}`;
        s.addText(eyebrow, { x: 1.0, y: 1.8, w: 9, h: 0.28, fontSize: 8, color: C.a2, fontFace:'Calibri', bold: true, charSpacing: 4 });
        s.addText(projeto.name || 'Projeto', { x: 1.0, y: 2.12, w: W*0.78, h: 2.5,
            fontSize: 50, color: C.txt, fontFace:'Calibri', bold: true, lineSpacingMultiple: 0.88 });
        s.addShape(pres.shapes.RECTANGLE, { x: 1.0, y: 4.85, w: 4.0, h: 0.04, fill: { color: projeto.color||C.a1 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 5.08, y: 4.85, w: 1.0, h: 0.04, fill: { color: C.a2 }, line: { width: 0 }, transparency: 45 });

        if (projeto.leader) s.addText(projeto.leader, { x: 1.0, y: 5.02, w: 8, h: 0.32, fontSize: 12, color: C.muted, fontFace:'Calibri Light' });
        const dt = [];
        if (projeto.periodo_inicio) dt.push(ModeloBase.parseDate(projeto.periodo_inicio).toLocaleDateString('pt-BR',{month:'short',year:'numeric'}));
        if (projeto.periodo_fim)    dt.push(ModeloBase.parseDate(projeto.periodo_fim).toLocaleDateString('pt-BR',{month:'short',year:'numeric'}));
        if (dt.length) s.addText(dt.join(' → '), { x: 1.0, y: 5.4, w: 8, h: 0.3, fontSize: 10, color: projeto.color||C.a2, fontFace:'Calibri', bold: true });

        const bc = projeto.status === 'Concluído' ? (C.teal||C.a2) : C.gold;
        s.addShape(pres.shapes.RECTANGLE, { x: W-2.0, y: 0.45, w: 1.6, h: 0.38, fill: { color: bc }, line: { width: 0 } });
        s.addText(projeto.status, { x: W-2.0, y: 0.47, w: 1.6, h: 0.33, align:'center', fontSize: 9, color: C.bg, fontFace:'Calibri', bold: true });
        return 1;
    }

    _adicionarTag(s, pres, texto, x, y, C) {
        const w = texto.length * 0.088 + 0.32;
        s.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.24, fill: { color: C.a1 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.03, fill: { color: C.a2 }, line: { width: 0 }, transparency: 40 });
        s.addText(texto, { x: x+0.1, y: y+0.04, w: w-0.12, h: 0.17, fontSize: 6.5, color:'FFFFFF', fontFace:'Calibri', bold: true, charSpacing: 1.5 });
    }

    _adicionarRodape(s, pres, G, C, projetoNome) {
        const { W, H } = ModeloBase;
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H-0.38, w: W, h: 0.38, fill: { color: C.bg2 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H-0.38, w: W, h: 0.04, fill: { color: C.a1 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H-0.38, w: W*0.35, h: 0.04, fill: { color: C.a2 }, line: { width: 0 } });
        if (G.id.instName) s.addText(G.id.instName, { x: 0.3, y: H-0.3, w: 5, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light' });
        if (projetoNome)   s.addText(projetoNome,   { x: W/2-2, y: H-0.3, w: 4, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light', align:'center' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: W-3.3, y: H-0.3, w: 3, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light', align:'right' });
    }
}
