// js/models/void.js
// Modelo Void — preto absoluto, 1 acento cirúrgico, tipografia como único peso visual.
// Conceito: silêncio radical. Nenhum ornamento. A palavra é o design.

class ModeloVoid extends ModeloBase {
    constructor() { super('Void'); }

    // ── Ponto cirúrgico (único elemento gráfico permitido) ──
    _ponto(s, pres, x, y, r, C) {
        // Halo externo tênue
        s.addShape(pres.shapes.ELLIPSE, { x: x - r * 1.6 / 2, y: y - r * 1.6 / 2, w: r * 1.6, h: r * 1.6,
            fill: { color: C.a1 }, line: { width: 0 }, transparency: 88 });
        // Ponto principal
        s.addShape(pres.shapes.ELLIPSE, { x: x - r / 2, y: y - r / 2, w: r, h: r,
            fill: { color: C.a1 }, line: { width: 0 } });
    }

    // ── Linha cirúrgica (a única decoração linear permitida) ──
    _linha(s, pres, x, y, w, C, tr = 0) {
        s.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.018,
            fill: { color: C.a1 }, line: { width: 0 }, transparency: tr });
    }

    // ─────────────────────────────────────────────────
    // CAPA
    // ─────────────────────────────────────────────────
    gerarCapa(pres, G, C) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        // Vazio absoluto
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });

        // Único ponto cirúrgico — top-left
        this._ponto(s, pres, 0.7, 0.7, 0.14, C);

        // Linha cirúrgica acima do título
        this._linha(s, pres, 0.7, H * 0.42, W * 0.72, C);

        // Eyebrow mínimo
        if (G.id.instDept) s.addText(G.id.instDept.toUpperCase(), {
            x: 0.7, y: H * 0.42 - 0.36, w: 9, h: 0.28,
            fontSize: 6.5, color: C.muted, fontFace: 'Calibri Light', charSpacing: 5
        });

        // Título — a única razão de existir do slide
        const tSize = (G.id.presTitle || '').length > 35 ? 38 : (G.id.presTitle || '').length > 22 ? 46 : 54;
        s.addText(G.id.presTitle || 'Apresentação', {
            x: 0.7, y: H * 0.44, w: W - 1.1, h: 3.0,
            fontSize: tSize, color: C.txt, fontFace: 'Calibri Light', bold: false, lineSpacingMultiple: 0.92
        });

        // Linha cirúrgica abaixo do título
        this._linha(s, pres, 0.7, H * 0.74, W * 0.45, C, 35);

        // Subtítulo — invisível quase
        if (G.id.presSub) s.addText(G.id.presSub, {
            x: 0.7, y: H * 0.76, w: W * 0.75, h: 0.48,
            fontSize: 11, color: C.muted, fontFace: 'Calibri Light'
        });

        // Org + data — quase invisíveis
        if (G.id.instName) s.addText(G.id.instName, {
            x: W - 5.5, y: H - 0.95, w: 5.2, h: 0.28,
            align: 'right', fontSize: 9, color: C.muted, fontFace: 'Calibri Light'
        });
        if (G.id.presDate) s.addText(G.id.presDate, {
            x: W - 5.5, y: H - 0.65, w: 5.2, h: 0.22,
            align: 'right', fontSize: 8, color: C.a1, fontFace: 'Calibri Light'
        });

        // Lista de projetos — puramente tipográfica
        if (G.mode !== 'single') {
            G.projects.forEach((p, i) => {
                const y = H * 0.44 + i * 0.34;
                s.addText(p.name || 'Projeto', {
                    x: W * 0.72, y, w: W * 0.26, h: 0.3,
                    fontSize: 10, color: C.muted, fontFace: 'Calibri Light', align: 'right'
                });
            });
        }

        if (G.id.logoInst) s.addImage({ data: G.id.logoInst, x: 0.7, y: 0.3, w: 1.6, h: 0.75, sizing: { type: 'contain', w: 1.6, h: 0.75 } });
        if (G.id.logoProg) s.addImage({ data: G.id.logoProg, x: 2.38, y: 0.3, w: 1.6, h: 0.75, sizing: { type: 'contain', w: 1.6, h: 0.75 } });
        return 1;
    }

    // ─────────────────────────────────────────────────
    // DIVISOR
    // ─────────────────────────────────────────────────
    gerarDivisor(pres, projeto, G, C, index) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });

        // Único ponto — cor do projeto
        this._ponto(s, pres, 0.7, H * 0.48, 0.18, { a1: projeto.color || C.a1 });

        // Linha cirúrgica — cor do projeto
        s.addShape(pres.shapes.RECTANGLE, { x: 0.95, y: H * 0.487, w: W - 1.4, h: 0.018,
            fill: { color: projeto.color || C.a1 }, line: { width: 0 }, transparency: 0 });

        // Número fantasma ultra-leve
        s.addText(String(index + 1).padStart(2, '0'), {
            x: 0, y: 0, w: W, h: H,
            fontSize: 280, color: C.txt, fontFace: 'Calibri Light', bold: false,
            transparency: 97, align: 'right', valign: 'bottom'
        });

        // Eyebrow
        const eyebrow = G.mode === 'single' ? 'PROJETO' : `PROJETO ${String(index + 1).padStart(2, '0')}`;
        s.addText(eyebrow, {
            x: 0.7, y: H * 0.48 + 0.08, w: 9, h: 0.28,
            fontSize: 7, color: C.a1, fontFace: 'Calibri Light', charSpacing: 6
        });

        // Nome — o único peso visual real
        const nSize = (projeto.name || '').length > 30 ? 42 : (projeto.name || '').length > 18 ? 50 : 58;
        s.addText(projeto.name || 'Projeto', {
            x: 0.7, y: H * 0.48 + 0.35, w: W - 1.2, h: 2.9,
            fontSize: nSize, color: C.txt, fontFace: 'Calibri Light', bold: false, lineSpacingMultiple: 0.9
        });

        if (projeto.leader) s.addText(projeto.leader, {
            x: 0.7, y: H * 0.48 + 3.42, w: 8, h: 0.3,
            fontSize: 11, color: C.muted, fontFace: 'Calibri Light'
        });
        const dt = [];
        if (projeto.periodo_inicio) dt.push(ModeloBase.parseDate(projeto.periodo_inicio).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));
        if (projeto.periodo_fim)    dt.push(ModeloBase.parseDate(projeto.periodo_fim).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));
        if (dt.length) s.addText(dt.join(' → '), {
            x: 0.7, y: H * 0.48 + 3.78, w: 8, h: 0.28,
            fontSize: 8.5, color: C.a1, fontFace: 'Calibri Light'
        });

        // Status — texto puro, sem badge
        s.addText(projeto.status.toUpperCase(), {
            x: W - 2.8, y: 0.4, w: 2.5, h: 0.28,
            align: 'right', fontSize: 7.5, color: C.a1,
            fontFace: 'Calibri Light', charSpacing: 3
        });
        return 1;
    }

    // ── Tag — texto puro, sem fundo ──
    _adicionarTag(s, pres, texto, x, y, C) {
        s.addText(texto, {
            x, y, w: texto.length * 0.09 + 0.2, h: 0.2,
            fontSize: 6.5, color: C.a1, fontFace: 'Calibri Light', charSpacing: 4
        });
        // Única micro-linha embaixo
        s.addShape(pres.shapes.RECTANGLE, { x, y: y + 0.195, w: 0.28, h: 0.012,
            fill: { color: C.a1 }, line: { width: 0 } });
    }

    // ── Rodapé — linha e texto, nada mais ──
    _adicionarRodape(s, pres, G, C, projetoNome) {
        const { W, H } = ModeloBase;
        this._linha(s, pres, 0.5, H - 0.55, W - 1.0, C, 65);
        if (G.id.instName) s.addText(G.id.instName, { x: 0.5, y: H - 0.46, w: 4, h: 0.22, fontSize: 7, color: C.muted, fontFace: 'Calibri Light' });
        if (projetoNome)   s.addText(projetoNome,   { x: W / 2 - 2, y: H - 0.46, w: 4, h: 0.22, fontSize: 7, color: C.muted, fontFace: 'Calibri Light', align: 'center' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: W - 4.5, y: H - 0.46, w: 4, h: 0.22, fontSize: 7, color: C.a1, fontFace: 'Calibri Light', align: 'right' });
    }
}
