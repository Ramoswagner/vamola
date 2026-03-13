// js/models/brutal.js
// Modelo Brutal — design brutalista: blocos brutos, assimetria intencional,
// tipografia pesada fora da grade, colisão de elementos.
// Estética: editorial agressivo, fanzine premium, manifesto visual.

class ModeloBrutal extends ModeloBase {
    constructor() {
        super('Brutal');
    }

    // ─────────────────────────────────────────────────
    // CAPA — colisão de blocos, título rasgando o layout
    // ─────────────────────────────────────────────────
    gerarCapa(pres, G, C) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        // Fundo base
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });

        // Bloco de cor sólida — ocupa quase tudo, saindo da tela
        s.addShape(pres.shapes.RECTANGLE, { x: -0.2, y: -0.2, w: W * 0.68, h: H + 0.4, fill: { color: C.a1 }, line: { width: 0 } });

        // Bloco preto sobreposto cortando em diagonal simulada
        s.addShape(pres.shapes.RECTANGLE, { x: W * 0.55, y: -0.2, w: W * 0.2, h: H + 0.4, fill: { color: C.bg2 }, line: { width: 0 } });

        // Bloco de acento — pequeno, deslocado
        s.addShape(pres.shapes.RECTANGLE, { x: W * 0.7, y: H * 0.6, w: W * 0.32, h: H * 0.42, fill: { color: C.a2 }, line: { width: 0 } });

        // Número gigante sangrado — elemento tipográfico
        s.addText('W', {
            x: -0.8, y: -1.5, w: 8, h: H + 2,
            fontSize: 280, color: C.bg2, fontFace: 'Calibri', bold: true, transparency: 85
        });

        // Eyebrow — cor invertida (sobre o bloco de cor)
        if (G.id.instDept) {
            s.addText(G.id.instDept.toUpperCase(), {
                x: 0.5, y: 0.55, w: 6, h: 0.28,
                fontSize: 8, color: C.bg, fontFace: 'Calibri', bold: true, charSpacing: 4, transparency: 30
            });
        }

        // Título — enorme, sobre o bloco de cor
        s.addText(G.id.presTitle || 'APRESENTAÇÃO', {
            x: 0.5, y: 0.9, w: W * 0.7, h: 3.6,
            fontSize: 58, color: C.bg, fontFace: 'Calibri', bold: true, lineSpacingMultiple: 0.82
        });

        // Subtítulo — sobre a área escura, cor normal
        if (G.id.presSub) {
            s.addText(G.id.presSub, {
                x: W * 0.76, y: H * 0.62, w: W * 0.28, h: 0.8,
                fontSize: 11, color: C.bg, fontFace: 'Calibri Light', lineSpacingMultiple: 1.2
            });
        }

        // Instituição — embaixo do bloco de cor
        if (G.id.instName) {
            s.addText(G.id.instName, { x: 0.5, y: H - 1.1, w: 5, h: 0.3, fontSize: 11, color: C.bg, fontFace: 'Calibri', bold: true });
        }
        if (G.id.presDate) {
            s.addText(G.id.presDate, { x: 0.5, y: H - 0.72, w: 5, h: 0.25, fontSize: 9, color: C.bg, fontFace: 'Calibri Light', transparency: 30 });
        }

        // Lista de projetos — no bloco de acento
        if (G.mode !== 'single') {
            G.projects.forEach((p, i) => {
                const y = H * 0.62 + i * 0.38;
                s.addText(`${String(i + 1).padStart(2, '0')}  ${p.name || 'Projeto'}`, {
                    x: W * 0.76, y, w: W * 0.28, h: 0.3,
                    fontSize: 9, color: C.bg, fontFace: 'Calibri', bold: true
                });
            });
        }

        // Logos
        if (G.id.logoInst) s.addImage({ data: G.id.logoInst, x: W - 2.6, y: 0.35, w: 1.1, h: 0.55, sizing: { type: 'contain', w: 1.1, h: 0.55 } });
        if (G.id.logoProg) s.addImage({ data: G.id.logoProg, x: W - 1.4, y: 0.35, w: 1.1, h: 0.55, sizing: { type: 'contain', w: 1.1, h: 0.55 } });

        return 1;
    }

    // ─────────────────────────────────────────────────
    // DIVISOR — bloco de cor total, título invertido
    // ─────────────────────────────────────────────────
    gerarDivisor(pres, projeto, G, C, index) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        // Fundo = cor do projeto
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: projeto.color || C.a1 } });

        // Bloco escuro assimétrico — canto inferior direito
        s.addShape(pres.shapes.RECTANGLE, { x: W * 0.42, y: H * 0.55, w: W * 0.62, h: H * 0.5, fill: { color: C.bg }, line: { width: 0 } });

        // Número — tipografia enorme sangrada à esquerda
        s.addText(String(index + 1).padStart(2, '0'), {
            x: -0.6, y: -0.8, w: W * 0.7, h: H + 1,
            fontSize: 280, color: C.bg, fontFace: 'Calibri', bold: true, transparency: 88
        });

        // Eyebrow
        const titulo = G.mode === 'single' ? 'PROJETO' : `PROJETO ${String(index + 1).padStart(2, '0')}`;
        s.addText(titulo, { x: 0.7, y: 1.6, w: 9, h: 0.3, fontSize: 9, color: C.bg, fontFace: 'Calibri', bold: true, charSpacing: 5, transparency: 40 });

        // Nome — invertido (escuro sobre cor)
        s.addText(projeto.name || 'Projeto', {
            x: 0.7, y: 1.95, w: W * 0.55, h: 2.6,
            fontSize: 52, color: C.bg, fontFace: 'Calibri', bold: true, lineSpacingMultiple: 0.85
        });

        // Líder + período — no bloco escuro (cor normal)
        if (projeto.leader) {
            s.addText(projeto.leader, { x: W * 0.44, y: H * 0.6, w: W * 0.55, h: 0.35, fontSize: 13, color: C.txt, fontFace: 'Calibri Light' });
        }

        const dt = [];
        if (projeto.periodo_inicio) dt.push(ModeloBase.parseDate(projeto.periodo_inicio).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));
        if (projeto.periodo_fim)    dt.push(ModeloBase.parseDate(projeto.periodo_fim).toLocaleDateString('pt-BR',    { month: 'short', year: 'numeric' }));
        if (dt.length) {
            s.addText(dt.join(' → '), { x: W * 0.44, y: H * 0.6 + 0.42, w: W * 0.55, h: 0.28, fontSize: 10, color: C.a2, fontFace: 'Calibri', bold: true });
        }

        // Status — bloco pequeno bruto
        const statusColor = projeto.status === 'Concluído' ? (C.teal || C.a2) : C.gold;
        s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: H - 0.85, w: 1.9, h: 0.5, fill: { color: C.bg }, line: { width: 0 } });
        s.addText(projeto.status, { x: 0.7, y: H - 0.83, w: 1.9, h: 0.46, align: 'center', fontSize: 10, color: statusColor, fontFace: 'Calibri', bold: true });

        return 1;
    }

    _adicionarTag(s, pres, texto, x, y, C) {
        // Bloco sólido pesado — sem arredondamento, sem graça
        s.addShape(pres.shapes.RECTANGLE, { x, y, w: texto.length * 0.088 + 0.35, h: 0.26, fill: { color: C.txt }, line: { width: 0 } });
        s.addText(texto, { x: x + 0.08, y: y + 0.04, w: texto.length * 0.09 + 0.25, h: 0.2, fontSize: 7, color: C.bg, fontFace: 'Calibri', bold: true, charSpacing: 1 });
    }

    _adicionarRodape(s, pres, G, C, projetoNome) {
        const { W, H } = ModeloBase;
        // Bloco de rodapé pesado — cor de acento
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H - 0.45, w: W, h: 0.45, fill: { color: C.a1 }, line: { width: 0 } });
        if (G.id.instName) s.addText(G.id.instName, { x: 0.3, y: H - 0.35, w: 5, h: 0.25, fontSize: 8, color: C.bg, fontFace: 'Calibri', bold: true });
        if (projetoNome)   s.addText(projetoNome,   { x: W / 2 - 2, y: H - 0.35, w: 4, h: 0.25, fontSize: 8, color: C.bg, fontFace: 'Calibri', bold: true, align: 'center' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: W - 3.3, y: H - 0.35, w: 3, h: 0.25, fontSize: 8, color: C.bg, fontFace: 'Calibri', bold: true, align: 'right' });
    }
}
