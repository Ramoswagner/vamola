// js/models/lumina.js
// Modelo Lumina Prism 2026 — Glass 2.0, orbes mais densos, borda prism RGB, card de vidro redesenhado.
// Sobrescreve: _desenharFundo, _glassCard, _adicionarTag, _adicionarRodape, gerarCapa, gerarDivisor
// + todos os slides de conteúdo herdados da versão anterior permanecem via super implícito

class ModeloLuminaPrism extends ModeloBase {
    constructor() { super('LuminaPrism'); }

    // ── Fundo 2.0 — 4 orbes com halos duplos ──
    _desenharFundo(s, pres, C) {
        const { W, H } = ModeloBase;
        // Orbe 1 — grande, top-left
        for (let i = 0; i < 5; i++) {
            const r = (9 - i*1.4);
            s.addShape(pres.shapes.ELLIPSE, { x: -2 - i*0.4, y: -2 - i*0.4, w: r, h: r,
                fill: { color: C.a1 }, line: { width: 0 }, transparency: 82 + i*3 });
        }
        // Orbe 2 — bottom-right
        for (let i = 0; i < 5; i++) {
            const r = (8 - i*1.2);
            s.addShape(pres.shapes.ELLIPSE, { x: W-4 + i*0.3, y: H-4 + i*0.3, w: r, h: r,
                fill: { color: C.a2 }, line: { width: 0 }, transparency: 82 + i*3 });
        }
        // Orbe 3 — center right
        for (let i = 0; i < 4; i++) {
            const r = (5 - i*0.9);
            s.addShape(pres.shapes.ELLIPSE, { x: W-1.5 - r/2, y: H*0.4 - r/2, w: r, h: r,
                fill: { color: C.a3||C.a2 }, line: { width: 0 }, transparency: 78 + i*4 });
        }
        // Orbe 4 — bottom-left micro
        s.addShape(pres.shapes.ELLIPSE, { x: 0.5, y: H-2.5, w: 3.5, h: 3.5,
            fill: { color: C.teal||C.a2 }, line: { width: 0 }, transparency: 88 });
    }

    // ── Glass card 2.0 — overlay multi-camada ──
    _glassCard(s, pres, x, y, w, h, C, accentColor = null) {
        // Corpo vidro (mais branco/translúcido)
        s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: C.bg2 }, line: { width: 0 }, transparency: 14 });
        // Borda de luz superior (prism topo)
        s.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.05, fill: { color: 'FFFFFF' }, line: { width: 0 }, transparency: 62 });
        // Borda de luz esquerda
        s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.04, h, fill: { color: accentColor||C.a1 }, line: { width: 0 }, transparency: 45 });
        // Shimmer diagonal interno
        for (let i = 0; i < 4; i++) {
            s.addShape(pres.shapes.RECTANGLE, { x: x + w*0.6 + i*0.18, y, w: 0.08, h,
                fill: { color: 'FFFFFF' }, line: { width: 0 }, transparency: 96 - i });
        }
        // Borda prism (arco-íris RGB — 3 linhas de cor na borda superior)
        s.addShape(pres.shapes.RECTANGLE, { x, y, w: w*0.35, h: 0.03, fill: { color: C.a1 }, line: { width: 0 }, transparency: 30 });
        s.addShape(pres.shapes.RECTANGLE, { x: x+w*0.32, y, w: w*0.35, h: 0.03, fill: { color: C.a2 }, line: { width: 0 }, transparency: 30 });
        s.addShape(pres.shapes.RECTANGLE, { x: x+w*0.64, y, w: w*0.36, h: 0.03, fill: { color: C.a3||C.a2 }, line: { width: 0 }, transparency: 30 });
    }

    // ── Tag glass miniatura ──
    _adicionarTag(s, pres, texto, x, y, C) {
        const w = texto.length * 0.085 + 0.3;
        this._glassCard(s, pres, x, y, w, 0.26, C, C.a1);
        s.addText(texto, { x: x+0.08, y: y+0.05, w: w-0.1, h: 0.17,
            fontSize: 6.5, color: C.txt, fontFace:'Calibri', bold: true, charSpacing: 1.2 });
    }

    // ── Rodapé glass 2.0 ──
    _adicionarRodape(s, pres, G, C, projetoNome) {
        const { W, H } = ModeloBase;
        this._glassCard(s, pres, 0, H-0.44, W, 0.44, C);
        // Prism base na borda inferior
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H-0.04, w: W*0.35, h: 0.04, fill: { color: C.a1 }, line: { width: 0 }, transparency: 20 });
        s.addShape(pres.shapes.RECTANGLE, { x: W*0.33, y: H-0.04, w: W*0.34, h: 0.04, fill: { color: C.a2 }, line: { width: 0 }, transparency: 20 });
        s.addShape(pres.shapes.RECTANGLE, { x: W*0.66, y: H-0.04, w: W*0.34, h: 0.04, fill: { color: C.a3||C.a2 }, line: { width: 0 }, transparency: 20 });
        if (G.id.instName) s.addText(G.id.instName, { x: 0.3, y: H-0.34, w: 5, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light' });
        if (projetoNome)   s.addText(projetoNome,   { x: W/2-2, y: H-0.34, w: 4, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light', align:'center' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: W-3.3, y: H-0.34, w: 3, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light', align:'right' });
    }

    // ─────────────────────────────────────────────────
    // CAPA
    // ─────────────────────────────────────────────────
    gerarCapa(pres, G, C) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        this._desenharFundo(s, pres, C);

        // Painel glass principal — ocupa 60% da largura
        this._glassCard(s, pres, 0, 0, W*0.62, H, C);

        // Eyebrow
        if (G.id.instDept) s.addText(G.id.instDept.toUpperCase(), { x: 0.6, y: 1.3, w: 7, h: 0.28,
            fontSize: 7.5, color: C.muted, fontFace:'Calibri Light', charSpacing: 4 });

        // Título
        s.addText(G.id.presTitle || 'Apresentação', { x: 0.6, y: 1.58, w: W*0.56, h: 3.0,
            fontSize: 46, color: C.txt, fontFace:'Calibri', bold: true, lineSpacingMultiple: 0.88 });

        // Prism line sob título
        s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 4.7, w: 1.0, h: 0.04, fill: { color: C.a1 }, line: { width: 0 }, transparency: 10 });
        s.addShape(pres.shapes.RECTANGLE, { x: 1.62, y: 4.7, w: 0.8, h: 0.04, fill: { color: C.a2 }, line: { width: 0 }, transparency: 10 });
        s.addShape(pres.shapes.RECTANGLE, { x: 2.44, y: 4.7, w: 0.5, h: 0.04, fill: { color: C.a3||C.a2 }, line: { width: 0 }, transparency: 10 });

        if (G.id.presSub) s.addText(G.id.presSub, { x: 0.6, y: 4.88, w: W*0.56, h: 0.5, fontSize: 12, color: C.muted, fontFace:'Calibri Light' });
        if (G.id.instName) s.addText(G.id.instName, { x: 0.6, y: H-0.9, w: 5, h: 0.28, fontSize: 10, color: C.txt, fontFace:'Calibri Light' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: 0.6, y: H-0.62, w: 5, h: 0.22, fontSize: 8.5, color: C.muted, fontFace:'Calibri Light' });

        if (G.mode !== 'single') {
            G.projects.forEach((p, i) => {
                const y = 1.6 + i*0.44;
                this._glassCard(s, pres, W*0.65, y, W*0.32, 0.38, C, p.color||C.a1);
                s.addText(p.name || 'Projeto', { x: W*0.66, y: y+0.08, w: W*0.3, h: 0.24, fontSize: 10, color: C.txt, fontFace:'Calibri Light' });
            });
        }

        if (G.id.logoInst) s.addImage({ data: G.id.logoInst, x: W*0.65, y: 0.4, w: 1.8, h: 0.85, sizing: { type:'contain', w: 1.8, h: 0.85 } });
        if (G.id.logoProg) s.addImage({ data: G.id.logoProg, x: W*0.65+1.9, y: 0.4, w: 1.8, h: 0.85, sizing: { type:'contain', w: 1.8, h: 0.85 } });
        return 1;
    }

    // ─────────────────────────────────────────────────
    // DIVISOR
    // ─────────────────────────────────────────────────
    gerarDivisor(pres, projeto, G, C, index) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        this._desenharFundo(s, pres, C);

        // Painel glass full-height
        this._glassCard(s, pres, 0, 0, W*0.58, H, C, projeto.color||C.a1);

        // Número ghost
        s.addText(String(index+1).padStart(2,'0'), { x: W*0.3, y: 0, w: W*0.28, h: H,
            fontSize: 200, color: projeto.color||C.a1, fontFace:'Calibri', bold: true, transparency: 93, align:'right' });

        const eyebrow = G.mode === 'single' ? 'PROJETO' : `PROJETO ${String(index+1).padStart(2,'0')}`;
        s.addText(eyebrow, { x: 0.6, y: 1.8, w: 8, h: 0.28, fontSize: 8, color: C.muted, fontFace:'Calibri Light', charSpacing: 4 });
        s.addText(projeto.name || 'Projeto', { x: 0.6, y: 2.1, w: W*0.52, h: 2.6,
            fontSize: 50, color: C.txt, fontFace:'Calibri', bold: true, lineSpacingMultiple: 0.88 });

        // Prism line
        s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 4.85, w: 1.2, h: 0.04, fill: { color: projeto.color||C.a1 }, line: { width: 0 }, transparency: 10 });
        s.addShape(pres.shapes.RECTANGLE, { x: 1.84, y: 4.85, w: 0.9, h: 0.04, fill: { color: C.a2 }, line: { width: 0 }, transparency: 10 });
        s.addShape(pres.shapes.RECTANGLE, { x: 2.78, y: 4.85, w: 0.6, h: 0.04, fill: { color: C.a3||C.a2 }, line: { width: 0 }, transparency: 10 });

        if (projeto.leader) s.addText(projeto.leader, { x: 0.6, y: 5.03, w: 7, h: 0.3, fontSize: 12, color: C.muted, fontFace:'Calibri Light' });
        const dt = [];
        if (projeto.periodo_inicio) dt.push(ModeloBase.parseDate(projeto.periodo_inicio).toLocaleDateString('pt-BR',{month:'short',year:'numeric'}));
        if (projeto.periodo_fim)    dt.push(ModeloBase.parseDate(projeto.periodo_fim).toLocaleDateString('pt-BR',{month:'short',year:'numeric'}));
        if (dt.length) s.addText(dt.join(' → '), { x: 0.6, y: 5.41, w: 7, h: 0.28, fontSize: 9, color: projeto.color||C.a2, fontFace:'Calibri Light' });

        const bc = projeto.status === 'Concluído' ? (C.teal||C.a2) : C.gold;
        this._glassCard(s, pres, W*0.62, 0.4, 2.1, 0.42, C, bc);
        s.addText(projeto.status, { x: W*0.62, y: 0.46, w: 2.1, h: 0.34, align:'center', fontSize: 9, color: bc, fontFace:'Calibri Light', bold: true });
        return 1;
    }

    // ── SLIDES DE CONTEÚDO — herdados com glass overlay ──

    gerarObjetivo(pres, projeto, G, C) {
        if (!G.blocks.objetivo?.enabled) return 0;
        const s = pres.addSlide();
        const { W, H } = ModeloBase;
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        this._desenharFundo(s, pres, C);
        this._adicionarTag(s, pres, 'OBJETIVO', 0.35, 0.3, C);
        s.addText('Problema & Oportunidade', { x: 0.35, y: 0.62, w: 9.3, h: 0.55, fontSize: 22, color: C.txt, fontFace:'Calibri', bold: true });
        if (projeto.objetivo) {
            this._glassCard(s, pres, 0.35, 1.4, 9.3, 4.85, C, projeto.color||C.a1);
            s.addText(projeto.objetivo, { x: 0.6, y: 1.62, w: 8.9, h: 4.42, fontSize: 14, color: C.txt, fontFace:'Calibri Light', lineSpacingMultiple: 1.5 });
        }
        this._adicionarRodape(s, pres, G, C, projeto.name);
        return 1;
    }

    gerarEquipe(pres, projeto, G, C) {
        if (!G.blocks.team?.enabled) return 0;
        const s = pres.addSlide();
        const { W, H } = ModeloBase;
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        this._desenharFundo(s, pres, C);
        this._adicionarTag(s, pres, 'EQUIPE', 0.35, 0.3, C);
        s.addText('Quem realizou', { x: 0.35, y: 0.62, w: 9.3, h: 0.55, fontSize: 22, color: C.txt, fontFace:'Calibri', bold: true });
        const team = projeto.team.filter(t => t.nome);
        const cols = Math.min(team.length, 4);
        const bw = cols > 0 ? (9.3 / cols) - 0.15 : 9.3;
        team.slice(0, 4).forEach((t, i) => {
            const x = 0.35 + i*(bw+0.15);
            this._glassCard(s, pres, x, 1.4, bw, 3.9, C, projeto.color||C.a1);
            s.addShape(pres.shapes.ELLIPSE, { x: x+bw/2-0.38, y: 1.65, w: 0.76, h: 0.76, fill: { color: projeto.color||C.a1 }, line: { width: 0 }, transparency: 75 });
            const iniciais = t.nome.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
            s.addText(iniciais, { x: x+bw/2-0.38, y: 1.67, w: 0.76, h: 0.7, align:'center', fontSize: 18, color: projeto.color||C.a1, fontFace:'Calibri', bold: true });
            s.addText(t.nome, { x: x+0.1, y: 2.6, w: bw-0.2, h: 0.5, align:'center', fontSize: 11, color: C.txt, fontFace:'Calibri', bold: true });
            if (t.cargo) s.addText(t.cargo, { x: x+0.1, y: 3.18, w: bw-0.2, h: 0.65, align:'center', fontSize: 9, color: C.muted, fontFace:'Calibri Light', lineSpacingMultiple: 1.3 });
        });
        this._adicionarRodape(s, pres, G, C, projeto.name);
        return 1;
    }

    gerarIndicadores(pres, projeto, G, C) {
        if (!G.blocks.indicadores?.enabled) return 0;
        const s = pres.addSlide();
        const { W, H } = ModeloBase;
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        this._desenharFundo(s, pres, C);
        this._adicionarTag(s, pres, 'INDICADORES', 0.35, 0.3, C);
        s.addText('KPIs do Projeto', { x: 0.35, y: 0.62, w: 9.3, h: 0.55, fontSize: 22, color: C.txt, fontFace:'Calibri', bold: true });
        const inds = projeto.indicadores.filter(i => i.nome);
        const n = Math.min(inds.length, 4);
        const bw = n > 0 ? 9.3/n - 0.15 : 9.3;
        inds.slice(0, n).forEach((ind, i) => {
            const x = 0.35 + i*(bw+0.15);
            this._glassCard(s, pres, x, 1.4, bw, 4.9, C, projeto.color||C.a1);
            s.addText(ind.realizado||'–', { x: x+0.15, y: 1.6, w: bw-0.3, h: 1.2, fontSize: 46, color: C.txt, fontFace:'Calibri', bold: true, lineSpacingMultiple: 0.85 });
            s.addShape(pres.shapes.RECTANGLE, { x: x+0.15, y: 2.88, w: bw-0.3, h: 0.03, fill: { color: C.a1 }, line: { width: 0 }, transparency: 55 });
            if (ind.meta) s.addText(`Meta: ${ind.meta}`, { x: x+0.15, y: 3.0, w: bw-0.3, h: 0.28, fontSize: 9, color: C.muted, fontFace:'Calibri Light' });
            s.addText(ind.nome, { x: x+0.15, y: 3.35, w: bw-0.3, h: 2.7, fontSize: 10.5, color: C.txt, fontFace:'Calibri Light', lineSpacingMultiple: 1.3 });
        });
        this._adicionarRodape(s, pres, G, C, projeto.name);
        return 1;
    }
}
