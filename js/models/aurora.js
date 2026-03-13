// js/models/aurora.js
// Modelo Aurora — gradientes simulados em camadas, atmosfera etérea,
// tipografia leve sobre névoa de cor. Estética: premium, orgânico, arte conceitual.

class ModeloAurora extends ModeloBase {
    constructor() {
        super('Aurora');
    }

    // ── Utilitário: gradiente horizontal simulado com N fatias ──
    _gradH(s, pres, x, y, w, h, colorA, colorB, steps = 18) {
        for (let i = 0; i < steps; i++) {
            const t = i / (steps - 1);
            // Interpola transparência: colorA opaco na esquerda, colorB opaco na direita
            const tA = Math.round(t * 100);
            const tB = Math.round((1 - t) * 100);
            const fw = w / steps + 0.02; // leve overlap para não ter lacunas
            s.addShape(pres.shapes.RECTANGLE, {
                x: x + i * (w / steps), y, w: fw, h,
                fill: { color: colorA }, line: { width: 0 }, transparency: tA
            });
            s.addShape(pres.shapes.RECTANGLE, {
                x: x + i * (w / steps), y, w: fw, h,
                fill: { color: colorB }, line: { width: 0 }, transparency: tB
            });
        }
    }

    // ── Utilitário: orbe de luz — círculo difuso simulado ──
    _orbe(s, pres, cx, cy, r, color) {
        const layers = 6;
        for (let i = 0; i < layers; i++) {
            const t = 70 + Math.round((i / (layers - 1)) * 28);
            const rr = r * (1 - i / layers);
            s.addShape(pres.shapes.RECTANGLE, {
                x: cx - rr / 2, y: cy - rr / 2 * 0.6, w: rr, h: rr * 0.6,
                fill: { color }, line: { width: 0 }, transparency: t
            });
        }
    }

    // ─────────────────────────────────────────────────
    // CAPA
    // ─────────────────────────────────────────────────
    gerarCapa(pres, G, C) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        // Fundo base
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });

        // Orbes de luz — névoa de cor atmosférica
        this._orbe(s, pres, W * 0.15, H * 0.35, 6.5, C.a1);
        this._orbe(s, pres, W * 0.72, H * 0.6,  5.8, C.a2);
        this._orbe(s, pres, W * 0.45, H * 0.1,  4.0, C.teal || C.a3);

        // Véu escuro suave sobre tudo — garante legibilidade
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg }, line: { width: 0 }, transparency: 55 });

        // Gradiente horizontal da esquerda — mergulho de cor
        this._gradH(s, pres, 0, 0, W * 0.65, H, C.a1, C.bg, 20);

        // Linha luminosa fina diagonal — elemento de luz
        s.addShape(pres.shapes.RECTANGLE, { x: -1, y: H * 0.48, w: W * 0.65, h: 0.03, fill: { color: C.a2 }, line: { width: 0 }, transparency: 45 });
        s.addShape(pres.shapes.RECTANGLE, { x: -1, y: H * 0.49, w: W * 0.65, h: 0.01, fill: { color: C.a3 || C.a2 }, line: { width: 0 }, transparency: 20 });

        // Eyebrow
        if (G.id.instDept) {
            s.addText(G.id.instDept.toUpperCase(), {
                x: 0.8, y: 1.5, w: 7, h: 0.28,
                fontSize: 7.5, color: C.a2, fontFace: 'Calibri Light', charSpacing: 5
            });
        }

        // Título — peso leve, enorme, quase etéreo
        s.addText(G.id.presTitle || 'Apresentação', {
            x: 0.8, y: 1.85, w: W * 0.68, h: 2.8,
            fontSize: 50, color: C.txt, fontFace: 'Calibri Light', bold: false, lineSpacingMultiple: 0.88
        });

        // Linha fina sob o título
        s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.75, w: 3.5, h: 0.03, fill: { color: C.a1 }, line: { width: 0 }, transparency: 30 });

        // Subtítulo
        if (G.id.presSub) {
            s.addText(G.id.presSub, { x: 0.8, y: 4.9, w: W * 0.58, h: 0.45, fontSize: 12, color: C.muted, fontFace: 'Calibri Light' });
        }

        // Instituição + data
        if (G.id.instName) s.addText(G.id.instName, { x: 0.8, y: H - 0.95, w: 5, h: 0.28, fontSize: 9, color: C.muted, fontFace: 'Calibri Light' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: 0.8, y: H - 0.64, w: 5, h: 0.22, fontSize: 8, color: C.muted, fontFace: 'Calibri Light' });

        // Lista de projetos — flutuando na área direita
        if (G.mode !== 'single') {
            G.projects.forEach((p, i) => {
                const y = 2.2 + i * 0.45;
                // Marcador de cor difuso
                this._orbe(s, pres, W * 0.76, y + 0.1, 0.4, p.color || C.a1);
                s.addText(p.name || 'Projeto', { x: W * 0.73, y, w: W * 0.26, h: 0.3, fontSize: 10, color: C.txt, fontFace: 'Calibri Light' });
            });
        }

        // Logos
        if (G.id.logoInst) s.addImage({ data: G.id.logoInst, x: W - 2.8, y: 0.4, w: 1.2, h: 0.6, sizing: { type: 'contain', w: 1.2, h: 0.6 } });
        if (G.id.logoProg) s.addImage({ data: G.id.logoProg, x: W - 1.5, y: 0.4, w: 1.2, h: 0.6, sizing: { type: 'contain', w: 1.2, h: 0.6 } });

        return 1;
    }

    // ─────────────────────────────────────────────────
    // DIVISOR
    // ─────────────────────────────────────────────────
    gerarDivisor(pres, projeto, G, C, index) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });

        // Grande orbe centrado na cor do projeto
        this._orbe(s, pres, W * 0.5, H * 0.5, 10, projeto.color || C.a1);
        this._orbe(s, pres, W * 0.15, H * 0.8, 5,  C.a2);

        // Véu de legibilidade
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg }, line: { width: 0 }, transparency: 60 });

        // Número fantasma
        s.addText(String(index + 1).padStart(2, '0'), {
            x: -1, y: -1.2, w: W * 0.8, h: H + 2,
            fontSize: 280, color: projeto.color || C.a1,
            fontFace: 'Calibri Light', bold: false, transparency: 91
        });

        // Linha de luz
        s.addShape(pres.shapes.RECTANGLE, { x: 1.2, y: H * 0.465, w: W - 2.4, h: 0.03, fill: { color: projeto.color || C.a1 }, line: { width: 0 }, transparency: 40 });

        // Label
        const titulo = G.mode === 'single' ? 'PROJETO' : `PROJETO ${String(index + 1).padStart(2, '0')}`;
        s.addText(titulo, { x: 1.2, y: H * 0.28, w: 9, h: 0.28, fontSize: 8, color: C.muted, fontFace: 'Calibri Light', charSpacing: 5 });

        // Nome — leve, grande
        s.addText(projeto.name || 'Projeto', {
            x: 1.2, y: H * 0.32, w: W - 2.4, h: 2.4,
            fontSize: 50, color: C.txt, fontFace: 'Calibri Light', bold: false, lineSpacingMultiple: 0.88
        });

        if (projeto.leader) s.addText(projeto.leader, { x: 1.2, y: H * 0.73, w: 8, h: 0.32, fontSize: 12, color: C.muted, fontFace: 'Calibri Light' });

        const dt = [];
        if (projeto.periodo_inicio) dt.push(ModeloBase.parseDate(projeto.periodo_inicio).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));
        if (projeto.periodo_fim)    dt.push(ModeloBase.parseDate(projeto.periodo_fim).toLocaleDateString('pt-BR',    { month: 'short', year: 'numeric' }));
        if (dt.length) s.addText(dt.join(' → '), { x: 1.2, y: H * 0.73 + 0.38, w: 8, h: 0.28, fontSize: 9, color: projeto.color || C.a2, fontFace: 'Calibri Light' });

        // Status
        s.addText(projeto.status, {
            x: W - 2.5, y: H - 0.7, w: 2.2, h: 0.28,
            fontSize: 8, color: projeto.status === 'Concluído' ? (C.teal || C.a2) : C.gold,
            fontFace: 'Calibri Light', align: 'right', charSpacing: 2
        });

        return 1;
    }

    _adicionarTag(s, pres, texto, x, y, C) {
        // Linha difusa de cor + texto leve
        s.addShape(pres.shapes.RECTANGLE, { x, y: y + 0.19, w: texto.length * 0.072 + 0.2, h: 0.03, fill: { color: C.a1 }, line: { width: 0 }, transparency: 45 });
        s.addShape(pres.shapes.RECTANGLE, { x, y: y + 0.19, w: texto.length * 0.04, h: 0.03, fill: { color: C.a1 }, line: { width: 0 }, transparency: 10 });
        s.addText(texto, { x: x + 0.02, y, w: texto.length * 0.09 + 0.3, h: 0.2, fontSize: 6.5, color: C.muted, fontFace: 'Calibri Light', charSpacing: 3 });
    }

    _adicionarRodape(s, pres, G, C, projetoNome) {
        const { W, H } = ModeloBase;
        // Linha de luz suave no rodapé
        s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: H - 0.42, w: W - 0.8, h: 0.02, fill: { color: C.a1 }, line: { width: 0 }, transparency: 55 });
        if (G.id.instName) s.addText(G.id.instName, { x: 0.4, y: H - 0.36, w: 5, h: 0.22, fontSize: 7, color: C.muted, fontFace: 'Calibri Light' });
        if (projetoNome)   s.addText(projetoNome,   { x: W / 2 - 2, y: H - 0.36, w: 4, h: 0.22, fontSize: 7, color: C.muted, fontFace: 'Calibri Light', align: 'center' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: W - 3.3, y: H - 0.36, w: 3, h: 0.22, fontSize: 7, color: C.muted, fontFace: 'Calibri Light', align: 'right' });
    }
}
