// js/models/mesh.js
// Modelo Mesh — gradient mesh orgânico, blobs de cor sobrepostos, editorial 2026.
// Conceito visual: AI-generated color fields, pintura expressionista digital, fluidez total.

class ModeloMesh extends ModeloBase {
    constructor() { super('Mesh'); }

    // ── Blob de cor (elipse difusa com múltiplos halos) ──
    _blob(s, pres, cx, cy, rx, ry, color, tr = 60) {
        // 4 camadas de diffusão (halos concêntricos)
        for (let i = 3; i >= 0; i--) {
            const sx = rx * (1 + i * 0.35), sy = ry * (1 + i * 0.35);
            const t  = tr + i * Math.round((98 - tr) / 4);
            s.addShape(pres.shapes.ELLIPSE, { x: cx - sx / 2, y: cy - sy / 2, w: sx, h: sy,
                fill: { color }, line: { width: 0 }, transparency: t });
        }
    }

    // ── Mesh canvas: coloca os blobs conforme perfil ──
    _meshFundo(s, pres, C) {
        const { W, H } = ModeloBase;
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        // Blob 1 — grande, top-left, cor principal
        this._blob(s, pres, W * 0.12, H * 0.22, 5.8, 4.2, C.a1, 58);
        // Blob 2 — middle-right, cor 2
        this._blob(s, pres, W * 0.82, H * 0.55, 5.2, 4.0, C.a2, 60);
        // Blob 3 — bottom-center, teal
        this._blob(s, pres, W * 0.48, H * 0.88, 4.0, 3.2, C.teal || C.a2, 65);
        // Blob 4 — top-right pequeno, acento quente
        this._blob(s, pres, W * 0.9, H * 0.12, 2.8, 2.2, C.gold || C.a3, 72);
        // Blob 5 — bottom-left, a3
        this._blob(s, pres, W * 0.08, H * 0.8, 3.0, 2.5, C.a3 || C.a1, 70);
        // Véu de legibilidade
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H,
            fill: { color: C.bg }, line: { width: 0 }, transparency: 42 });
    }

    // ── Card de leitura (mesh glass) ──
    _meshCard(s, pres, x, y, w, h, C, accentColor = null) {
        s.addShape(pres.shapes.RECTANGLE, { x, y, w, h,
            fill: { color: C.bg2 }, line: { width: 0 }, transparency: 20 });
        // Reflexo de luz topo
        s.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.05,
            fill: { color: 'FFFFFF' }, line: { width: 0 }, transparency: 60 });
        // Borda esquerda colorida
        s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.06, h,
            fill: { color: accentColor || C.a1 }, line: { width: 0 }, transparency: 30 });
        // Shimmer orgânico (blob dentro do card)
        s.addShape(pres.shapes.ELLIPSE, { x: x + w * 0.55, y: y + h * 0.3, w: w * 0.5, h: h * 0.5,
            fill: { color: accentColor || C.a2 }, line: { width: 0 }, transparency: 92 });
    }

    // ─────────────────────────────────────────────────
    // CAPA
    // ─────────────────────────────────────────────────
    gerarCapa(pres, G, C) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        this._meshFundo(s, pres, C);

        // Card de leitura — dois terços esquerdos
        this._meshCard(s, pres, 0, 0, W * 0.63, H, C);

        // Eyebrow
        if (G.id.instDept) s.addText(G.id.instDept.toUpperCase(), {
            x: 0.65, y: 1.3, w: 7, h: 0.28,
            fontSize: 7.5, color: C.a2, fontFace: 'Calibri Light', charSpacing: 5
        });

        // Título — peso moderado, mesh pede equilíbrio
        s.addText(G.id.presTitle || 'Apresentação', {
            x: 0.65, y: 1.58, w: W * 0.57, h: 3.1,
            fontSize: 46, color: C.txt, fontFace: 'Calibri', bold: true, lineSpacingMultiple: 0.88
        });

        // Linha acento — 2 blobs coloridos pequenos + linha
        s.addShape(pres.shapes.ELLIPSE, { x: 0.65, y: 4.78, w: 0.18, h: 0.18, fill: { color: C.a1 }, line: { width: 0 } });
        s.addShape(pres.shapes.ELLIPSE, { x: 0.58, y: 4.72, w: 0.32, h: 0.32, fill: { color: C.a1 }, line: { width: 0 }, transparency: 80 });
        s.addShape(pres.shapes.RECTANGLE, { x: 0.9, y: 4.85, w: 2.8, h: 0.04, fill: { color: C.a2 }, line: { width: 0 }, transparency: 30 });

        if (G.id.presSub) s.addText(G.id.presSub, {
            x: 0.65, y: 5.05, w: W * 0.56, h: 0.5, fontSize: 12, color: C.muted, fontFace: 'Calibri Light'
        });
        if (G.id.instName) s.addText(G.id.instName, { x: 0.65, y: H - 0.9, w: 5, h: 0.28, fontSize: 10, color: C.txt, fontFace: 'Calibri' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: 0.65, y: H - 0.62, w: 5, h: 0.22, fontSize: 8.5, color: C.muted, fontFace: 'Calibri Light' });

        if (G.mode !== 'single') {
            G.projects.forEach((p, i) => {
                const y = 1.6 + i * 0.42;
                s.addShape(pres.shapes.ELLIPSE, { x: W * 0.65, y: y + 0.06, w: 0.14, h: 0.14,
                    fill: { color: p.color || C.a1 }, line: { width: 0 } });
                s.addText(p.name || 'Projeto', { x: W * 0.66, y, w: 4.5, h: 0.28, fontSize: 11, color: C.txt, fontFace: 'Calibri' });
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

        // Mesh com blob principal na cor do projeto
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        this._blob(s, pres, W * 0.75, H * 0.45, 7.0, 5.5, projeto.color || C.a1, 55);
        this._blob(s, pres, W * 0.1,  H * 0.65, 4.5, 3.5, C.a2, 62);
        this._blob(s, pres, W * 0.5,  H * 0.1,  3.5, 2.8, C.teal || C.a2, 68);
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H,
            fill: { color: C.bg }, line: { width: 0 }, transparency: 40 });

        // Card de leitura esquerdo
        this._meshCard(s, pres, 0, 0, W * 0.6, H, C, projeto.color || C.a1);

        // Número ghost
        s.addText(String(index + 1).padStart(2, '0'), {
            x: 0, y: 0, w: W * 0.58, h: H,
            fontSize: 200, color: projeto.color || C.a1,
            fontFace: 'Calibri', bold: true, transparency: 93, align: 'right', valign: 'bottom'
        });

        const eyebrow = G.mode === 'single' ? 'PROJETO' : `PROJETO ${String(index + 1).padStart(2, '0')}`;
        s.addText(eyebrow, { x: 0.65, y: 1.8, w: 9, h: 0.28, fontSize: 8, color: C.a2, fontFace: 'Calibri Light', charSpacing: 5 });
        s.addText(projeto.name || 'Projeto', {
            x: 0.65, y: 2.08, w: W * 0.55, h: 2.7,
            fontSize: 50, color: C.txt, fontFace: 'Calibri', bold: true, lineSpacingMultiple: 0.88
        });

        // Dot + linha
        s.addShape(pres.shapes.ELLIPSE, { x: 0.65, y: 4.86, w: 0.16, h: 0.16, fill: { color: projeto.color || C.a1 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0.88, y: 4.91, w: 3.2, h: 0.04, fill: { color: C.a2 }, line: { width: 0 }, transparency: 30 });

        if (projeto.leader) s.addText(projeto.leader, { x: 0.65, y: 5.12, w: 8, h: 0.3, fontSize: 12, color: C.muted, fontFace: 'Calibri Light' });
        const dt = [];
        if (projeto.periodo_inicio) dt.push(ModeloBase.parseDate(projeto.periodo_inicio).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));
        if (projeto.periodo_fim)    dt.push(ModeloBase.parseDate(projeto.periodo_fim).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));
        if (dt.length) s.addText(dt.join(' → '), { x: 0.65, y: 5.5, w: 8, h: 0.28, fontSize: 9, color: projeto.color || C.a2, fontFace: 'Calibri Light' });

        const bc = projeto.status === 'Concluído' ? (C.teal || C.a2) : C.gold;
        this._meshCard(s, pres, W * 0.63, 0.4, 2.2, 0.44, C, bc);
        s.addText(projeto.status, { x: W * 0.63, y: 0.47, w: 2.2, h: 0.36, align: 'center', fontSize: 9, color: bc, fontFace: 'Calibri Light', bold: true });
        return 1;
    }

    // ── Tag ──
    _adicionarTag(s, pres, texto, x, y, C) {
        const w = texto.length * 0.088 + 0.32;
        s.addShape(pres.shapes.ELLIPSE, { x: x - 0.1, y: y + 0.05, w: 0.16, h: 0.16,
            fill: { color: C.a1 }, line: { width: 0 }, transparency: 65 });
        s.addText(texto, { x: x + 0.1, y, w, h: 0.22,
            fontSize: 7, color: C.a1, fontFace: 'Calibri', bold: true, charSpacing: 2 });
    }

    // ── Rodapé ──
    _adicionarRodape(s, pres, G, C, projetoNome) {
        const { W, H } = ModeloBase;
        this._meshCard(s, pres, 0, H - 0.42, W, 0.42, C);
        s.addShape(pres.shapes.ELLIPSE, { x: W * 0.5, y: H - 0.44, w: 0.16, h: 0.16,
            fill: { color: C.a1 }, line: { width: 0 }, transparency: 50 });
        if (G.id.instName) s.addText(G.id.instName, { x: 0.3, y: H - 0.34, w: 5, h: 0.22, fontSize: 7, color: C.muted, fontFace: 'Calibri Light' });
        if (projetoNome)   s.addText(projetoNome,   { x: W / 2 - 2, y: H - 0.34, w: 4, h: 0.22, fontSize: 7, color: C.muted, fontFace: 'Calibri Light', align: 'center' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: W - 3.3, y: H - 0.34, w: 3, h: 0.22, fontSize: 7, color: C.muted, fontFace: 'Calibri Light', align: 'right' });
    }
}
