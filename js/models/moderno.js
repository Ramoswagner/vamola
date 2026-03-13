// js/models/moderno.js
import { ModeloBase } from './ModeloBase.js';

export class ModeloModerno extends ModeloBase {
    constructor() {
        super('Moderno Dashboard', 'Layout com cards e gradientes');
    }

    gerarSlideCapa(pres, G, T) {
        const s = pres.addSlide();
        s.background = { 
            fill: { 
                type: 'gradient',
                color1: `#${T.C.bg}`,
                color2: `#${T.C.a1}`,
                angle: 45
            } 
        };
        
        s.addText(G.id.presTitle || 'Título', {
            x: 2.0, y: 2.5, w: 9, h: 2.5,
            fontSize: 56, color: 'FFFFFF', align: 'center', bold: true
        });
        
        s.addShape(pres.ShapeType.ROUNDED_RECTANGLE, {
            x: 4.5, y: 5.0, w: 4, h: 1.2,
            fill: { color: 'FFFFFF', transparency: 15 },
            rectRadius: 0.3
        });
        
        s.addText(G.id.instName || 'Instituição', {
            x: 4.5, y: 5.3, w: 4, h: 0.8,
            fontSize: 18, color: T.C.txt, align: 'center'
        });
    }

    gerarSlideObjetivo(pres, projeto, C) {
        const s = pres.addSlide();
        s.background = { fill: `#${C.bg}` };
        
        s.addShape(pres.ShapeType.ROUNDED_RECTANGLE, {
            x: 0.5, y: 0.5, w: 5, h: 1,
            fill: { color: C.a2 },
            rectRadius: 0.3
        });
        
        s.addText('OBJETIVO', {
            x: 0.8, y: 0.7, w: 4, h: 0.6,
            fontSize: 24, color: 'FFFFFF', bold: true
        });
        
        s.addShape(pres.ShapeType.ROUNDED_RECTANGLE, {
            x: 0.5, y: 1.8, w: 12, h: 5,
            fill: { color: C.bg2 },
            rectRadius: 0.3
        });
        
        s.addText(projeto.objetivo || 'Descreva o objetivo...', {
            x: 1.0, y: 2.2, w: 11, h: 4.5,
            fontSize: 20, color: C.txt
        });
    }

    // Implemente os outros métodos...
    gerarSlideSumario(pres, G, T) {}
    gerarSlidePanorama(pres, G, T) {}
    gerarSlideDivisor(pres, projeto, G, T, indice) {}
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
