// js/models/lumina.js
// Modelo Lumina Prism — Glassmorphism holográfico, efeito de vidro e refração.
// Cards com transparência elevada, bordas suaves e fundo com manchas de luz.

class ModeloLuminaPrism extends ModeloBase {
    constructor() {
        super('LuminaPrism');
    }

    // ── Fundo com manchas orgânicas (simula refração de luz) ──
    _desenharFundo(s, pres, C) {
        const { W, H } = ModeloBase;
        // Grande mancha principal
        s.addShape(pres.shapes.ELLIPSE, {
            x: -2, y: -2, w: 8, h: 8,
            fill: { color: C.a1 }, line: { width: 0 }, transparency: 88
        });
        s.addShape(pres.shapes.ELLIPSE, {
            x: W - 6, y: H - 5, w: 9, h: 9,
            fill: { color: C.a2 }, line: { width: 0 }, transparency: 88
        });
        // Pequeno ponto de luz no canto superior direito
        s.addShape(pres.shapes.ELLIPSE, {
            x: W - 2, y: 0.5, w: 2.5, h: 2.5,
            fill: { color: C.a3 || C.a2 }, line: { width: 0 }, transparency: 75
        });
    }

    // ── Card de vidro (retângulo com borda clara e transparência) ──
    _glassCard(s, pres, x, y, w, h, C, accentColor = null) {
        // Corpo principal do card (vidro fosco)
        s.addShape(pres.shapes.RECTANGLE, {
            x, y, w, h,
            fill: { color: C.bg2 },
            line: { color: 'FFFFFF', width: 0.5 },
            transparency: 18
        });
        // Brilho no canto superior esquerdo (simula reflexo)
        s.addShape(pres.shapes.RECTANGLE, {
            x, y, w: 0.2, h: h * 0.4,
            fill: { color: accentColor || C.a1 },
            transparency: 58
        });
        // Linha fina de luz na parte superior
        s.addShape(pres.shapes.RECTANGLE, {
            x, y, w, h: 0.04,
            fill: { color: 'FFFFFF' },
            transparency: 78
        });
    }

    // ── Tag estilizada (vidro miniatura) ──
    _adicionarTag(s, pres, texto, x, y, C) {
        const w = texto.length * 0.085 + 0.3;
        this._glassCard(s, pres, x, y, w, 0.24, C, C.a1);
        s.addText(texto, {
            x: x + 0.08, y: y + 0.04, w: w - 0.1, h: 0.16,
            fontSize: 6.5, color: C.txt, fontFace: 'Montserrat',
            bold: true, charSpacing: 1.2
        });
    }

    // ── Rodapé translúcido ──
    _adicionarRodape(s, pres, G, C, projetoNome) {
        const { W, H } = ModeloBase;
        // Faixa de rodapé com vidro
        s.addShape(pres.shapes.RECTANGLE, {
            x: 0, y: H - 0.42, w: W, h: 0.42,
            fill: { color: C.bg2 }, line: { color: 'FFFFFF', width: 0.2 },
            transparency: 25
        });
        if (G.id.instName) {
            s.addText(G.id.instName, {
                x: 0.3, y: H - 0.32, w: 5, h: 0.22,
                fontSize: 7, color: C.muted, fontFace: 'Montserrat Light'
            });
        }
        if (projetoNome) {
            s.addText(projetoNome, {
                x: W / 2 - 2, y: H - 0.32, w: 4, h: 0.22,
                fontSize: 7, color: C.muted, fontFace: 'Montserrat Light',
                align: 'center'
            });
        }
        if (G.id.presDate) {
            s.addText(G.id.presDate, {
                x: W - 3.3, y: H - 0.32, w: 3, h: 0.22,
                fontSize: 7, color: C.muted, fontFace: 'Montserrat Light',
                align: 'right'
            });
        }
    }

    // ─────────────────────────────────────────────────
    // CAPA
    // ─────────────────────────────────────────────────
    gerarCapa(pres, G, C) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        this._desenharFundo(s, pres, C);

        // Card principal do título
        this._glassCard(s, pres, 1.0, 1.4, 8.2, 3.2, C, C.a1);

        // Título
        s.addText(G.id.presTitle || 'VISÃO', {
            x: 1.3, y: 2.0, w: 7.6, h: 1.3,
            fontSize: 52, color: C.txt, fontFace: 'Montserrat',
            bold: true, charSpacing: -0.5
        });

        // Linha de destaque
        s.addShape(pres.shapes.RECTANGLE, {
            x: 1.3, y: 3.5, w: 2.0, h: 0.03,
            fill: { color: C.a1 }, transparency: 30
        });

        // Subtítulo (se houver)
        if (G.id.presSub) {
            s.addText(G.id.presSub, {
                x: 1.3, y: 3.65, w: 7.6, h: 0.5,
                fontSize: 12, color: C.muted, fontFace: 'Montserrat Light'
            });
        }

        // Departamento / Eyebrow
        if (G.id.instDept) {
            s.addText(G.id.instDept.toUpperCase(), {
                x: 1.3, y: 1.15, w: 7, h: 0.26,
                fontSize: 7.5, color: C.a2, fontFace: 'Montserrat',
                bold: true, charSpacing: 3
            });
        }

        // Instituição e data (canto inferior esquerdo)
        if (G.id.instName) {
            s.addText(G.id.instName, {
                x: 1.3, y: H - 0.9, w: 5, h: 0.28,
                fontSize: 10, color: C.txt, fontFace: 'Montserrat'
            });
        }
        if (G.id.presDate) {
            s.addText(G.id.presDate, {
                x: 1.3, y: H - 0.6, w: 5, h: 0.22,
                fontSize: 8, color: C.muted, fontFace: 'Montserrat Light'
            });
        }

        // Lista de projetos (modo portfólio/programa) – cards pequenos
        if (G.mode !== 'single') {
            G.projects.forEach((p, i) => {
                const xCard = W - 4.0;
                const yCard = 1.4 + i * 0.9;
                this._glassCard(s, pres, xCard, yCard, 3.2, 0.75, C, p.color || C.a1);
                s.addText(p.name || 'Projeto', {
                    x: xCard + 0.15, y: yCard + 0.18, w: 2.9, h: 0.4,
                    fontSize: 9, color: C.txt, fontFace: 'Montserrat'
                });
            });
        }

        // Logos
        if (G.id.logoInst) {
            s.addImage({ data: G.id.logoInst, x: W - 2.6, y: 0.35, w: 1.1, h: 0.55, sizing: { type: 'contain' } });
        }
        if (G.id.logoProg) {
            s.addImage({ data: G.id.logoProg, x: W - 1.4, y: 0.35, w: 1.1, h: 0.55, sizing: { type: 'contain' } });
        }

        return 1;
    }

    // ─────────────────────────────────────────────────
    // SUMÁRIO
    // ─────────────────────────────────────────────────
    gerarSumario(pres, G, C) {
        if (G.mode === 'single') return 0;

        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        this._desenharFundo(s, pres, C);

        this._adicionarTag(s, pres, 'SUMÁRIO', 0.55, 0.4, C);

        s.addText('Projetos', {
            x: 0.55, y: 0.65, w: 8, h: 0.6,
            fontSize: 26, color: C.txt, fontFace: 'Montserrat', bold: true
        });

        G.projects.forEach((p, i) => {
            const x = 0.55 + (i % 2) * 5.5;
            const y = 1.5 + Math.floor(i / 2) * 2.0;
            this._glassCard(s, pres, x, y, 5.0, 1.6, C, p.color || C.a1);
            s.addText(String(i + 1).padStart(2, '0'), {
                x: x + 0.15, y: y + 0.2, w: 0.8, h: 0.5,
                fontSize: 22, color: p.color || C.a1, fontFace: 'Montserrat', bold: true
            });
            s.addText(p.name || 'Projeto', {
                x: x + 1.0, y: y + 0.2, w: 3.8, h: 0.5,
                fontSize: 12, color: C.txt, fontFace: 'Montserrat', bold: true
            });
            if (p.leader) {
                s.addText(p.leader, {
                    x: x + 1.0, y: y + 0.8, w: 3.8, h: 0.4,
                    fontSize: 9, color: C.muted, fontFace: 'Montserrat Light'
                });
            }
        });

        this._adicionarRodape(s, pres, G, C, '');
        return 1;
    }

    // ─────────────────────────────────────────────────
    // PANORAMA BI
    // ─────────────────────────────────────────────────
    gerarPanorama(pres, G, C) {
        if (!G.blocks.panorama?.enabled) return 0;

        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        this._desenharFundo(s, pres, C);

        this._adicionarTag(s, pres, 'PANORAMA', 0.55, 0.4, C);
        s.addText('Contexto de Dados', {
            x: 0.55, y: 0.65, w: 8, h: 0.6,
            fontSize: 22, color: C.txt, fontFace: 'Montserrat', bold: true
        });

        // Dois cards para os gráficos
        ['bi2025', 'bi2026'].forEach((key, i) => {
            const x = 0.55 + i * 6.2;
            this._glassCard(s, pres, x, 1.4, 5.8, 5.4, C, C.a1);
            if (G.id[key]) {
                s.addImage({ data: G.id[key], x: x + 0.2, y: 1.6, w: 5.4, h: 5.0, sizing: { type: 'contain' } });
            } else {
                s.addText(`[ ${key === 'bi2025' ? 'Ano Anterior' : 'Ano Atual'} ]`, {
                    x: x, y: 3.9, w: 5.8, h: 0.4,
                    align: 'center', fontSize: 12, color: C.muted, fontFace: 'Montserrat Light'
                });
            }
        });

        this._adicionarRodape(s, pres, G, C, '');
        return 1;
    }

    // ─────────────────────────────────────────────────
    // ENCERRAMENTO
    // ─────────────────────────────────────────────────
    gerarEncerramento(pres, G, C) {
        if (!G.blocks.encerramento?.enabled) return 0;

        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        this._desenharFundo(s, pres, C);

        // Card central
        this._glassCard(s, pres, W / 2 - 3.5, H / 2 - 2.0, 7.0, 4.0, C, C.a2);

        s.addText('Obrigado.', {
            x: W / 2 - 3.5, y: H / 2 - 0.8, w: 7.0, h: 1.8,
            align: 'center', fontSize: 48, color: C.txt,
            fontFace: 'Montserrat', bold: true
        });

        if (G.id.instName) {
            s.addText(G.id.instName, {
                x: W / 2 - 3.5, y: H / 2 + 1.2, w: 7.0, h: 0.35,
                align: 'center', fontSize: 14, color: C.muted, fontFace: 'Montserrat Light'
            });
        }

        this._adicionarRodape(s, pres, G, C, '');
        return 1;
    }

    // ─────────────────────────────────────────────────
    // DIVISOR DE PROJETO
    // ─────────────────────────────────────────────────
    gerarDivisor(pres, projeto, G, C, index) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        this._desenharFundo(s, pres, C);

        const pc = projeto.color || C.a1;

        // Card principal do divisor
        this._glassCard(s, pres, 1.2, 1.2, 9.5, 4.5, C, pc);

        // Número fantasma
        s.addText(String(index + 1).padStart(2, '0'), {
            x: -0.5, y: -0.5, w: 5, h: 5,
            fontSize: 220, color: pc, transparency: 92,
            fontFace: 'Montserrat', bold: true
        });

        // Eyebrow
        const label = G.mode === 'single' ? 'PROJETO' : `PROJETO ${String(index + 1).padStart(2, '0')}`;
        s.addText(label, {
            x: 1.5, y: 1.6, w: 8, h: 0.3,
            fontSize: 9, color: pc, fontFace: 'Montserrat', bold: true, charSpacing: 3
        });

        // Nome do projeto
        s.addText(projeto.name || 'Projeto', {
            x: 1.5, y: 2.0, w: 8.5, h: 2.2,
            fontSize: 48, color: C.txt, fontFace: 'Montserrat', bold: true
        });

        // Linha de destaque
        s.addShape(pres.shapes.RECTANGLE, {
            x: 1.5, y: 4.3, w: 2.5, h: 0.03,
            fill: { color: pc }, transparency: 30
        });

        // Líder e período
        if (projeto.leader) {
            s.addText(projeto.leader, {
                x: 1.5, y: 4.5, w: 8, h: 0.32,
                fontSize: 13, color: C.muted, fontFace: 'Montserrat Light'
            });
        }
        const dt = [];
        if (projeto.periodo_inicio) dt.push(new Date(projeto.periodo_inicio).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));
        if (projeto.periodo_fim)    dt.push(new Date(projeto.periodo_fim).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));
        if (dt.length) {
            s.addText(dt.join(' → '), {
                x: 1.5, y: 4.9, w: 8, h: 0.28,
                fontSize: 10, color: pc, fontFace: 'Montserrat', bold: true
            });
        }

        // Status (badge de vidro)
        const sColor = projeto.status === 'Concluído' ? (C.teal || C.a2) : C.gold;
        this._glassCard(s, pres, W - 2.5, 0.5, 2.0, 0.5, C, sColor);
        s.addText(projeto.status, {
            x: W - 2.5, y: 0.52, w: 2.0, h: 0.46,
            align: 'center', fontSize: 9, color: C.bg,
            fontFace: 'Montserrat', bold: true
        });

        this._adicionarRodape(s, pres, G, C, projeto.name);
        return 1;
    }

    // ─────────────────────────────────────────────────
    // OBJETIVO
    // ─────────────────────────────────────────────────
    gerarObjetivo(pres, projeto, G, C) {
        if (!G.blocks.objetivo?.enabled) return 0;

        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        this._desenharFundo(s, pres, C);

        this._adicionarTag(s, pres, 'OBJETIVO', 0.55, 0.4, C);
        s.addText('Problema & Oportunidade', {
            x: 0.55, y: 0.65, w: 9.3, h: 0.6,
            fontSize: 22, color: C.txt, fontFace: 'Montserrat', bold: true
        });

        this._glassCard(s, pres, 0.55, 1.4, 9.3, 5.0, C, projeto.color || C.a1);
        if (projeto.objetivo) {
            s.addText(projeto.objetivo, {
                x: 0.75, y: 1.65, w: 8.9, h: 4.5,
                fontSize: 14, color: C.txt, fontFace: 'Montserrat Light',
                lineSpacingMultiple: 1.5
            });
        }

        this._adicionarRodape(s, pres, G, C, projeto.name);
        return 1;
    }

    // ─────────────────────────────────────────────────
    // EQUIPE
    // ─────────────────────────────────────────────────
    gerarEquipe(pres, projeto, G, C) {
        if (!G.blocks.team?.enabled) return 0;

        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        this._desenharFundo(s, pres, C);

        this._adicionarTag(s, pres, 'EQUIPE', 0.55, 0.4, C);
        s.addText('Quem realizou', {
            x: 0.55, y: 0.65, w: 9.3, h: 0.6,
            fontSize: 22, color: C.txt, fontFace: 'Montserrat', bold: true
        });

        const membros = projeto.team.filter(t => t.nome).slice(0, 4);
        const cols = membros.length;
        const cardW = 9.3 / cols - 0.2;

        membros.forEach((m, i) => {
            const x = 0.55 + i * (cardW + 0.2);
            this._glassCard(s, pres, x, 1.4, cardW, 5.0, C, projeto.color || C.a1);
            // Iniciais (círculo simulado)
            s.addShape(pres.shapes.ELLIPSE, {
                x: x + cardW / 2 - 0.3, y: 1.7, w: 0.6, h: 0.6,
                fill: { color: projeto.color || C.a1 }, transparency: 75
            });
            const iniciais = m.nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
            s.addText(iniciais, {
                x: x + cardW / 2 - 0.3, y: 1.72, w: 0.6, h: 0.55,
                align: 'center', fontSize: 16, color: projeto.color || C.a1,
                fontFace: 'Montserrat', bold: true
            });
            s.addText(m.nome, {
                x: x + 0.15, y: 2.5, w: cardW - 0.3, h: 0.6,
                align: 'center', fontSize: 11, color: C.txt, fontFace: 'Montserrat', bold: true
            });
            s.addText(m.cargo, {
                x: x + 0.15, y: 3.2, w: cardW - 0.3, h: 2.6,
                align: 'center', fontSize: 9, color: C.muted,
                fontFace: 'Montserrat Light', lineSpacingMultiple: 1.3
            });
        });

        this._adicionarRodape(s, pres, G, C, projeto.name);
        return 1;
    }

    // ─────────────────────────────────────────────────
    // ETAPAS
    // ─────────────────────────────────────────────────
    gerarEtapas(pres, projeto, G, C) {
        if (!G.blocks.etapas?.enabled) return 0;

        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        this._desenharFundo(s, pres, C);

        this._adicionarTag(s, pres, 'ETAPAS', 0.55, 0.4, C);
        s.addText('Jornada de Execução', {
            x: 0.55, y: 0.65, w: 9.3, h: 0.6,
            fontSize: 22, color: C.txt, fontFace: 'Montserrat', bold: true
        });

        const etapas = projeto.etapas.filter(e => e.titulo).slice(0, 5);
        const n = etapas.length;
        const cardW = 9.3 / n - 0.15;

        etapas.forEach((e, i) => {
            const x = 0.55 + i * (cardW + 0.15);
            this._glassCard(s, pres, x, 1.4, cardW, 5.0, C, projeto.color || C.a1);
            s.addText(String(i + 1), {
                x: x + 0.15, y: 1.6, w: 0.5, h: 0.5,
                fontSize: 24, color: projeto.color || C.a1,
                fontFace: 'Montserrat', bold: true, transparency: 40
            });
            s.addText(e.titulo, {
                x: x + 0.15, y: 2.2, w: cardW - 0.3, h: 0.6,
                fontSize: 11, color: C.txt, fontFace: 'Montserrat', bold: true
            });
            if (e.descricao) {
                s.addText(e.descricao, {
                    x: x + 0.15, y: 2.9, w: cardW - 0.3, h: 3.2,
                    fontSize: 9, color: C.muted, fontFace: 'Montserrat Light',
                    lineSpacingMultiple: 1.3
                });
            }
        });

        this._adicionarRodape(s, pres, G, C, projeto.name);
        return 1;
    }

    // ─────────────────────────────────────────────────
    // MARCOS (TIMELINE)
    // ─────────────────────────────────────────────────
    gerarMarcos(pres, projeto, G, C) {
        if (!G.blocks.marcos?.enabled) return 0;

        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        this._desenharFundo(s, pres, C);

        this._adicionarTag(s, pres, 'MARCOS', 0.55, 0.4, C);
        s.addText('Timeline do Projeto', {
            x: 0.55, y: 0.65, w: 9.3, h: 0.6,
            fontSize: 22, color: C.txt, fontFace: 'Montserrat', bold: true
        });

        const marcos = projeto.marcos.filter(m => m.entrega).slice(0, 6);
        // Linha do tempo
        s.addShape(pres.shapes.RECTANGLE, {
            x: 0.7, y: 3.0, w: 9.0, h: 0.03,
            fill: { color: C.a1 }, transparency: 50
        });

        marcos.forEach((m, i) => {
            const x = 0.7 + i * (9.0 / (marcos.length - 1 || 1));
            // Pino
            s.addShape(pres.shapes.RECTANGLE, {
                x: x - 0.05, y: 2.95, w: 0.1, h: 0.15,
                fill: { color: projeto.color || C.a1 }
            });
            // Card do marco
            this._glassCard(s, pres, x - 1.5, i % 2 === 0 ? 1.6 : 3.5, 3.0, 1.3, C, projeto.color || C.a1);
            if (m.data) {
                const dataStr = new Date(m.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
                s.addText(dataStr, {
                    x: x - 1.4, y: i % 2 === 0 ? 1.7 : 3.6, w: 2.8, h: 0.25,
                    fontSize: 8, color: C.a2, fontFace: 'Montserrat', bold: true
                });
            }
            s.addText(m.entrega, {
                x: x - 1.4, y: i % 2 === 0 ? 2.0 : 3.9, w: 2.8, h: 0.6,
                fontSize: 9, color: C.txt, fontFace: 'Montserrat Light',
                lineSpacingMultiple: 1.2
            });
        });

        this._adicionarRodape(s, pres, G, C, projeto.name);
        return 1;
    }

    // ─────────────────────────────────────────────────
    // INDICADORES KPI
    // ─────────────────────────────────────────────────
    gerarIndicadores(pres, projeto, G, C) {
        if (!G.blocks.indicadores?.enabled) return 0;

        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        this._desenharFundo(s, pres, C);

        this._adicionarTag(s, pres, 'INDICADORES', 0.55, 0.4, C);
        s.addText('KPIs do Projeto', {
            x: 0.55, y: 0.65, w: 9.3, h: 0.6,
            fontSize: 22, color: C.txt, fontFace: 'Montserrat', bold: true
        });

        const inds = projeto.indicadores.filter(i => i.nome).slice(0, 4);
        const n = inds.length;
        const cardW = 9.3 / n - 0.15;

        inds.forEach((ind, i) => {
            const x = 0.55 + i * (cardW + 0.15);
            this._glassCard(s, pres, x, 1.4, cardW, 5.0, C, projeto.color || C.a1);
            s.addText(ind.realizado || '–', {
                x: x + 0.15, y: 1.7, w: cardW - 0.3, h: 1.2,
                fontSize: 46, color: C.txt, fontFace: 'Montserrat', bold: true
            });
            if (ind.meta) {
                s.addText(`Meta: ${ind.meta}`, {
                    x: x + 0.15, y: 3.0, w: cardW - 0.3, h: 0.28,
                    fontSize: 9, color: C.muted, fontFace: 'Montserrat Light'
                });
            }
            s.addText(ind.nome, {
                x: x + 0.15, y: 3.4, w: cardW - 0.3, h: 2.5,
                fontSize: 10, color: C.txt, fontFace: 'Montserrat Light',
                lineSpacingMultiple: 1.3
            });
        });

        this._adicionarRodape(s, pres, G, C, projeto.name);
        return 1;
    }

    // ─────────────────────────────────────────────────
    // RESULTADOS
    // ─────────────────────────────────────────────────
    gerarResultados(pres, projeto, G, C) {
        if (!G.blocks.resultados?.enabled) return 0;

        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        this._desenharFundo(s, pres, C);

        this._adicionarTag(s, pres, 'RESULTADOS', 0.55, 0.4, C);
        s.addText('Impacto Realizado', {
            x: 0.55, y: 0.65, w: 9.3, h: 0.6,
            fontSize: 22, color: C.txt, fontFace: 'Montserrat', bold: true
        });

        const res = projeto.resultados.filter(r => r.metrica).slice(0, 4);
        const n = res.length;
        const cardW = 9.3 / n - 0.15;

        res.forEach((r, i) => {
            const x = 0.55 + i * (cardW + 0.15);
            this._glassCard(s, pres, x, 1.4, cardW, 5.0, C, projeto.color || C.a1);
            s.addText(r.absoluto || '–', {
                x: x + 0.15, y: 1.7, w: cardW - 0.3, h: 1.1,
                fontSize: 40, color: C.txt, fontFace: 'Montserrat', bold: true
            });
            if (r.percentual) {
                s.addText(r.percentual, {
                    x: x + 0.15, y: 2.9, w: cardW - 0.3, h: 0.32,
                    fontSize: 14, color: projeto.color || C.a2,
                    fontFace: 'Montserrat', bold: true
                });
            }
            s.addText(r.metrica, {
                x: x + 0.15, y: 3.4, w: cardW - 0.3, h: 2.6,
                fontSize: 9.5, color: C.muted, fontFace: 'Montserrat Light',
                lineSpacingMultiple: 1.35
            });
        });

        this._adicionarRodape(s, pres, G, C, projeto.name);
        return 1;
    }

    // ─────────────────────────────────────────────────
    // ANTES & DEPOIS
    // ─────────────────────────────────────────────────
    gerarAntesDepois(pres, projeto, G, C) {
        if (!G.blocks.antesdepois?.enabled) return 0;

        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        this._desenharFundo(s, pres, C);

        this._adicionarTag(s, pres, 'ANTES & DEPOIS', 0.55, 0.4, C);
        s.addText('Evidências de Mudança', {
            x: 0.55, y: 0.65, w: 9.3, h: 0.6,
            fontSize: 22, color: C.txt, fontFace: 'Montserrat', bold: true
        });

        const ba = projeto.antesdepois;
        ['antes', 'depois'].forEach((lado, i) => {
            const x = 0.55 + i * 4.85;
            const cor = lado === 'antes' ? C.danger : (C.teal || C.a2);
            this._glassCard(s, pres, x, 1.4, 4.6, 5.5, C, cor);
            s.addText(lado === 'antes' ? '← ANTES' : '→ DEPOIS', {
                x: x + 0.15, y: 1.5, w: 4.3, h: 0.3,
                fontSize: 10, color: cor, fontFace: 'Montserrat', bold: true
            });
            const img = ba[lado + '_img'];
            if (img) {
                s.addImage({ data: img, x: x + 0.2, y: 1.9, w: 4.2, h: 2.0, sizing: { type: 'cover' } });
            } else {
                s.addShape(pres.shapes.RECTANGLE, { x: x + 0.2, y: 1.9, w: 4.2, h: 2.0, fill: { color: C.bg, transparency: 30 } });
            }
            const tit = ba[lado + '_titulo'];
            const desc = ba[lado + '_desc'];
            if (tit) s.addText(tit, { x: x + 0.2, y: 4.1, w: 4.2, h: 0.3, fontSize: 11, color: cor, fontFace: 'Montserrat', bold: true });
            if (desc) s.addText(desc, { x: x + 0.2, y: 4.5, w: 4.2, h: 1.6, fontSize: 9, color: C.muted, fontFace: 'Montserrat Light', lineSpacingMultiple: 1.3 });
        });

        this._adicionarRodape(s, pres, G, C, projeto.name);
        return 1;
    }

    // ─────────────────────────────────────────────────
    // EVIDÊNCIAS
    // ─────────────────────────────────────────────────
    gerarEvidencias(pres, projeto, G, C) {
        if (!G.blocks.evidencias?.enabled) return 0;

        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        this._desenharFundo(s, pres, C);

        this._adicionarTag(s, pres, 'EVIDÊNCIAS', 0.55, 0.4, C);
        s.addText('Registros do Projeto', {
            x: 0.55, y: 0.65, w: 9.3, h: 0.6,
            fontSize: 22, color: C.txt, fontFace: 'Montserrat', bold: true
        });

        const imgs = projeto.evidencias.filter(Boolean);
        if (imgs.length === 0) {
            this._glassCard(s, pres, 0.55, 1.4, 9.3, 5.5, C, C.a1);
            s.addText('[ Nenhuma evidência anexada ]', { x: 0.55, y: 3.9, w: 9.3, h: 0.4, align: 'center', fontSize: 12, color: C.muted, fontFace: 'Montserrat Light' });
        } else {
            const cols = imgs.length === 1 ? 1 : 2;
            const rows = Math.ceil(imgs.length / cols);
            const cardW = 9.3 / cols - 0.2;
            const cardH = 5.5 / rows - 0.2;
            imgs.slice(0, 4).forEach((img, i) => {
                const col = i % cols;
                const row = Math.floor(i / cols);
                const x = 0.55 + col * (cardW + 0.2);
                const y = 1.4 + row * (cardH + 0.2);
                this._glassCard(s, pres, x, y, cardW, cardH, C, C.a1);
                s.addImage({ data: img, x: x + 0.1, y: y + 0.1, w: cardW - 0.2, h: cardH - 0.2, sizing: { type: 'cover' } });
            });
        }

        this._adicionarRodape(s, pres, G, C, projeto.name);
        return 1;
    }

    // ─────────────────────────────────────────────────
    // RISCOS
    // ─────────────────────────────────────────────────
    gerarRiscos(pres, projeto, G, C) {
        if (!G.blocks.riscos?.enabled) return 0;

        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        this._desenharFundo(s, pres, C);

        this._adicionarTag(s, pres, 'RISCOS & ATENÇÃO', 0.55, 0.4, C);
        s.addText('Pontos de Atenção', {
            x: 0.55, y: 0.65, w: 9.3, h: 0.6,
            fontSize: 22, color: C.txt, fontFace: 'Montserrat', bold: true
        });

        projeto.riscos.filter(r => r.texto).slice(0, 5).forEach((r, i) => {
            const y = 1.4 + i * 1.05;
            this._glassCard(s, pres, 0.55, y, 9.3, 0.95, C, C.danger);
            s.addText(`${i + 1}. ${r.texto}`, {
                x: 0.75, y: y + 0.2, w: 8.9, h: 0.6,
                fontSize: 11, color: C.txt, fontFace: 'Montserrat Light',
                lineSpacingMultiple: 1.3
            });
        });

        this._adicionarRodape(s, pres, G, C, projeto.name);
        return 1;
    }

    // ─────────────────────────────────────────────────
    // LIÇÕES APRENDIDAS
    // ─────────────────────────────────────────────────
    gerarLicoes(pres, projeto, G, C) {
        if (!G.blocks.licoes?.enabled) return 0;

        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        this._desenharFundo(s, pres, C);

        this._adicionarTag(s, pres, 'LIÇÕES APRENDIDAS', 0.55, 0.4, C);
        s.addText('O que aprendemos', {
            x: 0.55, y: 0.65, w: 9.3, h: 0.6,
            fontSize: 22, color: C.txt, fontFace: 'Montserrat', bold: true
        });

        projeto.licoes.filter(l => l.texto).slice(0, 5).forEach((l, i) => {
            const y = 1.4 + i * 1.05;
            this._glassCard(s, pres, 0.55, y, 9.3, 0.95, C, C.teal || C.a2);
            s.addText(`${i + 1}. ${l.texto}`, {
                x: 0.75, y: y + 0.2, w: 8.9, h: 0.6,
                fontSize: 11, color: C.txt, fontFace: 'Montserrat Light',
                lineSpacingMultiple: 1.3
            });
        });

        this._adicionarRodape(s, pres, G, C, projeto.name);
        return 1;
    }

    // ─────────────────────────────────────────────────
    // DESAFIOS FUTUROS
    // ─────────────────────────────────────────────────
    gerarDesafios(pres, projeto, G, C) {
        if (!G.blocks.desafios?.enabled) return 0;

        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        this._desenharFundo(s, pres, C);

        this._adicionarTag(s, pres, 'DESAFIOS FUTUROS', 0.55, 0.4, C);
        s.addText('Próximos Passos', {
            x: 0.55, y: 0.65, w: 9.3, h: 0.6,
            fontSize: 22, color: C.txt, fontFace: 'Montserrat', bold: true
        });

        ['Continuidade', 'Acompanhamento', 'Desdobramentos'].forEach((tit, i) => {
            const x = 0.55 + i * 3.2;
            this._glassCard(s, pres, x, 1.4, 3.0, 5.5, C, C.a3 || C.a2);
            s.addText(tit, {
                x: x + 0.15, y: 1.7, w: 2.7, h: 0.3,
                fontSize: 11, color: C.a3 || C.a2, fontFace: 'Montserrat', bold: true
            });
            s.addText(projeto.desafios || '[ A preencher ]', {
                x: x + 0.15, y: 2.1, w: 2.7, h: 4.5,
                fontSize: 9, color: C.muted, fontFace: 'Montserrat Light',
                lineSpacingMultiple: 1.4
            });
        });

        this._adicionarRodape(s, pres, G, C, projeto.name);
        return 1;
    }
}
