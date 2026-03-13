// js/models/revista.js
// Modelo Revista 2026 — spine gradiente rico, shimmer skew agressivo, editorial com força.
// Sobrescreve: gerarCapa, gerarDivisor, _adicionarTag, _adicionarRodape

class ModeloRevista extends ModeloBase {
    constructor() { super('Revista'); }

    // Spine com glow duplo
    _spine(s, pres, C, x, yTop = 0) {
        const { H } = ModeloBase;
        const h = H - yTop;
        // Glow externo
        s.addShape(pres.shapes.RECTANGLE, { x: x-0.1, y: yTop, w: 0.1, h, fill: { color: C.a1 }, line: { width: 0 }, transparency: 85 });
        // Faixa principal
        s.addShape(pres.shapes.RECTANGLE, { x, y: yTop, w: 0.55, h, fill: { color: C.a1 }, line: { width: 0 } });
        // Camada de cor 2 (gradiente simulado)
        s.addShape(pres.shapes.RECTANGLE, { x, y: yTop, w: 0.55, h: h*0.45, fill: { color: C.a2 }, line: { width: 0 }, transparency: 55 });
        // Linha brilhante no interior
        s.addShape(pres.shapes.RECTANGLE, { x: x+0.52, y: yTop, w: 0.04, h, fill: { color: C.a2 }, line: { width: 0 }, transparency: 40 });
        s.addShape(pres.shapes.RECTANGLE, { x: x+0.56, y: yTop, w: 0.02, h, fill: { color: C.a3||C.a2 }, line: { width: 0 }, transparency: 70 });
    }

    // Shimmer skew (faixas inclinadas)
    _shimmer(s, pres, C, x0, n = 6) {
        const { H } = ModeloBase;
        for (let i = 0; i < n; i++) {
            s.addShape(pres.shapes.RECTANGLE, { x: x0 + i*0.22, y: 0, w: 0.10, h: H,
                fill: { color: C.a2 }, line: { width: 0 }, transparency: 94 - i });
        }
    }

    gerarCapa(pres, G, C) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });

        // Painel direito tipo encarte
        s.addShape(pres.shapes.RECTANGLE, { x: W*0.58, y: 0, w: W*0.42, h: H, fill: { color: C.bg2 }, line: { width: 0 } });

        // Spine
        this._spine(s, pres, C, W*0.58-0.55);

        // Shimmer no painel direito
        this._shimmer(s, pres, C, W*0.62);

        // Linha de topo
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 0.08, fill: { color: C.a2 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W*0.42, h: 0.08, fill: { color: C.a1 }, line: { width: 0 } });

        // Eyebrow
        if (G.id.instDept) s.addText(G.id.instDept.toUpperCase(), { x: 0.55, y: 1.3, w: 6, h: 0.28,
            fontSize: 7.5, color: C.muted, fontFace:'Calibri Light', charSpacing: 4 });

        // Título
        s.addText(G.id.presTitle || 'Apresentação', { x: 0.55, y: 1.58, w: W*0.52, h: 3.2,
            fontSize: 48, color: C.txt, fontFace:'Calibri', bold: true, lineSpacingMultiple: 0.87 });

        // Glowing dots de acento
        [0, 0.26, 0.52].forEach(dx => {
            s.addShape(pres.shapes.ELLIPSE, { x: 0.55+dx, y: 4.9, w: 0.16, h: 0.16, fill: { color: C.a1 }, line: { width: 0 } });
            s.addShape(pres.shapes.ELLIPSE, { x: 0.50+dx, y: 4.86, w: 0.26, h: 0.26, fill: { color: C.a1 }, line: { width: 0 }, transparency: 82 });
        });

        if (G.id.presSub) s.addText(G.id.presSub, { x: 0.55, y: 5.2, w: W*0.52, h: 0.5, fontSize: 12, color: C.muted, fontFace:'Calibri Light' });
        if (G.id.instName) s.addText(G.id.instName, { x: 0.55, y: H-0.9, w: 5, h: 0.28, fontSize: 10, color: C.txt, fontFace:'Calibri' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: 0.55, y: H-0.62, w: 5, h: 0.22, fontSize: 8.5, color: C.muted, fontFace:'Calibri Light' });

        if (G.mode !== 'single') {
            G.projects.forEach((p, i) => {
                const y = 1.5 + i*0.42;
                s.addShape(pres.shapes.RECTANGLE, { x: W*0.62, y, w: 0.05, h: 0.28, fill: { color: p.color||C.a1 }, line: { width: 0 } });
                s.addText(p.name || 'Projeto', { x: W*0.63, y, w: 4.5, h: 0.28, fontSize: 11, color: C.txt, fontFace:'Calibri' });
            });
        }

        if (G.id.logoInst) s.addImage({ data: G.id.logoInst, x: W*0.62, y: 0.3, w: 1.8, h: 0.9, sizing: { type:'contain', w: 1.8, h: 0.9 } });
        if (G.id.logoProg) s.addImage({ data: G.id.logoProg, x: W*0.62+1.9, y: 0.3, w: 1.8, h: 0.9, sizing: { type:'contain', w: 1.8, h: 0.9 } });
        return 1;
    }

    gerarDivisor(pres, projeto, G, C, index) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg2 } });

        // Spine com cor do projeto
        this._spine(s, pres, { a1: projeto.color||C.a1, a2: C.a2, a3: C.a3 }, 0);
        this._shimmer(s, pres, { a2: C.a2 }, 1.2);

        // Linha de topo
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 0.08, fill: { color: C.a2 }, line: { width: 0 } });

        // Número
        s.addText(String(index+1).padStart(2,'0'), { x: W*0.4, y: -0.5, w: W*0.6, h: H+0.5,
            fontSize: 220, color: projeto.color||C.a1, fontFace:'Calibri', bold: true, transparency: 91, align:'right' });

        const eyebrow = G.mode === 'single' ? 'PROJETO' : `PROJETO ${String(index+1).padStart(2,'0')}`;
        s.addText(eyebrow, { x: 1.1, y: 1.7, w: 9, h: 0.28, fontSize: 8, color: C.a2, fontFace:'Calibri Light', charSpacing: 4 });
        s.addText(projeto.name || 'Projeto', { x: 1.1, y: 2.0, w: W-1.6, h: 2.7,
            fontSize: 50, color: C.txt, fontFace:'Calibri', bold: true, lineSpacingMultiple: 0.88 });
        s.addShape(pres.shapes.RECTANGLE, { x: 1.1, y: 4.85, w: 3.5, h: 0.06, fill: { color: projeto.color||C.a1 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 4.65, y: 4.85, w: 0.8, h: 0.06, fill: { color: C.a2 }, line: { width: 0 }, transparency: 50 });

        if (projeto.leader) s.addText(projeto.leader, { x: 1.1, y: 5.04, w: 8, h: 0.3, fontSize: 12, color: C.muted, fontFace:'Calibri Light' });
        const dt = [];
        if (projeto.periodo_inicio) dt.push(ModeloBase.parseDate(projeto.periodo_inicio).toLocaleDateString('pt-BR',{month:'short',year:'numeric'}));
        if (projeto.periodo_fim)    dt.push(ModeloBase.parseDate(projeto.periodo_fim).toLocaleDateString('pt-BR',{month:'short',year:'numeric'}));
        if (dt.length) s.addText(dt.join(' → '), { x: 1.1, y: 5.42, w: 8, h: 0.28, fontSize: 9, color: projeto.color||C.a2, fontFace:'Calibri', bold: true });

        const bc = projeto.status === 'Concluído' ? (C.teal||C.a2) : C.gold;
        s.addShape(pres.shapes.RECTANGLE, { x: W-2.0, y: 0.35, w: 1.65, h: 0.42, fill: { color: bc }, line: { width: 0 } });
        s.addText(projeto.status, { x: W-2.0, y: 0.37, w: 1.65, h: 0.38, align:'center', fontSize: 9, color: C.bg, fontFace:'Calibri', bold: true });
        return 1;
    }

    _adicionarTag(s, pres, texto, x, y, C) {
        const w = texto.length * 0.09 + 0.3;
        s.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.22, fill: { color: C.a1 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.55, h: 0.22, fill: { color: C.a2 }, line: { width: 0 }, transparency: 55 });
        s.addText(texto, { x: x+0.1, y: y+0.04, w: w-0.12, h: 0.17, fontSize: 6.5, color:'FFFFFF', fontFace:'Calibri', bold: true, charSpacing: 1.5 });
    }

    _adicionarRodape(s, pres, G, C, projetoNome) {
        const { W, H } = ModeloBase;
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H-0.38, w: W, h: 0.38, fill: { color: C.bg2 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H-0.38, w: W, h: 0.05, fill: { color: C.a2 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H-0.38, w: 0.55, h: 0.38, fill: { color: C.a1 }, line: { width: 0 } });
        if (G.id.instName) s.addText(G.id.instName, { x: 0.8, y: H-0.3, w: 5, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light' });
        if (projetoNome)   s.addText(projetoNome,   { x: W/2-2, y: H-0.3, w: 4, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light', align:'center' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: W-3.3, y: H-0.3, w: 3, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light', align:'right' });
    }
}
