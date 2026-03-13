// js/models/minimalista.js
import { ModeloBase } from './ModeloBase.js';

export class ModeloMinimalista extends ModeloBase {
    constructor() {
        super('Minimalista Clean', 'Layout limpo, com muito espaço em branco e tipografia elegante');
    }

    gerarSlideCapa(pres, G, T) {
        const s = pres.addSlide();
        const C = T.C;
        
        s.background = { fill: `#${C.bg}` };
        
        // Linha sutil superior
        s.addShape(pres.ShapeType.RECTANGLE, {
            x: 0, y: 0, w: 13.33, h: 0.1,
            fill: { color: C.a1 }
        });
        
        // Título
        s.addText(G.id.presTitle || 'Título', {
            x: 2.0, y: 3.0, w: 9, h: 2,
            fontSize: 48, color: C.txt, bold: true,
            align: 'center', fontFace: 'Calibri'
        });
        
        // Subtítulo
        if (G.id.presSub) {
            s.addText(G.id.presSub, {
                x: 2.0, y: 4.5, w: 9, h: 1,
                fontSize: 20, color: C.muted,
                align: 'center', fontFace: 'Calibri Light'
            });
        }
        
        // Instituição
        s.addText(G.id.instName || 'Instituição', {
            x: 2.0, y: 6.0, w: 9, h: 0.8,
            fontSize: 16, color: C.muted,
            align: 'center'
        });
    }

    gerarSlideDivisor(pres, projeto, G, T, indice) {
        const s = pres.addSlide();
        const C = T.C;
        
        s.background = { fill: `#${C.bg}` };
        
        // Linha vertical colorida
        s.addShape(pres.ShapeType.RECTANGLE, {
            x: 6.5, y: 1.0, w: 0.2, h: 5.5,
            fill: { color: projeto.color || C.a1 }
        });
        
        // Número do projeto
        s.addText(`${String(indice + 1).padStart(2, '0')}`, {
            x: 4.0, y: 2.0, w: 5, h: 1,
            fontSize: 72, color: C.muted, bold: true,
            align: 'center'
        });
        
        // Nome do projeto
        s.addText(projeto.name || 'Projeto', {
            x: 2.0, y: 3.5, w: 9, h: 1,
            fontSize: 36, color: C.txt, bold: true,
            align: 'center'
        });
    }

    gerarSlideObjetivo(pres, projeto, C) {
        const s = pres.addSlide();
        s.background = { fill: `#${C.bg}` };
        
        // Título minimalista
        s.addText('Objetivo', {
            x: 2.0, y: 1.5, w: 9, h: 1,
            fontSize: 32, color: C.a1, bold: true,
            align: 'center'
        });
        
        // Conteúdo
        s.addText(projeto.objetivo || 'Descreva o objetivo do projeto...', {
            x: 2.5, y: 3.0, w: 8, h: 4,
            fontSize: 20, color: C.txt,
            align: 'center',
            fontFace: 'Calibri Light'
        });
    }

    // Métodos opcionais
    gerarSlideSumario(pres, G, T) {}
    gerarSlidePanorama(pres, G, T) {}
    gerarSlideEquipe(pres, projeto, C) {}
    gerarSlideEtapas(pres, projeto, C) {}
    gerarSlideMarcos(pres, projeto, C) {}
    gerarSlideIndicadores(pres, projeto, C) {}
    gerarSlideResultados(pres, projeto, C) {}
    gerarSlideAntesDepois(pres, projeto, C) {}
    gerarSlideEvidencias(pres, projeto, C) {}
    gerarSlideRiscos(pres, projeto, C) {}
    gerarSlideLicoes(pres, projeto, C) {}
    gerarSlideDesafios(pres, projeto, C) {}
    gerarSlideEncerramento(pres, G, T) {}
}
