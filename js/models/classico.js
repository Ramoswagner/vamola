// js/models/classico.js
import { ModeloBase } from './ModeloBase.js';

export class ModeloClassico extends ModeloBase {
    constructor() {
        super('Clássico Corporativo', 'Layout tradicional com barras laterais');
    }

    gerarSlideCapa(pres, G, T) {
        const s = pres.addSlide();
        s.background = { fill: `#${T.C.bg}` };
        
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

    gerarSlideDivisor(pres, projeto, G, T, indice) {
        const s = pres.addSlide();
        s.background = { fill: `#${T.C.bg2}` };
        
        s.addText(`PROJETO ${String(indice + 1).padStart(2, '0')}`, {
            x: 0.5, y: 2.0, w: 12, h: 1,
            fontSize: 24, color: T.C.muted
        });
        
        s.addText(projeto.name || 'Projeto', {
            x: 0.5, y: 3.0, w: 12, h: 2,
            fontSize: 48, color: T.C.txt, bold: true
        });
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

    // TODOS OS MÉTODOS OBRIGATÓRIOS (mesmo que vazios)
    gerarSlideSumario(pres, G, T) {
        const s = pres.addSlide();
        s.background = { fill: `#${T.C.bg}` };
        s.addText('SUMÁRIO', { x: 0.5, y: 0.5, w: 12, h: 1, fontSize: 32, color: T.C.a1 });
    }
    
    gerarSlidePanorama(pres, G, T) {
        const s = pres.addSlide();
        s.background = { fill: `#${T.C.bg}` };
        s.addText('PANORAMA', { x: 0.5, y: 0.5, w: 12, h: 1, fontSize: 32, color: T.C.a1 });
    }
    
    gerarSlideEquipe(pres, projeto, C) {
        const s = pres.addSlide();
        s.background = { fill: `#${C.bg}` };
        s.addText('EQUIPE', { x: 0.5, y: 0.5, w: 12, h: 1, fontSize: 32, color: C.a1 });
    }
    
    gerarSlideEtapas(pres, projeto, C) {
        const s = pres.addSlide();
        s.background = { fill: `#${C.bg}` };
        s.addText('ETAPAS', { x: 0.5, y: 0.5, w: 12, h: 1, fontSize: 32, color: C.a1 });
    }
    
    gerarSlideMarcos(pres, projeto, C) {
        const s = pres.addSlide();
        s.background = { fill: `#${C.bg}` };
        s.addText('MARCOS', { x: 0.5, y: 0.5, w: 12, h: 1, fontSize: 32, color: C.a1 });
    }
    
    gerarSlideIndicadores(pres, projeto, C) {
        const s = pres.addSlide();
        s.background = { fill: `#${C.bg}` };
        s.addText('INDICADORES', { x: 0.5, y: 0.5, w: 12, h: 1, fontSize: 32, color: C.a1 });
    }
    
    gerarSlideResultados(pres, projeto, C) {
        const s = pres.addSlide();
        s.background = { fill: `#${C.bg}` };
        s.addText('RESULTADOS', { x: 0.5, y: 0.5, w: 12, h: 1, fontSize: 32, color: C.a1 });
    }
    
    gerarSlideAntesDepois(pres, projeto, C) {
        const s = pres.addSlide();
        s.background = { fill: `#${C.bg}` };
        s.addText('ANTES & DEPOIS', { x: 0.5, y: 0.5, w: 12, h: 1, fontSize: 32, color: C.a1 });
    }
    
    gerarSlideEvidencias(pres, projeto, C) {
        const s = pres.addSlide();
        s.background = { fill: `#${C.bg}` };
        s.addText('EVIDÊNCIAS', { x: 0.5, y: 0.5, w: 12, h: 1, fontSize: 32, color: C.a1 });
    }
    
    gerarSlideRiscos(pres, projeto, C) {
        const s = pres.addSlide();
        s.background = { fill: `#${C.bg}` };
        s.addText('RISCOS', { x: 0.5, y: 0.5, w: 12, h: 1, fontSize: 32, color: C.a1 });
    }
    
    gerarSlideLicoes(pres, projeto, C) {
        const s = pres.addSlide();
        s.background = { fill: `#${C.bg}` };
        s.addText('LIÇÕES', { x: 0.5, y: 0.5, w: 12, h: 1, fontSize: 32, color: C.a1 });
    }
    
    gerarSlideDesafios(pres, projeto, C) {
        const s = pres.addSlide();
        s.background = { fill: `#${C.bg}` };
        s.addText('DESAFIOS', { x: 0.5, y: 0.5, w: 12, h: 1, fontSize: 32, color: C.a1 });
    }
    
    gerarSlideEncerramento(pres, G, T) {
        const s = pres.addSlide();
        s.background = { fill: `#${T.C.bg}` };
        s.addText('OBRIGADO', { x: 0.5, y: 3.0, w: 12, h: 2, fontSize: 48, color: T.C.txt, align: 'center' });
    }
}
