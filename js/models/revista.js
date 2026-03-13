// js/models/revista.js ───────────────────────────────────────────────────────
// Modelo REVISTA — editorial de revista de alto padrão.
// ESPINHA vertical à esquerda: texto rotacionado 90° ocupa uma coluna estreita.
// Corpo do slide dividido em duas colunas assimétricas: 38% / 62%.
// Título enorme na coluna larga com espaço negativo generoso.
// Inspiração: Wired, Monocle, Fast Company, NYT Magazine.
// Fontes: mix de pesos extremos — Calibri Black para display, Light para corpo.
// ────────────────────────────────────────────────────────────────────────────

class ModeloRevista extends ModeloBase {
    constructor() { super('Revista'); }

    // ESPINHA — texto vertical usando caixa alta e estreita com rotate
    // PptxGenJS: usar rotate dentro de textProps para rotacionar text
    _spine(s, pres, texto, color, bg, x = 0.02) {
        const { H } = ModeloBase;
        s.addShape(pres.shapes.RECTANGLE, { x, y: 0, w: 0.56, h: H, fill: { color: bg }, line: { width: 0 } });
        s.addText(texto.toUpperCase(), {
            x: x - (H / 2) + 0.28, y: H / 2 - 0.28, w: H, h: 0.56,
            fontSize: 10, color, fontFace: 'Calibri', bold: true,
            charSpacing: 4.5, align: 'center',
            rotate: 270
        });
    }

    // ─────────────────────────────────────────────────
    // CAPA
    // ─────────────────────────────────────────────────
    gerarCapa(pres, G, C) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        // FUNDO GERAL
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });

        // ESPINHA — coluna de 0.56in à esquerda
        this._spine(s, pres, G.id.instDept || G.id.instName || 'APRESENTAÇÃO', C.bg, C.a1);

        // COLUNA ESQUERDA (da espinha até 42%) — zona tipográfica
        const colL = 0.76; // início após a espinha
        const colLW = W * 0.42 - 0.76;

        // Número de seção — enorme, fantasma
        s.addText('01', {
            x: colL - 0.25, y: -0.8, w: colLW + 0.5, h: H + 1.2,
            fontSize: 340, color: C.a1,
            fontFace: 'Calibri', bold: true, transparency: 93
        });

        // EYEBROW na coluna esquerda
        s.addShape(pres.shapes.RECTANGLE, {
            x: colL, y: 0.52, w: 1.6, h: 0.06,
            fill: { color: C.a1 }, line: { width: 0 }
        });
        s.addText('APRESENTAÇÃO', {
            x: colL, y: 0.65, w: colLW, h: 0.26,
            fontSize: 7, color: C.a1, fontFace: 'Calibri', bold: true, charSpacing: 3.5
        });

        // TÍTULO — enorme na coluna esquerda, desce até 78%
        s.addText(G.id.presTitle || 'Título', {
            x: colL, y: 1.0, w: colLW, h: H * 0.62,
            fontSize: 54, color: C.txt, fontFace: 'Calibri',
            bold: true, lineSpacingMultiple: 0.80, valign: 'top'
        });

        // Subtítulo sob o título
        if (G.id.presSub) {
            s.addText(G.id.presSub, {
                x: colL, y: H - 1.55, w: colLW, h: 1.0,
                fontSize: 11.5, color: C.muted, fontFace: 'Calibri Light',
                lineSpacingMultiple: 1.3
            });
        }

        // Linha fina de separação entre as duas colunas
        const sep = W * 0.43;
        s.addShape(pres.shapes.RECTANGLE, { x: sep, y: 0.3, w: 0.05, h: H - 0.5, fill: { color: C.a1 }, line: { width: 0 }, transparency: 72 });

        // COLUNA DIREITA — conteúdo editorial
        const colR = sep + 0.38;
        const colRW = W - colR - 0.35;

        // LOGOS no topo direito
        if (G.id.logoInst) s.addImage({ data: G.id.logoInst, x: colR, y: 0.32, w: 1.25, h: 0.62, sizing: { type: 'contain', w: 1.25, h: 0.62 } });
        if (G.id.logoProg) s.addImage({ data: G.id.logoProg, x: colR + 1.35, y: 0.32, w: 1.25, h: 0.62, sizing: { type: 'contain', w: 1.25, h: 0.62 } });

        // Linha abaixo dos logos
        s.addShape(pres.shapes.RECTANGLE, {
            x: colR, y: 1.12, w: colRW, h: 0.05,
            fill: { color: C.a1 }, line: { width: 0 }, transparency: 55
        });

        // INSTITUIÇÃO
        if (G.id.instName) {
            s.addText(G.id.instName, {
                x: colR, y: 1.22, w: colRW, h: 0.3,
                fontSize: 11, color: C.txt, fontFace: 'Calibri', bold: true
            });
        }

        // Data
        if (G.id.presDate) {
            s.addText(G.id.presDate, {
                x: colR, y: 1.58, w: colRW, h: 0.25,
                fontSize: 9, color: C.muted, fontFace: 'Calibri Light'
            });
        }

        // Linha de separação de seção
        s.addShape(pres.shapes.RECTANGLE, {
            x: colR, y: 2.05, w: colRW, h: 0.05,
            fill: { color: C.a1 }, line: { width: 0 }, transparency: 55
        });
        s.addText('PROJETOS', {
            x: colR, y: 2.18, w: colRW, h: 0.22,
            fontSize: 6.5, color: C.a1, fontFace: 'Calibri', bold: true, charSpacing: 4
        });

        // LISTA DE PROJETOS na coluna direita
        if (G.mode !== 'single') {
            G.projects.forEach((p, i) => {
                const py = 2.48 + i * 0.52;
                if (py > H - 0.6) return;
                // Círculo cor
                s.addShape(pres.shapes.ELLIPSE, {
                    x: colR, y: py + 0.05, w: 0.22, h: 0.22,
                    fill: { color: p.color || C.a2 }, line: { width: 0 }
                });
                s.addText(p.name || 'Projeto', {
                    x: colR + 0.32, y: py, w: colRW - 0.35, h: 0.3,
                    fontSize: 10.5, color: C.txt, fontFace: 'Calibri Light'
                });
                s.addShape(pres.shapes.RECTANGLE, {
                    x: colR, y: py + 0.38, w: colRW, h: 0.028,
                    fill: { color: C.a1 }, line: { width: 0 }, transparency: 80
                });
            });
        }

        return 1;
    }

    // ─────────────────────────────────────────────────
    // DIVISOR
    // ─────────────────────────────────────────────────
    gerarDivisor(pres, projeto, G, C, index) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });

        const pc = projeto.color || C.a1;

        // ESPINHA na cor DO PROJETO
        this._spine(s, pres, projeto.name || 'Projeto', C.bg, pc);

        // COLUNA ESQUERDA — informações do projeto
        const colL = 0.76;
        const colLW = W * 0.35;

        // Eyebrow
        const label = G.mode === 'single' ? 'PROJETO' : `PROJETO  ${String(index + 1).padStart(2, '0')}`;
        s.addShape(pres.shapes.RECTANGLE, {
            x: colL, y: 0.78, w: 1.6, h: 0.06,
            fill: { color: pc }, line: { width: 0 }
        });
        s.addText(label, {
            x: colL, y: 0.9, w: colLW, h: 0.26,
            fontSize: 7.5, color: pc, fontFace: 'Calibri', bold: true, charSpacing: 3.5
        });

        // NOME DO PROJETO
        s.addText(projeto.name || 'Projeto', {
            x: colL, y: 1.22, w: colLW, h: H * 0.50,
            fontSize: 46, color: C.txt, fontFace: 'Calibri',
            bold: true, lineSpacingMultiple: 0.82
        });

        // Leader e data
        if (projeto.leader) {
            s.addText(projeto.leader, {
                x: colL, y: H - 1.5, w: colLW, h: 0.32,
                fontSize: 12, color: C.muted, fontFace: 'Calibri Light'
            });
        }
        const dt = [];
        if (projeto.periodo_inicio) dt.push(ModeloBase.parseDate(projeto.periodo_inicio).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));
        if (projeto.periodo_fim)    dt.push(ModeloBase.parseDate(projeto.periodo_fim).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));
        if (dt.length) {
            s.addText(dt.join('  →  '), {
                x: colL, y: H - 1.1, w: colLW, h: 0.28,
                fontSize: 9, color: pc, fontFace: 'Calibri', bold: true
            });
        }

        // SEPARADOR VERTICAL
        const sep = W * 0.43;
        s.addShape(pres.shapes.RECTANGLE, {
            x: sep, y: 0.3, w: 0.05, h: H - 0.5,
            fill: { color: pc }, line: { width: 0 }, transparency: 55
        });

        // COLUNA DIREITA — número gigante como grafismo editorial
        const colR = sep + 0.38;
        const colRW = W - colR - 0.35;

        s.addText(String(index + 1).padStart(2, '0'), {
            x: colR - 0.6, y: -0.5, w: colRW + 1.2, h: H + 0.8,
            fontSize: 320, color: pc,
            fontFace: 'Calibri', bold: true, transparency: 88,
            align: 'center', valign: 'middle'
        });

        // STATUS
        const sColor = projeto.status === 'Concluído' ? (C.teal || C.a2) : C.gold;
        s.addShape(pres.shapes.RECTANGLE, {
            x: colR, y: H - 1.05, w: 2.2, h: 0.48,
            fill: { color: sColor }, line: { width: 0 }
        });
        s.addText(projeto.status, {
            x: colR, y: H - 1.03, w: 2.2, h: 0.44,
            align: 'center', fontSize: 10, color: C.bg,
            fontFace: 'Calibri', bold: true
        });

        return 1;
    }

    _adicionarTag(s, pres, texto, x, y, C) {
        // REVISTA: tag editorial — texto maiúsculo com linha fina no topo
        const w = texto.length * 0.076 + 0.2;
        s.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.04, fill: { color: C.a1 }, line: { width: 0 } });
        s.addText(texto.toUpperCase(), {
            x, y: y + 0.06, w: w + 0.15, h: 0.19,
            fontSize: 7.5, color: C.txt, fontFace: 'Calibri', bold: true, charSpacing: 2.5
        });
    }

    _adicionarRodape(s, pres, G, C, projetoNome) {
        const { W, H } = ModeloBase;
        // REVISTA: espinha refletida no rodapé — bloco estreito + linha
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H - 0.08, w: W, h: 0.08, fill: { color: C.a1 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H - 0.38, w: W, h: 0.3, fill: { color: C.bg }, line: { width: 0 } });
        if (G.id.instName) s.addText(G.id.instName, { x: 0.8, y: H - 0.31, w: 5, h: 0.22, fontSize: 7, color: C.muted, fontFace: 'Calibri Light' });
        if (projetoNome)   s.addText(projetoNome,   { x: W / 2 - 2, y: H - 0.31, w: 4, h: 0.22, fontSize: 7, color: C.muted, fontFace: 'Calibri Light', align: 'center' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: W - 3.3, y: H - 0.31, w: 3, h: 0.22, fontSize: 7, color: C.muted, fontFace: 'Calibri Light', align: 'right' });
    }
}
