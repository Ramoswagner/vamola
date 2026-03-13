// js/models/ModeloBase.js
// Classe base para todos os modelos de apresentação.
// Cada método recebe (pres, G, C) ou (pres, projeto, G, C) — sem dependência de globais.

class ModeloBase {

    // Dimensões padrão de slide LAYOUT_WIDE (polegadas)
    static W = 13.33;
    static H = 7.5;

    constructor(nome) {
        this.nome = nome;
    }

    // ─────────────────────────────────────────────────
    // SLIDES GLOBAIS
    // ─────────────────────────────────────────────────

    gerarCapa(pres, G, C) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        s.addShape(pres.shapes.RECTANGLE, { x: W * 0.55, y: 0, w: W * 0.45, h: H, fill: { color: C.bg2 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H - 1.2, w: W * 0.55, h: 0.04, fill: { color: C.a1 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H - 1.2, w: 2.5, h: 0.04, fill: { color: C.a2 }, line: { width: 0 } });

        if (G.id.instDept) {
            s.addText(G.id.instDept.toUpperCase(), {
                x: 0.55, y: 1.6, w: 6, h: 0.28,
                fontSize: 8, color: C.muted, fontFace: 'Calibri Light', charSpacing: 2.5
            });
        }

        s.addText(G.id.presTitle || 'Apresentação', {
            x: 0.55, y: 2.0, w: 6.5, h: 2.5,
            fontSize: 44, color: C.txt, fontFace: 'Calibri', bold: true, lineSpacingMultiple: 0.9
        });

        if (G.id.presSub) {
            s.addText(G.id.presSub, {
                x: 0.55, y: 4.6, w: 6.5, h: 0.6,
                fontSize: 14, color: C.muted, fontFace: 'Calibri Light'
            });
        }

        if (G.id.instName) {
            s.addText(G.id.instName, {
                x: 0.55, y: H - 1.0, w: 5, h: 0.28,
                fontSize: 10, color: C.txt, fontFace: 'Calibri'
            });
        }

        if (G.id.presDate) {
            s.addText(G.id.presDate, {
                x: 0.55, y: H - 0.7, w: 5, h: 0.22,
                fontSize: 9, color: C.muted, fontFace: 'Calibri Light'
            });
        }

        // Lista de projetos na coluna direita (portfólio/programa)
        if (G.mode !== 'single') {
            G.projects.forEach((p, i) => {
                const y = 2.2 + i * 0.38;
                s.addShape(pres.shapes.RECTANGLE, {
                    x: W * 0.57, y, w: 0.05, h: 0.25,
                    fill: { color: p.color || C.a1 }, line: { width: 0 }
                });
                s.addText(p.name || 'Projeto', {
                    x: W * 0.58, y, w: 4.8, h: 0.28,
                    fontSize: 12, color: C.txt, fontFace: 'Calibri'
                });
            });
        }

        if (G.id.logoInst) {
            s.addImage({ data: G.id.logoInst, x: W * 0.57, y: 0.5, w: 2, h: 1, sizing: { type: 'contain', w: 2, h: 1 } });
        }
        if (G.id.logoProg) {
            s.addImage({ data: G.id.logoProg, x: W * 0.81, y: 0.5, w: 2, h: 1, sizing: { type: 'contain', w: 2, h: 1 } });
        }

        return 1;
    }

    gerarSumario(pres, G, C) {
        if (G.mode === 'single') return 0;

        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        this._adicionarTag(s, pres, 'SUMÁRIO', 0.55, 0.35, C);

        s.addText('Projetos nesta apresentação', {
            x: 0.55, y: 0.55, w: 8, h: 0.55,
            fontSize: 22, color: C.txt, fontFace: 'Calibri', bold: true
        });

        G.projects.forEach((p, i) => {
            const x = 0.55 + (i % 2) * 6.1;
            const y = 1.5 + Math.floor(i / 2) * 0.95;
            s.addShape(pres.shapes.RECTANGLE, { x, y, w: 5.9, h: 0.82, fill: { color: C.bg2 }, line: { color: C.bg2, width: 0.5 } });
            s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.04, h: 0.82, fill: { color: p.color || C.a1 }, line: { width: 0 } });
            s.addText(String(i + 1).padStart(2, '0'), {
                x: x + 0.15, y: y + 0.12, w: 0.55, h: 0.55,
                fontSize: 26, color: p.color || C.a1, fontFace: 'Calibri', bold: true
            });
            s.addText(p.name || 'Projeto', {
                x: x + 0.85, y: y + 0.12, w: 4.85, h: 0.3,
                fontSize: 12, color: C.txt, fontFace: 'Calibri', bold: true
            });
            if (p.leader) {
                s.addText(p.leader, {
                    x: x + 0.85, y: y + 0.5, w: 4.85, h: 0.22,
                    fontSize: 9, color: C.muted, fontFace: 'Calibri Light'
                });
            }
        });

        this._adicionarRodape(s, pres, G, C, '');
        return 1;
    }

    gerarPanorama(pres, G, C) {
        if (!G.blocks.panorama?.enabled) return 0;

        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        this._adicionarTag(s, pres, 'PANORAMA', 0.55, 0.35, C);

        s.addText('Contexto de Dados', {
            x: 0.55, y: 0.55, w: 8, h: 0.55,
            fontSize: 22, color: C.txt, fontFace: 'Calibri', bold: true
        });

        [{ key: 'bi2025', label: 'ANO ANTERIOR' }, { key: 'bi2026', label: 'ANO ATUAL' }].forEach((sd, i) => {
            const x = 0.55 + i * 6.3;
            if (G.id[sd.key]) {
                s.addImage({ data: G.id[sd.key], x, y: 1.4, w: 6, h: 5.55, sizing: { type: 'contain', w: 6, h: 5.55 } });
            } else {
                s.addShape(pres.shapes.RECTANGLE, { x, y: 1.4, w: 6, h: 5.55, fill: { color: C.bg2 }, line: { color: C.bg2, width: 0.5 } });
                s.addText(`[ ${sd.label} ]`, { x, y: 3.9, w: 6, h: 0.4, align: 'center', fontSize: 12, color: C.muted, fontFace: 'Calibri Light' });
            }
        });

        this._adicionarRodape(s, pres, G, C, '');
        return 1;
    }

    gerarEncerramento(pres, G, C) {
        if (!G.blocks.encerramento?.enabled) return 0;

        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 0.04, fill: { color: C.a1 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H - 0.04, w: W, h: 0.04, fill: { color: C.a2 }, line: { width: 0 } });

        if (G.id.presTitle) {
            s.addText(G.id.presTitle, { x: 1, y: 0.65, w: W - 2, h: 0.32, align: 'center', fontSize: 10, color: C.muted, fontFace: 'Calibri Light', charSpacing: 2.5 });
        }
        s.addText('Obrigado.', { x: 1, y: 1.1, w: W - 2, h: 2.5, align: 'center', fontSize: 80, color: C.txt, fontFace: 'Calibri', bold: true });

        if (G.id.instName) {
            s.addText(G.id.instName, { x: 1, y: 3.8, w: W - 2, h: 0.35, align: 'center', fontSize: 14, color: C.muted, fontFace: 'Calibri Light' });
        }
        if (G.id.presDate) {
            s.addText(G.id.presDate, { x: 1, y: 4.2, w: W - 2, h: 0.28, align: 'center', fontSize: 10, color: C.muted, fontFace: 'Calibri Light' });
        }
        if (G.id.logoInst) {
            s.addImage({ data: G.id.logoInst, x: W / 2 - 1.75, y: H - 1.3, w: 1.5, h: 0.75, sizing: { type: 'contain', w: 1.5, h: 0.75 } });
        }
        if (G.id.logoProg) {
            s.addImage({ data: G.id.logoProg, x: W / 2 + 0.25, y: H - 1.3, w: 1.5, h: 0.75, sizing: { type: 'contain', w: 1.5, h: 0.75 } });
        }

        return 1;
    }

    // ─────────────────────────────────────────────────
    // SLIDES POR PROJETO
    // ─────────────────────────────────────────────────

    gerarDivisor(pres, projeto, G, C, index) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg2 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.08, h: H, fill: { color: projeto.color || C.a1 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H - 1.5, w: W, h: 0.04, fill: { color: projeto.color || C.a1 }, line: { width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H - 1.5, w: 2, h: 0.04, fill: { color: C.bg }, line: { width: 0 } });

        s.addText(String(index + 1).padStart(2, '0'), {
            x: 1.2, y: 1.2, w: 4, h: 3,
            fontSize: 140, color: C.bg3 || C.bg, fontFace: 'Calibri', bold: true, transparency: 95
        });

        const titulo = G.mode === 'single' ? 'PROJETO' : `PROJETO ${String(index + 1).padStart(2, '0')}`;
        s.addText(titulo, { x: 1.2, y: 2.0, w: 9, h: 0.28, fontSize: 9, color: C.muted, fontFace: 'Calibri Light', charSpacing: 3 });

        s.addText(projeto.name || 'Projeto', {
            x: 1.2, y: 2.3, w: 9, h: 2.2,
            fontSize: 46, color: C.txt, fontFace: 'Calibri', bold: true, lineSpacingMultiple: 0.9
        });

        if (projeto.leader) {
            s.addText(projeto.leader, { x: 1.2, y: 5.0, w: 8, h: 0.32, fontSize: 14, color: C.muted, fontFace: 'Calibri Light' });
        }

        const dt = [];
        if (projeto.periodo_inicio) dt.push(new Date(projeto.periodo_inicio).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));
        if (projeto.periodo_fim)    dt.push(new Date(projeto.periodo_fim).toLocaleDateString('pt-BR',    { month: 'short', year: 'numeric' }));
        if (dt.length) {
            s.addText(dt.join(' → '), { x: 1.2, y: 5.4, w: 8, h: 0.3, fontSize: 10, color: projeto.color || C.a2, fontFace: 'Calibri', bold: true });
        }

        // Badge de status
        s.addShape(pres.shapes.RECTANGLE, {
            x: W - 1.8, y: 0.5, w: 1.35, h: 0.35,
            fill: { color: projeto.status === 'Concluído' ? (C.teal || C.a2) : C.gold, transparency: 85 }
        });
        s.addText(projeto.status, {
            x: W - 1.8, y: 0.52, w: 1.35, h: 0.3,
            align: 'center', fontSize: 8,
            color: projeto.status === 'Concluído' ? (C.teal || C.a2) : C.gold,
            fontFace: 'Calibri', bold: true
        });

        return 1;
    }

    gerarObjetivo(pres, projeto, G, C) {
        if (!G.blocks.objetivo?.enabled) return 0;

        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: H, fill: { color: projeto.color || C.a1 }, line: { width: 0 } });

        this._adicionarTag(s, pres, 'OBJETIVO', 0.35, 0.3, C);
        s.addText('Problema & Oportunidade', { x: 0.35, y: 0.52, w: 9.3, h: 0.55, fontSize: 22, color: C.txt, fontFace: 'Calibri', bold: true });

        if (projeto.objetivo) {
            s.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: 1.35, w: 9.3, h: 4.9, fill: { color: C.bg2 }, line: { width: 0 } });
            s.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: 1.35, w: 0.04, h: 4.9, fill: { color: projeto.color || C.a1 }, line: { width: 0 } });
            s.addText(projeto.objetivo, { x: 0.6, y: 1.55, w: 8.9, h: 4.5, fontSize: 14, color: C.txt, fontFace: 'Calibri Light', lineSpacingMultiple: 1.5 });
        }

        this._adicionarRodape(s, pres, G, C, projeto.name);
        return 1;
    }

    gerarEquipe(pres, projeto, G, C) {
        if (!G.blocks.team?.enabled) return 0;

        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: H, fill: { color: projeto.color || C.a1 }, line: { width: 0 } });

        this._adicionarTag(s, pres, 'EQUIPE', 0.35, 0.3, C);
        s.addText('Quem realizou', { x: 0.35, y: 0.52, w: 9.3, h: 0.55, fontSize: 22, color: C.txt, fontFace: 'Calibri', bold: true });

        const team = projeto.team.filter(t => t.nome);
        const cols = Math.min(team.length, 4);
        const bw = (9.3 / cols) - 0.15;

        team.slice(0, 4).forEach((t, i) => {
            const x = 0.35 + i * (bw + 0.15);
            s.addShape(pres.shapes.RECTANGLE, { x, y: 1.35, w: bw, h: 3.9, fill: { color: C.bg2 }, line: { width: 0 } });
            s.addShape(pres.shapes.RECTANGLE, { x, y: 1.35, w: bw, h: 0.04, fill: { color: projeto.color || C.a1 }, line: { width: 0 } });

            s.addShape(pres.shapes.RECTANGLE, { x: x + bw / 2 - 0.35, y: 1.6, w: 0.7, h: 0.7, fill: { color: projeto.color || C.a1, transparency: 80 } });
            const iniciais = t.nome.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
            s.addText(iniciais, { x: x + bw / 2 - 0.35, y: 1.62, w: 0.7, h: 0.65, align: 'center', fontSize: 16, color: projeto.color || C.a1, fontFace: 'Calibri', bold: true });

            s.addText(t.nome, { x: x + 0.1, y: 2.5, w: bw - 0.2, h: 0.6, align: 'center', fontSize: 11, color: C.txt, fontFace: 'Calibri', bold: true });
            s.addText(t.cargo, { x: x + 0.1, y: 3.2, w: bw - 0.2, h: 0.7, align: 'center', fontSize: 9, color: C.muted, fontFace: 'Calibri Light', lineSpacingMultiple: 1.3 });
        });

        this._adicionarRodape(s, pres, G, C, projeto.name);
        return 1;
    }

    gerarEtapas(pres, projeto, G, C) {
        if (!G.blocks.etapas?.enabled) return 0;

        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: H, fill: { color: projeto.color || C.a1 }, line: { width: 0 } });

        this._adicionarTag(s, pres, 'ETAPAS', 0.35, 0.3, C);
        s.addText('Jornada de Execução', { x: 0.35, y: 0.52, w: 9.3, h: 0.55, fontSize: 22, color: C.txt, fontFace: 'Calibri', bold: true });

        const etapas = projeto.etapas.filter(e => e.titulo);
        const n = Math.min(etapas.length, 6);
        const bw = 9.3 / n - 0.12;

        etapas.slice(0, n).forEach((e, i) => {
            const x = 0.35 + i * (bw + 0.12);
            s.addShape(pres.shapes.RECTANGLE, { x, y: 1.35, w: bw, h: 4.9, fill: { color: C.bg2 }, line: { width: 0 } });
            s.addShape(pres.shapes.RECTANGLE, { x, y: 1.35, w: bw, h: 0.04, fill: { color: projeto.color || C.a1, transparency: i * 15 }, line: { width: 0 } });
            s.addText(String(i + 1).padStart(2, '0'), { x: x + 0.12, y: 1.5, w: 1, h: 0.55, fontSize: 26, color: projeto.color || C.a1, fontFace: 'Calibri', bold: true, transparency: 40 });
            s.addText(e.titulo, { x: x + 0.12, y: 2.15, w: bw - 0.24, h: 0.55, fontSize: 12, color: C.txt, fontFace: 'Calibri', bold: true, lineSpacingMultiple: 1.1 });
            if (e.descricao) {
                s.addText(e.descricao, { x: x + 0.12, y: 2.82, w: bw - 0.24, h: 3.2, fontSize: 9, color: C.muted, fontFace: 'Calibri Light', lineSpacingMultiple: 1.35 });
            }
        });

        this._adicionarRodape(s, pres, G, C, projeto.name);
        return 1;
    }

    gerarMarcos(pres, projeto, G, C) {
        if (!G.blocks.marcos?.enabled) return 0;

        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: H, fill: { color: projeto.color || C.a1 }, line: { width: 0 } });

        this._adicionarTag(s, pres, 'MARCOS', 0.35, 0.3, C);
        s.addText('Timeline do Projeto', { x: 0.35, y: 0.52, w: 9.3, h: 0.55, fontSize: 22, color: C.txt, fontFace: 'Calibri', bold: true });

        const marcos = projeto.marcos.filter(m => m.entrega);
        s.addShape(pres.shapes.RECTANGLE, { x: 0.55, y: 3.3, w: 9.0, h: 0.03, fill: { color: C.a1, transparency: 60 }, line: { width: 0 } });

        const n = Math.min(marcos.length, 6);
        marcos.slice(0, n).forEach((m, i) => {
            const x = 0.55 + i * (9.0 / (n > 1 ? n - 1 : 1));
            const above = i % 2 === 0;
            s.addShape(pres.shapes.RECTANGLE, { x: x - 0.05, y: 3.22, w: 0.1, h: 0.2, fill: { color: projeto.color || C.a1 }, line: { width: 0 } });
            s.addShape(pres.shapes.RECTANGLE, { x: x - 0.015, y: above ? 1.9 : 3.45, w: 0.03, h: 1.32, fill: { color: C.a1, transparency: 75 }, line: { width: 0 } });
            if (m.data) {
                const dataStr = new Date(m.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
                s.addText(dataStr, { x: x - 1, y: above ? 1.62 : 4.85, w: 2, h: 0.25, align: 'center', fontSize: 8, color: projeto.color || C.a2, fontFace: 'Calibri', bold: true });
            }
            s.addText(m.entrega, { x: x - 1.5, y: above ? 1.0 : 4.95, w: 3, h: 0.52, align: 'center', fontSize: 9.5, color: C.txt, fontFace: 'Calibri Light', lineSpacingMultiple: 1.2 });
        });

        this._adicionarRodape(s, pres, G, C, projeto.name);
        return 1;
    }

    gerarIndicadores(pres, projeto, G, C) {
        if (!G.blocks.indicadores?.enabled) return 0;

        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: H, fill: { color: projeto.color || C.a1 }, line: { width: 0 } });

        this._adicionarTag(s, pres, 'INDICADORES', 0.35, 0.3, C);
        s.addText('KPIs do Projeto', { x: 0.35, y: 0.52, w: 9.3, h: 0.55, fontSize: 22, color: C.txt, fontFace: 'Calibri', bold: true });

        const inds = projeto.indicadores.filter(i => i.nome);
        const n = Math.min(inds.length, 4);
        const bw = 9.3 / n - 0.15;

        inds.slice(0, n).forEach((ind, i) => {
            const x = 0.35 + i * (bw + 0.15);
            s.addShape(pres.shapes.RECTANGLE, { x, y: 1.35, w: bw, h: 4.9, fill: { color: C.bg2 }, line: { width: 0 } });
            s.addShape(pres.shapes.RECTANGLE, { x, y: 1.35, w: bw, h: 0.04, fill: { color: projeto.color || C.a1 }, line: { width: 0 } });
            s.addText(ind.realizado || '–', { x: x + 0.15, y: 1.55, w: bw - 0.3, h: 1.2, fontSize: 46, color: C.txt, fontFace: 'Calibri', bold: true, lineSpacingMultiple: 0.85 });
            s.addShape(pres.shapes.RECTANGLE, { x: x + 0.15, y: 2.85, w: bw - 0.3, h: 0.04, fill: { color: C.a1, transparency: 70 }, line: { width: 0 } });
            if (ind.meta) {
                s.addText(`Meta: ${ind.meta}`, { x: x + 0.15, y: 2.95, w: bw - 0.3, h: 0.28, fontSize: 9, color: C.muted, fontFace: 'Calibri Light' });
            }
            s.addText(ind.nome, { x: x + 0.15, y: 3.3, w: bw - 0.3, h: 2.7, fontSize: 10.5, color: C.txt, fontFace: 'Calibri Light', lineSpacingMultiple: 1.3 });
        });

        this._adicionarRodape(s, pres, G, C, projeto.name);
        return 1;
    }

    gerarResultados(pres, projeto, G, C) {
        if (!G.blocks.resultados?.enabled) return 0;

        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: H, fill: { color: projeto.color || C.a1 }, line: { width: 0 } });

        this._adicionarTag(s, pres, 'RESULTADOS', 0.35, 0.3, C);
        s.addText('Impacto Realizado', { x: 0.35, y: 0.52, w: 9.3, h: 0.55, fontSize: 22, color: C.txt, fontFace: 'Calibri', bold: true });

        const res = projeto.resultados.filter(r => r.metrica);
        const n = Math.min(res.length, 4);
        const bw = 9.3 / n - 0.15;

        res.slice(0, n).forEach((r, i) => {
            const x = 0.35 + i * (bw + 0.15);
            s.addShape(pres.shapes.RECTANGLE, { x, y: 1.35, w: bw, h: 4.9, fill: { color: C.bg2 }, line: { width: 0 } });
            s.addShape(pres.shapes.RECTANGLE, { x, y: 1.35, w: bw, h: 0.04, fill: { color: projeto.color || C.a1 }, line: { width: 0 } });
            s.addText(r.absoluto || '–', { x: x + 0.15, y: 1.55, w: bw - 0.3, h: 1.1, fontSize: 40, color: C.txt, fontFace: 'Calibri', bold: true, lineSpacingMultiple: 0.85 });
            if (r.percentual) {
                s.addText(r.percentual, { x: x + 0.15, y: 2.72, w: bw - 0.3, h: 0.32, fontSize: 14, color: projeto.color || C.a2, fontFace: 'Calibri', bold: true });
            }
            s.addText(r.metrica, { x: x + 0.15, y: 3.15, w: bw - 0.3, h: 2.95, fontSize: 9.5, color: C.muted, fontFace: 'Calibri Light', lineSpacingMultiple: 1.35 });
        });

        this._adicionarRodape(s, pres, G, C, projeto.name);
        return 1;
    }

    gerarAntesDepois(pres, projeto, G, C) {
        if (!G.blocks.antesdepois?.enabled) return 0;

        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: H, fill: { color: C.a2 }, line: { width: 0 } });

        this._adicionarTag(s, pres, 'ANTES & DEPOIS', 0.35, 0.3, C);
        s.addText('Evidências de Mudança', { x: 0.35, y: 0.52, w: 9.3, h: 0.55, fontSize: 22, color: C.txt, fontFace: 'Calibri', bold: true });

        const ba = projeto.antesdepois;
        [{ key: 'antes', lbl: '← ANTES', col: C.danger }, { key: 'depois', lbl: '→ DEPOIS', col: C.teal || C.a2 }].forEach((sd, i) => {
            const x = 0.35 + i * 4.85;
            s.addShape(pres.shapes.RECTANGLE, { x, y: 1.35, w: 4.6, h: 5.55, fill: { color: C.bg2 }, line: { width: 0 } });
            s.addShape(pres.shapes.RECTANGLE, { x, y: 1.35, w: 4.6, h: 0.28, fill: { color: sd.col, transparency: 80 }, line: { width: 0 } });
            s.addText(sd.lbl, { x: x + 0.15, y: 1.37, w: 4.3, h: 0.23, fontSize: 9, color: sd.col, fontFace: 'Calibri', bold: true, charSpacing: 1.2 });

            const img = ba[sd.key + '_img'];
            if (img) {
                s.addImage({ data: img, x: x + 0.1, y: 1.68, w: 4.4, h: 2.0, sizing: { type: 'cover', w: 4.4, h: 2.0 } });
            } else {
                s.addShape(pres.shapes.RECTANGLE, { x: x + 0.1, y: 1.68, w: 4.4, h: 2.0, fill: { color: C.bg, transparency: 30 }, line: { width: 0 } });
                s.addText('[ Inserir foto ]', { x: x + 0.1, y: 2.6, w: 4.4, h: 0.3, align: 'center', fontSize: 9, color: C.muted, fontFace: 'Calibri Light' });
            }

            const tit  = ba[sd.key + '_titulo'];
            const desc = ba[sd.key + '_desc'];
            if (tit)  s.addText(tit,  { x: x + 0.15, y: 3.82, w: 4.3, h: 0.3,  fontSize: 11, color: sd.col, fontFace: 'Calibri', bold: true });
            if (desc) s.addText(desc, { x: x + 0.15, y: 4.2,  w: 4.3, h: 2.5,  fontSize: 9,  color: C.muted, fontFace: 'Calibri Light', lineSpacingMultiple: 1.3 });
        });

        this._adicionarRodape(s, pres, G, C, projeto.name);
        return 1;
    }

    gerarEvidencias(pres, projeto, G, C) {
        if (!G.blocks.evidencias?.enabled) return 0;

        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: H, fill: { color: projeto.color || C.a1 }, line: { width: 0 } });

        this._adicionarTag(s, pres, 'EVIDÊNCIAS', 0.35, 0.3, C);
        s.addText('Registros do Projeto', { x: 0.35, y: 0.52, w: 9.3, h: 0.55, fontSize: 22, color: C.txt, fontFace: 'Calibri', bold: true });

        const imgs = projeto.evidencias.filter(Boolean);
        if (!imgs.length) {
            s.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: 1.35, w: 9.3, h: 5.55, fill: { color: C.bg2 }, line: { width: 0 } });
            s.addText('[ Evidências a inserir ]', { x: 0.35, y: 3.9, w: 9.3, h: 0.4, align: 'center', fontSize: 12, color: C.muted, fontFace: 'Calibri Light' });
        } else if (imgs.length === 1) {
            s.addImage({ data: imgs[0], x: 0.35, y: 1.35, w: 9.3, h: 5.55, sizing: { type: 'cover', w: 9.3, h: 5.55 } });
        } else if (imgs.length === 2) {
            imgs.forEach((img, i) => s.addImage({ data: img, x: 0.35 + i * 4.85, y: 1.35, w: 4.6, h: 5.55, sizing: { type: 'cover', w: 4.6, h: 5.55 } }));
        } else {
            imgs.slice(0, 4).forEach((img, i) => s.addImage({ data: img, x: 0.35 + (i % 2) * 4.85, y: 1.35 + Math.floor(i / 2) * 2.85, w: 4.6, h: 2.7, sizing: { type: 'cover', w: 4.6, h: 2.7 } }));
        }

        this._adicionarRodape(s, pres, G, C, projeto.name);
        return 1;
    }

    gerarRiscos(pres, projeto, G, C) {
        if (!G.blocks.riscos?.enabled) return 0;

        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: H, fill: { color: C.danger }, line: { width: 0 } });

        this._adicionarTag(s, pres, 'RISCOS & ATENÇÃO', 0.35, 0.3, C);
        s.addText('Pontos de Atenção', { x: 0.35, y: 0.52, w: 9.3, h: 0.55, fontSize: 22, color: C.txt, fontFace: 'Calibri', bold: true });

        projeto.riscos.filter(r => r.texto).slice(0, 5).forEach((r, i) => {
            const y = 1.4 + i * 0.98;
            s.addShape(pres.shapes.RECTANGLE, { x: 0.35, y, w: 9.3, h: 0.85, fill: { color: C.bg2 }, line: { width: 0 } });
            s.addShape(pres.shapes.RECTANGLE, { x: 0.35, y, w: 0.04, h: 0.85, fill: { color: C.danger }, line: { width: 0 } });
            s.addText(String(i + 1), { x: 0.52, y: y + 0.22, w: 0.3, h: 0.3, fontSize: 12, color: C.danger, fontFace: 'Calibri', bold: true });
            s.addText(r.texto, { x: 0.95, y: y + 0.1, w: 8.5, h: 0.68, fontSize: 11, color: C.txt, fontFace: 'Calibri Light', lineSpacingMultiple: 1.3 });
        });

        this._adicionarRodape(s, pres, G, C, projeto.name);
        return 1;
    }

    gerarLicoes(pres, projeto, G, C) {
        if (!G.blocks.licoes?.enabled) return 0;

        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: H, fill: { color: C.teal || C.a2 }, line: { width: 0 } });

        this._adicionarTag(s, pres, 'LIÇÕES APRENDIDAS', 0.35, 0.3, C);
        s.addText('O que aprendemos', { x: 0.35, y: 0.52, w: 9.3, h: 0.55, fontSize: 22, color: C.txt, fontFace: 'Calibri', bold: true });

        projeto.licoes.filter(l => l.texto).slice(0, 5).forEach((l, i) => {
            const y = 1.4 + i * 0.98;
            s.addShape(pres.shapes.RECTANGLE, { x: 0.35, y, w: 9.3, h: 0.85, fill: { color: C.bg2 }, line: { width: 0 } });
            s.addShape(pres.shapes.RECTANGLE, { x: 0.35, y, w: 0.04, h: 0.85, fill: { color: C.teal || C.a2 }, line: { width: 0 } });
            s.addText(String(i + 1), { x: 0.52, y: y + 0.22, w: 0.3, h: 0.3, fontSize: 12, color: C.teal || C.a2, fontFace: 'Calibri', bold: true });
            s.addText(l.texto, { x: 0.95, y: y + 0.1, w: 8.5, h: 0.68, fontSize: 11, color: C.txt, fontFace: 'Calibri Light', lineSpacingMultiple: 1.3 });
        });

        this._adicionarRodape(s, pres, G, C, projeto.name);
        return 1;
    }

    gerarDesafios(pres, projeto, G, C) {
        if (!G.blocks.desafios?.enabled) return 0;

        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.06, h: H, fill: { color: C.a3 || C.a2 }, line: { width: 0 } });

        this._adicionarTag(s, pres, 'DESAFIOS FUTUROS', 0.35, 0.3, C);
        s.addText('Próximos Passos', { x: 0.35, y: 0.52, w: 9.3, h: 0.55, fontSize: 22, color: C.txt, fontFace: 'Calibri', bold: true });

        [
            { label: 'Continuidade',    icon: '↻' },
            { label: 'Acompanhamento', icon: '◉' },
            { label: 'Desdobramentos', icon: '→' }
        ].forEach((a, i) => {
            const x = 0.35 + i * 3.2;
            s.addShape(pres.shapes.RECTANGLE, { x, y: 1.35, w: 3.05, h: 5.55, fill: { color: C.bg2 }, line: { width: 0 } });
            s.addShape(pres.shapes.RECTANGLE, { x, y: 1.35, w: 3.05, h: 0.04, fill: { color: C.a3 || C.a2 }, line: { width: 0 } });
            s.addText(a.icon,  { x: x + 0.2, y: 1.55, w: 0.5, h: 0.45, fontSize: 18, color: C.a3 || C.a2 });
            s.addText(a.label, { x: x + 0.2, y: 2.12, w: 2.65, h: 0.28, fontSize: 10, color: C.a3 || C.a2, fontFace: 'Calibri', bold: true });
            s.addText(projeto.desafios || '[ A preencher ]', { x: x + 0.2, y: 2.52, w: 2.65, h: 4.2, fontSize: 9, color: C.muted, fontFace: 'Calibri Light', lineSpacingMultiple: 1.45 });
        });

        this._adicionarRodape(s, pres, G, C, projeto.name);
        return 1;
    }

    // ─────────────────────────────────────────────────
    // AUXILIARES — recebem pres para evitar s.pres
    // ─────────────────────────────────────────────────

    /**
     * Tag colorida com texto em caixa alta.
     * @param {Object} s    - Slide atual
     * @param {Object} pres - Instância PptxGenJS
     * @param {string} texto
     * @param {number} x
     * @param {number} y
     * @param {Object} C   - Cores
     */
    _adicionarTag(s, pres, texto, x, y, C) {
        const w = texto.length * 0.09 + 0.3;
        s.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.22, fill: { color: C.a1 } });
        s.addText(texto, { x: x + 0.08, y: y + 0.02, w: w - 0.1, h: 0.18, fontSize: 6.5, color: 'FFFFFF', fontFace: 'Calibri', bold: true, charSpacing: 1.5 });
    }

    /**
     * Rodapé padrão com instituição, projeto e data.
     * @param {Object} s          - Slide atual
     * @param {Object} pres       - Instância PptxGenJS
     * @param {Object} G          - Estado global
     * @param {Object} C          - Cores
     * @param {string} projetoNome
     */
    _adicionarRodape(s, pres, G, C, projetoNome) {
        const { W, H } = ModeloBase;
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: H - 0.35, w: W, h: 0.35, fill: { color: C.bg2 }, line: { width: 0 } });
        if (G.id.instName) {
            s.addText(G.id.instName, { x: 0.3, y: H - 0.28, w: 5, h: 0.22, fontSize: 7, color: C.muted, fontFace: 'Calibri Light' });
        }
        if (projetoNome) {
            s.addText(projetoNome, { x: W / 2 - 2, y: H - 0.28, w: 4, h: 0.22, fontSize: 7, color: C.muted, fontFace: 'Calibri Light', align: 'center' });
        }
        if (G.id.presDate) {
            s.addText(G.id.presDate, { x: W - 3.3, y: H - 0.28, w: 3, h: 0.22, fontSize: 7, color: C.muted, fontFace: 'Calibri Light', align: 'right' });
        }
    }
}
