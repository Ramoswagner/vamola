// js/models/minimalista.js
// Modelo Minimalista 2026 — espaço negativo extremo, linha de luz única, tipografia cirúrgica.
// Sobrescreve: gerarCapa, gerarDivisor, _adicionarTag, _adicionarRodape

class ModeloMinimalista extends ModeloBase {
    constructor() { super('Minimalista'); }

    // Linha de luz com glow duplo
    _lightLine(s, pres, C, y, xStart = 0.5, xEnd) {
        const { W } = ModeloBase;
        const xe = xEnd || W - 0.5;
        s.addShape(pres.shapes.RECTANGLE, { x: xStart, y: y - 0.02, w: xe - xStart, h: 0.02,
            fill: { color: C.a1 }, line: { width: 0 }, transparency: 55 });
        s.addShape(pres.shapes.RECTANGLE, { x: xStart, y, w: xe - xStart, h: 0.015,
            fill: { color: C.a1 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: xStart, y: y + 0.015, w: xe - xStart, h: 0.02,
            fill: { color: C.a2 }, line: { width: 0 }, transparency: 60 });
    }

    // Ponto de acento
    _dot(s, pres, x, y, r, C) {
        s.addShape(pres.shapes.ELLIPSE, { x: x-r/2, y: y-r/2, w: r, h: r, fill: { color: C.a1 }, line: { width: 0 } });
        s.addShape(pres.shapes.ELLIPSE, { x: x-r*1.4/2, y: y-r*1.4/2, w: r*1.4, h: r*1.4,
            fill: { color: C.a1 }, line: { width: 0 }, transparency: 80 });
    }

    gerarCapa(pres, G, C) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });

        // Linhas horizontais — acima e abaixo do título
        this._lightLine(s, pres, C, H * 0.35);
        this._lightLine(s, pres, C, H * 0.72);

        // Ponto de acento esquerdo
        this._dot(s, pres, 0.5, H * 0.35, 0.14, C);
        this._dot(s, pres, 0.5, H * 0.72, 0.14, C);

        // Eyebrow ultra-espaçado
        if (G.id.instDept) {
            s.addText(G.id.instDept.toUpperCase(), { x: 0.7, y: H*0.35+0.08, w: 9, h: 0.28,
                fontSize: 7, color: C.muted, fontFace:'Calibri Light', charSpacing: 5 });
        }

        // Título — leve, enorme
        s.addText(G.id.presTitle || 'Apresentação', { x: 0.7, y: H*0.35+0.25, w: W-1.2, h: 3.2,
            fontSize: 48, color: C.txt, fontFace:'Calibri Light', bold: false, lineSpacingMultiple: 0.9 });

        // Subtítulo
        if (G.id.presSub) {
            s.addText(G.id.presSub, { x: 0.7, y: H*0.72+0.08, w: W*0.7, h: 0.55,
                fontSize: 13, color: C.muted, fontFace:'Calibri Light' });
        }

        // Org + data — bottom right
        if (G.id.instName) s.addText(G.id.instName, { x: W-5, y: H-1.0, w: 4.7, h: 0.28, align:'right', fontSize: 10, color: C.txt, fontFace:'Calibri' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: W-5, y: H-0.7, w: 4.7, h: 0.22, align:'right', fontSize: 8.5, color: C.muted, fontFace:'Calibri Light' });

        // Projetos
        if (G.mode !== 'single') {
            G.projects.forEach((p, i) => {
                const y = 1.2 + i*0.35;
                s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y, w: 0.04, h: 0.22, fill: { color: p.color||C.a1 }, line: { width: 0 } });
                s.addText(p.name || 'Projeto', { x: 0.85, y, w: 6, h: 0.24, fontSize: 10, color: C.muted, fontFace:'Calibri Light' });
            });
        }

        if (G.id.logoInst) s.addImage({ data: G.id.logoInst, x: 0.7, y: 0.4, w: 1.8, h: 0.8, sizing: { type:'contain', w: 1.8, h: 0.8 } });
        if (G.id.logoProg) s.addImage({ data: G.id.logoProg, x: 2.55, y: 0.4, w: 1.8, h: 0.8, sizing: { type:'contain', w: 1.8, h: 0.8 } });
        return 1;
    }

    gerarDivisor(pres, projeto, G, C, index) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });

        // Única linha de luz central
        this._lightLine(s, pres, C, H * 0.5, 0.55, W - 0.55);

        // Número ghost — ultra-leve
        s.addText(String(index+1).padStart(2,'0'), { x: 0, y: 0, w: W, h: H,
            fontSize: 260, color: C.a1, fontFace:'Calibri Light', transparency: 96, align:'right', valign:'bottom' });

        // Eyebrow
        const eyebrow = G.mode === 'single' ? 'PROJETO' : `PROJETO ${String(index+1).padStart(2,'0')}`;
        s.addText(eyebrow, { x: 0.7, y: H*0.5+0.1, w: 9, h: 0.28, fontSize: 7, color: C.a1, fontFace:'Calibri', bold: true, charSpacing: 5 });

        // Nome — leve, grande
        s.addText(projeto.name || 'Projeto', { x: 0.7, y: H*0.5+0.32, w: W*0.88, h: 2.8,
            fontSize: 52, color: C.txt, fontFace:'Calibri Light', bold: false, lineSpacingMultiple: 0.9 });

        if (projeto.leader) s.addText(projeto.leader, { x: 0.7, y: H*0.5+3.25, w: 8, h: 0.3, fontSize: 11, color: C.muted, fontFace:'Calibri Light' });
        const dt = [];
        if (projeto.periodo_inicio) dt.push(ModeloBase.parseDate(projeto.periodo_inicio).toLocaleDateString('pt-BR',{month:'short',year:'numeric'}));
        if (projeto.periodo_fim)    dt.push(ModeloBase.parseDate(projeto.periodo_fim).toLocaleDateString('pt-BR',{month:'short',year:'numeric'}));
        if (dt.length) s.addText(dt.join(' → '), { x: 0.7, y: H*0.5+3.6, w: 8, h: 0.28, fontSize: 9, color: C.a1, fontFace:'Calibri Light' });

        const bc = projeto.status === 'Concluído' ? (C.teal||C.a2) : C.gold;
        s.addShape(pres.shapes.RECTANGLE, { x: W-2.2, y: H*0.5-0.28, w: 1.8, h: 0.28, fill: { color: bc }, line: { width: 0 }, transparency: 80 });
        s.addText(projeto.status, { x: W-2.2, y: H*0.5-0.27, w: 1.8, h: 0.26, align:'center', fontSize: 8, color: bc, fontFace:'Calibri', bold: true });
        return 1;
    }

    _adicionarTag(s, pres, texto, x, y, C) {
        s.addText(texto, { x, y, w: texto.length*0.09+0.2, h: 0.2,
            fontSize: 6.5, color: C.a1, fontFace:'Calibri Light', charSpacing: 3 });
        const { } = ModeloBase;
        s.addShape(pres.shapes.RECTANGLE, { x, y: y+0.19, w: 0.25, h: 0.015, fill: { color: C.a1 }, line: { width: 0 } });
    }

    _adicionarRodape(s, pres, G, C, projetoNome) {
        const { W, H } = ModeloBase;
        s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: H-0.5, w: W-1.0, h: 0.015,
            fill: { color: C.a1 }, line: { width: 0 }, transparency: 70 });
        if (G.id.instName) s.addText(G.id.instName, { x: 0.5, y: H-0.42, w: 4, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light' });
        if (projetoNome)   s.addText(projetoNome,   { x: W/2-2, y: H-0.42, w: 4, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light', align:'center' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: W-4.5, y: H-0.42, w: 4, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light', align:'right' });
    }
}
