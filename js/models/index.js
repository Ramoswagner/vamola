// js/models/index.js
// ⚠️ GERADO AUTOMATICAMENTE - NÃO EDITE MANUALMENTE ⚠️
// Use o script generate-index.py para atualizar

// APENAS PROMESSAS - NADA É CARREGADO AINDA!
export const MODELOS = {
    classico: () => import('./classico.js'),
    moderno: () => import('./moderno.js'),
    minimalista: () => import('./minimalista.js'),
    // Adicione novos modelos aqui seguindo o padrão:
    // nome: () => import('./nome.js'),
};

/**
 * Carrega um modelo dinamicamente (lazy loading)
 * @param {string} nome - Nome do modelo (ex: 'classico', 'moderno')
 * @returns {Promise<ModeloBase>} Instância do modelo carregado
 */
export async function carregarModelo(nome) {
    try {
        // Verifica se o modelo existe
        if (!MODELOS[nome]) {
            throw new Error(`Modelo "${nome}" não encontrado`);
        }
        
        // CARREGA O ARQUIVO SOMENTE AGORA! ⭐
        const modulo = await MODELOS[nome]();
        
        // Pega a PRIMEIRA classe exportada do módulo
        // (assume que cada arquivo exporta uma única classe)
        const ModeloClass = Object.values(modulo)[0];
        
        // Retorna uma instância do modelo
        return new ModeloClass();
        
    } catch (error) {
        console.error(`❌ Erro ao carregar modelo ${nome}:`, error);
        throw error; // Propaga o erro para quem chamou
    }
}

/**
 * Carrega múltiplos modelos de uma vez (caso necessário)
 * @param {string[]} nomes - Array com nomes dos modelos
 * @returns {Promise<Object>} Objeto com modelos carregados
 */
export async function carregarMultiplosModelos(nomes) {
    const promessas = nomes.map(async nome => {
        const modelo = await carregarModelo(nome);
        return [nome, modelo];
    });
    
    const resultados = await Promise.all(promessas);
    return Object.fromEntries(resultados);
}

/**
 * Pré-carrega um modelo em background (opcional)
 * @param {string} nome - Nome do modelo para pré-carregar
 */
export function preCarregarModelo(nome) {
    if (MODELOS[nome]) {
        // Inicia o carregamento mas não espera
        MODELOS[nome]().then(modulo => {
            console.log(`✅ Modelo ${nome} pré-carregado em background`);
        }).catch(err => {
            console.warn(`⚠️ Falha no pré-carregamento de ${nome}:`, err);
        });
    }
}

// Para debugging - lista todos os modelos disponíveis
export const MODELOS_DISPONIVEIS = Object.keys(MODELOS);

console.log(`📦 Modelos disponíveis: ${MODELOS_DISPONIVEIS.join(', ')}`);
