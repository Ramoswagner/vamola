// js/models/noir.js
// Modelo Noir 2026 — burn largo em múltiplas faixas, halos concêntricos, glow queimado.
// Sobrescreve: gerarCapa, gerarDivisor, _adicionarTag, _adicionarRodape

class ModeloNoir extends ModeloBase {
    constructor() { super('Noir'); }

    // Faixa de burn com halos acima e abaixo
    _burn(s, pres, C, yCenter, acento) {
        const { W } = ModeloBase;
        // Halo largo superior
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: yCenter-0.4, w: W, h: 0.4, fill: { color: acento }, line: { width: 0 }, transparency: 92 });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: yCenter-0.18, w: W, h: 0.18, fill: { color: acento }, line: { width: 0 }, transparency: 80 });
        // Faixa principal
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: yCenter, w: W, h: 0.12, fill: { color: acento }, line: { width: 0 } });
        // Halo inferior
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: yCenter+0.12, w: W, h: 0.18, fill: { color: acento }, line: { width: 0 }, transparency: 80 });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: yCenter+0.30, w: W, h: 0.4, fill: { color: acento }, line: { width: 0 }, transparency: 92 });
    }

    gerarCapa(pres, G, C) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        // Fundo noir absoluto
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });

        // Burn principal
        this._burn(s, pres, C, H*0.55, C.a1);
        // Burn secundário (mais tênue)
        this._burn(s, pres, C, H*0.58, C.a2);

        // Reflexo de piso sutil
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H*0.55+0.12, w: W, h: H*0.45, fill: { color: C.a1 }, line: { width: 0 }, transparency: 97 });

        // Eyebrow
        if (G.id.instDept) s.addText(G.id.instDept.toUpperCase(), { x: 0.8, y: 1.2, w: 9, h: 0.28,
            fontSize: 7.5, color: C.muted, fontFace:'Calibri Light', charSpacing: 5 });

        // Título — leve sobre o escuro
        s.addText(G.id.presTitle || 'Apresentação', { x: 0.8, y: 1.5, w: W-1.0, h: 3.4,
            fontSize: 50, color: C.txt, fontFace:'Calibri Light', bold: false, lineSpacingMultiple: 0.88 });

        // Subtítulo abaixo do burn
        if (G.id.presSub) s.addText(G.id.presSub, { x: 0.8, y: H*0.58+0.55, w: W*0.7, h: 0.5,
            fontSize: 12, color: C.muted, fontFace:'Calibri Light' });

        if (G.id.instName) s.addText(G.id.instName, { x: 0.8, y: H-0.9, w: 5, h: 0.28, fontSize: 10, color: C.muted, fontFace:'Calibri Light' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: 0.8, y: H-0.62, w: 5, h: 0.22, fontSize: 8.5, color: C.a1, fontFace:'Calibri Light' });

        if (G.mode !== 'single') {
            G.projects.forEach((p, i) => {
                const y = H*0.58+0.55 + i*0.38;
                s.addShape(pres.shapes.RECTANGLE, { x: W*0.62, y, w: 0.04, h: 0.22, fill: { color: p.color||C.a1 }, line: { width: 0 } });
                s.addText(p.name || 'Projeto', { x: W*0.63, y, w: 4.5, h: 0.25, fontSize: 11, color: C.muted, fontFace:'Calibri Light' });
            });
        }

        if (G.id.logoInst) s.addImage({ data: G.id.logoInst, x: W-3.0, y: 0.4, w: 1.4, h: 0.7, sizing: { type:'contain', w: 1.4, h: 0.7 } });
        if (G.id.logoProg) s.addImage({ data: G.id.logoProg, x: W-1.5, y: 0.4, w: 1.4, h: 0.7, sizing: { type:'contain', w: 1.4, h: 0.7 } });
        return 1;
    }

    gerarDivisor(pres, projeto, G, C, index) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });

        // Burns duplos com cor do projeto
        this._burn(s, pres, C, H*0.52, projeto.color||C.a1);
        this._burn(s, pres, C, H*0.525, C.a2);

        // Número ghost
        s.addText(String(index+1).padStart(2,'0'), { x: 0, y: 0, w: W, h: H,
            fontSize: 250, color: projeto.color||C.a1, fontFace:'Calibri Light', transparency: 95, align:'right', valign:'bottom' });

        const eyebrow = G.mode === 'single' ? 'PROJETO' : `PROJETO ${String(index+1).padStart(2,'0')}`;
        s.addText(eyebrow, { x: 0.8, y: 1.5, w: 9, h: 0.28, fontSize: 7.5, color: C.a2, fontFace:'Calibri Light', charSpacing: 5 });
        s.addText(projeto.name || 'Projeto', { x: 0.8, y: 1.78, w: W-1.2, h: 2.8,
            fontSize: 52, color: C.txt, fontFace:'Calibri Light', bold: false, lineSpacingMultiple: 0.88 });

        // Linha fina de acento
        s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: H*0.52-0.06, w: 4.0, h: 0.025, fill: { color: projeto.color||C.a1 }, line: { width: 0 }, transparency: 40 });

        if (projeto.leader) s.addText(projeto.leader, { x: 0.8, y: H*0.52+0.6, w: 8, h: 0.3, fontSize: 12, color: C.muted, fontFace:'Calibri Light' });
        const dt = [];
        if (projeto.periodo_inicio) dt.push(ModeloBase.parseDate(projeto.periodo_inicio).toLocaleDateString('pt-BR',{month:'short',year:'numeric'}));
        if (projeto.periodo_fim)    dt.push(ModeloBase.parseDate(projeto.periodo_fim).toLocaleDateString('pt-BR',{month:'short',year:'numeric'}));
        if (dt.length) s.addText(dt.join(' → '), { x: 0.8, y: H*0.52+1.0, w: 8, h: 0.28, fontSize: 9, color: projeto.color||C.a1, fontFace:'Calibri Light' });

        const bc = projeto.status === 'Concluído' ? (C.teal||C.a2) : C.gold;
        s.addShape(pres.shapes.RECTANGLE, { x: W-2.4, y: 0.4, w: 2.0, h: 0.35, fill: { color: bc }, line: { width: 0 }, transparency: 84 });
        s.addText(projeto.status, { x: W-2.4, y: 0.41, w: 2.0, h: 0.33, align:'center', fontSize: 9, color: bc, fontFace:'Calibri Light', bold: true });
        return 1;
    }

    _adicionarTag(s, pres, texto, x, y, C) {
        const w = texto.length * 0.088 + 0.28;
        s.addShape(pres.shapes.RECTANGLE, { x, y: y+0.18, w: w, h: 0.02, fill: { color: C.a1 }, line: { width: 0 }, transparency: 40 });
        s.addText(texto, { x, y, w, h: 0.2, fontSize: 6.5, color: C.a1, fontFace:'Calibri Light', bold: true, charSpacing: 2.5 });
    }

    _adicionarRodape(s, pres, G, C, projetoNome) {
        const { W, H } = ModeloBase;
        // Burn de rodapé ultra-tênue
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H-0.45, w: W, h: 0.02, fill: { color: C.a1 }, line: { width: 0 }, transparency: 60 });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H-0.43, w: W, h: 0.43, fill: { color: C.bg2 }, line: { width: 0 }, transparency: 20 });
        if (G.id.instName) s.addText(G.id.instName, { x: 0.3, y: H-0.34, w: 5, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light' });
        if (projetoNome)   s.addText(projetoNome,   { x: W/2-2, y: H-0.34, w: 4, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light', align:'center' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: W-3.3, y: H-0.34, w: 3, h: 0.22, fontSize: 7, color: C.muted, fontFace:'Calibri Light', align:'right' });
    }
}
