// js/models/brutal.js
// Modelo Brutal 2026 — blocos de cor sólidos oversize, diagonal dura em camadas, tipografia massiva.
// Sobrescreve: gerarCapa, gerarDivisor, _adicionarTag, _adicionarRodape

class ModeloBrutal extends ModeloBase {
    constructor() { super('Brutal'); }

    // Diagonal dura — camadas sólidas escalonadas
    _diagonalDura(s, pres, C, fromColor, toColor, n = 8) {
        const { W, H } = ModeloBase;
        const step = W / n;
        for (let i = 0; i < n; i++) {
            const t = i / (n - 1);
            const yOff = t * H * 0.28;
            s.addShape(pres.shapes.RECTANGLE, { x: i * step, y: yOff, w: step + 0.05, h: H - yOff,
                fill: { color: i < n/2 ? fromColor : toColor }, line: { width: 0 } });
        }
    }

    gerarCapa(pres, G, C) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        // Base escura
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });

        // Bloco superior maciço
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H*0.58, fill: { color: C.a1 }, line: { width: 0 } });

        // Corte diagonal duro
        this._diagonalDura(s, pres, C, C.a1, C.bg, 10);

        // Linha de corte nítida
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H*0.58-0.06, w: W, h: 0.06, fill: { color: C.a2 }, line: { width: 0 } });

        // Bloco inferior
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H*0.62, w: W, h: H*0.38, fill: { color: C.bg }, line: { width: 0 } });

        // Faixa de topo dupla
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 0.1, fill: { color: C.bg }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.1, w: W*0.45, h: 0.06, fill: { color: C.a2 }, line: { width: 0 } });

        // Título — massivo, pesado
        const titleSize = (G.id.presTitle || '').length > 30 ? 44 : 56;
        s.addText(G.id.presTitle || 'Apresentação', { x: 0.65, y: 0.28, w: W-1.0, h: 3.6,
            fontSize: titleSize, color: C.bg, fontFace:'Calibri', bold: true, lineSpacingMultiple: 0.82 });

        if (G.id.presSub) s.addText(G.id.presSub, { x: 0.65, y: H*0.62+0.2, w: W*0.7, h: 0.55,
            fontSize: 13, color: C.muted, fontFace:'Calibri Light' });
        if (G.id.instDept) s.addText(G.id.instDept.toUpperCase(), { x: 0.65, y: H*0.62+0.85, w: 6, h: 0.28,
            fontSize: 8, color: C.a1, fontFace:'Calibri', bold: true, charSpacing: 3.5 });

        if (G.id.instName) s.addText(G.id.instName, { x: W-5.0, y: H-1.0, w: 4.7, h: 0.3, align:'right',
            fontSize: 11, color: C.txt, fontFace:'Calibri', bold: true });
        if (G.id.presDate) s.addText(G.id.presDate, { x: W-5.0, y: H-0.7, w: 4.7, h: 0.25, align:'right',
            fontSize: 9, color: C.muted, fontFace:'Calibri Light' });

        if (G.mode !== 'single') {
            G.projects.forEach((p, i) => {
                const y = 0.8 + i*0.4;
                s.addShape(pres.shapes.RECTANGLE, { x: W-4.2, y, w: 0.08, h: 0.28, fill: { color: p.color||C.bg }, line: { width: 0 } });
                s.addText(p.name || 'Projeto', { x: W-4.0, y, w: 3.7, h: 0.28, fontSize: 11, color: C.bg, fontFace:'Calibri', bold: true });
            });
        }

        if (G.id.logoInst) s.addImage({ data: G.id.logoInst, x: W-3.2, y: 0.15, w: 1.4, h: 0.65, sizing: { type:'contain', w: 1.4, h: 0.65 } });
        if (G.id.logoProg) s.addImage({ data: G.id.logoProg, x: W-1.7, y: 0.15, w: 1.4, h: 0.65, sizing: { type:'contain', w: 1.4, h: 0.65 } });
        return 1;
    }

    gerarDivisor(pres, projeto, G, C, index) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });

        // Bloco lateral maciço de cor
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W*0.4, h: H, fill: { color: projeto.color||C.a1 }, line: { width: 0 } });

        // Corte diagonal duro na borda do bloco
        for (let i = 0; i < 8; i++) {
            const t = i / 7;
            const step = H / 8;
            const xOff = t * W * 0.12;
            s.addShape(pres.shapes.RECTANGLE, { x: W*0.4 + xOff, y: i*step, w: W*0.6 - xOff, h: step + 0.02,
                fill: { color: C.bg }, line: { width: 0 } });
        }

        // Linha de corte nítida na borda
        s.addShape(pres.shapes.RECTANGLE, { x: W*0.4, y: 0, w: 0.08, h: H, fill: { color: C.a2 }, line: { width: 0 } });

        // Número oversize
        s.addText(String(index+1).padStart(2,'0'), { x: -1.5, y: H*0.05, w: W*0.48, h: H*0.9,
            fontSize: 200, color: C.bg, fontFace:'Calibri', bold: true, transparency: 75, align:'right' });

        const eyebrow = G.mode === 'single' ? 'PROJETO' : `PROJETO ${String(index+1).padStart(2,'0')}`;
        s.addText(eyebrow, { x: W*0.44, y: 1.6, w: W*0.54, h: 0.3,
            fontSize: 9, color: C.a2, fontFace:'Calibri', bold: true, charSpacing: 4 });
        s.addText(projeto.name || 'Projeto', { x: W*0.44, y: 1.95, w: W*0.54, h: 2.8,
            fontSize: 48, color: C.txt, fontFace:'Calibri', bold: true, lineSpacingMultiple: 0.86 });
        s.addShape(pres.shapes.RECTANGLE, { x: W*0.44, y: 4.88, w: 3.5, h: 0.07, fill: { color: C.a2 }, line: { width: 0 } });

        if (projeto.leader) s.addText(projeto.leader, { x: W*0.44, y: 5.06, w: W*0.52, h: 0.3, fontSize: 12, color: C.muted, fontFace:'Calibri Light' });
        const dt = [];
        if (projeto.periodo_inicio) dt.push(ModeloBase.parseDate(projeto.periodo_inicio).toLocaleDateString('pt-BR',{month:'short',year:'numeric'}));
        if (projeto.periodo_fim)    dt.push(ModeloBase.parseDate(projeto.periodo_fim).toLocaleDateString('pt-BR',{month:'short',year:'numeric'}));
        if (dt.length) s.addText(dt.join(' → '), { x: W*0.44, y: 5.44, w: W*0.52, h: 0.28, fontSize: 9, color: projeto.color||C.a1, fontFace:'Calibri', bold: true });

        const bc = projeto.status === 'Concluído' ? (C.teal||C.a2) : C.gold;
        s.addShape(pres.shapes.RECTANGLE, { x: W*0.44, y: 0.4, w: 2.0, h: 0.46, fill: { color: bc }, line: { width: 0 } });
        s.addText(projeto.status, { x: W*0.44, y: 0.42, w: 2.0, h: 0.42, align:'center', fontSize: 11, color: C.bg, fontFace:'Calibri', bold: true });
        return 1;
    }

    _adicionarTag(s, pres, texto, x, y, C) {
        const w = texto.length * 0.09 + 0.3;
        s.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.26, fill: { color: C.a1 }, line: { width: 0 } });
        s.addText(texto, { x: x+0.1, y: y+0.04, w: w-0.12, h: 0.18, fontSize: 7, color: C.bg||'000000', fontFace:'Calibri', bold: true, charSpacing: 1.5 });
    }

    _adicionarRodape(s, pres, G, C, projetoNome) {
        const { W, H } = ModeloBase;
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H-0.42, w: W, h: 0.42, fill: { color: C.bg2 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H-0.42, w: W, h: 0.06, fill: { color: C.a1 }, line: { width: 0 } });
        if (G.id.instName) s.addText(G.id.instName, { x: 0.3, y: H-0.32, w: 5, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light' });
        if (projetoNome)   s.addText(projetoNome,   { x: W/2-2, y: H-0.32, w: 4, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light', align:'center' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: W-3.3, y: H-0.32, w: 3, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light', align:'right' });
    }
}
