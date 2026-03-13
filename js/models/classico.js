// js/models/classico.js
import { ModeloBase } from './ModeloBase.js';

export class ModeloClassico extends ModeloBase {
    constructor() {
        super('Clássico Corporativo', 'Layout tradicional com barras laterais');
    }

    gerarSlideCapa(pres, G, T) {
        const s = pres.addSlide();
        s.background = { fill: `#${T.C.bg}` };
        
        // Barra lateral
        s.addShape(pres.ShapeType.RECTANGLE, {
            x: 0, y: 0, w: 0.5, h: 7.5,
            fill: { color: T.C.a1 }
        });
        
        s.addText(G.id.presTitle || 'Título', {
            x: 1.2, y: 2.5, w: 10, h: 1.5,
            fontSize: 44, color: T.C.txt, bold: true
        });
        
        if (G.id.instName) {
            s.addText(G.id.instName, {
                x: 1.2, y: 5.0, w: 8, h: 0.8,
                fontSize: 24, color: T.C.muted
            });
        }
    }

    gerarSlideObjetivo(pres, projeto, C) {
        const s = pres.addSlide();
        s.background = { fill: `#${C.bg}` };
        
        s.addText('OBJETIVO', {
            x: 0.5, y: 0.5, w: 12, h: 1,
            fontSize: 32, color: C.a1, bold: true
        });
        
        s.addText(projeto.objetivo || 'Descreva o objetivo...', {
            x: 0.5, y: 1.5, w: 12, h: 5,
            fontSize: 18, color: C.txt
        });
    }

    // Implemente os outros métodos obrigatórios...
    // (por enquanto, pode deixar vazios ou com implementação básica)
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
