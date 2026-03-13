// js/models/moderno.js
import { ModeloBase } from './ModeloBase.js';

export class ModeloModerno extends ModeloBase {
    constructor() {
        super('Moderno Dashboard', 'Layout com cards, gradientes e elementos visuais destacados');
    }

    gerarSlideCapa(pres, G, T) {
        const s = pres.addSlide();
        const C = T.C;
        
        // Fundo gradiente
        s.background = { 
            fill: { 
                type: 'gradient',
                color1: `#${C.bg}`,
                color2: `#${C.a1}`,
                angle: 135
            } 
        };
        
        // Título em destaque
        s.addText(G.id.presTitle || 'Título', {
            x: 2.0, y: 2.5, w: 9, h: 2.5,
            fontSize: 56, color: 'FFFFFF', bold: true,
            align: 'center', fontFace: 'Calibri'
        });
        
        // Card para instituição
        s.addShape(pres.ShapeType.ROUNDED_RECTANGLE, {
            x: 4.5, y: 5.0, w: 4, h: 1.2,
            fill: { color: 'FFFFFF', transparency: 20 },
            rectRadius: 0.3
        });
        
        s.addText(G.id.instName || 'Instituição', {
            x: 4.5, y: 5.3, w: 4, h: 0.8,
            fontSize: 18, color: C.txt, bold: true,
            align: 'center'
        });
        
        // Data
        if (G.id.presDate) {
            s.addText(G.id.presDate, {
                x: 5.5, y: 6.3, w: 2, h: 0.5,
                fontSize: 14, color: 'FFFFFF',
                align: 'center'
            });
        }
    }

    gerarSlideDivisor(pres, projeto, G, T, indice) {
        const s = pres.addSlide();
        const C = T.C;
        
        s.background = { 
            fill: { 
                type: 'gradient',
                color1: `#${C.bg2}`,
                color2: projeto.color || C.a1,
                angle: 90
            } 
        };
        
        // Número grande
        s.addText(`${String(indice + 1).padStart(2, '0')}`, {
            x: 2.0, y: 1.5, w: 9, h: 3,
            fontSize: 120, color: 'FFFFFF', bold: true,
            align: 'center', transparency: 80
        });
        
        // Nome do projeto
        s.addText(projeto.name || 'Projeto', {
            x: 2.0, y: 3.5, w: 9, h: 1.5,
            fontSize: 48, color: 'FFFFFF', bold: true,
            align: 'center'
        });
        
        // Card com informações
        s.addShape(pres.ShapeType.ROUNDED_RECTANGLE, {
            x: 3.0, y: 5.0, w: 7, h: 1.5,
            fill: { color: 'FFFFFF', transparency: 15 },
            rectRadius: 0.2
        });
        
        s.addText(projeto.leader ? `Líder: ${projeto.leader}` : 'Sem líder definido', {
            x: 3.2, y: 5.3, w: 6.6, h: 0.5,
            fontSize: 16, color: C.txt, align: 'center'
        });
    }

    gerarSlideObjetivo(pres, projeto, C) {
        const s = pres.addSlide();
        s.background = { fill: `#${C.bg}` };
        
        // Card de título
        s.addShape(pres.ShapeType.ROUNDED_RECTANGLE, {
            x: 0.5, y: 0.5, w: 5, h: 1,
            fill: { color: C.a2 },
            rectRadius: 0.3
        });
        
        s.addText('OBJETIVO', {
            x: 0.8, y: 0.7, w: 4, h: 0.6,
            fontSize: 24, color: 'FFFFFF', bold: true
        });
        
        // Card de conteúdo
        s.addShape(pres.ShapeType.ROUNDED_RECTANGLE, {
            x: 0.5, y: 1.8, w: 12, h: 5,
            fill: { color: C.bg2 },
            line: { color: C.a1, width: 2 },
            rectRadius: 0.3
        });
        
        s.addText(projeto.objetivo || 'Descreva o objetivo do projeto...', {
            x: 1.0, y: 2.2, w: 11, h: 4.5,
            fontSize: 20, color: C.txt,
            fontFace: 'Calibri Light',
            bullet: true
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
