// js/models/bauhaus.js ───────────────────────────────────────────────────────
// Modelo BAUHAUS — geometria pura como linguagem.
// Círculo gigante (ELLIPSE) domina 55% do slide como zona de cor.
// Título na interseção círculo/fundo — metade numa cor, metade noutra.
// Inspiração: Escola Bauhaus, Josef Albers, identidades visuais geométricas.
// Regra de ouro: UMA forma dominante + tipografia extrema + ausência de ruído.
// ────────────────────────────────────────────────────────────────────────────

class ModeloBauhaus extends ModeloBase {
    constructor() { super('Bauhaus'); }

    // Desenha o círculo principal
    _circulo(s, pres, cx, cy, r, color, t = 0) {
        s.addShape(pres.shapes.ELLIPSE, {
            x: cx - r, y: cy - r, w: r * 2, h: r * 2,
            fill: { color }, line: { width: 0 }, transparency: t
        });
    }

    // ─────────────────────────────────────────────────
    // CAPA
    // ─────────────────────────────────────────────────
    gerarCapa(pres, G, C) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        // Fundo limpo
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });

        // CÍRCULO PRINCIPAL — sangra à direita e embaixo, centro em 60%/45%
        const r = 5.2;
        const cx = W * 0.62;
        const cy = H * 0.42;
        this._circulo(s, pres, cx, cy, r, C.a1);

        // Círculo de acento menor — canto superior esquerdo, cor secundária
        this._circulo(s, pres, -0.6, -0.5, 2.4, C.a2, 28);

        // Círculo fantasma — profundidade
        this._circulo(s, pres, cx - 0.8, cy + 0.6, r * 0.82, C.bg2 || '000000', 88);

        // EYEBROW — sobre o círculo
        if (G.id.instDept) {
            s.addText(G.id.instDept.toUpperCase(), {
                x: W * 0.35, y: 0.42, w: W * 0.62, h: 0.28,
                fontSize: 8, color: C.bg, fontFace: 'Calibri', bold: true, charSpacing: 5
            });
        }

        // TÍTULO — partido entre o círculo e o fundo
        // A parte esquerda fica no fundo escuro (cor do texto normal)
        // A parte direita fica no círculo (cor invertida)
        // Estratégia: dois text boxes sobrepostos, cada um com sua cor
        const titulo = G.id.presTitle || 'APRESENTAÇÃO';
        const splitX = W * 0.34; // ponto de corte visual

        // Sombra de fundo para legibilidade onde o texto cruza
        s.addShape(pres.shapes.RECTANGLE, {
            x: 0, y: 0.7, w: splitX + 0.3, h: H * 0.55,
            fill: { color: C.bg }, line: { width: 0 }, transparency: 8
        });

        // Texto único com cor de contraste — o fundo garante legibilidade
        s.addText(titulo, {
            x: 0.65, y: 0.75, w: W * 0.72, h: H * 0.52,
            fontSize: 68, color: C.bg, fontFace: 'Calibri', bold: true,
            lineSpacingMultiple: 0.80
        });

        // Texto espelhado na cor do texto normal (camada por baixo)
        s.addText(titulo, {
            x: 0.65, y: 0.75, w: W * 0.72, h: H * 0.52,
            fontSize: 68, color: C.txt, fontFace: 'Calibri', bold: true,
            lineSpacingMultiple: 0.80,
            shadow: { type: 'outer', color: 'FFFFFF', blur: 0, offset: 0, angle: 0, opacity: 0 }
        });

        // SUBTÍTULO — fora do círculo, à esquerda/baixo
        if (G.id.presSub) {
            s.addText(G.id.presSub, {
                x: 0.65, y: H * 0.66, w: W * 0.38, h: 1.1,
                fontSize: 13, color: C.txt, fontFace: 'Calibri Light',
                lineSpacingMultiple: 1.3, transparency: 18
            });
        }

        // Linha divisória — âncora entre subtítulo e info
        s.addShape(pres.shapes.RECTANGLE, {
            x: 0.65, y: H - 1.35, w: 2.8, h: 0.05,
            fill: { color: C.a1 }, line: { width: 0 }
        });

        if (G.id.instName) {
            s.addText(G.id.instName, {
                x: 0.65, y: H - 1.22, w: 5, h: 0.3,
                fontSize: 11, color: C.txt, fontFace: 'Calibri', bold: true
            });
        }
        if (G.id.presDate) {
            s.addText(G.id.presDate, {
                x: 0.65, y: H - 0.88, w: 5, h: 0.25,
                fontSize: 9, color: C.muted, fontFace: 'Calibri Light'
            });
        }

        // PROJETOS — lista flutuando sobre o círculo (texto branco/bg)
        if (G.mode !== 'single') {
            G.projects.forEach((p, i) => {
                const py = H * 0.64 + i * 0.44;
                if (py > H - 0.6) return;
                s.addText(`${String(i + 1).padStart(2, '0')}`, {
                    x: W * 0.62, y: py, w: 0.44, h: 0.3,
                    fontSize: 9, color: C.bg, fontFace: 'Calibri', bold: true
                });
                s.addText(p.name || 'Projeto', {
                    x: W * 0.62 + 0.46, y: py, w: W * 0.34, h: 0.3,
                    fontSize: 9.5, color: C.bg, fontFace: 'Calibri Light'
                });
            });
        }

        // LOGOS — no quadrante superior direito (fora do círculo se possível)
        if (G.id.logoInst) s.addImage({ data: G.id.logoInst, x: W - 2.85, y: 0.32, w: 1.25, h: 0.62, sizing: { type: 'contain', w: 1.25, h: 0.62 } });
        if (G.id.logoProg) s.addImage({ data: G.id.logoProg, x: W - 1.52, y: 0.32, w: 1.25, h: 0.62, sizing: { type: 'contain', w: 1.25, h: 0.62 } });

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

        // CÍRCULO DOMINANTE — centralizado, grande
        const r = 4.1;
        this._circulo(s, pres, W / 2, H / 2, r, pc);

        // Círculo de acento — menor, a2, offset
        this._circulo(s, pres, W * 0.78, H * 0.18, 1.65, C.a2, 18);

        // Círculo fantasma — dentro do principal
        this._circulo(s, pres, W / 2 + 0.5, H / 2 + 0.4, r * 0.72, '000000', 90);

        // NÚMERO FANTASMA — dentro do círculo
        s.addText(String(index + 1).padStart(2, '0'), {
            x: W / 2 - 4.5, y: H / 2 - 3.2, w: 9, h: 6.4,
            fontSize: 290, color: C.bg,
            fontFace: 'Calibri', bold: true, transparency: 87,
            align: 'center', valign: 'middle'
        });

        // EYEBROW
        const label = G.mode === 'single' ? 'PROJETO' : `PROJETO  ${String(index + 1).padStart(2, '0')}`;
        s.addText(label, {
            x: W / 2 - 4.5, y: H / 2 - 1.2, w: 9, h: 0.28,
            fontSize: 8, color: C.bg, fontFace: 'Calibri',
            bold: true, charSpacing: 6, align: 'center'
        });

        // NOME DO PROJETO — centrado no círculo
        s.addText(projeto.name || 'Projeto', {
            x: W / 2 - 4.5, y: H / 2 - 0.88, w: 9, h: 2.4,
            fontSize: 52, color: C.bg, fontFace: 'Calibri',
            bold: true, lineSpacingMultiple: 0.82, align: 'center', valign: 'middle'
        });

        // INFO ABAIXO DO NOME — leader + data
        if (projeto.leader) {
            s.addText(projeto.leader, {
                x: W / 2 - 4.5, y: H / 2 + 1.55, w: 9, h: 0.32,
                fontSize: 12, color: C.bg, fontFace: 'Calibri Light',
                align: 'center', transparency: 22
            });
        }
        const dt = [];
        if (projeto.periodo_inicio) dt.push(new Date(projeto.periodo_inicio).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));
        if (projeto.periodo_fim)    dt.push(new Date(projeto.periodo_fim).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));
        if (dt.length) {
            s.addText(dt.join('  →  '), {
                x: W / 2 - 4.5, y: H / 2 + 1.92, w: 9, h: 0.28,
                fontSize: 9, color: C.bg, fontFace: 'Calibri',
                bold: true, align: 'center', transparency: 38
            });
        }

        // STATUS — retângulo no topo esquerdo (fora do círculo)
        const sColor = projeto.status === 'Concluído' ? (C.teal || C.a2) : C.gold;
        s.addShape(pres.shapes.RECTANGLE, { x: 0.55, y: 0.42, w: 2.2, h: 0.46, fill: { color: sColor }, line: { width: 0 } });
        s.addText(projeto.status, {
            x: 0.55, y: 0.44, w: 2.2, h: 0.42,
            align: 'center', fontSize: 10, color: C.bg,
            fontFace: 'Calibri', bold: true
        });

        return 1;
    }

    _adicionarTag(s, pres, texto, x, y, C) {
        // BAUHAUS: círculo pequeno prefixo + texto limpo
        const r = 0.1;
        s.addShape(pres.shapes.ELLIPSE, {
            x, y: y + 0.03, w: r * 2, h: r * 2,
            fill: { color: C.a1 }, line: { width: 0 }
        });
        const w = texto.length * 0.079 + 0.08;
        s.addText(texto, {
            x: x + r * 2 + 0.08, y, w, h: 0.22,
            fontSize: 7.5, color: C.txt, fontFace: 'Calibri', bold: true, charSpacing: 1.5
        });
    }

    _adicionarRodape(s, pres, G, C, projetoNome) {
        const { W, H } = ModeloBase;
        // BAUHAUS: círculo de cor no canto + linha fina
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H - 0.38, w: W, h: 0.38, fill: { color: C.bg }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H - 0.38, w: W, h: 0.04, fill: { color: C.a1 }, line: { width: 0 }, transparency: 48 });
        s.addShape(pres.shapes.ELLIPSE, { x: W - 0.42, y: H - 0.42, w: 0.48, h: 0.48, fill: { color: C.a1 }, line: { width: 0 } });
        if (G.id.instName) s.addText(G.id.instName, { x: 0.4, y: H - 0.3, w: 5, h: 0.22, fontSize: 7, color: C.muted, fontFace: 'Calibri Light' });
        if (projetoNome)   s.addText(projetoNome,   { x: W / 2 - 2, y: H - 0.3, w: 4, h: 0.22, fontSize: 7, color: C.muted, fontFace: 'Calibri Light', align: 'center' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: W - 3.6, y: H - 0.3, w: 3, h: 0.22, fontSize: 7, color: C.muted, fontFace: 'Calibri Light', align: 'right' });
    }
}
