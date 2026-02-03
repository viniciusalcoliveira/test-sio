// Configuração do Telefone da Loja (APENAS NÚMEROS)
const PHONE_NUMBER = "5598984609395"; 

// --- FUNÇÃO DE FILTRO EM TEMPO REAL ---
// Filtra por nome, combustível e câmbio simultaneamente
function filtrarEstoque() {
    const nomeInput = document.getElementById('filter-name').value.toLowerCase();
    const fuelSelect = document.getElementById('filter-fuel').value;
    const gearSelect = document.getElementById('filter-gear').value;
    
    const cards = document.querySelectorAll('.card-veiculo');
    let encontrou = false;

    cards.forEach(card => {
        const nome = card.getAttribute('data-nome').toLowerCase();
        const fuel = card.getAttribute('data-combustivel');
        const gear = card.getAttribute('data-cambio');

        const bateNome = nome.includes(nomeInput);
        const bateFuel = fuelSelect === "" || fuel === fuelSelect;
        const bateGear = gearSelect === "" || gear === gearSelect;

        if (bateNome && bateFuel && bateGear) {
            card.style.display = "block";
            encontrou = true;
        } else {
            card.style.display = "none";
        }
    });

    const noResults = document.getElementById('no-results');
    if(noResults) noResults.style.display = encontrou ? "none" : "block";
}

function limparFiltros() {
    document.getElementById('filter-name').value = "";
    document.getElementById('filter-fuel').value = "";
    document.getElementById('filter-gear').value = "";
    filtrarEstoque();
}

// --- FUNÇÕES DO MODAL DE AVALIAÇÃO ---
function abrirModal() {
    const modal = document.getElementById("modalAvaliacao");
    modal.style.display = "flex";
    // Foca no primeiro campo após abrir
    setTimeout(() => document.getElementById("nomeCliente").focus(), 100);
}

function fecharModal() {
    document.getElementById("modalAvaliacao").style.display = "none";
    document.getElementById("formAvaliacao").reset();
}

// Fechar modal ao clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById("modalAvaliacao");
    if (event.target == modal) {
        fecharModal();
    }
}

// --- ENVIO DA AVALIAÇÃO VIA WHATSAPP ---
function enviarAvaliacao(event) {
    event.preventDefault();

    // Pegando os valores dos campos
    const nome = document.getElementById("nomeCliente").value;
    const telefone = document.getElementById("telCliente").value;
    const marca = document.getElementById("marcaCarro").value;
    const modelo = document.getElementById("modeloCarro").value;
    const ano = document.getElementById("anoCarro").value;
    const msg = document.getElementById("msgCarro").value;

    // Criando a mensagem formatada
    const texto = `*Olá! Gostaria de avaliar meu veículo na Sio Veículos.*\n\n` +
                  `👤 *Nome:* ${nome}\n` +
                  `📱 *Telefone:* ${telefone}\n` +
                  `🚗 *Veículo:* ${marca} ${modelo}\n` +
                  `📅 *Ano:* ${ano}\n` +
                  `📝 *Obs:* ${msg ? msg : 'Nenhuma observação.'}`;

    // Codifica para URL e abre o WhatsApp
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
    
    fecharModal();
}

// --- FUNÇÕES DE DETALHES E CARROSSEL ---

function interessadoZap(nomeCarro) {
    const texto = `Olá! Vi o *${nomeCarro}* no site da Sio Veículos e gostaria de mais informações.`;
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
}

function trocarFotoPrincipal(imgElement) {
    // Troca o src da imagem grande
    document.getElementById('foto-principal').src = imgElement.src;
    
    // Remove classe 'active' de todas as miniaturas e adiciona na clicada
    document.querySelectorAll('.miniaturas-grid img').forEach(img => {
        img.classList.remove('active-thumb');
    });
    imgElement.classList.add('active-thumb');
}

// Carregar Dados na página detalhes.html
function carregarDetalhes() {
    const parametros = new URLSearchParams(window.location.search);
    const carroId = parametros.get('carro');

    if (carroId && dadosCarros[carroId]) {
        const carro = dadosCarros[carroId];
        
        // Atualiza Textos
        document.getElementById('car-name').innerText = carro.nome;
        document.title = `${carro.nome} | Sio Veículos`;
        document.querySelector('.subtitulo-carro').innerText = `Ano ${carro.ano} | ${carro.km} km`;
        document.querySelector('.preco-destaque').innerText = carro.preco;
        document.querySelector('.descricao-veiculo p').innerText = carro.descricao;

        // Atualiza Ficha Técnica
        const listaFicha = document.querySelector('.ficha-tecnica ul');
        listaFicha.innerHTML = `
            <li><span><i class="fa-solid fa-calendar-days"></i> Ano:</span> ${carro.ano}</li>
            <li><span><i class="fa-solid fa-road"></i> Km:</span> ${carro.km}</li>
            <li><span><i class="fa-solid fa-gear"></i> Câmbio:</span> ${carro.cambio}</li>
            <li><span><i class="fa-solid fa-gas-pump"></i> Combustível:</span> ${carro.combustivel}</li>
            <li><span><i class="fa-solid fa-palette"></i> Cor:</span> ${carro.cor}</li>
            <li><span><i class="fa-solid fa-car"></i> Carroceria:</span> ${carro.carroceria}</li>
        `;

        // Carrega Foto Principal
        const fotoPrincipal = document.getElementById('foto-principal');
        fotoPrincipal.src = carro.fotos[0];

        // Carrega Miniaturas
        const miniaturasGrid = document.querySelector('.miniaturas-grid');
        miniaturasGrid.innerHTML = ''; 
        
        carro.fotos.forEach((foto, index) => {
            const img = document.createElement('img');
            img.src = foto;
            img.alt = carro.nome;
            img.onclick = function() { trocarFotoPrincipal(this); };
            if (index === 0) img.classList.add('active-thumb');
            miniaturasGrid.appendChild(img);
        });

        // Atualiza botão de contato com o nome do carro
        const btnZapDetalhes = document.querySelector('.btn-contato-zap');
        if(btnZapDetalhes) {
            btnZapDetalhes.onclick = () => interessadoZap(carro.nome);
        }
    }
}

// Verifica qual página está para rodar a função certa
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('detalhes.html')) {
        carregarDetalhes();
    }
});
