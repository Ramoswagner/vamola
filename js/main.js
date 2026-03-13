console.log('✅ main.js carregado (teste)');

window.startBuilder = function() {
    console.log('startBuilder chamado');
    document.getElementById('splash').classList.remove('active');
    document.getElementById('builder').classList.add('active');
};

window.goStep = function(step) {
    console.log('goStep', step);
};

// Funções vazias para evitar erros de "is not defined"
window.selectMode = function() {};
window.backToSplash = function() {};
window.selectTheme = function() {};
window.toggleBlock = function() {};
window.addProject = function() {};
window.removeProject = function() {};
window.selectProj = function() {};
window.triggerUp = function() {};
window.handleLogo = function() {};
window.rmLogo = function() {};
window.handleGlobal = function() {};
window.rmGlobal = function() {};
window.handleEvImg = function() {};
window.rmEvImg = function() {};
window.handleBAImg = function() {};
window.rmBAImg = function() {};
window.pset = function() {};
window.psetD = function() {};
window.psetR = function() {};
window.saveDraft = function() {};
window.generatePptx = function() { alert('Gerar PPTX (teste)'); };
