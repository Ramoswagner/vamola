// js/models/eclipse.js ───────────────────────────────────────────────────────
// Modelo ECLIPSE — profundidade visual através de órbitas concêntricas.
// 6 ELLIPSES sobrepostas do maior ao menor criam efeito de halo/portal.
// Título no núcleo — sensação de FOCO total no que importa.
// Divisor: eclipse monocolor, nome do projeto no centro do portal.
// Inspiração: poster de 2001: A Space Odyssey, logos de eventos científicos.
// Filosofia: o círculo é o frame mais poderoso — a plateia olha para o centro.
// ────────────────────────────────────────────────────────────────────────────

class ModeloEclipse extends ModeloBase {
    constructor() { super('Eclipse'); }

    // Sistema de halo — órbitas concêntricas
    _halo(s, pres, cx, cy, rBase, colorInner, colorOuter, N = 6) {
        for (let i = N; i >= 1; i--) {
            const r    = rBase * (0.42 + (i / N) * 0.70);
            // Interpolar transparência: mais externo = mais transparente
            const t    = Math.round(62 + (i / N) * 30);
            // Interpolar entre colorOuter (externo) e colorInner (interno)
            s.addShape(pres.shapes.ELLIPSE, {
                x: cx - r, y: cy - r * 0.72, w: r * 2, h: r * 1.44,
                fill: { color: i <= 2 ? colorInner : colorOuter },
                line: { width: 0 }, transparency: t
            });
        }
        // Núcleo sólido
        const rCore = rBase * 0.32;
        s.addShape(pres.shapes.ELLIPSE, {
            x: cx - rCore, y: cy - rCore * 0.72, w: rCore * 2, h: rCore * 1.44,
            fill: { color: colorInner }, line: { width: 0 }, transparency: 15
        });
    }

    // ─────────────────────────────────────────────────
    // CAPA
    // ─────────────────────────────────────────────────
    gerarCapa(pres, G, C) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        // FUNDO — escuro profundo
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });

        // ECLIPSE PRINCIPAL — centro levemente deslocado para a direita
        const cx = W * 0.595;
        const cy = H * 0.465;
        this._halo(s, pres, cx, cy, 5.2, C.a1, C.a2);

        // ECLIPSE SATÉLITE — menor, canto superior esquerdo
        this._halo(s, pres, W * 0.08, H * 0.15, 1.8, C.a2, C.a1, 4);

        // Faixa vertical de penumbra à esquerda para separar o conteúdo
        s.addShape(pres.shapes.RECTANGLE, {
            x: 0, y: 0, w: W * 0.32, h: H,
            fill: { color: C.bg }, line: { width: 0 }, transparency: 24
        });

        // ── CONTEÚDO À ESQUERDA — zona de leitura, protegida pela penumbra
        if (G.id.instDept) {
            s.addText(G.id.instDept.toUpperCase(), {
                x: 0.62, y: 0.52, w: W * 0.28, h: 0.26,
                fontSize: 7, color: C.a1, fontFace: 'Calibri', bold: true, charSpacing: 5
            });
        }
        // Linha abaixo do eyebrow
        s.addShape(pres.shapes.RECTANGLE, {
            x: 0.62, y: 0.84, w: W * 0.24, h: 0.05,
            fill: { color: C.a1 }, line: { width: 0 }, transparency: 48
        });

        s.addText(G.id.presTitle || 'APRESENTAÇÃO', {
            x: 0.62, y: 1.0, w: W * 0.30, h: H * 0.45,
            fontSize: 46, color: C.txt, fontFace: 'Calibri',
            bold: true, lineSpacingMultiple: 0.83
        });

        if (G.id.presSub) {
            s.addText(G.id.presSub, {
                x: 0.62, y: H * 0.60, w: W * 0.30, h: 1.1,
                fontSize: 12, color: C.muted, fontFace: 'Calibri Light',
                lineSpacingMultiple: 1.3
            });
        }

        if (G.id.instName) {
            s.addText(G.id.instName, {
                x: 0.62, y: H - 1.18, w: W * 0.30, h: 0.3,
                fontSize: 10, color: C.txt, fontFace: 'Calibri', bold: true
            });
        }
        if (G.id.presDate) {
            s.addText(G.id.presDate, {
                x: 0.62, y: H - 0.82, w: W * 0.30, h: 0.24,
                fontSize: 8.5, color: C.muted, fontFace: 'Calibri Light'
            });
        }

        // ── PROJETOS — flutuando no anel do eclipse (zona clara do halo)
        if (G.mode !== 'single') {
            G.projects.forEach((p, i) => {
                // Distribuir ao redor do núcleo usando ângulos
                const angle = -30 + i * 35; // graus
                const rad   = angle * (Math.PI / 180);
                const rx    = 3.8, ry = 2.75;
                const px    = cx + Math.cos(rad) * rx - 1.8;
                const py    = cy + Math.sin(rad) * ry - 0.14;
                if (px < 0 || px > W - 0.5 || py < 0 || py > H - 0.3) return;
                s.addShape(pres.shapes.ELLIPSE, {
                    x: px - 0.08, y: py + 0.04, w: 0.16, h: 0.16,
                    fill: { color: p.color || C.a1 }, line: { width: 0 }
                });
                s.addText(p.name || 'Projeto', {
                    x: px + 0.12, y: py, w: 3.0, h: 0.28,
                    fontSize: 9.5, color: C.txt, fontFace: 'Calibri Light'
                });
            });
        }

        // LOGOS — acima do conteúdo esquerdo
        if (G.id.logoInst) s.addImage({ data: G.id.logoInst, x: 0.58, y: H - 1.58, w: 1.0, h: 0.52, sizing: { type: 'contain', w: 1.0, h: 0.52 } });
        if (G.id.logoProg) s.addImage({ data: G.id.logoProg, x: 1.65, y: H - 1.58, w: 1.0, h: 0.52, sizing: { type: 'contain', w: 1.0, h: 0.52 } });

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

        // ECLIPSE MONOCOLOR — centrado, cor do projeto
        const cx = W / 2;
        const cy = H / 2;
        const rBase = 5.5;

        // Halo da cor do projeto
        this._halo(s, pres, cx, cy, rBase, pc, C.a2);

        // Segundo halo invertido para profundidade
        this._halo(s, pres, cx, cy, rBase * 0.68, C.bg, pc, 4);

        // NÚMERO — muito translúcido, dentro do núcleo
        s.addText(String(index + 1).padStart(2, '0'), {
            x: cx - 4, y: cy - 2.8, w: 8, h: 5.6,
            fontSize: 260, color: pc,
            fontFace: 'Calibri', bold: true, transparency: 88,
            align: 'center', valign: 'middle'
        });

        // EYEBROW no núcleo
        const label = G.mode === 'single' ? 'PROJETO' : `PROJETO  ${String(index + 1).padStart(2, '0')}`;
        s.addText(label, {
            x: cx - 4, y: cy - 1.28, w: 8, h: 0.3,
            fontSize: 8, color: C.bg, fontFace: 'Calibri',
            bold: true, charSpacing: 6, align: 'center'
        });

        // NOME DO PROJETO — no núcleo
        s.addText(projeto.name || 'Projeto', {
            x: cx - 4.5, y: cy - 0.95, w: 9, h: 2.4,
            fontSize: 50, color: C.bg, fontFace: 'Calibri',
            bold: true, lineSpacingMultiple: 0.82,
            align: 'center', valign: 'middle'
        });

        // Linha fina separadora no núcleo
        s.addShape(pres.shapes.RECTANGLE, {
            x: cx - 1.5, y: cy + 1.48, w: 3.0, h: 0.04,
            fill: { color: C.bg }, line: { width: 0 }, transparency: 38
        });

        // Leader + data abaixo da linha no núcleo
        if (projeto.leader) {
            s.addText(projeto.leader, {
                x: cx - 4, y: cy + 1.6, w: 8, h: 0.32,
                fontSize: 11.5, color: C.bg, fontFace: 'Calibri Light',
                align: 'center', transparency: 18
            });
        }
        const dt = [];
        if (projeto.periodo_inicio) dt.push(ModeloBase.parseDate(projeto.periodo_inicio).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));
        if (projeto.periodo_fim)    dt.push(ModeloBase.parseDate(projeto.periodo_fim).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));
        if (dt.length) {
            s.addText(dt.join('  →  '), {
                x: cx - 4, y: cy + 1.98, w: 8, h: 0.28,
                fontSize: 9, color: C.bg, fontFace: 'Calibri',
                bold: true, align: 'center', transparency: 38
            });
        }

        // STATUS — fora do eclipse, canto superior esquerdo
        const sColor = projeto.status === 'Concluído' ? (C.teal || C.a2) : C.gold;
        s.addShape(pres.shapes.ELLIPSE, {
            x: 0.45, y: 0.42, w: 2.2, h: 0.5,
            fill: { color: sColor }, line: { width: 0 }
        });
        s.addText(projeto.status, {
            x: 0.45, y: 0.43, w: 2.2, h: 0.48,
            align: 'center', fontSize: 9.5, color: C.bg,
            fontFace: 'Calibri', bold: true
        });

        return 1;
    }

    _adicionarTag(s, pres, texto, x, y, C) {
        // ECLIPSE: halo miniatura antes do texto
        const r = 0.11;
        s.addShape(pres.shapes.ELLIPSE, { x, y: y + 0.01, w: r * 2.2, h: r * 2, fill: { color: C.a1 }, line: { width: 0 }, transparency: 45 });
        s.addShape(pres.shapes.ELLIPSE, { x: x + 0.04, y: y + 0.05, w: r * 1.2, h: r * 1.0, fill: { color: C.a1 }, line: { width: 0 } });
        const tw = texto.length * 0.077 + 0.1;
        s.addText(texto, {
            x: x + r * 2.4 + 0.06, y, w: tw, h: 0.22,
            fontSize: 7.5, color: C.txt, fontFace: 'Calibri', bold: true, charSpacing: 1.5
        });
    }

    _adicionarRodape(s, pres, G, C, projetoNome) {
        const { W, H } = ModeloBase;
        // ECLIPSE: linha fina com ponto de luz central
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H - 0.36, w: W, h: 0.36, fill: { color: C.bg }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H - 0.36, w: W, h: 0.04, fill: { color: C.a1 }, line: { width: 0 }, transparency: 55 });
        // Ponto de luz no centro da linha
        s.addShape(pres.shapes.ELLIPSE, { x: W / 2 - 0.14, y: H - 0.42, w: 0.28, h: 0.14, fill: { color: C.a1 }, line: { width: 0 }, transparency: 22 });
        if (G.id.instName) s.addText(G.id.instName, { x: 0.4, y: H - 0.29, w: 5, h: 0.22, fontSize: 7, color: C.muted, fontFace: 'Calibri Light' });
        if (projetoNome)   s.addText(projetoNome,   { x: W / 2 - 2, y: H - 0.29, w: 4, h: 0.22, fontSize: 7, color: C.muted, fontFace: 'Calibri Light', align: 'center' });
        if (G.id.presDate) s.addText(G.id.presDate, { x: W - 3.3, y: H - 0.29, w: 3, h: 0.22, fontSize: 7, color: C.muted, fontFace: 'Calibri Light', align: 'right' });
    }
}
