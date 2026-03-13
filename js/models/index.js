// js/models/index.js
// Cria instâncias dos modelos para uso global
const modelos = {
    classico: new ModeloClassico(),
    moderno: new ModeloModerno(),
    minimalista: new ModeloMinimalista()
};

// Se precisar que o objeto seja acessível em outros arquivos, ele está no escopo global (window)
// O main.js pode acessar diretamente a variável 'modelos'
