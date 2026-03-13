// js/models/aurora.js
// Modelo Aurora 2026 — 5 orbes atmosféricos, shimmer sweep denso, névoa em 3 camadas.
// Sobrescreve: gerarCapa, gerarDivisor, _adicionarTag, _adicionarRodape

class ModeloAurora extends ModeloBase {
    constructor() { super('Aurora'); }

    // Gradiente horizontal simulado
    _gradH(s, pres, x, y, w, h, colorA, colorB, steps = 20) {
        for (let i = 0; i < steps; i++) {
            const t = i / (steps - 1);
            const fw = w / steps + 0.02;
            s.addShape(pres.shapes.RECTANGLE, { x: x + i*(w/steps), y, w: fw, h,
                fill: { color: colorA }, line: { width: 0 }, transparency: Math.round(t * 100) });
            s.addShape(pres.shapes.RECTANGLE, { x: x + i*(w/steps), y, w: fw, h,
                fill: { color: colorB }, line: { width: 0 }, transparency: Math.round((1-t) * 100) });
        }
    }

    // Orbe multi-camada (difuso)
    _orbe(s, pres, cx, cy, r, color, layers = 6, baseT = 72) {
        for (let i = 0; i < layers; i++) {
            const ri = r * (1 - i / layers);
            const t = baseT + Math.round(i * (99 - baseT) / layers);
            s.addShape(pres.shapes.ELLIPSE, { x: cx-ri/2, y: cy-ri/2*0.62, w: ri, h: ri*0.62,
                fill: { color }, line: { width: 0 }, transparency: t });
        }
    }

    gerarCapa(pres, G, C) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });

        // 5 orbes de luz atmosférica
        this._orbe(s, pres, W*0.12, H*0.35, 7.0, C.a1, 6, 70);
        this._orbe(s, pres, W*0.75, H*0.62, 6.0, C.a2, 6, 72);
        this._orbe(s, pres, W*0.45, H*0.08, 4.5, C.teal||C.a3, 5, 78);
        this._orbe(s, pres, W*0.95, H*0.15, 3.5, C.a3||C.a2, 5, 82);
        this._orbe(s, pres, W*0.28, H*0.88, 3.0, C.a2, 5, 84);

        // Véu de legibilidade
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg }, line: { width: 0 }, transparency: 52 });

        // Shimmer sweep — gradiente da esquerda
        this._gradH(s, pres, 0, 0, W*0.7, H, C.a1, C.bg, 22);

        // Linhas de luz finas (diagonal)
        s.addShape(pres.shapes.RECTANGLE, { x: -1, y: H*0.47, w: W*0.68, h: 0.04, fill: { color: C.a2 }, line: { width: 0 }, transparency: 42 });
        s.addShape(pres.shapes.RECTANGLE, { x: -1, y: H*0.475, w: W*0.68, h: 0.015, fill: { color: C.a3||C.a2 }, line: { width: 0 }, transparency: 15 });
        s.addShape(pres.shapes.RECTANGLE, { x: -1, y: H*0.48, w: W*0.65, h: 0.04, fill: { color: C.a1 }, line: { width: 0 }, transparency: 65 });

        // Eyebrow
        if (G.id.instDept) s.addText(G.id.instDept.toUpperCase(), { x: 0.8, y: 1.5, w: 7, h: 0.28,
            fontSize: 7.5, color: C.a2, fontFace:'Calibri Light', charSpacing: 5 });

        // Título etéreo
        s.addText(G.id.presTitle || 'Apresentação', { x: 0.8, y: 1.82, w: W*0.68, h: 2.8,
            fontSize: 50, color: C.txt, fontFace:'Calibri Light', bold: false, lineSpacingMultiple: 0.88 });

        if (G.id.presSub) s.addText(G.id.presSub, { x: 0.8, y: 4.72, w: W*0.65, h: 0.5, fontSize: 13, color: C.muted, fontFace:'Calibri Light' });
        if (G.id.instName) s.addText(G.id.instName, { x: 0.8, y: H-0.9, w: 5, h: 0.28, fontSize: 10, color: C.txt, fontFace:'Calibri Light' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: 0.8, y: H-0.62, w: 5, h: 0.22, fontSize: 8.5, color: C.muted, fontFace:'Calibri Light' });

        if (G.mode !== 'single') {
            G.projects.forEach((p, i) => {
                const y = 2.0 + i*0.4;
                s.addShape(pres.shapes.RECTANGLE, { x: W*0.73, y, w: 0.04, h: 0.25, fill: { color: p.color||C.a1 }, line: { width: 0 }, transparency: 30 });
                s.addText(p.name || 'Projeto', { x: W*0.74, y, w: 4.5, h: 0.28, fontSize: 11, color: C.txt, fontFace:'Calibri Light' });
            });
        }

        if (G.id.logoInst) s.addImage({ data: G.id.logoInst, x: W*0.74, y: 0.5, w: 2, h: 0.95, sizing: { type:'contain', w: 2, h: 0.95 } });
        if (G.id.logoProg) s.addImage({ data: G.id.logoProg, x: W*0.74+2.1, y: 0.5, w: 2, h: 0.95, sizing: { type:'contain', w: 2, h: 0.95 } });
        return 1;
    }

    gerarDivisor(pres, projeto, G, C, index) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });

        // 4 orbes
        this._orbe(s, pres, W*0.65, H*0.25, 7.5, projeto.color||C.a1, 6, 72);
        this._orbe(s, pres, W*0.1,  H*0.65, 5.5, C.a2, 6, 76);
        this._orbe(s, pres, W*0.9,  H*0.8,  4.0, C.teal||C.a3, 5, 80);
        this._orbe(s, pres, W*0.4,  H*0.05, 3.5, C.a2, 5, 82);

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg }, line: { width: 0 }, transparency: 50 });

        // Linha de luz
        s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: H*0.45, w: W*0.7, h: 0.03, fill: { color: projeto.color||C.a1 }, line: { width: 0 }, transparency: 38 });
        s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: H*0.452, w: W*0.55, h: 0.01, fill: { color: C.a2 }, line: { width: 0 }, transparency: 15 });

        s.addText(String(index+1).padStart(2,'0'), { x: 0, y: 0, w: W, h: H,
            fontSize: 240, color: projeto.color||C.a1, fontFace:'Calibri Light', transparency: 94, align:'right', valign:'bottom' });

        const eyebrow = G.mode === 'single' ? 'PROJETO' : `PROJETO ${String(index+1).padStart(2,'0')}`;
        s.addText(eyebrow, { x: 0.8, y: H*0.45+0.1, w: 9, h: 0.28, fontSize: 7.5, color: C.a2, fontFace:'Calibri Light', charSpacing: 5 });
        s.addText(projeto.name || 'Projeto', { x: 0.8, y: H*0.45+0.35, w: W*0.82, h: 2.8,
            fontSize: 52, color: C.txt, fontFace:'Calibri Light', bold: false, lineSpacingMultiple: 0.88 });

        if (projeto.leader) s.addText(projeto.leader, { x: 0.8, y: H*0.45+3.35, w: 8, h: 0.3, fontSize: 12, color: C.muted, fontFace:'Calibri Light' });
        const dt = [];
        if (projeto.periodo_inicio) dt.push(ModeloBase.parseDate(projeto.periodo_inicio).toLocaleDateString('pt-BR',{month:'short',year:'numeric'}));
        if (projeto.periodo_fim)    dt.push(ModeloBase.parseDate(projeto.periodo_fim).toLocaleDateString('pt-BR',{month:'short',year:'numeric'}));
        if (dt.length) s.addText(dt.join(' → '), { x: 0.8, y: H*0.45+3.7, w: 8, h: 0.28, fontSize: 9, color: projeto.color||C.a2, fontFace:'Calibri Light' });

        const bc = projeto.status === 'Concluído' ? (C.teal||C.a2) : C.gold;
        s.addShape(pres.shapes.RECTANGLE, { x: W-2.5, y: 0.45, w: 2.1, h: 0.35, fill: { color: bc }, line: { width: 0 }, transparency: 82 });
        s.addText(projeto.status, { x: W-2.5, y: 0.46, w: 2.1, h: 0.33, align:'center', fontSize: 9, color: bc, fontFace:'Calibri Light', bold: true });
        return 1;
    }

    _adicionarTag(s, pres, texto, x, y, C) {
        const w = texto.length * 0.088 + 0.3;
        s.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.22, fill: { color: C.a1 }, line: { width: 0 }, transparency: 80 });
        s.addShape(pres.shapes.RECTANGLE, { x, y: y+0.19, w, h: 0.015, fill: { color: C.a1 }, line: { width: 0 }, transparency: 30 });
        s.addText(texto, { x: x+0.08, y: y+0.03, w: w-0.1, h: 0.18, fontSize: 6.5, color: C.a2, fontFace:'Calibri Light', bold: true, charSpacing: 2 });
    }

    _adicionarRodape(s, pres, G, C, projetoNome) {
        const { W, H } = ModeloBase;
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H-0.36, w: W, h: 0.36, fill: { color: C.bg2 }, line: { width: 0 }, transparency: 30 });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H-0.36, w: W, h: 0.02, fill: { color: C.a1 }, line: { width: 0 }, transparency: 50 });
        if (G.id.instName) s.addText(G.id.instName, { x: 0.3, y: H-0.28, w: 5, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light' });
        if (projetoNome)   s.addText(projetoNome,   { x: W/2-2, y: H-0.28, w: 4, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light', align:'center' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: W-3.3, y: H-0.28, w: 3, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light', align:'right' });
    }
}
