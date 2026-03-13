// js/models/index.js
// MANUAL - você escreve uma única vez

export const MODELOS = {
    classico: () => import('./classico.js'),
    moderno: () => import('./moderno.js'),
    minimalista: () => import('./minimalista.js'),
    // Quando criar novo modelo, adicione aqui manualmente
    // startup: () => import('./startup.js'),
};

export async function carregarModelo(nome) {
    try {
        if (!MODELOS[nome]) {
            throw new Error(`Modelo "${nome}" não encontrado`);
        }
        const modulo = await MODELOS[nome]();
        const ModeloClass = Object.values(modulo)[0];
        return new ModeloClass();
    } catch (error) {
        console.error(`❌ Erro ao carregar modelo ${nome}:`, error);
        throw error;
    }
}

export const MODELOS_DISPONIVEIS = ['classico', 'moderno', 'minimalista'];
