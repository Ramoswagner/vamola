// js/models/moderno.js
// Modelo Moderno 2026 — diagonal em fatias, glow de acento intenso, tipografia oversize.
// Sobrescreve: gerarCapa, gerarDivisor, _adicionarTag, _adicionarRodape

class ModeloModerno extends ModeloBase {
    constructor() { super('Moderno'); }

    // Diagonal simulada com fatias sobrepostas (mais dramática)
    _diagonal(s, pres, C, yStart, thick, n = 14) {
        const { W } = ModeloBase;
        const step = thick / n;
        for (let i = 0; i < n; i++) {
            const t = i / (n - 1);
            const y = yStart + i * (thick / n);
            const offset = t * W * 0.28;
            s.addShape(pres.shapes.RECTANGLE, { x: 0, y: y + offset * 0.04, w: W, h: step + 0.01,
                fill: { color: C.bg2 }, line: { width: 0 }, transparency: Math.round(t * 55) });
        }
    }

    // Orbe de luz
    _orbe(s, pres, cx, cy, r, color, tr = 88) {
        for (let i = 0; i < 3; i++) {
            const ri = r * (1 - i * 0.28);
            s.addShape(pres.shapes.ELLIPSE, { x: cx - ri/2, y: cy - ri/2*0.65, w: ri, h: ri*0.65,
                fill: { color }, line: { width: 0 }, transparency: tr + i * 4 });
        }
    }

    gerarCapa(pres, G, C) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H*0.54, fill: { color: C.a1 }, line: { width: 0 } });

        // Diagonal em fatias
        this._diagonal(s, pres, C, H*0.42, H*0.16);

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H*0.54, w: W, h: H*0.46, fill: { color: C.bg }, line: { width: 0 } });

        // Orbe de glow no canto direito da área de cor
        this._orbe(s, pres, W*0.9, H*0.22, 4.5, C.a2, 82);

        // Linha de acento no topo (dupla)
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 0.07, fill: { color: C.a2 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W*0.4, h: 0.07, fill: { color: C.a3||C.a2 }, line: { width: 0 }, transparency: 30 });

        // Shimmer skew
        for (let i = 0; i < 4; i++) {
            s.addShape(pres.shapes.RECTANGLE, { x: W*0.55 + i*0.16, y: 0, w: 0.06, h: H*0.54,
                fill: { color: 'FFFFFF' }, line: { width: 0 }, transparency: 95 - i*2 });
        }

        // Título
        s.addText(G.id.presTitle || 'Apresentação', { x: 0.7, y: 0.3, w: W-3.2, h: 3.3,
            fontSize: 52, color: C.bg, fontFace:'Calibri', bold: true, lineSpacingMultiple: 0.85 });

        if (G.id.presSub) s.addText(G.id.presSub, { x: 0.7, y: 3.65, w: W*0.65, h: 0.5, fontSize: 13, color: C.muted, fontFace:'Calibri Light' });
        if (G.id.instDept) s.addText(G.id.instDept.toUpperCase(), { x: 0.7, y: 4.25, w: 6, h: 0.28, fontSize: 8, color: C.a2, fontFace:'Calibri', bold: true, charSpacing: 3 });
        if (G.id.instName) s.addText(G.id.instName, { x: W-4.5, y: H-1.1, w: 4.2, h: 0.3, fontSize: 11, color: C.txt, fontFace:'Calibri', bold: true, align:'right' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: W-4.5, y: H-0.75, w: 4.2, h: 0.25, fontSize: 9, color: C.muted, fontFace:'Calibri Light', align:'right' });

        if (G.mode !== 'single') {
            G.projects.forEach((p, i) => {
                const y = 1.2 + i*0.42;
                s.addShape(pres.shapes.RECTANGLE, { x: W-3.8, y, w: 0.06, h: 0.28, fill: { color: p.color||C.bg }, line: { width: 0 } });
                s.addText(p.name || 'Projeto', { x: W-3.6, y, w: 3.4, h: 0.28, fontSize: 11, color: C.bg, fontFace:'Calibri' });
            });
        }

        if (G.id.logoInst) s.addImage({ data: G.id.logoInst, x: W-3.2, y: 0.3, w: 1.4, h: 0.7, sizing: { type:'contain', w: 1.4, h: 0.7 } });
        if (G.id.logoProg) s.addImage({ data: G.id.logoProg, x: W-1.7, y: 0.3, w: 1.4, h: 0.7, sizing: { type:'contain', w: 1.4, h: 0.7 } });
        return 1;
    }

    gerarDivisor(pres, projeto, G, C, index) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });

        // Faixas laterais duplas + glow
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.20, h: H, fill: { color: projeto.color||C.a1 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0.20, y: 0, w: 0.06, h: H, fill: { color: C.a2 }, line: { width: 0 }, transparency: 40 });
        s.addShape(pres.shapes.RECTANGLE, { x: 0.26, y: 0, w: 0.03, h: H, fill: { color: C.a3||C.a2 }, line: { width: 0 }, transparency: 70 });

        // Orbe de glow
        this._orbe(s, pres, W*0.85, H*0.4, 6.0, projeto.color||C.a1, 88);

        // Número
        s.addText(String(index+1).padStart(2,'0'), { x: W*0.42, y: -0.5, w: W*0.58, h: H+0.5,
            fontSize: 220, color: projeto.color||C.a1, fontFace:'Calibri', bold: true, transparency: 92, align:'right' });

        const eyebrow = G.mode === 'single' ? 'PROJETO' : `PROJETO ${String(index+1).padStart(2,'0')}`;
        s.addText(eyebrow, { x: 1.1, y: 1.8, w: 9, h: 0.28, fontSize: 9, color: C.a2, fontFace:'Calibri', bold: true, charSpacing: 4 });
        s.addText(projeto.name || 'Projeto', { x: 1.1, y: 2.14, w: 9.5, h: 2.5, fontSize: 50, color: C.txt, fontFace:'Calibri', bold: true, lineSpacingMultiple: 0.88 });
        s.addShape(pres.shapes.RECTANGLE, { x: 1.1, y: 4.85, w: 4.5, h: 0.05, fill: { color: projeto.color||C.a1 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 5.65, y: 4.85, w: 1.2, h: 0.05, fill: { color: C.a2 }, line: { width: 0 }, transparency: 50 });

        if (projeto.leader) s.addText(projeto.leader, { x: 1.1, y: 5.02, w: 8, h: 0.32, fontSize: 13, color: C.muted, fontFace:'Calibri Light' });
        const dt = [];
        if (projeto.periodo_inicio) dt.push(ModeloBase.parseDate(projeto.periodo_inicio).toLocaleDateString('pt-BR',{month:'short',year:'numeric'}));
        if (projeto.periodo_fim)    dt.push(ModeloBase.parseDate(projeto.periodo_fim).toLocaleDateString('pt-BR',{month:'short',year:'numeric'}));
        if (dt.length) s.addText(dt.join(' → '), { x: 1.1, y: 5.4, w: 8, h: 0.3, fontSize: 10, color: projeto.color||C.a2, fontFace:'Calibri', bold: true });

        const bc = projeto.status === 'Concluído' ? (C.teal||C.a2) : C.gold;
        s.addShape(pres.shapes.RECTANGLE, { x: W-2.0, y: H-0.65, w: 1.7, h: 0.42, fill: { color: bc }, line: { width: 0 } });
        s.addText(projeto.status, { x: W-2.0, y: H-0.63, w: 1.7, h: 0.38, align:'center', fontSize: 9, color: C.bg, fontFace:'Calibri', bold: true });
        return 1;
    }

    _adicionarTag(s, pres, texto, x, y, C) {
        s.addText(texto, { x, y, w: texto.length*0.09+0.3, h: 0.22, fontSize: 7, color: C.a2, fontFace:'Calibri', bold: true, charSpacing: 2.5 });
    }

    _adicionarRodape(s, pres, G, C, projetoNome) {
        const { W, H } = ModeloBase;
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H-0.05, w: W, h: 0.05, fill: { color: C.a1 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H-0.05, w: W*0.4, h: 0.05, fill: { color: C.a2 }, line: { width: 0 } });
        if (G.id.instName) s.addText(G.id.instName, { x: 0.3, y: H-0.32, w: 5, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light' });
        if (projetoNome)   s.addText(projetoNome,   { x: W/2-2, y: H-0.32, w: 4, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light', align:'center' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: W-3.3, y: H-0.32, w: 3, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light', align:'right' });
    }
}
