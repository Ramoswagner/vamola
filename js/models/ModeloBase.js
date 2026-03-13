// js/models/ModeloBase.js
export class ModeloBase {
    constructor(nome, descricao) {
        this.nome = nome;
        this.descricao = descricao;
    }

    // Métodos obrigatórios - TODOS os modelos devem implementar
    gerarSlideCapa(pres, G, T) {
        throw new Error('Implemente gerarSlideCapa');
    }

    gerarSlideSumario(pres, G, T) {
        throw new Error('Implemente gerarSlideSumario');
    }

    gerarSlidePanorama(pres, G, T) {
        throw new Error('Implemente gerarSlidePanorama');
    }

    gerarSlideDivisor(pres, projeto, G, T, indice) {
        throw new Error('Implemente gerarSlideDivisor');
    }

    gerarSlideObjetivo(pres, projeto, C) {
        throw new Error('Implemente gerarSlideObjetivo');
    }

    gerarSlideEquipe(pres, projeto, C) {
        throw new Error('Implemente gerarSlideEquipe');
    }

    gerarSlideEtapas(pres, projeto, C) {
        throw new Error('Implemente gerarSlideEtapas');
    }

    gerarSlideMarcos(pres, projeto, C) {
        throw new Error('Implemente gerarSlideMarcos');
    }

    gerarSlideIndicadores(pres, projeto, C) {
        throw new Error('Implemente gerarSlideIndicadores');
    }

    gerarSlideResultados(pres, projeto, C) {
        throw new Error('Implemente gerarSlideResultados');
    }

    gerarSlideAntesDepois(pres, projeto, C) {
        throw new Error('Implemente gerarSlideAntesDepois');
    }

    gerarSlideEvidencias(pres, projeto, C) {
        throw new Error('Implemente gerarSlideEvidencias');
    }

    gerarSlideRiscos(pres, projeto, C) {
        throw new Error('Implemente gerarSlideRiscos');
    }

    gerarSlideLicoes(pres, projeto, C) {
        throw new Error('Implemente gerarSlideLicoes');
    }

    gerarSlideDesafios(pres, projeto, C) {
        throw new Error('Implemente gerarSlideDesafios');
    }

    gerarSlideEncerramento(pres, G, T) {
        throw new Error('Implemente gerarSlideEncerramento');
    }
}
