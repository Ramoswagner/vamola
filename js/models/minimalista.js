// js/models/minimalista.js
import { ModeloBase } from './ModeloBase.js';

export class ModeloMinimalista extends ModeloBase {
    constructor() {
        super('Minimalista Clean', 'Layout limpo com muito espaço em branco');
    }

    gerarSlideCapa(pres, G, T) {
        const s = pres.addSlide();
        s.background = { fill: `#${T.C.bg}` };
        
        s.addText(G.id.presTitle || 'Título', {
            x: 1.0, y: 3.0, w: 11, h: 2,
            fontSize: 48, color: T.C.txt, align: 'center'
        });
        
        s.addText(G.id.instName || 'Instituição', {
            x: 1.0, y: 5.5, w: 11, h: 0.8,
            fontSize: 16, color: T.C.muted, align: 'center'
        });
    }

    gerarSlideObjetivo(pres, projeto, C) {
        const s = pres.addSlide();
        s.background = { fill: `#${C.bg}` };
        
        s.addText(projeto.objetivo || 'Objetivo...', {
            x: 1.5, y: 2.5, w: 10, h: 4,
            fontSize: 24, color: C.txt, align: 'center'
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
