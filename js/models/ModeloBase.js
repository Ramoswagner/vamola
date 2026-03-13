// js/models/ModeloBase.js
class ModeloBase {
    constructor(nome, corFundo, corTexto, classeCSS) {
        this.nome = nome;
        this.corFundo = corFundo;
        this.corTexto = corTexto;
        this.classeCSS = classeCSS;
    }

    aplicar() {
        // Método base que pode ser sobrescrito
        console.log(`Aplicando modelo: ${this.nome}`);
    }
}
