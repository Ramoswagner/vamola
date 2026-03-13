// js/models/bauhaus.js
// Modelo Bauhaus 2026 — círculo dominante maior, inner rings, glow externo, mini dots geométricos.
// Sobrescreve: gerarCapa, gerarDivisor, _adicionarTag, _adicionarRodape

class ModeloBauhaus extends ModeloBase {
    constructor() { super('Bauhaus'); }

    // Círculo com rings e glow
    _circulo(s, pres, cx, cy, r, color, bg, withRings = true) {
        // Glow externo (3 camadas)
        for (let i = 0; i < 4; i++) {
            const ri = r + 0.3 + i * 0.28;
            const tr = 85 + i * 3;
            s.addShape(pres.shapes.ELLIPSE, { x: cx-ri/2, y: cy-ri/2, w: ri, h: ri,
                fill: { color }, line: { width: 0 }, transparency: tr });
        }
        // Círculo principal
        s.addShape(pres.shapes.ELLIPSE, { x: cx-r/2, y: cy-r/2, w: r, h: r,
            fill: { color }, line: { width: 0 } });
        if (!withRings) return;
        // Inner rings (negativo = vazado com cor de fundo)
        [0.82, 0.62, 0.42].forEach((f, i) => {
            const ri = r * f;
            s.addShape(pres.shapes.ELLIPSE, { x: cx-ri/2, y: cy-ri/2, w: ri, h: ri,
                fill: { color: bg }, line: { width: 0 }, transparency: [25, 50, 72][i] });
        });
        // Highlight de reflexo (elipse pequena no top-left do círculo)
        const rh = r * 0.22;
        s.addShape(pres.shapes.ELLIPSE, { x: cx-r*0.18, y: cy-r*0.32, w: rh, h: rh*0.6,
            fill: { color: 'FFFFFF' }, line: { width: 0 }, transparency: 78 });
    }

    // Mini dot decorativo
    _dot(s, pres, x, y, r, color, tr = 0) {
        s.addShape(pres.shapes.ELLIPSE, { x: x-r/2, y: y-r/2, w: r, h: r,
            fill: { color }, line: { width: 0 }, transparency: tr });
    }

    gerarCapa(pres, G, C) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });

        // Círculo dominante — maior que a versão anterior
        this._circulo(s, pres, W*0.72, H*0.5, 7.2, C.a1, C.bg);

        // Círculo menor de contraste
        this._dot(s, pres, W*0.88, H*0.18, 1.6, C.a2, 65);

        // Mini dots de acento geométrico
        this._dot(s, pres, W*0.22, H*0.14, 0.45, C.a2, 0);
        this._dot(s, pres, W*0.34, H*0.14, 0.22, C.a1, 50);
        this._dot(s, pres, W*0.22, H*0.22, 0.22, C.a1, 50);

        // Barra vertical esquerda
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.08, h: H, fill: { color: C.a2 }, line: { width: 0 } });

        // Eyebrow
        if (G.id.instDept) s.addText(G.id.instDept.toUpperCase(), { x: 0.55, y: 1.4, w: 6, h: 0.28,
            fontSize: 7.5, color: C.muted, fontFace:'Calibri Light', charSpacing: 3.5 });

        // Título — bold, forte
        s.addText(G.id.presTitle || 'Apresentação', { x: 0.55, y: 1.7, w: W*0.52, h: 3.1,
            fontSize: 46, color: C.txt, fontFace:'Calibri', bold: true, lineSpacingMultiple: 0.88 });

        // Linha de acento sob título
        s.addShape(pres.shapes.RECTANGLE, { x: 0.55, y: 4.9, w: 2.2, h: 0.07, fill: { color: C.a1 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 2.77, y: 4.9, w: 0.7, h: 0.07, fill: { color: C.a2 }, line: { width: 0 } });

        if (G.id.presSub) s.addText(G.id.presSub, { x: 0.55, y: 5.07, w: W*0.52, h: 0.5, fontSize: 12, color: C.muted, fontFace:'Calibri Light' });
        if (G.id.instName) s.addText(G.id.instName, { x: 0.55, y: H-0.9, w: 5, h: 0.28, fontSize: 10, color: C.txt, fontFace:'Calibri' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: 0.55, y: H-0.62, w: 5, h: 0.22, fontSize: 8.5, color: C.muted, fontFace:'Calibri Light' });

        if (G.mode !== 'single') {
            G.projects.forEach((p, i) => {
                const y = 1.6 + i*0.4;
                s.addShape(pres.shapes.ELLIPSE, { x: W*0.55, y: y+0.07, w: 0.12, h: 0.12, fill: { color: p.color||C.a2 }, line: { width: 0 } });
                s.addText(p.name || 'Projeto', { x: W*0.55+0.18, y, w: 4.4, h: 0.28, fontSize: 11, color: C.txt, fontFace:'Calibri' });
            });
        }

        if (G.id.logoInst) s.addImage({ data: G.id.logoInst, x: 0.55, y: 0.4, w: 1.8, h: 0.85, sizing: { type:'contain', w: 1.8, h: 0.85 } });
        if (G.id.logoProg) s.addImage({ data: G.id.logoProg, x: 2.45, y: 0.4, w: 1.8, h: 0.85, sizing: { type:'contain', w: 1.8, h: 0.85 } });
        return 1;
    }

    gerarDivisor(pres, projeto, G, C, index) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });

        // Círculo dominante com cor do projeto
        this._circulo(s, pres, W*0.78, H*0.5, 7.5, projeto.color||C.a1, C.bg);

        // Mini círculo top-left
        this._dot(s, pres, W*0.12, H*0.15, 1.0, C.a2, 55);

        // Barra
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.08, h: H, fill: { color: C.a2 }, line: { width: 0 } });

        // Número ghost
        s.addText(String(index+1).padStart(2,'0'), { x: W*0.38, y: -0.5, w: W*0.62, h: H+0.5,
            fontSize: 220, color: projeto.color||C.a1, fontFace:'Calibri', bold: true, transparency: 91, align:'right' });

        const eyebrow = G.mode === 'single' ? 'PROJETO' : `PROJETO ${String(index+1).padStart(2,'0')}`;
        s.addText(eyebrow, { x: 0.6, y: 1.8, w: 9, h: 0.28, fontSize: 8, color: C.a2, fontFace:'Calibri', bold: true, charSpacing: 3.5 });
        s.addText(projeto.name || 'Projeto', { x: 0.6, y: 2.1, w: W*0.62, h: 2.6,
            fontSize: 50, color: C.txt, fontFace:'Calibri', bold: true, lineSpacingMultiple: 0.88 });
        s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 4.85, w: 3.8, h: 0.07, fill: { color: projeto.color||C.a1 }, line: { width: 0 } });

        if (projeto.leader) s.addText(projeto.leader, { x: 0.6, y: 5.04, w: 8, h: 0.3, fontSize: 12, color: C.muted, fontFace:'Calibri Light' });
        const dt = [];
        if (projeto.periodo_inicio) dt.push(ModeloBase.parseDate(projeto.periodo_inicio).toLocaleDateString('pt-BR',{month:'short',year:'numeric'}));
        if (projeto.periodo_fim)    dt.push(ModeloBase.parseDate(projeto.periodo_fim).toLocaleDateString('pt-BR',{month:'short',year:'numeric'}));
        if (dt.length) s.addText(dt.join(' → '), { x: 0.6, y: 5.42, w: 8, h: 0.28, fontSize: 9, color: projeto.color||C.a2, fontFace:'Calibri', bold: true });

        const bc = projeto.status === 'Concluído' ? (C.teal||C.a2) : C.gold;
        s.addShape(pres.shapes.RECTANGLE, { x: W-2.1, y: 0.45, w: 1.7, h: 0.4, fill: { color: bc }, line: { width: 0 } });
        s.addText(projeto.status, { x: W-2.1, y: 0.47, w: 1.7, h: 0.36, align:'center', fontSize: 9, color: C.bg, fontFace:'Calibri', bold: true });
        return 1;
    }

    _adicionarTag(s, pres, texto, x, y, C) {
        const w = texto.length * 0.09 + 0.3;
        s.addShape(pres.shapes.ELLIPSE, { x: x-0.1, y: y+0.04, w: 0.15, h: 0.15, fill: { color: C.a1 }, line: { width: 0 } });
        s.addText(texto, { x: x+0.12, y, w, h: 0.22, fontSize: 7, color: C.a2, fontFace:'Calibri', bold: true, charSpacing: 2 });
    }

    _adicionarRodape(s, pres, G, C, projetoNome) {
        const { W, H } = ModeloBase;
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H-0.38, w: W, h: 0.38, fill: { color: C.bg2 }, line: { width: 0 } });
        s.addShape(pres.shapes.ELLIPSE, { x: 0, y: H-0.46, w: 0.22, h: 0.22, fill: { color: C.a1 }, line: { width: 0 } });
        if (G.id.instName) s.addText(G.id.instName, { x: 0.3, y: H-0.3, w: 5, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light' });
        if (projetoNome)   s.addText(projetoNome,   { x: W/2-2, y: H-0.3, w: 4, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light', align:'center' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: W-3.3, y: H-0.3, w: 3, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light', align:'right' });
    }
}
