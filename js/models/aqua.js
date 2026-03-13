// js/models/aqua.js
// Modelo Aqua — camadas líquidas sobrepostas, ondas simuladas, transparência de vidro-água.
// Conceito visual: profundidade oceânica, luz refratada, movimento congelado.

class ModeloAqua extends ModeloBase {
    constructor() { super('Aqua'); }

    // ── Onda simulada: série de retângulos levemente rotacionados ──
    _onda(s, pres, y, w, h, color, tr = 75) {
        const { W } = ModeloBase;
        // Camada de fundo (mais larga, mais transparente)
        s.addShape(pres.shapes.RECTANGLE, { x: -0.5, y: y + 0.12, w: W + 1, h: h * 1.2,
            fill: { color }, line: { width: 0 }, transparency: tr + 12 });
        // Camada principal
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y, w: W, h,
            fill: { color }, line: { width: 0 }, transparency: tr });
        // Crista (linha brilhante no topo da onda)
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y, w: W, h: h * 0.08,
            fill: { color: 'FFFFFF' }, line: { width: 0 }, transparency: 82 });
    }

    // ── Camadas de profundidade (background) ──
    _profundidade(s, pres, C) {
        const { W, H } = ModeloBase;
        // Fundo base
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        // 4 camadas de água em alturas diferentes
        this._onda(s, pres, H * 0.58, W, H * 0.14, C.a1, 78);
        this._onda(s, pres, H * 0.64, W, H * 0.12, C.teal || C.a2, 82);
        this._onda(s, pres, H * 0.72, W, H * 0.14, C.a2, 80);
        this._onda(s, pres, H * 0.82, W, H * 0.22, C.a1, 70);
        // Fundo sólido inferior
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H * 0.9, w: W, h: H * 0.1,
            fill: { color: C.bg2 }, line: { width: 0 } });
    }

    // ── Luz refratada: faixas diagonais de luz vindo de cima ──
    _luzRefratada(s, pres, C) {
        const { W, H } = ModeloBase;
        const angles = [0.08, 0.22, 0.38, 0.52, 0.65];
        angles.forEach((xf, i) => {
            s.addShape(pres.shapes.RECTANGLE, { x: W * xf, y: 0, w: 0.08 + i * 0.02, h: H * 0.7,
                fill: { color: 'FFFFFF' }, line: { width: 0 }, transparency: 95 - i });
        });
    }

    // ── Painel de superfície translúcido (glass water card) ──
    _waterCard(s, pres, x, y, w, h, C, accentColor = null) {
        s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: C.bg2 },
            line: { width: 0 }, transparency: 16 });
        // Borda luz superior (reflexo de superfície)
        s.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.06,
            fill: { color: 'FFFFFF' }, line: { width: 0 }, transparency: 58 });
        // Borda esquerda de acento (cor da água)
        s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.05, h,
            fill: { color: accentColor || C.a1 }, line: { width: 0 }, transparency: 35 });
        // Shimmer interno diagonal
        for (let i = 0; i < 3; i++) {
            s.addShape(pres.shapes.RECTANGLE, { x: x + w * 0.55 + i * 0.22, y, w: 0.1, h,
                fill: { color: 'FFFFFF' }, line: { width: 0 }, transparency: 95 - i * 2 });
        }
    }

    // ─────────────────────────────────────────────────
    // CAPA
    // ─────────────────────────────────────────────────
    gerarCapa(pres, G, C) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        this._profundidade(s, pres, C);
        this._luzRefratada(s, pres, C);

        // Véu de legibilidade sobre a região do texto
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W * 0.62, h: H * 0.6,
            fill: { color: C.bg }, line: { width: 0 }, transparency: 48 });

        // Eyebrow
        if (G.id.instDept) s.addText(G.id.instDept.toUpperCase(), {
            x: 0.65, y: 1.3, w: 7, h: 0.28, fontSize: 7.5, color: C.a2,
            fontFace: 'Calibri Light', charSpacing: 5
        });

        // Título
        s.addText(G.id.presTitle || 'Apresentação', {
            x: 0.65, y: 1.58, w: W * 0.58, h: 3.1,
            fontSize: 46, color: C.txt, fontFace: 'Calibri', bold: true, lineSpacingMultiple: 0.88
        });

        // Linha de acento — 3 segmentos (azul claro, teal, cyan)
        s.addShape(pres.shapes.RECTANGLE, { x: 0.65, y: 4.78, w: 1.4, h: 0.04, fill: { color: C.a1 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 2.08, y: 4.78, w: 0.9, h: 0.04, fill: { color: C.teal || C.a2 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 3.02, y: 4.78, w: 0.45, h: 0.04, fill: { color: C.a2 }, line: { width: 0 } });

        if (G.id.presSub) s.addText(G.id.presSub, {
            x: 0.65, y: 4.95, w: W * 0.58, h: 0.5, fontSize: 12, color: C.muted, fontFace: 'Calibri Light'
        });
        if (G.id.instName) s.addText(G.id.instName, { x: 0.65, y: H - 0.9, w: 5, h: 0.28, fontSize: 10, color: C.txt, fontFace: 'Calibri' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: 0.65, y: H - 0.62, w: 5, h: 0.22, fontSize: 8.5, color: C.muted, fontFace: 'Calibri Light' });

        if (G.mode !== 'single') {
            G.projects.forEach((p, i) => {
                const y = 1.6 + i * 0.42;
                s.addShape(pres.shapes.RECTANGLE, { x: W * 0.65, y, w: 0.05, h: 0.26, fill: { color: p.color || C.a1 }, line: { width: 0 } });
                s.addText(p.name || 'Projeto', { x: W * 0.66, y, w: 4.5, h: 0.28, fontSize: 11, color: C.txt, fontFace: 'Calibri Light' });
            });
        }

        if (G.id.logoInst) s.addImage({ data: G.id.logoInst, x: W * 0.65, y: 0.4, w: 1.9, h: 0.9, sizing: { type: 'contain', w: 1.9, h: 0.9 } });
        if (G.id.logoProg) s.addImage({ data: G.id.logoProg, x: W * 0.65 + 2.0, y: 0.4, w: 1.9, h: 0.9, sizing: { type: 'contain', w: 1.9, h: 0.9 } });
        return 1;
    }

    // ─────────────────────────────────────────────────
    // DIVISOR
    // ─────────────────────────────────────────────────
    gerarDivisor(pres, projeto, G, C, index) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        this._profundidade(s, pres, C);
        this._luzRefratada(s, pres, C);

        // Painel water card esquerdo
        this._waterCard(s, pres, 0, 0, W * 0.6, H, C, projeto.color || C.a1);

        // Número ghost
        s.addText(String(index + 1).padStart(2, '0'), {
            x: 0, y: 0, w: W * 0.58, h: H,
            fontSize: 200, color: projeto.color || C.a1,
            fontFace: 'Calibri', bold: true, transparency: 94, align: 'right', valign: 'bottom'
        });

        const eyebrow = G.mode === 'single' ? 'PROJETO' : `PROJETO ${String(index + 1).padStart(2, '0')}`;
        s.addText(eyebrow, { x: 0.65, y: 1.8, w: 9, h: 0.28, fontSize: 8, color: C.a2, fontFace: 'Calibri Light', charSpacing: 5 });
        s.addText(projeto.name || 'Projeto', {
            x: 0.65, y: 2.08, w: W * 0.55, h: 2.7,
            fontSize: 50, color: C.txt, fontFace: 'Calibri', bold: true, lineSpacingMultiple: 0.88
        });

        // Linha acento tripla
        s.addShape(pres.shapes.RECTANGLE, { x: 0.65, y: 4.88, w: 1.4, h: 0.04, fill: { color: projeto.color || C.a1 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 2.08, y: 4.88, w: 0.9, h: 0.04, fill: { color: C.teal || C.a2 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 3.02, y: 4.88, w: 0.45, h: 0.04, fill: { color: C.a2 }, line: { width: 0 } });

        if (projeto.leader) s.addText(projeto.leader, { x: 0.65, y: 5.05, w: 8, h: 0.3, fontSize: 12, color: C.muted, fontFace: 'Calibri Light' });
        const dt = [];
        if (projeto.periodo_inicio) dt.push(ModeloBase.parseDate(projeto.periodo_inicio).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));
        if (projeto.periodo_fim)    dt.push(ModeloBase.parseDate(projeto.periodo_fim).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));
        if (dt.length) s.addText(dt.join(' → '), { x: 0.65, y: 5.43, w: 8, h: 0.28, fontSize: 9, color: projeto.color || C.a2, fontFace: 'Calibri Light' });

        const bc = projeto.status === 'Concluído' ? (C.teal || C.a2) : C.gold;
        this._waterCard(s, pres, W * 0.63, 0.4, 2.2, 0.44, C, bc);
        s.addText(projeto.status, { x: W * 0.63, y: 0.47, w: 2.2, h: 0.36, align: 'center', fontSize: 9, color: bc, fontFace: 'Calibri Light', bold: true });
        return 1;
    }

    // ── Tag ──
    _adicionarTag(s, pres, texto, x, y, C) {
        const w = texto.length * 0.088 + 0.32;
        this._waterCard(s, pres, x, y, w, 0.26, C, C.a1);
        s.addText(texto, { x: x + 0.1, y: y + 0.05, w: w - 0.12, h: 0.17,
            fontSize: 6.5, color: C.txt, fontFace: 'Calibri', bold: true, charSpacing: 1.5 });
    }

    // ── Rodapé ──
    _adicionarRodape(s, pres, G, C, projetoNome) {
        const { W, H } = ModeloBase;
        this._waterCard(s, pres, 0, H - 0.42, W, 0.42, C);
        // Crista de onda no topo do rodapé
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H - 0.42, w: W, h: 0.03,
            fill: { color: C.a1 }, line: { width: 0 }, transparency: 40 });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H - 0.42, w: W * 0.45, h: 0.03,
            fill: { color: C.teal || C.a2 }, line: { width: 0 }, transparency: 40 });
        if (G.id.instName) s.addText(G.id.instName, { x: 0.3, y: H - 0.34, w: 5, h: 0.22, fontSize: 7, color: C.muted, fontFace: 'Calibri Light' });
        if (projetoNome)   s.addText(projetoNome,   { x: W / 2 - 2, y: H - 0.34, w: 4, h: 0.22, fontSize: 7, color: C.muted, fontFace: 'Calibri Light', align: 'center' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: W - 3.3, y: H - 0.34, w: 3, h: 0.22, fontSize: 7, color: C.muted, fontFace: 'Calibri Light', align: 'right' });
    }
}
