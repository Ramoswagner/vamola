// js/models/minimalista.js
// Modelo Minimalista — muito espaço, tipografia leve, zero blocos preenchidos.
// Sobrescreve: gerarCapa, gerarDivisor, _adicionarTag, _adicionarRodape

class ModeloMinimalista extends ModeloBase {
    constructor() {
        super('Minimalista');
    }

    // ─────────────────────────────────────────────────
    // CAPA — centralizada, linha fina como único elemento decorativo
    // ─────────────────────────────────────────────────
    gerarCapa(pres, G, C) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        // Fundo limpo
        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });

        // Linha horizontal fina — único elemento decorativo
        s.addShape(pres.shapes.RECTANGLE, { x: 1.2, y: H * 0.42, w: W - 2.4, h: 0.02, fill: { color: C.a1 }, line: { width: 0 } });

        // Departamento — acima da linha
        if (G.id.instDept) {
            s.addText(G.id.instDept.toUpperCase(), {
                x: 1.2, y: H * 0.33, w: W - 2.4, h: 0.25,
                fontSize: 7, color: C.muted, fontFace: 'Calibri Light', charSpacing: 4
            });
        }

        // Título — abaixo da linha, fonte grande mas peso leve
        s.addText(G.id.presTitle || 'Apresentação', {
            x: 1.2, y: H * 0.45, w: W - 2.4, h: 2.2,
            fontSize: 42, color: C.txt, fontFace: 'Calibri Light',
            bold: false, lineSpacingMultiple: 0.9
        });

        // Subtítulo
        if (G.id.presSub) {
            s.addText(G.id.presSub, {
                x: 1.2, y: H * 0.45 + 2.3, w: W - 2.4, h: 0.45,
                fontSize: 12, color: C.muted, fontFace: 'Calibri Light'
            });
        }

        // Instituição + data — canto inferior esquerdo
        if (G.id.instName) {
            s.addText(G.id.instName, {
                x: 1.2, y: H - 1.0, w: 5, h: 0.28,
                fontSize: 9, color: C.muted, fontFace: 'Calibri Light'
            });
        }
        if (G.id.presDate) {
            s.addText(G.id.presDate, {
                x: 1.2, y: H - 0.68, w: 5, h: 0.22,
                fontSize: 8, color: C.muted, fontFace: 'Calibri Light'
            });
        }

        // Lista de projetos — alinhada à direita, tipografia pequena
        if (G.mode !== 'single') {
            G.projects.forEach((p, i) => {
                const y = H * 0.45 + i * 0.36;
                s.addText(`${String(i + 1).padStart(2, '0')}  ${p.name || 'Projeto'}`, {
                    x: W - 4.5, y, w: 4.2, h: 0.3,
                    fontSize: 10, color: C.muted, fontFace: 'Calibri Light', align: 'right'
                });
            });
        }

        // Logos — discretos, canto superior direito
        if (G.id.logoInst) {
            s.addImage({ data: G.id.logoInst, x: W - 2.8, y: 0.45, w: 1.2, h: 0.6, sizing: { type: 'contain', w: 1.2, h: 0.6 } });
        }
        if (G.id.logoProg) {
            s.addImage({ data: G.id.logoProg, x: W - 1.5, y: 0.45, w: 1.2, h: 0.6, sizing: { type: 'contain', w: 1.2, h: 0.6 } });
        }

        return 1;
    }

    // ─────────────────────────────────────────────────
    // DIVISOR — só tipografia, sem formas preenchidas
    // ─────────────────────────────────────────────────
    gerarDivisor(pres, projeto, G, C, index) {
        const s = pres.addSlide();
        const { W, H } = ModeloBase;

        s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg } });

        // Número do projeto — pequeno, discreto, canto superior
        s.addText(String(index + 1).padStart(2, '0'), {
            x: 1.2, y: 1.0, w: 2, h: 0.5,
            fontSize: 12, color: C.muted, fontFace: 'Calibri Light', charSpacing: 2
        });

        // Linha fina com cor do projeto
        s.addShape(pres.shapes.RECTANGLE, {
            x: 1.2, y: 1.6, w: 1.2, h: 0.03,
            fill: { color: projeto.color || C.a1 }, line: { width: 0 }
        });

        // Nome do projeto — peso leve, tamanho grande
        s.addText(projeto.name || 'Projeto', {
            x: 1.2, y: 1.75, w: W - 2.4, h: 2.8,
            fontSize: 54, color: C.txt, fontFace: 'Calibri Light',
            bold: false, lineSpacingMultiple: 0.88
        });

        // Líder e período — tipografia pequena
        if (projeto.leader) {
            s.addText(projeto.leader, { x: 1.2, y: 4.75, w: 8, h: 0.3, fontSize: 11, color: C.muted, fontFace: 'Calibri Light' });
        }

        const dt = [];
        if (projeto.periodo_inicio) dt.push(new Date(projeto.periodo_inicio).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));
        if (projeto.periodo_fim)    dt.push(new Date(projeto.periodo_fim).toLocaleDateString('pt-BR',    { month: 'short', year: 'numeric' }));
        if (dt.length) {
            s.addText(dt.join(' → '), { x: 1.2, y: 5.12, w: 8, h: 0.28, fontSize: 9, color: C.muted, fontFace: 'Calibri Light' });
        }

        // Status — apenas texto, sem badge
        s.addText(projeto.status, {
            x: W - 2.5, y: H - 0.65, w: 2.2, h: 0.28,
            fontSize: 8, color: projeto.status === 'Concluído' ? (C.teal || C.a2) : C.gold,
            fontFace: 'Calibri Light', align: 'right', charSpacing: 1.5
        });

        return 1;
    }

    // ─────────────────────────────────────────────────
    // TAG — linha fina colorida + texto, sem retângulo preenchido
    // ─────────────────────────────────────────────────
    _adicionarTag(s, pres, texto, x, y, C) {
        s.addShape(pres.shapes.RECTANGLE, { x, y: y + 0.18, w: texto.length * 0.072 + 0.1, h: 0.02, fill: { color: C.a1 }, line: { width: 0 } });
        s.addText(texto, {
            x, y, w: texto.length * 0.09 + 0.3, h: 0.2,
            fontSize: 6.5, color: C.muted, fontFace: 'Calibri Light', charSpacing: 2.5
        });
    }

    // ─────────────────────────────────────────────────
    // RODAPÉ — sem bloco, só texto pequeno e linha mínima
    // ─────────────────────────────────────────────────
    _adicionarRodape(s, pres, G, C, projetoNome) {
        const { W, H } = ModeloBase;
        // Linha separadora mínima
        s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y: H - 0.45, w: W - 0.8, h: 0.01, fill: { color: C.muted }, line: { width: 0 } });
        if (G.id.instName) {
            s.addText(G.id.instName, { x: 0.4, y: H - 0.38, w: 5, h: 0.22, fontSize: 6.5, color: C.muted, fontFace: 'Calibri Light' });
        }
        if (projetoNome) {
            s.addText(projetoNome, { x: W / 2 - 2, y: H - 0.38, w: 4, h: 0.22, fontSize: 6.5, color: C.muted, fontFace: 'Calibri Light', align: 'center' });
        }
        if (G.id.presDate) {
            s.addText(G.id.presDate, { x: W - 3.3, y: H - 0.38, w: 3, h: 0.22, fontSize: 6.5, color: C.muted, fontFace: 'Calibri Light', align: 'right' });
        }
    }
}
