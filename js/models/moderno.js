// js/models/moderno.js
// Modelo Moderno — geometria agressiva, título full-bleed, acento diagonal.
// Sobrescreve: gerarCapa, gerarDivisor, _adicionarTag, _adicionarRodape

class ModeloModerno extends ModeloBase {
    constructor() {
        super('Moderno');
    }

    // ─────────────────────────────────────────────────
    // CAPA — título à direita, bloco de cor cortando diagonal
    // ─────────────────────────────────────────────────
    gerarCapa(pres, G, C) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        // Fundo total
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });

        // Bloco de cor sólida ocupa metade superior
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H * 0.52, fill: { color: C.a1 }, line: { width: 0 } });

        // Faixa escura sobreposta — recorte diagonal simulado
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H * 0.42, w: W, h: H * 0.12, fill: { color: C.bg2 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H * 0.52, w: W, h: H * 0.48, fill: { color: C.bg }, line: { width: 0 } });

        // Linha de acento fina no topo
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 0.06, fill: { color: C.a2 }, line: { width: 0 } });

        // Título — grande, sobre o bloco de cor
        s.addText(G.id.presTitle || 'Apresentação', {
            x: 0.7, y: 0.35, w: W - 3.5, h: 3.2,
            fontSize: 52, color: C.bg, fontFace: 'Calibri', bold: true,
            lineSpacingMultiple: 0.85
        });

        // Subtítulo
        if (G.id.presSub) {
            s.addText(G.id.presSub, {
                x: 0.7, y: 3.6, w: W * 0.65, h: 0.5,
                fontSize: 13, color: C.muted, fontFace: 'Calibri Light'
            });
        }

        // Departamento
        if (G.id.instDept) {
            s.addText(G.id.instDept.toUpperCase(), {
                x: 0.7, y: 4.2, w: 6, h: 0.28,
                fontSize: 8, color: C.a2, fontFace: 'Calibri', bold: true, charSpacing: 3
            });
        }

        // Nome da instituição + data — lado direito inferior
        if (G.id.instName) {
            s.addText(G.id.instName, {
                x: W - 4.5, y: H - 1.1, w: 4.2, h: 0.3,
                fontSize: 11, color: C.txt, fontFace: 'Calibri', bold: true, align: 'right'
            });
        }
        if (G.id.presDate) {
            s.addText(G.id.presDate, {
                x: W - 4.5, y: H - 0.75, w: 4.2, h: 0.25,
                fontSize: 9, color: C.muted, fontFace: 'Calibri Light', align: 'right'
            });
        }

        // Lista de projetos (portfólio/programa) — coluna direita
        if (G.mode !== 'single') {
            G.projects.forEach((p, i) => {
                const y = 1.2 + i * 0.42;
                s.addShape(pres.shapes.RECTANGLE, { x: W - 3.8, y, w: 0.06, h: 0.28, fill: { color: p.color || C.bg }, line: { width: 0 } });
                s.addText(p.name || 'Projeto', { x: W - 3.6, y, w: 3.4, h: 0.28, fontSize: 11, color: C.bg, fontFace: 'Calibri', bold: false });
            });
        }

        // Logos
        if (G.id.logoInst) {
            s.addImage({ data: G.id.logoInst, x: W - 3.2, y: 0.3, w: 1.4, h: 0.7, sizing: { type: 'contain', w: 1.4, h: 0.7 } });
        }
        if (G.id.logoProg) {
            s.addImage({ data: G.id.logoProg, x: W - 1.7, y: 0.3, w: 1.4, h: 0.7, sizing: { type: 'contain', w: 1.4, h: 0.7 } });
        }

        return 1;
    }

    // ─────────────────────────────────────────────────
    // DIVISOR — número gigante como plano de fundo, faixa colorida lateral dupla
    // ─────────────────────────────────────────────────
    gerarDivisor(pres, projeto, G, C, index) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });

        // Faixas laterais duplas
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.18, h: H, fill: { color: projeto.color || C.a1 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0.22, y: 0, w: 0.05, h: H, fill: { color: C.a2 }, line: { width: 0 } });

        // Número gigante como elemento gráfico de fundo
        s.addText(String(index + 1).padStart(2, '0'), {
            x: W * 0.45, y: -0.5, w: W * 0.55, h: H + 0.5,
            fontSize: 220, color: projeto.color || C.a1,
            fontFace: 'Calibri', bold: true, transparency: 92, align: 'right'
        });

        // Eyebrow
        const titulo = G.mode === 'single' ? 'PROJETO' : `PROJETO ${String(index + 1).padStart(2, '0')}`;
        s.addText(titulo, {
            x: 1.0, y: 1.8, w: 9, h: 0.28,
            fontSize: 9, color: C.a2, fontFace: 'Calibri', bold: true, charSpacing: 4
        });

        // Nome do projeto
        s.addText(projeto.name || 'Projeto', {
            x: 1.0, y: 2.15, w: 9.5, h: 2.5,
            fontSize: 50, color: C.txt, fontFace: 'Calibri', bold: true, lineSpacingMultiple: 0.88
        });

        // Linha separadora
        s.addShape(pres.shapes.RECTANGLE, { x: 1.0, y: 4.85, w: 4.5, h: 0.04, fill: { color: projeto.color || C.a1 }, line: { width: 0 } });

        if (projeto.leader) {
            s.addText(projeto.leader, { x: 1.0, y: 5.0, w: 8, h: 0.32, fontSize: 13, color: C.muted, fontFace: 'Calibri Light' });
        }

        const dt = [];
        if (projeto.periodo_inicio) dt.push(new Date(projeto.periodo_inicio).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));
        if (projeto.periodo_fim)    dt.push(new Date(projeto.periodo_fim).toLocaleDateString('pt-BR',    { month: 'short', year: 'numeric' }));
        if (dt.length) {
            s.addText(dt.join(' → '), { x: 1.0, y: 5.38, w: 8, h: 0.3, fontSize: 10, color: projeto.color || C.a2, fontFace: 'Calibri', bold: true });
        }

        // Badge de status — canto inferior direito
        s.addShape(pres.shapes.RECTANGLE, {
            x: W - 2.0, y: H - 0.65, w: 1.7, h: 0.4,
            fill: { color: projeto.status === 'Concluído' ? (C.teal || C.a2) : C.gold }, line: { width: 0 }
        });
        s.addText(projeto.status, {
            x: W - 2.0, y: H - 0.63, w: 1.7, h: 0.35,
            align: 'center', fontSize: 9,
            color: C.bg, fontFace: 'Calibri', bold: true
        });

        return 1;
    }

    // ─────────────────────────────────────────────────
    // TAG — sem fundo, só texto maiúsculo com cor de acento
    // ─────────────────────────────────────────────────
    _adicionarTag(s, pres, texto, x, y, C) {
        s.addText(texto, {
            x, y, w: texto.length * 0.09 + 0.3, h: 0.22,
            fontSize: 7, color: C.a2, fontFace: 'Calibri', bold: true, charSpacing: 2.5
        });
    }

    // ─────────────────────────────────────────────────
    // RODAPÉ — linha fina no lugar do bloco
    // ─────────────────────────────────────────────────
    _adicionarRodape(s, pres, G, C, projetoNome) {
        const { W, H } = ModeloBase;
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H - 0.04, w: W, h: 0.04, fill: { color: C.a1 }, line: { width: 0 } });
        if (G.id.instName) {
            s.addText(G.id.instName, { x: 0.3, y: H - 0.32, w: 5, h: 0.22, fontSize: 7, color: C.muted, fontFace: 'Calibri Light' });
        }
        if (projetoNome) {
            s.addText(projetoNome, { x: W / 2 - 2, y: H - 0.32, w: 4, h: 0.22, fontSize: 7, color: C.muted, fontFace: 'Calibri Light', align: 'center' });
        }
        if (G.id.presDate) {
            s.addText(G.id.presDate, { x: W - 3.3, y: H - 0.32, w: 3, h: 0.22, fontSize: 7, color: C.muted, fontFace: 'Calibri Light', align: 'right' });
        }
    }
}
