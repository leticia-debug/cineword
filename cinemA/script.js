const precoIngresso = 25.00;
let ingressosSelecionados = 0;
let diaTextoSelecionado = "Hoje (19)";
let assentosEscolhidosIDs = []; // Guarda os nomes das poltronas (Ex: A-04, B-18)

// Lista de fileiras de A até R
const letrasFileiras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'];

// Simulação de cadeiras ocupadas de forma aleatória em posições estruturadas
const assentosOcupadosSugeridos = ['A-05', 'B-12', 'C-19', 'E-02', 'F-15', 'H-08', 'K-20', 'M-04', 'P-11', 'R-17'];

// Elementos da Interface
const container = document.getElementById('mainContainer');
const paginaFilme = document.getElementById('paginaFilme');
const paginaAssentos = document.getElementById('paginaAssentos');
const sessaoSelecionadaEl = document.getElementById('sessaoSelecionada');
const dataSelecionadaEl = document.getElementById('dataSelecionada');

const mapaAssentos = document.getElementById('mapaAssentos');
const qtdIngressosEl = document.getElementById('qtdIngressos');
const valorTotalEl = document.getElementById('valorTotal');
const btnComprar = document.getElementById('btnComprar');

// Função para mudar a cor do dia clicado e guardar o dia ativo
function selecionarDia(elemento, nomeDia) {
    const botoes = document.querySelectorAll('.btn-dia');
    botoes.forEach(b => b.classList.remove('ativo'));
    
    elemento.classList.add('ativo');
    
    const numeroDia = elemento.querySelector('span').innerText;
    diaTextoSelecionado = `${nomeDia} (${numeroDia})`;
}

// Cria o mapa de poltronas completo com a regra de layout e corredores
function inicializarMapa() {
    mapaAssentos.innerHTML = ''; 

    letrasFileiras.forEach(letra => {
        const divLetra = document.createElement('div');
        divLetra.classList.add('letra-fileira');
        divLetra.innerText = letra;
        mapaAssentos.appendChild(divLetra);

        // --- BLOCO ESQUERDA (18, 19, 20) ---
        for (let c = 18; c <= 20; c++) {
            criarBotaoAssento(letra, c);
        }

        // ESPAÇO CORREDOR 1
        const corridor1 = document.createElement('div');
        corridor1.classList.add('corredor');
        mapaAssentos.appendChild(corridor1);

        // --- BLOCO CENTRAL (17 decrescendo até 4) ---
        for (let c = 17; c >= 4; c--) {
            criarBotaoAssento(letra, c);
        }

        // ESPAÇO CORREDOR 2
        const corridor2 = document.createElement('div');
        corridor2.classList.add('corredor');
        mapaAssentos.appendChild(corridor2);

        // --- BLOCO DIREITA (3 decrescendo até 1) ---
        for (let c = 3; c >= 1; c--) {
            criarBotaoAssento(letra, c);
        }
    });
}

// Cria uma poltrona individual e vincula os eventos
function criarBotaoAssento(letra, numero) {
    const numFormatado = numero < 10 ? '0' + numero : numero;
    const idAssento = `${letra}-${numFormatado}`;

    const botao = document.createElement('button');
    botao.classList.add('assento');
    botao.innerText = numFormatado;
    botao.setAttribute('data-id', idAssento);

    if (assentosOcupadosSugeridos.includes(idAssento)) {
        botao.classList.add('ocupado');
    } else {
        botao.addEventListener('click', () => {
            // Se o assento já estava selecionado, removemos. Caso contrário, adicionamos.
            if (botao.classList.contains('selecionado')) {
                assentosEscolhidosIDs = assentosEscolhidosIDs.filter(id => id !== idAssento);
            } else {
                assentosEscolhidosIDs.push(idAssento);
            }
            alternarAssento(botao);
        });
    }

    mapaAssentos.appendChild(botao);
}

// Navegação: Vai para a tela de assentos
function irParaAssentos(horario, sala) {
    sessaoSelecionadaEl.innerText = `${horario} - ${sala}`;
    dataSelecionadaEl.innerText = diaTextoSelecionado;
    
    container.classList.add('expandido');
    paginaFilme.classList.add('hidden');
    paginaAssentos.classList.remove('hidden');
    
    resetarSelecao();
    inicializarMapa();
}

// Navegação: Volta para a tela do filme
function irParaFilme() {
    container.classList.remove('expandido');
    paginaAssentos.classList.add('hidden');
    paginaFilme.classList.remove('hidden');
}

// Gerencia a seleção e desmarcação visual dos assentos
function alternarAssento(elemento) {
    if (elemento.classList.contains('selecionado')) {
        elemento.classList.remove('selecionado');
        ingressosSelecionados--;
    } else {
        elemento.classList.add('selecionado');
        ingressosSelecionados++;
    }
    atualizarResumo();
}

// Atualiza o painel inferior e gerencia se o botão de compra fica ativo ou não
function atualizarResumo() {
    const valorTotal = ingressosSelecionados * precoIngresso;
    qtdIngressosEl.innerText = ingressosSelecionados;
    valorTotalEl.innerText = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;

    // Ativa o botão apenas se houver ingressos selecionados
    if (ingressosSelecionados > 0) {
        btnComprar.removeAttribute('disabled');
    } else {
        btnComprar.setAttribute('disabled', 'true');
    }
}

// Ação de finalização ao clicar no botão Confirmar e Comprar
function finalizarCompra() {
    const totalFormatado = (ingressosSelecionados * precoIngresso).toFixed(2).replace('.', ',');
    const listaPoltronas = assentosEscolhidosIDs.sort().join(', ');

    // Exibe um resumo profissional da compra fictícia
    alert(
        `🎟️ COMPRA REALIZADA COM SUCESSO!\n\n` +
        `Cinema: CineWord\n` +
        `Filme: Verity\n` +
        `Data: ${diaTextoSelecionado}\n` +
        `Sessão: ${sessaoSelecionadaEl.innerText}\n` +
        `Poltronas: [ ${listaPoltronas} ]\n` +
        `Quantidade: ${ingressosSelecionados} ingresso(s)\n` +
        `Valor Total: R$ ${totalFormatado}\n\n` +
        `Bom filme!`
    );

    // Adiciona os assentos comprados à lista de ocupados permanentes nesta execução
    assentosOcupadosSugeridos.push(...assentosEscolhidosIDs);

    // Volta para a tela inicial do filme
    irParaFilme();
}

function resetarSelecao() {
    ingressosSelecionados = 0;
    assentosEscolhidosIDs = [];
    atualizarResumo();
}
