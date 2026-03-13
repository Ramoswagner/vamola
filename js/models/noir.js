// js/models/noir.js ─────────────────────────────────────────────────────────
// Modelo NOIR — cinematográfico.
// Fundo preto puro. Uma faixa de cor queima horizontal em 38% do slide.
// Título gigantíssimo em branco sobre o preto. Impacto máximo pelo contraste.
// Inspiração: pôsteres de cinema, capa da TIME Magazine, NYT Magazine.
// Fontes: Calibri Black (bold extremo) + Calibri Light (contraste de peso).
// ────────────────────────────────────────────────────────────────────────────

class ModeloNoir extends ModeloBase {
    constructor() { super('Noir'); }

    // Linha de luz horizontal — assinatura do modelo
    _stripe(s, pres, y, h, C, alpha = 0) {
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y, w: ModeloBase.W, h, fill: { color: C.a1 }, line: { width: 0 }, transparency: alpha });
    }

    // ─────────────────────────────────────────────────
    // CAPA
    // ─────────────────────────────────────────────────
    gerarCapa(pres, G, C) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        // Fundo: preto absoluto
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: '000000' } });

        // Faixa de cor: 5px sangrado à esquerda, altura de H*0.026
        const stripeY = H * 0.395;
        this._stripe(s, pres, stripeY, H * 0.028, C, 0);

        // Segunda faixa mais fina para vibração óptica
        this._stripe(s, pres, stripeY - H * 0.018, H * 0.008, C, 68);

        // TÍTULO — descendo do topo até quase a faixa
        // Peso extra para contrastar com a leveza do subtítulo
        const titulo = (G.id.presTitle || 'APRESENTAÇÃO').toUpperCase();
        s.addText(titulo, {
            x: 0.72, y: 0.55, w: W - 1.1, h: stripeY - 0.7,
            fontSize: 72, color: 'FFFFFF', fontFace: 'Calibri',
            bold: true, lineSpacingMultiple: 0.78, valign: 'bottom'
        });

        // EYEBROW acima do título — espinhela, letra espacejada
        if (G.id.instDept) {
            s.addText(G.id.instDept.toUpperCase(), {
                x: 0.72, y: 0.42, w: 9, h: 0.26,
                fontSize: 7, color: C.a1, fontFace: 'Calibri', bold: true, charSpacing: 6
            });
        }

        // SUBTÍTULO — abaixo da faixa, fonte leve, grande
        if (G.id.presSub) {
            s.addText(G.id.presSub, {
                x: 0.72, y: stripeY + H * 0.055, w: W * 0.58, h: 1.4,
                fontSize: 15, color: 'FFFFFF', fontFace: 'Calibri Light',
                lineSpacingMultiple: 1.35, transparency: 22
            });
        }

        // Separador vertical — linha fina de 1pt na cor
        s.addShape(pres.shapes.RECTANGLE, {
            x: 0.72, y: stripeY + H * 0.06, w: 0.06, h: H - stripeY - 0.68,
            fill: { color: C.a1 }, line: { width: 0 }, transparency: 55
        });

        // INSTITUIÇÃO + DATA — rodapé flutuante
        const infoY = H - 0.72;
        if (G.id.instName) {
            s.addText(G.id.instName, {
                x: 0.96, y: infoY, w: 6, h: 0.3,
                fontSize: 9.5, color: 'FFFFFF', fontFace: 'Calibri Light', transparency: 38
            });
        }
        if (G.id.presDate) {
            s.addText(G.id.presDate, {
                x: 0.96, y: infoY + 0.34, w: 6, h: 0.24,
                fontSize: 8, color: 'FFFFFF', fontFace: 'Calibri Light', transparency: 55
            });
        }

        // PROJETOS — coluna à direita, numerados com a cor
        if (G.mode !== 'single') {
            G.projects.forEach((p, i) => {
                const py = stripeY + H * 0.075 + i * 0.46;
                s.addText(String(i + 1).padStart(2, '0'), {
                    x: W * 0.72, y: py, w: 0.48, h: 0.3,
                    fontSize: 9, color: C.a1, fontFace: 'Calibri', bold: true
                });
                s.addText(p.name || 'Projeto', {
                    x: W * 0.72 + 0.5, y: py, w: W * 0.27, h: 0.3,
                    fontSize: 9, color: 'FFFFFF', fontFace: 'Calibri Light', transparency: 22
                });
            });
        }

        // LOGOS
        if (G.id.logoInst) s.addImage({ data: G.id.logoInst, x: W - 2.85, y: 0.3, w: 1.25, h: 0.62, sizing: { type: 'contain', w: 1.25, h: 0.62 } });
        if (G.id.logoProg) s.addImage({ data: G.id.logoProg, x: W - 1.52, y: 0.3, w: 1.25, h: 0.62, sizing: { type: 'contain', w: 1.25, h: 0.62 } });

        return 1;
    }

    // ─────────────────────────────────────────────────
    // DIVISOR
    // ─────────────────────────────────────────────────
    gerarDivisor(pres, projeto, G, C, index) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: '000000' } });

        // Faixa na cor DO PROJETO (não do tema) — identidade por projeto
        const pc = projeto.color || C.a1;
        const stripeY = H * 0.52;
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: stripeY, w: W, h: H * 0.03, fill: { color: pc }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: stripeY - H * 0.018, w: W, h: H * 0.008, fill: { color: pc }, line: { width: 0 }, transparency: 65 });

        // NÚMERO — sangrado, translúcido, impressionante
        s.addText(String(index + 1).padStart(2, '0'), {
            x: -0.8, y: -1.5, w: W * 0.95, h: H + 2.5,
            fontSize: 380, color: pc,
            fontFace: 'Calibri', bold: true, transparency: 91
        });

        // EYEBROW
        const label = G.mode === 'single' ? 'PROJETO' : `PROJETO  ${String(index + 1).padStart(2, '0')}`;
        s.addText(label, {
            x: 0.75, y: 1.05, w: 9, h: 0.3,
            fontSize: 8, color: pc, fontFace: 'Calibri', bold: true, charSpacing: 7
        });

        // NOME — ocupa zona superior, branco puro
        s.addText((projeto.name || 'Projeto').toUpperCase(), {
            x: 0.75, y: 1.42, w: W - 1.2, h: stripeY - 1.75,
            fontSize: 60, color: 'FFFFFF', fontFace: 'Calibri',
            bold: true, lineSpacingMultiple: 0.80, valign: 'bottom'
        });

        // Zona inferior após a faixa
        if (projeto.leader) {
            s.addText(projeto.leader, {
                x: 0.75, y: stripeY + H * 0.06, w: 9, h: 0.34,
                fontSize: 13, color: 'FFFFFF', fontFace: 'Calibri Light', transparency: 22
            });
        }
        const dt = [];
        if (projeto.periodo_inicio) dt.push(new Date(projeto.periodo_inicio).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));
        if (projeto.periodo_fim)    dt.push(new Date(projeto.periodo_fim).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));
        if (dt.length) {
            s.addText(dt.join('  →  '), {
                x: 0.75, y: stripeY + H * 0.12, w: 9, h: 0.28,
                fontSize: 9, color: pc, fontFace: 'Calibri', bold: true
            });
        }

        // STATUS — à direita, canto após a faixa
        const sColor = projeto.status === 'Concluído' ? (C.teal || C.a2) : C.gold;
        s.addShape(pres.shapes.RECTANGLE, {
            x: W - 2.4, y: stripeY + H * 0.055, w: 2.1, h: 0.42,
            fill: { color: sColor }, line: { width: 0 }
        });
        s.addText(projeto.status, {
            x: W - 2.4, y: stripeY + H * 0.058, w: 2.1, h: 0.36,
            align: 'center', fontSize: 9.5, color: '000000',
            fontFace: 'Calibri', bold: true
        });

        return 1;
    }

    _adicionarTag(s, pres, texto, x, y, C) {
        // NOIR: tag minimalista — linha de cor + texto branco, sem fundo
        const w = texto.length * 0.076 + 0.3;
        s.addShape(pres.shapes.RECTANGLE, { x, y: y + 0.18, w, h: 0.03, fill: { color: C.a1 }, line: { width: 0 } });
        s.addText(texto, {
            x, y, w, h: 0.2,
            fontSize: 7, color: 'FFFFFF', fontFace: 'Calibri', bold: true, charSpacing: 2
        });
    }

    _adicionarRodape(s, pres, G, C, projetoNome) {
        const { W, H } = ModeloBase;
        // Linha fina de cor no rodapé
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H - 0.06, w: W, h: 0.06, fill: { color: C.a1 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H - 0.38, w: W, h: 0.32, fill: { color: '000000' }, line: { width: 0 } });
        if (G.id.instName) s.addText(G.id.instName, { x: 0.5, y: H - 0.32, w: 5, h: 0.22, fontSize: 7, color: 'FFFFFF', fontFace: 'Calibri Light', transparency: 45 });
        if (projetoNome)   s.addText(projetoNome,   { x: W / 2 - 2, y: H - 0.32, w: 4, h: 0.22, fontSize: 7, color: 'FFFFFF', fontFace: 'Calibri Light', align: 'center', transparency: 45 });
        if (G.id.presDate) s.addText(G.id.presDate, { x: W - 3.3, y: H - 0.32, w: 3, h: 0.22, fontSize: 7, color: 'FFFFFF', fontFace: 'Calibri Light', align: 'right', transparency: 45 });
    }
}
