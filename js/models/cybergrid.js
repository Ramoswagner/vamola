// js/models/cybergrid.js
// Modelo CyberGrid — fundo tech com grade, glow simulado em camadas, tipografia neon.
// Estética: painel de controle, HUD, data center, cyberpunk corporativo.

class ModeloCyberGrid extends ModeloBase {
    constructor() {
        super('CyberGrid');
    }

    // ── Utilitário: desenha grade de linhas horizontais e verticais ──
    _desenharGrid(s, pres, C) {
        const { W, H } = ModeloBase;
        const stepX = 0.666, stepY = 0.375; // ~20 cols, ~20 rows

        for (let x = 0; x <= W; x += stepX) {
            s.addShape(pres.shapes.RECTANGLE, {
                x, y: 0, w: 0.008, h: H,
                fill: { color: C.a1 }, line: { width: 0 }, transparency: 88
            });
        }
        for (let y = 0; y <= H; y += stepY) {
            s.addShape(pres.shapes.RECTANGLE, {
                x: 0, y, w: W, h: 0.008,
                fill: { color: C.a1 }, line: { width: 0 }, transparency: 88
            });
        }
    }

    // ── Utilitário: glow simulado — camadas concêntricas transparentes ──
    _glow(s, pres, x, y, w, h, color) {
        [92, 82, 70].forEach((t, i) => {
            const pad = (i + 1) * 0.08;
            s.addShape(pres.shapes.RECTANGLE, {
                x: x - pad, y: y - pad, w: w + pad * 2, h: h + pad * 2,
                fill: { color }, line: { width: 0 }, transparency: t
            });
        });
    }

    // ─────────────────────────────────────────────────
    // CAPA
    // ─────────────────────────────────────────────────
    gerarCapa(pres, G, C) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        // Fundo escuro
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });

        // Grade
        this._desenharGrid(s, pres, C);

        // Bloco scan-line horizontal animado — faixa levemente mais clara
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 2.8, w: W, h: 1.9, fill: { color: C.a1 }, line: { width: 0 }, transparency: 94 });

        // Cantos decorativos — brackets estilo HUD
        const corner = (x, y, flipX, flipY) => {
            const sx = flipX ? -1 : 1, sy = flipY ? -1 : 1;
            s.addShape(pres.shapes.RECTANGLE, { x: x, y: y, w: 0.55 * sx, h: 0.04, fill: { color: C.a1 }, line: { width: 0 }, transparency: 30 });
            s.addShape(pres.shapes.RECTANGLE, { x: x, y: y, w: 0.04, h: 0.55 * sy, fill: { color: C.a1 }, line: { width: 0 }, transparency: 30 });
        };
        corner(0.3, 0.3, 1, 1);
        corner(W - 0.3, 0.3, -1, 1);
        corner(0.3, H - 0.3, 1, -1);
        corner(W - 0.3, H - 0.3, -1, -1);

        // Glow no bloco do título
        this._glow(s, pres, 0.55, 1.5, 8.5, 2.5, C.a1);

        // Bloco de título — fill com leve transparência
        s.addShape(pres.shapes.RECTANGLE, { x: 0.55, y: 1.5, w: 8.5, h: 2.5, fill: { color: C.bg2 }, line: { width: 0 }, transparency: 20 });

        // Borda neon no bloco
        s.addShape(pres.shapes.RECTANGLE, { x: 0.55, y: 1.5, w: 8.5, h: 0.04, fill: { color: C.a1 }, line: { width: 0 }, transparency: 20 });
        s.addShape(pres.shapes.RECTANGLE, { x: 0.55, y: 1.5, w: 0.04, h: 2.5, fill: { color: C.a1 }, line: { width: 0 }, transparency: 20 });

        // Label sistema
        s.addText('[ SYS_INIT ]', { x: 0.7, y: 1.6, w: 3, h: 0.22, fontSize: 7, color: C.a2, fontFace: 'Courier New', bold: true, charSpacing: 1.5 });

        // Título
        s.addText(G.id.presTitle || 'APRESENTAÇÃO', {
            x: 0.7, y: 1.9, w: 8, h: 1.85,
            fontSize: 46, color: C.a1, fontFace: 'Courier New', bold: true, lineSpacingMultiple: 0.88
        });

        // Subtítulo
        if (G.id.presSub) {
            s.addText(`> ${G.id.presSub}`, { x: 0.7, y: 4.15, w: 8, h: 0.4, fontSize: 11, color: C.muted, fontFace: 'Courier New' });
        }

        // Departamento
        if (G.id.instDept) {
            s.addText(G.id.instDept.toUpperCase(), { x: 0.7, y: 4.65, w: 6, h: 0.25, fontSize: 8, color: C.a2, fontFace: 'Courier New', charSpacing: 3 });
        }

        // Linha separadora neon
        this._glow(s, pres, 0.55, 5.05, 8.5, 0.04, C.a2);
        s.addShape(pres.shapes.RECTANGLE, { x: 0.55, y: 5.05, w: 8.5, h: 0.04, fill: { color: C.a2 }, line: { width: 0 } });

        // Instituição + data
        if (G.id.instName) {
            s.addText(G.id.instName, { x: 0.7, y: 5.2, w: 5, h: 0.28, fontSize: 9, color: C.muted, fontFace: 'Courier New' });
        }
        if (G.id.presDate) {
            s.addText(G.id.presDate, { x: 0.7, y: 5.52, w: 5, h: 0.22, fontSize: 8, color: C.muted, fontFace: 'Courier New' });
        }

        // Painel lateral direito — lista de projetos
        if (G.mode !== 'single') {
            s.addShape(pres.shapes.RECTANGLE, { x: W - 3.2, y: 1.5, w: 3.0, h: H - 2.5, fill: { color: C.bg2 }, line: { width: 0 }, transparency: 40 });
            s.addShape(pres.shapes.RECTANGLE, { x: W - 3.2, y: 1.5, w: 0.04, h: H - 2.5, fill: { color: C.a1 }, line: { width: 0 }, transparency: 30 });
            s.addText('PROJETOS', { x: W - 3.1, y: 1.62, w: 2.8, h: 0.22, fontSize: 7, color: C.a1, fontFace: 'Courier New', charSpacing: 2 });
            G.projects.forEach((p, i) => {
                const y = 2.0 + i * 0.42;
                s.addText(`${String(i + 1).padStart(2, '0')} ${p.name || 'Projeto'}`, { x: W - 3.1, y, w: 2.8, h: 0.3, fontSize: 10, color: C.txt, fontFace: 'Courier New' });
            });
        }

        // Logos
        if (G.id.logoInst) s.addImage({ data: G.id.logoInst, x: W - 2.8, y: 0.3, w: 1.2, h: 0.6, sizing: { type: 'contain', w: 1.2, h: 0.6 } });
        if (G.id.logoProg) s.addImage({ data: G.id.logoProg, x: W - 1.5, y: 0.3, w: 1.2, h: 0.6, sizing: { type: 'contain', w: 1.2, h: 0.6 } });

        return 1;
    }

    // ─────────────────────────────────────────────────
    // DIVISOR
    // ─────────────────────────────────────────────────
    gerarDivisor(pres, projeto, G, C, index) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        this._desenharGrid(s, pres, C);

        // Faixa horizontal central com glow
        this._glow(s, pres, 0, H * 0.38, W, H * 0.28, projeto.color || C.a1);
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H * 0.38, w: W, h: H * 0.28, fill: { color: C.bg2 }, line: { width: 0 }, transparency: 30 });

        // Bordas neon da faixa
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H * 0.38, w: W, h: 0.05, fill: { color: projeto.color || C.a1 }, line: { width: 0 }, transparency: 20 });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H * 0.66, w: W, h: 0.05, fill: { color: projeto.color || C.a1 }, line: { width: 0 }, transparency: 20 });

        // Número do projeto
        const num = String(index + 1).padStart(2, '0');
        s.addText(num, { x: -0.5, y: -0.8, w: W * 0.6, h: H + 1, fontSize: 260, color: projeto.color || C.a1, fontFace: 'Courier New', bold: true, transparency: 94 });

        // Label
        const titulo = G.mode === 'single' ? '[ PROJETO ]' : `[ PROJETO_${num} ]`;
        s.addText(titulo, { x: 1.0, y: 2.55, w: 9, h: 0.28, fontSize: 9, color: C.a2, fontFace: 'Courier New', bold: true, charSpacing: 3 });

        // Nome
        s.addText(projeto.name || 'Projeto', {
            x: 1.0, y: 2.88, w: 10, h: 1.6,
            fontSize: 44, color: C.txt, fontFace: 'Courier New', bold: true, lineSpacingMultiple: 0.88
        });

        if (projeto.leader) s.addText(`> ${projeto.leader}`, { x: 1.0, y: 4.9, w: 8, h: 0.3, fontSize: 11, color: C.muted, fontFace: 'Courier New' });

        const dt = [];
        if (projeto.periodo_inicio) dt.push(new Date(projeto.periodo_inicio).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));
        if (projeto.periodo_fim)    dt.push(new Date(projeto.periodo_fim).toLocaleDateString('pt-BR',    { month: 'short', year: 'numeric' }));
        if (dt.length) s.addText(dt.join(' >> '), { x: 1.0, y: 5.28, w: 8, h: 0.28, fontSize: 9, color: projeto.color || C.a2, fontFace: 'Courier New' });

        // Status
        this._glow(s, pres, W - 2.2, 0.4, 1.9, 0.42, projeto.status === 'Concluído' ? (C.teal || C.a2) : C.gold);
        s.addShape(pres.shapes.RECTANGLE, { x: W - 2.2, y: 0.4, w: 1.9, h: 0.42, fill: { color: projeto.status === 'Concluído' ? (C.teal || C.a2) : C.gold }, line: { width: 0 }, transparency: 20 });
        s.addText(projeto.status, { x: W - 2.2, y: 0.42, w: 1.9, h: 0.38, align: 'center', fontSize: 9, color: C.bg, fontFace: 'Courier New', bold: true });

        return 1;
    }

    _adicionarTag(s, pres, texto, x, y, C) {
        this._glow(s, pres, x, y, texto.length * 0.075 + 0.3, 0.22, C.a1);
        s.addShape(pres.shapes.RECTANGLE, { x, y, w: texto.length * 0.075 + 0.3, h: 0.22, fill: { color: C.bg2 }, line: { width: 0 }, transparency: 10 });
        s.addShape(pres.shapes.RECTANGLE, { x, y, w: texto.length * 0.075 + 0.3, h: 0.03, fill: { color: C.a1 }, line: { width: 0 } });
        s.addText(`[ ${texto} ]`, { x: x + 0.05, y: y + 0.03, w: texto.length * 0.09 + 0.3, h: 0.18, fontSize: 6.5, color: C.a1, fontFace: 'Courier New', bold: true, charSpacing: 1 });
    }

    _adicionarRodape(s, pres, G, C, projetoNome) {
        const { W, H } = ModeloBase;
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H - 0.38, w: W, h: 0.38, fill: { color: C.bg2 }, line: { width: 0 }, transparency: 20 });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H - 0.38, w: W, h: 0.03, fill: { color: C.a1 }, line: { width: 0 }, transparency: 30 });
        if (G.id.instName) s.addText(G.id.instName, { x: 0.3, y: H - 0.3, w: 5, h: 0.22, fontSize: 7, color: C.muted, fontFace: 'Courier New' });
        if (projetoNome)   s.addText(projetoNome,   { x: W / 2 - 2, y: H - 0.3, w: 4, h: 0.22, fontSize: 7, color: C.muted, fontFace: 'Courier New', align: 'center' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: W - 3.3, y: H - 0.3, w: 3, h: 0.22, fontSize: 7, color: C.muted, fontFace: 'Courier New', align: 'right' });
    }
}
